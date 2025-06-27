import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthModals from "@/components/auth-modals";
import LanguageSwitcher from "@/components/language-switcher";
import AdelLogo from "@/components/adel-logo";
import { t, getCurrentLanguage } from "@/lib/i18n";
import {
  Users,
  Target,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  FileText,
  Calendar,
  Brain,
  Bell,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  MessageSquare,
  PieChart,
  DollarSign,
  Clock,
  Award,
  Play,
  X,
  Send,
  Mail,
  User,
  Building,
  Phone,
  Rocket
} from "lucide-react";

// Hook for intersection observer
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return [ref, isIntersecting] as const;
}

export default function LandingNew() {
  const [showAuthModal, setShowAuthModal] = useState<"login" | "register" | null>(null);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    organization: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Refs for scroll animations
  const heroResult = useIntersectionObserver();
  const heroRef = heroResult[0];
  const heroInView = heroResult[1];
  
  const featuresResult = useIntersectionObserver();
  const featuresRef = featuresResult[0];
  const featuresInView = featuresResult[1];
  
  const analyticsResult = useIntersectionObserver();
  const analyticsRef = analyticsResult[0];
  const analyticsInView = analyticsResult[1];
  
  const aiResult = useIntersectionObserver();
  const aiRef = aiResult[0];
  const aiInView = aiResult[1];
  
  const workflowResult = useIntersectionObserver();
  const workflowRef = workflowResult[0];
  const workflowInView = workflowResult[1];
  
  const ctaResult = useIntersectionObserver();
  const ctaRef = ctaResult[0];
  const ctaInView = ctaResult[1];

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLang(getCurrentLanguage());
    };
    
    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    setTimeout(() => {
      setShowContactModal(false);
      setSubmitted(false);
      setContactFormData({
        name: '',
        email: '',
        organization: '',
        phone: '',
        message: ''
      });
    }, 2000);
  };

  const ContactModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowContactModal(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Message Sent!</h3>
              <p className="text-gray-600 dark:text-gray-400">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactFormData.name}
                  onChange={(e) => setContactFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={contactFormData.email}
                  onChange={(e) => setContactFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Organization
                </label>
                <input
                  type="text"
                  value={contactFormData.organization}
                  onChange={(e) => setContactFormData(prev => ({ ...prev, organization: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={contactFormData.phone}
                  onChange={(e) => setContactFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactFormData.message}
                  onChange={(e) => setContactFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="Tell us about your project needs..."
                />
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Header */}
      <header className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <AdelLogo size="md" />
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ADEL
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Project Management
                </span>
              </div>
            </div>
            
            {/* Navigation Menu - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-2">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 font-medium relative group"
              >
                <span className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Features</span>
                </span>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-200"></div>
              </button>
              <button 
                onClick={() => document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 font-medium relative group"
              >
                <span className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </span>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-200"></div>
              </button>
              <button 
                onClick={() => document.getElementById('ai-features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 font-medium relative group"
              >
                <span className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>AI Features</span>
                </span>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-200"></div>
              </button>
              <button 
                onClick={() => setShowContactModal(true)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 font-medium relative group"
              >
                <span className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Pricing</span>
                </span>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 group-hover:w-full transition-all duration-200"></div>
              </button>
            </nav>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                onClick={() => setShowAuthModal("login")}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
              >
                {t("login")}
              </Button>
              <Button
                onClick={() => setShowAuthModal("register")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              >
                {t("Get Started")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`relative py-20 lg:py-32 overflow-hidden transition-all duration-1000 ${
          heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 dark:from-blue-900 dark:to-purple-900 dark:text-blue-200 border-0">
              <Brain className="h-4 w-4 mr-2" />
              AI-Powered Project Management
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Next-Generation
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Project Management
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Streamline your organization with intelligent analytics, AI-powered insights, 
              and comprehensive project tracking for teams of all sizes and industries.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                onClick={() => setShowAuthModal("register")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Zap className="h-5 w-5 mr-2" />
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowContactModal(true)}
                className="border-2 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Organizations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Projects Managed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-pink-600 dark:text-pink-400">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section
        id="features"
        ref={featuresRef}
        className={`py-20 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 delay-200 ${
          featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything Your Organization Needs
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From project inception to completion, ADEL provides all the tools you need to succeed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Management */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Smart Project Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Comprehensive project lifecycle management with automated status updates and deadline tracking.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />Budget monitoring</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />Progress tracking</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />Team collaboration</li>
                </ul>
              </CardContent>
            </Card>

            {/* Team Collaboration */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Team Collaboration
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Seamless communication tools with file sharing and role-based access control.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />Real-time messaging</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />File attachments</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />Secure communications</li>
                </ul>
              </CardContent>
            </Card>

            {/* Reporting System */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-3 w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Advanced Reporting
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Multi-stage approval workflows with comprehensive report management and tracking.
                </p>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />Approval workflows</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />Report recall system</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />Status tracking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Analytics & AI Section */}
      <section
        id="analytics"
        ref={analyticsRef}
        className={`py-20 transition-all duration-1000 delay-300 ${
          analyticsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 dark:from-orange-900 dark:to-red-900 dark:text-orange-200 border-0">
                <BarChart3 className="h-4 w-4 mr-2" />
                Advanced Analytics
              </Badge>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Data-Driven Decision Making
              </h2>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Transform your organization with powerful analytics and intelligent insights that help you make informed decisions.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2 flex-shrink-0">
                    <PieChart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Interactive Dashboards
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Visual charts showing project status, budget utilization, and progress distribution.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-2 flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Performance Metrics
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Track completion rates, budget efficiency, and team productivity over time.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-2 flex-shrink-0">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Budget Analytics
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Comprehensive financial tracking with spending analysis and forecasting.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Analytics Overview</h3>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Live</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Active Projects</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">89%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Budget Utilization</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section
        id="ai-features"
        ref={aiRef}
        className={`py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 transition-all duration-1000 delay-400 ${
          aiInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900 dark:to-pink-900 dark:text-purple-200 border-0">
              <Brain className="h-4 w-4 mr-2" />
              AI-Powered Intelligence
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Intelligent Automation
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Leverage cutting-edge AI to streamline workflows and gain intelligent insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AI Report Review */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  AI Report Analysis
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Advanced AI reviews reports and provides intelligent feedback with improvement suggestions.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Automated quality scoring</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Intelligent improvement suggestions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Multi-format file support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Notifications */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Smart Notifications
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Intelligent alerts system that keeps you informed about critical project milestones and deadlines.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-1">
                      <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Deadline monitoring</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-1">
                      <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Budget alerts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-100 dark:bg-orange-900/20 rounded-full p-1">
                      <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">Performance insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section
        ref={workflowRef}
        className={`py-20 bg-white/50 dark:bg-gray-800/50 transition-all duration-1000 delay-500 ${
          workflowInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Yet Powerful Workflow
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get started in minutes with our intuitive setup process designed for non-profit organizations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-6 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Building className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">1. Create Organization</h3>
              <p className="text-gray-600 dark:text-gray-300">Set up your NGO profile and get your unique organization code for team members.</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full p-6 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2. Add Your Team</h3>
              <p className="text-gray-600 dark:text-gray-300">Invite officers and team members using your organization code for seamless collaboration.</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-6 w-fit mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">3. Launch Projects</h3>
              <p className="text-gray-600 dark:text-gray-300">Start creating projects, tracking progress, and leveraging AI-powered insights immediately.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section
        ref={ctaRef}
        className={`py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white transition-all duration-1000 delay-600 ${
          ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Organization?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of organizations already using ADEL to streamline their operations and maximize their impact.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setShowAuthModal("register")}
              className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Award className="h-5 w-5 mr-2" />
              Start Your Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowContactModal(true)}
              className="border-2 border-white text-white hover:bg-white/10 transition-all duration-300"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Sales
            </Button>
          </div>
          
          <p className="mt-6 text-sm opacity-75">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <AdelLogo size="sm" className="text-white" />
                <span className="text-lg font-bold">ADEL</span>
              </div>
              <p className="text-gray-400 text-sm">
                Next-generation project management platform designed for organizations of all types and sizes.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Project Management</li>
                <li>AI Report Analysis</li>
                <li>Smart Analytics</li>
                <li>Team Collaboration</li>
                <li>Budget Tracking</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">Documentation</button></li>
                <li><button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">API Reference</button></li>
                <li><button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">Contact Support</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">Twitter</button></li>
                <li><button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">LinkedIn</button></li>
                <li><button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">GitHub</button></li>
                <li><button onClick={() => setShowContactModal(true)} className="hover:text-white transition-colors">Blog</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2025 ADEL. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button onClick={() => setShowContactModal(true)} className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => setShowContactModal(true)} className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showAuthModal && (
        <AuthModals
          showModal={showAuthModal}
          onClose={() => setShowAuthModal(null)}
        />
      )}
      
      {showContactModal && <ContactModal />}
    </div>
  );
}