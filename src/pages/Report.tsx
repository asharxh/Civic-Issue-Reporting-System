import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useReportStore } from '../stores/reportStore';
import { categories } from '../data/mockData';

interface ReportForm {
  title: string;
  description: string;
  location: string;
  category: string;
}

const Report = () => {
  const { user } = useAuth();
  const addReport = useReportStore((state) => state.addReport);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ReportForm>();
  const [file, setFile] = useState<File | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<{ category: string; priority: string } | null>(null);
  const navigate = useNavigate();

  const description = watch('description');

  // Mock AI classification
  const handleAiClassify = () => {
    if (description) {
      // Mock AI response
      const priorities = ['Low', 'Medium', 'High'];
      setAiSuggestion({
        category: categories[Math.floor(Math.random() * categories.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
      });
    }
  };

  const onSubmit = (data: ReportForm) => {
    if (!user) {
      toast.error('Please login to submit a report');
      return;
    }

    // Mock location - in real app, use geolocation or map picker
    const mockLocation = { lat: 28.6448 + Math.random() * 0.1, lng: 77.2167 + Math.random() * 0.1 };

    addReport({
      title: data.title,
      description: data.description,
      location: mockLocation,
      status: 'Reported',
      createdBy: user.id,
      category: data.category,
      image: file ? URL.createObjectURL(file) : undefined,
    });

    toast.success('Report submitted successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Report New Issue</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Brief title of the issue"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Detailed description of the issue"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          <button
            type="button"
            onClick={handleAiClassify}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Get AI Suggestions
          </button>
          {aiSuggestion && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Suggested Category: {aiSuggestion.category}
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Priority: {aiSuggestion.priority}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <input
              {...register('location', { required: 'Location is required' })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter location or use map"
            />
          </div>
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Upload Photos/Videos
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Click to upload or drag and drop
            </label>
            {file && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{file.name}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default Report;
