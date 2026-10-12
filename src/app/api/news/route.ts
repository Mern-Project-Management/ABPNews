import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import News from '@/models/News';
import Category from '@/models/Category';
import Video from '@/models/Video';
import newsJson from '@/data/newsData.json';

// Ensure Category and Video models are registered
const _cat = Category;
const _vid = Video;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const id = searchParams.get('id');

    // If querying single article by slug or id
    if (slug || id) {
      const query: any = { status: 'published' };
      if (slug) query.slug = slug;
      if (id) query._id = id;

      const singleDoc = await News.findOne(query).populate('categoryId', 'name slug');
      if (singleDoc) {
        const catName =
          typeof singleDoc.categoryId === 'object' && singleDoc.categoryId !== null
            ? (singleDoc.categoryId as any).name
            : 'News';

        let image = singleDoc.image || '';
        if (image.startsWith('/uploads/')) {
          image = `http://localhost:3001${image}`;
        }

        return NextResponse.json(
          {
            success: true,
            article: {
              id: singleDoc._id.toString(),
              title: singleDoc.title,
              slug: singleDoc.slug,
              link: `/${catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${singleDoc.slug}`,
              image,
              category: catName,
              time: singleDoc.timeAgo || 'Just now',
              author: singleDoc.author || 'Metrotimes Editor',
              readTime: singleDoc.readTime || '3 min read',
              summary: singleDoc.summary,
              content: singleDoc.content || [],
              date: singleDoc.publishedDate,
              metaTitle: singleDoc.metaTitle,
              metaDescription: singleDoc.metaDescription,
              metaKeywords: singleDoc.metaKeywords,
              canonicalUrl: singleDoc.canonicalUrl,
              schemaScript: singleDoc.schemaScript,
            },
          },
          {
            headers: {
              'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
          }
        );
      }
    }

    // Query published articles from MongoDB
    const query: any = { status: 'published' };
    const dbArticles = await News.find(query)
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    const formattedArticles = dbArticles.map((doc: any) => {
      const catName =
        doc.categoryId && typeof doc.categoryId === 'object' && doc.categoryId.name
          ? doc.categoryId.name
          : 'News';

      let image = doc.image || '';
      if (image.startsWith('/uploads/')) {
        image = `http://localhost:3001${image}`;
      }

      return {
        id: doc._id.toString(),
        title: doc.title,
        slug: doc.slug,
        link: `/${catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${doc.slug}`,
        image,
        category: catName,
        time: doc.timeAgo || 'Just now',
        author: doc.author || 'Metrotimes Editor',
        readTime: doc.readTime || '3 min read',
        summary: doc.summary,
        content: doc.content || [],
        date: doc.publishedDate,
        isFeatured: doc.isFeatured,
        isTrending: doc.isTrending,
        isBreaking: doc.isBreaking || false,
      };
    });

    // Breaking news articles (prioritize those marked isBreaking: true)
    const breakingArticles = formattedArticles.filter((a: any) => a.isBreaking);
    const finalBreaking = breakingArticles.length > 0 ? breakingArticles : formattedArticles.slice(0, 10);

    // Merge with JSON fallback articles if needed, giving top priority to dynamic MongoDB articles
    const allArticles = formattedArticles.length > 0 ? formattedArticles : (newsJson.allArticles as any);
    const leadStory =
      formattedArticles.find((a: any) => a.isFeatured) ||
      formattedArticles[0] ||
      (newsJson.leadStory as any);

    const trendingNews = formattedArticles.filter((a: any) => a.isTrending);
    const finalTrending =
      trendingNews.length >= 3
        ? trendingNews
        : formattedArticles.slice(0, 10);

    // Query active parent categories from MongoDB (only where isActive is true)
    const dbCategories = await Category.find({ parentId: null, isActive: true })
      .sort({ createdAt: 1 })
      .lean();

    const formattedCategories = dbCategories.length > 0
      ? dbCategories.map((c: any) => ({
          id: c.slug || c._id.toString(),
          name: c.name,
          slug: c.slug === 'news' || c.slug === 'home' ? '/' : `/category/${c.slug}`,
        }))
      : [
          { id: 'news', name: 'News', slug: '/' },
          { id: 'business', name: 'Business', slug: '/category/business' },
          { id: 'entertainment', name: 'Entertainment', slug: '/category/entertainment' },
          { id: 'sports', name: 'Sports', slug: '/category/sports' },
          { id: 'technology', name: 'Technology', slug: '/category/technology' },
        ];

    // Partition articles into category-specific buckets for the homepage
    const newsArticles = allArticles.filter((a: any) => a.category?.toLowerCase() === 'news');
    const bizArticles = allArticles.filter((a: any) => a.category?.toLowerCase() === 'business');
    const entArticles = allArticles.filter((a: any) => a.category?.toLowerCase() === 'entertainment');
    const sportsArticles = allArticles.filter((a: any) => a.category?.toLowerCase() === 'sports');
    const techArticles = allArticles.filter((a: any) => a.category?.toLowerCase() === 'technology');

    // Query active videos from MongoDB
    const dbVideos = await Video.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const formattedVideos = dbVideos.length > 0
      ? dbVideos.map((v: any) => {
          let videoUrl = v.videoUrl || '';
          if (videoUrl.startsWith('/uploads/')) {
            videoUrl = `http://localhost:3001${videoUrl}`;
          }

          let thumbnail = v.thumbnail || '';
          if (thumbnail.startsWith('/uploads/')) {
            thumbnail = `http://localhost:3001${thumbnail}`;
          } else if (!thumbnail && v.youtubeId) {
            thumbnail = `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;
          }

          return {
            id: v._id.toString(),
            title: v.title,
            sourceType: v.sourceType || 'youtube',
            videoUrl,
            youtubeUrl: v.youtubeUrl || '',
            youtubeId: v.youtubeId || '',
            thumbnail: thumbnail || 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&auto=format&fit=crop&q=60',
            category: v.category || 'News',
            duration: v.duration || '03:45',
            views: v.views || '1.2K views',
          };
        })
      : (newsJson.videos as any);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newsJson,
          categories: formattedCategories,
          leadStory,
          trendingNews: finalTrending.length > 0 ? finalTrending : newsJson.trendingNews,
          allArticles,
          breakingNews: finalBreaking,
          indiaNews: newsArticles.length > 0 ? newsArticles : formattedArticles.slice(0, 8),
          businessNews: bizArticles.length > 0 ? bizArticles : formattedArticles.slice(0, 8),
          entertainmentNews: entArticles.length > 0 ? entArticles : formattedArticles.slice(0, 8),
          sportsNews: sportsArticles.length > 0 ? sportsArticles : formattedArticles.slice(0, 8),
          techNews: techArticles.length > 0 ? techArticles : formattedArticles.slice(0, 8),
          videos: formattedVideos,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (error: any) {
    console.error('Website news API error:', error);
    // Fallback to static JSON on DB error
    return NextResponse.json({
      success: true,
      data: newsJson,
    });
  }
}
