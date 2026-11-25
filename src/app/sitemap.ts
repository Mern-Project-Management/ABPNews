import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import News from '@/models/News';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://metrotimes.in';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    await connectDB();
    const categories = await Category.find({}).lean();
    const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat: any) => ({
      url: `${baseUrl}/category/${(cat.slug || cat.name || '').toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    }));

    const articles = await News.find({ status: 'published' })
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const articleRoutes: MetadataRoute.Sitemap = articles.map((art: any) => {
      const catSlug = (art.categoryId?.slug || art.categoryId?.name || 'news').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        url: `${baseUrl}/${catSlug}/${art.slug}`,
        lastModified: art.updatedAt ? new Date(art.updatedAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      };
    });

    return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
  } catch (e) {
    return staticRoutes;
  }
}
