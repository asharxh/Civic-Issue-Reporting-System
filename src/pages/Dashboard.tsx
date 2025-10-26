import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ThumbsUp, MapPin, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReportStore } from '../stores/reportStore';
import type { Report } from '../data/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  const { reports, getUserReports, upvoteReport } = useReportStore();
  const [userReports, setUserReports] = useState<Report[]>([]);
  const [nearbyReports, setNearbyReports] = useState<Report[]>([]);

  useEffect(() => {
    if (user) {
      const myReports = getUserReports(user.id);
      setUserReports(myReports);

      // Mock nearby reports (exclude user's own reports)
      const nearby = reports.filter(r => r.createdBy !== user.id).slice(0, 5);
      setNearbyReports(nearby);
    }
  }, [user, reports, getUserReports]);

  const handleUpvote = (reportId: number) => {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Track your reported issues and support community reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <MapPin className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userReports.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {userReports.filter(r => r.status === 'Resolved').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {userReports.filter(r => r.status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ThumbsUp className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Upvotes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {userReports.reduce((sum, r) => sum + r.upvotes, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* My Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">My Reports</h3>
            <Link
              to="/report"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              New Report
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {userReports.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No reports yet. Start by reporting an issue!</p>
            </div>
          ) : (
            userReports.map((report) => (
              <div key={report.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(report.status)}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{report.description.substring(0, 100)}...</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {report.upvotes} upvotes
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    to={`/report/${report.id}`}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Nearby Reports to Support */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Nearby Reports</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Support your community by upvoting issues</p>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {nearbyReports.map((report) => (
            <div key={report.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(report.status)}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{report.description.substring(0, 100)}...</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {report.upvotes} upvotes
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpvote(report.id)}
                    className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm">Upvote</span>
                  </button>
                  <Link
                    to={`/report/${report.id}`}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
