import express from 'express';
import Book from '../models/Book.js';
import UserBook from '../models/UserBook.js';
import Review from '../models/Review.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Search books
router.get('/search', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const books = await Book.find({
      $text: { $search: q }
    }).limit(20);

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add book to database
router.post('/add', authenticate, async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      addedBy: req.user._id
    };

    const existingBook = await Book.findOne({
      title: bookData.title,
      author: bookData.author
    });

    if (existingBook) {
      return res.json(existingBook);
    }

    const book = new Book(bookData);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's bookshelf
router.get('/shelf', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };
    
    if (status) {
      filter.status = status;
    }

    const userBooks = await UserBook.find(filter)
      .populate('book')
      .sort({ updatedAt: -1 });

    res.json(userBooks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add book to user's shelf
router.post('/shelf', authenticate, async (req, res) => {
  try {
    const { bookId, status, rating, notes } = req.body;

    const existingUserBook = await UserBook.findOne({
      user: req.user._id,
      book: bookId
    });

    if (existingUserBook) {
      existingUserBook.status = status;
      if (rating) existingUserBook.rating = rating;
      if (notes) existingUserBook.notes = notes;
      if (status === 'finished' && !existingUserBook.finishDate) {
        existingUserBook.finishDate = new Date();
      }
      await existingUserBook.save();
      return res.json(existingUserBook);
    }

    const userBook = new UserBook({
      user: req.user._id,
      book: bookId,
      status,
      rating,
      notes,
      startDate: status === 'reading' ? new Date() : undefined,
      finishDate: status === 'finished' ? new Date() : undefined
    });

    await userBook.save();
    await userBook.populate('book');
    res.status(201).json(userBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update book in user's shelf
router.put('/shelf/:id', authenticate, async (req, res) => {
  try {
    const userBook = await UserBook.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!userBook) {
      return res.status(404).json({ message: 'Book not found in your shelf' });
    }

    const { status, rating, notes } = req.body;
    
    if (status) userBook.status = status;
    if (rating) userBook.rating = rating;
    if (notes !== undefined) userBook.notes = notes;
    
    if (status === 'finished' && !userBook.finishDate) {
      userBook.finishDate = new Date();
    }

    await userBook.save();
    await userBook.populate('book');
    res.json(userBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove book from user's shelf
router.delete('/shelf/:id', authenticate, async (req, res) => {
  try {
    const userBook = await UserBook.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!userBook) {
      return res.status(404).json({ message: 'Book not found in your shelf' });
    }

    res.json({ message: 'Book removed from shelf' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get book details
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const reviews = await Review.find({ book: book._id })
      .populate('user', 'username displayName')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ book, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get reading history
router.get('/history/timeline', authenticate, async (req, res) => {
  try {
    const finishedBooks = await UserBook.find({
      user: req.user._id,
      status: 'finished',
      finishDate: { $exists: true }
    })
      .populate('book')
      .sort({ finishDate: -1 });

    // Group by month/year
    const timeline = finishedBooks.reduce((acc, userBook) => {
      const date = new Date(userBook.finishDate);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!acc[key]) {
        acc[key] = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          books: []
        };
      }
      
      acc[key].books.push(userBook);
      return acc;
    }, {});

    res.json(Object.values(timeline));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;