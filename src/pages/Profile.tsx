import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Book, Star, MessageSquare } from 'lucide-react';
import axios from 'axios';
import BookCard from '../components/Books/BookCard';
import ReviewCard from '../components/Reviews/ReviewCard';

interface User {
  username: string;
  displayName: string;
  bio: string;
  createdAt: string;
}

interface UserBook {
  _id: string;
  book: {
    _id: string;
    title: string;
    author: string;
    coverImage?: string;
    avgRating: number;
    ratingCount: number;
    genre?: string;
  };
  status: string;
  rating?: number;
  notes?: string;
  finishDate?: string;
  updatedAt: string;
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

interface Stats {
  totalBooks: number;
  booksRead: number;
  currentlyReading: number;
  totalReviews: number;
}

const Profile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [bookshelf, setBookshelf] = useState<UserBook[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState('books');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/${username}`);
        
        setUser(response.data.user);
        setBookshelf(response.data.bookshelf);
        setReviews(response.data.reviews);
        setStats(response.data.stats);
        setNotFound(false);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setNotFound(true);
        }
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfile();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
        <p className="text-gray-600">This user profile doesn't exist or is private.</p>
      </div>
    );
  }

  const booksByStatus = {
    reading: bookshelf.filter(b => b.status === 'reading'),
    finished: bookshelf.filter(b => b.status === 'finished'),
    'want-to-read': bookshelf.filter(b => b.status === 'want-to-read'),
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.displayName}</h1>
            <p className="text-gray-600 mb-4">@{user.username}</p>
            {user.bio && <p className="text-gray-700 mb-4">{user.bio}</p>}
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long' 
              })}
            </div>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.totalBooks}</div>
              <div className="text-sm text-gray-500">Total Books</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.booksRead}</div>
              <div className="text-sm text-gray-500">Books Read</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.currentlyReading}</div>
              <div className="text-sm text-gray-500">Currently Reading</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">{stats.totalReviews}</div>
              <div className="text-sm text-gray-500">Reviews</div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('books')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
              activeTab === 'books'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Book className="h-4 w-4" />
            <span>Books ({bookshelf.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Reviews ({reviews.length})</span>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'books' ? (
        <div className="space-y-8">
          {['reading', 'finished', 'want-to-read'].map((status) => {
            const statusBooks = booksByStatus[status as keyof typeof booksByStatus];
            const statusLabels = {
              'reading': 'Currently Reading',
              'finished': 'Finished',
              'want-to-read': 'Want to Read'
            };
            
            if (statusBooks.length === 0) return null;
            
            return (
              <div key={status}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {statusLabels[status as keyof typeof statusLabels]} ({statusBooks.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {statusBooks.map((userBook) => (
                    <BookCard key={userBook._id} userBook={userBook} showStatus={false} />
                  ))}
                </div>
              </div>
            );
          })}
          
          {bookshelf.length === 0 && (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No books in this user's shelf yet</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reviews yet</p>
            </div>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;