import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  MessageSquare,
  PieChart,
  Activity,
  DollarSign,
  Calendar
} from "lucide-react";
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Area, AreaChart } from "recharts";
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
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [aiInsights, setAiInsights] = useState<AIProjectSummary | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [viewingReport, setViewingReport] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    status: '',
    progress: 0,
    budget: '',
    budgetUsed: '',
    deadline: ''
  });

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
    queryKey: ["/api/organization/members"],
  });

  // Edit project mutation
  const editProjectMutation = useMutation({
    mutationFn: async (projectData: any) => {
      return await apiRequest('PATCH', `/api/projects/${editingProject.id}`, {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        progress: parseInt(projectData.progress),
        budget: parseFloat(projectData.budget),
        budgetUsed: parseFloat(projectData.budgetUsed),
        deadline: projectData.deadline
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setEditingProject(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const openEditModal = (project: any) => {
    setEditingProject(project);
    setEditForm({
      name: project.name || '',
      description: project.description || '',
      status: project.status || 'active',
      progress: project.progress || 0,
      budget: project.budget?.toString() || '',
      budgetUsed: project.budgetUsed?.toString() || '',
      deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : ''
    });
  };

  const handleSaveProject = () => {
    editProjectMutation.mutate(editForm);
  };

  // Generate AI insights
  const generateAIInsights = async () => {
    if (!projects || !reports) return;
    
    setLoadingAI(true);
    try {
      const response = await apiRequest('POST', '/api/ai/dashboard-insights', {});
      setAiInsights(response as unknown as AIProjectSummary);
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
  const onHoldProjects = projectsData.filter(p => p.status === 'on-hold');
  const cancelledProjects = projectsData.filter(p => p.status === 'cancelled');
  const pendingReports = reportsData.filter(r => r.status === 'submitted').length;
  const approvedReports = reportsData.filter(r => r.status === 'approved').length;
  const draftReports = reportsData.filter(r => r.status === 'draft').length;
  const avgProgress = projectsData.length > 0 ? 
    Math.round(projectsData.reduce((acc, p) => acc + (p.progress || 0), 0) / projectsData.length) : 0;

  // Chart data
  const projectStatusData = [
    { name: 'Active', value: activeProjects.length, color: '#3b82f6' },
    { name: 'Completed', value: completedProjects.length, color: '#10b981' },
    { name: 'On Hold', value: onHoldProjects.length, color: '#f59e0b' },
    { name: 'Cancelled', value: cancelledProjects.length, color: '#ef4444' }
  ];

  const reportStatusData = [
    { name: 'Approved', value: approvedReports, color: '#10b981' },
    { name: 'Pending', value: pendingReports, color: '#f59e0b' },
    { name: 'Draft', value: draftReports, color: '#6b7280' }
  ];

  const progressData = projectsData.map((project, index) => ({
    name: `P${index + 1}`,
    progress: project.progress || 0,
    budget: project.budget ? parseFloat(project.budget) : 0,
    spent: project.budgetUsed ? parseFloat(project.budgetUsed) : 0
  }));

  // Generate real monthly data based on actual project budgets
  const monthlyData = (() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      if (index > currentMonth) {
        return { month, projects: 0, reports: 0, budget: 0 };
      }
      
      // Calculate total budget for projects created in this month
      const monthProjects = projectsData.filter((project: any) => {
        if (!project.createdAt) return index === currentMonth; // Include current projects if no date
        const projectDate = new Date(project.createdAt);
        return projectDate.getMonth() === index;
      });
      
      const monthReports = reportsData.filter((report: any) => {
        if (!report.submittedAt) return false;
        const reportDate = new Date(report.submittedAt);
        return reportDate.getMonth() === index;
      });
      
      const monthBudget = monthProjects.reduce((total: number, project: any) => {
        return total + (parseFloat(project.budget) || 0);
      }, 0);
      
      return {
        month,
        projects: monthProjects.length,
        reports: monthReports.length,
        budget: monthBudget
      };
    });
  })();

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
                      <span className="font-medium">{aiInsights?.keyMetrics?.onTimeDelivery || 0}%</span>
                    </div>
                    <Progress value={aiInsights?.keyMetrics?.onTimeDelivery || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget Efficiency</span>
                      <span className="font-medium">{aiInsights?.keyMetrics?.budgetEfficiency || 0}%</span>
                    </div>
                    <Progress value={aiInsights?.keyMetrics?.budgetEfficiency || 0} className="h-2" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <Badge className={`${getRiskColor(aiInsights?.keyMetrics?.riskLevel || 'low')} border-0`}>
                    {(aiInsights?.keyMetrics?.riskLevel || 'low').toUpperCase()}
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
                {(aiInsights?.insights || []).slice(0, 3).map((insight, index) => (
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

        {/* Key Metrics with Pending Items Highlighted */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{activeProjects.length}</p>
                  <p className="text-sm text-gray-600">Active Projects</p>
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
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-0 shadow-sm hover:shadow-md transition-shadow ${pendingReports > 0 ? 'bg-gradient-to-br from-red-50 to-red-100 ring-2 ring-red-200' : 'bg-gradient-to-br from-purple-50 to-purple-100'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${pendingReports > 0 ? 'bg-red-500' : 'bg-purple-500'}`}>
                  <FileText className="w-5 h-5 text-white" />
                  {pendingReports > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">{pendingReports}</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className={`text-2xl font-bold ${pendingReports > 0 ? 'text-red-700' : 'text-gray-900'}`}>{pendingReports}</p>
                  <p className={`text-sm ${pendingReports > 0 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                    {pendingReports > 0 ? 'PENDING REVIEW' : 'Pending'}
                  </p>
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
                  <p className="text-sm text-gray-600">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="bg-white border-0 shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200 px-4">
              <TabsList className="grid w-full grid-cols-5 bg-transparent h-12">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Projects
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Reports
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="team" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Team
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {/* Project Status Distribution */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-blue-600" />
                      Project Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={projectStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {projectStatusData.map((entry, index) => (
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
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {projectStatusData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Trends */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      Monthly Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyData}>
                          <defs>
                            <linearGradient id="projectGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="reportGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                          />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: 'none', 
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="projects" 
                            stroke="#3b82f6" 
                            fillOpacity={1} 
                            fill="url(#projectGradient)" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="reports" 
                            stroke="#10b981" 
                            fillOpacity={1} 
                            fill="url(#reportGradient)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Analysis */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-purple-600" />
                      Budget Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <defs>
                            <linearGradient id="budgetGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                          />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: 'none', 
                              borderRadius: '8px',
                              color: 'white'
                            }}
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Budget']}
                          />
                          <Bar 
                            dataKey="budget" 
                            fill="url(#budgetGradient)" 
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Project Progress */}
                <Card className="bg-white border-0 shadow-lg xl:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      Project Progress Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={progressData}>
                          <defs>
                            <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#f59e0b" />
                              <stop offset="50%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#10b981" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: 'none', 
                              borderRadius: '8px',
                              color: 'white'
                            }}
                            formatter={(value, name) => [
                              name === 'progress' ? `${value}%` : `$${value.toLocaleString()}`, 
                              name === 'progress' ? 'Progress' : name === 'budget' ? 'Budget' : 'Spent'
                            ]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="progress" 
                            stroke="url(#progressGradient)" 
                            strokeWidth={3}
                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Report Status */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      Report Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={reportStatusData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {reportStatusData.map((entry, index) => (
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
                          />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                      {reportStatusData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-600">{item.name}</span>
                          </div>
                          <span className="font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects" className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Project Management</h3>
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>
                
                {/* Project Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{activeProjects.length}</div>
                      <div className="text-sm text-blue-700">Active</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{completedProjects.length}</div>
                      <div className="text-sm text-green-700">Completed</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-50 border-orange-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{onHoldProjects.length}</div>
                      <div className="text-sm text-orange-700">On Hold</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-gray-600">{projectsData.length}</div>
                      <div className="text-sm text-gray-700">Total</div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Projects List - Scrollable */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>All Projects ({projectsData.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {projectsData.map((project: any, index) => (
                        <Card key={project.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">#{index + 1}</span>
                                  <h4 className="font-semibold text-gray-900">{project.name || project.title}</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{project.description || 'No description provided'}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Badge variant={
                                  project.status === 'active' ? 'default' : 
                                  project.status === 'completed' ? 'secondary' :
                                  project.status === 'on-hold' ? 'outline' :
                                  'destructive'
                                } className={
                                  project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                  project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  project.status === 'on-hold' ? 'bg-orange-100 text-orange-800' :
                                  'bg-red-100 text-red-800'
                                }>
                                  {project.status}
                                </Badge>
                                <Button size="sm" variant="ghost"
                                  onClick={() => openEditModal(project)}>
                                  Edit
                                </Button>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Progress */}
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600">Progress</span>
                                  <span className="font-medium">{project.progress || 0}%</span>
                                </div>
                                <Progress value={project.progress || 0} className="h-2" />
                              </div>
                              
                              {/* Budget */}
                              {project.budget && (
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Budget</span>
                                    <span className="font-medium">${parseFloat(project.budget).toLocaleString()}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Used: ${parseFloat(project.budgetUsed || 0).toLocaleString()}
                                  </div>
                                </div>
                              )}
                              
                              {/* Deadline */}
                              {project.deadline && (
                                <div>
                                  <div className="text-sm text-gray-600 mb-1">Deadline</div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-gray-500" />
                                    <span className="text-sm font-medium">
                                      {new Date(project.deadline).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className={`text-xs ${
                                    new Date(project.deadline) < new Date() ? 'text-red-600' : 'text-gray-500'
                                  }`}>
                                    {new Date(project.deadline) < new Date() ? 'Overdue' : `${Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left`}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {projectsData.length === 0 && (
                        <div className="text-center py-8">
                          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">No projects found</p>
                          <Button className="mt-3" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Create First Project
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Report Management</h3>
                  {pendingReports > 0 && (
                    <Badge variant="destructive" className="text-sm">
                      {pendingReports} Pending Review
                    </Badge>
                  )}
                </div>
                
                {/* Pending Reports Section */}
                {pendingReports > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-red-700 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Reports Requiring Immediate Review
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {reportsData
                          .filter((report: any) => report.status === 'submitted')
                          .slice(0, 3)
                          .map((report: any) => (
                            <div key={report.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                              <div>
                                <h4 className="font-medium text-gray-900">{report.title}</h4>
                                <p className="text-sm text-gray-600">
                                  Submitted: {new Date(report.submittedAt || report.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-200" 
                                onClick={() => window.alert(`Reviewing report: ${report.title}`)}>
                                Review
                              </Button>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* All Reports - Scrollable */}
                <Card className="bg-white border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>All Reports ({reportsData.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {reportsData.slice(0, 20).map((report: any, index) => (
                        <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-gray-500 w-8">#{index + 1}</span>
                              <div>
                                <h4 className="font-medium text-gray-900">{report.title}</h4>
                                <p className="text-sm text-gray-600">
                                  {new Date(report.submittedAt || report.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={
                              report.status === 'approved' ? 'default' : 
                              report.status === 'submitted' ? 'secondary' : 
                              report.status === 'rejected' ? 'destructive' :
                              'outline'
                            }>
                              {report.status}
                            </Badge>
                            <Button size="sm" variant="ghost"
                              onClick={() => setViewingReport(report)}>
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      {reportsData.length > 20 && (
                        <div className="text-center py-3">
                          <p className="text-sm text-gray-500">
                            Showing 20 of {reportsData.length} reports
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Load More
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Performance Metrics */}
                <Card className="bg-white border-0 shadow-lg lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Performance Dashboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">{avgProgress}%</div>
                        <div className="text-sm text-gray-600">Avg Progress</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">{Math.round((completedProjects.length / Math.max(projectsData.length, 1)) * 100)}%</div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <div className="text-2xl font-bold text-purple-600">{teamData.length}</div>
                        <div className="text-sm text-gray-600">Team Size</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-xl">
                        <div className="text-2xl font-bold text-orange-600">{reportsData.length}</div>
                        <div className="text-sm text-gray-600">Total Reports</div>
                      </div>
                    </div>
                    
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyData}>
                          <defs>
                            <linearGradient id="combinedGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: 'none', 
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="projects" 
                            stroke="#3b82f6" 
                            fillOpacity={1} 
                            fill="url(#combinedGradient)" 
                            name="Projects"
                          />
                          <Area 
                            type="monotone" 
                            dataKey="reports" 
                            stroke="#10b981" 
                            fillOpacity={0.6} 
                            fill="#10b981" 
                            name="Reports"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Budget Trends */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Budget Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyData}>
                          <defs>
                            <linearGradient id="budgetTrendGradient" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: 'none', 
                              borderRadius: '8px',
                              color: 'white'
                            }}
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Budget']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="budget" 
                            stroke="url(#budgetTrendGradient)" 
                            strokeWidth={3}
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Timeline */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      Activity Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                          <defs>
                            <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: 'none', 
                              borderRadius: '8px',
                              color: 'white'
                            }}
                          />
                          <Bar 
                            dataKey="reports" 
                            fill="url(#activityGradient)" 
                            radius={[4, 4, 0, 0]}
                            name="Reports"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="team" className="p-6">
              <AdminChatInterface />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Edit Project Modal */}
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Project Name
                </Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="progress" className="text-right">
                  Progress (%)
                </Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={editForm.progress}
                  onChange={(e) => setEditForm({...editForm, progress: parseInt(e.target.value) || 0})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget" className="text-right">
                  Budget ($)
                </Label>
                <Input
                  id="budget"
                  type="number"
                  value={editForm.budget}
                  onChange={(e) => setEditForm({...editForm, budget: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budgetUsed" className="text-right">
                  Budget Used ($)
                </Label>
                <Input
                  id="budgetUsed"
                  type="number"
                  value={editForm.budgetUsed}
                  onChange={(e) => setEditForm({...editForm, budgetUsed: e.target.value})}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deadline" className="text-right">
                  Deadline
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm({...editForm, deadline: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingProject(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProject}
                disabled={editProjectMutation.isPending}
              >
                {editProjectMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Report Modal */}
        <Dialog open={!!viewingReport} onOpenChange={() => setViewingReport(null)}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{viewingReport?.title}</DialogTitle>
            </DialogHeader>
            
            {viewingReport && (
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Status</Label>
                    <div className="mt-1">
                      <Badge variant={
                        viewingReport.status === 'approved' ? 'default' : 
                        viewingReport.status === 'submitted' ? 'secondary' :
                        viewingReport.status === 'rejected' ? 'destructive' :
                        'outline'
                      } className={
                        viewingReport.status === 'approved' ? 'bg-green-100 text-green-800' :
                        viewingReport.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                        viewingReport.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {viewingReport.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">Submitted Date</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {new Date(viewingReport.submittedAt || viewingReport.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Project Information */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Project</Label>
                  <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-md">
                    {viewingReport.projectName || `Project ID: ${viewingReport.projectId}`}
                  </p>
                </div>

                {/* Submitted By */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Submitted By</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {viewingReport.submittedByName || `Officer ID: ${viewingReport.submittedBy}`}
                  </p>
                </div>

                {/* Report Content */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Report Content</Label>
                  <div className="mt-2 bg-gray-50 p-4 rounded-md border max-h-60 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {viewingReport.content || 'No content provided'}
                    </p>
                  </div>
                </div>

                {/* File Attachments */}
                {viewingReport.files && viewingReport.files.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">File Attachments</Label>
                    <div className="mt-2 space-y-2">
                      {viewingReport.files.map((file: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                          <span className="text-sm text-gray-700">{file.originalName || file.filename || `File ${index + 1}`}</span>
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Information */}
                {(viewingReport.reviewedBy || viewingReport.reviewNotes) && (
                  <div className="border-t pt-4">
                    <Label className="text-sm font-semibold text-gray-700">Review Information</Label>
                    {viewingReport.reviewedAt && (
                      <p className="text-sm text-gray-600 mt-1">
                        Reviewed on: {new Date(viewingReport.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                    {viewingReport.reviewNotes && (
                      <div className="mt-2 bg-yellow-50 p-3 rounded-md border border-yellow-200">
                        <p className="text-sm text-gray-700">
                          <strong>Review Notes:</strong> {viewingReport.reviewNotes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingReport(null)}>
                Close
              </Button>
              {viewingReport?.status === 'submitted' && (
                <Button onClick={() => {
                  setViewingReport(null);
                  window.alert('Review functionality would open here');
                }}>
                  Review Report
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}