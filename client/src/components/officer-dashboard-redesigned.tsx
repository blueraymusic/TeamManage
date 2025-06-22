import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Plus,
  LogOut,
  Star,
  ArrowUpRight,
  Activity,
  Target,
  Calendar,
  TrendingUp,
  Upload,
  BarChart3
} from "lucide-react";
import { t } from "@/lib/i18n";
import ReportForm from "./report-form";
import ProgressChart from "./progress-chart";
import AdelLogo from "./adel-logo";

export default function OfficerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/reports"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Get user's submitted reports
  const userReports = reports?.filter((report: any) => report.submittedBy) || [];
  const pendingReports = userReports.filter((report: any) => report.status === "pending");
  const approvedReports = userReports.filter((report: any) => report.status === "approved");
  const rejectedReports = userReports.filter((report: any) => report.status === "rejected");

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Elegant Header with Glass Effect */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl blur-lg opacity-75"></div>
                <div className="relative p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl">
                  <AdelLogo size="xl" className="filter brightness-0 invert" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  ADEL
                </h1>
                <p className="text-slate-600 text-lg font-medium mt-1">Officer Portal</p>
                <p className="text-slate-500 text-sm">Submit reports and track project contributions</p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = '/api/auth/logout'}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-6 py-3 rounded-xl"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Beautiful Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
            <CardContent className="p-6 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <Star className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-3xl font-bold mb-1">
                  {approvedReports.length}
                </p>
                <p className="text-emerald-100 font-medium">Approved Reports</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
            <CardContent className="p-6 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Clock className="w-7 h-7" />
                  </div>
                  <Activity className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-3xl font-bold mb-1">
                  {pendingReports.length}
                </p>
                <p className="text-orange-100 font-medium">Pending Reports</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 via-rose-600 to-pink-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
            <CardContent className="p-6 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <XCircle className="w-7 h-7" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-3xl font-bold mb-1">
                  {rejectedReports.length}
                </p>
                <p className="text-red-100 font-medium">Rejected Reports</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
            <CardContent className="p-6 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <FileText className="w-7 h-7" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-3xl font-bold mb-1">
                  {userReports.length}
                </p>
                <p className="text-blue-100 font-medium">Total Reports</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b border-gray-200/50 bg-white/50 px-6">
              <TabsList className="grid w-full grid-cols-4 bg-transparent h-16">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl font-medium">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="projects" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl font-medium">
                  <Target className="w-4 h-4 mr-2" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl font-medium">
                  <FileText className="w-4 h-4 mr-2" />
                  My Reports
                </TabsTrigger>
                <TabsTrigger value="submit" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl font-medium">
                  <Upload className="w-4 h-4 mr-2" />
                  Submit Report
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8">
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
                    <h3 className="text-xl font-semibold text-emerald-800 mb-4">Performance Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">{approvedReports.length}</p>
                        <p className="text-emerald-700 text-sm">Approved Reports</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{pendingReports.length}</p>
                        <p className="text-orange-700 text-sm">Pending Review</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {userReports.length > 0 ? Math.round((approvedReports.length / userReports.length) * 100) : 0}%
                        </p>
                        <p className="text-blue-700 text-sm">Approval Rate</p>
                      </div>
                    </div>
                  </div>
                  <ProgressChart />
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Available Projects</h2>
                </div>
                
                <div className="grid gap-6">
                  {projects && projects.length > 0 ? (
                    (projects as any[]).map((project: any) => (
                      <Card key={project.id} className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                              <p className="text-gray-600 mb-4">{project.description || "No description provided"}</p>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Progress</p>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <Progress value={project.progress || 0} className="flex-1 h-2" />
                                    <span className="text-sm font-medium text-gray-700">{project.progress || 0}%</span>
                                  </div>
                                </div>
                                
                                {project.budget && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Budget</p>
                                    <p className="text-lg font-semibold text-gray-900">${project.budget.toFixed(2)}</p>
                                  </div>
                                )}
                                
                                {project.deadline && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Deadline</p>
                                    <p className="text-sm text-gray-700">{new Date(project.deadline).toLocaleDateString()}</p>
                                  </div>
                                )}
                              </div>

                              <div className="flex justify-between items-center">
                                <Badge variant={project.progress === 100 ? "default" : "secondary"}>
                                  {project.progress === 100 ? "Completed" : "In Progress"}
                                </Badge>
                                <ReportForm projectId={project.id} onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/reports"] })} />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
                      <CardContent className="p-8 text-center">
                        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No projects available at the moment.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">My Reports</h2>
                </div>
                
                <div className="grid gap-6">
                  {userReports.length > 0 ? (
                    userReports.map((report: any) => (
                      <Card key={report.id} className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                                <Badge 
                                  variant={
                                    report.status === "approved" ? "default" : 
                                    report.status === "rejected" ? "destructive" : 
                                    "secondary"
                                  }
                                >
                                  {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                </Badge>
                              </div>
                              
                              <p className="text-gray-600 mb-4">{report.description}</p>
                              
                              <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>Submitted: {new Date(report.createdAt).toLocaleDateString()}</span>
                                </div>
                                {report.reviewedAt && (
                                  <div className="flex items-center space-x-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Reviewed: {new Date(report.reviewedAt).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                              
                              {report.reviewNotes && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm font-medium text-gray-700 mb-1">Review Notes:</p>
                                  <p className="text-sm text-gray-600">{report.reviewNotes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
                      <CardContent className="p-8 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">You haven't submitted any reports yet.</p>
                        <ReportForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ["/api/reports"] })} />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="submit" className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit New Report</h2>
                  <p className="text-gray-600 mb-8">Create and submit a new progress report for review</p>
                </div>
                
                <div className="max-w-2xl mx-auto">
                  <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
                    <CardContent className="p-8">
                      <ReportForm onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
                        toast({
                          title: "Success!",
                          description: "Your report has been submitted for review",
                        });
                      }} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}