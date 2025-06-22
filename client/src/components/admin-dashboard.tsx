import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectForm from "@/components/project-form";
import ReportApproval from "@/components/report-approval";
import ProgressChart from "@/components/progress-chart";
import OrganizationInfo from "@/components/organization-info";
import { BulkProjectOperations, BulkReportOperations } from "@/components/bulk-operations";
import { t } from "@/lib/i18n";
import {
  Projector,
  Clock,
  Users,
  DollarSign,
  Plus,
  Calendar,
  TrendingUp,
  Target,
} from "lucide-react";

export default function AdminDashboard() {
  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: pendingReports = [], isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/reports/pending"],
  });

  const { data: reports = [], isLoading: allReportsLoading } = useQuery({
    queryKey: ["/api/reports"],
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Projector className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats as any)?.activeProjects || 0}
                </p>
                <p className="text-sm text-gray-600">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats as any)?.pendingReports || 0}
                </p>
                <p className="text-sm text-gray-600">Pending Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats as any)?.teamMembers || 1}
                </p>
                <p className="text-sm text-gray-600">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ${(stats as any)?.totalBudget?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-600">Total Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 shadow-sm p-1 rounded-lg">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 data-[state=active]:border-red-200 px-6 py-2 font-medium"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="projects" 
            className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 data-[state=active]:border-red-200 px-6 py-2 font-medium"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 data-[state=active]:border-red-200 px-6 py-2 font-medium"
          >
            Reports
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700 data-[state=active]:border-red-200 px-6 py-2 font-medium"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Organization Info */}
          <OrganizationInfo />
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Project Management */}
            <Card className="border border-gray-200">
              <CardHeader className="bg-gray-50 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Projector className="h-4 w-4 text-red-600" />
                    Projects
                  </CardTitle>
                  <ProjectForm />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                {projectsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (projects as any[])?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Projector className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">No projects created yet</p>
                    <ProjectForm />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(projects as any[])?.slice(0, 3).map((project: any) => (
                      <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 text-sm truncate">{project.name}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <Calendar className="w-3 h-3 mr-1" />
                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-medium text-gray-600">
                            {project.progress || 0}%
                          </span>
                          <Progress value={project.progress || 0} className="w-16 h-1.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card className="border border-gray-200">
              <CardHeader className="bg-gray-50 pb-3">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Clock className="h-4 w-4 text-orange-600" />
                  Pending Approvals
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {reportsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : (pendingReports as any[])?.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600">No pending reports</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(pendingReports as any[])?.slice(0, 3).map((report: any) => (
                      <div key={report.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-medium text-gray-900">{report.title}</div>
                            <div className="text-sm text-gray-600">by User #{report.submittedBy}</div>
                          </div>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-600">
                            Pending
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                            {t('dashboard.approve')}
                          </Button>
                          <Button size="sm" variant="destructive">
                            {t('dashboard.reject')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All Projects</h2>
            <div className="flex space-x-2">
              <BulkProjectOperations projects={projects as any[] || []} />
              <ProjectForm />
            </div>
          </div>
          
          {projectsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (projects as any[])?.length === 0 ? (
            <Card className="border border-gray-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Projector className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-sm text-gray-600 mb-4">Create your first project to get started</p>
                  <ProjectForm />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {(projects as any[])?.map((project: any) => (
                <Card key={project.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{project.name}</h3>
                        {project.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                        )}
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {project.status || 'Active'}
                        </Badge>
                        <div className="text-right">
                          <div className="text-xs text-gray-600 mb-1">{project.progress || 0}%</div>
                          <Progress value={project.progress || 0} className="w-16 h-1.5" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Report Management</h2>
            <BulkReportOperations reports={reports as any[] || []} />
          </div>
          <ReportApproval />
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card className="border border-gray-200">
            <CardHeader className="bg-gray-50 pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Users className="h-4 w-4 text-blue-600" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-2">No team members yet</p>
                <p className="text-xs text-gray-500">Share your organization code to invite members</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
