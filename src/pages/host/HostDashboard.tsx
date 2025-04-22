import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MessageSquare, PlusCircle, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface GuestRequest {
  id: string;
  guestName: string;
  topic: string;
  description: string;
  preferredTimes: string[];
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

const HostDashboard: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<GuestRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch guest requests from the backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/host/all-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Update request status
  const updateRequestStatus = async (requestId: string, status: 'accepted' | 'declined') => {
    try {
      const token = localStorage.getItem('token');
      if (status === 'declined') {
        await axios.post(
          `http://localhost:5000/api/guest/host-cancel-request/${requestId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `http://localhost:5000/api/host/accept-request/${requestId}`,
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setRequests(prev => prev.map(request => 
        (request._id === requestId ? { ...request, status } : request)
      ));
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const pendingRequests = requests.filter(request => request.status === 'pending');
  const acceptedRequests = requests.filter(request => request.status === 'accepted');

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Manage your podcast availability and guest requests</p>
        </div>
        
        <Link
          to="/host/availability"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          <span>Update Availability</span>
        </Link>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-md bg-purple-100">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-500">Pending Requests</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">{pendingRequests.length}</span>
            <a href="#pending-requests" className="text-purple-600 hover:text-purple-700 text-sm flex items-center">
              <span>View all</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-md bg-teal-100">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-500">Upcoming Podcasts</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">{acceptedRequests.length}</span>
            <a href="#accepted-requests" className="text-teal-600 hover:text-teal-700 text-sm flex items-center">
              <span>View schedule</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
          whileHover={{ y: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-md bg-orange-100">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-500">Total Guests</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">12</span>
            <Link to="/host/guests" className="text-orange-600 hover:text-orange-700 text-sm flex items-center">
              <span>View all</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Pending Requests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-8" id="pending-requests">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Pending Guest Requests</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : pendingRequests.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {pendingRequests.map((request) => (
              <motion.div
                key={request.id}
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{request.topic}</h3>
                    <p className="text-gray-600 text-sm">From: {request.guestName} • {new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <button
                      onClick={() => updateRequestStatus(request._id, 'declined')}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => updateRequestStatus(request._id, 'accepted')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Accept
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{request.description}</p>
                
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Preferred Times</div>
                  <div className="flex flex-wrap gap-2">
                    {request.preferredTimes.map((time, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-4 text-center text-gray-500">No pending requests.</div>
        )}
      </div>
    </div>
  );
};

export default HostDashboard;
