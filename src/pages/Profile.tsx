import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, ThumbsUp, Clock, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReportStore } from '../stores/reportStore';
import type { Report } from '../data/mockData';

const Profile = () => {
  const { user } = useAuth();
  const { getUserReports } = useReportStore();
  const [userReports, setUserReports] = useState<Report[]>([]);

  useEffect(() => {
    if (user) {
      const reports = getUserReports(user.id);
      setUserReports(reports);
    }
  }, [user, getUserReports]);

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

  if (!user) {
    return <div>Please login to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Profile</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 capitalize">{user.role} Reporter</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{userReports.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Reports Submitted</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {userReports.filter(r => r.status === 'Resolved').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Resolved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {userReports.filter(r => r.status === 'In Progress').length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">In Progress</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {userReports.reduce((sum, r) => sum + r.upvotes, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Total Upvotes</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Reports</h2>
        <div className="space-y-4">
          {userReports.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No reports yet. Start by reporting an issue!</p>
              <Link
                to="/report"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Report New Issue
              </Link>
            </div>
          ) : (
            userReports.map((report) => (
              <div key={report.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(report.status)}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {report.title}
                    </h3>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{report.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {report.location.address || 'Location provided'}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{report.category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {report.upvotes}
                    </div>
                    <Link
                      to={`/report/${report.id}`}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
