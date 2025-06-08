import React, { useState, useEffect } from 'react';
import { Calendar, Book, Star } from 'lucide-react';
import axios from 'axios';
import BookCard from '../components/Books/BookCard';

interface TimelineEntry {
  year: number;
  month: number;
  books: Array<{
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
  }>;
}

const ReadingHistory: React.FC = () => {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/books/history/timeline');
        setTimeline(response.data);
      } catch (error) {
        console.error('Failed to fetch reading history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reading History</h1>
        <p className="text-gray-600">Your reading journey over time</p>
      </div>

      {timeline.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Book className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reading history yet</h3>
          <p className="text-gray-500">Start finishing books to see your reading timeline here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {timeline.map((entry) => (
            <div key={`${entry.year}-${entry.month}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="h-5 w-5 text-amber-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {getMonthName(entry.month)} {entry.year}
                </h2>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
                  {entry.books.length} {entry.books.length === 1 ? 'book' : 'books'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {entry.books.map((userBook) => (
                  <div key={userBook._id} className="relative">
                    <BookCard userBook={userBook} showStatus={false} />
                    {userBook.rating && (
                      <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{userBook.rating}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingHistory;