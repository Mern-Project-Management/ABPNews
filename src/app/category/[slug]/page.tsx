import type { Metadata } from 'next';
import CategoryClient from '@/components/CategoryClient';
import { getNewsData } from '@/lib/getNewsData';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchCategoryDoc(slug: string) {
  try {
    await connectDB();
    const doc = await Category.findOne({ slug: slug.toLowerCase() }).lean();
    return doc as any;
  } catch (e) {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryDoc = await fetchCategoryDoc(slug);

  const formattedName = (categoryDoc?.name || slug || 'News')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase());

  const title = categoryDoc?.metaTitle || `${formattedName} News - Latest Updates & Breaking Headlines | Metrotimes`;
  const description = categoryDoc?.metaDescription || categoryDoc?.description || `Read the latest ${formattedName} news, breaking updates, live reports and top stories on Metrotimes.`;
  const keywords = categoryDoc?.metaKeywords || `${formattedName} News, Latest ${formattedName} Headlines, Metrotimes`;

  const rawCanonical = categoryDoc?.canonicalUrl || `https://metrotimes.in/category/${slug.toLowerCase()}`;
  const canonicalUrl = rawCanonical.replace(/https?:\/\/(www\.)?metrotimes\.com/gi, 'https://metrotimes.in');

  return {
    title,
    description,
    keywords,
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
      type: 'website',
      images: [
        {
          url: 'https://metrotimes.in/logoupdate.png',
          width: 1200,
          height: 630,
          alt: `${formattedName} News - Metrotimes`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://metrotimes.in/logoupdate.png'],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const initialNewsData = getNewsData();
  const categoryDoc = await fetchCategoryDoc(slug);

  const formattedName = (categoryDoc?.name || slug || 'News')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l: string) => l.toUpperCase());

  const title = categoryDoc?.metaTitle || `${formattedName} News - Latest Updates & Breaking Headlines | Metrotimes`;
  const description = categoryDoc?.metaDescription || categoryDoc?.description || `Read the latest ${formattedName} news, breaking updates, live reports and top stories on Metrotimes.`;

  const rawCanonical = categoryDoc?.canonicalUrl || `https://metrotimes.in/category/${slug.toLowerCase()}`;
  const canonicalUrl = rawCanonical.replace(/https?:\/\/(www\.)?metrotimes\.com/gi, 'https://metrotimes.in');

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: description,
    url: canonicalUrl,
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Metrotimes',
      url: 'https://metrotimes.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://metrotimes.in/logoupdate.png',
      },
    },
  };

  const schemaContent = categoryDoc?.schemaScript
    ? categoryDoc.schemaScript.replace(/<\/?script[^>]*>/gi, '').trim()
    : JSON.stringify(defaultSchema);

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      {schemaContent && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaContent }}
        />
      )}
      <CategoryClient
        slug={slug}
        initialNewsData={initialNewsData}
      />
    </>
  );
}
