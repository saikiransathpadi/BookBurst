import express from 'express';
import Book from '../models/Book.js';
import Review from '../models/Review.js';
import UserBook from '../models/UserBook.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get trending books
router.get('/trending', optionalAuth, async (req, res) => {
  try {
    const { genre, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Aggregate books by number of times added to shelves
    const pipeline = [
      {
        $lookup: {
          from: 'userbooks',
          localField: '_id',
          foreignField: 'book',
          as: 'userBooks'
        }
      },
      {
        $addFields: {
          popularity: { $size: '$userBooks' }
        }
      },
      {
        $match: {
          popularity: { $gt: 0 },
          ...(genre && { genre })
        }
      },
      {
        $sort: { popularity: -1, createdAt: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          userBooks: 0
        }
      }
    ];

    const books = await Book.aggregate(pipeline);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent reviews
router.get('/reviews', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .populate('user', 'username displayName')
      .populate('book')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get top rated books
router.get('/top-rated', optionalAuth, async (req, res) => {
  try {
    const { genre, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {
      ratingCount: { $gte: 3 }, // Minimum 3 ratings
      ...(genre && { genre })
    };

    const books = await Book.find(filter)
      .sort({ avgRating: -1, ratingCount: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get most wishlisted books
router.get('/wishlisted', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const pipeline = [
      {
        $match: { status: 'want-to-read' }
      },
      {
        $group: {
          _id: '$book',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book'
        }
      },
      {
        $unwind: '$book'
      },
      {
        $sort: { count: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: parseInt(limit)
      },
      {
        $replaceRoot: { newRoot: '$book' }
      }
    ];

    const books = await UserBook.aggregate(pipeline);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;