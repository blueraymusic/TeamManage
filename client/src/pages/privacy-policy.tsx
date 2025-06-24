import AdelLogo from "@/components/adel-logo";

export default function PrivacyPolicy() {

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
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: June 24, 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                At ADEL, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, and safeguard your data when you use our NGO project management platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                  <p className="text-gray-700">Name, email address, organization details, and role within your organization.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Project Data</h3>
                  <p className="text-gray-700">Project information, reports, files, and communications within your organization's workspace.</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Usage Information</h3>
                  <p className="text-gray-700">How you interact with our platform, including pages visited and features used.</p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Provide and maintain our project management services</li>
                <li>Enable collaboration within your organization</li>
                <li>Send important updates and notifications</li>
                <li>Improve our platform and develop new features</li>
                <li>Ensure security and prevent unauthorized access</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your data, including encryption, 
                secure servers, and regular security audits. Your organization's data is isolated and accessible 
                only to authorized members of your team.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your data for as long as your account is active or as needed to provide services. 
                You can request deletion of your data at any time by contacting us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
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