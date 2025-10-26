import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Report {
  id: number;
  title: string;
  description: string;
  location: { lat: number; lng: number };
  status: 'Reported' | 'Verified' | 'In Progress' | 'Resolved';
  image?: string;
  createdBy: number;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Mock data
    const mockReports: Report[] = [
      {
        id: 1,
        title: 'Pothole on Main Street',
        description: 'Huge pothole near bus stop',
        location: { lat: 28.6448, lng: 77.2167 },
        status: 'Reported',
        createdBy: 1,
        createdAt: '2025-01-10T12:00:00Z',
      },
      {
        id: 2,
        title: 'Broken Street Light',
        description: 'Street light not working for 3 days',
        location: { lat: 28.6548, lng: 77.2267 },
        status: 'In Progress',
        createdBy: 1,
        createdAt: '2025-01-09T10:00:00Z',
      },
      {
        id: 3,
        title: 'Water Leak',
        description: 'Pipe burst causing water accumulation',
        location: { lat: 28.6348, lng: 77.2067 },
        status: 'Resolved',
        createdBy: 1,
        createdAt: '2025-01-08T08:00:00Z',
      },
    ];
    setReports(mockReports);
    setFilteredReports(mockReports);
  }, [user, navigate]);

  useEffect(() => {
    let filtered = reports;
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    if (typeFilter !== 'all') {
      // Mock type filter - in real app, reports would have types
      filtered = filtered.filter(report => report.title.toLowerCase().includes(typeFilter));
    }
    setFilteredReports(filtered);
  }, [reports, statusFilter, typeFilter]);

  const updateStatus = (id: number, newStatus: Report['status']) => {
    setReports(prev => prev.map(report =>
      report.id === id ? { ...report, status: newStatus } : report
    ));
  };

  const totalReports = reports.length;
  const activeReports = reports.filter(r => r.status !== 'Resolved').length;
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
  const avgResolutionTime = 5; // Mock data

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage civic issue reports</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalReports}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Reports</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeReports}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{resolvedReports}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Resolution Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgResolutionTime} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">All Status</option>
                <option value="Reported">Reported</option>
                <option value="Verified">Verified</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="all">All Types</option>
                <option value="pothole">Pothole</option>
                <option value="light">Street Light</option>
                <option value="water">Water</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Reports</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{report.description.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        report.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'Verified' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={report.status}
                        onChange={(e) => updateStatus(report.id, e.target.value as Report['status'])}
                        className="border border-gray-300 rounded px-2 py-1 text-xs dark:bg-gray-700 dark:border-gray-600"
                      >
                        <option value="Reported">Reported</option>
                        <option value="Verified">Verified</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
