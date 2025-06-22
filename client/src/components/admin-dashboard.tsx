import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { 
  Users, 
  Projector, 
  Clock, 
  Calendar, 
  DollarSign,
  Target,
  TrendingUp,
  FileText,
  BarChart3,
  Edit2,
  Trash2,
  MoreHorizontal,
  CheckCircle2
} from "lucide-react";
import { t } from "@/lib/i18n";
import OrganizationInfo from "./organization-info";
import ProjectForm from "./project-form";
import ReportApproval from "./report-approval";
import ProgressChart from "./progress-chart";
import { BulkProjectOperations, BulkReportOperations } from "./bulk-operations";
import AdelLogo from "./adel-logo";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editProgress, setEditProgress] = useState([0]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
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

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ projectId, data }: { projectId: number; data: any }) => {
      await apiRequest("PUT", `/api/projects/${projectId}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditingProject(null);
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    },
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      await apiRequest("DELETE", `/api/projects/${projectId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      refetch();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const handleViewDetails = (project: any) => {
    console.log("View details clicked:", project);
    setViewingProject(project);
    setIsViewDialogOpen(true);
  };

  const handleEditProject = (project: any) => {
    console.log("Edit project clicked:", project);
    setEditingProject(project);
    setEditName(project.name);
    setEditProgress([project.progress || 0]);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProject = () => {
    if (!editingProject) return;
    
    updateProjectMutation.mutate({
      projectId: editingProject.id,
      data: {
        name: editName,
        progress: editProgress[0],
        description: editingProject.description,
        deadline: editingProject.deadline,
        budget: editingProject.budget,
        status: editingProject.status,
        goals: editingProject.goals,
      },
    });
  };

  const handleDeleteProject = (projectId: number) => {
    console.log("Delete project clicked:", projectId);
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(projectId);
    }
  };

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
      {/* Header with Logo */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <AdelLogo size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your organization's projects and reports</p>
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Projector className="w-5 h-5 text-blue-600" />
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
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats as any)?.completedProjects || 0}
                </p>
                <p className="text-sm text-gray-600">Completed Projects</p>
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
                        {project.budget && (
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">Budget</span>
                              <span className="text-gray-700">
                                ${parseFloat(project.budgetUsed || "0").toLocaleString()} / ${parseFloat(project.budget).toLocaleString()}
                              </span>
                            </div>
                            <Progress 
                              value={
                                parseFloat(project.budget) > 0 
                                  ? Math.min((parseFloat(project.budgetUsed || "0") / parseFloat(project.budget)) * 100, 100)
                                  : 0
                              } 
                              className="h-1.5"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>
                                {parseFloat(project.budget) > 0 
                                  ? Math.round((parseFloat(project.budgetUsed || "0") / parseFloat(project.budget)) * 100)
                                  : 0}% used
                              </span>
                              <span>
                                ${Math.max(0, parseFloat(project.budget) - parseFloat(project.budgetUsed || "0")).toFixed(2)} remaining
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={project.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                          {project.status || 'Active'}
                        </Badge>
                        <div className="text-right">
                          <div className="text-xs text-gray-600 mb-1">{project.progress || 0}%</div>
                          <Progress value={project.progress || 0} className="w-16 h-1.5" />
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(project)}
                            className="h-8 px-2 text-xs"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProject(project)}
                            className="h-8 px-2 text-xs"
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                            className="h-8 px-2 text-xs text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
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

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project name and progress percentage.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-progress">
                Progress: {editProgress[0]}%
              </Label>
              <Slider
                id="edit-progress"
                min={0}
                max={100}
                step={1}
                value={editProgress}
                onValueChange={setEditProgress}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProject}
              disabled={updateProjectMutation.isPending}
            >
              {updateProjectMutation.isPending ? "Updating..." : "Update Project"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Project Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Project Details</DialogTitle>
            <DialogDescription>
              Complete information about {viewingProject?.name}
            </DialogDescription>
          </DialogHeader>
          {viewingProject && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Project Name</Label>
                  <p className="text-sm text-gray-600 mt-1">{viewingProject.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant="secondary" className="mt-1">
                    {viewingProject.status || 'Active'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-600 mt-1">
                  {viewingProject.description || 'No description provided'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Budget</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {viewingProject.budget ? `$${parseFloat(viewingProject.budget).toLocaleString()}` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Deadline</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {viewingProject.deadline ? new Date(viewingProject.deadline).toLocaleDateString() : 'No deadline set'}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Progress</Label>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <span className="text-sm font-medium">{viewingProject.progress || 0}%</span>
                  </div>
                  <Progress value={viewingProject.progress || 0} className="h-2" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Goals & Objectives</Label>
                <p className="text-sm text-gray-600 mt-1">
                  {viewingProject.goals || 'No goals specified'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="mt-1">
                    {viewingProject.createdAt ? new Date(viewingProject.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="mt-1">
                    {viewingProject.updatedAt ? new Date(viewingProject.updatedAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}