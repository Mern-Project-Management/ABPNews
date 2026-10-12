'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTVModal from '@/components/LiveTVModal';
import SearchModal from '@/components/SearchModal';
import { getNewsData, getArticlesByCategory, getArticleUrl, fetchLiveNewsDataset, NewsDataset } from '@/lib/getNewsData';
import { Clock, ChevronRight, Layers } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const [newsData, setNewsData] = useState<NewsDataset>(getNewsData());

  React.useEffect(() => {
    const loadData = async () => {
      const liveData = await fetchLiveNewsDataset();
      if (liveData) setNewsData(liveData);
    };
    loadData();
  }, []);

  const [isLiveTVOpen, setIsLiveTVOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const categoryName = (slug || 'india').toUpperCase();
  const articles = newsData.allArticles.filter((a) => {
    const cUpper = (slug || 'india').toUpperCase();
    const aCat = (a.category || '').toUpperCase();
    return aCat === cUpper || aCat.includes(cUpper) || cUpper.includes(aCat);
  });
  const displayArticles = articles.length > 0 ? articles : newsData.allArticles.slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">

      {/* HEADER */}
      <Header
        categories={newsData.categories}
        ticker={newsData.ticker}
        marketTicker={newsData.marketTicker}
        weatherData={newsData.weatherData}
        onOpenLiveTV={() => setIsLiveTVOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">

        {/* BREADCRUMB */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 pb-3 border-b border-gray-200 ">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 uppercase font-bold">{categoryName} News</span>
        </div>

        {/* TITLE BANNER */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block mb-1">
              Category Coverage
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
              {categoryName} News
            </h1>
            <p className="text-xs sm:text-sm text-red-100 pt-1">
              Latest breaking headlines, reports, and coverage on {categoryName} from Metrotimes.
            </p>
          </div>
          <Layers className="w-12 h-12 text-red-400 opacity-60 hidden sm:block" />
        </div>

        {/* ARTICLES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 ">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <span className="text-[11px] text-gray-500 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-red-500" />
                    <span>{item.time}</span>
                  </span>

                  <Link href={getArticleUrl(item)}>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-600 ">{item.author}</span>
                  <Link
                    href={getArticleUrl(item)}
                    className="text-red-600 font-bold hover:underline"
                  >
                    Read &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>

      {/* FOOTER & MODALS */}
      <Footer categories={newsData.categories} />

      <LiveTVModal
        isOpen={isLiveTVOpen}
        onClose={() => setIsLiveTVOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={newsData.allArticles}
      />

    </div>
  );
}
