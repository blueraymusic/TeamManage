import AdelLogo from "@/components/adel-logo";
import { FileText, Users, Shield, Gavel, AlertCircle, Mail, ChevronRight, Sparkles, Scale } from "lucide-react";

export default function TermsOfService() {

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                  <AdelLogo size="sm" className="filter brightness-0 invert" />
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                ADEL
              </span>
            </div>
            <a
              href="/"
              className="group flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-xl transition-all duration-300 text-white hover:shadow-lg hover:shadow-purple-500/25 backdrop-blur-sm"
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl mb-8 shadow-2xl shadow-purple-500/25 animate-float">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent leading-tight">
            Terms of Service
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Clear and fair terms that govern the use of our NGO management platform
          </p>
          <div className="inline-flex items-center space-x-3 text-sm text-gray-400 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Last updated: June 24, 2025</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 pb-20">
        <div className="grid gap-8 lg:gap-12">
          
          {/* Agreement to Terms */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-12 hover:bg-white/10 transition-all duration-500 hover:border-white/30">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Gavel className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Agreement to Terms</h2>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  By accessing and using ADEL's project management platform, you agree to be bound by these Terms of Service.
                </p>
                <p>
                  These terms ensure a fair and secure environment for all NGOs using our platform. If you disagree with any part of these terms, please contact us before using the service.
                </p>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 lg:p-12 hover:bg-white/10 transition-all duration-500 hover:border-white/30">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Description of Service</h2>
              </div>
              <p className="text-gray-300 mb-8 text-lg">
                ADEL provides a comprehensive web-based project management platform specifically designed for NGOs and non-profit organizations.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-300">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-300">Project tracking</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-300">
                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-300">Team collaboration</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-300">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-300">Report management</span>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors duration-300">
                  <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                  <span className="text-gray-300">Communication tools</span>
                </div>
              </div>
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
                <h2 className="text-3xl font-bold text-white">Contact Information</h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                Need clarification on these Terms of Service? Our team is available to help you understand how these terms apply to your NGO's specific use case.
              </p>
              <div className="group/contact bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 hover:border-blue-400/50 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
                <div className="flex items-center space-x-3 mb-3">
                  <Mail className="w-6 h-6 text-blue-400 group-hover/contact:animate-pulse" />
                  <a href="mailto:sissokoadel057@gmail.com" className="text-white hover:underline font-medium text-lg">
                    sissokoadel057@gmail.com
                  </a>
                </div>
                <p className="text-blue-200 text-sm">Professional support for all legal inquiries</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}