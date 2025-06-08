import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Bookshelf from './pages/Bookshelf';
import Explore from './pages/Explore';
import Search from './pages/Search';
import BookDetail from './pages/BookDetail';
import Profile from './pages/Profile';
import ReadingHistory from './pages/ReadingHistory';

import axios from 'axios';
axios.defaults.baseURL = 'https://bookburst-aoqq.onrender.com';


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/bookshelf" /> : <LoginForm />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/bookshelf" /> : <RegisterForm />} 
      />
      <Route 
        path="/bookshelf" 
        element={
          <ProtectedRoute>
            <Layout><Bookshelf /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/explore" 
        element={
          <ProtectedRoute>
            <Layout><Explore /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/search" 
        element={
          <ProtectedRoute>
            <Layout><Search /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/history" 
        element={
          <ProtectedRoute>
            <Layout><ReadingHistory /></Layout>
          </ProtectedRoute>
        } 
      />
      <Route path="/book/:id" element={<Layout><BookDetail /></Layout>} />
      <Route path="/profile/:username" element={<Layout><Profile /></Layout>} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;