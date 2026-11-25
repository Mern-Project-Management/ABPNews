import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';
import { getNewsData } from '@/lib/getNewsData';

export const metadata: Metadata = {
  title: "Metrotimes - India's Leading Digital News Destination",
  description: "Real-time breaking news updates, politics, sports, entertainment, and world news from Metrotimes.",
  alternates: {
    canonical: "https://metrotimes.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Metrotimes - India's Leading Digital News Destination",
    description: "Real-time breaking news updates, politics, sports, entertainment, and world news from Metrotimes.",
    url: "https://metrotimes.in",
    siteName: "Metrotimes",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://metrotimes.in/logoupdate.png",
        width: 1200,
        height: 630,
        alt: "Metrotimes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Metrotimes - India's Leading Digital News Destination",
    description: "Real-time breaking news updates, politics, sports, entertainment, and world news from Metrotimes.",
    images: ["https://metrotimes.in/logoupdate.png"],
  },
};

export default function HomePage() {
  const initialNewsData = getNewsData();
  return <HomeClient initialNewsData={initialNewsData} />;
}
