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

export default function LandingRedesigned() {
  const [showAuthModal, setShowAuthModal] = useState<"login" | "register" | null>(null);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  
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
                onClick={() => {
                  const subject = "Contact Request - ADEL Platform";
                  const body = `Hello,

I would like to get in touch regarding the ADEL platform.

My Information:
- Name: [Your name]
- Organization: [Your organization]
- Email: [Your email]
- Phone: [Your phone number]

How can we help you?
[Please describe your inquiry or interest]

Best regards`;
                  
                  window.location.href = `mailto:sissokoadel057@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}
                variant="outline"
                size="lg" 
                className="bg-transparent border-2 border-white/50 text-black hover:text-white hover:bg-white/20 transition-all duration-300 px-8 py-3 font-semibold rounded-xl"
              >
                <Mail className="w-5 h-5 mr-2" />
                Contacts
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 mt-16 lg:mt-20 transition-all duration-700 ease-in-out">
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
                  <a 
                    href="mailto:sissokoadel057@gmail.com"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                  >
                    sissokoadel057@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <CalendarDays className="w-5 h-5 text-blue-400" />
                  <a 
                    href="mailto:sissokoadel057@gmail.com?subject=Meeting Request - ADEL Platform"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                  >
                    Schedule a Meeting
                  </a>
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
              <div className="flex space-x-6 text-sm">
                <a 
                  href="mailto:sissokoadel057@gmail.com?subject=Privacy Policy Request"
                  className="text-gray-500 hover:text-blue-400 transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a 
                  href="mailto:sissokoadel057@gmail.com?subject=Terms of Service Request"
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
    </div>
  );
}