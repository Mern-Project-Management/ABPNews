'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNewsData } from '@/lib/getNewsData';

export default function PrivacyPolicyPage() {
  const newsData = getNewsData();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans">
      <head>
        <title>Privacy Policy | Metrotimes</title>
        <meta name="description" content="Metrotimes Privacy Policy - How we collect, use, and protect your personal information." />
        <link rel="canonical" href="https://metrotimes.in/privacy-policy" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Privacy Policy | Metrotimes" />
        <meta property="og:description" content="Metrotimes Privacy Policy." />
        <meta property="og:url" content="https://metrotimes.in/privacy-policy" />
      </head>
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
            Metrotimes Media (&quot;Metrotimes&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to respecting and protecting the privacy of our readers and users. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website <strong>news.abplive.com</strong> and associated digital services.
          </p>

          <hr className="border-gray-200 my-6" />

          {/* SECTION 1 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              1. Information We Collect
            </h2>
            <p className="text-gray-700">
              We collect information to provide better services and news experiences to all our readers. The types of information we gather include:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li><strong>Personal Data:</strong> Name and email address provided voluntarily when subscribing to newsletters or contacting our support team.</li>
              <li><strong>Log Data & Telemetry:</strong> IP address, browser type, operating system, referring URL, pages viewed, and timestamps.</li>
              <li><strong>Cookies & Tracking:</strong> Cookies and similar web storage technologies to remember preferences and measure audience engagement.</li>
            </ul>
          </section>

          {/* SECTION 2 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700">
              We use the collected information for the following legitimate business purposes:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 pl-2">
              <li>To deliver daily news updates, breaking alerts, and editorial digests.</li>
              <li>To maintain, monitor, and optimize site performance and security.</li>
              <li>To analyze reader trends and aggregate audience demographics.</li>
              <li>To comply with legal obligations and enforce our Terms of Use.</li>
            </ul>
          </section>

          {/* SECTION 3 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              3. Cookies and Advertising Partners
            </h2>
            <p className="text-gray-700">
              Metrotimes works with third-party advertising vendors (such as Google AdSense) to serve advertisements on our site. These vendors may use cookies to show ads based on a user&apos;s prior visits to our website or other websites on the Internet.
            </p>
            <p className="text-gray-700">
              Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-red-600 font-semibold hover:underline">Google Ad Settings</a> or <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-red-600 font-semibold hover:underline">aboutads.info</a>.
            </p>
          </section>

          {/* SECTION 4 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              4. Data Protection & Security
            </h2>
            <p className="text-gray-700">
              We implement industry-standard administrative, technical, and physical security measures to safeguard your personal data. All connections are secured via SSL/TLS encryption. However, please note that no transmission over the Internet can be guaranteed 100% secure.
            </p>
          </section>

          {/* SECTION 5 */}
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              5. Your Rights & Contact Information
            </h2>
            <p className="text-gray-700">
              You have the right to request access to, correction of, or deletion of your personal data stored with us. If you have any questions regarding this Privacy Policy, please contact our Compliance Officer:
            </p>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-1 text-xs sm:text-sm text-gray-800">
              <p><strong>Compliance Officer:</strong> Metrotimes Media Pvt. Ltd.</p>
              <p><strong>Email:</strong> privacy@metrotimesmedia.com</p>
              <p><strong>Address:</strong> Plot A-3, Sector 125, Noida, Uttar Pradesh - 201313, India</p>
            </div>
          </section>

        </article>
      </main>

      <Footer categories={newsData.categories} />
    </div>
  );
}
