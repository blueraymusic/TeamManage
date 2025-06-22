import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AuthModals from "@/components/auth-modals";
import LanguageSwitcher from "@/components/language-switcher";
import { t } from "@/lib/i18n";
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
  Projector,
  Clock,
  DollarSign,
  ListTodo,
  FileText,
  Plus,
  List,
  Check,
  X,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState<"login" | "register" | null>(null);
  const [dashboardView, setDashboardView] = useState<"admin" | "officer">("admin");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src="@assets/logoO_1750625759438.png" 
                  alt="ADEL Logo" 
                  className="w-10 h-10 object-contain"
                />
                <span className="text-2xl font-bold text-gray-900">ADEL</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t('nav.features')}
              </a>
              <a href="#about" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t('nav.about')}
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-500 transition-colors">
                {t('nav.contact')}
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button
                variant="ghost"
                className="text-blue-500 hover:text-blue-600"
                onClick={() => setShowAuthModal("login")}
              >
                {t('nav.signin')}
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setShowAuthModal("register")}
              >
                {t('nav.getstarted')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-green-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="flex items-center mb-6">
                <img 
                  src="@assets/logoO_1750625759438.png" 
                  alt="ADEL Logo" 
                  className="w-16 h-16 object-contain mr-4"
                />
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
                  {t('hero.title').split('NGO')[0]}
                  <span className="text-blue-500">NGO</span>
                  {t('hero.title').split('NGO')[1]}
                </h1>
              </div>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              {/* Role Selection Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200 hover:border-red-400 transition-all">
                  <div className="text-center">
                    <Crown className="w-10 h-10 mx-auto mb-3 text-red-600" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Administrator</h3>
                    <p className="text-gray-600 text-sm mb-4">Create your NGO organization and manage everything</p>
                    <Button
                      size="lg"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                      onClick={() => setShowAuthModal("register")}
                    >
                      Create Organization
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all">
                  <div className="text-center">
                    <Users className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Officer</h3>
                    <p className="text-gray-600 text-sm mb-4">Join your team and work on projects</p>
                    <Button
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      onClick={() => setShowAuthModal("register")}
                    >
                      Join Organization
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-4">Already have an account?</p>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-8 py-3"
                  onClick={() => setShowAuthModal("login")}
                >
                  <User className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
                alt="NGO Dashboard Interface"
                className="rounded-2xl material-shadow-lg w-full"
              />
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl material-shadow animate-slide-up">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">12 Active Projects</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl material-shadow animate-slide-up">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">89%</div>
                  <div className="text-xs text-gray-600">Report Approval Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="material-shadow hover:material-shadow-lg transition-all group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                  <Users className="w-8 h-8 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('features.teamManagement')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('features.teamManagementDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="material-shadow hover:material-shadow-lg transition-all group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
                  <TrendingUp className="w-8 h-8 text-green-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('features.progressTracking')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('features.progressTrackingDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="material-shadow hover:material-shadow-lg transition-all group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
                  <Upload className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('features.reportSubmissions')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('features.reportSubmissionsDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="material-shadow hover:material-shadow-lg transition-all group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                  <Wallet className="w-8 h-8 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('features.budgetManagement')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('features.budgetManagementDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="material-shadow hover:material-shadow-lg transition-all group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
                  <Smartphone className="w-8 h-8 text-green-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('features.mobileOptimized')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('features.mobileOptimizedDesc')}
                </p>
              </CardContent>
            </Card>

            <Card className="material-shadow hover:material-shadow-lg transition-all group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
                  <Globe className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('features.multilingualSupport')}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {t('features.multilingualSupportDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('workflow.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('workflow.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('workflow.step1')}</h3>
              <p className="text-gray-600 mb-6">
                {t('workflow.step1Desc')}
              </p>
              <Card className="material-shadow">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-500 mb-2">Organization Code</div>
                  <div className="font-mono font-bold text-blue-500 text-lg">#NGO-7492</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('workflow.step2')}</h3>
              <p className="text-gray-600 mb-6">
                {t('workflow.step2Desc')}
              </p>
              <Card className="material-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Clean Water Project</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-600">Pending Review</Badge>
                  </div>
                  <div className="text-xs text-gray-400">Report uploaded by John Doe</div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('workflow.step3')}</h3>
              <p className="text-gray-600 mb-6">
                {t('workflow.step3Desc')}
              </p>
              <Card className="material-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Overall Progress</span>
                    <span className="text-sm font-bold text-green-500">73%</span>
                  </div>
                  <Progress value={73} className="h-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              See ADEL in Action
            </h2>
            <p className="text-xl text-gray-600">
              Experience both admin and officer perspectives
            </p>
          </div>

          {/* Dashboard Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-lg">
              <Button
                variant={dashboardView === "admin" ? "default" : "ghost"}
                className={dashboardView === "admin" ? "bg-white material-shadow text-blue-500" : ""}
                onClick={() => setDashboardView("admin")}
              >
                Admin Dashboard
              </Button>
              <Button
                variant={dashboardView === "officer" ? "default" : "ghost"}
                className={dashboardView === "officer" ? "bg-white material-shadow text-blue-500" : ""}
                onClick={() => setDashboardView("officer")}
              >
                Officer Dashboard
              </Button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="bg-gray-50 rounded-2xl p-8 material-shadow-lg">
            {dashboardView === "admin" ? (
              <>
                <div className="grid lg:grid-cols-4 gap-6 mb-8">
                  <Card className="material-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">12</div>
                          <div className="text-sm text-gray-600">Active Projects</div>
                        </div>
                        <Projector className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="material-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">47</div>
                          <div className="text-sm text-gray-600">Pending Reports</div>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="material-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">24</div>
                          <div className="text-sm text-gray-600">Team Members</div>
                        </div>
                        <Users className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="material-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">$84K</div>
                          <div className="text-sm text-gray-600">Total Budget</div>
                        </div>
                        <DollarSign className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="material-shadow">
                    <CardContent className="p-0">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">Recent Projects</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">Clean Water Initiative</div>
                            <div className="text-sm text-gray-600">Due: Dec 30, 2024</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-500">68%</div>
                            <Progress value={68} className="w-16 h-2 mt-1" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">Education Support</div>
                            <div className="text-sm text-gray-600">Due: Jan 15, 2025</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-500">45%</div>
                            <Progress value={45} className="w-16 h-2 mt-1" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="material-shadow">
                    <CardContent className="p-0">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">Pending Approvals</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium text-gray-900">Monthly Progress Update</div>
                              <div className="text-sm text-gray-600">by Sarah Johnson</div>
                            </div>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-600">Pending</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <>
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  <Card className="material-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">8</div>
                          <div className="text-sm text-gray-600">My Projects</div>
                        </div>
                        <ListTodo className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="material-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">23</div>
                          <div className="text-sm text-gray-600">Reports Submitted</div>
                        </div>
                        <FileText className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="material-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">5</div>
                          <div className="text-sm text-gray-600">Pending Review</div>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <Card className="material-shadow">
                    <CardContent className="p-0">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4">
                          <Plus className="w-5 h-5 mr-2" />
                          Submit New Report
                        </Button>
                        <Button variant="outline" className="w-full p-4">
                          <List className="w-5 h-5 mr-2" />
                          View My Projects
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="material-shadow">
                    <CardContent className="p-0">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">Recent Submissions</h3>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-gray-900">Week 3 Progress</div>
                            <Badge className="bg-green-100 text-green-600">Approved</Badge>
                          </div>
                          <div className="text-sm text-gray-600">Clean Water Initiative</div>
                          <div className="text-xs text-gray-400 mt-1">Submitted Dec 15, 2024</div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-gray-900">Monthly Summary</div>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-600">Pending</Badge>
                          </div>
                          <div className="text-sm text-gray-600">Education Support</div>
                          <div className="text-xs text-gray-400 mt-1">Submitted Dec 18, 2024</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-500 to-green-500 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your NGO Management?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join thousands of NGOs already using ADEL to streamline their project management
            and maximize their impact in communities worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-500 hover:bg-gray-100 px-8 py-4 text-lg material-shadow"
              onClick={() => setShowAuthModal("register")}
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-500 px-8 py-4 text-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="text-2xl font-bold">ADEL</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering NGOs with modern project management tools for maximum community impact.
              </p>
              <div className="flex space-x-4">
                <Facebook className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Twitter className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                <Linkedin className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>&copy; 2024 ADEL. All rights reserved. Built for NGOs, by NGO management experts.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <AuthModals
        showModal={showAuthModal}
        onClose={() => setShowAuthModal(null)}
      />
    </div>
  );
}
