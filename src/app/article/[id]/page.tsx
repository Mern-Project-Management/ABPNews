import type { Metadata } from 'next';
import ArticleIdClient from '@/components/ArticleIdClient';
import { getNewsData, getArticleByIdOrSlug, Article } from '@/lib/getNewsData';
import { connectDB } from '@/lib/db';
import News from '@/models/News';
import Category from '@/models/Category';

const _cat = Category;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchArticleById(id: string): Promise<Article | null> {
  try {
    await connectDB();
    const doc = await News.findById(id).populate('categoryId', 'name slug').lean();
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
        canonicalUrl: (doc as any).canonicalUrl
          ? (doc as any).canonicalUrl.replace(/https?:\/\/(www\.)?metrotimes\.com/gi, 'https://metrotimes.in')
          : undefined,
        schemaScript: (doc as any).schemaScript,
      };
    }
  } catch (e) {
    // fallback
  }
  return getArticleByIdOrSlug(id) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await fetchArticleById(id);

  const title =
    article?.metaTitle ||
    (article?.title
      ? `${article.title} | Metrotimes`
      : "Metrotimes - India's Leading Digital News Destination");

  const description =
    article?.metaDescription ||
    article?.summary ||
    'Real-time breaking news updates from Metrotimes.';

  const catSlug = article?.category
    ? article.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'news';

  const rawCanonical =
    article?.canonicalUrl ||
    (article?.slug
      ? `https://metrotimes.in/${catSlug}/${article.slug}`
      : `https://metrotimes.in/article/${id}`);
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
      images: [{ url: imageUrl }],
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
  const { id } = await params;
  const initialNewsData = getNewsData();
  const article = (await fetchArticleById(id)) || initialNewsData.leadStory;

  const catSlug = article?.category
    ? article.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : 'news';

  const rawCanonical =
    article?.canonicalUrl ||
    (article?.slug
      ? `https://metrotimes.in/${catSlug}/${article.slug}`
      : `https://metrotimes.in/article/${id}`);
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
      <ArticleIdClient
        id={id}
        initialArticle={article}
        initialNewsData={initialNewsData}
      />
    </>
  );
}
