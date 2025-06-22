import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Calendar, DollarSign, Target, Edit, Trash2 } from "lucide-react";

const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().optional(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  goals: z.string().optional(),
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
      budget: project?.budget || "",
      deadline: project?.deadline ? new Date(project.deadline).toISOString().split('T')[0] : "",
      goals: project?.goals || "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: z.infer<typeof projectSchema>) => {
      const response = await apiRequest("POST", "/api/projects", {
        ...data,
        budget: data.budget ? parseFloat(data.budget) : null,
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Project created successfully!",
      });
      setIsOpen(false);
      form.reset();
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: z.infer<typeof projectSchema>) => {
    createProjectMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          {project ? "Edit Project" : "Create New Project"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Create New Project"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              {...form.register("name")}
              className="mt-1"
              placeholder="Enter project name"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              className="mt-1"
              placeholder="Describe the project objectives and scope"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget (USD)</Label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  {...form.register("budget")}
                  className="pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="deadline"
                  type="date"
                  {...form.register("deadline")}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="goals">Goals & Objectives</Label>
            <Textarea
              id="goals"
              {...form.register("goals")}
              className="mt-1"
              placeholder="Define specific goals and success metrics"
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ProjectForm() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
          <p className="text-gray-600 mt-1">Create and manage your organization's projects</p>
        </div>
        <ProjectFormDialog />
      </div>

      {projects?.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first project to start tracking progress and managing team reports.
            </p>
            <ProjectFormDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {projects?.map((project: any) => (
            <Card key={project.id} className="border-l-4 border-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    {project.description && (
                      <p className="text-gray-600 mt-2">{project.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Project Details</h4>
                      <div className="space-y-2 text-sm">
                        {project.budget && (
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                            <span>Budget: ${parseFloat(project.budget).toLocaleString()}</span>
                          </div>
                        )}
                        {project.deadline && (
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                            <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <Target className="w-4 h-4 mr-2 text-orange-500" />
                          <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Progress Status</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Overall Progress</span>
                          <span className="font-medium text-green-600">
                            {Math.floor(Math.random() * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                          ></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <Badge variant="outline" className="justify-center">
                            Reports: {Math.floor(Math.random() * 10)}
                          </Badge>
                          <Badge variant="outline" className="justify-center">
                            Team: {Math.floor(Math.random() * 5) + 1}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {project.goals && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Goals & Objectives</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{project.goals}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <span>Last updated: {new Date().toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Next report due: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
