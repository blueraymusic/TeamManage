import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectForm from "@/components/project-form";
import ReportApproval from "@/components/report-approval";
import ProgressChart from "@/components/progress-chart";
import OrganizationInfo from "@/components/organization-info";
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
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats as any)?.activeProjects || 0}
                </p>
                <p className="text-sm text-gray-600">{t('dashboard.activeProjects')}</p>
              </div>
              <Projector className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats as any)?.pendingReports || 0}
                </p>
                <p className="text-sm text-gray-600">{t('dashboard.pendingReports')}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats as any)?.teamMembers || 0}
                </p>
                <p className="text-sm text-gray-600">{t('dashboard.teamMembers')}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ${(stats as any)?.totalBudget?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-600">{t('dashboard.totalBudget')}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Organization Info */}
          <OrganizationInfo />
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('dashboard.recentProjects')}
                  <ProjectForm />
                </CardTitle>
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
                ) : (projects as any[])?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Projector className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No projects created yet</p>
                    <p className="text-sm">Create your first project to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(projects as any[])?.slice(0, 3).map((project: any) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{project.name}</div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-500">
                            {Math.floor(Math.random() * 100)}%
                          </div>
                          <Progress value={Math.floor(Math.random() * 100)} className="w-16 h-2 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.pendingApprovals')}</CardTitle>
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
                ) : (pendingReports as any[])?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No pending reports</p>
                    <p className="text-sm">All reports are up to date</p>
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

        <TabsContent value="projects" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Project Management</h2>
            <ProjectForm />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
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
              ) : (projects as any[])?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Projector className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p className="text-sm mb-4">Create your first project to get started with managing your NGO initiatives</p>
                  <ProjectForm />
                </div>
              ) : (
                <div className="grid gap-4">
                  {(projects as any[])?.map((project: any) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                          {project.description && (
                            <p className="text-gray-600 mb-3">{project.description}</p>
                          )}
                        </div>
                        <Badge variant="outline" className="ml-4">
                          {project.status || 'Active'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {project.budget && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm">
                              <span className="font-medium">Budget:</span> ${parseFloat(project.budget).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {project.deadline && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="text-sm">
                              <span className="font-medium">Deadline:</span> {new Date(project.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">
                            <span className="font-medium">Reports:</span> {(reports as any[])?.filter((r: any) => r.projectId === project.id).length || 0}
                          </span>
                        </div>
                      </div>
                      
                      {project.goals && (
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-orange-600" />
                            <span className="text-sm font-medium">Goals:</span>
                          </div>
                          <p className="text-sm text-gray-600 pl-6">{project.goals}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          Created: {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4 mr-1" />
                            View Reports
                          </Button>
                          <Button size="sm" variant="outline">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <ReportApproval />
        </TabsContent>

        <TabsContent value="analytics">
          <ProgressChart />
        </TabsContent>
      </Tabs>
    </div>
  );
}
