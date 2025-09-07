import OpenAI from "openai";
import fs from "fs";
import path from "path";
import * as XLSX from 'xlsx';

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ReportAnalysis {
  overallScore: number; // 0-100
  readinessLevel: 'needs-major-improvements' | 'needs-minor-improvements' | 'good' | 'excellent';
  overallFeedback: string;
  sectionAnalysis: {
    section: string;
    score: number;
    issues: string[];
    suggestions: string[];
  }[];
  strengthsIdentified: string[];
  priorityImprovements: string[];
}

export class AIReportReviewer {
  private async parseFileContent(filePath: string, fileType: string): Promise<string> {
    try {
      // Handle both full paths and relative paths
      let fullPath = filePath;
      if (!filePath.startsWith('/')) {
        fullPath = path.join(process.cwd(), 'uploads', filePath);
      }
      
      console.log('Attempting to parse file:', fullPath);
      if (!fs.existsSync(fullPath)) {
        console.error('File not found:', fullPath);
        return `File not found: ${filePath}`;
      }

      // Parse different file types
      if (fileType.includes('pdf')) {
        return `PDF File attached: ${filePath} (PDF parsing temporarily disabled)`;
      } else if (fileType.includes('text') || fileType.includes('txt')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        return `Text File Content:\n${content.slice(0, 5000)}`;
      } else if (fileType.includes('csv')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const lines = content.split('\n').slice(0, 50); // First 50 rows
        return `CSV File Content (first 50 rows):\n${lines.join('\n')}`;
      } else if (fileType.includes('excel') || fileType.includes('spreadsheet') || 
                 filePath.endsWith('.xlsx') || filePath.endsWith('.xls')) {
        const workbook = XLSX.readFile(fullPath);
        const sheetNames = workbook.SheetNames;
        let content = `Excel File Content (${sheetNames.length} sheets):\n`;
        
        // Parse first sheet
        if (sheetNames.length > 0) {
          const worksheet = workbook.Sheets[sheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const rows = jsonData.slice(0, 20); // First 20 rows
          content += `Sheet "${sheetNames[0]}" (first 20 rows):\n`;
          content += rows.map(row => (row as any[]).join('\t')).join('\n');
        }
        
        return content.slice(0, 5000);
      } else if (fileType.includes('json')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        try {
          const jsonData = JSON.parse(content);
          return `JSON File Content:\n${JSON.stringify(jsonData, null, 2).slice(0, 5000)}`;
        } catch {
          return `JSON File Content (raw):\n${content.slice(0, 5000)}`;
        }
      } else if (fileType.includes('xml')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        return `XML File Content:\n${content.slice(0, 5000)}`;
      } else if (fileType.includes('image')) {
        return `Image file attached: ${filePath} (visual content not analyzed)`;
      } else {
        // Try to read as text for any other file type
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          return `File Content (${fileType}):\n${content.slice(0, 3000)}`;
        } catch {
          return `File attached: ${filePath} (content type: ${fileType}, binary file not parsed)`;
        }
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      return `Error reading file: ${filePath}`;
    }
  }

  async analyzeReport(reportData: {
    title: string;
    content: string;
    projectName: string;
    projectDescription?: string;
    projectGoals?: string;
    projectBudget?: number;
    projectStatus?: string;
    hasAttachments?: boolean;
    attachmentCount?: number;
    attachmentTypes?: string[];
    attachmentPaths?: string[];
    attachmentContents?: string;
    progress?: number;
    challengesFaced?: string;
    nextSteps?: string;
    budgetNotes?: string;
  }): Promise<ReportAnalysis> {
    try {
      console.log('AI Analysis request:', reportData);

      // Parse file contents if attachments exist and not already provided
      let attachmentContents = reportData.attachmentContents || '';
      if (!attachmentContents && reportData.hasAttachments && reportData.attachmentPaths && reportData.attachmentTypes) {
        console.log('Parsing attached files...');
        const contentPromises = reportData.attachmentPaths.map((filePath, index) => 
          this.parseFileContent(filePath, reportData.attachmentTypes![index])
        );
        const contents = await Promise.all(contentPromises);
        attachmentContents = contents.join('\n\n---\n\n');
        console.log('Parsed attachment contents length:', attachmentContents.length);
      }

      const analysisPrompt = this.buildAnalysisPrompt({
        ...reportData,
        attachmentContents
      });
      
      console.log('Calling OpenAI API with model gpt-4o...');
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert NGO project management consultant. Always respond with valid JSON in the exact format requested."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 2000,
      });

      console.log('OpenAI response received, parsing...');
      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      console.log('Analysis parsed successfully:', analysis);
      
      const validatedAnalysis = this.validateAndFormatAnalysis(analysis);
      console.log('Analysis validated:', validatedAnalysis);
      
      return validatedAnalysis;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      const errorName = error instanceof Error ? error.name : 'Unknown';
      
      console.error('AI Report Analysis Error Details:', {
        message: errorMessage,
        stack: errorStack,
        name: errorName,
        apiKeyExists: !!process.env.OPENAI_API_KEY
      });
      throw new Error(`Failed to analyze report: ${errorMessage}`);
    }
  }

  private buildAnalysisPrompt(reportData: any): string {
    const attachmentInfo = reportData.hasAttachments ? 
      `\nATTACHMENTS: ${reportData.attachmentCount} files (${reportData.attachmentTypes?.join(', ') || 'various types'})` : 
      '\nATTACHMENTS: None provided';

    return `
Analyze this NGO progress report and provide detailed feedback in JSON format:

**Project Context:**
- Project Name: ${reportData.projectName}
- Project Description: ${reportData.projectDescription || 'Not provided'}
- Project Goals: ${reportData.projectGoals || 'Not provided'}
- Project Budget: ${reportData.projectBudget ? `$${reportData.projectBudget}` : 'Not specified'}
- Project Status: ${reportData.projectStatus || 'Active'}

**Report Details:**
- Title: ${reportData.title}
- Content: ${reportData.content}

${reportData.attachmentContents ? `**Attachment Contents:**
${reportData.attachmentContents}` : ''}

**Attachments:** ${reportData.hasAttachments ? 
      `${reportData.attachmentCount} files attached (${reportData.attachmentTypes?.join(', ')})` : 
      'No attachments'}
- Progress: ${reportData.progress || 'Not specified'}%
- Challenges: ${reportData.challengesFaced || 'Not provided'}
- Next Steps: ${reportData.nextSteps || 'Not provided'}
- Budget Notes: ${reportData.budgetNotes || 'Not provided'}

**Analysis Requirements:**
Evaluate the report on these criteria:
1. **Clarity**: Is the language clear, professional, and easy to understand?
2. **Completeness**: Are all sections adequately detailed with specific information?
3. **Specificity**: Does it include concrete details, metrics, dates, and quantifiable outcomes?
4. **Evidence**: Are there supporting attachments and documentation?
5. **Alignment**: Does the report align with stated project goals and objectives?
6. **Actionability**: Are next steps and challenges clearly defined with solutions?
7. **Impact**: Does it demonstrate measurable project impact and outcomes?
8. **Professional Standards**: Does it meet NGO reporting best practices?

**Attachment Assessment:**
${reportData.hasAttachments ? 
  `Consider if the ${reportData.attachmentCount} attachment(s) likely provide adequate supporting evidence. Visual documentation (images) and detailed documentation (PDFs) enhance credibility when appropriate for the content type.` :
  `Note the absence of supporting attachments and suggest when visual evidence or documentation would strengthen the report.`}

**Response Format (JSON):**
{
  "overallScore": <number 0-100>,
  "readinessLevel": "<needs-major-improvements|needs-minor-improvements|good|excellent>",
  "overallFeedback": "<detailed assessment including attachment evaluation>",
  "sectionAnalysis": [
    {
      "section": "<section name>",
      "score": <0-100>,
      "issues": ["<specific issue 1>", "<specific issue 2>"],
      "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>"]
    }
  ],
  "strengthsIdentified": ["<strength 1>", "<strength 2>"],
  "priorityImprovements": ["<high priority improvement 1>", "<high priority improvement 2>"]
}

**Guidelines:**
- Be constructive and encouraging
- Provide specific, actionable suggestions
- Identify at least 2-3 strengths
- Flag vague language and suggest concrete alternatives
- Recommend quantitative details where missing
- Consider project context and goals in evaluation
- Assess if attachments enhance or are needed for the report
`;
  }

  private validateAndFormatAnalysis(analysis: any): ReportAnalysis {
    return {
      overallScore: Math.max(0, Math.min(100, analysis.overallScore || 0)),
      readinessLevel: analysis.readinessLevel || 'needs-major-improvements',
      overallFeedback: analysis.overallFeedback || 'Analysis unavailable',
      sectionAnalysis: Array.isArray(analysis.sectionAnalysis) ? analysis.sectionAnalysis : [],
      strengthsIdentified: Array.isArray(analysis.strengthsIdentified) ? analysis.strengthsIdentified : [],
      priorityImprovements: Array.isArray(analysis.priorityImprovements) ? analysis.priorityImprovements : []
    };
  }

  getReadinessMessage(level: string): string {
    switch (level) {
      case 'excellent':
        return 'Report is comprehensive and ready for submission!';
      case 'good':
        return 'Report is solid with minor areas for enhancement.';
      case 'needs-minor-improvements':
        return 'Report needs some refinements before submission.';
      case 'needs-major-improvements':
        return 'Report requires significant improvements before submission.';
      default:
        return 'Report analysis completed.';
    }
  }

  getScoreColor(score: number): string {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }

  getReadinessColor(level: string): string {
    switch (level) {
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs-minor-improvements':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'needs-major-improvements':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}

export const aiReportReviewer = new AIReportReviewer();