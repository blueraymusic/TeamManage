import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus } from "lucide-react";

const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().optional(),
  budget: z.string().optional(),
  budgetUsed: z.string().optional(),
  deadline: z.string().optional(),
  goals: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
});

interface ProjectFormProps {
  project?: any;
  onSuccess?: () => void;
}

function ProjectFormDialog({ project, onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      budget: project?.budget?.toString() || "",
      budgetUsed: project?.budgetUsed?.toString() || "0",
      deadline: project?.deadline ? new Date(project.deadline).toISOString().split('T')[0] : "",
      goals: project?.goals || "",
      progress: project?.progress || 0,
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: z.infer<typeof projectSchema>) => {
      console.log("Creating project with data:", data);
      const response = await apiRequest("POST", "/api/projects", {
        ...data,
        budget: data.budget ? parseFloat(data.budget) : null,
        budgetUsed: data.budgetUsed ? parseFloat(data.budgetUsed) : 0,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        progress: data.progress || 0,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success!",
        description: "Project created successfully",
      });
      setIsOpen(false);
      form.reset();
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Create project error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (data: z.infer<typeof projectSchema>) => {
      console.log("Updating project with data:", data);
      const response = await apiRequest("PUT", `/api/projects/${project.id}`, {
        ...data,
        budget: data.budget ? parseFloat(data.budget) : null,
        budgetUsed: data.budgetUsed ? parseFloat(data.budgetUsed) : 0,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        progress: data.progress || 0,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success!",
        description: "Project updated successfully",
      });
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error("Update project error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof projectSchema>) => {
    if (project) {
      updateProjectMutation.mutate(data);
    } else {
      createProjectMutation.mutate(data);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8">
          <Plus className="w-3 h-3 mr-1" />
          {project ? "Edit Project" : "Create New Project"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Create New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="Enter project name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{String(form.formState.errors.name.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Describe the project goals and objectives"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Total Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                {...form.register("budget")}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                {...form.register("deadline")}
              />
            </div>
          </div>

          {project && (
            <div className="space-y-2">
              <Label htmlFor="budgetUsed">Amount Spent ($)</Label>
              <Input
                id="budgetUsed"
                type="number"
                step="0.01"
                {...form.register("budgetUsed")}
                placeholder="0.00"
              />
              {form.watch("budget") && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Budget Usage</span>
                    <span>
                      ${form.watch("budgetUsed") || 0} / ${form.watch("budget") || 0}
                    </span>
                  </div>
                  <Progress 
                    value={
                      form.watch("budget") && parseFloat(form.watch("budget")) > 0
                        ? Math.min((parseFloat(form.watch("budgetUsed") || "0") / parseFloat(form.watch("budget"))) * 100, 100)
                        : 0
                    } 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>
                      {form.watch("budget") && parseFloat(form.watch("budget")) > 0
                        ? Math.round((parseFloat(form.watch("budgetUsed") || "0") / parseFloat(form.watch("budget"))) * 100)
                        : 0}% used
                    </span>
                    <span>
                      ${Math.max(0, parseFloat(form.watch("budget") || "0") - parseFloat(form.watch("budgetUsed") || "0")).toFixed(2)} remaining
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="goals">Goals & Objectives</Label>
            <Textarea
              id="goals"
              {...form.register("goals")}
              placeholder="Define specific goals and expected outcomes"
              rows={3}
            />
          </div>

          {project && (
            <div className="space-y-2">
              <Label htmlFor="progress">Progress: {form.watch("progress")}%</Label>
              <Slider
                value={[form.watch("progress") || 0]}
                onValueChange={(value) => form.setValue("progress", value[0])}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createProjectMutation.isPending || updateProjectMutation.isPending}
            >
              {createProjectMutation.isPending || updateProjectMutation.isPending
                ? "Saving..."
                : project
                ? "Update Project"
                : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  return <ProjectFormDialog project={project} onSuccess={onSuccess} />;
}