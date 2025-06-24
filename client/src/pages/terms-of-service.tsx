import AdelLogo from "@/components/adel-logo";

export default function TermsOfService() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <AdelLogo size="md" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ADEL
              </span>
            </div>
            <a
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
            >
              Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: June 24, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using ADEL's project management platform, you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                ADEL provides a web-based project management platform specifically designed for NGOs and non-profit organizations. 
                Our service includes project tracking, team collaboration, report management, and communication tools.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service only for lawful purposes</li>
                <li>Respect other users and maintain professional conduct</li>
                <li>Not attempt to compromise the security of our platform</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Account Management</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Organization Accounts</h3>
                  <p className="text-gray-700">Each organization receives a unique code for team member registration. Administrators are responsible for managing team access and permissions.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Data Ownership</h3>
                  <p className="text-gray-700">You retain ownership of all data and content uploaded to your organization's workspace.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Service Availability</h2>
              <p className="text-gray-700 leading-relaxed">
                We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                We may perform maintenance that temporarily affects service availability, and we will provide 
                advance notice when possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                The ADEL platform, including its design, functionality, and underlying technology, is our intellectual property. 
                You may not copy, modify, or redistribute our platform without explicit permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                ADEL is provided "as is" without warranties of any kind. We are not liable for any indirect, 
                incidental, or consequential damages arising from your use of our service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                Either party may terminate this agreement at any time. Upon termination, your access to the 
                service will cease, and you may request export of your data within 30 days.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> <a href="mailto:sissokoadel057@gmail.com" className="text-blue-600 hover:underline">sissokoadel057@gmail.com</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}