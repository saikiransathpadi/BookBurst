import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ThumbsUp, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

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

interface ReviewCardProps {
  review: Review;
  showBook?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, showBook = true }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start space-x-4">
        {showBook && review.book.coverImage && (
          <Link to={`/book/${review.book._id}`} className="flex-shrink-0">
            <img
              src={review.book.coverImage}
              alt={review.book.title}
              className="w-16 h-24 object-cover rounded"
            />
          </Link>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Link
                to={`/profile/${review.user.username}`}
                className="font-medium text-gray-900 hover:text-amber-600 transition-colors"
              >
                {review.user.displayName}
              </Link>
              <span className="text-gray-500">•</span>
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(review.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
          
          {showBook && (
            <div className="mb-3">
              <Link
                to={`/book/${review.book._id}`}
                className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors"
              >
                {review.book.title}
              </Link>
              <p className="text-gray-600 flex items-center">
                <User className="h-4 w-4 mr-1" />
                {review.book.author}
              </p>
            </div>
          )}
          
          <p className="text-gray-700 mb-3 leading-relaxed">
            {review.content}
          </p>
          
          {review.wouldRecommend && (
            <div className="flex items-center text-green-600">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Recommends this book</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;