import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: [
      'https://metrotimes.in/sitemap_index.xml',
      'https://metrotimes.in/sitemap.xml',
    ],
  };
}
