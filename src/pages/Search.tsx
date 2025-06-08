import React, { useState } from 'react';
import { Search as SearchIcon, Plus } from 'lucide-react';
import axios from 'axios';
import BookCard from '../components/Books/BookCard';

interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
  avgRating: number;
  ratingCount: number;
  genre?: string;
}

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await axios.get(`/api/books/search?q=${encodeURIComponent(query)}`);
      setBooks(response.data);
      setHasSearched(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToShelf = async (bookId: string, status: string = 'want-to-read') => {
    try {
      await axios.post('/api/books/shelf', {
        bookId,
        status
      });
      
      alert('Book added to your shelf!');
    } catch (error) {
      console.error('Failed to add book to shelf:', error);
      alert('Failed to add book to shelf');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Books</h1>
        <p className="text-gray-600">Find books to add to your reading list</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="max-w-2xl">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      )}

      {hasSearched && !loading && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Search Results ({books.length})
          </h2>
          
          {books.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-500">Try searching with different keywords or check your spelling.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div key={book._id} className="relative">
                  <BookCard book={book} showStatus={false} />
                  <button
                    onClick={() => handleAddToShelf(book._id)}
                    className="absolute top-4 right-4 bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 transition-colors shadow-lg"
                    title="Add to shelf"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!hasSearched && !loading && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <SearchIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
          <p className="text-gray-500">Enter a book title or author name to find books to add to your shelf.</p>
        </div>
      )}
    </div>
  );
};

export default Search;