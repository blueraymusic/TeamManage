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
  CheckCircle2,
  Star,
  ArrowRight,
  BarChart3,
  FileText,
  Calendar,
  Settings,
  Layers
} from "lucide-react";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState<"login" | "register" | null>(null);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      {/* Navigation Header */}
      <header className="relative sticky top-0 z-50">
        {/* Background with Glass Effect */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/60"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>
        
        {/* Header Content */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-12">
            <div className="flex justify-between items-center h-20 lg:h-24">
              
              {/* Logo Section */}
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  {/* Animated Background Circles */}
                  <div className="absolute -inset-2 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-xl opacity-50 group-hover:opacity-75 transition-all duration-300 blur-sm"></div>
                  
                  {/* Logo Container */}
                  <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-3 rounded-xl shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                    <AdelLogo size="lg" className="filter brightness-0 invert" />
                  </div>
                </div>
                
                {/* Brand Text */}
                <div className="flex flex-col">
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    ADEL
                  </h1>
                  <p className="text-sm text-slate-600 font-medium -mt-0.5">
                    For NGOs & Non-Profits
                  </p>
                </div>
              </div>
              
              {/* Navigation Links */}
              <nav className="hidden lg:flex items-center">
                <div className="flex items-center space-x-2 mr-8">
                  <a href="#features" className="relative group px-6 py-3 text-slate-700 hover:text-blue-700 transition-all duration-300 font-semibold text-lg">
                    <span className="relative z-10">Features</span>
                    <div className="absolute inset-0 bg-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                  </a>
                  
                  <a href="#workflow" className="relative group px-6 py-3 text-slate-700 hover:text-blue-700 transition-all duration-300 font-semibold text-lg">
                    <span className="relative z-10">How it Works</span>
                    <div className="absolute inset-0 bg-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                  </a>
                  
                  <a href="#about" className="relative group px-6 py-3 text-slate-700 hover:text-blue-700 transition-all duration-300 font-semibold text-lg">
                    <span className="relative z-10">About</span>
                    <div className="absolute inset-0 bg-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></div>
                  </a>
                </div>
                
                {/* Language Switcher */}
                <div className="mr-6">
                  <LanguageSwitcher />
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => setShowAuthModal("login")}
                    variant="outline"
                    className="border-2 border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 px-8 py-2.5 font-semibold text-lg rounded-xl"
                  >
                    Log In
                  </Button>
                  
                  <Button
                    onClick={() => setShowAuthModal("register")}
                    className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-10 py-2.5 font-semibold text-lg rounded-xl"
                  >
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </div>
              </nav>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  <Layers className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 mt-8 lg:mt-12">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 xl:px-12">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8">
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 text-lg font-medium mb-8 inline-block">
                NGO Project Management Platform
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Streamline Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                NGO Operations
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Empower your organization with advanced project management, team collaboration, 
              and progress tracking designed specifically for NGOs and non-profit organizations.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Button
                onClick={() => setShowAuthModal("register")}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 px-12 py-4 text-lg font-semibold rounded-2xl"
              >
                Start Free Trial
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="bg-white/50 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 px-12 py-4 text-lg font-semibold rounded-2xl"
              >
                <Play className="w-6 h-6 mr-3" />
                Watch Demo
              </Button>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-700 font-medium">NGOs Trust Us</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-bold text-emerald-600 mb-2">10K+</div>
                <div className="text-gray-700 font-medium">Projects Managed</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                <div className="text-gray-700 font-medium">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32 mt-16 lg:mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Modern NGOs
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything your organization needs to manage projects, track progress, and collaborate effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Feature Cards */}
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
              <CardContent className="p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="p-4 bg-white/20 rounded-2xl inline-block mb-6">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Project Management</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Create, organize, and track multiple projects with advanced tools for budget management and timeline tracking.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
              <CardContent className="p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="p-4 bg-white/20 rounded-2xl inline-block mb-6">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Team Collaboration</h3>
                  <p className="text-emerald-100 leading-relaxed">
                    Enable seamless collaboration between administrators and officers with role-based access controls.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
              <CardContent className="p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="p-4 bg-white/20 rounded-2xl inline-block mb-6">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Report Management</h3>
                  <p className="text-purple-100 leading-relaxed">
                    Submit, review, and approve reports with automated workflows and comprehensive tracking systems.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-amber-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
              <CardContent className="p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="p-4 bg-white/20 rounded-2xl inline-block mb-6">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Analytics & Insights</h3>
                  <p className="text-orange-100 leading-relaxed">
                    Get detailed insights into project progress, budget utilization, and team performance with visual dashboards.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-500 to-pink-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
              <CardContent className="p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="p-4 bg-white/20 rounded-2xl inline-block mb-6">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Secure & Reliable</h3>
                  <p className="text-rose-100 leading-relaxed">
                    Enterprise-grade security with encrypted data storage and regular backups to keep your information safe.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 border-0 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 overflow-hidden group">
              <CardContent className="p-8 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="p-4 bg-white/20 rounded-2xl inline-block mb-6">
                    <Settings className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Easy Setup</h3>
                  <p className="text-cyan-100 leading-relaxed">
                    Get started in minutes with our intuitive setup process and comprehensive onboarding resources.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="workflow" className="py-24 lg:py-32 mt-16 lg:mt-20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ADEL
              </span>{" "}
              Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to transform your NGO's project management workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl mx-auto flex items-center justify-center mb-6">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Register Your Organization</h3>
              <p className="text-gray-600 leading-relaxed">
                Create your organization account with a unique code and set up admin and officer roles for your team members.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-2xl mx-auto flex items-center justify-center mb-6">
                  <Target className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Create & Manage Projects</h3>
              <p className="text-gray-600 leading-relaxed">
                Set up projects with budgets, deadlines, and goals. Track progress and manage resources efficiently.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl shadow-2xl mx-auto flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Track & Approve Progress</h3>
              <p className="text-gray-600 leading-relaxed">
                Officers submit reports, admins review and approve them, and everyone stays updated on project status.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 mt-16 lg:mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-12">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-12 lg:p-16 text-center text-white max-w-5xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your NGO?
            </h2>
            <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto">
              Join hundreds of organizations already using ADEL to streamline their operations and maximize their impact.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button
                onClick={() => setShowAuthModal("register")}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-12 py-4 text-lg font-semibold rounded-2xl"
              >
                Get Started Free
                <Rocket className="w-6 h-6 ml-3" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 px-12 py-4 text-lg font-semibold rounded-2xl"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 mt-16 lg:mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center space-x-4 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-md opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-xl">
                  <AdelLogo size="md" className="filter brightness-0 invert" />
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                ADEL
              </span>
            </div>
            <p className="text-gray-400 mb-8 max-w-2xl">
              Empowering NGOs and non-profit organizations with modern project management tools to maximize their social impact.
            </p>
            <div className="text-gray-500">
              © 2025 ADEL. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <AuthModals showModal={showAuthModal} onClose={() => setShowAuthModal(null)} />
    </div>
  );
}