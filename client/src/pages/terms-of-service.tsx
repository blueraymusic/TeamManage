import AdelLogo from "@/components/adel-logo";
import { FileText, Users, Shield, Gavel, AlertCircle, Mail, ChevronRight, Sparkles, Scale, Send } from "lucide-react";
import { useState } from "react";

export default function TermsOfService() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: '', email: '', organization: '', message: '' });
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
                    {submitted ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Send className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
                        <p className="text-green-600">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-indigo-100 shadow-sm space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                              placeholder="your.email@example.com"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                            Organization
                          </label>
                          <input
                            type="text"
                            id="organization"
                            name="organization"
                            value={formData.organization}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            placeholder="Your NGO or organization name"
                          />
                        </div>
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Message *
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            required
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            placeholder="Please describe your questions about our Terms of Service..."
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
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}