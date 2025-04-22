import axios from 'axios';
import { Check, PlusCircle, Save, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AvailabilitySlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface TopicItem {
  id: string;
  name: string;
}

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12;
  const period = i < 12 ? 'AM' : 'PM';
  return `${hour}:00 ${period}`;
});

const HostAvailability: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [newTopic, setNewTopic] = useState('');
  
  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    startTime: '9:00 AM',
    endTime: '10:00 AM'
  });

  const [profileData, setProfileData] = useState<{ description: string; podcastName: string }>({
    description: '',
    podcastName: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const availabilityResponse = await axios.get('http://localhost:5000/api/host/availability', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const topicsResponse = await axios.get('http://localhost:5000/api/host/topics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const profileResponse = await axios.get('http://localhost:5000/api/host/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAvailabilitySlots(availabilityResponse.data);
        setTopics(topicsResponse.data);
        setProfileData({
          description: profileResponse.data.description || '',
          podcastName: profileResponse.data.podcastName || ''
        });
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const addAvailabilitySlot = async () => {
    const startIndex = timeSlots.indexOf(newSlot.startTime);
    const endIndex = timeSlots.indexOf(newSlot.endTime);
    
    if (startIndex >= endIndex) {
      alert('End time must be after start time');
      return;
    }

    try {
      const newId = Date.now().toString();
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/host/availability', {
        day: newSlot.day,
        startTime: newSlot.startTime,
        endTime: newSlot.endTime,
        description: profileData?.description || 'Available for podcast recording',
        podcastName: profileData?.podcastName || 'My Podcast',
        userId: user?.id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailabilitySlots([...availabilitySlots, { id: newId, ...newSlot }]);
    } catch (error) {
      console.error('Error adding availability slot', error);
    }
  };

  const removeAvailabilitySlot = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/host/availability/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailabilitySlots(availabilitySlots.filter(slot => slot.id !== id));
    } catch (error) {
      console.error('Error removing availability slot', error);
    }
  };

  const addTopic = async () => {
    if (newTopic.trim() && !topics.some(t => t.name.toLowerCase() === newTopic.trim().toLowerCase())) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/api/host/topics', {
          name: newTopic.trim(),
          userId: user?.id,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTopics([...topics, { id: response.data.id, name: newTopic.trim() }]);
        setNewTopic('');
      } catch (error) {
        console.error('Error adding topic', error);
      }
    }
  };

  const removeTopic = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/host/topics/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTopics(topics.filter(topic => topic.id !== id));
    } catch (error) {
      console.error('Error removing topic', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaveLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving availability', error);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage Availability</h1>
        <p className="text-gray-600">Set your availability and podcast topics for potential guests</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {success && (
            <div className="mb-8 bg-green-50 text-green-800 p-4 rounded-md text-sm flex items-center">
              <Check className="w-5 h-5 mr-2" />
              Availability settings saved successfully!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Availability Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Time Availability</h2>
              {/* Add New Slot */}
              <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Add Availability Slot</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="day" className="block text-xs text-gray-500 mb-1">
                      Day
                    </label>
                    <select
                      id="day"
                      value={newSlot.day}
                      onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="startTime" className="block text-xs text-gray-500 mb-1">
                      Start Time
                    </label>
                    <select
                      id="startTime"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="endTime" className="block text-xs text-gray-500 mb-1">
                      End Time
                    </label>
                    <select
                      id="endTime"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={addAvailabilitySlot}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  <span>Add Time Slot</span>
                </button>
              </div>
              {/* Current Availability Slots */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Current Availability</h3>
                {availabilitySlots.length > 0 ? (
                  <div className="space-y-4">
                    {availabilitySlots.map((slot) => (
                      <div key={slot.id} className="flex justify-between items-center border-b py-2">
                        <div className="text-sm text-gray-800">
                          {slot.day} - {slot.startTime} to {slot.endTime}
                        </div>
                        <button
                          onClick={() => removeAvailabilitySlot(slot.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No availability slots added yet.</div>
                )}
              </div>
            </div>
            
            {/* Topics Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Topics for Guests</h2>
              {/* Add New Topic */}
              <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Add Topic</h3>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter new topic"
                />
                <button
                  type="button"
                  onClick={addTopic}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  <span>Add Topic</span>
                </button>
              </div>
              {/* Current Topics */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Current Topics</h3>
                {topics.length > 0 ? (
                  <div className="space-y-4">
                    {topics.map((topic) => (
                      <div key={topic.id} className="flex justify-between items-center border-b py-2">
                        <div className="text-sm text-gray-800">{topic.name}</div>
                        <button
                          onClick={() => removeTopic(topic.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No topics added yet.</div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={saveLoading}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              {saveLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              <span>Save Availability</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default HostAvailability;
