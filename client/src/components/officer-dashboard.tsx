import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReportForm from "@/components/report-form";
import ProgressChart from "@/components/progress-chart";
import AdelLogo from "@/components/adel-logo";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { t } from "@/lib/i18n";
import {
  ListTodo,
  FileText,
  Clock,
  Plus,
  List,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function OfficerDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/reports"],
  });

  // Get user's submitted reports - no filtering needed since API already filters for officers
  const userReports = Array.isArray(reports) ? reports : [];
  const draftReports = userReports.filter((report: any) => report.status === "draft");
  const submittedReports = userReports.filter((report: any) => report.status === "submitted");
  const approvedReports = userReports.filter((report: any) => report.status === "approved");
  const rejectedReports = userReports.filter((report: any) => report.status === "rejected");

  // Debug log to check report statuses
  console.log("=== OFFICER DASHBOARD DEBUG ===");
  console.log("All reports from API:", reports);
  console.log("User reports:", userReports.map(r => ({ id: r.id, title: r.title, status: r.status, submittedBy: r.submittedBy })));
  console.log("Submitted reports count:", submittedReports.length);
  console.log("Submitted reports:", submittedReports.map(r => ({ id: r.id, title: r.title, status: r.status })));
  console.log("Current user from useAuth:", user);
  console.log("User ID for filtering:", user?.id);
  console.log("=== END DEBUG ===");

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

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Logo */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <AdelLogo size="lg" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">ADEL</span>
        </div>
        <Button
          onClick={() => window.location.href = '/api/auth/logout'}
          variant="outline"
          className="text-sm"
        >
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(projects) ? projects.length : 0}
                </p>
                <p className="text-sm text-gray-600">{t('dashboard.myProjects')}</p>
              </div>
              <ListTodo className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {userReports.length || 0}
                </p>
                <p className="text-sm text-gray-600">{t('dashboard.reportsSubmitted')}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {submittedReports?.length || 0}
                </p>
                <p className="text-sm text-gray-600">{t('dashboard.pendingReview')}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
          <TabsTrigger value="analytics">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 h-auto">
                      <Plus className="w-5 h-5 mr-2" />
                      {t('dashboard.submitNewReport')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Submit New Report</DialogTitle>
                    </DialogHeader>
                    <ReportForm />
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="w-full p-4 h-auto">
                  <List className="w-5 h-5 mr-2" />
                  {t('dashboard.viewMyProjects')}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Submissions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.recentSubmissions')}</CardTitle>
              </CardHeader>
              <CardContent>
                {reportsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : userReports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No reports submitted yet</p>
                    <p className="text-sm">Submit your first report to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userReports.slice(0, 3).map((report: any) => (
                      <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">{report.title}</div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                report.status === "approved" ? "default" :
                                report.status === "rejected" ? "destructive" :
                                report.status === "submitted" ? "secondary" : "outline"
                              }
                              className={
                                report.status === "approved" ? "bg-green-100 text-green-600" :
                                report.status === "rejected" ? "bg-red-100 text-red-600" :
                                report.status === "submitted" ? "bg-orange-100 text-orange-600" :
                                "bg-gray-100 text-gray-600"
                              }
                            >
                              {report.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                              {report.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                              {report.status === "submitted" && <AlertCircle className="w-3 h-3 mr-1" />}
                              {report.status === "draft" && <AlertCircle className="w-3 h-3 mr-1" />}
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                            {report.status === "submitted" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => recallReportMutation.mutate(report.id)}
                                disabled={recallReportMutation.isPending}
                                className="text-xs h-7 px-2 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 font-medium"
                              >
                                📞 Call Back
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">Project #{report.projectId}</div>
                        {report.submittedAt && (
                          <div className="text-xs text-gray-400 mt-1 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Submitted {new Date(report.submittedAt).toLocaleDateString()}
                          </div>
                        )}
                        {report.status === "draft" && (
                          <div className="text-xs text-yellow-600 mt-1 flex items-center">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Draft - Not yet submitted
                          </div>
                        )}
                        {report.reviewNotes && (
                          <div className="mt-2 p-2 bg-white rounded border-l-4 border-blue-200">
                            <p className="text-xs text-gray-600 font-medium">Review Notes:</p>
                            <p className="text-xs text-gray-500">{report.reviewNotes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>My Assigned Projects</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (!projects || (Array.isArray(projects) && projects.length === 0)) ? (
                <div className="text-center py-8 text-gray-500">
                  <ListTodo className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No projects assigned yet</p>
                  <p className="text-sm">Wait for your admin to assign you to projects</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {(Array.isArray(projects) ? projects : []).map((project: any) => (
                    <Card key={project.id} className="border-l-4 border-blue-500">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                        <div className="space-y-2 text-xs text-gray-500">
                          {project.budget && (
                            <div className="flex items-center">
                              <span className="font-medium">Budget:</span>
                              <span className="ml-1">${parseFloat(project.budget).toLocaleString()}</span>
                            </div>
                          )}
                          {project.deadline && (
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span className="font-medium">Deadline:</span>
                              <span className="ml-1">{new Date(project.deadline).toLocaleDateString()}</span>
                            </div>
                          )}
                          {project.goals && (
                            <div>
                              <span className="font-medium">Goals:</span>
                              <p className="mt-1">{project.goals}</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Reports: {userReports.filter((r: any) => r.projectId === project.id).length}
                            </span>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Plus className="w-3 h-3 mr-1" />
                                  Submit Report
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Submit Report - {project.name}</DialogTitle>
                                </DialogHeader>
                                <ReportForm projectId={project.id} />
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-6">
            {/* Report Status Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{approvedReports.length}</p>
                  <p className="text-sm text-gray-600">Approved Reports</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <AlertCircle className="w-8 h-8 text-orange-500" />
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{submittedReports.length}</p>
                  <p className="text-sm text-gray-600">Awaiting Review</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-2xl font-bold text-red-600">{rejectedReports.length}</p>
                  <p className="text-sm text-gray-600">Rejected Reports</p>
                </CardContent>
              </Card>
            </div>

            {/* All Reports */}
            <Card>
              <CardHeader>
                <CardTitle>All My Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {userReports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No reports submitted yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userReports.map((report: any) => (
                      <div key={report.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{report.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{report.content}</p>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              Submitted {new Date(report.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={
                                  report.status === "approved" ? "default" :
                                  report.status === "rejected" ? "destructive" :
                                  report.status === "submitted" ? "secondary" : "outline"
                                }
                                className={
                                  report.status === "approved" ? "bg-green-100 text-green-600" :
                                  report.status === "rejected" ? "bg-red-100 text-red-600" :
                                  report.status === "submitted" ? "bg-orange-100 text-orange-600" :
                                  "bg-gray-100 text-gray-600"
                                }
                              >
                                {report.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                                {report.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                                {report.status === "submitted" && <AlertCircle className="w-3 h-3 mr-1" />}
                                {report.status === "draft" && <AlertCircle className="w-3 h-3 mr-1" />}
                                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                              </Badge>
                              {/* Call Back button for submitted reports */}
                              {report.status === "submitted" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    console.log("Recalling report:", report.id);
                                    recallReportMutation.mutate(report.id);
                                  }}
                                  disabled={recallReportMutation.isPending}
                                  className="text-xs h-7 px-2 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 font-medium border-2"
                                >
                                  📞 Call Back
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {report.files && report.files.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Attachments:</p>
                            <div className="flex flex-wrap gap-2">
                              {report.files.map((file: any, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {file.originalName || `File ${index + 1}`}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {report.reviewNotes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-blue-200">
                            <p className="text-xs text-gray-600 font-medium mb-1">Review Notes:</p>
                            <p className="text-sm text-gray-700">{report.reviewNotes}</p>
                            {report.reviewedAt && (
                              <p className="text-xs text-gray-500 mt-2">
                                Reviewed {new Date(report.reviewedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <ProgressChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
