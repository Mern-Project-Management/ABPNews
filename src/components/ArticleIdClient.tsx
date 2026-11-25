'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Clock, Copy, Check, 
  ChevronRight, ThumbsUp
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTVModal from '@/components/LiveTVModal';
import SearchModal from '@/components/SearchModal';
import { getArticleUrl, fetchLiveArticleBySlug, Article, NewsDataset, fetchLiveNewsDataset } from '@/lib/getNewsData';

interface ArticleIdClientProps {
  id: string;
  initialArticle: Article;
  initialNewsData: NewsDataset;
}

export default function ArticleIdClient({
  id,
  initialArticle,
  initialNewsData,
}: ArticleIdClientProps) {
  const [newsData, setNewsData] = useState<NewsDataset>(initialNewsData);
  const [article, setArticle] = useState<Article>(initialArticle);

  useEffect(() => {
    const loadData = async () => {
      const [liveData, liveArt] = await Promise.all([
        fetchLiveNewsDataset(),
        fetchLiveArticleBySlug(id),
      ]);
      if (liveData) setNewsData(liveData);
      if (liveArt) setArticle(liveArt);
    };
    loadData();

    const catSlug = article?.category ? article.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'news';
    const rawCanonical = article?.canonicalUrl || (article?.slug ? `https://metrotimes.in/${catSlug}/${article.slug}` : `https://metrotimes.in/article/${id}`);
    const canonicalHref = rawCanonical.replace(/https?:\/\/(www\.)?metrotimes\.com/gi, 'https://metrotimes.in');
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonicalHref;
  }, [id, article?.canonicalUrl, article?.slug, article?.category]);

  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [likes, setLikes] = useState(48);
  const [liked, setLiked] = useState(false);
  const [isLiveTVOpen, setIsLiveTVOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
    } else {
      setLikes(likes - 1);
      setLiked(false);
    }
  };

  const relatedArticles = newsData.allArticles
    .filter(a => a.id !== article.id)
    .slice(0, 4);

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

      {/* ARTICLE WRAPPER */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {/* BREADCRUMB */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 pb-4 border-b border-gray-200">
          <Link href="/" className="hover:text-red-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/category/${article.category.toLowerCase()}`} className="hover:text-red-600 uppercase">
            {article.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 truncate max-w-xs">{article.title}</span>
        </div>

        {/* CONTENT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* MAIN ARTICLE BODY (8 Cols) */}
          <article className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            {/* CATEGORY & TITLE */}
            <div className="space-y-3">
              <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-md uppercase tracking-wider">
                {article.category}
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {article.title}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed italic border-l-4 border-red-600 pl-4 py-1 bg-red-50/50 rounded-r-lg">
                {article.summary}
              </p>
            </div>

            {/* AUTHOR & TIMESTAMP BAR */}
            <div className="flex flex-wrap items-center justify-between border-y border-gray-100 py-3 gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  Metrotimes
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-extrabold text-gray-900">{article.author}</span>
                  <span className="text-gray-500 flex items-center space-x-1 pt-0.5">
                    <Clock className="w-3 h-3 text-red-500" />
                    <span>Updated {article.time} • {article.readTime}</span>
                  </span>
                </div>
              </div>

              {/* FONT CONTROLS */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-bold">
                  <span className="text-gray-500 pr-1">Text:</span>
                  <button 
                    onClick={() => setFontSize('sm')} 
                    className={`px-1.5 py-0.5 rounded ${fontSize === 'sm' ? 'bg-red-600 text-white' : 'text-gray-600'}`}
                  >
                    A-
                  </button>
                  <button 
                    onClick={() => setFontSize('base')} 
                    className={`px-1.5 py-0.5 rounded ${fontSize === 'base' ? 'bg-red-600 text-white' : 'text-gray-600'}`}
                  >
                    A
                  </button>
                  <button 
                    onClick={() => setFontSize('lg')} 
                    className={`px-1.5 py-0.5 rounded ${fontSize === 'lg' ? 'bg-red-600 text-white' : 'text-gray-600'}`}
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            {/* FEATURED IMAGE */}
            <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black shadow-md">
              <div 
                className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110 pointer-events-none"
                style={{ backgroundImage: `url(${article.image})` }}
              />
              <img 
                src={article.image} 
                alt={article.title}
                className="relative z-1 w-full h-full object-contain"
              />
              <span className="absolute bottom-2 left-2 z-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                Image Source: Metrotimes Media Desk
              </span>
            </div>

            {/* SOCIAL SHARE FLOATING BAR */}
            <div className="flex items-center justify-between bg-gray-50/60 p-3 rounded-xl border border-gray-100">
              <span className="text-xs font-extrabold uppercase text-gray-500 tracking-wider">Share Story</span>
              <div className="flex items-center space-x-2">
                <button onClick={handleCopyLink} className="p-2 bg-white hover:bg-red-50 text-gray-700 rounded-lg transition-colors border border-gray-200 text-xs font-semibold flex items-center space-x-1">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button onClick={handleLike} className={`p-2 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors ${liked ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}>
                  <ThumbsUp className="w-4 h-4" />
                  <span>{likes}</span>
                </button>
              </div>
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
                      <span className="text-[10px] text-gray-500">{rel.time}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer categories={newsData.categories} />
      <LiveTVModal isOpen={isLiveTVOpen} onClose={() => setIsLiveTVOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} articles={newsData.allArticles} />
    </div>
  );
}
