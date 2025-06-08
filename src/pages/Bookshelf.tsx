import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import BookCard from '../components/Books/BookCard';
import AddBookModal from '../components/Books/AddBookModal';
import { setPreference, getPreference } from '../utils/cookies';

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

const Bookshelf: React.FC = () => {
  const [books, setBooks] = useState<UserBook[]>([]);
  const [activeTab, setActiveTab] = useState(() => getPreference('bookshelf_tab', 'all'));
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs = [
    { id: 'all', label: 'All Books', count: books.length },
    { id: 'reading', label: 'Reading', count: books.filter(b => b.status === 'reading').length },
    { id: 'finished', label: 'Finished', count: books.filter(b => b.status === 'finished').length },
    { id: 'want-to-read', label: 'Want to Read', count: books.filter(b => b.status === 'want-to-read').length },
  ];

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/books/shelf', { withCredentials: true });
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setPreference('bookshelf_tab', tabId);
  };

  const filteredBooks = activeTab === 'all' 
    ? books 
    : books.filter(book => book.status === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Bookshelf</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Book</span>
        </button>
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
              {tab.label} {tab.count > 0 && (
                <span className="bg-gray-100 text-gray-900 ml-2 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === 'all' ? 'No books in your shelf yet' : `No ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()} books`}
          </h3>
          <p className="text-gray-500 mb-4">
            Start building your personal library by adding some books.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Your First Book</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((userBook) => (
            <BookCard key={userBook._id} userBook={userBook} />
          ))}
        </div>
      )}

      <AddBookModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onBookAdded={fetchBooks}
      />
    </div>
  );
};

export default Bookshelf;