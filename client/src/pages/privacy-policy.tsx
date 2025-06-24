import AdelLogo from "@/components/adel-logo";
import { Shield, Lock, Eye, Database, UserCheck, Mail, ChevronRight, Sparkles } from "lucide-react";

export default function PrivacyPolicy() {

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                  <AdelLogo size="sm" className="filter brightness-0 invert" />
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                ADEL
              </span>
            </div>
            <a
              href="/"
              className="group flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white hover:shadow-lg hover:shadow-blue-500/25 backdrop-blur-sm"
            >
              <span>Back to Home</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative py-20 lg:py-32">
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-8 shadow-2xl shadow-blue-500/25 animate-float">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Your privacy and data security are fundamental to how we build and operate ADEL
          </p>
          <div className="inline-flex items-center space-x-3 text-sm text-gray-400 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Last updated: June 24, 2025</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid gap-8 lg:gap-12">
          
          {/* Introduction Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-12 hover:bg-white/10 transition-all duration-500 hover:border-white/30">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Eye className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Introduction</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  At ADEL, we are committed to protecting your privacy and ensuring the security of your personal information.
                </p>
                <p>
                  This Privacy Policy explains how we collect, use, and safeguard your data when you use our NGO project management platform, ensuring transparency in all our data practices.
                </p>
              </div>
            </div>
          </div>

          {/* Information We Collect */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-12 hover:bg-white/10 transition-all duration-500 hover:border-white/30">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Information We Collect</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="group/card relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 p-6 hover:bg-blue-500/20 transition-all duration-300 hover:border-blue-400/40 hover:scale-105">
                  <UserCheck className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">Account Information</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Name, email address, organization details, and role within your organization.</p>
                </div>
                <div className="group/card relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-6 hover:bg-purple-500/20 transition-all duration-300 hover:border-purple-400/40 hover:scale-105">
                  <Shield className="w-8 h-8 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">Project Data</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Project information, reports, files, and communications within your organization's workspace.</p>
                </div>
                <div className="group/card relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 p-6 hover:bg-emerald-500/20 transition-all duration-300 hover:border-emerald-400/40 hover:scale-105">
                  <Eye className="w-8 h-8 text-emerald-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">Usage Information</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">How you interact with our platform, including pages visited and features used.</p>
                </div>
              </div>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-12 hover:bg-white/10 transition-all duration-500 hover:border-white/30">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <UserCheck className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">How We Use Your Information</h2>
              </div>
              <p className="text-gray-300 mb-8 text-lg">We use your information responsibly to deliver the best possible service:</p>
              <div className="space-y-4">
                <div className="group/item flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                  <span className="text-gray-300 group-hover/item:text-white transition-colors duration-300">Provide and maintain our comprehensive project management services</span>
                </div>
                <div className="group/item flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-1 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                  <span className="text-gray-300 group-hover/item:text-white transition-colors duration-300">Enable seamless collaboration within your organization</span>
                </div>
                <div className="group/item flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mt-1 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                  <span className="text-gray-300 group-hover/item:text-white transition-colors duration-300">Send important updates and notifications about your projects</span>
                </div>
                <div className="group/item flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-1 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                  <span className="text-gray-300 group-hover/item:text-white transition-colors duration-300">Continuously improve our platform and develop new features</span>
                </div>
                <div className="group/item flex items-start space-x-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                  <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mt-1 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300"></div>
                  <span className="text-gray-300 group-hover/item:text-white transition-colors duration-300">Ensure robust security and prevent unauthorized access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Data Security */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-12 hover:bg-white/10 transition-all duration-500 hover:border-white/30">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Data Security</h2>
              </div>
              <p className="text-gray-300 mb-8 text-lg">We implement industry-standard security measures to protect your data:</p>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-300">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">End-to-end encryption</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-300">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-300">Secure cloud servers</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-300">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">Regular security audits</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-300">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-300">Data isolation protocols</span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Your organization's data remains completely isolated and accessible only to authorized members of your team.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-12 hover:bg-white/10 transition-all duration-500 hover:border-white/30">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Contact Us</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                Have questions about this Privacy Policy or our data practices? We're here to help and ensure complete transparency about how we handle your information.
              </p>
              <div className="group/contact bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 hover:border-blue-400/50 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                <div className="flex items-center space-x-3 mb-3">
                  <Mail className="w-6 h-6 text-blue-400 group-hover/contact:animate-pulse" />
                  <a href="mailto:sissokoadel057@gmail.com" className="text-white hover:underline font-medium text-lg">
                    sissokoadel057@gmail.com
                  </a>
                </div>
                <p className="text-blue-200 text-sm">We typically respond within 24 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}