'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/lib/getNewsData';

interface FooterProps {
  categories: Category[];
}

interface SocialLink {
  platform: string;
  title: string;
  url: string;
  isActive: boolean;
  order: number;
}

const DEFAULT_SOCIALS: SocialLink[] = [
  { platform: 'facebook', title: 'Facebook', url: 'https://facebook.com', isActive: true, order: 0 },
  { platform: 'twitter', title: 'Twitter / X', url: 'https://twitter.com', isActive: true, order: 1 },
  { platform: 'instagram', title: 'Instagram', url: 'https://instagram.com', isActive: true, order: 2 },
  { platform: 'youtube', title: 'YouTube', url: 'https://youtube.com', isActive: true, order: 3 },
];

function getPlatformIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'twitter':
    case 'x':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
        </svg>
      );
    case 'telegram':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.943z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      );
  }
}

function getPlatformHoverClass(platform: string) {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return 'hover:bg-[#1877F2]';
    case 'twitter':
    case 'x':
      return 'hover:bg-black';
    case 'instagram':
      return 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]';
    case 'youtube':
      return 'hover:bg-[#FF0000]';
    case 'whatsapp':
      return 'hover:bg-[#25D366]';
    case 'telegram':
      return 'hover:bg-[#0088cc]';
    case 'linkedin':
      return 'hover:bg-[#0A66C2]';
    default:
      return 'hover:bg-red-600';
  }
}

export default function Footer({ categories }: FooterProps) {
  const displayCategories = categories.slice(0, 8);
  const [logoUrl, setLogoUrl] = React.useState('/logoupdate.png');
  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>(DEFAULT_SOCIALS);

  React.useEffect(() => {
    const loadDynamicSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          if (data.settings.logoUrl) {
            setLogoUrl(data.settings.logoUrl);
          }
          if (Array.isArray(data.settings.socialLinks) && data.settings.socialLinks.length > 0) {
            setSocialLinks(data.settings.socialLinks);
          }
        }
      } catch (e) {
        // keep fallback
      }
    };
    loadDynamicSettings();
  }, []);

  const activeSocials = socialLinks.filter((item) => item.isActive);

  return (
    <footer className="bg-[#0a1d28] text-gray-400 border-t-4 border-red-600">

      {/* MAIN FOOTER LINKS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

        {/* SECTION 1: BRAND COL */}
        <div className="space-y-3">
          <Link href="/" className="inline-block bg-white px-3 py-1.5 rounded shadow-sm hover:opacity-95 transition-opacity">
            <img
              src={logoUrl || '/logoupdate.png'}
              alt="Metrotimes"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/logoupdate.png';
              }}
              className="h-7 sm:h-8 max-w-[170px] w-auto object-contain"
            />
          </Link>
          <p className="text-xs text-gray-400 leading-relaxed">
            Metrotimes is India&apos;s leading digital news destination bringing real-time breaking news updates, political coverage, sports, entertainment, and ground reports.
          </p>
        </div>

        {/* SECTION 2: NEWS CATEGORIES (4 and 4) */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase text-white tracking-wider border-b border-gray-700/80 pb-2">
            News Categories
          </h4>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs font-medium">
            {displayCategories.map((cat) => (
              <li key={cat.id}>
                <Link
                  href={cat.id === 'home' ? '/' : `/category/${cat.id}`}
                  className="hover:text-white transition-colors block py-0.5"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION 3: FOLLOW US & SOCIAL MEDIA (DYNAMIC FROM ADMIN) */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase text-white tracking-wider border-b border-gray-700/80 pb-2">
            Follow Us & Connect
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Stay connected for 24x7 breaking news alerts & exclusive updates across social channels:
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {activeSocials.map((item, idx) => (
              <a
                key={idx}
                href={item.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                title={item.title || item.platform}
                className={`p-2.5 bg-gray-900 text-gray-300 hover:text-white rounded-xl transition-all duration-200 border border-gray-800 shadow-sm hover:scale-105 ${getPlatformHoverClass(
                  item.platform
                )}`}
              >
                {getPlatformIcon(item.platform)}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM LEGAL & COPYRIGHT */}
      <div className="bg-[#051118] border-t border-gray-800/80 py-4 px-4 sm:px-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span suppressHydrationWarning>&copy; 2026 Metrotimes Media Pvt. Ltd. All rights reserved.</span>
          <div className="flex space-x-4 font-medium" suppressHydrationWarning>
            <Link href="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/contact-us" className="hover:text-gray-300 transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
