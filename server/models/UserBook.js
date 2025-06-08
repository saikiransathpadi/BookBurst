import mongoose from 'mongoose';

const userBookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  status: {
    type: String,
    enum: ['reading', 'finished', 'want-to-read'],
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  startDate: {
    type: Date
  },
  finishDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userBookSchema.index({ user: 1, book: 1 }, { unique: true });

userBookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('UserBook', userBookSchema);