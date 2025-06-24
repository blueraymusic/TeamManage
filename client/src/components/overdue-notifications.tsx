import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverdueNotificationsProps {
  className?: string;
}

export default function OverdueNotifications({ className = "" }: OverdueNotificationsProps) {
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  // Filter overdue projects that are still active
  const overdueProjects = (projects as any)?.filter((project: any) => 
    project.isOverdue && 
    project.status !== 'completed' && 
    project.status !== 'cancelled'
  ) || [];

  if (overdueProjects.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {overdueProjects.map((project: any) => {
        const daysOverdue = Math.abs(project.daysLeft || 0);
        
        return (
          <Card key={`overdue-${project.id}`} className="border-red-200 bg-red-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="font-medium text-red-800">{project.name}</p>
                    <p className="text-sm text-red-600">
                      {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive" className="text-xs">
                    {project.status}
                  </Badge>
                  <div className="text-xs text-red-600">
                    <div>Progress: {project.progress || 0}%</div>
                    <div>Due: {new Date(project.deadline).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}