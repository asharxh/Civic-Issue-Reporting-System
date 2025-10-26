export interface Report {
  id: number;
  title: string;
  description: string;
  location: { lat: number; lng: number; address?: string };
  status: 'Reported' | 'Verified' | 'In Progress' | 'Resolved';
  image?: string;
  createdBy: number;
  createdAt: string;
  upvotes: number;
  category: string;
}

export const mockReports: Report[] = [
  {
    id: 1,
    title: 'Pothole on Main Street',
    description: 'Huge pothole near bus stop causing traffic issues',
    location: { lat: 28.6448, lng: 77.2167, address: 'Main Street, Delhi' },
    status: 'Reported',
    createdBy: 1,
    createdAt: '2025-01-10T12:00:00Z',
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
    createdAt: '2025-01-09T10:00:00Z',
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
    createdAt: '2025-01-08T08:00:00Z',
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
    createdAt: '2025-01-07T15:00:00Z',
    upvotes: 12,
    category: 'Waste',
  },
];

export const categories = ['Road', 'Electricity', 'Water', 'Waste', 'Sanitation', 'Traffic', 'Other'];
