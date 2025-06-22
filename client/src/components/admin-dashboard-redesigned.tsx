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
  CheckCircle2,
  LogOut,
  Plus,
  Star,
  ArrowUpRight,
  Activity
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
  const [editBudget, setEditBudget] = useState("");
  const [editBudgetUsed, setEditBudgetUsed] = useState("");
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
    setViewingProject(project);
    setIsViewDialogOpen(true);
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditProgress([project.progress || 0]);
    setEditBudget(project.budget?.toString() || "");
    setEditBudgetUsed(project.budgetUsed?.toString() || "0");
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
        budget: editBudget ? parseFloat(editBudget) : null,
        budgetUsed: editBudgetUsed ? parseFloat(editBudgetUsed) : 0,
        status: editingProject.status,
        goals: editingProject.goals,
      },
    });
  };

  const handleDeleteProject = (projectId: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(projectId);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Elegant Header with Glass Effect */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-lg opacity-75"></div>
                <div className="relative p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl">
                  <AdelLogo size="xl" className="filter brightness-0 invert" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ADEL
                </h1>
                <p className="text-slate-600 text-lg font-medium mt-1">Administrative Portal</p>
                <p className="text-slate-500 text-sm">Manage projects, teams, and organizational growth</p>
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
          <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
            <CardContent className="p-6 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Projector className="w-7 h-7" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-3xl font-bold mb-1">
                  {(stats as any)?.activeProjects || 0}
                </p>
                <p className="text-blue-100 font-medium">Active Projects</p>
              </div>
            </CardContent>
          </Card>

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
                  {(stats as any)?.completedProjects || 0}
                </p>
                <p className="text-green-100 font-medium">Completed Projects</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
            <CardContent className="p-6 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <FileText className="w-7 h-7" />
                  </div>
                  <Activity className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-3xl font-bold mb-1">
                  {(pendingReports as any)?.length || 0}
                </p>
                <p className="text-orange-100 font-medium">Pending Reports</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
            <CardContent className="p-6 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <Users className="w-7 h-7" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <p className="text-3xl font-bold mb-1">
                  {(stats as any)?.totalMembers || 0}
                </p>
                <p className="text-purple-100 font-medium">Team Members</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
          <Tabs defaultValue="overview" className="w-full">
            <div className="border-b border-gray-200/50 bg-white/50 px-6">
              <TabsList className="grid w-full grid-cols-5 bg-transparent h-16">
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
                <TabsTrigger value="team" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="organization" className="data-[state=active]:bg-white data-[state=active]:shadow-lg rounded-xl font-medium">
                  <Target className="w-4 h-4 mr-2" />
                  Organization
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8">
              <TabsContent value="overview" className="space-y-6">
                <ProgressChart />
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
                  <div className="flex space-x-3">
                    <BulkProjectOperations projects={projects || []} onRefresh={refetch} />
                    <ProjectForm onSuccess={refetch} />
                  </div>
                </div>
                
                <div className="grid gap-6">
                  {(projects as any)?.map((project: any) => (
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

                            <div className="flex space-x-2">
                              <Badge variant={project.progress === 100 ? "default" : "secondary"}>
                                {project.progress === 100 ? "Completed" : "In Progress"}
                              </Badge>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(project)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProject(project)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Report Management</h2>
                  <BulkReportOperations reports={reports || []} onRefresh={refetchReports} />
                </div>
                <ReportApproval />
              </TabsContent>

              <TabsContent value="team" className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
                <p className="text-gray-600">Team management features will be available soon.</p>
              </TabsContent>

              <TabsContent value="organization" className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Organization Settings</h2>
                <OrganizationInfo />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Edit Project Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-white/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Edit Project</DialogTitle>
              <DialogDescription>
                Update the project name, budget, and progress percentage.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="font-medium">Project Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter project name"
                  className="bg-white/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-budget" className="font-medium">Budget ($)</Label>
                <Input
                  id="edit-budget"
                  type="number"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  placeholder="Enter budget amount"
                  min="0"
                  step="0.01"
                  className="bg-white/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-budget-used" className="font-medium">Budget Used ($)</Label>
                <Input
                  id="edit-budget-used"
                  type="number"
                  value={editBudgetUsed}
                  onChange={(e) => setEditBudgetUsed(e.target.value)}
                  placeholder="Enter amount spent"
                  min="0"
                  step="0.01"
                  className="bg-white/50"
                />
                {editBudget && parseFloat(editBudget) > 0 && (
                  <div className="space-y-2 mt-3">
                    <Progress 
                      value={
                        editBudgetUsed && parseFloat(editBudgetUsed) > 0
                          ? Math.min((parseFloat(editBudgetUsed) / parseFloat(editBudget)) * 100, 100)
                          : 0
                      } 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>
                        {editBudget && parseFloat(editBudget) > 0
                          ? Math.round((parseFloat(editBudgetUsed || "0") / parseFloat(editBudget)) * 100)
                          : 0}% used
                      </span>
                      <span>
                        ${Math.max(0, parseFloat(editBudget || "0") - parseFloat(editBudgetUsed || "0")).toFixed(2)} remaining
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-progress" className="font-medium">
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
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateProject}
                disabled={updateProjectMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {updateProjectMutation.isPending ? "Updating..." : "Update Project"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Project Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl border border-white/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Project Details</DialogTitle>
            </DialogHeader>
            {viewingProject && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{viewingProject.name}</h3>
                  <p className="text-gray-600">{viewingProject.description || "No description provided"}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Progress</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={viewingProject.progress || 0} className="flex-1" />
                      <span className="text-sm font-medium">{viewingProject.progress || 0}%</span>
                    </div>
                  </div>
                  
                  {viewingProject.budget && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Budget</p>
                      <p className="text-lg font-semibold">${viewingProject.budget.toFixed(2)}</p>
                    </div>
                  )}
                </div>

                {viewingProject.deadline && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Deadline</p>
                    <p className="text-gray-700">{new Date(viewingProject.deadline).toLocaleDateString()}</p>
                  </div>
                )}

                {viewingProject.goals && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Goals & Objectives</p>
                    <p className="text-gray-700">{viewingProject.goals}</p>
                  </div>
                )}
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
    </div>
  );
}