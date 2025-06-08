import express from 'express';
import User from '../models/User.js';
import UserBook from '../models/UserBook.js';
import Review from '../models/Review.js';

const router = express.Router();

// Get public profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ 
      username: req.params.username,
      isPublic: true 
    }).select('-password -email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookshelf = await UserBook.find({ user: user._id })
      .populate('book')
      .sort({ updatedAt: -1 });

    const reviews = await Review.find({ user: user._id })
      .populate('book')
      .sort({ createdAt: -1 })
      .limit(5);

    const stats = {
      totalBooks: bookshelf.length,
      booksRead: bookshelf.filter(b => b.status === 'finished').length,
      currentlyReading: bookshelf.filter(b => b.status === 'reading').length,
      totalReviews: await Review.countDocuments({ user: user._id })
    };

    res.json({
      user: {
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        createdAt: user.createdAt
      },
      bookshelf,
      reviews,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;