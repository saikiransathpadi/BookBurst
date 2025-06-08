import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Star } from 'lucide-react';
import axios from 'axios';

interface CreateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  bookTitle: string;
  onReviewCreated: () => void;
}

interface ReviewFormData {
  rating: number;
  content: string;
  wouldRecommend: boolean;
}

const CreateReviewModal: React.FC<CreateReviewModalProps> = ({
  isOpen,
  onClose,
  bookId,
  bookTitle,
  onReviewCreated
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: {
      wouldRecommend: true
    }
  });

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setLoading(true);
      setError('');

      await axios.post('/api/reviews', {
        bookId,
        rating: selectedRating,
        content: data.content,
        wouldRecommend: data.wouldRecommend
      }, { withCredentials: true });

      reset();
      setSelectedRating(0);
      onReviewCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create review');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{bookTitle}</h3>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleRatingClick(i + 1)}
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 ${
                      i < (hoverRating || selectedRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {selectedRating === 0 && (
              <p className="text-sm text-red-600 mt-1">Please select a rating</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Review *
            </label>
            <textarea
              {...register('content', {
                required: 'Review content is required',
                minLength: { value: 10, message: 'Review must be at least 10 characters' },
                maxLength: { value: 2000, message: 'Review must be less than 2000 characters' }
              })}
              rows={6}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
              placeholder="Share your thoughts about this book..."
            />
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              {...register('wouldRecommend')}
              type="checkbox"
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              I would recommend this book to others
            </label>
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
              disabled={loading || selectedRating === 0}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReviewModal;