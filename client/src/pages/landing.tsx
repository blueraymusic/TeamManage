import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AuthModals from "@/components/auth-modals";
import LanguageSwitcher from "@/components/language-switcher";
import AdelLogo from "@/components/adel-logo";
import {
  Users,
  TrendingUp,
  Upload,
  Wallet,
  Smartphone,
  Globe,
  Rocket,
  Play,
  Crown,
  User,
  Shield,
  Zap,
  Target,
} from "lucide-react";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState<"login" | "register" | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <AdelLogo size="md" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">ADEL</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Features
              </a>
              <a href="#workflow" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                How it Works
              </a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                About
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => setShowAuthModal("login")}
              >
                Sign In
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-200"
                onClick={() => setShowAuthModal("register")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <AdelLogo size="xl" className="mr-6" />
              <h1 className="text-5xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">NGO</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Management</span>
              </h1>
            </div>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Streamline your NGO operations with powerful project management, team collaboration, and progress tracking tools.
            </p>
          </div>
          
          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            <Card className="relative overflow-hidden bg-white border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="relative p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Administrator</h3>
                <p className="text-gray-600 mb-6">Create your NGO organization and manage projects, teams, and reports</p>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                  onClick={() => setShowAuthModal("register")}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Create Organization
                </Button>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden bg-white border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <CardContent className="relative p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Officer</h3>
                <p className="text-gray-600 mb-6">Join your team, contribute to projects, and submit progress reports</p>
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
                  onClick={() => setShowAuthModal("register")}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Join Organization
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-6 text-lg">Already have an account?</p>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-8 py-3 text-lg"
              onClick={() => setShowAuthModal("login")}
            >
              <User className="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for NGOs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your organization efficiently and track your impact effectively
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Team Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Organize your team with role-based access control and streamlined collaboration tools
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor project progress with visual dashboards and detailed analytics
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Report Submissions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Submit and approve reports with file attachments and automated workflows
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Budget Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Track project budgets and financial resources with detailed reporting
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Real-time Updates</h3>
                <p className="text-gray-600 leading-relaxed">
                  Stay informed with instant notifications and real-time project updates
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Global Access</h3>
                <p className="text-gray-600 leading-relaxed">
                  Access your data from anywhere with cloud-based infrastructure and mobile support
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How ADEL Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to transform your NGO management
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-xl">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Setup Organization</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Create your NGO profile and get a unique organization code to share with your team
              </p>
              <Card className="bg-white shadow-lg border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="text-sm text-gray-500 mb-2">Organization Code</div>
                  <div className="font-mono font-bold text-blue-600 text-xl">#NGO-7492</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-xl">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-green-200 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Manage Projects</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Create projects, assign teams, track progress, and manage budgets all in one place
              </p>
              <Card className="bg-white shadow-lg border-2 border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Clean Water Project</span>
                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                  </div>
                  <Progress value={68} className="h-3" />
                  <div className="text-xs text-gray-500 mt-2">68% Complete</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-xl">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Track Impact</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Review reports, approve submissions, and analyze your organization's impact with detailed insights
              </p>
              <Card className="bg-white shadow-lg border-2 border-orange-100">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">Monthly Report</span>
                    <Badge className="bg-orange-100 text-orange-700">Pending Review</Badge>
                  </div>
                  <div className="text-xs text-gray-500">Submitted by field team</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AdelLogo size="lg" className="mx-auto mb-8" />
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your NGO?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of organizations already using ADEL to streamline their operations and maximize their impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={() => setShowAuthModal("register")}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
              onClick={() => setShowAuthModal("login")}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <AdelLogo size="md" className="mr-3" />
            <span className="text-xl font-bold">ADEL</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering NGOs worldwide with efficient management tools
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 ADEL. All rights reserved.
          </p>
        </div>
      </footer>

      <AuthModals 
        showModal={showAuthModal} 
        onClose={() => setShowAuthModal(null)} 
      />
    </div>
  );
}