import AdelLogo from "@/components/adel-logo";
import { Shield, Lock, Eye, Database, UserCheck, Mail, ChevronRight, Sparkles } from "lucide-react";

export default function PrivacyPolicy() {

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
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your privacy and data security are fundamental to how we build and operate ADEL
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
            
            {/* Introduction */}
            <section className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      At ADEL, we are committed to protecting your privacy and ensuring the security of your personal information.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      This Privacy Policy explains how we collect, use, and safeguard your data when you use our NGO project management platform, ensuring transparency in all our data practices.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Information We Collect */}
            <section className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>
                  <div className="grid gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:border-blue-200 transition-colors duration-300">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                        Account Information
                      </h3>
                      <p className="text-gray-700">Name, email address, organization details, and role within your organization.</p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 hover:border-purple-200 transition-colors duration-300">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-purple-600" />
                        Project Data
                      </h3>
                      <p className="text-gray-700">Project information, reports, files, and communications within your organization's workspace.</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:border-green-200 transition-colors duration-300">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        <Eye className="w-5 h-5 mr-2 text-green-600" />
                        Usage Information
                      </h3>
                      <p className="text-gray-700">How you interact with our platform, including pages visited and features used.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200">
                    <p className="text-gray-700 mb-4">We use your information responsibly to deliver the best possible service:</p>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3 group">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Provide and maintain our comprehensive project management services</span>
                      </li>
                      <li className="flex items-start space-x-3 group">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Enable seamless collaboration within your organization</span>
                      </li>
                      <li className="flex items-start space-x-3 group">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Send important updates and notifications about your projects</span>
                      </li>
                      <li className="flex items-start space-x-3 group">
                        <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Continuously improve our platform and develop new features</span>
                      </li>
                      <li className="flex items-start space-x-3 group">
                        <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                        <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Ensure robust security and prevent unauthorized access</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
                    <p className="text-gray-700 leading-relaxed text-lg mb-4">
                      We implement industry-standard security measures to protect your data, including:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">End-to-end encryption</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700">Secure cloud servers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-700">Regular security audits</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-gray-700">Data isolation protocols</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Your organization's data remains completely isolated and accessible only to authorized members of your team.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Have questions about this Privacy Policy or our data practices? We're here to help and ensure complete transparency about how we handle your information.
                  </p>
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 animate-pulse" />
                      <a href="mailto:sissokoadel057@gmail.com" className="text-white hover:underline font-medium">
                        sissokoadel057@gmail.com
                      </a>
                    </div>
                    <p className="text-blue-100 text-sm mt-2">We typically respond within 24 hours</p>
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