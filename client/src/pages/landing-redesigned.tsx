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
  Settings,
  Layers,
  CalendarDays,
  Mail,
  User,
  Shield,
  Play,
  Rocket,
  X,
  Send
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

export default function LandingRedesigned() {
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
    
    setSubmitted(true);
    setIsSubmitting(false);
    setContactFormData({ name: '', email: '', organization: '', phone: '', message: '' });
    
    // Reset success message and close modal after 2 seconds
    setTimeout(() => {
      setSubmitted(false);
      setShowContactModal(false);
    }, 2000);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Ultra-Compact Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-2 sm:px-6 lg:px-8 xl:px-12 h-10 sm:h-20">
            {/* Micro-Compact Mobile Logo */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm sm:rounded-xl blur-sm opacity-75"></div>
                <div className="relative p-0.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-sm sm:rounded-xl shadow-lg">
                  <AdelLogo size="sm" className="filter brightness-0 invert w-3 h-3 sm:w-6 sm:h-6" />
                </div>
              </div>
              <span className="text-base sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ADEL
              </span>
            </div>

            {/* Micro-Compact Mobile Menu */}
            <div className="flex items-center lg:hidden">
              <Button
                onClick={() => setShowAuthModal("register")}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-1.5 py-1 text-xs font-semibold rounded-sm"
              >
                Start
              </Button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <nav className="flex items-center space-x-8 mr-8">
                <a href="#features" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                  {t('nav.features')}
                </a>
                <a href="#how-it-works" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                  How It Works
                </a>
                <a href="#pricing" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
                  Pricing
                </a>
              </nav>

              <div className="mr-6">
                <LanguageSwitcher />
              </div>
              
              {/* Desktop Action Buttons */}
              <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
                <Button
                  onClick={() => setShowContactModal(true)}
                  variant="outline"
                  size="sm"
                  className="border-2 border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 px-3 lg:px-6 py-2 font-semibold rounded-lg text-xs lg:text-sm"
                >
                  <CalendarDays className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  <span className="hidden md:inline">Book Demo</span>
                  <span className="md:hidden">Demo</span>
                </Button>
                
                <Button
                  onClick={() => setShowAuthModal("login")}
                  variant="outline"
                  size="sm"
                  className="border-2 border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 px-3 lg:px-6 py-2 font-semibold rounded-lg text-xs lg:text-sm"
                >
                  <span className="hidden md:inline">Log In</span>
                  <span className="md:hidden">Login</span>
                </Button>
                
                <Button
                  onClick={() => setShowAuthModal("register")}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-7 py-2 font-semibold rounded-lg"
                >
                  Get Started
                </Button>
              </div>
            </div>

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
      </header>

      {/* Ultra-Mobile Hero Section */}
      <section ref={heroRef} className="relative py-8 sm:py-24 lg:py-32 transition-all duration-700 ease-in-out">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 transition-all duration-700"></div>
        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
          <div className={`text-center max-w-5xl mx-auto transition-all duration-1000 ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="mb-4 sm:mb-8">
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 sm:px-6 py-1 sm:py-2 text-xs sm:text-lg font-medium mb-4 sm:mb-8 inline-block">
                <span className="hidden sm:inline">NGO Project Management Platform</span>
                <span className="sm:hidden">Project Management</span>
              </Badge>
            </div>
            
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-8 leading-relaxed px-1">
              The First Project Management Tool with Built-In AI Report Feedback
            </h1>
            
            <p className="text-sm sm:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2">
              For teams who care about results, not just checkboxes. No more messy spreadsheets, last-minute donor report panic, or guessing if your project is on track.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 mb-8 sm:mb-16">
              <Button
                onClick={() => setShowAuthModal("register")}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-6 sm:px-12 py-2.5 sm:py-4 text-sm sm:text-lg font-semibold rounded-lg sm:rounded-2xl w-full sm:w-auto"
              >
                {t('hero.startTrial')}
                <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="bg-white/50 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 px-6 sm:px-12 py-2.5 sm:py-4 text-sm sm:text-lg font-semibold rounded-lg sm:rounded-2xl w-full sm:w-auto"
              >
                <Play className="w-4 h-4 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                {t('hero.watchDemo')}
              </Button>
            </div>

            {/* Ultra-Mobile Hero Stats */}
            <div className="grid grid-cols-3 gap-2 sm:gap-8 max-w-4xl mx-auto px-2">
              <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-lg sm:rounded-2xl p-2 sm:p-6 shadow-xl">
                <div className="text-lg sm:text-3xl font-bold text-blue-600 mb-0.5 sm:mb-2">500+</div>
                <div className="text-gray-700 font-medium text-xs sm:text-base">NGOs Trust Us</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-lg sm:rounded-2xl p-2 sm:p-6 shadow-xl">
                <div className="text-lg sm:text-3xl font-bold text-emerald-600 mb-0.5 sm:mb-2">10K+</div>
                <div className="text-gray-700 font-medium text-xs sm:text-base">Projects</div>
              </div>
              <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-lg sm:rounded-2xl p-2 sm:p-6 shadow-xl">
                <div className="text-lg sm:text-3xl font-bold text-purple-600 mb-0.5 sm:mb-2">99.9%</div>
                <div className="text-gray-700 font-medium text-xs sm:text-base">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-Mobile Features Section */}
      <section ref={featuresRef} id="features" className="py-8 sm:py-24 lg:py-32 mt-6 sm:mt-16 lg:mt-20 transition-all duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
          <div className={`text-center mb-6 sm:mb-16 transition-all duration-1000 delay-200 ${
            featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-6 px-1">
              {t('features.title')}
            </h2>
            <p className="text-sm sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              {t('features.subtitle')}
            </p>
          </div>

          <div className={`grid grid-cols-1 gap-4 sm:gap-8 mb-8 sm:mb-16 transition-all duration-1000 delay-300 ${
            featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Ultra-Compact Project Management */}
            <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-3 sm:p-8">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-2xl shadow-lg mx-auto mb-2 sm:mb-6 flex items-center justify-center">
                  <Target className="w-4 h-4 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-sm sm:text-2xl font-bold text-gray-900 text-center mb-2 sm:mb-4">Smart Project Tracking</h3>
                <p className="text-gray-600 text-center leading-relaxed text-xs sm:text-base">
                  {t('features.budgetManagementDesc')}
                </p>
              </CardContent>
            </Card>

            {/* Ultra-Compact Team Collaboration */}
            <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-3 sm:p-8">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-2xl shadow-lg mx-auto mb-2 sm:mb-6 flex items-center justify-center">
                  <Users className="w-4 h-4 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-sm sm:text-2xl font-bold text-gray-900 text-center mb-2 sm:mb-4">Collaborate Securely & Efficiently</h3>
                <p className="text-gray-600 text-center leading-relaxed text-xs sm:text-base">
                  {t('features.teamManagementDesc')}
                </p>
              </CardContent>
            </Card>

            {/* Ultra-Compact Progress Tracking */}
            <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-3 sm:p-8">
                <div className="w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg sm:rounded-2xl shadow-lg mx-auto mb-2 sm:mb-6 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-sm sm:text-2xl font-bold text-gray-900 text-center mb-2 sm:mb-4">Approval-Ready Reporting</h3>
                <p className="text-gray-600 text-center leading-relaxed text-xs sm:text-base">
                  {t('features.progressTrackingDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why ADEL Over Other Tools Section */}
      <section className="py-8 sm:py-16 lg:py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-6">
              ✨ Why ADEL over Other Tools?
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Unlike generic project management tools, ADEL is specifically designed for NGOs and small organizations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* AI Suggestions */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">🧠</span>
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">No More Report Guesswork</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                AI instantly reviews your reports for clarity, grammar, and impact - no more wondering if your writing is donor-ready
              </p>
            </div>

            {/* PDF Reports */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-emerald-500">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">🧾</span>
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">No More Last-Minute Report Panic</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Professional PDF reports auto-generated from your real data - impress donors and stakeholders every time
              </p>
            </div>

            {/* Approval Workflow */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">✅</span>
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">No More Email Approval Chaos</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Built-in approval workflows - officers submit, admins review, changes tracked. No more lost emails or confusion
              </p>
            </div>

            {/* Simple Focus */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-orange-500">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">🔒</span>
              </div>
              <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">No More Feature Overwhelm</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Built for NGOs, not Fortune 500s. Simple, focused tools that actually help your mission - no confusing enterprise bloat
              </p>
            </div>
          </div>

          {/* Comparison Note */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="bg-white/70 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/50 shadow-lg">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-900">Unlike Trello or Monday:</span> ADEL understands NGO workflows with built-in approval processes, 
                AI-powered report analysis, and professional PDF generation - all designed specifically for mission-driven organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Teams Choose ADEL Section */}
      <section className="py-8 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-6">
              Why Teams Choose ADEL
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8">
              Unlike general-purpose tools, ADEL speaks your language — deadlines, approvals, budgets, and impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {/* Built-in AI feedback */}
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl shadow-lg">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">🧠</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Built-in AI feedback on every report</h3>
              <p className="text-xs sm:text-sm text-gray-600">Instant grammar checks, clarity scores, and improvement suggestions</p>
            </div>

            {/* Ready-to-send PDF reports */}
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl sm:rounded-2xl shadow-lg">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">📝</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Ready-to-send PDF donor reports</h3>
              <p className="text-xs sm:text-sm text-gray-600">Professional reports generated from your real project data</p>
            </div>

            {/* Simple for new team members */}
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl shadow-lg">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">🔒</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Simple enough for new team members</h3>
              <p className="text-xs sm:text-sm text-gray-600">Intuitive interface that anyone can learn in minutes</p>
            </div>

            {/* NGO-specific workflows */}
            <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl sm:rounded-2xl shadow-lg">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-500 rounded-xl mx-auto mb-3 sm:mb-4 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl">🎯</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Designed specifically for NGO workflows</h3>
              <p className="text-xs sm:text-sm text-gray-600">Approval processes, budget tracking, and impact reporting built-in</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to Transform Your Project Management?</h3>
              <p className="text-sm sm:text-lg opacity-90 mb-4 sm:mb-6">Join 500+ NGOs who've eliminated spreadsheet chaos and report panic</p>
              <Button
                onClick={() => setShowAuthModal("register")}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Testimonials Section */}
      <section className="py-8 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-6">
              Trusted by Mission-Driven Organizations
            </h2>
            <p className="text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto">
              See how NGOs and non-profits are streamlining their project management with ADEL
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg sm:text-xl">GH</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Global Hope Foundation</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Education & Healthcare</p>
                </div>
              </div>
              <blockquote className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                "ADEL's AI feedback transformed our reporting process. Our donor reports are now professional and error-free, and the approval workflow eliminated all the back-and-forth emails."
              </blockquote>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-700 font-semibold text-xs">SM</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm">Sarah Martinez</p>
                  <p className="text-xs text-gray-600">Program Director</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg sm:text-xl">CC</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Community Care Alliance</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Social Services</p>
                </div>
              </div>
              <blockquote className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                "Finally, a tool that understands NGO workflows! The PDF export feature saves us hours every month, and the budget tracking keeps our projects on financial track."
              </blockquote>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-emerald-700 font-semibold text-xs">MJ</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm">Michael Johnson</p>
                  <p className="text-xs text-gray-600">Operations Manager</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg sm:text-xl">EI</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Environmental Impact Network</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Conservation</p>
                </div>
              </div>
              <blockquote className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
                "ADEL replaced our messy spreadsheets and eliminated last-minute report panic. The analytics dashboard gives us insights we never had before about our project performance."
              </blockquote>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-700 font-semibold text-xs">LP</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-xs sm:text-sm">Linda Park</p>
                  <p className="text-xs text-gray-600">Executive Director</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">500+ NGOs Trust ADEL</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">10,000+ Projects Managed</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">99.9% Uptime Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
          {/* Additional Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <div className="w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Report Generation</h4>
              <p className="text-sm text-gray-600">Automated progress reports with file attachments</p>
            </div>

            <div className="text-center p-6 bg-emerald-50 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Role-Based Access</h4>
              <p className="text-sm text-gray-600">Secure admin and officer permission levels</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <div className="w-12 h-12 bg-purple-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Deadline Management</h4>
              <p className="text-sm text-gray-600">Never miss important project milestones</p>
            </div>

            <div className="text-center p-6 bg-orange-50 rounded-2xl">
              <div className="w-12 h-12 bg-orange-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Custom Workflows</h4>
              <p className="text-sm text-gray-600">Adapt the platform to your organization's needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={workflowRef} id="how-it-works" className="py-24 lg:py-32 mt-16 lg:mt-20 bg-gradient-to-r from-slate-50 to-blue-50 transition-all duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-12">
          <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${
            workflowInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('workflow.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('workflow.subtitle')}
            </p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-12 transition-all duration-1000 delay-400 ${
            workflowInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl mx-auto flex items-center justify-center mb-6">
                  <User className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('workflow.step1')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('workflow.step1Desc')}
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('workflow.step2')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('workflow.step2Desc')}
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
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('workflow.step3')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('workflow.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 transition-all duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-12">
          <div className={`bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 lg:p-12 text-center text-white max-w-5xl mx-auto transition-all duration-1000 ${
            ctaInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'
          }`}>
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
                onClick={() => setShowContactModal(true)}
                variant="outline"
                size="lg"
                className="border-2 border-white/30 text-black hover:bg-white/10 backdrop-blur-sm transition-all duration-300 px-12 py-4 text-lg font-semibold rounded-2xl"
              >
                <CalendarDays className="w-6 h-6 mr-3" />
                Book a Demo
              </Button>
            </div>
            
            {/* Secondary Contact Button */}
            <div className="mt-8">
              <Button
                onClick={() => setShowContactModal(true)}
                variant="outline"
                size="lg" 
                className="bg-transparent border-2 border-white/50 text-black hover:text-white hover:bg-white/20 transition-all duration-300 px-8 py-3 font-semibold rounded-xl"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-Mobile Footer */}
      <footer className="bg-slate-900 text-white py-6 sm:py-16 mt-6 lg:mt-12 transition-all duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 gap-6 sm:gap-12 mb-6 sm:mb-12">
            {/* Ultra-Compact Brand Section */}
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 sm:space-x-4 mb-3 sm:mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md sm:rounded-xl blur-md opacity-75"></div>
                  <div className="relative p-1.5 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md sm:rounded-xl shadow-xl">
                    <AdelLogo size="sm" className="filter brightness-0 invert w-4 h-4 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <span className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  ADEL
                </span>
              </div>
              <p className="text-gray-400 mb-3 sm:mb-6 leading-relaxed text-xs sm:text-base">
                {t('footer.description')}
              </p>
              {/* Ultra-Compact Social Media Links */}
              <div className="flex justify-center sm:justify-start gap-2 sm:gap-4">
                <a
                  href="https://linkedin.com/company/adel-ngo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2.5 bg-slate-800 hover:bg-blue-600 rounded-md transition-colors duration-300 group"
                >
                  <svg className="w-3 h-3 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com/adel_ngo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2.5 bg-slate-800 hover:bg-blue-400 rounded-md transition-colors duration-300 group"
                >
                  <svg className="w-3 h-3 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href="https://github.com/adel-ngo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 sm:p-2.5 bg-slate-800 hover:bg-gray-600 rounded-md transition-colors duration-300 group"
                >
                  <svg className="w-3 h-3 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="mailto:sissokoadel057@gmail.com?subject=ADEL Inquiry"
                  className="p-1.5 sm:p-2.5 bg-slate-800 hover:bg-green-600 rounded-md transition-colors duration-300 group"
                >
                  <Mail className="w-3 h-3 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Ultra-Compact Quick Links */}
            <div className="text-center sm:text-left">
              <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-6 text-white">
                Quick Links
              </h3>
              <div className="flex justify-center sm:justify-start flex-wrap gap-3 sm:gap-0 sm:block sm:space-y-2">
                <a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-xs sm:text-base">
                  {t('nav.features')}
                </a>
                <span className="text-gray-600 sm:hidden">•</span>
                <a href="#how-it-works" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-xs sm:text-base">
                  How It Works
                </a>
                <span className="text-gray-600 sm:hidden">•</span>
                <a 
                  href="mailto:sissokoadel057@gmail.com?subject=ADEL Demo Request"
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-xs sm:text-base"
                >
                  Request Demo
                </a>
              </div>
            </div>

            {/* Ultra-Compact Contact */}
            <div className="text-center sm:text-left">
              <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-6 text-white">
                Contact
              </h3>
              <div className="flex justify-center sm:justify-start flex-wrap gap-2 sm:gap-0 sm:block sm:space-y-2">
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-xs sm:text-base flex items-center"
                >
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-400" />
                  Support
                </button>
                <span className="text-gray-600 sm:hidden">•</span>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="text-gray-400 hover:text-blue-400 transition-colors duration-300 text-xs sm:text-base flex items-center"
                >
                  <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-400" />
                  Meeting
                </button>
              </div>
            </div>
          </div>

          {/* Ultra-Compact Bottom Footer */}
          <div className="border-t border-slate-800 pt-3 sm:pt-8">
            <div className="text-center space-y-2 sm:space-y-0 sm:flex sm:justify-between sm:items-center">
              <div className="text-gray-500 text-xs order-1">
                © 2025 ADEL. All rights reserved.
              </div>
              <div className="text-gray-500 text-xs order-2">
                Blueray Inc.
              </div>
              <div className="flex justify-center gap-3 sm:gap-6 text-xs order-3">
                <a 
                  href="/privacy-policy"
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-300"
                >
                  Privacy
                </a>
                <a 
                  href="/terms-of-service"
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-300"
                >
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <AuthModals showModal={showAuthModal} onClose={() => setShowAuthModal(null)} />

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Contact Us</h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h4>
                  <p className="text-green-600">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="modal-name"
                        name="name"
                        required
                        value={contactFormData.name}
                        onChange={handleContactChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="modal-email"
                        name="email"
                        required
                        value={contactFormData.email}
                        onChange={handleContactChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="modal-organization" className="block text-sm font-medium text-gray-700 mb-2">
                      Organization
                    </label>
                    <input
                      type="text"
                      id="modal-organization"
                      name="organization"
                      value={contactFormData.organization}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Your NGO name"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="modal-phone"
                      name="phone"
                      value={contactFormData.phone}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="modal-message"
                      name="message"
                      required
                      rows={4}
                      value={contactFormData.message}
                      onChange={handleContactChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Tell us about your organization and how we can help..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}