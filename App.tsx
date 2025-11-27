import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isConfigured } from './lib/firebase';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DonorDetails from './pages/DonorDetails';

// Simple loading spinner
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) {
      // If no config, mock a "logged out" state initially, 
      // but in Auth.tsx we allow "fake login"
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <Loader />;

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar user={user} />
        <main>
          <Routes>
            {/* Public Route - Landing redirects to dashboard if logged in */}
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" /> : <div className="p-10 text-center">
                <h1 className="text-4xl font-bold text-brand-700 mb-4">Save a Life Today</h1>
                <p className="mb-8 text-xl text-gray-600">Connect with blood donors in your community immediately.</p>
                <a href="#/auth" className="inline-block bg-brand-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-brand-700">Get Started</a>
              </div>} 
            />
            
            <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/dashboard" />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
            <Route path="/donor/:id" element={<DonorDetails />} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
