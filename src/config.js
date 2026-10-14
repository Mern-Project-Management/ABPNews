/**
 * Metrotimes Website - Central Application Configuration
 * Imports environment variables from .env.local with safe defaults.
 */
export const siteConfig = {
  name: 'Metrotimes',
  tagline: "India's Leading Digital News Destination",
  description: 'Real-time breaking news updates, politics, sports, entertainment, and world news from Metrotimes.',
  url: process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:4031',
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:4032',
  defaultLanguage: 'English',
  defaultLogo: '/logoupdate.png',
  defaultFavicon: '/favicon.png',
  pagination: {
    articlesPerPage: 12,
    breakingTickerLimit: 10,
  },
  social: {
    twitter: 'https://twitter.com/metrotimes',
    facebook: 'https://facebook.com/metrotimes',
    youtube: 'https://youtube.com/@metrotimes',
    instagram: 'https://instagram.com/metrotimes',
  },
};

export default siteConfig;
