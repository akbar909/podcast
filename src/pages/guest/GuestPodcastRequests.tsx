import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PodcastRequest {
  _id: string;
  topic: string;
  description: string;
  preferredTimes: string[];
  status: 'pending' | 'matched' | 'scheduled' | 'completed' | 'declined';
  createdAt: string;
}

const GuestPodcastRequests: React.FC = () => {
  const [requests, setRequests] = useState<PodcastRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/guest/requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching podcast requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((request) =>
    request.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: PodcastRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'matched':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: PodcastRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'matched':
      case 'scheduled':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'declined':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Podcast Requests</h1>
          <p className="text-gray-600">Manage and track all your podcast appearance requests</p>
        </div>

        <Link
          to="/guest/requests/new"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          <span>Create New Request</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="relative w-full md:max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="py-3 px-6 font-medium">Topic</th>
                  <th className="py-3 px-6 font-medium">Description</th>
                  <th className="py-3 px-6 font-medium">Preferred Times</th>
                  <th className="py-3 px-6 font-medium">Status</th>
                  <th className="py-3 px-6 font-medium">Created</th>
                  <th className="py-3 px-6 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((request) => (
                  <motion.tr
                    key={request._id}
                    className="hover:bg-gray-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">{request.topic}</td>
                    <td className="py-4 px-6 text-gray-600 max-w-xs truncate">{request.description}</td>
                    <td className="py-4 px-6">
                      {request.preferredTimes.map((time, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                        >
                          {time}
                        </span>
                      ))}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          request.status
                        )}`}
                      >
                        <span className="mr-1">{getStatusIcon(request.status)}</span>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <button className="text-gray-600 hover:text-purple-600" title="Edit request">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="text-gray-600 hover:text-red-600" title="Delete request">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500">
            No podcast requests found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestPodcastRequests;
