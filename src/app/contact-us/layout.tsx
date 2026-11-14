import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Metrotimes',
  description: 'Get in touch with the Metrotimes editorial team, news desk, and corporate office.',
  alternates: {
    canonical: 'https://metrotimes.in/contact-us',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

