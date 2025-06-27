import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Calendar,
  User,
  Building,
  Target,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  X,
  Maximize2
} from "lucide-react";

interface PDFReportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  organizationData?: any;
  projectsData?: any[];
  reportsData?: any[];
  statsData?: any;
}

export default function PDFReportPreview({ 
  isOpen, 
  onClose, 
  organizationData, 
  projectsData, 
  reportsData, 
  statsData 
}: PDFReportPreviewProps) {
  const [selectedReport, setSelectedReport] = useState("progress");

  if (!isOpen) return null;

  // Use real data with fallbacks
  const orgData = organizationData as any;
  const projects = projectsData as any[] || [];
  const reports = reportsData as any[] || [];
  const stats = statsData as any;

  const reportTypes = {
    progress: {
      title: "Monthly Progress Report",
      date: "December 2024",
      type: "Progress Report",
      color: "bg-blue-500"
    },
    financial: {
      title: "Financial Summary Report",
      date: "Q4 2024",
      type: "Financial Report", 
      color: "bg-green-500"
    },
    analytics: {
      title: "Project Analytics Dashboard",
      date: "2024 Annual",
      type: "Analytics Report",
      color: "bg-purple-500"
    }
  };

  const currentReport = reportTypes[selectedReport as keyof typeof reportTypes];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-2">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Interactive PDF Report Preview
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                See how your reports look when exported for donors and stakeholders
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Sidebar - Report Types */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Report Templates
            </h3>
            
            <div className="space-y-3">
              {Object.entries(reportTypes).map(([key, report]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedReport === key 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedReport(key)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`${report.color} rounded-full p-2`}>
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {report.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                          {report.date}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="mt-2 text-xs"
                    >
                      {report.type}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                Export Features
              </h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Professional branding
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Interactive charts
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Donor-ready format
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Custom branding
                </li>
              </ul>
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full overflow-auto">
              {/* PDF Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 rounded-lg p-3">
                      <Building className="h-8 w-8" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">{orgData?.name || 'Organization'}</h1>
                      <p className="text-blue-100">Project Management Report</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm">Generated on</p>
                    <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentReport.title}
                    </h2>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {currentReport.date}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Sarah Johnson, Project Manager
                      </div>
                    </div>
                  </div>
                  <Badge className={`${currentReport.color} text-white`}>
                    {currentReport.type}
                  </Badge>
                </div>

                {/* Executive Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Executive Summary
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      This report provides a comprehensive overview of our organization's current project status and achievements. 
                      We have {stats?.activeProjects || 0} active projects with {reports.length} reports submitted for review. 
                      Our team continues to make significant progress across all initiatives with a focus on transparency and measurable outcomes.
                    </p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="border-0 bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                            Active Projects
                          </p>
                          <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                            {stats?.activeProjects || 0}
                          </p>
                        </div>
                        <Target className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-green-50 dark:bg-green-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                            Budget Utilized
                          </p>
                          <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                            ${(() => {
                              const totalBudget = projects.reduce((sum: number, p: any) => 
                                sum + parseFloat(p.budgetUsed || 0), 0);
                              return totalBudget.toLocaleString();
                            })()}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-purple-50 dark:bg-purple-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                            Reports Submitted
                          </p>
                          <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                            {reports.length}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Chart Placeholder */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Progress Overview
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 h-64 flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Interactive charts and visualizations appear here
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        Powered by ADEL Analytics Engine
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      <p>Generated by ADEL Project Management Platform</p>
                      <p>© 2024 {orgData?.name || 'Organization'}. All rights reserved.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Auto-generated on {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Maximize2 className="h-4 w-4" />
                  <span>Full Screen</span>
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Customize Template</span>
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Export PDF</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}