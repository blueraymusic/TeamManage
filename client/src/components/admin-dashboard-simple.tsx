import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { 
  Users, 
  FolderOpen, 
  FileText,
  BarChart3,
  LogOut,
  Plus,
  CheckCircle2,
  TrendingUp,
  Brain,
  Zap,
  AlertTriangle,
  MessageSquare
} from "lucide-react";
import { useLogout, useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import AdelLogo from "./adel-logo";
import AdminChatInterface from "./admin-chat-interface";
import { apiRequest } from "@/lib/queryClient";

interface AIInsight {
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
}

interface AIProjectSummary {
  overallHealth: 'excellent' | 'good' | 'warning' | 'critical';
  executiveSummary: string;
  keyMetrics: {
    onTimeDelivery: number;
    budgetEfficiency: number;
    teamEngagement: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  insights: AIInsight[];
  recommendations: string[];
}

export default function AdminDashboardSimple() {
  const { user } = useAuth();
  const logout = useLogout();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [aiInsights, setAiInsights] = useState<AIProjectSummary | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports } = useQuery({
    queryKey: ["/api/reports"],
  });

  const { data: organization } = useQuery({
    queryKey: ["/api/organization"],
  });

  const { data: teamMembers } = useQuery({
    queryKey: ["/api/users/team"],
  });

  // Generate AI insights
  const generateAIInsights = async () => {
    if (!projects || !reports) return;
    
    setLoadingAI(true);
    try {
      const response = await apiRequest('POST', '/api/ai/dashboard-insights', {});
      setAiInsights(response as AIProjectSummary);
    } catch (error) {
      console.error('AI insights error:', error);
      toast({
        title: "AI Analysis Unavailable",
        description: "Using standard dashboard view",
        variant: "default",
      });
    } finally {
      setLoadingAI(false);
    }
  };

  // Calculate key metrics
  const projectsData = projects as any[] || [];
  const reportsData = reports as any[] || [];
  const teamData = teamMembers as any[] || [];
  const activeProjects = projectsData.filter(p => p.status === 'active');
  const completedProjects = projectsData.filter(p => p.status === 'completed');
  const pendingReports = reportsData.filter(r => r.status === 'submitted').length;
  const avgProgress = projectsData.length > 0 ? 
    Math.round(projectsData.reduce((acc, p) => acc + (p.progress || 0), 0) / projectsData.length) : 0;

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        
        {/* Compact Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <AdelLogo size="sm" className="filter brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage projects and team</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={generateAIInsights}
                disabled={loadingAI}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              >
                {loadingAI ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Brain className="w-4 h-4" />
                )}
                AI Insights
              </Button>
              
              <Button
                onClick={() => logout.mutate()}
                variant="outline"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        {aiInsights && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Executive Summary */}
            <Card className="lg:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getHealthColor(aiInsights.overallHealth)}`} />
                  AI Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{aiInsights.executiveSummary}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>On-Time Delivery</span>
                      <span className="font-medium">{aiInsights.keyMetrics.onTimeDelivery}%</span>
                    </div>
                    <Progress value={aiInsights.keyMetrics.onTimeDelivery} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget Efficiency</span>
                      <span className="font-medium">{aiInsights.keyMetrics.budgetEfficiency}%</span>
                    </div>
                    <Progress value={aiInsights.keyMetrics.budgetEfficiency} className="h-2" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <Badge className={`${getRiskColor(aiInsights.keyMetrics.riskLevel)} border-0`}>
                    {aiInsights.keyMetrics.riskLevel.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Priority Actions */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Priority Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiInsights.insights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="flex gap-3 p-3 rounded-lg bg-gray-50">
                    <div className="flex-shrink-0 mt-0.5">
                      {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                      {insight.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      {insight.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      {insight.type === 'info' && <FileText className="w-4 h-4 text-blue-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{insight.title}</p>
                      <p className="text-xs text-gray-600">{insight.description}</p>
                      {insight.action && (
                        <p className="text-xs text-blue-600 font-medium">{insight.action}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{activeProjects.length}</p>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{completedProjects.length}</p>
                  <p className="text-sm text-gray-600">Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pendingReports}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{teamData.length}</p>
                  <p className="text-sm text-gray-600">Team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="bg-white border-0 shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200 px-4">
              <TabsList className="grid w-full grid-cols-4 bg-transparent h-12">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Reports
                </TabsTrigger>
                <TabsTrigger value="team" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Team
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Overview */}
                <Card className="bg-gray-50 border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Project Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Progress</span>
                        <span className="font-medium">{avgProgress}%</span>
                      </div>
                      <Progress value={avgProgress} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-green-600">{completedProjects.length}</p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{activeProjects.length}</p>
                        <p className="text-sm text-gray-600">Active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Status */}
                <Card className="bg-gray-50 border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Team Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Total Members</span>
                        <span className="font-medium">{teamData.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pending Reports</span>
                        <Badge variant="secondary">{pendingReports}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Organization</span>
                        <span className="text-sm text-gray-600">{(organization as any)?.name || 'ADEL'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">All Projects</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {projectsData.map((project: any) => (
                    <Card key={project.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium">{project.title}</h4>
                          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{project.progress || 0}%</span>
                          </div>
                          <Progress value={project.progress || 0} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Report Management</h3>
                
                <div className="grid gap-4">
                  {reportsData.map((report: any) => (
                    <Card key={report.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{report.title}</h4>
                          <Badge variant={
                            report.status === 'approved' ? 'default' : 
                            report.status === 'submitted' ? 'secondary' : 
                            'outline'
                          }>
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          Submitted: {new Date(report.submittedAt || report.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team" className="p-6">
              <AdminChatInterface />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}