import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Check,
  X,
  Eye,
  Calendar,
  User,
  FileText,
  Download,
  Filter,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ReportDetailsProps {
  report: any;
  onStatusUpdate?: () => void;
}

function ReportDetailsDialog({ report, onStatusUpdate }: ReportDetailsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reviewNotes, setReviewNotes] = useState("");
  
  // Fetch organization members to get officer names
  const { data: organizationMembers = [] } = useQuery({
    queryKey: ["/api/organization/members"],
  });
  
  // Fetch projects to get project names
  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
  });
  
  // Function to get officer name by ID
  const getOfficerName = (userId: number) => {
    const officer = organizationMembers.find((member: any) => member.id === userId);
    if (officer) {
      const fullName = `${officer.firstName || ''} ${officer.lastName || ''}`.trim();
      return fullName || officer.email;
    }
    return `User #${userId}`;
  };
  
  // Function to get project name by ID
  const getProjectName = (projectId: number) => {
    const project = projects.find((proj: any) => proj.id === projectId);
    return project ? project.name : `Project #${projectId}`;
  };

  const handleDownloadFile = async (file: any) => {
    try {
      const response = await fetch(`/api/files/${file.filename}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.originalName || file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Could not download the file. Please try again.",
        variant: "destructive",
      });
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ status, notes }: { status: string; notes?: string }) => {
      const response = await apiRequest("PATCH", `/api/reports/${report.id}/status`, {
        status,
        reviewNotes: notes,
      });
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reports/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: `Report ${variables.status} successfully!`,
      });
      setIsOpen(false);
      onStatusUpdate?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update report status",
        variant: "destructive",
      });
    },
  });

  const handleApprove = () => {
    updateStatusMutation.mutate({
      status: "approved",
      notes: reviewNotes.trim() || undefined,
    });
  };

  const handleReject = () => {
    if (!reviewNotes.trim()) {
      toast({
        title: "Review notes required",
        description: "Please provide feedback when rejecting a report",
        variant: "destructive",
      });
      return;
    }
    
    updateStatusMutation.mutate({
      status: "rejected",
      notes: reviewNotes.trim(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-4 h-4 mr-1" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Report Review: {report.title}</span>
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
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Metadata */}
          <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-2" />
                <span>Submitted by: {getOfficerName(report.submittedBy)}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Date: {new Date(report.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Project ID:</span> #{report.projectId}
              </div>
              {report.reviewedAt && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Reviewed:</span> {new Date(report.reviewedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          {/* Report Content */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Report Content</h4>
            <div className="p-4 bg-white border rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {report.content}
              </p>
            </div>
          </div>

          {/* Attachments */}
          {report.files && report.files.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Attachments ({report.files.length})
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {report.files.map((file: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.originalName || `File ${index + 1}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Unknown size"}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownloadFile(file)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previous Review Notes */}
          {report.reviewNotes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Previous Review Notes</h4>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-gray-700">{report.reviewNotes}</p>
              </div>
            </div>
          )}

          {/* Review Section (only for pending reports) */}
          {report.status === "pending" && (
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-3">Review & Decision</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reviewNotes">Review Notes</Label>
                  <Textarea
                    id="reviewNotes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="mt-1"
                    placeholder="Provide feedback on the report quality, completeness, and accuracy..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Review notes are required when rejecting a report and optional when approving.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={updateStatusMutation.isPending}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject Report
                  </Button>
                  <Button
                    className="bg-green-500 hover:bg-green-600"
                    onClick={handleApprove}
                    disabled={updateStatusMutation.isPending}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Report
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ReportApproval() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: allReports, isLoading: allReportsLoading } = useQuery({
    queryKey: ["/api/reports"],
  });

  const { data: pendingReports, isLoading: pendingLoading } = useQuery({
    queryKey: ["/api/reports/pending"],
  });
  
  // Fetch organization members to get officer names
  const { data: organizationMembers = [] } = useQuery({
    queryKey: ["/api/organization/members"],
  });
  
  // Function to get officer name by ID
  const getOfficerName = (userId: number) => {
    const officer = organizationMembers.find((member: any) => member.id === userId);
    if (officer) {
      const fullName = `${officer.firstName || ''} ${officer.lastName || ''}`.trim();
      return fullName || officer.email;
    }
    return `User #${userId}`;
  };

  const filteredReports = allReports?.filter((report: any) => {
    if (statusFilter === "all") return true;
    return report.status === statusFilter;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-orange-100 text-orange-600";
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review ({pendingReports?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Reports ({allReports?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                Reports Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : pendingReports?.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600">No reports are currently pending review.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingReports?.map((report: any) => (
                    <Card key={report.id} className="border-l-4 border-orange-500">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">{report.title}</h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {report.content}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {getOfficerName(report.submittedBy)}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(report.submittedAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <FileText className="w-3 h-3 mr-1" />
                                getProjectName(report.projectId)
                              </div>
                              {report.files && report.files.length > 0 && (
                                <div>
                                  {report.files.length} attachment{report.files.length !== 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge className="bg-orange-100 text-orange-600">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                            <ReportDetailsDialog report={report} />
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

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Reports</CardTitle>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {allReportsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                  <p className="text-gray-600">
                    {statusFilter === "all" 
                      ? "No reports have been submitted yet." 
                      : `No ${statusFilter} reports found.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report: any) => (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">{report.title}</h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {report.content}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {getOfficerName(report.submittedBy)}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(report.submittedAt).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <FileText className="w-3 h-3 mr-1" />
                                getProjectName(report.projectId)
                              </div>
                              {report.files && report.files.length > 0 && (
                                <div>
                                  {report.files.length} attachment{report.files.length !== 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge className={getStatusColor(report.status)}>
                              {getStatusIcon(report.status)}
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </Badge>
                            <ReportDetailsDialog report={report} />
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
      </Tabs>
    </div>
  );
}
