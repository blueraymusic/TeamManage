import AdelLogo from "@/components/adel-logo";
import { FileText, Users, Shield, Gavel, AlertCircle, Mail } from "lucide-react";

export default function TermsOfService() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
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
              className="px-4 py-2 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 rounded-lg transition-all duration-300 font-medium"
            >
              Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative py-16 lg:py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6">
            <Gavel className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Clear and fair terms that govern the use of our NGO management platform
          </p>
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2">
            <span>Last updated: June 24, 2025</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 pb-16">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="space-y-12">
              {/* Agreement to Terms */}
              <section className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Agreement to Terms</h2>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
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
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
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

              {/* User Responsibilities */}
              <section className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">User Responsibilities</h2>
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200">
                      <p className="text-gray-700 mb-4">As a user of ADEL, you agree to:</p>
                      <ul className="space-y-4">
                        <li className="flex items-start space-x-3 group">
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Provide accurate and complete registration information</span>
                        </li>
                        <li className="flex items-start space-x-3 group">
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Maintain the security of your account credentials</span>
                        </li>
                        <li className="flex items-start space-x-3 group">
                          <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Use the service only for lawful purposes and NGO activities</span>
                        </li>
                        <li className="flex items-start space-x-3 group">
                          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Respect other users and maintain professional conduct</span>
                        </li>
                        <li className="flex items-start space-x-3 group">
                          <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Never attempt to compromise the security of our platform</span>
                        </li>
                        <li className="flex items-start space-x-3 group">
                          <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"></div>
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Comply with all applicable laws and regulations</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Account Management */}
              <section className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Management</h2>
                    <div className="grid gap-6">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                          <Users className="w-5 h-5 mr-2 text-orange-600" />
                          Organization Accounts
                        </h3>
                        <p className="text-gray-700">Each organization receives a unique code for team member registration. Administrators are responsible for managing team access and permissions.</p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                          <Shield className="w-5 h-5 mr-2 text-blue-600" />
                          Data Ownership
                        </h3>
                        <p className="text-gray-700">You retain ownership of all data and content uploaded to your organization's workspace.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="relative">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        ADEL is provided "as is" without warranties of any kind. We are not liable for any indirect, 
                        incidental, or consequential damages arising from your use of our service.
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Need clarification on these Terms of Service? Our team is available to help you understand how these terms apply to your NGO's specific use case.
                    </p>
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 animate-pulse" />
                        <a href="mailto:sissokoadel057@gmail.com" className="text-white hover:underline font-medium">
                          sissokoadel057@gmail.com
                        </a>
                      </div>
                      <p className="text-blue-100 text-sm mt-2">Professional support for all legal inquiries</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}