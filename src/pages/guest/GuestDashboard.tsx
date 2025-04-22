import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users, Search, Calendar, PlusCircle, ArrowRight, BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Host {
  _id: string;
  name: string;
  topics: string[];
  bio: string;
  availability: string[];
}

interface Request {
  _id: string;
  topic: string;
  description: string;
  status: string;
  preferredTimes: string[];
}

const GuestDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Step 1: Get guest's podcast requests
        const res = await api.get('http://localhost:5000/api/guest/requests', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const requestList = res.data;
        setRequests(requestList);

        // Step 2: For each request, get matching hosts (can be optimized)
        const allMatches: Host[] = [];

        for (const req of requestList) {
          const matchRes = await api.get(`http://localhost:5000/api/guest/matching-hosts/${req._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          matchRes.data.forEach((h: Host) => {
            if (!allMatches.find(m => m._id === h._id)) {
              allMatches.push(h);
            }
          });
        }

        setHosts(allMatches);
      } catch (err: any) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const filteredHosts = hosts.filter(host =>
    host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    host.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Find and connect with podcast hosts for your next appearance</p>
        </div>

        <Link
          to="/guest/new-req"
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          <span>Create New Request</span>
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
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-500">Active Requests</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">
              {requests.filter(req => req.status === 'pending' || req.status === 'matched').length}
            </span>
            <Link to="/guest/new-req" className="text-purple-600 hover:text-purple-700 text-sm flex items-center">
              <span>View all</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
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
            <span className="text-2xl font-bold text-gray-900">
              {requests.filter(req => req.status === 'scheduled').length}
            </span>
            <Link to="/guest/schedule" className="text-teal-600 hover:text-teal-700 text-sm flex items-center">
              <span>View schedule</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
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
            <span className="ml-2 text-sm font-medium text-gray-500">Host Matches</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-gray-900">{hosts.length}</span>
            <Link to="/guest/matches" className="text-orange-600 hover:text-orange-700 text-sm flex items-center">
              <span>View matches</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Search and Hosts */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <div className="mb-6 flex items-center border rounded-md px-3 py-2 shadow-sm">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search hosts by name or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        {loading ? (
          <p className="text-gray-500">Loading hosts...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHosts.map((host) => (
              <div key={host._id} className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{host.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{host.bio}</p>
                <div className="mb-1">
                  <strong className="text-gray-700">Topics:</strong>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {host.topics.map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <strong className="text-gray-700">Availability:</strong>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {host.availability.map((slot, i) => (
                      <li key={i}>{slot}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestDashboard;
