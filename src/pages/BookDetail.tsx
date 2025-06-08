import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, User, Calendar, ThumbsUp, Plus, MessageSquare } from 'lucide-react';
import axios from 'axios';
import ReviewCard from '../components/Reviews/ReviewCard';
import CreateReviewModal from '../components/Reviews/CreateReviewModal';
import { useAuth } from '../contexts/AuthContext';

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  avgRating: number;
  ratingCount: number;
  genre?: string;
  publishedYear?: number;
  pageCount?: number;
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
}

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`/api/books/${id}`);
      setBook(response.data.book);
      setReviews(response.data.reviews);
      
      // Check if current user has already reviewed this book
      if (isAuthenticated) {
        const userReview = response.data.reviews.find(
          (review: Review) => review.user.username === localStorage.getItem('username')
        );
        setUserHasReviewed(!!userReview);
      }
    } catch (error) {
      console.error('Failed to fetch book details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id, isAuthenticated]);

  const handleAddToShelf = async (status: string) => {
    try {
      await axios.post('/api/books/shelf', {
        bookId: id,
        status
      }, { withCredentials: true });
      
      // You might want to show a success message here
      alert('Book added to your shelf!');
    } catch (error) {
      console.error('Failed to add book to shelf:', error);
      alert('Failed to add book to shelf');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h2>
        <Link to="/explore" className="text-amber-600 hover:text-amber-700">
          Browse other books
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Book Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-48 h-72 object-cover rounded-lg shadow-md"
                />
              ) : (
                <div className="w-48 h-72 bg-gradient-to-br from-amber-200 to-orange-300 rounded-lg shadow-md flex items-center justify-center">
                  <span className="text-center text-amber-800 font-medium px-4">
                    {book.title}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  {book.author}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {book.ratingCount > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      {renderStars(Math.round(book.avgRating))}
                    </div>
                    <span className="text-lg font-medium text-gray-700">
                      {book.avgRating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({book.ratingCount} {book.ratingCount === 1 ? 'rating' : 'ratings'})
                    </span>
                  </div>
                )}
                
                {book.genre && (
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    {book.genre}
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                {book.publishedYear && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {book.publishedYear}
                  </div>
                )}
                {book.pageCount && (
                  <span>{book.pageCount} pages</span>
                )}
              </div>
              
              {book.description && (
                <p className="text-gray-700 leading-relaxed mb-6">
                  {book.description}
                </p>
              )}
              
              {isAuthenticated && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleAddToShelf('want-to-read')}
                    className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to Shelf</span>
                  </button>
                  
                  {!userHasReviewed && (
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="flex items-center space-x-2 bg-white text-amber-600 border-2 border-amber-600 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Write Review</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Reviews ({reviews.length})
          </h2>
        </div>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-500 mb-4">Be the first to share your thoughts about this book!</p>
            {isAuthenticated && !userHasReviewed && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Write First Review
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={{
                ...review,
                book: {
                  _id: book._id,
                  title: book.title,
                  author: book.author,
                  coverImage: book.coverImage
                }
              }} showBook={false} />
            ))}
          </div>
        )}
      </div>

      <CreateReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        bookId={book._id}
        bookTitle={book.title}
        onReviewCreated={() => {
          fetchBookDetails();
          setUserHasReviewed(true);
        }}
      />
    </div>
  );
};

export default BookDetail;