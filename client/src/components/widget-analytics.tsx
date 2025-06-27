import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Calendar,
  Users,
  FileText,
  DollarSign,
  Clock
} from "lucide-react";

interface WidgetAnalyticsProps {
  type: 'project-timeline' | 'budget-trend' | 'team-performance' | 'report-analytics';
  timeRange: '7d' | '30d' | '90d' | '1y';
  className?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function WidgetAnalytics({ type, timeRange, className = "" }: WidgetAnalyticsProps) {
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: reports } = useQuery({
    queryKey: ["/api/reports"],
  });

  const generateTimelineData = () => {
    if (!projects) return [];
    
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const data = [];
    
    for (let i = daysBack; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const dayProjects = (projects as any[]).filter(project => {
        const createdDate = new Date(project.createdAt);
        return createdDate.toDateString() === date.toDateString();
      });
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        projects: dayProjects.length,
        completed: dayProjects.filter(p => p.status === 'completed').length,
        active: dayProjects.filter(p => p.status === 'active').length
      });
    }
    
    return data;
  };

  const generateBudgetTrendData = () => {
    if (!projects) return [];
    
    return (projects as any[]).map((project, index) => ({
      name: project.name.substring(0, 10) + (project.name.length > 10 ? '...' : ''),
      budget: project.budget || 0,
      spent: project.spentAmount || 0,
      efficiency: project.budget ? ((project.progress || 0) / ((project.spentAmount || 0) / project.budget * 100)) * 100 : 0
    }));
  };

  const generateTeamPerformanceData = () => {
    if (!reports) return [];
    
    const performance = (reports as any[]).reduce((acc, report) => {
      const submitterId = report.submittedBy;
      if (!acc[submitterId]) {
        acc[submitterId] = {
          submitted: 0,
          approved: 0,
          rejected: 0,
          pending: 0
        };
      }
      acc[submitterId].submitted++;
      acc[submitterId][report.status]++;
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(performance).map(([userId, stats]) => ({
      user: `User ${userId}`,
      submitted: stats.submitted,
      approved: stats.approved,
      rejected: stats.rejected,
      pending: stats.pending,
      approvalRate: stats.submitted > 0 ? (stats.approved / stats.submitted * 100) : 0
    }));
  };

  const generateReportAnalyticsData = () => {
    if (!reports) return [];
    
    const statusCounts = (reports as any[]).reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      percentage: reports ? (count / (reports as any[]).length * 100).toFixed(1) : 0
    }));
  };

  const renderWidget = () => {
    switch (type) {
      case 'project-timeline':
        const timelineData = generateTimelineData();
        return (
          <Card className={`transition-all duration-200 hover:shadow-md ${className}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Project Timeline ({timeRange})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="projects" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="completed" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );

      case 'budget-trend':
        const budgetData = generateBudgetTrendData();
        return (
          <Card className={`transition-all duration-200 hover:shadow-md ${className}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Budget Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'efficiency' ? `${value.toFixed(1)}%` : `$${value}`,
                      name === 'efficiency' ? 'Efficiency' : name === 'budget' ? 'Budget' : 'Spent'
                    ]} />
                    <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                    <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );

      case 'team-performance':
        const teamData = generateTeamPerformanceData();
        return (
          <Card className={`transition-all duration-200 hover:shadow-md ${className}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="user" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="submitted" fill="#8884d8" name="Submitted" />
                    <Bar dataKey="approved" fill="#82ca9d" name="Approved" />
                    <Bar dataKey="rejected" fill="#ff8042" name="Rejected" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );

      case 'report-analytics':
        const reportData = generateReportAnalyticsData();
        return (
          <Card className={`transition-all duration-200 hover:shadow-md ${className}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2 text-indigo-600" />
                Report Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reportData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="ml-4 space-y-2">
                  {reportData.map((item, index) => (
                    <div key={item.name} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return renderWidget();
}