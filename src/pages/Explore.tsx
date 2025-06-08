import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/Books/BookCard';
import ReviewCard from '../components/Reviews/ReviewCard';
import { setPreference, getPreference } from '../utils/cookies';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  avgRating: number;
  ratingCount: number;
  genre?: string;
}

interface Review {
  _id: string;
  rating: number;
  content: string;
  wouldRecommend: boolean;
  createdAt: string;
  user: {
    username: string;
    displayName: string;
  };
  book: {
    _id: string;
    title: string;
    author: string;
    coverImage?: string;
  };
}

const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState(() => getPreference('explore_tab', 'trending'));
  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'trending', label: 'Trending Books' },
    { id: 'reviews', label: 'Recent Reviews' },
    { id: 'top-rated', label: 'Top Rated' },
    { id: 'wishlisted', label: 'Most Wishlisted' },
  ];

  const fetchData = async (tab: string) => {
    try {
      setLoading(true);
      
      if (tab === 'reviews') {
        const response = await axios.get('/api/explore/reviews');
        setReviews(response.data);
        setBooks([]);
      } else {
        const response = await axios.get(`/api/explore/${tab}`);
        setBooks(response.data);
        setReviews([]);
      }
    } catch (error) {
      console.error('Failed to fetch explore data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPreference('explore_tab', tabId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Books</h1>
        <p className="text-gray-600">Discover trending books and community recommendations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : (
        <div>
          {activeTab === 'reviews' ? (
            <div className="space-y-6">
              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No reviews found</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No books found</p>
                </div>
              ) : (
                books.map((book) => (
                  <BookCard 
                    key={book._id} 
                    book={book} 
                    showStatus={false}
                  />
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Explore;