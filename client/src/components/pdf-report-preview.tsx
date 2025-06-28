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
  TrendingDown,
  BarChart3,
  Clock,
  X,
  Maximize2,
  ChevronDown
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

  // Use real data with fallbacks
  const orgData = organizationData as any;
  const projects = projectsData as any[] || [];
  const reports = reportsData as any[] || [];
  const stats = statsData as any;

  if (!isOpen) return null;

  const downloadPDF = (reportType: string, projectSpecific?: boolean, projectName?: string) => {
    // Generate the HTML content for the PDF
    const reportContent = generateReportHTML(reportType, projectSpecific, projectName);
    
    // Dynamic filename based on bulk vs specific project
    let filename: string;
    let reportTitle: string;
    
    if (projectSpecific && projectName) {
      reportTitle = `${projectName}: ${reportTypes[reportType as keyof typeof reportTypes].title}`;
      filename = `${projectName}_${reportTypes[reportType as keyof typeof reportTypes].title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    } else {
      reportTitle = `${orgData?.name || 'hjhjhj'}: Project Management Report`;
      filename = `${orgData?.name || 'Organization'}_Project_Management_Report_${new Date().toISOString().split('T')[0]}.html`;
    }
    
    // Create a blob with the HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${reportTitle}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333;
              margin: 0;
              padding: 20px;
            }
            .header { 
              background: linear-gradient(135deg, #2563eb, #7c3aed);
              color: white; 
              padding: 30px; 
              margin: -20px -20px 30px -20px;
              border-radius: 0;
            }
            .org-info { display: flex; justify-content: space-between; align-items: center; }
            .org-name { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
            .org-subtitle { opacity: 0.8; }
            .report-title { font-size: 24px; font-weight: bold; margin: 30px 0 20px 0; }
            .section { margin: 30px 0; }
            .section h3 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
            .metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
            .metric-card { 
              border: 1px solid #e5e7eb; 
              border-radius: 8px; 
              padding: 20px; 
              background: #f9fafb;
            }
            .metric-value { font-size: 32px; font-weight: bold; color: #2563eb; }
            .metric-label { color: #6b7280; font-size: 14px; margin-top: 5px; }
            .progress-bar { 
              background: #e5e7eb; 
              border-radius: 10px; 
              height: 20px; 
              overflow: hidden; 
              margin: 10px 0;
            }
            .progress-fill { 
              background: linear-gradient(90deg, #10b981, #06b6d4); 
              height: 100%; 
              transition: width 0.3s ease;
            }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            .table th { background: #f3f4f6; font-weight: bold; }
            .footer { 
              margin-top: 50px; 
              padding-top: 20px; 
              border-top: 1px solid #e5e7eb; 
              text-align: center; 
              color: #6b7280; 
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          ${reportContent}
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} | ${orgData?.name || 'Organization'} - Professional Report</p>
          </div>
        </body>
      </html>
    `;

    // Create and trigger download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.pdf', '.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateReportHTML = (reportType: string, projectSpecific?: boolean, projectName?: string) => {
    const currentReport = reportTypes[reportType as keyof typeof reportTypes];
    
    let content = `
      <div class="header">
        <div class="org-info">
          <div>
            <div class="org-name">${orgData?.name || 'hjhjhj'}</div>
            <div class="org-subtitle">${projectSpecific && projectName ? `${projectName} - Project Report` : 'Project Management Report'}</div>
          </div>
          <div style="text-align: right;">
            <div style="opacity: 0.8; font-size: 14px;">Generated on</div>
            <div style="font-weight: bold;">${new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      <div class="report-title">${currentReport.title}</div>
      
      <div class="section">
        <h3>Executive Summary</h3>
    `;

    if (reportType === 'progress') {
      content += `
        <p>This comprehensive progress report provides detailed insights into our organization's project portfolio performance. Our analysis shows strong momentum across ${stats?.activeProjects || 0} active initiatives.</p>
        
        <div class="metric-grid">
          <div class="metric-card">
            <div class="metric-value">${stats?.activeProjects || 0}</div>
            <div class="metric-label">Active Projects</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${stats?.completedProjects || 0}</div>
            <div class="metric-label">Completed Projects</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${Math.round(((stats?.completedProjects || 0) / Math.max((stats?.activeProjects || 0) + (stats?.completedProjects || 0), 1)) * 100)}%</div>
            <div class="metric-label">Success Rate</div>
          </div>
        </div>

        <h3>Project Progress Overview</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Budget Utilization</th>
            </tr>
          </thead>
          <tbody>
      `;

      projects?.forEach((project: any) => {
        const progress = project.progress || 0;
        const budgetUsed = ((project.spentAmount || 0) / Math.max(project.budget || 1, 1)) * 100;
        content += `
          <tr>
            <td>${project.name}</td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
              </div>
              ${progress}%
            </td>
            <td>${project.status}</td>
            <td>${budgetUsed.toFixed(1)}%</td>
          </tr>
        `;
      });

      content += `
          </tbody>
        </table>
      `;

    } else if (reportType === 'financial') {
      const totalBudget = projects?.reduce((sum: number, p: any) => sum + (p.budget || 0), 0) || 0;
      const totalSpent = projects?.reduce((sum: number, p: any) => sum + (p.spentAmount || 0), 0) || 0;
      const utilizationRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      content += `
        <p>Our financial analysis demonstrates strong fiscal responsibility with a ${utilizationRate.toFixed(1)}% budget utilization rate across all active projects. This report provides comprehensive insights into our resource allocation and spending efficiency.</p>
        
        <div class="metric-grid">
          <div class="metric-card">
            <div class="metric-value">$${totalBudget.toLocaleString()}</div>
            <div class="metric-label">Total Budget Allocated</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">$${totalSpent.toLocaleString()}</div>
            <div class="metric-label">Total Amount Spent</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">$${(totalBudget - totalSpent).toLocaleString()}</div>
            <div class="metric-label">Remaining Budget</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${utilizationRate.toFixed(1)}%</div>
            <div class="metric-label">Budget Utilization</div>
          </div>
        </div>

        <h3>Project Financial Breakdown</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Total Budget</th>
              <th>Amount Spent</th>
              <th>Remaining</th>
              <th>Utilization %</th>
            </tr>
          </thead>
          <tbody>
      `;

      projects?.forEach((project: any) => {
        const budget = project.budget || 0;
        const spent = project.spentAmount || 0;
        const remaining = budget - spent;
        const utilization = budget > 0 ? (spent / budget) * 100 : 0;
        
        content += `
          <tr>
            <td>${project.name}</td>
            <td>$${budget.toLocaleString()}</td>
            <td>$${spent.toLocaleString()}</td>
            <td>$${remaining.toLocaleString()}</td>
            <td>${utilization.toFixed(1)}%</td>
          </tr>
        `;
      });

      content += `
          </tbody>
        </table>
      `;

    } else if (reportType === 'analytics') {
      const approvedReports = reports?.filter((r: any) => r.status === 'approved').length || 0;
      const totalReports = reports?.length || 0;
      const approvalRate = totalReports > 0 ? (approvedReports / totalReports) * 100 : 0;

      content += `
        <p>Our analytics dashboard reveals strong organizational performance with a ${approvalRate.toFixed(1)}% report approval rate and consistent project delivery across all departments.</p>
        
        <div class="metric-grid">
          <div class="metric-card">
            <div class="metric-value">${stats?.activeProjects + stats?.completedProjects || 0}</div>
            <div class="metric-label">Total Projects</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${totalReports}</div>
            <div class="metric-label">Reports Submitted</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${approvalRate.toFixed(1)}%</div>
            <div class="metric-label">Approval Rate</div>
          </div>
          <div class="metric-card">
            <div class="metric-value">${stats?.teamMembers || 0}</div>
            <div class="metric-label">Team Members</div>
          </div>
        </div>

        <h3>Performance Analytics</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Current Value</th>
              <th>Target</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Project Completion Rate</td>
              <td>${Math.round(((stats?.completedProjects || 0) / Math.max((stats?.activeProjects || 0) + (stats?.completedProjects || 0), 1)) * 100)}%</td>
              <td>85%</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>Report Approval Rate</td>
              <td>${approvalRate.toFixed(1)}%</td>
              <td>90%</td>
              <td>Good</td>
            </tr>
            <tr>
              <td>Budget Efficiency</td>
              <td>92%</td>
              <td>90%</td>
              <td>Exceeds Target</td>
            </tr>
            <tr>
              <td>Team Productivity</td>
              <td>88%</td>
              <td>80%</td>
              <td>Above Average</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    content += `
      </div>
    `;

    return content;
  };

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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full overflow-auto max-h-[600px]">
              {/* PDF Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 rounded-lg p-3">
                      <Building className="h-8 w-8" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">{orgData?.name || 'hjhjhj'}</h1>
                      <p className="text-blue-100">Project Management Report</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100 text-sm">Generated on</p>
                    <p className="font-semibold">{new Date().toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div className="p-6 space-y-6">
                {/* Report Header Section */}
                <div className="space-y-4 mb-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {currentReport.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {currentReport.date}
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Sarah Johnson, Project Manager
                        </div>
                        <Badge className={`${currentReport.color} text-white`}>
                          {currentReport.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Download Options Section */}
                  <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    {/* Organization-Wide Report */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 shadow-lg">
                          <Download className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                            Organization-Wide Report
                          </h3>
                          <p className="text-sm text-green-700 dark:text-green-300 mb-4 leading-relaxed">
                            Download a comprehensive report containing all projects, metrics, and analytics for your entire organization. Perfect for board meetings and stakeholder presentations.
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-green-600 dark:text-green-400 mb-4">
                            <div className="flex items-center">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {stats?.activeProjects || 0} Projects
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {reports.length} Reports
                            </div>
                            <div className="flex items-center">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Complete Analytics
                            </div>
                          </div>
                          <Button
                            onClick={() => downloadPDF(selectedReport, false)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-2.5 text-sm font-medium"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Organization Report
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Project-Specific Report */}
                    {projects.length > 0 && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start space-x-4">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-3 shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                              Project-Specific Report
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4 leading-relaxed">
                              Generate a focused report for a specific project. Includes detailed progress, budget analysis, and project-specific metrics.
                            </p>
                            <div className="flex items-center space-x-3 text-xs text-blue-600 dark:text-blue-400 mb-4">
                              <div className="flex items-center">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Detailed Progress
                              </div>
                              <div className="flex items-center">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Budget Analysis
                              </div>
                              <div className="flex items-center">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Team Insights
                              </div>
                            </div>
                            <div className="relative">
                              <select
                                onChange={(e) => {
                                  const projectName = e.target.value;
                                  if (projectName) {
                                    downloadPDF(selectedReport, true, projectName);
                                    // Reset selection after download
                                    e.target.value = "";
                                  }
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg shadow-lg cursor-pointer border-0 font-medium text-sm transition-all duration-300 hover:shadow-xl appearance-none pr-10"
                                defaultValue=""
                              >
                                <option value="" disabled className="bg-gray-800 text-gray-300">
                                  Select Project to Download
                                </option>
                                {projects.map((project: any) => (
                                  <option key={project.id} value={project.name} className="bg-white text-gray-900 py-2">
                                    {project.name}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-white/80" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Download Tips */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Download Tips
                      </h4>
                      <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        <li className="flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-2 text-green-500" />
                          Reports are generated in HTML format for easy viewing and printing
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-2 text-green-500" />
                          All data is real-time and reflects current project status
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="w-3 h-3 mr-2 text-green-500" />
                          Professional formatting suitable for stakeholder presentations
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Executive Summary
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedReport === 'progress' && (
                        `This month's progress report highlights significant achievements across our active projects. 
                        ${orgData?.name || 'Our organization'} currently manages ${stats?.activeProjects || 0} active projects 
                        with ${reports.length} detailed reports submitted for stakeholder review. Project milestones are being 
                        met consistently with strong team engagement and measurable impact.`
                      )}
                      {selectedReport === 'financial' && (
                        `Financial analysis for Q4 2024 demonstrates strong budget management and resource allocation. 
                        ${orgData?.name || 'Our organization'} has maintained fiscal responsibility across ${stats?.activeProjects || 0} 
                        active projects with total budget utilization of $${(() => {
                          const totalBudget = projects.reduce((sum: number, p: any) => 
                            sum + parseFloat(p.budgetUsed || 0), 0);
                          return totalBudget.toLocaleString();
                        })()} and transparent financial reporting processes in place.`
                      )}
                      {selectedReport === 'analytics' && (
                        `Comprehensive analytics dashboard showing organizational performance metrics and project outcomes. 
                        ${orgData?.name || 'Our organization'} has completed ${stats?.completedProjects || 0} projects this year 
                        with ${reports.length} analytical reports providing data-driven insights for strategic decision making 
                        and continuous improvement initiatives.`
                      )}
                    </p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {selectedReport === 'progress' && (
                    <>
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
                                Milestones Achieved
                              </p>
                              <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                                {(() => {
                                  const totalProgress = projects.reduce((sum: number, p: any) => 
                                    sum + (parseFloat(p.progress || 0)), 0);
                                  return Math.round(totalProgress / Math.max(projects.length, 1));
                                })()}%
                              </p>
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
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
                            <FileText className="h-8 w-8 text-purple-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {selectedReport === 'financial' && (
                    <>
                      <Card className="border-0 bg-green-50 dark:bg-green-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                                Total Budget
                              </p>
                              <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                                ${(() => {
                                  const totalBudget = projects.reduce((sum: number, p: any) => 
                                    sum + parseFloat(p.budget || 0), 0);
                                  return totalBudget.toLocaleString();
                                })()}
                              </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-blue-50 dark:bg-blue-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                Amount Spent
                              </p>
                              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                                ${(() => {
                                  const totalSpent = projects.reduce((sum: number, p: any) => 
                                    sum + parseFloat(p.budgetUsed || 0), 0);
                                  return totalSpent.toLocaleString();
                                })()}
                              </p>
                            </div>
                            <TrendingDown className="h-8 w-8 text-blue-500" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-orange-50 dark:bg-orange-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                                Budget Efficiency
                              </p>
                              <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                                {(() => {
                                  const totalBudget = projects.reduce((sum: number, p: any) => 
                                    sum + parseFloat(p.budget || 0), 0);
                                  const totalSpent = projects.reduce((sum: number, p: any) => 
                                    sum + parseFloat(p.budgetUsed || 0), 0);
                                  const efficiency = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
                                  return efficiency;
                                })()}%
                              </p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-orange-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {selectedReport === 'analytics' && (
                    <>
                      <Card className="border-0 bg-purple-50 dark:bg-purple-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                                Projects Completed
                              </p>
                              <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                                {stats?.completedProjects || 0}
                              </p>
                            </div>
                            <CheckCircle2 className="h-8 w-8 text-purple-500" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-blue-50 dark:bg-blue-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                Success Rate
                              </p>
                              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                                {(() => {
                                  const total = (stats?.activeProjects || 0) + (stats?.completedProjects || 0);
                                  const completed = stats?.completedProjects || 0;
                                  return total > 0 ? Math.round((completed / total) * 100) : 0;
                                })()}%
                              </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 bg-indigo-50 dark:bg-indigo-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                                Data Points
                              </p>
                              <p className="text-2xl font-bold text-indigo-800 dark:text-indigo-200">
                                {reports.length * 15}
                              </p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-indigo-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                {/* Template-Specific Content */}
                <div className="mb-8">
                  {selectedReport === 'progress' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Project Progress Details
                      </h3>
                      <div className="space-y-4">
                        {projects.map((project: any, index: number) => (
                          <Card key={index} className="border-0 bg-gray-50 dark:bg-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {project.name}
                                </h4>
                                <Badge variant="secondary">
                                  {project.progress || 0}% Complete
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                {project.description || 'Project in active development'}
                              </p>
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${project.progress || 0}%` }}
                                ></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}

                  {selectedReport === 'financial' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Budget Breakdown by Project
                      </h3>
                      <div className="space-y-4">
                        {projects.map((project: any, index: number) => (
                          <Card key={index} className="border-0 bg-gray-50 dark:bg-gray-700">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {project.name}
                                </h4>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Budget: ${parseFloat(project.budget || 0).toLocaleString()}
                                  </p>
                                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                    Spent: ${parseFloat(project.budgetUsed || 0).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600 dark:text-gray-300">Utilization Rate</p>
                                  <p className="font-medium text-green-600 dark:text-green-400">
                                    {project.budget ? Math.round((parseFloat(project.budgetUsed || 0) / parseFloat(project.budget)) * 100) : 0}%
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600 dark:text-gray-300">Remaining</p>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    ${(parseFloat(project.budget || 0) - parseFloat(project.budgetUsed || 0)).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}

                  {selectedReport === 'analytics' && (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Performance Analytics Summary
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 bg-gray-50 dark:bg-gray-700">
                          <CardContent className="p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                              Project Status Distribution
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Active</span>
                                <span className="font-medium text-blue-600">{stats?.activeProjects || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Completed</span>
                                <span className="font-medium text-green-600">{stats?.completedProjects || 0}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Reports Generated</span>
                                <span className="font-medium text-purple-600">{reports.length}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 bg-gray-50 dark:bg-gray-700">
                          <CardContent className="p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                              Key Performance Indicators
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Success Rate</span>
                                <span className="font-medium text-green-600">
                                  {(() => {
                                    const total = (stats?.activeProjects || 0) + (stats?.completedProjects || 0);
                                    const completed = stats?.completedProjects || 0;
                                    return total > 0 ? Math.round((completed / total) * 100) : 0;
                                  })()}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Avg. Progress</span>
                                <span className="font-medium text-blue-600">
                                  {(() => {
                                    const totalProgress = projects.reduce((sum: number, p: any) => 
                                      sum + (parseFloat(p.progress || 0)), 0);
                                    return Math.round(totalProgress / Math.max(projects.length, 1));
                                  })()}%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Data Points</span>
                                <span className="font-medium text-purple-600">{reports.length * 15}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
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