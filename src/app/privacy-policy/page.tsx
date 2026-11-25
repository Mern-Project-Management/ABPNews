import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNewsData } from '@/lib/getNewsData';

export const metadata: Metadata = {
  title: 'Privacy Policy | Metrotimes',
  description: 'Metrotimes Privacy Policy - How we collect, use, and protect your personal information.',
  alternates: {
    canonical: 'https://metrotimes.in/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Privacy Policy | Metrotimes',
    description: 'Metrotimes Privacy Policy.',
    url: 'https://metrotimes.in/privacy-policy',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  const newsData = getNewsData();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      <link rel="canonical" href="https://metrotimes.in/privacy-policy" />
      <Header 
        categories={newsData.categories}
        ticker={newsData.ticker}
        marketTicker={newsData.marketTicker}
        weatherData={newsData.weatherData}
      />

      {/* SIMPLE PAGE HEADER */}
      <div className="bg-gray-50 border-b border-gray-200 py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-500">
            Last Updated: October 2026 | Metrotimes Media Pvt. Ltd.
          </p>
        </div>
      </div>

      {/* SIMPLE & READABLE MAIN CONTENT */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full">
        <article className="prose prose-sm sm:prose max-w-none text-gray-800 space-y-6 text-sm leading-relaxed">
          <p className="text-sm text-gray-700 leading-relaxed">
            Metrotimes Media (&quot;Metrotimes&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to respecting and protecting the privacy of our readers and users. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website <strong>metrotimes.in</strong> and associated digital services.
          </p>

          <hr className="border-gray-200 my-6" />

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">1. Information We Collect</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              We may collect personal identification information (such as your Name, Email address, and phone number when submitting editorial tips or contact forms), as well as anonymous browsing information (IP address, browser type, device details, and pages viewed) via cookies and analytics services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">2. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>To provide, maintain, and improve our journalism content and user experience.</li>
              <li>To respond to your inquiries, press inquiries, and editorial feedback.</li>
              <li>To detect and prevent fraudulent, malicious, or abusive activities.</li>
              <li>To serve relevant news updates, notifications, and personalized content.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">3. Cookies & Tracking Technologies</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Metrotimes uses cookies to optimize website speed, store user preferences (like typography sizes), and understand audience traffic trends. You may choose to disable cookies in your browser settings at any time without losing core reading access.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">4. Third-Party Links & Content</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Our articles may include links to external news sources, partners, or social media platforms. We are not responsible for the privacy practices or content of third-party domains.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">5. Security of Information</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              We employ standard SSL encryption and industry-accepted safeguards to preserve the confidentiality of any submitted information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-gray-900">6. Contact Our Grievance Officer</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              If you have any questions or complaints regarding this policy or our data practices, contact:
            </p>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs space-y-1">
              <p className="font-bold text-gray-900">Grievance Officer, Metrotimes Media</p>
              <p className="text-gray-600">Email: grievance@metrotimes.com</p>
              <p className="text-gray-600">Address: Sector 125, Noida, Uttar Pradesh - 201313</p>
            </div>
          </section>
        </article>
      </main>

      <Footer categories={newsData.categories} />
    </div>
  );
}
