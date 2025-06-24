import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using DevMatch, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
            <p>DevMatch is a platform that connects developers with projects and other developers. We provide tools and services to facilitate collaboration and project management.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Respect other users' rights and privacy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
            <p>All content and materials available on DevMatch are protected by intellectual property rights. Users retain ownership of their content but grant us a license to use it.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Privacy</h2>
            <p>We collect and use your information in accordance with our Privacy Policy. By using DevMatch, you consent to such collection and use.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Termination</h2>
            <p>We reserve the right to terminate or suspend access to our service for any user who violates these terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. We will notify users of any material changes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact Information</h2>
            <p>If you have any questions about these Terms, please contact us at support@devmatch.com</p>
          </section>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 