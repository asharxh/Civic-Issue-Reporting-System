import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, MapPin, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setDarkMode(saved);
    document.documentElement.classList.toggle('dark', saved);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <MapPin className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800 dark:text-white">CivicReport</span>
        </Link>
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Home</Link>
          {user?.role === 'citizen' && (
            <>
              <Link to="/report" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Report Issue</Link>
              <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Dashboard</Link>
              <Link to="/profile" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Profile</Link>
            </>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Admin Dashboard</Link>
          )}
          {!user && (
            <>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Register</Link>
            </>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-300">{user.name} ({user.role})</span>
              <button onClick={handleLogout} className="text-gray-600 dark:text-gray-300 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
          <button onClick={toggleDarkMode} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
