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



            {/* HERO IMAGE */}
            <div className="space-y-2">
              <div className="rounded-xl overflow-hidden aspect-[16/9] bg-black shadow-sm relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110 pointer-events-none"
                  style={{ backgroundImage: `url(${article.image && !article.image.includes('abplive') ? article.image : '/metrotimes_default.png'})` }}
                />
                <img 
                  src={article.image && !article.image.includes('abplive') ? article.image : '/metrotimes_default.png'} 
                  alt={article.imageAlt || article.title} 
                  title={article.imageTitle || article.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/metrotimes_default.png';
                  }}
                  className="relative z-1 w-full h-full object-contain"
                />
              </div>
              {article.imageCaption && (
                <p className="text-xs text-gray-500 italic pl-1 border-l-2 border-red-500">
                  {article.imageCaption}
                </p>
              )}
            </div>

            {/* OPTIONAL EMBEDDED VIDEO PLAYER */}
            {article.videoUrl && (
              <div className="space-y-2 pt-2">
                <div className="rounded-xl overflow-hidden aspect-video bg-black shadow-md">
                  {article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={
                        article.videoUrl.includes('watch?v=')
                          ? article.videoUrl.replace('watch?v=', 'embed/')
                          : article.videoUrl.includes('youtu.be/')
                          ? `https://www.youtube.com/embed/${article.videoUrl.split('youtu.be/')[1]}`
                          : article.videoUrl
                      }
                      title={article.videoCaption || article.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={article.videoUrl}
                      controls
                      className="w-full h-full"
                    />
                  )}
                </div>
                {article.videoCaption && (
                  <p className="text-xs text-gray-500 italic pl-1">
                    {article.videoCaption}
                  </p>
                )}
              </div>
            )}

            {/* PARAGRAPH CONTENT */}
            <div className={`article-body font-normal ${
              fontSize === 'sm' ? '!text-[15px]' : fontSize === 'lg' ? '!text-[19px]' : '!text-[17px]'
            }`}>
              {article.content.map((paragraph, idx) => (
                <div key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>

            {/* TAGS */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase">Tags:</span>
              {(article.tags && article.tags.trim()
                ? article.tags.split(',').map((t) => t.trim()).filter(Boolean)
                : ['Metrotimes', article.category, 'Breaking News', 'Latest Updates']
              ).map((tag) => (
                <span key={tag} className="text-xs font-medium bg-gray-100 hover:bg-red-50 text-gray-700 px-2.5 py-1 rounded-md">
                  #{tag.replace(/^#/, '')}
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
