import type { Metadata } from 'next';
import CategoryClient from '@/components/CategoryClient';
import { getNewsData } from '@/lib/getNewsData';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = (slug || 'news').toUpperCase();
  const canonicalUrl = `https://metrotimes.in/category/${slug.toLowerCase()}`;

  return {
    title: `${categoryName} News - Latest Updates & Breaking Headlines | Metrotimes`,
    description: `Read the latest ${categoryName} news, breaking updates, live reports and top stories on Metrotimes.`,
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
      title: `${categoryName} News | Metrotimes`,
      description: `Latest breaking ${categoryName} news headlines on Metrotimes.`,
      url: canonicalUrl,
      type: 'website',
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const initialNewsData = getNewsData();

  return (
    <CategoryClient
      slug={slug}
      initialNewsData={initialNewsData}
    />
  );
}
