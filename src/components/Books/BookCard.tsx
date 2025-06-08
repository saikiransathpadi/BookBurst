import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, User } from 'lucide-react';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  avgRating: number;
  ratingCount: number;
  genre?: string;
}

interface UserBook {
  _id: string;
  book: Book;
  status: string;
  rating?: number;
  notes?: string;
  finishDate?: string;
  updatedAt: string;
}

interface BookCardProps {
  userBook?: UserBook;
  book?: Book;
  showStatus?: boolean;
  showRating?: boolean;
  onClick?: () => void;
}

const statusColors = {
  'reading': 'bg-blue-100 text-blue-800',
  'finished': 'bg-green-100 text-green-800',
  'want-to-read': 'bg-yellow-100 text-yellow-800'
};

const statusLabels = {
  'reading': 'Reading',
  'finished': 'Finished',
  'want-to-read': 'Want to Read'
};

const BookCard: React.FC<BookCardProps> = ({ 
  userBook, 
  book: standaloneBook, 
  showStatus = true, 
  showRating = true,
  onClick 
}) => {
  const book = userBook?.book || standaloneBook;
  
  if (!book) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Link 
      to={`/book/${book._id}`}
      className="block group"
      onClick={handleClick}
    >
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="flex">
          <div className="flex-shrink-0">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-24 h-36 object-cover"
              />
            ) : (
              <div className="w-24 h-36 bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
                <span className="text-xs text-center text-amber-800 font-medium px-2">
                  {book.title.slice(0, 20)}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                {book.title}
              </h3>
              {showStatus && userBook && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[userBook.status as keyof typeof statusColors]}`}>
                  {statusLabels[userBook.status as keyof typeof statusLabels]}
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-2 flex items-center">
              <User className="h-4 w-4 mr-1" />
              {book.author}
            </p>
            
            {book.genre && (
              <p className="text-sm text-gray-500 mb-2">{book.genre}</p>
            )}
            
            <div className="flex items-center justify-between">
              {showRating && book.ratingCount > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {book.avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({book.ratingCount})
                  </span>
                </div>
              )}
              
              {userBook?.rating && (
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-500">Your rating:</span>
                  <Star className="h-4 w-4 text-amber-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">
                    {userBook.rating}
                  </span>
                </div>
              )}
              
              {userBook?.finishDate && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(userBook.finishDate).toLocaleDateString()}
                </div>
              )}
            </div>
            
            {userBook?.notes && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {userBook.notes}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;