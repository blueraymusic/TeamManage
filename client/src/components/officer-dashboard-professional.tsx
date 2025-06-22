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
import ReportForm from "./report-form";
import ProgressChart from "./progress-chart";
import AdelLogo from "./adel-logo";

export default function OfficerDashboard() {
  const [viewingProject, setViewingProject] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/reports"],
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
        {/* Professional Header */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl opacity-20"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-xl shadow-lg">
                  <AdelLogo size="md" className="filter brightness-0 invert" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  ADEL Officer Portal
                </h1>
                <p className="text-slate-600 font-medium">Project Reporting & Collaboration</p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = '/api/auth/logout'}
              variant="outline"
              className="border-2 border-slate-300 text-slate-700 hover:border-red-400 hover:text-red-700 hover:bg-red-50 transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Professional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/90 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Projector className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800 mb-1">
                {activeProjects.length}
              </p>
              <p className="text-slate-600 font-medium">Active Projects</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800 mb-1">
                {completedProjects.length}
              </p>
              <p className="text-slate-600 font-medium">Completed Projects</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800 mb-1">
                {submittedReports}
              </p>
              <p className="text-slate-600 font-medium">Total Reports</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800 mb-1">
                {pendingReports}
              </p>
              <p className="text-slate-600 font-medium">Pending Reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-xl shadow-lg overflow-hidden">
          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b border-slate-200 bg-white/90 px-6">
              <TabsList className="grid w-full grid-cols-3 bg-transparent h-16">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl font-medium">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl font-medium">
                  <Projector className="w-4 h-4 mr-2" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl font-medium">
                  <FileText className="w-4 h-4 mr-2" />
                  Reports
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Project Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProgressChart />
                  </CardContent>
                </Card>
                
                <Card className="bg-white border border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-slate-800">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(reports as any)?.slice(0, 5)?.map((report: any) => (
                        <div key={report.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-800">{report.title}</p>
                            <p className="text-sm text-slate-600">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={report.status === 'approved' ? 'default' : 'secondary'}>
                            {report.status}
                          </Badge>
                        </div>
                      )) || (
                        <p className="text-slate-500 text-center py-8">No recent activity</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
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