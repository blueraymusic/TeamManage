import { useQuery } from "@tanstack/react-query";
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
  Target
} from "lucide-react";
import { t } from "@/lib/i18n";
import { useLogout } from "@/hooks/use-auth";
import ReportForm from "./report-form";
import ProgressChart from "./progress-chart";
import ChatInterface from "./chat-interface";
import AdelLogo from "./adel-logo";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

export default function OfficerDashboard() {
  const logout = useLogout();
  const queryClient = useQueryClient();
  const [viewingProject, setViewingProject] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/reports"],
  });

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
  const pendingReports = (reports as any)?.filter((r: any) => r.status === 'pending')?.length || 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Simple Header */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <AdelLogo size="sm" className="filter brightness-0 invert" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Officer Dashboard</h1>
                <p className="text-gray-600">Submit reports and track projects</p>
              </div>
            </div>
            <Button
              onClick={() => logout.mutate()}
              variant="outline"
              disabled={logout.isPending}
              className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {logout.isPending ? "Signing out..." : "Logout"}
            </Button>
          </div>
        </div>

        {/* Simple Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Projector className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeProjects.length}
                  </p>
                  <p className="text-gray-600">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {completedProjects.length}
                  </p>
                  <p className="text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {submittedReports}
                  </p>
                  <p className="text-gray-600">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {pendingReports}
                  </p>
                  <p className="text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simple Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <Tabs defaultValue="overview" className="w-full">
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
                  {unreadMessages && unreadMessages.count > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center">
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

              {/* Reports List - Shows 3 items at a time with scroll */}
              <div className="overflow-y-auto" style={{ maxHeight: '240px' }}>
                <div className="grid grid-cols-1 gap-4">
                  {(reports as any)?.map((report: any) => (
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
                          <div className="ml-4">
                            <Badge variant={
                              report.status === 'approved' ? 'default' : 
                              report.status === 'rejected' ? 'destructive' : 
                              'secondary'
                            }>
                              {report.status}
                            </Badge>
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
                  )) || (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 text-lg">No reports submitted yet</p>
                      <p className="text-slate-400">Submit your first report to get started</p>
                    </div>
                  )}
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