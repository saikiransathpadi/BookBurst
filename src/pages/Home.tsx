import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, Users, TrendingUp, Search, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-amber-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back to BookBurst!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Continue your reading journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/bookshelf"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                View My Books
              </Link>
              <Link
                to="/explore"
                className="bg-white text-amber-600 border-2 border-amber-600 px-8 py-3 rounded-lg hover:bg-amber-50 transition-colors font-medium"
              >
                Discover Books
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <BookOpen className="h-20 w-20 text-amber-600 mx-auto mb-8" />
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Reading Journey Starts Here
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your books, share reviews, and discover your next great read with BookBurst - 
            the social reading platform that celebrates every page you turn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-amber-600 text-white px-8 py-4 rounded-lg hover:bg-amber-700 transition-colors text-lg font-medium"
            >
              Start Reading Today
            </Link>
            <Link
              to="/login"
              className="bg-white text-amber-600 border-2 border-amber-600 px-8 py-4 rounded-lg hover:bg-amber-50 transition-colors text-lg font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Track Your Reading
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From personal book shelves to community discovery, BookBurst helps you organize 
              and enhance your reading experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Bookshelf</h3>
              <p className="text-gray-600">
                Organize your books by reading status. Track what you're reading, want to read, 
                and have finished with personal notes and ratings.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reviews & Ratings</h3>
              <p className="text-gray-600">
                Share your thoughts with detailed reviews and star ratings. Help others discover 
                their next favorite book with your honest opinions.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover Trending</h3>
              <p className="text-gray-600">
                Explore what the community is reading. Find trending books, recent reviews, 
                and highly-rated recommendations.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Public Profiles</h3>
              <p className="text-gray-600">
                Share your reading journey with others. Create a public profile showcasing 
                your bookshelf and reviews for quiet discovery.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Search className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-gray-600">
                Find books easily with our search feature. Add books manually or discover 
                new titles to add to your reading list.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reading History</h3>
              <p className="text-gray-600">
                View your reading timeline and track your progress over time. See your 
                reading habits and celebrate your accomplishments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-amber-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Reading Experience?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Join thousands of readers who are already tracking and sharing their literary adventures.
          </p>
          <Link
            to="/register"
            className="bg-white text-amber-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium inline-block"
          >
            Create Your Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;