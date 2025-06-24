import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, X, FileText, Image, Paperclip, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const reportSchema = z.object({
  title: z.string().min(3, "Report title must be at least 3 characters"),
  content: z.string().min(10, "Report content must be at least 10 characters"),
  projectId: z.string().min(1, "Please select a project"),
});

interface ReportFormProps {
  projectId?: number;
  onSuccess?: () => void;
}

export default function ReportForm({ projectId, onSuccess }: ReportFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      content: "",
      projectId: projectId ? projectId.toString() : "",
    },
  });

  const submitReportMutation = useMutation({
    mutationFn: async (data: z.infer<typeof reportSchema>) => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("projectId", data.projectId);
      
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/reports", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to submit report");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Report submitted successfully! It's now pending review.",
      });
      form.reset();
      setSelectedFiles([]);
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit report",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file size (10MB limit)
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="w-4 h-4" />;
    } else if (file.type.includes("pdf") || file.type.includes("document")) {
      return <FileText className="w-4 h-4" />;
    }
    return <Paperclip className="w-4 h-4" />;
  };

  const handleSubmit = (data: z.infer<typeof reportSchema>) => {
    submitReportMutation.mutate(data);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white font-medium"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Report
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit New Report</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 p-6">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title">Report Title *</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  className="mt-1"
                  placeholder="Enter report title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600">{String(form.formState.errors.title.message)}</p>
                )}
              </div>

              <div>
                <Label htmlFor="content">Report Content *</Label>
                <Textarea
                  id="content"
                  {...form.register("content")}
                  className="mt-1"
                  placeholder="Describe your progress, achievements, and any challenges..."
                  rows={4}
                />
                {form.formState.errors.content && (
                  <p className="text-sm text-red-600">{String(form.formState.errors.content.message)}</p>
                )}
              </div>

              <div>
                <Label htmlFor="projectId">Project *</Label>
                <Select onValueChange={(value) => form.setValue("projectId", value)} value={form.getValues("projectId")}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {(projects as any)?.map((project: any) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.projectId && (
                  <p className="text-sm text-red-600">{String(form.formState.errors.projectId.message)}</p>
                )}
              </div>

              <div>
                <div className="space-y-4">
                  <div>
                    <Label>File Attachments (Optional)</Label>
                    <p className="text-sm text-gray-600 mb-3">
                      Attach photos, documents, or other files to support your report. Maximum 10MB per file.
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>Choose Files</span>
                      </Button>
                    </Label>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Selected Files ({selectedFiles.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {getFileIcon(file)}
                              <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Report Submission Guidelines</h4>
                    <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                      <li>Provide detailed and accurate information about project activities</li>
                      <li>Include specific metrics, achievements, and challenges faced</li>
                      <li>Attach relevant photos, documents, or evidence of progress</li>
                      <li>Reports will be reviewed by administrators before approval</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600"
                  disabled={submitReportMutation.isPending}
                >
                  {submitReportMutation.isPending ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}