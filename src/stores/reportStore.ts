import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Report } from '../data/mockData';

interface ReportState {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'upvotes'>) => void;
  updateReportStatus: (id: number, status: Report['status']) => void;
  upvoteReport: (id: number) => void;
  getUserReports: (userId: number) => Report[];
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [
        {
          id: 1,
          title: 'Pothole on Main Street',
          description: 'Huge pothole near bus stop causing traffic issues',
          location: { lat: 28.6448, lng: 77.2167, address: 'Main Street, Delhi' },
          status: 'Reported',
          createdBy: 1,
          createdAt: new Date().toISOString(),
          upvotes: 5,
          category: 'Road',
        },
        {
          id: 2,
          title: 'Broken Street Light',
          description: 'Street light not working for 3 days, dark area',
          location: { lat: 28.6548, lng: 77.2267, address: 'Park Road, Delhi' },
          status: 'In Progress',
          createdBy: 1,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          upvotes: 3,
          category: 'Electricity',
        },
        {
          id: 3,
          title: 'Water Leak',
          description: 'Pipe burst causing water accumulation on sidewalk',
          location: { lat: 28.6348, lng: 77.2067, address: 'MG Road, Delhi' },
          status: 'Resolved',
          createdBy: 1,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          upvotes: 7,
          category: 'Water',
        },
        {
          id: 4,
          title: 'Illegal Dumping',
          description: 'Construction waste dumped on public land',
          location: { lat: 28.6248, lng: 77.1967, address: 'Sector 15, Delhi' },
          status: 'Verified',
          createdBy: 2,
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          upvotes: 12,
          category: 'Waste',
        },
      ],
      addReport: (reportData) => {
        const newReport: Report = {
          ...reportData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          upvotes: 0,
        };
        set((state) => ({ reports: [...state.reports, newReport] }));
      },
      updateReportStatus: (id, status) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id ? { ...report, status } : report
          ),
        }));
      },
      upvoteReport: (id) => {
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id ? { ...report, upvotes: report.upvotes + 1 } : report
          ),
        }));
      },
      getUserReports: (userId) => get().reports.filter((report) => report.createdBy === userId),
    }),
    {
      name: 'report-storage',
    }
  )
);
