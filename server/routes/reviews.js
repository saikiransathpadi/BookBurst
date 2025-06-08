import express from 'express';
import Review from '../models/Review.js';
import Book from '../models/Book.js';
import UserBook from '../models/UserBook.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create review
router.post('/', authenticate, async (req, res) => {
  try {
    const { bookId, rating, content, wouldRecommend } = req.body;

    // Check if user has book in their shelf
    const userBook = await UserBook.findOne({
      user: req.user._id,
      book: bookId
    });

    if (!userBook) {
      return res.status(400).json({ message: 'You must add this book to your shelf first' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: req.user._id,
      book: bookId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = new Review({
      user: req.user._id,
      book: bookId,
      rating,
      content,
      wouldRecommend
    });

    await review.save();
    await review.populate('user', 'username displayName');
    await review.populate('book');

    // Update book's average rating
    const allReviews = await Review.find({ book: bookId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    
    await Book.findByIdAndUpdate(bookId, {
      avgRating: Math.round(avgRating * 10) / 10,
      ratingCount: allReviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reviews for a book
router.get('/book/:bookId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'username displayName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ book: req.params.bookId });

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's reviews
router.get('/user/:username', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .populate({
        path: 'user',
        match: { username: req.params.username },
        select: 'username displayName'
      })
      .populate('book')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const filteredReviews = reviews.filter(review => review.user);

    res.json({
      reviews: filteredReviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;