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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 lg:px-8 xl:px-12 h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-sm opacity-75"></div>
                <div className="relative p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <AdelLogo size="sm" className="filter brightness-0 invert" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ADEL
              </span>
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
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => {
                    const subject = "ADEL Demo Request";
                    const body = `Hello,

I'm interested in learning more about ADEL for our organization.

Organization Details:
- Company/NGO: [Your organization name]
- Team Size: [Number of team members]
- Organization Type: [NGO/Government/Corporate/Other]

Meeting Purpose:
- [ ] Product Demo
- [ ] Implementation Planning  
- [ ] Pricing Discussion
- [ ] Technical Integration

Preferred Meeting Time:
- [ ] Morning (9 AM - 12 PM)
- [ ] Afternoon (12 PM - 5 PM)
- [ ] Evening (5 PM - 8 PM)

Additional Information:
[Please share any specific requirements or questions]

Best regards,
[Your name]
[Your email]
[Your phone number]`;
                    
                    window.location.href = `mailto:sissokoadel057@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }}
                  variant="outline"
                  className="border-2 border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 px-6 py-2 font-semibold rounded-lg"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Book Demo
                </Button>
                
                <Button
                  onClick={() => setShowAuthModal("login")}
                  variant="outline"
                  className="border-2 border-slate-300 text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300 px-6 py-2 font-semibold rounded-lg"
                >
                  Log In
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

      {/* Hero Section */}
      <section ref={heroRef} className="relative py-24 lg:py-32 transition-all duration-700 ease-in-out">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 transition-all duration-700"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 xl:px-12">
          <div className={`text-center max-w-5xl mx-auto transition-all duration-1000 ${
            heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="mb-8">
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 text-lg font-medium mb-8 inline-block">
                NGO Project Management Platform
              </Badge>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              {t('hero.title')}
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              <Button
                onClick={() => setShowAuthModal("register")}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 px-12 py-4 text-lg font-semibold rounded-2xl"
              >
                {t('hero.startTrial')}
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="bg-white/50 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 px-12 py-4 text-lg font-semibold rounded-2xl"
              >
                <Play className="w-6 h-6 mr-3" />
                {t('hero.watchDemo')}
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
      <section ref={featuresRef} id="features" className="py-24 lg:py-32 mt-16 lg:mt-20 transition-all duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-12">
          <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${
            featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-300 ${
            featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* Project Management */}
            <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mx-auto mb-6 flex items-center justify-center">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">{t('features.budgetManagement')}</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {t('features.budgetManagementDesc')}
                </p>
              </CardContent>
            </Card>

            {/* Team Collaboration */}
            <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">{t('features.teamManagement')}</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {t('features.teamManagementDesc')}
                </p>
              </CardContent>
            </Card>

            {/* Progress Tracking */}
            <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg mx-auto mb-6 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">{t('features.progressTracking')}</h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {t('features.progressTrackingDesc')}
                </p>
              </CardContent>
            </Card>
          </div>

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
                onClick={() => {
                  const subject = "ADEL Demo Request";
                  const body = `Hello,

I'm interested in learning more about ADEL for our organization.

Organization Details:
- Company/NGO: [Your organization name]
- Team Size: [Number of team members]
- Organization Type: [NGO/Government/Corporate/Other]

Meeting Purpose:
- [ ] Product Demo
- [ ] Implementation Planning  
- [ ] Pricing Discussion
- [ ] Technical Integration

Preferred Meeting Time:
- [ ] Morning (9 AM - 12 PM)
- [ ] Afternoon (12 PM - 5 PM)
- [ ] Evening (5 PM - 8 PM)

Additional Information:
[Please share any specific requirements or questions]

Best regards,
[Your name]
[Your email]
[Your phone number]`;
                  
                  window.location.href = `mailto:sissokoadel057@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}
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

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 mt-8 lg:mt-12 transition-all duration-700 ease-in-out">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-4 mb-6">
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
              <p className="text-gray-400 mb-6 leading-relaxed">
                {t('footer.description')}
              </p>
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a
                  href="https://linkedin.com/company/adel-ngo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-blue-600 rounded-lg transition-colors duration-300 group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com/adel_ngo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-blue-400 rounded-lg transition-colors duration-300 group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href="https://github.com/adel-ngo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-800 hover:bg-gray-600 rounded-lg transition-colors duration-300 group"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a
                  href="mailto:sissokoadel057@gmail.com?subject=ADEL Inquiry"
                  className="p-2 bg-slate-800 hover:bg-green-600 rounded-lg transition-colors duration-300 group"
                >
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                    {t('nav.features')}
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                    How It Works
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:sissokoadel057@gmail.com?subject=ADEL Demo Request"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                  >
                    Request Demo
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">
                Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                  >
                    Contact Support
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarDays className="w-5 h-5 text-blue-400" />
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                  >
                    Schedule a Meeting
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-500 text-sm">
                © 2025 ADEL. All rights reserved.
              </div>
              <div className="text-gray-500 text-sm">
                Blueray Inc.
              </div>
              <div className="flex space-x-6 text-sm">
                <a 
                  href="/privacy-policy"
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a 
                  href="/terms-of-service"
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-300"
                >
                  Terms of Service
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