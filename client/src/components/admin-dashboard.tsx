import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Projector, 
  Clock, 
  Calendar, 
  DollarSign,
  Target,
  TrendingUp,
  FileText,
  BarChart3
} from "lucide-react";
import { t } from "@/lib/i18n";
import OrganizationInfo from "./organization-info";
import ProjectForm from "./project-form";
import ReportApproval from "./report-approval";
import ProgressChart from "./progress-chart";
import { BulkProjectOperations, BulkReportOperations } from "./bulk-operations";

export default function AdminDashboard() {
  const { data: projects, isLoading: projectsLoading, refetch } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports, isLoading: reportsLoading, refetch: refetchReports } = useQuery({
    queryKey: ["/api/reports"],
  });

  const { data: pendingReports } = useQuery({
    queryKey: ["/api/reports/pending"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (projectsLoading || reportsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-9">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="projects" className="text-sm">Projects</TabsTrigger>
          <TabsTrigger value="reports" className="text-sm">Reports</TabsTrigger>
          <TabsTrigger value="team" className="text-sm">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OrganizationInfo />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Quick Actions */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2">
                <ProjectForm />
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                  <Users className="w-3 h-3 mr-2" />
                  View Team
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8">
                  <BarChart3 className="w-3 h-3 mr-2" />
                  Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Recent Projects</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                {(projects as any[])?.length === 0 ? (
                  <div className="text-center py-6">
                    <Projector className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No projects yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(projects as any[])?.slice(0, 3).map((project: any) => (
                      <div key={project.id} className="p-2 bg-gray-50 rounded text-xs">
                        <div className="font-medium truncate">{project.name}</div>
                        <div className="text-gray-500">
                          {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pending Reports */}
            <Card className="border border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-700">Pending Reports</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                {(pendingReports as any[])?.length === 0 ? (
                  <div className="text-center py-6">
                    <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">All clear</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {(pendingReports as any[])?.slice(0, 3).map((report: any) => (
                      <div key={report.id} className="p-2 bg-orange-50 rounded text-xs border border-orange-200">
                        <div className="font-medium truncate">{report.title}</div>
                        <div className="text-orange-600">
                          {new Date(report.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <ProgressChart />
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">All Projects</h2>
            <div className="flex space-x-2">
              <BulkProjectOperations projects={projects as any[] || []} />
              <ProjectForm />
            </div>
          </div>
          
          {(projects as any[])?.length === 0 ? (
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

        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Report Management</h2>
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