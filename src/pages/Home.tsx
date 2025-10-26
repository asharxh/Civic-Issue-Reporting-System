import { Link } from 'react-router-dom';
import { Plus, ThumbsUp, MapPin, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReportStore } from '../stores/reportStore';
import type { Report } from '../data/mockData';

const Home = () => {
  const { user } = useAuth();
  const { reports, upvoteReport } = useReportStore();

  const handleUpvote = (reportId: number) => {
    if (!user) {
      // Could redirect to login or show message
      return;
    }
    upvoteReport(reportId);
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'Resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Verified':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Verified':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to CivicReport
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Report local issues and help improve your community.
        </p>
        {user ? (
          <Link
            to="/report"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Report New Issue
          </Link>
        ) : (
          <div className="space-y-4">
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
            >
              Login to Report
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Community Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.slice(0, 9).map((report) => (
            <div key={report.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(report.status)}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {report.title}
                  </h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{report.description}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {report.location.address || 'Location provided'}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">{report.category}</span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleUpvote(report.id)}
                    disabled={!user}
                    className={`flex items-center space-x-1 ${
                      user
                        ? 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                        : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{report.upvotes}</span>
                  </button>
                  <Link
                    to={`/report/${report.id}`}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!user && (
        <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Join the Community
          </h3>
          <p className="text-blue-700 dark:text-blue-200 mb-4">
            Create an account to report issues, track their progress, and upvote community reports.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
