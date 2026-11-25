'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getNewsData } from '@/lib/getNewsData';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, Building2 } from 'lucide-react';

export default function ContactUsPage() {
  const newsData = getNewsData();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <head>
        <title>Contact Us | Metrotimes - Editorial & Press Office</title>
        <meta name="description" content="Get in touch with Metrotimes newsroom, editorial team, press office, and advertising department." />
        <link rel="canonical" href="https://metrotimes.in/contact-us" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Contact Us | Metrotimes" />
        <meta property="og:description" content="Get in touch with Metrotimes newsroom, editorial team, and advertising department." />
        <meta property="og:url" content="https://metrotimes.in/contact-us" />
      </head>
      <Header 
        categories={newsData.categories}
        ticker={newsData.ticker}
        marketTicker={newsData.marketTicker}
        weatherData={newsData.weatherData}
      />

      {/* LIGHT PROFESSIONAL HERO HEADER */}
      <section className="bg-white border-b border-gray-200 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-red-100">
            <MessageSquare className="w-4 h-4 text-red-600" />
            <span>Editorial & Press Office</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Get In Touch With Metrotimes
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
            Have a news tip, editorial query, feedback, or advertising opportunity? Reach out directly to our newsroom team.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT BODY */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-10 w-full space-y-8">
        
        {/* TWO COLUMN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CONTACT INFO (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-red-600" />
                <span>Bureau & Corporate Information</span>
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Corporate Office</h3>
                    <p className="text-gray-600 leading-relaxed">Plot A-3, A-4 & A-5, Sector 125, Noida, Gautam Buddha Nagar, Uttar Pradesh - 201313</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Email Contacts</h3>
                    <p className="text-gray-600">Newsroom Desk: <span className="font-semibold text-gray-900">editor@metrotimes.com</span></p>
                    <p className="text-gray-600">Advertising: <span className="font-semibold text-gray-900">ads@metrotimes.com</span></p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Phone & Hotline</h3>
                    <p className="text-gray-600">+91 (120) 4077-8000</p>
                    <p className="text-gray-600">+91 (120) 4077-8001</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">Operating Hours</h3>
                    <p className="text-gray-600">News Desk: 24/7 365 Days</p>
                    <p className="text-gray-600">Corporate: Mon - Fri (9:00 AM - 6:00 PM IST)</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* CONTACT FORM (7 COLS) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-2xl font-extrabold text-gray-900">Thank You!</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Your message has been dispatched to the Metrotimes editorial desk. We will respond within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider transition-colors shadow"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Send a Direct Message
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. News Tip / Editorial Inquiry"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Message</label>
                  <textarea 
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Type your message details here..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs border border-gray-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 rounded-xl uppercase tracking-wider shadow-md transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Message</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </main>

      <Footer categories={newsData.categories} />
    </div>
  );
}
