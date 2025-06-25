import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, CheckCircle, XCircle, Download, Upload, FileText } from "lucide-react";

interface BulkProjectOperationsProps {
  projects: any[];
  onRefresh?: () => void;
}

export function BulkProjectOperations({ projects, onRefresh }: BulkProjectOperationsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const bulkDeleteMutation = useMutation({
    mutationFn: async (projectIds: number[]) => {
      const response = await apiRequest("DELETE", "/api/projects/bulk", { projectIds });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: `${selectedProjects.length} projects deleted successfully`,
      });
      setSelectedProjects([]);
      setIsOpen(false);
      onRefresh?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete projects",
        variant: "destructive",
      });
    },
  });

  const bulkStatusUpdateMutation = useMutation({
    mutationFn: async ({ projectIds, status }: { projectIds: number[]; status: string }) => {
      const response = await apiRequest("PATCH", "/api/projects/bulk-status", { projectIds, status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: `${selectedProjects.length} projects updated successfully`,
      });
      setSelectedProjects([]);
      onRefresh?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update projects",
        variant: "destructive",
      });
    },
  });

  const exportProjectsMutation = useMutation({
    mutationFn: async (projectIds: number[]) => {
      const response = await fetch("/api/projects/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectIds }),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to export projects");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `projects-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Projects exported successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to export projects",
        variant: "destructive",
      });
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(projects.map(p => p.id));
    } else {
      setSelectedProjects([]);
    }
  };

  const handleSelectProject = (projectId: number, checked: boolean) => {
    if (checked) {
      setSelectedProjects([...selectedProjects, projectId]);
    } else {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedProjects.length === 0) return;
    bulkDeleteMutation.mutate(selectedProjects);
  };

  const handleBulkStatusUpdate = (status: string) => {
    if (selectedProjects.length === 0) return;
    bulkStatusUpdateMutation.mutate({ projectIds: selectedProjects, status });
  };

  const handleExport = () => {
    const projectIds = selectedProjects.length > 0 ? selectedProjects : projects.map(p => p.id);
    exportProjectsMutation.mutate(projectIds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4">
          <FileText className="w-4 h-4 mr-2" />
          Bulk Operations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Project Operations</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Selection Controls */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={selectedProjects.length === projects.length && projects.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                Select All ({selectedProjects.length} of {projects.length} selected)
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={exportProjectsMutation.isPending}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Select onValueChange={handleBulkStatusUpdate}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={selectedProjects.length === 0 || bulkDeleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>

          {/* Project List */}
          <div className="space-y-2">
            {projects.map((project) => (
              <Card key={project.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={(checked) => handleSelectProject(project.id, checked as boolean)}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{project.name}</h4>
                      <Badge variant={project.status === "active" ? "default" : "secondary"}>
                        {project.status || "active"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      {project.budget && <span>Budget: ${project.budget}</span>}
                      {project.deadline && (
                        <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface BulkReportOperationsProps {
  reports: any[];
  onRefresh?: () => void;
}

export function BulkReportOperations({ reports, onRefresh }: BulkReportOperationsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReports, setSelectedReports] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const bulkApproveMutation = useMutation({
    mutationFn: async (reportIds: number[]) => {
      const response = await apiRequest("PATCH", "/api/reports/bulk-approve", { reportIds });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: `${selectedReports.length} reports approved successfully`,
      });
      setSelectedReports([]);
      onRefresh?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve reports",
        variant: "destructive",
      });
    },
  });

  const bulkRejectMutation = useMutation({
    mutationFn: async (reportIds: number[]) => {
      const response = await apiRequest("PATCH", "/api/reports/bulk-reject", { reportIds });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: `${selectedReports.length} reports rejected successfully`,
      });
      setSelectedReports([]);
      onRefresh?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject reports",
        variant: "destructive",
      });
    },
  });

  const exportReportsMutation = useMutation({
    mutationFn: async (reportIds: number[]) => {
      const response = await fetch("/api/reports/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportIds }),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to export reports");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reports-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Reports exported successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to export reports",
        variant: "destructive",
      });
    },
  });

  const pendingReports = reports.filter(r => r.status === "pending");
  const allReports = reports; // Include all reports for bulk operations

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(allReports.map(r => r.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleSelectReport = (reportId: number, checked: boolean) => {
    if (checked) {
      setSelectedReports([...selectedReports, reportId]);
    } else {
      setSelectedReports(selectedReports.filter(id => id !== reportId));
    }
  };

  const handleBulkApprove = () => {
    if (selectedReports.length === 0) return;
    bulkApproveMutation.mutate(selectedReports);
  };

  const handleBulkReject = () => {
    if (selectedReports.length === 0) return;
    bulkRejectMutation.mutate(selectedReports);
  };

  const handleExport = () => {
    const reportIds = selectedReports.length > 0 ? selectedReports : reports.map(r => r.id);
    exportReportsMutation.mutate(reportIds);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mb-4">
          <FileText className="w-4 h-4 mr-2" />
          Bulk Report Operations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Report Operations</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Selection Controls */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={selectedReports.length === pendingReports.length && pendingReports.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                Select All Reports ({selectedReports.length} of {allReports.length} selected)
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={exportReportsMutation.isPending}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              
              <Button
                variant="default"
                size="sm"
                onClick={handleBulkApprove}
                disabled={selectedReports.length === 0 || bulkApproveMutation.isPending || 
                         selectedReports.every(id => reports.find(r => r.id === id)?.status === "approved")}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Selected
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkReject}
                disabled={selectedReports.length === 0 || bulkRejectMutation.isPending ||
                         selectedReports.every(id => reports.find(r => r.id === id)?.status === "rejected")}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject Selected
              </Button>
            </div>
          </div>

          {/* Report List */}
          <div className="space-y-2">
            {allReports.map((report) => (
              <Card key={report.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={(checked) => handleSelectReport(report.id, checked as boolean)}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{report.title}</h4>
                      <Badge 
                        variant={
                          report.status === "approved" ? "default" :
                          report.status === "rejected" ? "destructive" :
                          "secondary"
                        }
                        className={
                          report.status === "approved" ? "bg-green-100 text-green-600" :
                          report.status === "rejected" ? "bg-red-100 text-red-600" :
                          "bg-orange-100 text-orange-600"
                        }
                      >
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{report.content?.substring(0, 100)}...</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Submitted: {new Date(report.submittedAt || report.createdAt).toLocaleDateString()}</span>
                      {report.projectName && <span>Project: {report.projectName}</span>}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {allReports.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No reports available for bulk operations
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}