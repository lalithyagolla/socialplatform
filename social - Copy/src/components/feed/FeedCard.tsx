import React, { useState } from 'react';
import { ExternalLink, Bookmark, Share2, Flag, Clock, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

interface FeedCardProps {
  item: FeedItem;
  onSave: () => void;
  onShare: () => void;
  onReport: (reason: string) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({ item, onSave, onShare, onReport }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isLongContent, setIsLongContent] = useState(item.content.length > 200);
  const [expanded, setExpanded] = useState(false);

  const getSourceIcon = () => {
    switch (item.source) {
      case 'twitter':
        return (
          <div className="bg-blue-50 p-1.5 rounded-full">
            <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.017 10.017 0 01-3.127 1.195A4.92 4.92 0 0011.91 8.098a13.98 13.98 0 01-10.15-5.146 4.921 4.921 0 001.523 6.57 4.892 4.892 0 01-2.23-.616v.061a4.926 4.926 0 003.95 4.828 4.988 4.988 0 01-2.224.084 4.926 4.926 0 004.599 3.419A9.883 9.883 0 010 19.54a13.931 13.931 0 007.548 2.212c9.057 0 14.01-7.5 14.01-14.01 0-.213-.005-.425-.014-.636A10.036 10.036 0 0024 4.59l-.047-.02z" />
            </svg>
          </div>
        );
      case 'reddit':
        return (
          <div className="bg-orange-50 p-1.5 rounded-full">
            <svg className="h-4 w-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8zm6 9a1.5 1.5 0 11-.001-2.999A1.5 1.5 0 0118 13zm-12 0a1.5 1.5 0 11-.001-2.999A1.5 1.5 0 016 13zm9.95 4.5c-1.08 1.06-2.42 1.5-3.95 1.5-1.53 0-2.87-.44-3.95-1.5a1 1 0 111.4-1.42c.8.78 1.6 1.12 2.55 1.12.95 0 1.75-.34 2.55-1.13a1 1 0 111.4 1.43zm4.55-8.5c0-.83-.67-1.5-1.5-1.5a1.485 1.485 0 00-1.355.89C14.89 8.152 13.517 8 12 8c-1.518 0-2.89.153-3.646.39C8.151 7.544 7.37 7 6.5 7 5.67 7 5 7.67 5 8.5c0 .703.482 1.306 1.164 1.457.155 1.566 1.65 2.945 3.693 3.57a2 2 0 103.39-.06c1.97-.586 3.43-1.897 3.582-3.51A1.498 1.498 0 0018.5 8.5z" />
            </svg>
          </div>
        );
      case 'linkedin':
        return (
          <div className="bg-blue-50 p-1.5 rounded-full">
            <svg className="h-4 w-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V5C21 3.895 20.105 3 19 3ZM9 17H6.477V10H9V17ZM7.694 8.717C6.923 8.717 6.408 8.203 6.408 7.517C6.408 6.831 6.922 6.317 7.779 6.317C8.55 6.317 9.065 6.831 9.065 7.517C9.065 8.203 8.551 8.717 7.694 8.717ZM18 17H15.558V13.174C15.558 12.116 14.907 11.872 14.663 11.872C14.419 11.872 13.605 12.035 13.605 13.174C13.605 13.337 13.605 17 13.605 17H11.082V10H13.605V10.977C13.93 10.407 14.581 10 15.802 10C17.023 10 18 10.977 18 13.174V17Z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-1.5 rounded-full">
            <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'recently';
    }
  };

  const handleReport = () => {
    if (reportReason.trim()) {
      onReport(reportReason);
      setIsReporting(false);
      setReportReason('');
    }
  };

  const displayContent = expanded ? item.content : item.content.substring(0, 200) + (isLongContent ? '...' : '');

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-shadow hover:shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {item.authorImage ? (
              <img
                src={item.authorImage}
                alt={item.authorName || 'Author'}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                {item.authorName ? item.authorName.charAt(0) : 'A'}
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{item.authorName || 'Anonymous'}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{formatDate(item.publishedAt)}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  {getSourceIcon()}
                  <span className="capitalize">{item.source}</span>
                </div>
              </div>
            </div>
          </div>
          
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Open original"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
        
        <p className="text-gray-600 mb-4">
          {displayContent}
          {isLongContent && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-1 text-orange-500 hover:text-orange-600 font-medium focus:outline-none"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
        
        {item.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex space-x-2 mb-2 sm:mb-0">
            <button
              onClick={onSave}
              disabled={item.saved}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm ${
                item.saved
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              } transition-colors`}
            >
              {item.saved ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  <span>Save</span>
                </>
              )}
            </button>
            
            <button
              onClick={onShare}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
          
          <div>
            {isReporting ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Reason for reporting"
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <button
                  onClick={handleReport}
                  className="px-2 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                >
                  Submit
                </button>
                <button
                  onClick={() => setIsReporting(false)}
                  className="px-2 py-1 text-sm bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsReporting(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Flag className="h-4 w-4" />
                <span>Report</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;