import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";

interface DeadlineBadgeProps {
  project: any;
  className?: string;
}

export default function DeadlineBadge({ project, className = "" }: DeadlineBadgeProps) {
  if (!project.deadline) {
    return null;
  }

  const getDeadlineStatus = () => {
    const daysLeft = project.daysLeft;
    
    if (daysLeft === null || daysLeft === undefined) {
      return { text: 'No deadline', color: 'text-gray-500', bgColor: 'bg-gray-100', urgency: 'safe' };
    }

    if (daysLeft < 0) {
      const daysOverdue = Math.abs(daysLeft);
      return { 
        text: `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`, 
        color: 'text-red-100',
        bgColor: 'bg-red-600 hover:bg-red-700',
        urgency: 'overdue',
        icon: AlertTriangle
      };
    } else if (daysLeft === 0) {
      return { 
        text: 'Due today', 
        color: 'text-red-100',
        bgColor: 'bg-red-500 hover:bg-red-600',
        urgency: 'danger',
        icon: AlertTriangle
      };
    } else if (daysLeft === 1) {
      return { 
        text: '1 day left', 
        color: 'text-orange-100',
        bgColor: 'bg-orange-500 hover:bg-orange-600',
        urgency: 'danger',
        icon: Clock
      };
    } else if (daysLeft <= 3) {
      return { 
        text: `${daysLeft} days left`, 
        color: 'text-orange-100',
        bgColor: 'bg-orange-500 hover:bg-orange-600',
        urgency: 'warning',
        icon: Clock
      };
    } else if (daysLeft <= 7) {
      return { 
        text: `${daysLeft} days left`, 
        color: 'text-yellow-800',
        bgColor: 'bg-yellow-400 hover:bg-yellow-500',
        urgency: 'warning',
        icon: Clock
      };
    } else {
      return { 
        text: `${daysLeft} days left`, 
        color: 'text-green-100',
        bgColor: 'bg-green-600 hover:bg-green-700',
        urgency: 'safe',
        icon: CheckCircle
      };
    }
  };

  const status = getDeadlineStatus();
  const Icon = status.icon;

  return (
    <Badge 
      className={`${status.bgColor} ${status.color} border-0 font-medium flex items-center gap-1 ${className}`}
      variant="secondary"
    >
      {Icon && <Icon className="w-3 h-3" />}
      {status.text}
    </Badge>
  );
}