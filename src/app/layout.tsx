import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://metrotimes.in"),
  title: "Metrotimes - India's Leading Digital News Destination",
  description: "Real-time breaking news updates, politics, sports, entertainment, and world news from Metrotimes.",
  alternates: {
    canonical: "https://metrotimes.in",
  },
  verification: {
    google: "wne_ifB8p9XbkS2DS3xUyu-esQuhgd7RKNOk94B-wrU",
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
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon update.png", type: "image/png" }
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "Metrotimes",
    "url": "https://metrotimes.in",
    "logo": {
      "@type": "ImageObject",
      "url": "https://metrotimes.in/logoupdate.png"
    },
    "sameAs": [
      "https://twitter.com/metrotimes",
      "https://facebook.com/metrotimes",
      "https://instagram.com/metrotimes"
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="google-site-verification" content="wne_ifB8p9XbkS2DS3xUyu-esQuhgd7RKNOk94B-wrU" />
        <link rel="canonical" href="https://metrotimes.in" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
