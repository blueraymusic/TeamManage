import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Target,
  DollarSign
} from "lucide-react";

export default function ProjectTimeline() {
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  if (!projects || !Array.isArray(projects)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Project Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedProjects = [...projects].sort((a: any, b: any) => {
    // Sort by deadline, then by progress
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (a.deadline && !b.deadline) return -1;
    if (!a.deadline && b.deadline) return 1;
    return (b.progress || 0) - (a.progress || 0);
  });

  const getStatusIcon = (project: any) => {
    switch (project.status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'active':
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case 'on-hold':
        return <PauseCircle className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDeadlineStatus = (project: any) => {
    if (!project.deadline) return null;
    
    const deadline = new Date(project.deadline);
    const now = new Date();
    const daysUntil = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0 && project.status !== 'completed') {
      return { text: `${Math.abs(daysUntil)} days overdue`, color: 'destructive' };
    } else if (daysUntil <= 7 && daysUntil >= 0) {
      return { text: `${daysUntil} days left`, color: 'warning' };
    } else if (daysUntil > 7) {
      return { text: `${daysUntil} days left`, color: 'default' };
    }
    return null;
  };

  const getBudgetUtilization = (project: any) => {
    if (!project.budget || project.budget <= 0) return 0;
    return Math.round(((project.budgetSpent || 0) / project.budget) * 100);
  };

  return (
    <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-100 border-b border-gray-200">
        <CardTitle className="flex items-center gap-3 text-gray-800 font-semibold">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {sortedProjects.map((project: any, index: number) => {
            const deadlineStatus = getDeadlineStatus(project);
            const budgetUtilization = getBudgetUtilization(project);
            
            return (
              <div key={project.id} className="relative">
                {/* Timeline line */}
                {index < sortedProjects.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-12 bg-border"></div>
                )}
                
                <div className="flex items-start gap-4">
                  {/* Status icon */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 bg-background flex items-center justify-center">
                    {getStatusIcon(project)}
                  </div>
                  
                  {/* Project details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{project.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1">
                        <Badge 
                          variant={project.status === 'completed' ? 'default' : 
                                  project.status === 'active' ? 'secondary' : 
                                  project.status === 'on-hold' ? 'outline' : 'destructive'}
                          className="text-xs"
                        >
                          {project.status}
                        </Badge>
                        
                        {deadlineStatus && (
                          <Badge variant={deadlineStatus.color as any} className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {deadlineStatus.text}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress || 0}%</span>
                      </div>
                      <Progress value={project.progress || 0} className="h-2" />
                    </div>
                    
                    {/* Budget info */}
                    {project.budget && project.budget > 0 && (
                      <div className="mt-2 flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-medium">${project.budget.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Used:</span>
                          <span className={`font-medium ${budgetUtilization > 80 ? 'text-red-600' : budgetUtilization > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {budgetUtilization}%
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Deadline */}
                    {project.deadline && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {sortedProjects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No projects found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}