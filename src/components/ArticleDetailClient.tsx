'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTVModal from '@/components/LiveTVModal';
import SearchModal from '@/components/SearchModal';
import { getArticleUrl, fetchLiveArticleBySlug, Article, NewsDataset, fetchLiveNewsDataset } from '@/lib/getNewsData';
import { 
  Clock, Share2, ThumbsUp, Flame, ChevronRight, 
  Bookmark, MessageSquare, Volume2, Type
} from 'lucide-react';

interface ArticleDetailClientProps {
  category: string;
  slug: string;
  initialArticle: Article;
  initialNewsData: NewsDataset;
}

export default function ArticleDetailClient({
  category,
  slug,
  initialArticle,
  initialNewsData,
}: ArticleDetailClientProps) {
  const [newsData, setNewsData] = useState<NewsDataset>(initialNewsData);
  const [article, setArticle] = useState<Article>(initialArticle);

  useEffect(() => {
    const loadData = async () => {
      const [liveData, liveArt] = await Promise.all([
        fetchLiveNewsDataset(),
        fetchLiveArticleBySlug(slug),
      ]);
      if (liveData) setNewsData(liveData);
      if (liveArt) setArticle(liveArt);
    };
    loadData();

    // Ensure canonical tag and meta tags are present in DOM for client-side SEO inspectors
    const canonicalHref = article?.canonicalUrl || `https://metrotimes.in/${category.toLowerCase()}/${slug.toLowerCase()}`;
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonicalHref;
  }, [slug, category, article?.canonicalUrl]);

  const [isLiveTVOpen, setIsLiveTVOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [likes, setLikes] = useState(42);
  const [hasLiked, setHasLiked] = useState(false);

  const relatedArticles = newsData.allArticles
    .filter(a => a.id !== article.id && a.slug !== article.slug)
    .slice(0, 5);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans transition-colors">
      {/* 1. HEADER */}
      <Header 
        categories={newsData.categories}
        ticker={newsData.ticker}
        tickerArticles={newsData.allArticles}
        marketTicker={newsData.marketTicker}
        weatherData={newsData.weatherData}
        onOpenLiveTV={() => setIsLiveTVOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        {/* BREADCRUMB */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 pb-3 border-b border-gray-200">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/category/${article.category.toLowerCase()}`} className="hover:text-red-600 uppercase">
            {article.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 truncate max-w-md">{article.title}</span>
        </div>

        {/* ARTICLE & SIDEBAR LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ARTICLE CONTENT (8 Cols) */}
          <article className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            {/* CATEGORY & TITLE */}
            <div className="space-y-3">
              <span className="bg-red-600 text-white font-extrabold text-[11px] px-3 py-1 rounded-md uppercase tracking-wider inline-block">
                {article.category}
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {article.title}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed italic border-l-4 border-red-600 pl-4 py-1 bg-red-50/50 rounded-r-lg">
                {article.summary}
              </p>
            </div>

            {/* HERO IMAGE */}
            <div className="rounded-xl overflow-hidden aspect-[16/9] bg-black shadow-sm relative">
              <div 
                className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${article.image && !article.image.includes('abplive') ? article.image : '/metrotimes_default.png'})` }}
              />
              <img 
                src={article.image && !article.image.includes('abplive') ? article.image : '/metrotimes_default.png'} 
                alt={article.title} 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/metrotimes_default.png';
                }}
                className="relative z-1 w-full h-full object-contain"
              />
            </div>

            {/* PARAGRAPH CONTENT */}
            <div className={`article-content space-y-4 text-gray-800 font-normal leading-relaxed ${
              fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
            }`}>
              {article.content.map((paragraph, idx) => (
                <div key={idx} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>

            {/* TAGS */}
            <div className="pt-4 border-t border-gray-100 flex items-center space-x-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Tags:</span>
              {['Metrotimes', article.category, 'Breaking News', 'Latest Updates'].map((tag) => (
                <span key={tag} className="text-xs font-medium bg-gray-100 hover:bg-red-50 text-gray-700 px-2.5 py-1 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          </article>

          {/* SIDEBAR (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                  Related Stories
                </h3>
                <Flame className="w-4 h-4 text-red-600" />
              </div>

              <div className="space-y-3">
                {relatedArticles.map((rel) => (
                  <Link 
                    key={rel.id} 
                    href={getArticleUrl(rel)}
                    className="flex space-x-3 group cursor-pointer"
                  >
                    <div className="w-20 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 relative">
                      <img 
                        src={rel.image || '/metrotimes_default.png'} 
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-red-600 line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-[10px] text-gray-500">
                        <Clock className="w-3 h-3 text-red-500" />
                        <span>{rel.time}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

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
