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
  rejectedReports: number;
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
      console.log('Raw AI Analysis Response:', analysis);
      const validatedAnalysis = this.validateAndFormatAnalysis(analysis, data);
      console.log('Validated Analysis with keyMetrics:', validatedAnalysis.keyMetrics);
      return validatedAnalysis;
      
    } catch (error) {
      console.error('AI Dashboard Analysis Error:', error);
      return this.generateFallbackAnalysis(data);
    }
  }

  private buildAnalysisPrompt(data: DashboardAnalysisData): string {
    const budgetUtilization = data.totalBudget > 0 ? (data.usedBudget / data.totalBudget) * 100 : 0;
    const completionRate = data.totalProjects > 0 ? (data.completedProjects / data.totalProjects) * 100 : 0;
    const totalReviewedReports = data.approvedReports + (data.rejectedReports || 0);
    const approvalRate = totalReviewedReports > 0 ? 
      (data.approvedReports / totalReviewedReports) * 100 : 0;

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
    
    // Calculate reliable metrics using our algorithms
    const calculatedOnTime = this.calculateOnTimeDelivery(data);
    const calculatedBudget = this.calculateBudgetEfficiency(data);
    const calculatedTeam = this.calculateTeamEngagement(data);
    
    return {
      overallHealth: this.validateHealth(analysis.overallHealth),
      completionTrend: this.validateTrend(analysis.completionTrend),
      riskProjects: data.overdueProjects,
      upcomingDeadlines: this.calculateUpcomingDeadlines(data),
      budgetUtilization: budgetUtilization,
      teamProductivity: this.validateProductivity(analysis.teamProductivity),
      executiveSummary: analysis.executiveSummary || this.generateDefaultSummary(data),
      keyMetrics: {
        onTimeDelivery: calculatedOnTime,
        budgetEfficiency: calculatedBudget,
        teamEngagement: calculatedTeam,
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
    if (data.totalProjects === 0) return 82; // Default reasonable score
    
    // Calculate delivery performance based on completion vs overdue ratio
    const completionRate = data.completedProjects / data.totalProjects;
    const overdueRate = data.overdueProjects / data.totalProjects;
    
    // Base score starts at 50 for having projects
    let deliveryScore = 50;
    
    // Add points for completion (up to 35 points)
    deliveryScore += completionRate * 35;
    
    // Subtract points for overdue projects (up to 25 points)
    deliveryScore -= overdueRate * 25;
    
    // Bonus for active projects progressing well
    if (data.averageProgress > 70) {
      deliveryScore += 15;
    } else if (data.averageProgress > 50) {
      deliveryScore += 10;
    }
    
    // Bonus for low overdue rate
    if (overdueRate === 0) {
      deliveryScore += 5;
    }
    
    return Math.round(Math.max(35, Math.min(95, deliveryScore)));
  }

  private calculateBudgetEfficiency(data: DashboardAnalysisData): number {
    if (data.totalBudget === 0) return 85; // Default reasonable score when no budget data
    
    const utilizationRate = data.usedBudget / data.totalBudget;
    const progressRate = data.averageProgress / 100;
    
    // If no budget is used yet, rate based on progress
    if (data.usedBudget === 0) {
      return Math.round(Math.max(75, Math.min(90, 75 + (progressRate * 15))));
    }
    
    // Efficiency: progress achieved vs budget spent
    let efficiency = 0;
    if (utilizationRate > 0) {
      efficiency = (progressRate / utilizationRate) * 70 + 20; // Base score of 20
      // Add bonus for optimal utilization (40-80%)
      if (utilizationRate >= 0.4 && utilizationRate <= 0.8) {
        efficiency += 10;
      }
    }
    
    return Math.round(Math.max(45, Math.min(95, efficiency)));
  }

  private calculateTeamEngagement(data: DashboardAnalysisData): number {
    if (!data.teamMembers || data.teamMembers === 0) return 78; // Default reasonable score
    
    // Base engagement score starts at 60
    let engagement = 60;
    
    // Calculate based on activity per team member
    const reportsPerMember = data.recentActivity / data.teamMembers;
    const projectsPerMember = data.activeProjects / data.teamMembers;
    
    // Add points for team activity (up to 25 points)
    engagement += Math.min(25, (reportsPerMember * 8) + (projectsPerMember * 6));
    
    // Bonus for good completion rate (up to 15 points)
    if (data.totalProjects > 0) {
      const completionRate = data.completedProjects / data.totalProjects;
      engagement += completionRate * 15;
    }
    
    // Small penalty for overdue projects (up to 10 points)
    if (data.totalProjects > 0) {
      const overdueRate = data.overdueProjects / data.totalProjects;
      engagement -= overdueRate * 10;
    }
    
    // Bonus for high average progress
    if (data.averageProgress > 75) {
      engagement += 8;
    } else if (data.averageProgress > 50) {
      engagement += 5;
    }
    
    return Math.round(Math.max(45, Math.min(95, engagement)));
  }

  private generateDefaultSummary(data: DashboardAnalysisData): string {
    const completion = Math.round(data.averageProgress);
    const completionRate = data.totalProjects > 0 ? Math.round((data.completedProjects / data.totalProjects) * 100) : 0;
    
    if (data.completedProjects === data.totalProjects && data.totalProjects > 0) {
      return `Excellent performance! All ${data.totalProjects} projects are completed with ${completion}% average progress. Strong project execution with ${data.recentActivity} recent reports submitted.`;
    } else if (data.activeProjects > 0) {
      return `Your organization has ${data.totalProjects} projects with ${completion}% average completion. ${data.activeProjects} projects are actively progressing with ${data.recentActivity} recent updates.`;
    } else if (data.completedProjects > 0) {
      return `Project portfolio shows ${data.completedProjects} completed projects (${completionRate}% completion rate). Ready for new project initiatives with strong execution history.`;
    } else {
      return `Project dashboard ready for new initiatives. ${data.recentActivity} recent activities recorded. Strong foundation for upcoming projects.`;
    }
  }

  private generateDefaultInsights(data: DashboardAnalysisData): AIInsight[] {
    const insights: AIInsight[] = [];

    // Always generate meaningful insights to populate Priority Actions
    if (data.overdueProjects > 0) {
      insights.push({
        type: 'warning',
        title: 'Overdue Projects',
        description: `${data.overdueProjects} project${data.overdueProjects > 1 ? 's are' : ' is'} past deadline`,
        action: 'Review project timelines and resource allocation',
        priority: 'high'
      });
    }

    if (data.pendingReports > 0) {
      insights.push({
        type: 'info',
        title: 'Reports Pending Review',
        description: `${data.pendingReports} report${data.pendingReports > 1 ? 's need' : ' needs'} admin approval`,
        action: 'Review and approve pending reports',
        priority: data.pendingReports > 3 ? 'high' : 'medium'
      });
    }

    if (data.averageProgress > 75) {
      insights.push({
        type: 'success',
        title: 'Strong Progress',
        description: `Projects are ${Math.round(data.averageProgress)}% complete on average`,
        action: 'Maintain current momentum and celebrate team achievements',
        priority: 'low'
      });
    } else if (data.averageProgress < 50) {
      insights.push({
        type: 'warning',
        title: 'Progress Below Target',
        description: `Average project progress is ${Math.round(data.averageProgress)}%`,
        action: 'Assess resource needs and remove blockers',
        priority: 'medium'
      });
    } else {
      insights.push({
        type: 'info',
        title: 'Steady Progress',
        description: `Projects are progressing at ${Math.round(data.averageProgress)}% completion`,
        action: 'Continue monitoring and provide team support',
        priority: 'low'
      });
    }

    // Budget insight
    if (data.totalBudget > 0) {
      const budgetUsed = (data.usedBudget / data.totalBudget) * 100;
      if (budgetUsed > 80) {
        insights.push({
          type: 'warning',
          title: 'High Budget Utilization',
          description: `${Math.round(budgetUsed)}% of total budget has been allocated`,
          action: 'Monitor spending and adjust allocations if needed',
          priority: 'medium'
        });
      } else if (budgetUsed < 30) {
        insights.push({
          type: 'info',
          title: 'Budget Underutilization',
          description: `Only ${Math.round(budgetUsed)}% of budget is being used`,
          action: 'Consider accelerating project activities or reallocating funds',
          priority: 'low'
        });
      }
    }

    // Ensure we always have at least 3 insights for Priority Actions
    if (insights.length < 3) {
      insights.push({
        type: 'info',
        title: 'Project Overview',
        description: `Managing ${data.totalProjects} project${data.totalProjects !== 1 ? 's' : ''} with ${data.activeProjects} currently active`,
        action: 'Continue regular project monitoring and team coordination',
        priority: 'low'
      });
    }

    return insights.slice(0, 5); // Limit to 5 insights max
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