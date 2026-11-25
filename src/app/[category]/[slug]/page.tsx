import type { Metadata } from 'next';
import ArticleDetailClient from '@/components/ArticleDetailClient';
import { getNewsData, getArticleByIdOrSlug, Article } from '@/lib/getNewsData';
import { connectDB } from '@/lib/db';
import News from '@/models/News';
import Category from '@/models/Category';

// Ensure models are registered
const _cat = Category;

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

async function fetchArticle(slug: string): Promise<Article | null> {
  try {
    await connectDB();
    const doc = await News.findOne({
      slug: slug.toLowerCase(),
      status: 'published',
    })
      .populate('categoryId', 'name slug')
      .lean();

    if (doc) {
      const catName =
        doc.categoryId && typeof doc.categoryId === 'object' && (doc.categoryId as any).name
          ? (doc.categoryId as any).name
          : 'News';

      return {
        id: (doc as any)._id.toString(),
        title: (doc as any).title,
        slug: (doc as any).slug,
        link: `/${catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${(doc as any).slug}`,
        image: (doc as any).image || '/metrotimes_default.png',
        category: catName,
        time: (doc as any).timeAgo || 'Just now',
        author: (doc as any).author || 'Metrotimes Editor',
        readTime: (doc as any).readTime || '3 min read',
        summary: (doc as any).summary,
        content: (doc as any).content || [],
        date: (doc as any).publishedDate,
        metaTitle: (doc as any).metaTitle,
        metaDescription: (doc as any).metaDescription,
        metaKeywords: (doc as any).metaKeywords,
        canonicalUrl: (doc as any).canonicalUrl
          ? (doc as any).canonicalUrl.replace(/https?:\/\/(www\.)?metrotimes\.com/gi, 'https://metrotimes.in')
          : undefined,
        schemaScript: (doc as any).schemaScript,
      };
    }
  } catch (e) {
    // fallback to static
  }
  return getArticleByIdOrSlug(slug) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await fetchArticle(slug);

  const title =
    article?.metaTitle ||
    (article?.title
      ? `${article.title} | Metrotimes`
      : "Metrotimes - India's Leading Digital News Destination");

  const description =
    article?.metaDescription ||
    article?.summary ||
    'Real-time breaking news updates, politics, sports, entertainment, and world news from Metrotimes.';

  const rawCanonical = article?.canonicalUrl || `https://metrotimes.in/${category.toLowerCase()}/${slug.toLowerCase()}`;
  const canonicalUrl = rawCanonical.replace(/https?:\/\/(www\.)?metrotimes\.com/gi, 'https://metrotimes.in');

  const imageUrl = article?.image || 'https://metrotimes.in/logoupdate.png';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
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
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { category, slug } = await params;
  const initialNewsData = getNewsData();
  const article = (await fetchArticle(slug)) || initialNewsData.leadStory;

  const rawCanonical = article?.canonicalUrl || `https://metrotimes.in/${category.toLowerCase()}/${slug.toLowerCase()}`;
  const canonicalUrl = rawCanonical.replace(/https?:\/\/(www\.)?metrotimes\.com/gi, 'https://metrotimes.in');

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.summary,
    image: [article.image || 'https://metrotimes.in/logoupdate.png'],
    datePublished: article.date || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: article.author || 'Metrotimes Editor',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Metrotimes',
      logo: {
        '@type': 'ImageObject',
        url: 'https://metrotimes.in/logoupdate.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  };

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: article.schemaScript
            ? article.schemaScript.replace(/<\/?script[^>]*>/gi, '')
            : JSON.stringify(articleSchema),
        }}
      />
      <ArticleDetailClient
        category={category}
        slug={slug}
        initialArticle={article}
        initialNewsData={initialNewsData}
      />
    </>
  );
}
