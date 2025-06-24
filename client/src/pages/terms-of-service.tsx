import AdelLogo from "@/components/adel-logo";
import { FileText, Users, Shield, Gavel, AlertCircle, Mail, ChevronRight, Sparkles, Scale } from "lucide-react";

export default function TermsOfService() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl blur-md opacity-75"></div>
                <div className="relative p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-xl">
                  <AdelLogo size="sm" className="filter brightness-0 invert" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ADEL
              </span>
            </div>
            <a
              href="/"
              className="group flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 rounded-lg transition-all duration-300 font-medium"
            >
              <span>Back to Home</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 animate-float">
            <Gavel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Clear and fair terms that govern the use of our NGO management platform
          </p>
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Last updated: June 24, 2025</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="space-y-12">
            
            {/* Agreement to Terms */}
            <section className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Agreement to Terms</h2>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      By accessing and using ADEL's project management platform, you agree to be bound by these Terms of Service.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      These terms ensure a fair and secure environment for all NGOs using our platform. If you disagree with any part of these terms, please contact us before using the service.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Description of Service */}
            <section className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Description of Service</h2>
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      ADEL provides a comprehensive web-based project management platform specifically designed for NGOs and non-profit organizations.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-gray-700">Project tracking</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <span className="text-gray-700">Team collaboration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-gray-700">Report management</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <span className="text-gray-700">Communication tools</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl p-8 border border-indigo-200">
                    <p className="text-gray-700 leading-relaxed text-lg mb-8">
                      Need clarification on these Terms of Service? Our team is available to help you understand how these terms apply to your NGO's specific use case.
                    </p>
                    <div className="bg-white rounded-lg p-6 border border-indigo-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <a href="mailto:sissokoadel057@gmail.com" className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                              sissokoadel057@gmail.com
                            </a>
                            <p className="text-gray-600 text-sm mt-1">Professional support for all legal inquiries</p>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}