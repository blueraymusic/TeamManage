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
import { Upload, X, FileText, Image, Paperclip, Plus, Brain, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AIReportReviewer from "./ai-report-reviewer";

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
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [showAIReview, setShowAIReview] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      setAiAnalysis(null);
      setShowAIReview(false);
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

  const analyzeReport = async () => {
    const formData = form.getValues();
    if (!formData.title || !formData.content) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await apiRequest("/api/reports/analyze", {
        method: "POST",
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          projectId: parseInt(formData.projectId),
        }),
      });

      setAiAnalysis(analysis);
      setShowAIReview(true);
      
      const readinessMessage = getReadinessMessage(analysis.readinessLevel);
      toast({
        title: "Analysis Complete",
        description: readinessMessage,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getReadinessMessage = (level: string): string => {
    switch (level) {
      case 'excellent':
        return 'Report is comprehensive and ready for submission!';
      case 'good':
        return 'Report is solid with minor areas for enhancement.';
      case 'needs-minor-improvements':
        return 'Report needs some refinements before submission.';
      case 'needs-major-improvements':
        return 'Report requires significant improvements before submission.';
      default:
        return 'Report analysis completed.';
    }
  };

  const isReadyForSubmission = () => {
    return aiAnalysis && (aiAnalysis.readinessLevel === 'excellent' || aiAnalysis.readinessLevel === 'good');
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
                <Select 
                  onValueChange={(value) => {
                    form.setValue("projectId", value);
                    // Reset AI analysis when project changes
                    setAiAnalysis(null);
                    setShowAIReview(false);
                  }} 
                  value={form.watch("projectId")}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {(projects as any)?.filter((project: any) => project.status !== 'completed')?.map((project: any) => (
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

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-blue-900 mb-1">
                      Report Submission Guidelines
                    </h3>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Be specific and detailed about your progress and achievements</p>
                      <p>• Include any challenges faced and how you addressed them</p>
                      <p>• Mention next steps and planned activities</p>
                      <p>• Attach relevant photos or documents if available</p>
                      <p className="font-medium text-purple-700">• Use AI Review to improve your report quality before submission</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Report Review Section */}
              {showAIReview && aiAnalysis && (
                <div className="mt-6 pt-6 border-t">
                  <AIReportReviewer
                    reportData={{
                      title: form.watch("title") || "",
                      content: form.watch("content") || "",
                      projectId: parseInt(form.watch("projectId") || "0"),
                    }}
                    onAnalysisComplete={(analysis) => {
                      setAiAnalysis(analysis);
                    }}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                
                {!aiAnalysis ? (
                  <Button
                    type="button"
                    onClick={analyzeReport}
                    disabled={isAnalyzing || !form.watch("title") || !form.watch("content")}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    {isAnalyzing ? "Analyzing..." : "Analyze Report"}
                  </Button>
                ) : isReadyForSubmission() ? (
                  <Button
                    type="submit"
                    disabled={submitReportMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {submitReportMutation.isPending ? "Submitting..." : "Submit Report"}
                  </Button>
                ) : (
                  <div className="flex-1 space-y-2">
                    <Button
                      type="button"
                      onClick={analyzeReport}
                      disabled={isAnalyzing}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      {isAnalyzing ? "Re-analyzing..." : "Re-analyze Report"}
                    </Button>
                    <p className="text-xs text-orange-600 text-center">
                      Please improve your report based on AI feedback before submitting
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}