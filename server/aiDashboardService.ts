import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface DashboardAnalysisData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueProjects: number;
  averageProgress: number;
  totalBudget: number;
  usedBudget: number;
  pendingReports: number;
  approvedReports: number;
  recentActivity: number;
  teamMembers?: number;
  projectDeadlines?: any[];
}

export interface AIInsight {
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ProjectSummary {
  overallHealth: 'excellent' | 'good' | 'warning' | 'critical';
  completionTrend: 'improving' | 'stable' | 'declining';
  riskProjects: number;
  upcomingDeadlines: number;
  budgetUtilization: number;
  teamProductivity: 'high' | 'medium' | 'low';
  insights: AIInsight[];
  executiveSummary: string;
  keyMetrics: {
    onTimeDelivery: number;
    budgetEfficiency: number;
    teamEngagement: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  recommendations: string[];
}

export class AIDashboardService {
  async generateDashboardInsights(data: DashboardAnalysisData): Promise<ProjectSummary> {
    try {
      const prompt = this.buildAnalysisPrompt(data);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert project management analyst with deep expertise in NGO operations, project delivery, and team performance. Analyze project data and provide actionable insights in JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      return this.validateAndFormatAnalysis(analysis, data);
      
    } catch (error) {
      console.error('AI Dashboard Analysis Error:', error);
      return this.generateFallbackAnalysis(data);
    }
  }

  private buildAnalysisPrompt(data: DashboardAnalysisData): string {
    const budgetUtilization = data.totalBudget > 0 ? (data.usedBudget / data.totalBudget) * 100 : 0;
    const completionRate = data.totalProjects > 0 ? (data.completedProjects / data.totalProjects) * 100 : 0;
    const approvalRate = (data.pendingReports + data.approvedReports) > 0 ? 
      (data.approvedReports / (data.pendingReports + data.approvedReports)) * 100 : 0;

    return `Analyze this NGO project management data and provide insights in JSON format:

PROJECT DATA:
- Total Projects: ${data.totalProjects}
- Active Projects: ${data.activeProjects}
- Completed Projects: ${data.completedProjects}
- Overdue Projects: ${data.overdueProjects}
- Average Progress: ${data.averageProgress.toFixed(1)}%
- Budget Utilization: ${budgetUtilization.toFixed(1)}%
- Completion Rate: ${completionRate.toFixed(1)}%
- Report Approval Rate: ${approvalRate.toFixed(1)}%
- Recent Activity: ${data.recentActivity} reports this week
- Team Members: ${data.teamMembers || 'Unknown'}

ANALYSIS REQUIREMENTS:
1. Assess overall project health
2. Identify completion trends
3. Calculate risk factors
4. Evaluate team productivity
5. Provide 3-5 actionable insights
6. Generate executive summary
7. Give strategic recommendations

Respond with JSON containing:
{
  "overallHealth": "excellent|good|warning|critical",
  "completionTrend": "improving|stable|declining",
  "riskProjects": number,
  "upcomingDeadlines": number,
  "budgetUtilization": number,
  "teamProductivity": "high|medium|low",
  "executiveSummary": "2-3 sentence summary",
  "keyMetrics": {
    "onTimeDelivery": number (0-100),
    "budgetEfficiency": number (0-100),
    "teamEngagement": number (0-100),
    "riskLevel": "low|medium|high"
  },
  "insights": [
    {
      "type": "success|warning|info|error",
      "title": "string",
      "description": "string",
      "action": "string",
      "priority": "high|medium|low"
    }
  ],
  "recommendations": ["string", "string", "string"]
}`;
  }

  private validateAndFormatAnalysis(analysis: any, data: DashboardAnalysisData): ProjectSummary {
    const budgetUtilization = data.totalBudget > 0 ? Math.round((data.usedBudget / data.totalBudget) * 100) : 0;
    
    return {
      overallHealth: this.validateHealth(analysis.overallHealth),
      completionTrend: this.validateTrend(analysis.completionTrend),
      riskProjects: data.overdueProjects,
      upcomingDeadlines: this.calculateUpcomingDeadlines(data),
      budgetUtilization: budgetUtilization,
      teamProductivity: this.validateProductivity(analysis.teamProductivity),
      executiveSummary: analysis.executiveSummary || this.generateDefaultSummary(data),
      keyMetrics: {
        onTimeDelivery: Math.min(100, Math.max(0, analysis.keyMetrics?.onTimeDelivery || this.calculateOnTimeDelivery(data))),
        budgetEfficiency: Math.min(100, Math.max(0, analysis.keyMetrics?.budgetEfficiency || this.calculateBudgetEfficiency(data))),
        teamEngagement: Math.min(100, Math.max(0, analysis.keyMetrics?.teamEngagement || this.calculateTeamEngagement(data))),
        riskLevel: this.validateRiskLevel(analysis.keyMetrics?.riskLevel, data)
      },
      insights: this.validateInsights(analysis.insights, data),
      recommendations: Array.isArray(analysis.recommendations) ? 
        analysis.recommendations.slice(0, 5) : 
        this.generateDefaultRecommendations(data)
    };
  }

  private validateHealth(health: string): 'excellent' | 'good' | 'warning' | 'critical' {
    const validValues = ['excellent', 'good', 'warning', 'critical'];
    return validValues.includes(health) ? health as any : 'good';
  }

  private validateTrend(trend: string): 'improving' | 'stable' | 'declining' {
    const validValues = ['improving', 'stable', 'declining'];
    return validValues.includes(trend) ? trend as any : 'stable';
  }

  private validateProductivity(productivity: string): 'high' | 'medium' | 'low' {
    const validValues = ['high', 'medium', 'low'];
    return validValues.includes(productivity) ? productivity as any : 'medium';
  }

  private validateRiskLevel(riskLevel: string, data: DashboardAnalysisData): 'low' | 'medium' | 'high' {
    if (['low', 'medium', 'high'].includes(riskLevel)) {
      return riskLevel as any;
    }
    
    const riskScore = data.overdueProjects + (data.averageProgress < 50 ? 1 : 0);
    if (riskScore >= 3) return 'high';
    if (riskScore >= 1) return 'medium';
    return 'low';
  }

  private validateInsights(insights: any[], data: DashboardAnalysisData): AIInsight[] {
    if (!Array.isArray(insights)) {
      return this.generateDefaultInsights(data);
    }

    return insights.slice(0, 5).map(insight => ({
      type: ['success', 'warning', 'info', 'error'].includes(insight.type) ? insight.type : 'info',
      title: insight.title || 'Project Update',
      description: insight.description || 'No description available',
      action: insight.action,
      priority: ['high', 'medium', 'low'].includes(insight.priority) ? insight.priority : 'medium'
    }));
  }

  private calculateUpcomingDeadlines(data: DashboardAnalysisData): number {
    if (!data.projectDeadlines) return 0;
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return data.projectDeadlines.filter(deadline => {
      const deadlineDate = new Date(deadline);
      return deadlineDate <= nextWeek && deadlineDate > new Date();
    }).length;
  }

  private calculateOnTimeDelivery(data: DashboardAnalysisData): number {
    if (data.totalProjects === 0) return 100;
    const onTimeProjects = data.totalProjects - data.overdueProjects;
    return Math.round((onTimeProjects / data.totalProjects) * 100);
  }

  private calculateBudgetEfficiency(data: DashboardAnalysisData): number {
    if (data.totalBudget === 0) return 100;
    const efficiency = (data.averageProgress / 100) / (data.usedBudget / data.totalBudget);
    return Math.min(100, Math.round(efficiency * 100));
  }

  private calculateTeamEngagement(data: DashboardAnalysisData): number {
    // Base engagement on recent activity and report submission rate
    const baseScore = Math.min(100, data.recentActivity * 10);
    const reportScore = data.totalProjects > 0 ? 
      Math.min(100, ((data.approvedReports + data.pendingReports) / data.totalProjects) * 50) : 
      50;
    
    return Math.round((baseScore + reportScore) / 2);
  }

  private generateDefaultSummary(data: DashboardAnalysisData): string {
    const completion = Math.round(data.averageProgress);
    const health = data.overdueProjects === 0 ? 'strong' : 'needs attention';
    
    return `Your organization has ${data.totalProjects} projects with ${completion}% average completion. Overall project health is ${health} with ${data.recentActivity} recent updates.`;
  }

  private generateDefaultInsights(data: DashboardAnalysisData): AIInsight[] {
    const insights: AIInsight[] = [];

    if (data.overdueProjects > 0) {
      insights.push({
        type: 'warning',
        title: 'Overdue Projects',
        description: `${data.overdueProjects} project${data.overdueProjects > 1 ? 's are' : ' is'} past deadline`,
        action: 'Review project timelines and resource allocation',
        priority: 'high'
      });
    }

    if (data.averageProgress > 75) {
      insights.push({
        type: 'success',
        title: 'Strong Progress',
        description: `Projects are ${Math.round(data.averageProgress)}% complete on average`,
        action: 'Maintain current momentum',
        priority: 'low'
      });
    }

    if (data.pendingReports > 5) {
      insights.push({
        type: 'info',
        title: 'Report Backlog',
        description: `${data.pendingReports} reports await review`,
        action: 'Prioritize report approvals',
        priority: 'medium'
      });
    }

    return insights;
  }

  private generateDefaultRecommendations(data: DashboardAnalysisData): string[] {
    const recommendations = [];

    if (data.overdueProjects > 0) {
      recommendations.push('Focus on bringing overdue projects back on track');
    }

    if (data.averageProgress < 50) {
      recommendations.push('Consider additional resources for low-progress projects');
    }

    if (data.pendingReports > 3) {
      recommendations.push('Streamline report approval process');
    }

    recommendations.push('Schedule weekly team check-ins to maintain momentum');
    recommendations.push('Review budget allocation for optimal resource distribution');

    return recommendations.slice(0, 3);
  }

  private generateFallbackAnalysis(data: DashboardAnalysisData): ProjectSummary {
    const budgetUtilization = data.totalBudget > 0 ? Math.round((data.usedBudget / data.totalBudget) * 100) : 0;
    
    return {
      overallHealth: data.overdueProjects === 0 ? 'good' : 'warning',
      completionTrend: data.averageProgress > 60 ? 'improving' : 'stable',
      riskProjects: data.overdueProjects,
      upcomingDeadlines: 0,
      budgetUtilization,
      teamProductivity: data.averageProgress > 70 ? 'high' : 'medium',
      executiveSummary: this.generateDefaultSummary(data),
      keyMetrics: {
        onTimeDelivery: this.calculateOnTimeDelivery(data),
        budgetEfficiency: this.calculateBudgetEfficiency(data),
        teamEngagement: this.calculateTeamEngagement(data),
        riskLevel: data.overdueProjects > 2 ? 'high' : data.overdueProjects > 0 ? 'medium' : 'low'
      },
      insights: this.generateDefaultInsights(data),
      recommendations: this.generateDefaultRecommendations(data)
    };
  }
}

export const aiDashboardService = new AIDashboardService();