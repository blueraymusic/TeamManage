import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  Brain,
  BarChart3,
  Users,
  FileText
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useState, useEffect } from "react";

interface AIInsight {
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description: string;
  action?: string;
}

interface ProjectSummary {
  overallHealth: 'excellent' | 'good' | 'warning' | 'critical';
  completionTrend: 'improving' | 'stable' | 'declining';
  riskProjects: number;
  upcomingDeadlines: number;
  budgetUtilization: number;
  teamProductivity: 'high' | 'medium' | 'low';
  insights: AIInsight[];
}

export default function AIDashboardInsights({ userRole }: { userRole: 'admin' | 'officer' }) {
  const [aiSummary, setAiSummary] = useState<ProjectSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports } = useQuery({
    queryKey: ["/api/reports"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Generate AI insights based on project data
  useEffect(() => {
    const generateAIInsights = async () => {
      if (!projects || !reports) return;

      try {
        setLoading(true);
        
        // Prepare data for AI analysis
        const projectsData = projects as any[];
        const reportsData = reports as any[];
        
        const analysisData = {
          totalProjects: projectsData.length,
          activeProjects: projectsData.filter(p => p.status === 'active').length,
          completedProjects: projectsData.filter(p => p.status === 'completed').length,
          overdueProjects: projectsData.filter(p => p.isOverdue).length,
          averageProgress: projectsData.reduce((acc, p) => acc + (p.progress || 0), 0) / projectsData.length,
          totalBudget: projectsData.reduce((acc, p) => acc + parseFloat(p.budget || 0), 0),
          usedBudget: projectsData.reduce((acc, p) => acc + parseFloat(p.budgetUsed || 0), 0),
          pendingReports: reportsData.filter(r => r.status === 'submitted').length,
          approvedReports: reportsData.filter(r => r.status === 'approved').length,
          recentActivity: reportsData.filter(r => {
            const reportDate = new Date(r.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return reportDate > weekAgo;
          }).length
        };

        // Call AI analysis endpoint
        const response = await apiRequest('POST', '/api/ai/dashboard-insights', analysisData);
        setAiSummary(response);
        
      } catch (error) {
        console.error('Error generating AI insights:', error);
        // Fallback to basic analysis
        generateFallbackInsights();
      } finally {
        setLoading(false);
      }
    };

    const generateFallbackInsights = () => {
      if (!projects) return;
      
      const projectsData = projects as any[];
      const overdueCount = projectsData.filter(p => p.isOverdue).length;
      const avgProgress = projectsData.reduce((acc, p) => acc + (p.progress || 0), 0) / projectsData.length;
      
      const insights: AIInsight[] = [];
      
      if (overdueCount > 0) {
        insights.push({
          type: 'warning',
          title: 'Overdue Projects Detected',
          description: `${overdueCount} project${overdueCount > 1 ? 's are' : ' is'} past deadline`,
          action: 'Review project timelines'
        });
      }
      
      if (avgProgress > 75) {
        insights.push({
          type: 'success',
          title: 'Strong Progress',
          description: `Projects are ${Math.round(avgProgress)}% complete on average`,
          action: 'Maintain current pace'
        });
      }
      
      setAiSummary({
        overallHealth: overdueCount === 0 ? (avgProgress > 70 ? 'excellent' : 'good') : 'warning',
        completionTrend: avgProgress > 60 ? 'improving' : 'stable',
        riskProjects: overdueCount,
        upcomingDeadlines: projectsData.filter(p => {
          if (!p.deadline) return false;
          const deadline = new Date(p.deadline);
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          return deadline <= nextWeek && deadline > new Date();
        }).length,
        budgetUtilization: 75,
        teamProductivity: avgProgress > 70 ? 'high' : avgProgress > 40 ? 'medium' : 'low',
        insights
      });
    };

    generateAIInsights();
  }, [projects, reports]);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100/60 border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-blue-600" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!aiSummary) return null;

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Summary Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100/60 border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-blue-600" />
            AI Project Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Health */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Overall Health</span>
            <Badge className={`${getHealthColor(aiSummary.overallHealth)} border-0 font-medium`}>
              {aiSummary.overallHealth.charAt(0).toUpperCase() + aiSummary.overallHealth.slice(1)}
            </Badge>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getTrendIcon(aiSummary.completionTrend)}
                <span className="text-sm text-gray-600">Progress Trend</span>
              </div>
              <p className="text-xs text-gray-500 capitalize">{aiSummary.completionTrend}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-gray-600">Risk Projects</span>
              </div>
              <p className="text-xs text-gray-500">{aiSummary.riskProjects} need attention</p>
            </div>
          </div>

          {/* Budget Utilization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Budget Utilization</span>
              <span className="text-sm font-medium">{aiSummary.budgetUtilization}%</span>
            </div>
            <Progress value={aiSummary.budgetUtilization} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Smart Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiSummary.insights.map((insight, index) => (
            <div key={index} className="flex gap-3 p-3 rounded-lg bg-gray-50">
              <div className="flex-shrink-0 mt-0.5">
                {insight.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                {insight.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                {insight.type === 'info' && <Target className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                <p className="text-xs text-gray-600">{insight.description}</p>
                {insight.action && (
                  <p className="text-xs text-blue-600 font-medium">{insight.action}</p>
                )}
              </div>
            </div>
          ))}

          {aiSummary.insights.length === 0 && (
            <div className="text-center py-4">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">All projects are on track!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}