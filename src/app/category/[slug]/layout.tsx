import type { Metadata } from 'next';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const formattedCategory = (slug || 'news')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${formattedCategory} News - Metrotimes`,
    description: `Latest news updates, in-depth reports, and breaking stories from the ${formattedCategory} section on Metrotimes.`,
    alternates: {
      canonical: `https://metrotimes.in/category/${slug}`,
    },
  };
}

export default function CategoryLayout({
  children,
}: CategoryLayoutProps) {
  return <>{children}</>;
}

