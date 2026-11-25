import type { Metadata } from 'next';
import { fetchLiveArticleBySlug, getArticleByIdOrSlug, getArticleUrl } from '@/lib/getNewsData';

interface LegacyArticleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let article = getArticleByIdOrSlug(id);

  try {
    const liveArt = await fetchLiveArticleBySlug(id);
    if (liveArt) article = liveArt;
  } catch (err) {
    // fallback
  }

  const title = article?.metaTitle || article?.title || 'News Article - Metrotimes';
  const description = article?.metaDescription || article?.summary || "Read the latest news report on Metrotimes.";
  
  // Point to preferred clean canonical URL if article exists, otherwise standard /article/id
  const canonicalUrl = article?.canonicalUrl || (article ? `https://metrotimes.in${getArticleUrl(article)}` : `https://metrotimes.in/article/${id}`);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function LegacyArticleLayout({
  children,
}: LegacyArticleLayoutProps) {
  return <>{children}</>;
}

