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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
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
  Activity,
  Mail,
  Download
} from "lucide-react";
import { t } from "@/lib/i18n";
import { useLogout, useAuth } from "@/hooks/use-auth";
import OrganizationInfo from "./organization-info";
import ProjectForm from "./project-form";
import ReportApproval from "./report-approval";
import ProgressChart from "./progress-chart";
import AdminChatInterface from "./admin-chat-interface";
import { BulkProjectOperations, BulkReportOperations } from "./bulk-operations";
import MeetingBookingsManager from "./meeting-bookings-manager";
import AdelLogo from "./adel-logo";
import DeadlineBadge from "./deadline-badge";
import OverdueNotifications from "./overdue-notifications";
import AnalyticsDashboard from "./analytics-dashboard";
import SmartNotifications from "./smart-notifications";
import ProjectTimeline from "./project-timeline";
import PDFReportPreview from "./pdf-report-preview";
import FloatingMessageNotification from "./floating-message-notification";


export default function AdminDashboard() {
  const { toast } = useToast();
  const logout = useLogout();
  const { user, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProject, setEditingProject] = useState<any>(null);

  // Debug logging for activeTab changes
  useEffect(() => {
    console.log("AdminDashboard - ActiveTab changed to:", activeTab, "UserRole:", user?.role);
  }, [activeTab, user?.role]);
  const [editName, setEditName] = useState("");
  const [editProgress, setEditProgress] = useState([0]);
  const [editBudget, setEditBudget] = useState("");
  const [editBudgetUsed, setEditBudgetUsed] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isPDFPreviewOpen, setIsPDFPreviewOpen] = useState(false);
  
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

  // Get unread message count for notification
  const { data: unreadMessages } = useQuery({
    queryKey: ["/api/messages/unread"],
  });

  const { data: organization } = useQuery({
    queryKey: ["/api/organization"],
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
    setEditDeadline(project.deadline ? (() => {
      const date = new Date(project.deadline);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    })() : "");
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
        deadline: editDeadline || null,
        budget: editBudget ? parseFloat(editBudget) : null,
        budgetUsed: editBudgetUsed ? parseFloat(editBudgetUsed) : 0,
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
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage projects and team</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  disabled={logout.isPending}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {logout.isPending ? "Signing out..." : "Logout"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to sign out? You'll need to log in again to access your dashboard.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                  >
                    {logout.isPending ? "Signing out..." : "Sign Out"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
                    {(stats as any)?.activeProjects || 0}
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
                    {(stats as any)?.completedProjects || 0}
                  </p>
                  <p className="text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {(pendingReports as any)?.length || 0}
                  </p>
                  <p className="text-gray-600">Pending Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {(stats as any)?.teamMembers || 0}
                  </p>
                  <p className="text-gray-600">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Simple Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200 px-4">
              <TabsList className="grid w-full grid-cols-6 bg-transparent h-12">
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
                  {unreadMessages && unreadMessages.count > 0 && activeTab !== "messages" && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center animate-notificationPulse animate-slideInRight bg-red-500 text-white border-2 border-white shadow-lg"
                    >
                      {unreadMessages.count}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="team" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  Team
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Dashboard Overview</h2>
                <Button
                  onClick={() => setIsPDFPreviewOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Analysis
                </Button>
              </div>
              
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Progress Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProgressChart />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Project Management</h2>
                <div className="flex space-x-3">
                  <BulkProjectOperations projects={projects || []} onRefresh={refetch} />
                  <ProjectForm onSuccess={refetch} />
                </div>
              </div>

              {/* Overdue Notifications */}
              <OverdueNotifications />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(projects as any)?.map((project: any) => (
                  <Card key={project.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-slate-800">{project.name}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
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
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm text-slate-600">{project.description}</p>
                          <div className="flex items-center gap-2">
                            <DeadlineBadge project={project} />
                            <Badge variant={project.status === 'active' ? 'default' : project.status === 'overdue' ? 'destructive' : 'secondary'}>
                              {project.status}
                            </Badge>
                          </div>
                        </div>
                        
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
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reports" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Report Management</h2>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => setIsPDFPreviewOpen(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>PDF Preview</span>
                  </Button>
                  <BulkReportOperations reports={reports || []} onRefresh={refetchReports} />
                </div>
              </div>
              {/* Reports List - Shows more reports for admin */}
              <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
                <ReportApproval />
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <AnalyticsDashboard userRole="admin" />
                </div>
                <div className="space-y-6">
                  <SmartNotifications userRole="admin" />
                  <ProjectTimeline />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="messages" className="p-6">
              <AdminChatInterface />
            </TabsContent>

            <TabsContent value="team" className="p-6 space-y-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Add Team Member</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => {
                      const orgData = organization as any;
                      if (orgData?.code) {
                        const subject = "Invitation to Join Organization - ADEL Platform";
                        const body = `Hello,

You are invited to join our organization on the ADEL platform.

Organization Details:
- Name: ${orgData.name || 'Our Organization'}
- Join Code: ${orgData.code}

To join:
1. Visit the ADEL platform
2. Click "Get Started" 
3. Select "Officer" role
4. Enter the organization code: ${orgData.code}

The ADEL platform helps NGOs manage projects, track progress, and collaborate effectively.

Best regards,
${orgData.name || 'Organization'} Team`;
                        
                        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      } else {
                        toast({
                          title: "Error",
                          description: "Organization data not loaded yet. Please try again.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="w-full"
                    disabled={!organization}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation Email
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Opens your email client with a pre-written invitation containing the organization code
                  </p>
                </CardContent>
              </Card>
              <OrganizationInfo />
            </TabsContent>

            <TabsContent value="settings" className="p-6">
              <Card className="bg-white border border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800">Organization Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Organization configuration and settings will be available here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project details and progress.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div>
              <Label>Progress: {editProgress[0]}%</Label>
              <Slider
                value={editProgress}
                onValueChange={setEditProgress}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-budget">Budget</Label>
                <Input
                  id="edit-budget"
                  type="number"
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-budget-used">Budget Used</Label>
                <Input
                  id="edit-budget-used"
                  type="number"
                  value={editBudgetUsed}
                  onChange={(e) => setEditBudgetUsed(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-deadline">New Deadline</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-original-deadline">Original Deadline</Label>
                <Input
                  id="edit-original-deadline"
                  type="date"
                  value={editingProject?.deadline ? (() => {
                    const date = new Date(editingProject.deadline);
                    // Ensure we get the correct local date without timezone issues
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                  })() : ""}
                  readOnly
                  className="bg-gray-50 text-gray-600"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUpdateProject} disabled={updateProjectMutation.isPending}>
                {updateProjectMutation.isPending ? "Updating..." : "Update Project"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                <Label>Description</Label>
                <p className="text-sm text-slate-600 mt-1">
                  {viewingProject.description || "No description provided"}
                </p>
              </div>
              <div>
                <Label>Progress</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Progress value={viewingProject.progress || 0} className="flex-1" />
                  <span className="text-sm font-medium">{viewingProject.progress || 0}%</span>
                </div>
              </div>
              {viewingProject.budget && (
                <div>
                  <Label>Budget</Label>
                  <p className="text-sm text-slate-600 mt-1">
                    ${parseFloat(viewingProject.budgetUsed || 0).toFixed(2)} / ${parseFloat(viewingProject.budget).toFixed(2)} used
                  </p>
                </div>
              )}
              <div>
                <Label>Deadline</Label>
                <p className="text-sm text-slate-600 mt-1">
                  {viewingProject.deadline ? new Date(viewingProject.deadline).toLocaleDateString() : 'No deadline set'}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Report Preview Modal */}
      <PDFReportPreview 
        isOpen={isPDFPreviewOpen} 
        onClose={() => setIsPDFPreviewOpen(false)}
        organizationData={organization}
        projectsData={projects as any[]}
        reportsData={reports as any[]}
        statsData={stats}
      />

      {/* Floating Message Notification */}
      <FloatingMessageNotification 
        activeTab={activeTab}
        userRole={user?.role}
        onNavigateToMessages={() => {
          // Switch to messages tab using state management
          setActiveTab("messages");
        }}
      />
    </div>
  );
}