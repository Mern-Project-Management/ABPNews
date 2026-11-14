import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Metrotimes',
  description: 'Privacy Policy and Terms of Use for Metrotimes Media Pvt. Ltd.',
  alternates: {
    canonical: 'https://metrotimes.in/privacy-policy',
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

