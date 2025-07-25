import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { 
  Users, 
  Projector, 
  Clock, 
  Calendar, 
  DollarSign,
  FileText,
  BarChart3,
  LogOut,
  Plus,
  Activity,
  CheckCircle2,
  TrendingUp,
  Target,
  Search,
  RotateCcw,
  Edit3
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { useLogout, useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import ReportForm from "./report-form-fixed";
import ReportFormEdit from "./report-form-edit";
import ProgressChart from "./progress-chart";
import ChatInterface from "./chat-interface";
import AdelLogo from "./adel-logo";
import DeadlineBadge from "./deadline-badge";
import DashboardWidgets from "./dashboard-widgets";
import OverdueNotifications from "./overdue-notifications";
import AnalyticsDashboard from "./analytics-dashboard";
import SmartNotifications from "./smart-notifications";

import ProjectTimeline from "./project-timeline";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

export default function OfficerDashboard() {
  const logout = useLogout();
  const { user, isLoading } = useAuth();
  
  // Debug logging for user data
  console.log("OfficerDashboard - User:", user, "IsLoading:", isLoading);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [viewingProject, setViewingProject] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [reportSearchTerm, setReportSearchTerm] = useState("");
  
  // Recall report mutation
  const recallReportMutation = useMutation({
    mutationFn: async (reportId: number) => {
      const response = await fetch(`/api/reports/${reportId}/recall`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to recall report');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Report recalled successfully",
        description: "Your report has been moved back to draft status and can now be edited.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to recall report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/reports"],
  });

  const { data: organization } = useQuery({
    queryKey: ["/api/organization"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Filter reports based on search term
  const filteredReports = (reports as any)?.filter((report: any) =>
    report.title?.toLowerCase().includes(reportSearchTerm.toLowerCase()) ||
    report.content?.toLowerCase().includes(reportSearchTerm.toLowerCase()) ||
    report.projectName?.toLowerCase().includes(reportSearchTerm.toLowerCase())
  ) || [];

  // Get unread message count for notification
  const { data: unreadMessages } = useQuery({
    queryKey: ["/api/messages/unread"],
  });

  const handleViewDetails = (project: any) => {
    setViewingProject(project);
    setIsViewDialogOpen(true);
  };

  if (projectsLoading || reportsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const activeProjects = (projects as any)?.filter((p: any) => p.progress < 100) || [];
  const completedProjects = (projects as any)?.filter((p: any) => p.progress === 100) || [];
  const submittedReports = (reports as any)?.length || 0;
  const pendingReports = (reports as any)?.filter((r: any) => r.status === 'submitted')?.length || 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50/40 to-indigo-50/60">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-6 space-y-3 md:space-y-6">
        {/* Enhanced Header with Modern Design */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 md:p-3 rounded-xl shadow-lg">
                <AdelLogo size="sm" className="filter brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Officer Dashboard
                </h1>
                <p className="text-sm md:text-base text-gray-600 hidden sm:block">
                  Submit reports and track project progress
                </p>
              </div>
            </div>
            <Button
              onClick={() => logout.mutate()}
              variant="outline"
              size="sm"
              disabled={logout.isPending}
              className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors text-xs md:text-sm"
            >
              <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">{logout.isPending ? "Signing out..." : "Logout"}</span>
              <span className="sm:hidden">Exit</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards with Modern Design */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Projector className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {activeProjects.length}
                  </p>
                  <p className="text-sm text-gray-600">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {completedProjects.length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {submittedReports}
                  </p>
                  <p className="text-sm text-gray-600">Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {pendingReports}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs with Modern Design */}
        <div className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200 px-4">
              <TabsList className="grid w-full grid-cols-5 bg-transparent h-12">
                <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 relative">
                  Projects
                  {(() => {
                    const overdueCount = (projects as any)?.filter((p: any) => 
                      p.isOverdue && 
                      p.status !== 'completed' && 
                      p.status !== 'cancelled' &&
                      (p.progress || 0) < 100
                    ).length || 0;
                    return overdueCount > 0 ? (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
                        {overdueCount}
                      </Badge>
                    ) : null;
                  })()}
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Reports
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="messages" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 relative">
                  Messages
                  {unreadMessages && unreadMessages.count > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center animate-notificationPulse animate-slideInRight bg-red-500 text-white border-2 border-white shadow-lg"
                    >
                      {unreadMessages.count}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Project Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressChart />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Available Projects</h2>
              </div>

              {/* Overdue Notifications */}
              <OverdueNotifications />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(projects as any)?.map((project: any) => (
                  <Card key={project.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleViewDetails(project)}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-slate-800">{project.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">Progress</span>
                            <span className="font-medium text-slate-800">{project.progress || 0}%</span>
                          </div>
                          <Progress value={project.progress || 0} className="h-2" />
                        </div>
                        
                        {project.budget && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-slate-600">Budget Usage</span>
                              <span className="font-medium text-slate-800">
                                ${parseFloat(project.budgetUsed || 0).toFixed(0)} / ${parseFloat(project.budget).toFixed(0)}
                              </span>
                            </div>
                            <Progress 
                              value={project.budget ? (parseFloat(project.budgetUsed || 0) / parseFloat(project.budget)) * 100 : 0} 
                              className="h-2"
                            />
                          </div>
                        )}

                        <div className="flex items-center text-sm text-slate-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                        </div>

                        <Badge variant={project.progress === 100 ? "default" : "secondary"}>
                          {project.progress === 100 ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <div className="col-span-full text-center py-12">
                    <Projector className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">No projects available</p>
                    <p className="text-slate-400">Contact your administrator to get assigned to projects</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reports" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Report Management</h2>
                <ReportForm onSuccess={() => {}} />
              </div>

              {/* Search Reports */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search reports by title or content..."
                    value={reportSearchTerm}
                    onChange={(e) => setReportSearchTerm(e.target.value)}
                    className="pl-10 h-9"
                  />
                </div>
              </div>

              {/* Reports List - Shows 3-3.5 reports at a time */}
              <div className="overflow-y-auto" style={{ maxHeight: '280px' }}>
                <div className="grid grid-cols-1 gap-3">
                  {filteredReports?.slice(0, 100).map((report: any) => (
                    <Card key={report.id} className="bg-white border border-slate-200 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-800 mb-1">{report.title}</h3>
                            <p className="text-sm text-slate-600 mb-2">{report.content}</p>
                            <div className="flex items-center space-x-4 text-sm text-slate-500">
                              <span>Project: {report.projectName || 'Unknown'}</span>
                              <span>Submitted: {new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="ml-4 flex items-center gap-2">
                            <Badge variant={
                              report.status === 'approved' ? 'default' : 
                              report.status === 'rejected' ? 'destructive' : 
                              'secondary'
                            }>
                              {report.status}
                            </Badge>
                            {report.status === 'submitted' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => recallReportMutation.mutate(report.id)}
                                disabled={recallReportMutation.isPending}
                                className="h-8 px-3 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-700 hover:from-amber-100 hover:to-yellow-100 hover:border-amber-300 shadow-sm transition-all duration-200 font-medium text-xs rounded-md"
                              >
                                <RotateCcw className="w-3 h-3 mr-1.5" />
                                Call Back
                              </Button>
                            )}
                            {report.status === 'draft' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8 px-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 shadow-sm transition-all duration-200 font-medium text-xs rounded-md"
                                  >
                                    <Edit3 className="w-3 h-3 mr-1.5" />
                                    Edit Draft
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Edit Draft Report</DialogTitle>
                                  </DialogHeader>
                                  <ReportFormEdit 
                                    reportId={report.id}
                                    onSuccess={() => {
                                      console.log("Edit form success callback triggered");
                                      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
                                      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
                                      window.location.reload();
                                    }}
                                    onCancel={() => {
                                      console.log("Edit form cancel callback triggered");
                                      window.location.reload();
                                    }}
                                  />
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </div>
                        {report.reviewNotes && (
                          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Review Notes:</span> {report.reviewNotes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filteredReports.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">
                      {reportSearchTerm ? "No reports match your search" : "No reports submitted yet"}
                    </p>
                    <p className="text-slate-400">
                      {reportSearchTerm ? "Try adjusting your search terms" : "Submit your first report to get started"}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AnalyticsDashboard userRole="officer" />
                </div>
                <div className="space-y-6">
                  <SmartNotifications userRole="officer" />
                  <ProjectTimeline />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="messages" className="p-6">
              <ChatInterface />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* View Project Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewingProject?.name}</DialogTitle>
            <DialogDescription>Project details and information</DialogDescription>
          </DialogHeader>
          {viewingProject && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-800 mb-1">Description</h4>
                <p className="text-sm text-slate-600">
                  {viewingProject.description || "No description provided"}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 mb-1">Progress</h4>
                <div className="flex items-center space-x-2">
                  <Progress value={viewingProject.progress || 0} className="flex-1" />
                  <span className="text-sm font-medium">{viewingProject.progress || 0}%</span>
                </div>
              </div>
              {viewingProject.budget && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-1">Budget</h4>
                  <p className="text-sm text-slate-600">
                    ${parseFloat(viewingProject.budgetUsed || 0).toFixed(2)} / ${parseFloat(viewingProject.budget).toFixed(2)} used
                  </p>
                </div>
              )}
              <div>
                <h4 className="font-medium text-slate-800 mb-1">Deadline</h4>
                <p className="text-sm text-slate-600">
                  {viewingProject.deadline ? new Date(viewingProject.deadline).toLocaleDateString() : 'No deadline set'}
                </p>
              </div>
              <div className="pt-4">
                <ReportForm projectId={viewingProject.id} onSuccess={() => setIsViewDialogOpen(false)} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}