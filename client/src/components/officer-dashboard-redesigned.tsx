import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { 
  Projector, 
  Clock, 
  Calendar, 
  FileText,
  BarChart3,
  LogOut,
  Plus,
  CheckCircle2,
  TrendingUp,
  Brain,
  Zap,
  AlertTriangle,
  MessageSquare,
  Edit3
} from "lucide-react";
import { useLogout, useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import AdelLogo from "./adel-logo";
import ChatInterface from "./chat-interface";
import ReportForm from "./report-form-fixed";
import { apiRequest } from "@/lib/queryClient";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from 'recharts';

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

export default function OfficerDashboardRedesigned() {
  const { user } = useAuth();
  const logout = useLogout();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [aiInsights, setAiInsights] = useState<AIProjectSummary | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [viewingReport, setViewingReport] = useState<any>(null);

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports, refetch: refetchReports } = useQuery({
    queryKey: ["/api/reports"],
  });

  const { data: unreadMessages } = useQuery({
    queryKey: ["/api/messages/unread"],
  });

  // Generate AI insights
  const generateAIInsights = async () => {
    if (!projects || !reports) return;
    
    setLoadingAI(true);
    try {
      const response = await apiRequest('POST', '/api/ai/dashboard-insights', {});
      setAiInsights(response);
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
  const activeProjects = projectsData.filter(p => p.status === 'active');
  const completedProjects = projectsData.filter(p => p.status === 'completed');
  const submittedReports = reportsData.filter(r => r.status === 'submitted').length;
  const draftReports = reportsData.filter(r => r.status === 'draft').length;
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
                <h1 className="text-xl font-bold text-gray-900">Officer Dashboard</h1>
                <p className="text-sm text-gray-600">Submit reports and track progress</p>
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
                onClick={() => setShowReportForm(true)}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Report
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
                  AI Project Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Executive Summary</h4>
                    <p className="text-gray-700 leading-relaxed text-sm">{aiInsights.executiveSummary}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Project Objectives</h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      {projectsData.map((project: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-2 rounded border-l-2 border-blue-400">
                          <span className="font-medium">{project.name}:</span> {project.goals || project.description || 'Objectives to be defined'}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Key Inputs & Activities</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-blue-50 p-2 rounded">
                        <span className="font-medium text-blue-800">Budget Allocated:</span>
                        <p className="text-blue-700">${projectsData.reduce((acc: number, p: any) => acc + parseFloat(p.budget || '0'), 0).toLocaleString()}</p>
                      </div>
                      <div className="bg-green-50 p-2 rounded">
                        <span className="font-medium text-green-800">Team Members:</span>
                        <p className="text-green-700">11 active members</p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded">
                        <span className="font-medium text-purple-800">Reports Generated:</span>
                        <p className="text-purple-700">{reportsData.length} total reports</p>
                      </div>
                      <div className="bg-orange-50 p-2 rounded">
                        <span className="font-medium text-orange-800">Active Projects:</span>
                        <p className="text-orange-700">{activeProjects.length} in progress</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Accomplishments & Numbers</h4>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                        <div className="text-lg font-bold text-green-800">
                          {completedProjects.length}
                        </div>
                        <div className="text-xs text-green-700">Projects Completed</div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                        <div className="text-lg font-bold text-blue-800">
                          {Math.round(projectsData.reduce((acc: number, p: any) => acc + p.progress, 0) / projectsData.length || 0)}%
                        </div>
                        <div className="text-xs text-blue-700">Average Progress</div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                        <div className="text-lg font-bold text-purple-800">
                          {reportsData.filter((r: any) => r.status === 'approved').length}
                        </div>
                        <div className="text-xs text-purple-700">Reports Approved</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200">
                        <div className="text-lg font-bold text-orange-800">
                          ${projectsData.reduce((acc: number, p: any) => acc + (parseFloat(p.budgetUsed) || 0), 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-orange-700">Total Budget Spent</div>
                      </div>
                      <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-3 rounded-lg border border-teal-200">
                        <div className="text-lg font-bold text-teal-800">
                          {reportsData.length}
                        </div>
                        <div className="text-xs text-teal-700">Total Reports Generated</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h5 className="text-xs font-semibold text-gray-700 mb-1">Project Status Breakdown:</h5>
                      {projectsData.map((project: any, index: number) => (
                        <div key={index} className="bg-white border rounded-lg p-2 shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-800 text-sm">{project.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              project.status === 'completed' ? 'bg-green-100 text-green-800' :
                              project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                              project.status === 'on-hold' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                            <span><strong>{project.progress}%</strong> Complete</span>
                            <span><strong>${project.budgetUsed || 0}</strong> Spent</span>
                            <span><strong>${(parseFloat(project.budget) - parseFloat(project.budgetUsed || '0')).toLocaleString()}</strong> Remaining</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Metrics Pie Chart */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Performance Metrics</h4>
                    
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={[
                                { name: 'On-Time Delivery', value: aiInsights?.keyMetrics?.onTimeDelivery || 0, color: '#3b82f6' },
                                { name: 'Budget Efficiency', value: aiInsights?.keyMetrics?.budgetEfficiency || 0, color: '#10b981' },
                                { name: 'Team Engagement', value: aiInsights?.keyMetrics?.teamEngagement || 0, color: '#8b5cf6' }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={70}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {[
                                { name: 'On-Time Delivery', value: aiInsights?.keyMetrics?.onTimeDelivery || 0, color: '#3b82f6' },
                                { name: 'Budget Efficiency', value: aiInsights?.keyMetrics?.budgetEfficiency || 0, color: '#10b981' },
                                { name: 'Team Engagement', value: aiInsights?.keyMetrics?.teamEngagement || 0, color: '#8b5cf6' }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1f2937', 
                                border: 'none', 
                                borderRadius: '8px',
                                color: 'white'
                              }}
                              formatter={(value: any) => [`${value}%`, '']}
                            />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 mt-2">
                        {[
                          { name: 'On-Time Delivery', value: aiInsights?.keyMetrics?.onTimeDelivery || 0, color: '#3b82f6' },
                          { name: 'Budget Efficiency', value: aiInsights?.keyMetrics?.budgetEfficiency || 0, color: '#10b981' },
                          { name: 'Team Engagement', value: aiInsights?.keyMetrics?.teamEngagement || 0, color: '#8b5cf6' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-gray-600">{item.name}</span>
                            </div>
                            <span className="font-medium">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress Rate</span>
                      <span className="font-medium">{aiInsights.keyMetrics.onTimeDelivery}%</span>
                    </div>
                    <Progress value={aiInsights.keyMetrics.onTimeDelivery} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Task Completion</span>
                      <span className="font-medium">{aiInsights.keyMetrics.teamEngagement}%</span>
                    </div>
                    <Progress value={aiInsights.keyMetrics.teamEngagement} className="h-2" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Performance Level</span>
                  <Badge className={`${getRiskColor(aiInsights.keyMetrics.riskLevel)} border-0`}>
                    {aiInsights.keyMetrics.riskLevel.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions & Alerts */}
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Action Items
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
                  <Projector className="w-5 h-5 text-white" />
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
                  <p className="text-2xl font-bold text-gray-900">{submittedReports}</p>
                  <p className="text-sm text-gray-600">Submitted</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{draftReports}</p>
                  <p className="text-sm text-gray-600">Drafts</p>
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
                <TabsTrigger value="messages" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 relative">
                  Messages
                  {(unreadMessages as any)?.count > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                      {(unreadMessages as any).count}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Progress Overview */}
                <Card className="bg-gray-50 border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      My Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
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
                        <p className="text-sm text-gray-600">In Progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Reports */}
                <Card className="bg-gray-50 border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Recent Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reportsData.slice(0, 3).map((report: any, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-white">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{report.title}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(report.submittedAt || report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={report.status === 'approved' ? 'default' : 'secondary'}>
                            {report.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">My Projects</h3>
                
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
                          {project.deadline && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-1" />
                              Due: {new Date(project.deadline).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">My Reports</h3>
                  <Button onClick={() => setShowReportForm(true)} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Report
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {reportsData.map((report: any) => (
                    <Card key={report.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{report.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              report.status === 'approved' ? 'default' : 
                              report.status === 'submitted' ? 'secondary' : 
                              'outline'
                            }>
                              {report.status}
                            </Badge>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setViewingReport(report)}
                              >
                                View
                              </Button>
                              {(report.status === 'draft' || report.status === 'rejected') && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setEditingReport(report)}
                                >
                                  <Edit3 className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(report.submittedAt || report.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="messages" className="p-6">
              <ChatInterface />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Report Form Modal */}
        {showReportForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Submit New Report</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowReportForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <ReportForm 
                  onSuccess={() => {
                    setShowReportForm(false);
                    refetchReports();
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Edit Report Modal */}
        {editingReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Edit Report</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingReport(null)}
                  >
                    Cancel
                  </Button>
                </div>
                <ReportForm 
                  reportId={editingReport.id}
                  onSuccess={() => {
                    setEditingReport(null);
                    refetchReports();
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* View Report Modal */}
        {viewingReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{viewingReport.title}</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setViewingReport(null)}
                  >
                    Close
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={
                        viewingReport.status === 'approved' ? 'default' : 
                        viewingReport.status === 'submitted' ? 'secondary' : 
                        'outline'
                      }>
                        {viewingReport.status}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        Submitted: {new Date(viewingReport.submittedAt || viewingReport.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Report Content</h3>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{viewingReport.content}</p>
                    </div>
                  </div>

                  {viewingReport.files && Array.isArray(viewingReport.files) && viewingReport.files.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Attachments</h3>
                      <div className="space-y-2">
                        {viewingReport.files.map((file: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">{file.filename || `Attachment ${index + 1}`}</span>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => window.open(`/api/reports/${viewingReport.id}/files/${file.filename || index}`, '_blank')}
                            >
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewingReport.reviewNotes && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-medium mb-2 text-yellow-800">Review Notes</h3>
                      <p className="text-yellow-700 whitespace-pre-wrap">{viewingReport.reviewNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}