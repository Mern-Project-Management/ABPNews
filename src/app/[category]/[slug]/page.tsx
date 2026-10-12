'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTVModal from '@/components/LiveTVModal';
import SearchModal from '@/components/SearchModal';
import { getNewsData, getArticleByIdOrSlug, getArticleUrl, fetchLiveArticleBySlug, Article, NewsDataset, fetchLiveNewsDataset } from '@/lib/getNewsData';
import { 
  Clock, Share2, ThumbsUp, Flame, ChevronRight, 
  Bookmark, MessageSquare, Volume2, Type
} from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = use(params);
  const [newsData, setNewsData] = useState<NewsDataset>(getNewsData());
  const [article, setArticle] = useState<Article>(getArticleByIdOrSlug(slug) || getNewsData().leadStory);

  React.useEffect(() => {
    const loadData = async () => {
      const [liveData, liveArt] = await Promise.all([
        fetchLiveNewsDataset(),
        fetchLiveArticleBySlug(slug),
      ]);
      if (liveData) setNewsData(liveData);
      if (liveArt) setArticle(liveArt);
    };
    loadData();
  }, [slug]);

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

              {/* ACTION BUTTONS */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
                  <button 
                    onClick={() => setFontSize('sm')} 
                    className={`px-2 py-1 text-xs font-bold rounded ${fontSize === 'sm' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}
                  >
                    A-
                  </button>
                  <button 
                    onClick={() => setFontSize('md')} 
                    className={`px-2 py-1 text-xs font-bold rounded ${fontSize === 'md' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}
                  >
                    A
                  </button>
                  <button 
                    onClick={() => setFontSize('lg')} 
                    className={`px-2 py-1 text-xs font-bold rounded ${fontSize === 'lg' ? 'bg-white shadow text-red-600' : 'text-gray-600'}`}
                  >
                    A+
                  </button>
                </div>

                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    hasLiked ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{likes}</span>
                </button>
              </div>
            </div>

            {/* HERO IMAGE */}
            <div className="rounded-xl overflow-hidden aspect-[16/9] bg-gray-100 shadow-sm relative">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* PARAGRAPH CONTENT */}
            <div className={`space-y-4 text-gray-800 font-normal leading-relaxed ${
              fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
            }`}>
              {article.content.map((paragraph, idx) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
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
            
            {/* RELATED STORIES */}
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
                    className="flex items-start space-x-3 group border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">
                        {rel.category}
                      </span>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </aside>

        </div>

      </main>

      {/* FOOTER */}
      <Footer categories={newsData.categories} />

      {/* MODALS */}
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
