# BookBurst - Social Reading Tracker

A full-stack social reading platform where users can track their reading journey, share reviews, and discover new books through community activity.

## Features

### Core Functionality
- **Personal Bookshelf Management**: Track books by status (Reading, Finished, Want to Read)
- **Review System**: Write and share detailed book reviews with ratings
- **Social Discovery**: Explore trending books and community reviews
- **Public Profiles**: Share your reading journey with others
- **Reading History Timeline**: Visual representation of your reading progress
- **Smart Search**: Find and add books to your collection

### Technical Features
- **Cookie-based Preferences**: Remembers your last selected tabs and filters
- **Responsive Design**: Optimized for all devices
- **Real-time Updates**: Dynamic content updates without page refreshes
- **Secure Authentication**: JWT-based auth with HTTP-only cookies

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **React Hook Form** for form handling
- **Lucide React** for icons
- **js-cookie** for client-side cookie management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
   
   Update the following in `.env`:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret key for JWT tokens

3. **Start the application**:
   ```bash
   npm run dev
   ```
   
   This will start both the frontend (port 5173) and backend (port 5000) concurrently.

4. **Access the application**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
├── server/                 # Backend code
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   └── index.js          # Server entry point
├── src/                   # Frontend code
│   ├── components/        # React components
│   ├── contexts/         # React contexts
│   ├── pages/            # Page components
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main app component
└── package.json          # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Books
- `GET /api/books/search` - Search books
- `POST /api/books/add` - Add new book
- `GET /api/books/shelf` - Get user's bookshelf
- `POST /api/books/shelf` - Add book to shelf
- `PUT /api/books/shelf/:id` - Update book in shelf
- `DELETE /api/books/shelf/:id` - Remove book from shelf
- `GET /api/books/:id` - Get book details
- `GET /api/books/history/timeline` - Get reading history

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/book/:bookId` - Get book reviews
- `GET /api/reviews/user/:username` - Get user reviews

### Users
- `GET /api/users/:username` - Get public profile

### Explore
- `GET /api/explore/trending` - Get trending books
- `GET /api/explore/reviews` - Get recent reviews
- `GET /api/explore/top-rated` - Get top-rated books
- `GET /api/explore/wishlisted` - Get most wishlisted books

## Features in Detail

### Cookie-based Preferences
The app remembers your preferences using cookies:
- **Bookshelf Tab**: Returns to your last viewed tab (Reading, Finished, etc.)
- **Explore Filter**: Remembers your preferred explore view (Trending, Reviews, etc.)

### Reading Status Management
Books can have three statuses:
- **Want to Read**: Books you plan to read
- **Reading**: Currently reading
- **Finished**: Completed books with optional ratings and finish dates

### Review System
- Write detailed reviews with 1-5 star ratings
- Mark books as "would recommend"
- Reviews are permanent once published
- Public visibility for community discovery

### Social Features
- Public profiles showing bookshelves and reviews
- Trending books based on community activity
- Recent reviews feed
- Top-rated books with minimum rating requirements

## Development

### Running in Development Mode
```bash
npm run dev          # Start both frontend and backend
npm run client       # Start only frontend
npm run server       # Start only backend
```

### Building for Production
```bash
npm run build        # Build frontend for production
```

## Deployment

The application is ready for deployment on platforms like:
- **Frontend**: Netlify, Vercel, or any static hosting
- **Backend**: Heroku, Railway, or any Node.js hosting
- **Database**: MongoDB Atlas for cloud database

Make sure to:
1. Set production environment variables
2. Update CORS settings for your domain
3. Use HTTPS in production for secure cookies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).