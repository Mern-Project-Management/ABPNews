import type { Metadata } from 'next';
import { fetchLiveArticleBySlug, getArticleByIdOrSlug } from '@/lib/getNewsData';

interface ArticleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  let article = getArticleByIdOrSlug(slug);

  try {
    const liveArt = await fetchLiveArticleBySlug(slug);
    if (liveArt) article = liveArt;
  } catch (err) {
    // fallback to static
  }

  const title = article?.metaTitle || article?.title || 'News Article - Metrotimes';
  const description = article?.metaDescription || article?.summary || "Read the latest news report on Metrotimes.";
  const rawCanonical = article?.canonicalUrl || `https://metrotimes.in/${category.toLowerCase()}/${slug.toLowerCase()}`;
  const canonicalUrl = rawCanonical.replace(/https?:\/\/(www\.)?metrotimes\.com/gi, 'https://metrotimes.in');

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function ArticleLayout({
  children,
}: ArticleLayoutProps) {
  return <>{children}</>;
}

