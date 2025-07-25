import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, FileText, Image, Paperclip, Plus, Brain, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const reportSchema = z.object({
  title: z.string().min(3, "Report title must be at least 3 characters"),
  content: z.string().min(10, "Report content must be at least 10 characters"),
  projectId: z.string().min(1, "Please select a project"),
});

interface ReportFormProps {
  projectId?: number;
  reportId?: number;
  onSuccess?: () => void;
}

export default function ReportForm({ projectId, reportId, onSuccess }: ReportFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Fetch existing report data when editing
  const { data: existingReport, isLoading: reportLoading } = useQuery({
    queryKey: ["/api/reports", reportId],
    enabled: !!reportId,
  });

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      content: "",
      projectId: projectId ? projectId.toString() : "",
    },
  });

  // Load existing report data into form when available
  useEffect(() => {
    if (existingReport && !reportLoading) {
      const report = existingReport as any;
      console.log("Loading existing report data:", report);
      
      form.reset({
        title: report.title || "",
        content: report.content || "",
        projectId: report.projectId ? report.projectId.toString() : "",
      });
    } else if (projectId && !reportId) {
      form.setValue("projectId", projectId.toString());
    }
  }, [existingReport, reportLoading, projectId, reportId, form]);

  const submitReportMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const url = reportId ? `/api/reports/${reportId}` : "/api/reports";
      const method = reportId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method: method,
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
      queryClient.invalidateQueries({ queryKey: ["/api/reports", reportId] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: reportId ? "Report updated successfully!" : "Report submitted successfully! It's now pending review.",
      });
      if (!reportId) {
        form.reset();
        setSelectedFiles([]);
        setAiAnalysis(null);
      }
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
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
      // Find the selected project to get its description
      const selectedProject = (projects as any)?.find((p: any) => p.id.toString() === formData.projectId);
      
      const response = await fetch("/api/reports/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          projectId: parseInt(formData.projectId),
          projectDescription: selectedProject?.description || "",
          projectGoals: selectedProject?.goals || "",
          hasAttachments: selectedFiles.length > 0,
          attachmentCount: selectedFiles.length,
          attachmentTypes: selectedFiles.map(f => f.type),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to analyze report");
      }

      const analysis = await response.json();
      setAiAnalysis(analysis);
      
      const readinessMessage = getReadinessMessage(analysis.readinessLevel);
      toast({
        title: "Analysis Complete",
        description: readinessMessage,
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error?.message || "Unable to analyze report. Please try again.",
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
    return aiAnalysis && aiAnalysis.overallScore >= 40;
  };

  const handleFormSubmit = async (values: z.infer<typeof reportSchema>) => {
    console.log("Form submit with values:", values);
    
    // Validate form data
    if (!values.title || !values.content || !values.projectId) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in title, content, and select a project.",
        variant: "destructive",
      });
      return;
    }

    // Create FormData for submission
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("projectId", values.projectId);
    
    // Add files if any
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    
    console.log("Submitting FormData entries:");
    const entries = Array.from(formData.entries());
    entries.forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });
    
    try {
      await submitReportMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="w-4 h-4" />;
    } else if (file.type.includes("pdf") || file.type.includes("document")) {
      return <FileText className="w-4 h-4" />;
    }
    return <Paperclip className="w-4 h-4" />;
  };

  if (reportId && reportLoading) {
    return <div>Loading report data...</div>;
  }

  return (
    <>
      {!reportId && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="h-9 px-4 bg-green-600 hover:bg-green-700 text-white font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Report
        </Button>
      )}
      
      <Dialog open={reportId ? true : isOpen} onOpenChange={reportId ? () => {} : setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {reportId ? "Edit Report" : "Submit New Report"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter report title"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setAiAnalysis(null);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Content *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your progress, achievements, challenges, and next steps..."
                          className="min-h-[120px]"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setAiAnalysis(null);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="projectId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project *</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        setAiAnalysis(null);
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(projects as any)?.map((project: any) => (
                            <SelectItem key={project.id} value={project.id.toString()}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload Section */}
                <div>
                  <Label>Attachments (Optional)</Label>
                  <div className="mt-2 space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PDF, DOC, XLS, IMG (MAX. 10MB each)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt,.csv"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                            <div className="flex items-center space-x-2">
                              {getFileIcon(file)}
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Analysis Results */}
                {aiAnalysis && (
                  <div className="p-4 bg-slate-50 rounded-lg border">
                    <div className="flex items-center space-x-2 mb-3">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <h3 className="font-medium text-slate-800">AI Analysis Results</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Overall Score:</span>
                        <span className={`text-sm font-bold ${
                          aiAnalysis.overallScore >= 80 ? 'text-green-600' :
                          aiAnalysis.overallScore >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {aiAnalysis.overallScore}%
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          aiAnalysis.readinessLevel === 'excellent' ? 'bg-green-100 text-green-800' :
                          aiAnalysis.readinessLevel === 'good' ? 'bg-blue-100 text-blue-800' :
                          aiAnalysis.readinessLevel === 'needs-minor-improvements' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {aiAnalysis.readinessLevel.replace('-', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-600">{aiAnalysis.overallFeedback}</p>
                      
                      {aiAnalysis.strengthsIdentified && aiAnalysis.strengthsIdentified.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-green-700 mb-1">Strengths:</h4>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {aiAnalysis.strengthsIdentified.map((strength: string, index: number) => (
                              <li key={index} className="flex items-start space-x-1">
                                <span className="text-green-500 mt-1">•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {aiAnalysis.priorityImprovements && aiAnalysis.priorityImprovements.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-orange-700 mb-1">Priority Improvements:</h4>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {aiAnalysis.priorityImprovements.map((improvement: string, index: number) => (
                              <li key={index} className="flex items-start space-x-1">
                                <span className="text-orange-500 mt-1">•</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reportId ? onSuccess?.() : setIsOpen(false)}
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
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {submitReportMutation.isPending ? "Submitting..." : (reportId ? "Update Report" : "Submit Report")}
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
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}