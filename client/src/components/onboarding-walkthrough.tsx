import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Brain,
  FileText,
  Users,
  BarChart3,
  MessageSquare,
  Lightbulb,
  Target,
  Clock,
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  targetElement?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  content: React.ReactNode;
}

interface OnboardingWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'admin' | 'officer';
}

export default function OnboardingWalkthrough({ isOpen, onClose, userRole }: OnboardingWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const adminSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to ADEL!',
      description: 'Your AI-powered project management platform',
      icon: <Target className="w-6 h-6 text-blue-600" />,
      position: 'center',
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold">Welcome to ADEL!</h3>
          <p className="text-gray-600">
            ADEL is designed specifically for NGOs and organizations to manage projects efficiently with AI-powered insights.
            Let's take a quick tour to get you started.
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Your Role:</strong> Administrator - You have full access to manage projects, review reports, and oversee your team.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'ai-insights',
      title: 'AI-Powered Dashboard Intelligence',
      description: 'Get intelligent project analysis and recommendations',
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      position: 'center',
      content: (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold">AI Insights</h3>
          <p className="text-gray-600">
            Click the "AI Insights" button to get comprehensive project analysis including:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Executive summaries of your projects
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Budget efficiency and team engagement metrics
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Risk assessment and recommendations
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Performance charts and visual analytics
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'projects',
      title: 'Project Management',
      description: 'Create and manage projects with deadlines and budgets',
      icon: <Target className="w-6 h-6 text-green-600" />,
      position: 'center',
      content: (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold">Projects Tab</h3>
          <p className="text-gray-600">
            Manage your organization's projects with comprehensive tracking:
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-green-50 p-3 rounded">
              <strong>Create Projects</strong>
              <p className="text-gray-600">Set budgets, deadlines, and assign teams</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <strong>Track Progress</strong>
              <p className="text-gray-600">Monitor completion and budget usage</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <strong>Deadline Alerts</strong>
              <p className="text-gray-600">Get notifications for overdue projects</p>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <strong>Export Data</strong>
              <p className="text-gray-600">Generate reports for stakeholders</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reports',
      title: 'Report Review System',
      description: 'Review and approve officer reports with AI assistance',
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      position: 'center',
      content: (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold">Reports Tab</h3>
          <p className="text-gray-600">
            Efficiently review and manage officer reports:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              View pending reports requiring your review
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Download attachments and supporting documents
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Approve, reject, or request revisions
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Generate professional PDF reports for donors
            </li>
          </ul>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>Pro Tip:</strong> Use the PDF Preview feature to create professional reports for stakeholders and donors.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'team',
      title: 'Team Management',
      description: 'Manage team members and communication',
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      position: 'center',
      content: (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold">Team Tab</h3>
          <p className="text-gray-600">
            Manage your organization's team members and communications:
          </p>
          <div className="space-y-3">
            <div className="bg-indigo-50 p-3 rounded">
              <strong>Organization Code:</strong>
              <p className="text-sm text-gray-600">Share your unique code with new team members to join</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <strong>Secure Messaging:</strong>
              <p className="text-sm text-gray-600">Communicate with officers and share files securely</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <strong>Member Overview:</strong>
              <p className="text-sm text-gray-600">See all team members and their roles</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'completion',
      title: 'You\'re All Set!',
      description: 'Start managing your projects with AI-powered insights',
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      position: 'center',
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold">You're Ready to Go!</h3>
          <p className="text-gray-600">
            You now know the key features of ADEL. Start by creating your first project or reviewing pending reports.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Quick Actions:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-blue-700">• Click "AI Insights" for analysis</div>
              <div className="text-blue-700">• Create your first project</div>
              <div className="text-blue-700">• Review pending reports</div>
              <div className="text-blue-700">• Invite team members</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const officerSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to ADEL!',
      description: 'Your AI-powered project management platform',
      icon: <Target className="w-6 h-6 text-blue-600" />,
      position: 'center',
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold">Welcome to ADEL!</h3>
          <p className="text-gray-600">
            ADEL helps you manage project tasks, submit reports, and collaborate with your team efficiently.
            Let's explore your dashboard.
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Your Role:</strong> Officer - You can manage assigned projects, submit reports, and communicate with your admin.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'ai-insights',
      title: 'AI Project Intelligence',
      description: 'Get intelligent analysis of your project performance',
      icon: <Brain className="w-6 h-6 text-purple-600" />,
      position: 'center',
      content: (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <Brain className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold">AI Insights</h3>
          <p className="text-gray-600">
            The AI Insights feature provides personalized analysis of your project work:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Executive summary of your projects and progress
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Performance metrics and completion trends
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Budget utilization and team engagement data
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Visual charts showing your contribution
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'projects',
      title: 'Your Projects',
      description: 'View and manage your assigned projects',
      icon: <Target className="w-6 h-6 text-green-600" />,
      position: 'center',
      content: (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold">Projects Tab</h3>
          <p className="text-gray-600">
            Track your assigned projects and their progress:
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-green-50 p-3 rounded">
              <strong>View Details</strong>
              <p className="text-gray-600">See project goals, budgets, and deadlines</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <strong>Track Progress</strong>
              <p className="text-gray-600">Monitor completion percentage</p>
            </div>
            <div className="bg-yellow-50 p-3 rounded">
              <strong>Deadline Alerts</strong>
              <p className="text-gray-600">Stay aware of upcoming deadlines</p>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <strong>Budget Tracking</strong>
              <p className="text-gray-600">See budget allocation and usage</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reports',
      title: 'Report Submission',
      description: 'Submit progress reports with AI feedback',
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      position: 'center',
      content: (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-bold">Reports Tab</h3>
          <p className="text-gray-600">
            Submit and manage your project reports:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Create new reports with rich text and file attachments
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Get AI feedback on report quality before submission
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Edit draft reports and resubmit rejected ones
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Track report status (draft, submitted, approved, rejected)
            </li>
          </ul>
          <div className="bg-orange-50 p-3 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>AI Feature:</strong> Before submitting, get AI suggestions to improve your report quality and clarity.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'messages',
      title: 'Team Communication',
      description: 'Communicate securely with your admin and team',
      icon: <MessageSquare className="w-6 h-6 text-indigo-600" />,
      position: 'center',
      content: (
        <div className="space-y-4">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold">Messages Tab</h3>
          <p className="text-gray-600">
            Secure communication with your admin and team:
          </p>
          <div className="space-y-3">
            <div className="bg-indigo-50 p-3 rounded">
              <strong>Direct Messaging:</strong>
              <p className="text-sm text-gray-600">Send messages directly to your admin</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <strong>File Sharing:</strong>
              <p className="text-sm text-gray-600">Share documents and files securely</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <strong>Real-time Notifications:</strong>
              <p className="text-sm text-gray-600">Get notified of new messages instantly</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'completion',
      title: 'Ready to Start!',
      description: 'Begin working on your projects',
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      position: 'center',
      content: (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold">You're Ready!</h3>
          <p className="text-gray-600">
            You now understand ADEL's key features. Start by reviewing your projects and submitting progress reports.
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Get Started:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-blue-700">• Check your assigned projects</div>
              <div className="text-blue-700">• Submit a progress report</div>
              <div className="text-blue-700">• Try the AI Insights feature</div>
              <div className="text-blue-700">• Message your admin</div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const steps = userRole === 'admin' ? adminSteps : officerSteps;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    localStorage.setItem('onboarding-completed', 'true');
    onClose();
  };

  const completeTour = () => {
    localStorage.setItem('onboarding-completed', 'true');
    setIsCompleted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {steps[currentStep]?.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{steps[currentStep]?.title}</h2>
                <p className="text-sm text-gray-600">{steps[currentStep]?.description}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={skipTour}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isCompleted ? (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-800">Tour Completed!</h3>
                <p className="text-gray-600">
                  You're now ready to use ADEL effectively. The dashboard will close automatically.
                </p>
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              </div>
            ) : (
              steps[currentStep]?.content
            )}
          </div>

          {/* Footer */}
          {!isCompleted && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? 'bg-blue-600' : 
                      index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button 
                onClick={currentStep === steps.length - 1 ? completeTour : nextStep}
                className="flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? 'Complete Tour' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}