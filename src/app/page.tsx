'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import LeftSidebar from '@/components/LeftSidebar';
import LeadHero from '@/components/LeadHero';
import NewsGrid from '@/components/NewsGrid';
import ArchiveFilter from '@/components/ArchiveFilter';
import VideoSection from '@/components/VideoSection';
import LiveTVModal from '@/components/LiveTVModal';
import SearchModal from '@/components/SearchModal';
import Footer from '@/components/Footer';
import { getNewsData, fetchLiveNewsDataset, VideoItem, Article, NewsDataset } from '@/lib/getNewsData';

export default function HomePage() {
  const [newsData, setNewsData] = useState<NewsDataset>(getNewsData());
  const [isLiveTVOpen, setIsLiveTVOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('home');

  React.useEffect(() => {
    const loadDynamic = async () => {
      const data = await fetchLiveNewsDataset();
      setNewsData(data);
    };
    loadDynamic();
  }, []);

  const handlePlayVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsLiveTVOpen(true);
  };

  // Filter logic for when a specific tab is selected
  const getFilteredArticles = (): Article[] => {
    if (activeCategory === 'news' || activeCategory === 'english' || activeCategory === 'home') return newsData.allArticles;
    return newsData.allArticles.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());
  };

  const filteredArticles = getFilteredArticles();
  const activeCategoryName = newsData.categories.find(c => c.id === activeCategory)?.name || 'News';

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans transition-colors">

      {/* 1. HEADER & TICKER */}
      <Header
        categories={newsData.categories}
        ticker={newsData.ticker}
        tickerArticles={newsData.breakingNews && newsData.breakingNews.length > 0 ? newsData.breakingNews : newsData.allArticles}
        marketTicker={newsData.marketTicker}
        weatherData={newsData.weatherData}
        onOpenLiveTV={() => setIsLiveTVOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={(id) => setActiveCategory(id)}
      />

      <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
        {/* LEFT SIDEBAR (Explorer) HAS BEEN REMOVED */}

        {/* MAIN CONTENT */}
        <main className="flex-1 space-y-4 pb-12 w-full overflow-hidden">

          {activeCategory === 'home' || activeCategory === 'english' ? (
            <>
              {/* 2. LEAD HERO & TRENDING STORIES */}
              <LeadHero
                leadStory={newsData.leadStory}
                trendingNews={newsData.trendingNews}
                allArticles={newsData.allArticles}
              />

              {/* 4. INDIA NEWS SECTION */}
              <NewsGrid
                title="India News"
                categorySlug="india"
                articles={newsData.indiaNews}
                variant="grid"
              />

              {/* 5. LAST 30 DAYS NEWS ARCHIVE FILTER */}
              <ArchiveFilter
                categories={newsData.categories}
                allArticles={newsData.allArticles}
              />

              {/* 6. VIDEO HUB SECTION */}
              <VideoSection
                videos={newsData.videos}
                onPlayVideo={handlePlayVideo}
              />

              {/* 7. WORLD & BUSINESS SECTIONS */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <NewsGrid
                    title="World News"
                    categorySlug="world"
                    articles={newsData.worldNews}
                    variant="featured-left"
                  />
                  <NewsGrid
                    title="Business & Economy"
                    categorySlug="business"
                    articles={newsData.businessNews}
                    variant="featured-left"
                  />
                </div>
              </div>

              {/* 9. SPORTS & ENTERTAINMENT SECTIONS */}
              <NewsGrid
                title="Sports"
                categorySlug="sports"
                articles={newsData.sportsNews}
                variant="grid"
              />

              <NewsGrid
                title="Entertainment"
                categorySlug="entertainment"
                articles={newsData.entertainmentNews}
                variant="grid"
              />
            </>
          ) : (
            /* RENDER ONLY FILTERED CATEGORY WHEN TAB IS CLICKED */
            <div className="pt-6 min-h-[50vh]">
              <NewsGrid
                title={`${activeCategoryName} Latest News`}
                categorySlug={activeCategory}
                articles={filteredArticles}
                variant="grid"
              />
              {filteredArticles.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  No articles found for this category.
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* 10. FOOTER */}
      <Footer categories={newsData.categories} />

      {/* MODALS */}
      <LiveTVModal
        isOpen={isLiveTVOpen}
        onClose={() => {
          setIsLiveTVOpen(false);
          setSelectedVideo(null);
        }}
        selectedVideo={selectedVideo}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={newsData.allArticles}
      />

    </div>
  );
}
