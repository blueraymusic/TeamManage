import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Settings,
  BarChart3,
  Users,
  Target,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  GripVertical,
  X
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

interface Widget {
  id: string;
  title: string;
  type: 'metric' | 'chart' | 'list' | 'progress';
  icon: any;
  enabled: boolean;
  size: 'small' | 'medium' | 'large';
  data?: any;
}

interface CustomizableDashboardProps {
  organizationData?: any;
  projectsData?: any[];
  reportsData?: any[];
  statsData?: any;
}

export default function CustomizableDashboard({
  organizationData,
  projectsData = [],
  reportsData = [],
  statsData
}: CustomizableDashboardProps) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Available widget configurations
  const availableWidgets: Widget[] = [
    {
      id: 'active-projects',
      title: 'Active Projects',
      type: 'metric',
      icon: Target,
      enabled: true,
      size: 'small',
      data: { value: statsData?.activeProjects || 0, change: '+12%' }
    },
    {
      id: 'completed-projects',
      title: 'Completed Projects',
      type: 'metric',
      icon: CheckCircle2,
      enabled: true,
      size: 'small',
      data: { value: statsData?.completedProjects || 0, change: '+8%' }
    },
    {
      id: 'total-budget',
      title: 'Total Budget',
      type: 'metric',
      icon: DollarSign,
      enabled: true,
      size: 'small',
      data: { 
        value: `$${(projectsData.reduce((sum, p) => sum + (p.budget || 0), 0)).toLocaleString()}`,
        change: '+15%'
      }
    },
    {
      id: 'team-members',
      title: 'Team Members',
      type: 'metric',
      icon: Users,
      enabled: true,
      size: 'small',
      data: { value: 8, change: '+2' }
    },
    {
      id: 'project-status',
      title: 'Project Status Distribution',
      type: 'chart',
      icon: BarChart3,
      enabled: true,
      size: 'medium',
      data: [
        { name: 'Active', value: statsData?.activeProjects || 0, color: '#3b82f6' },
        { name: 'Completed', value: statsData?.completedProjects || 0, color: '#10b981' },
        { name: 'On Hold', value: 2, color: '#f59e0b' },
        { name: 'Cancelled', value: 1, color: '#ef4444' }
      ]
    },
    {
      id: 'budget-utilization',
      title: 'Budget Utilization',
      type: 'chart',
      icon: DollarSign,
      enabled: false,
      size: 'medium',
      data: projectsData.map(p => ({
        name: p.name || 'Project',
        budget: p.budget || 0,
        spent: p.budgetUsed || 0,
        remaining: (p.budget || 0) - (p.budgetUsed || 0)
      }))
    },
    {
      id: 'recent-reports',
      title: 'Recent Reports',
      type: 'list',
      icon: FileText,
      enabled: true,
      size: 'medium',
      data: reportsData.slice(0, 5)
    },
    {
      id: 'project-timeline',
      title: 'Project Timeline',
      type: 'progress',
      icon: Calendar,
      enabled: false,
      size: 'large',
      data: projectsData.map(p => ({
        name: p.name,
        progress: p.progress || 0,
        deadline: p.deadline,
        status: p.status
      }))
    },
    {
      id: 'performance-trends',
      title: 'Performance Trends',
      type: 'chart',
      icon: TrendingUp,
      enabled: false,
      size: 'large',
      data: [
        { month: 'Jan', projects: 5, reports: 12 },
        { month: 'Feb', projects: 7, reports: 18 },
        { month: 'Mar', projects: 6, reports: 15 },
        { month: 'Apr', projects: 9, reports: 22 },
        { month: 'May', projects: 8, reports: 19 },
        { month: 'Jun', projects: 10, reports: 25 }
      ]
    },
    {
      id: 'urgent-tasks',
      title: 'Urgent Tasks',
      type: 'list',
      icon: AlertTriangle,
      enabled: false,
      size: 'medium',
      data: [
        { title: 'Review Q4 Budget Report', due: '2 days', priority: 'high' },
        { title: 'Submit Environmental Impact Study', due: '5 days', priority: 'medium' },
        { title: 'Team Meeting Preparation', due: '1 week', priority: 'low' }
      ]
    }
  ];

  useEffect(() => {
    // Load saved widget configuration from localStorage
    const savedWidgets = localStorage.getItem('dashboard-widgets');
    if (savedWidgets) {
      try {
        const parsed = JSON.parse(savedWidgets);
        setWidgets(parsed.map((saved: any) => {
          const template = availableWidgets.find(w => w.id === saved.id);
          return template ? { ...template, enabled: saved.enabled, size: saved.size } : null;
        }).filter(Boolean));
      } catch (error) {
        // If parsing fails, use default configuration
        setWidgets(availableWidgets.filter(w => w.enabled));
      }
    } else {
      // Use default configuration
      setWidgets(availableWidgets.filter(w => w.enabled));
    }
  }, []);

  const saveWidgetConfiguration = (newWidgets: Widget[]) => {
    const configToSave = newWidgets.map(w => ({
      id: w.id,
      enabled: w.enabled,
      size: w.size
    }));
    localStorage.setItem('dashboard-widgets', JSON.stringify(configToSave));
    setWidgets(newWidgets);
  };

  const toggleWidget = (widgetId: string) => {
    const updatedWidgets = availableWidgets.map(widget => {
      if (widget.id === widgetId) {
        const currentWidget = widgets.find(w => w.id === widgetId);
        return { ...widget, enabled: !currentWidget?.enabled };
      }
      const existingWidget = widgets.find(w => w.id === widget.id);
      return existingWidget || { ...widget, enabled: false };
    });
    saveWidgetConfiguration(updatedWidgets);
  };

  const changeWidgetSize = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    const updatedWidgets = widgets.map(widget =>
      widget.id === widgetId ? { ...widget, size } : widget
    );
    saveWidgetConfiguration(updatedWidgets);
  };

  const renderMetricWidget = (widget: Widget) => (
    <Card className={`border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 ${
      widget.size === 'small' ? 'col-span-1' : widget.size === 'medium' ? 'col-span-2' : 'col-span-3'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-1">
              {widget.title}
            </p>
            <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
              {widget.data?.value}
            </p>
            {widget.data?.change && (
              <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                {widget.data.change}
              </Badge>
            )}
          </div>
          <div className="bg-blue-500 rounded-lg p-3">
            <widget.icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderChartWidget = (widget: Widget) => (
    <Card className={`border-0 bg-white dark:bg-gray-800 ${
      widget.size === 'small' ? 'col-span-1' : widget.size === 'medium' ? 'col-span-2' : 'col-span-3'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <widget.icon className="h-5 w-5 mr-2 text-purple-500" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {widget.id === 'project-status' ? (
              <PieChart>
                <Pie
                  data={widget.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {widget.data?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : widget.id === 'budget-utilization' ? (
              <BarChart data={widget.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value?.toLocaleString()}`} />
                <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
                <Bar dataKey="spent" fill="#10b981" name="Spent" />
              </BarChart>
            ) : (
              <LineChart data={widget.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="projects" stroke="#3b82f6" name="Projects" />
                <Line type="monotone" dataKey="reports" stroke="#10b981" name="Reports" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const renderListWidget = (widget: Widget) => (
    <Card className={`border-0 bg-white dark:bg-gray-800 ${
      widget.size === 'small' ? 'col-span-1' : widget.size === 'medium' ? 'col-span-2' : 'col-span-3'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <widget.icon className="h-5 w-5 mr-2 text-green-500" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {widget.id === 'recent-reports' ? (
            widget.data?.map((report: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{report.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={report.status === 'approved' ? 'default' : 'secondary'}>
                  {report.status}
                </Badge>
              </div>
            ))
          ) : (
            widget.data?.map((task: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Due in {task.due}</p>
                </div>
                <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                  {task.priority}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderProgressWidget = (widget: Widget) => (
    <Card className={`border-0 bg-white dark:bg-gray-800 ${
      widget.size === 'small' ? 'col-span-1' : widget.size === 'medium' ? 'col-span-2' : 'col-span-3'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <widget.icon className="h-5 w-5 mr-2 text-orange-500" />
          {widget.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {widget.data?.map((project: any, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">{project.name}</span>
                <Badge variant="outline">{project.progress}%</Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              {project.deadline && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <Clock className="h-3 w-3 inline mr-1" />
                  Due: {new Date(project.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'metric':
        return renderMetricWidget(widget);
      case 'chart':
        return renderChartWidget(widget);
      case 'list':
        return renderListWidget(widget);
      case 'progress':
        return renderProgressWidget(widget);
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Customization Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Insights</h2>
          <p className="text-gray-600 dark:text-gray-300">Customize your dashboard with personalized widgets</p>
        </div>
        <Dialog open={isCustomizing} onOpenChange={setIsCustomizing}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Customize Widgets</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Customize Dashboard Widgets
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableWidgets.map((widget) => {
                  const isEnabled = widgets.find(w => w.id === widget.id)?.enabled || false;
                  const currentSize = widgets.find(w => w.id === widget.id)?.size || widget.size;
                  
                  return (
                    <Card key={widget.id} className={`p-4 ${isEnabled ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={isEnabled}
                            onCheckedChange={() => toggleWidget(widget.id)}
                          />
                          <widget.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                          <span className="font-medium">{widget.title}</span>
                        </div>
                        <Badge variant="outline">{widget.type}</Badge>
                      </div>
                      {isEnabled && (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 dark:text-gray-300">Widget Size:</p>
                          <div className="flex space-x-2">
                            {['small', 'medium', 'large'].map((size) => (
                              <Button
                                key={size}
                                variant={currentSize === size ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => changeWidgetSize(widget.id, size as any)}
                              >
                                {size}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Customizable Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {widgets.filter(w => w.enabled).map((widget) => (
          <div key={widget.id} className="widget-container">
            {renderWidget(widget)}
          </div>
        ))}
      </div>

      {/* Add New Widget Prompt */}
      {widgets.filter(w => w.enabled).length === 0 && (
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
          <CardContent className="p-12 text-center">
            <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Widgets Enabled
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Customize your dashboard by enabling widgets to display project insights
            </p>
            <Button onClick={() => setIsCustomizing(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Enable Widgets
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}