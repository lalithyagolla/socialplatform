import React, { useState, useEffect } from 'react';
import { Filter, Twitter, Globe } from 'lucide-react';
import FeedCard from '../components/feed/FeedCard';
import FeedSkeleton from '../components/feed/FeedSkeleton';
import { feedService } from '../services/api';
import { usePoints } from '../contexts/PointsContext';

interface FeedItem {
  id: string;
  title: string;
  content: string;
  source: 'twitter' | 'reddit' | 'linkedin';
  publishedAt: string;
  url: string;
  authorName?: string;
  authorImage?: string;
  imageUrl?: string;
  saved?: boolean;
}

const FeedPage: React.FC = () => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'all' | 'twitter' | 'reddit' | 'linkedin'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { earnPoints } = usePoints();

  useEffect(() => {
    fetchFeed();
  }, [source, page]);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await feedService.getFeeds(source, page);
      
      if (page === 1) {
        setFeedItems(response.data.items);
      } else {
        setFeedItems((prev) => [...prev, ...response.data.items]);
      }
      
      setHasMore(response.data.hasMore);
    } catch (err) {
      console.error('Failed to fetch feed:', err);
      setError('Failed to load feed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContent = async (contentId: string) => {
    try {
      await feedService.saveContent(contentId);
      await earnPoints(2, 'save', contentId);
      
      setFeedItems((prev) =>
        prev.map((item) =>
          item.id === contentId ? { ...item, saved: true } : item
        )
      );
    } catch (err) {
      console.error('Failed to save content:', err);
    }
  };

  const handleShareContent = async (contentId: string) => {
    try {
      await feedService.shareContent(contentId);
      await earnPoints(5, 'shared', contentId);
      
      // Simulate successful share
      alert('Content shared successfully!');
    } catch (err) {
      console.error('Failed to share content:', err);
    }
  };

  const handleReportContent = async (contentId: string, reason: string) => {
    try {
      await feedService.reportContent(contentId, reason);
      
      // Remove reported content from feed
      setFeedItems((prev) => prev.filter((item) => item.id !== contentId));
    } catch (err) {
      console.error('Failed to report content:', err);
    }
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  // Mock data for demo
  const mockFeedItems: FeedItem[] = [
    {
      id: '1',
      title: 'Understanding React Hooks',
      content: 'React Hooks are a game-changer for functional components. Here\'s why you should use them in your next project...',
      source: 'twitter',
      publishedAt: '2025-01-15T14:30:00Z',
      url: 'https://twitter.com/reactjs/status/1234567890',
      authorName: 'React Team',
      authorImage: 'https://images.pexels.com/photos/7242908/pexels-photo-7242908.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=50&w=50',
      imageUrl: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      saved: false
    },
    {
      id: '2',
      title: 'Machine Learning in 2025: What\'s New',
      content: 'The latest advancements in machine learning are revolutionizing industries. Here\'s a comprehensive overview of what\'s changed in the past year...',
      source: 'linkedin',
      publishedAt: '2025-01-14T10:15:00Z',
      url: 'https://linkedin.com/posts/123456',
      authorName: 'AI Research Group',
      authorImage: 'https://images.pexels.com/photos/7242756/pexels-photo-7242756.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=50&w=50',
      imageUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      saved: true
    },
    {
      id: '3',
      title: 'The Future of Remote Work',
      content: 'As companies adapt to remote-first policies, here\'s how you can stay productive and maintain work-life balance...',
      source: 'reddit',
      publishedAt: '2025-01-13T08:45:00Z',
      url: 'https://reddit.com/r/remotework/comments/abc123',
      authorName: 'Remote Work Community',
      authorImage: 'https://images.pexels.com/photos/7242908/pexels-photo-7242908.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=50&w=50',
      imageUrl: 'https://images.pexels.com/photos/3987066/pexels-photo-3987066.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      saved: false
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Learning Feed</h1>
        <p className="text-gray-600">
          Discover curated educational content from around the web. Earn points by engaging with content.
        </p>
      </div>

      {/* Source filters */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center text-gray-700">
          <Filter className="h-5 w-5 mr-2" />
          <span>Filter by source:</span>
        </div>
        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setSource('all')}
            className={`px-4 py-2 rounded-full flex items-center space-x-1.5 ${
              source === 'all'
                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>All Sources</span>
          </button>
          <button
            onClick={() => setSource('twitter')}
            className={`px-4 py-2 rounded-full flex items-center space-x-1.5 ${
              source === 'twitter'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Twitter className="h-4 w-4" />
            <span>Twitter</span>
          </button>
          <button
            onClick={() => setSource('reddit')}
            className={`px-4 py-2 rounded-full flex items-center space-x-1.5 ${
              source === 'reddit'
                ? 'bg-orange-100 text-orange-800 border border-orange-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8zm6 9a1.5 1.5 0 11-.001-2.999A1.5 1.5 0 0118 13zm-12 0a1.5 1.5 0 11-.001-2.999A1.5 1.5 0 016 13zm9.95 4.5c-1.08 1.06-2.42 1.5-3.95 1.5-1.53 0-2.87-.44-3.95-1.5a1 1 0 111.4-1.42c.8.78 1.6 1.12 2.55 1.12.95 0 1.75-.34 2.55-1.13a1 1 0 111.4 1.43zm4.55-8.5c0-.83-.67-1.5-1.5-1.5a1.485 1.485 0 00-1.355.89C14.89 8.152 13.517 8 12 8c-1.518 0-2.89.153-3.646.39C8.151 7.544 7.37 7 6.5 7 5.67 7 5 7.67 5 8.5c0 .703.482 1.306 1.164 1.457.155 1.566 1.65 2.945 3.693 3.57a2 2 0 103.39-.06c1.97-.586 3.43-1.897 3.582-3.51A1.498 1.498 0 0018.5 8.5z" />
            </svg>
            <span>Reddit</span>
          </button>
          <button
            onClick={() => setSource('linkedin')}
            className={`px-4 py-2 rounded-full flex items-center space-x-1.5 ${
              source === 'linkedin'
                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M19 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V5C21 3.895 20.105 3 19 3ZM9 17H6.477V10H9V17ZM7.694 8.717C6.923 8.717 6.408 8.203 6.408 7.517C6.408 6.831 6.922 6.317 7.779 6.317C8.55 6.317 9.065 6.831 9.065 7.517C9.065 8.203 8.551 8.717 7.694 8.717ZM18 17H15.558V13.174C15.558 12.116 14.907 11.872 14.663 11.872C14.419 11.872 13.605 12.035 13.605 13.174C13.605 13.337 13.605 17 13.605 17H11.082V10H13.605V10.977C13.93 10.407 14.581 10 15.802 10C17.023 10 18 10.977 18 13.174V17Z" />
            </svg>
            <span>LinkedIn</span>
          </button>
        </div>
      </div>

      {/* Feed content */}
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {loading && page === 1 ? (
          // Show skeleton loaders for initial loading
          <div className="space-y-6">
            <FeedSkeleton />
            <FeedSkeleton />
            <FeedSkeleton />
          </div>
        ) : (
          // Use mock data for this demo
          <div className="space-y-6">
            {mockFeedItems.map((item) => (
              <FeedCard
                key={item.id}
                item={item}
                onSave={() => handleSaveContent(item.id)}
                onShare={() => handleShareContent(item.id)}
                onReport={(reason) => handleReportContent(item.id, reason)}
              />
            ))}
          </div>
        )}

        {/* Load more button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading && page > 1}
              className={`px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200 ${
                loading && page > 1 ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading && page > 1 ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading...</span>
                </div>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;