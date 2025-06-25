import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Brain, TrendingUp, Target, Lightbulb } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ReportAnalysis {
  overallScore: number;
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

interface AIReportReviewerProps {
  reportData: {
    title: string;
    content: string;
    projectId?: number;
    challengesFaced?: string;
    nextSteps?: string;
    budgetNotes?: string;
  };
  onAnalysisComplete?: (analysis: ReportAnalysis) => void;
}

export default function AIReportReviewer({ reportData, onAnalysisComplete }: AIReportReviewerProps) {
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeReport = async () => {
    if (!reportData.title || !reportData.content) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await apiRequest("/api/reports/analyze", {
        method: "POST",
        body: JSON.stringify(reportData),
      });

      setAnalysis(result);
      onAnalysisComplete?.(result);
      
      toast({
        title: "Analysis Complete",
        description: getReadinessMessage(result.readinessLevel),
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getReadinessMessage = (level: string): string => {
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
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadinessColor = (level: string): string => {
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
  };

  const getProgressColor = (score: number): string => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">AI Report Assistant</CardTitle>
          </div>
          <Button 
            onClick={analyzeReport} 
            disabled={isAnalyzing || !reportData.title || !reportData.content}
            size="sm"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Report"}
          </Button>
        </div>
        <CardDescription>
          Get intelligent feedback on your report before submission
        </CardDescription>
      </CardHeader>

      {analysis && (
        <CardContent className="space-y-6">
          {/* Overall Score and Readiness */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}/100
                  </span>
                </div>
                <Progress value={analysis.overallScore} className="h-2" />
                <div className={`w-full h-2 rounded-full ${getProgressColor(analysis.overallScore)}`} 
                     style={{width: `${analysis.overallScore}%`}} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Readiness Level</span>
                  {analysis.readinessLevel === 'excellent' || analysis.readinessLevel === 'good' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                <Badge className={getReadinessColor(analysis.readinessLevel)}>
                  {analysis.readinessLevel.replace('-', ' ').toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Overall Feedback */}
          <Alert>
            <Brain className="w-4 h-4" />
            <AlertDescription className="text-sm">
              {analysis.overallFeedback}
            </AlertDescription>
          </Alert>

          {/* Strengths */}
          {analysis.strengthsIdentified.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span>Strengths Identified</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {analysis.strengthsIdentified.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Priority Improvements */}
          {analysis.priorityImprovements.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Target className="w-4 h-4 text-orange-600" />
                  <span>Priority Improvements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-1">
                  {analysis.priorityImprovements.map((improvement, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Section Analysis */}
          {analysis.sectionAnalysis.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span>Detailed Section Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {analysis.sectionAnalysis.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{section.section}</h4>
                      <span className={`text-sm font-semibold ${getScoreColor(section.score)}`}>
                        {section.score}/100
                      </span>
                    </div>
                    <Progress value={section.score} className="h-1.5" />
                    
                    {section.issues.length > 0 && (
                      <div>
                        <p className="text-xs text-red-600 font-medium mb-1">Issues Found:</p>
                        <ul className="space-y-0.5">
                          {section.issues.map((issue, issueIndex) => (
                            <li key={issueIndex} className="text-xs text-gray-600 flex items-start space-x-1">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {section.suggestions.length > 0 && (
                      <div>
                        <p className="text-xs text-blue-600 font-medium mb-1">Suggestions:</p>
                        <ul className="space-y-0.5">
                          {section.suggestions.map((suggestion, suggestionIndex) => (
                            <li key={suggestionIndex} className="text-xs text-gray-600 flex items-start space-x-1">
                              <span className="text-blue-500 mt-0.5">•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {index < analysis.sectionAnalysis.length - 1 && <Separator className="mt-3" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </CardContent>
      )}
    </Card>
  );
}