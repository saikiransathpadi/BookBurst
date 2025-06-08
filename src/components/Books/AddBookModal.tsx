import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Plus } from 'lucide-react';
import axios from 'axios';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded: () => void;
}

interface BookFormData {
  title: string;
  author: string;
  genre: string;
  description: string;
  publishedYear: number;
  pageCount: number;
  coverImage: string;
  status: string;
  rating?: number;
  notes: string;
}

const genres = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy',
  'Biography', 'History', 'Self-Help', 'Business', 'Poetry', 'Drama',
  'Horror', 'Adventure', 'Comedy', 'Other'
];

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onBookAdded }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<BookFormData>({
    defaultValues: {
      status: 'want-to-read',
      genre: 'Fiction'
    }
  });

  const watchStatus = watch('status');

  const onSubmit = async (data: BookFormData) => {
    try {
      setLoading(true);
      setError('');

      // First, add the book to the database
      const bookResponse = await axios.post('/api/books/add', {
        title: data.title,
        author: data.author,
        genre: data.genre,
        description: data.description,
        publishedYear: data.publishedYear || undefined,
        pageCount: data.pageCount || undefined,
        coverImage: data.coverImage || undefined
      }, { withCredentials: true });

      // Then add it to the user's shelf
      await axios.post('/api/books/shelf', {
        bookId: bookResponse.data._id,
        status: data.status,
        rating: data.rating || undefined,
        notes: data.notes || undefined
      }, { withCredentials: true });

      reset();
      onBookAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add New Book</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                placeholder="Enter book title"
              />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author *
              </label>
              <input
                {...register('author', { required: 'Author is required' })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                placeholder="Enter author name"
              />
              {errors.author && <p className="text-sm text-red-600 mt-1">{errors.author.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select
                {...register('genre')}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              >
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                {...register('status')}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              >
                <option value="want-to-read">Want to Read</option>
                <option value="reading">Currently Reading</option>
                <option value="finished">Finished</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Published Year
              </label>
              <input
                {...register('publishedYear', { 
                  valueAsNumber: true,
                  min: { value: 1000, message: 'Invalid year' },
                  max: { value: new Date().getFullYear(), message: 'Invalid year' }
                })}
                type="number"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                placeholder="e.g., 2023"
              />
              {errors.publishedYear && <p className="text-sm text-red-600 mt-1">{errors.publishedYear.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Count
              </label>
              <input
                {...register('pageCount', { 
                  valueAsNumber: true,
                  min: { value: 1, message: 'Must be at least 1 page' }
                })}
                type="number"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                placeholder="e.g., 350"
              />
              {errors.pageCount && <p className="text-sm text-red-600 mt-1">{errors.pageCount.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL
            </label>
            <input
              {...register('coverImage')}
              type="url"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              placeholder="https://example.com/book-cover.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              placeholder="Brief description of the book"
            />
          </div>

          {(watchStatus === 'finished') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Rating (1-5 stars)
              </label>
              <select
                {...register('rating', { valueAsNumber: true })}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              >
                <option value="">No rating</option>
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Personal Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              placeholder="Your thoughts, quotes, etc."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>{loading ? 'Adding...' : 'Add Book'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookModal;