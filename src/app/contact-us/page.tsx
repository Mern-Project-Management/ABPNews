import type { Metadata } from 'next';
import ContactUsClient from '@/components/ContactUsClient';
import { getNewsData } from '@/lib/getNewsData';

export const metadata: Metadata = {
  title: 'Contact Us | Metrotimes - Editorial & Press Office',
  description: 'Get in touch with Metrotimes newsroom, editorial team, press office, and advertising department.',
  alternates: {
    canonical: 'https://metrotimes.in/contact-us',
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
    title: 'Contact Us | Metrotimes',
    description: 'Get in touch with Metrotimes newsroom, editorial team, and advertising department.',
    url: 'https://metrotimes.in/contact-us',
    type: 'website',
  },
};

export default function Page() {
  const newsData = getNewsData();
  return (
    <>
      <link rel="canonical" href="https://metrotimes.in/contact-us" />
      <ContactUsClient newsData={newsData} />
    </>
  );
}
