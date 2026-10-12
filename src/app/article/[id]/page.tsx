'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { 
 Clock, Share2, Copy, Check, 
 Bookmark, MessageSquare, ChevronRight, Eye, ThumbsUp, Flame, ArrowLeft, Send
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LiveTVModal from '@/components/LiveTVModal';
import SearchModal from '@/components/SearchModal';
import { getNewsData, getArticleByIdOrSlug, getArticleUrl, fetchLiveArticleBySlug, Article, NewsDataset, fetchLiveNewsDataset } from '@/lib/getNewsData';

interface ArticlePageProps {
 params: Promise<{ id: string }>;
}

export default function ArticleDetailPage({ params }: ArticlePageProps) {
 const { id } = use(params);
 const [newsData, setNewsData] = useState<NewsDataset>(getNewsData());
 const [article, setArticle] = useState<Article>(getArticleByIdOrSlug(id) || getNewsData().leadStory);

 React.useEffect(() => {
   const loadData = async () => {
     const [liveData, liveArt] = await Promise.all([
       fetchLiveNewsDataset(),
       fetchLiveArticleBySlug(id),
     ]);
     if (liveData) setNewsData(liveData);
     if (liveArt) setArticle(liveArt);
   };
   loadData();
 }, [id]);

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
 <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 pb-4 border-b border-gray-200 ">
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
 <span className="font-extrabold text-gray-900 ">{article.author}</span>
 <span className="text-gray-500 flex items-center space-x-1 pt-0.5">
 <Clock className="w-3 h-3 text-red-500" />
 <span>Updated {article.time} • {article.readTime}</span>
 </span>
 </div>
 </div>

 {/* FONT CONTROLS & SHARE */}
 <div className="flex items-center space-x-3">
 <div className="flex items-center space-x-1 bg-gray-100 px-2.5 py-1 rounded-lg text-xs font-bold">
 <span className="text-gray-500 pr-1">Text:</span>
 <button 
 onClick={() => setFontSize('sm')} 
 className={`px-1.5 py-0.5 rounded ${fontSize === 'sm' ? 'bg-red-600 text-white' : 'text-gray-600 '}`}
 >
 A-
 </button>
 <button 
 onClick={() => setFontSize('base')} 
 className={`px-1.5 py-0.5 rounded ${fontSize === 'base' ? 'bg-red-600 text-white' : 'text-gray-600 '}`}
 >
 A
 </button>
 <button 
 onClick={() => setFontSize('lg')} 
 className={`px-1.5 py-0.5 rounded ${fontSize === 'lg' ? 'bg-red-600 text-white' : 'text-gray-600 '}`}
 >
 A+
 </button>
 </div>
 </div>
 </div>

 {/* FEATURED IMAGE */}
 <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-900 shadow-md">
 <img 
 src={article.image} 
 alt={article.title}
 className="w-full h-full object-cover"
 />
 <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
 Image Source: Metrotimes Media Desk
 </span>
 </div>

 {/* SOCIAL SHARE FLOATING BAR */}
 <div className="flex items-center justify-between bg-gray-50 /60 p-3 rounded-xl border border-gray-100 ">
 <span className="text-xs font-extrabold uppercase text-gray-500 tracking-wider">Share Story</span>
 <div className="flex items-center space-x-2">
 <button onClick={handleCopyLink} className="p-2 bg-white hover:bg-red-50 text-gray-700 rounded-lg transition-colors border border-gray-200 text-xs font-semibold flex items-center space-x-1">
 {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
 <span>{copied ? 'Copied!' : 'Copy'}</span>
 </button>
 <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors" title="Share on X (Twitter)">
 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
 </a>
 <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.link)}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Share on Facebook">
 <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
 </a>
 <button onClick={handleLike} className={`p-2 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors ${liked ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-200 '}`}>
 <ThumbsUp className="w-4 h-4" />
 <span>{likes}</span>
 </button>
 </div>
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
 href={`/article/${rel.id}`}
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
