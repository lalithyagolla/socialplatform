import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { useAuth } from '../contexts/AuthContext';
import { usePoints, PointsTransaction } from '../contexts/PointsContext';
import { feedService } from '../services/api';
import FeedCard from '../components/feed/FeedCard';
import { Award, Clock, ArrowUp, ArrowDown } from 'lucide-react';

interface SavedContent {
  id: string;
  title: string;
  content: string;
  source: 'twitter' | 'reddit' | 'linkedin';
  publishedAt: string;
  url: string;
  authorName?: string;
  authorImage?: string;
  imageUrl?: string;
  saved: boolean;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { points, transactions, fetchTransactions, loadingPoints } = usePoints();
  const [savedContent, setSavedContent] = useState<SavedContent[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchSavedContent();
    } else if (activeTab === 'transactions') {
      fetchTransactions();
    }
  }, [activeTab]);

  const fetchSavedContent = async () => {
    try {
      setLoadingSaved(true);
      const response = await feedService.getSavedContent();
      setSavedContent(response.data.items);
    } catch (err) {
      console.error('Failed to fetch saved content:', err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleRemoveSaved = async (contentId: string) => {
    // This would call an API endpoint to remove the saved content
    setSavedContent((prev) => prev.filter((item) => item.id !== contentId));
  };

  // Mock data for the profile page
  const mockSavedContent: SavedContent[] = [
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
      saved: true
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
    }
  ];

  const mockTransactions: PointsTransaction[] = [
    {
      id: '1',
      userId: '123',
      amount: 5,
      activity: 'shared',
      contentId: '1',
      contentTitle: 'Understanding React Hooks',
      createdAt: '2025-01-15T14:35:00Z'
    },
    {
      id: '2',
      userId: '123',
      amount: 2,
      activity: 'save',
      contentId: '2',
      contentTitle: 'Machine Learning in 2025: What\'s New',
      createdAt: '2025-01-14T10:20:00Z'
    },
    {
      id: '3',
      userId: '123',
      amount: -10,
      activity: 'purchase',
      contentId: '3',
      contentTitle: 'Premium Course: Advanced TypeScript',
      createdAt: '2025-01-13T08:45:00Z'
    },
    {
      id: '4',
      userId: '123',
      amount: 1,
      activity: 'comment',
      contentId: '4',
      contentTitle: 'Web Development Trends for 2025',
      createdAt: '2025-01-12T16:30:00Z'
    }
  ];

  const getActivityText = (activity: string, amount: number) => {
    switch (activity) {
      case 'watched':
        return 'Watched content';
      case 'shared':
        return 'Shared content';
      case 'comment':
        return 'Commented on content';
      case 'save':
        return 'Saved content';
      case 'report':
        return 'Reported content';
      case 'purchase':
        return amount < 0 ? 'Purchased premium content' : 'Refund for purchase';
      default:
        return 'Activity';
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-orange-500 to-yellow-500"></div>
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-end md:justify-between relative">
          <div className="flex items-center">
            <div className="absolute md:relative top-0 transform -translate-y-1/2 md:transform-none md:top-auto md:-mt-12 bg-white rounded-full p-1 shadow-md">
              <div className="h-20 w-20 md:h-24 md:w-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="ml-4 mt-10 md:mt-0">
              <h1 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h1>
              <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center bg-green-100 px-4 py-2 rounded-full">
            <Award className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-700 font-medium">{points} Credits</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white p-1 rounded-lg shadow-sm border border-gray-100">
          <TabsTrigger value="overview" className="py-2 px-4 rounded-md">
            Overview
          </TabsTrigger>
          <TabsTrigger value="saved" className="py-2 px-4 rounded-md">
            Saved Content
          </TabsTrigger>
          <TabsTrigger value="transactions" className="py-2 px-4 rounded-md">
            Credit History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Content Saved</span>
                  <span className="font-medium">{mockSavedContent.length}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Content Shared</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Comments Made</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Premium Content Accessed</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {mockTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-start justify-between pb-2 border-b border-gray-100">
                    <div className="flex items-start">
                      <div className={`mt-1 p-1 rounded-full ${transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                        {transaction.amount > 0 ? (
                          <ArrowUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-800">
                          {getActivityText(transaction.activity, transaction.amount)}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {transaction.contentTitle}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center justify-end">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => setActiveTab('transactions')}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  View all transactions
                </button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Saved Content</h2>
          {loadingSaved ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : mockSavedContent.length > 0 ? (
            <div className="space-y-6">
              {mockSavedContent.map((item) => (
                <FeedCard
                  key={item.id}
                  item={item}
                  onSave={() => handleRemoveSaved(item.id)}
                  onShare={() => {}}
                  onReport={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">You haven't saved any content yet.</p>
              <button
                onClick={() => setActiveTab('feed')}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Explore Content
              </button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="pt-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Credit Points History</h2>
          {loadingPoints ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Content
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getActivityText(transaction.activity, transaction.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                          {transaction.contentTitle}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;