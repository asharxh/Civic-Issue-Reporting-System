import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ThumbsUp, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReportStore } from '../stores/reportStore';
import type { Report } from '../data/mockData';

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { reports, upvoteReport } = useReportStore();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (id) {
      const foundReport = reports.find(r => r.id === parseInt(id));
      setReport(foundReport || null);
    }
  }, [id, reports]);

  const handleUpvote = () => {
    if (report && user) {
      upvoteReport(report.id);
      setReport({ ...report, upvotes: report.upvotes + 1 });
    }
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

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Report Not Found</h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Mock timeline based on status
  const timeline = [
    {
      date: new Date(report.createdAt).toLocaleDateString(),
      event: `Reported by ${user?.id === report.createdBy ? 'you' : 'a citizen'}`,
      status: 'Reported' as const
    },
    ...(report.status !== 'Reported' ? [{
      date: new Date(Date.parse(report.createdAt) + 86400000).toLocaleDateString(),
      event: 'Verified by community',
      status: 'Verified' as const
    }] : []),
    ...(report.status === 'In Progress' || report.status === 'Resolved' ? [{
      date: new Date(Date.parse(report.createdAt) + 172800000).toLocaleDateString(),
      event: 'Assigned to maintenance team',
      status: 'In Progress' as const
    }] : []),
    ...(report.status === 'Resolved' ? [{
      date: new Date(Date.parse(report.createdAt) + 259200000).toLocaleDateString(),
      event: 'Issue resolved',
      status: 'Resolved' as const
    }] : []),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          ← Back to Home
        </Link>
        <button
          onClick={handleUpvote}
          disabled={!user}
          className={`flex items-center space-x-1 ${
            user
              ? 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          <ThumbsUp className="h-5 w-5" />
          <span>Upvote ({report.upvotes})</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(report.status)}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {report.title}
            </h1>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
            {report.status}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4">{report.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-2" />
            {report.location.address || 'Location provided'}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
            Category: {report.category}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-2" />
            Created: {new Date(report.createdAt).toLocaleDateString()}
          </div>
        </div>

        {report.image && (
          <div className="mb-6">
            <img
              src={report.image}
              alt="Issue evidence"
              className="w-full max-w-md h-48 object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Status Timeline</h2>
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.date}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
