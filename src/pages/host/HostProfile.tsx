import { AtSign, Briefcase, MapPin, Mic, Save, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileData {
  bio: string;
  podcastName: string;
  description: string;
  topics: string[];
 
  social: {
    twitter: string;
    linkedin: string;
    website: string;
  };
  profilePicture: string;
}

const HostProfile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    bio: '',
    podcastName: '',
    description: '',
    topics: [],
    social: {
      twitter: '',
      linkedin: '',
      website: ''
    },
    profilePicture: ''
  });
  
  const [newTopic, setNewTopic] = useState('');
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/host/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof ProfileData],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const addTopic = () => {
    if (newTopic.trim() && !profileData.topics.includes(newTopic.trim())) {
      setProfileData(prev => ({
        ...prev,
        topics: [...prev.topics, newTopic.trim()]
      }));
      setNewTopic('');
    }
  };
  
  const removeTopic = (topicToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      topics: prev.topics.filter(topic => topic !== topicToRemove)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaveLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/host/profile', {
        method: 'POST', // Changed from PUT to POST
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
        <p className="text-gray-600">Manage your podcast information and profile settings</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="md:flex">
            {/* Profile Sidebar */}
            <div className="md:w-1/3 bg-gray-50 p-6 border-b md:border-b-0 md:border-r border-gray-100">
              <div className="flex flex-col items-center">
                <div className="mb-4 relative">
                  {profileData.profilePicture ? (
                    <img 
                      src={profileData.profilePicture} 
                      alt={user?.name || 'User'} 
                      className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-12 h-12 text-purple-600" />
                    </div>
                  )}
                  
                  <label 
                    htmlFor="profile-picture" 
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-1 rounded-full cursor-pointer hover:bg-purple-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <input 
                      id="profile-picture" 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                    />
                  </label>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600 flex items-center text-sm mt-1">
                  <AtSign className="w-4 h-4 mr-1" />
                  {user?.email}
                </p>
                
                <div className="mt-6 w-full">
                  <div className="text-sm font-medium text-gray-500 mb-2">Account Information</div>
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <div className="flex items-center text-sm mb-4">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Host Account</span>
                    </div>
                    
                    <div className="flex items-center text-sm mb-4">
                      <Mic className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{profileData.podcastName || 'No podcast name set'}</span>
                    </div>
                    
                   
                    
                    <div className="flex items-start text-sm">
                      <Briefcase className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <span className="text-gray-600">{profileData.topics?.join(', ') || 'No topics specified'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile Form */}
            <div className="md:w-2/3 p-6">
              <form onSubmit={handleSubmit}>
                {success && (
                  <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Profile updated successfully!
                  </div>
                )}
                
                <div className="mb-6">
                  <label htmlFor="podcastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Podcast Name
                  </label>
                  <input
                    id="podcastName"
                    name="podcastName"
                    type="text"
                    value={profileData.podcastName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Your podcast name"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Tell guests about yourself..."
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Podcast Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={profileData.description}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Describe your podcast and what it's about..."
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Topics
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profileData.topics.map((topic, index) => (
                      <span 
                        key={index} 
                        className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {topic}
                        <button 
                          type="button"
                          onClick={() => removeTopic(topic)}
                          className="ml-1 text-purple-500 hover:text-purple-700 focus:outline-none"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Add a topic..."
                    />
                    <button
                      type="button"
                      onClick={addTopic}
                      className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                
                <div className="mb-6">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Social Profiles
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="twitter" className="block text-sm text-gray-600 mb-1">
                        Twitter
                      </label>
                      <input
                        id="twitter"
                        name="social.twitter"
                        type="text"
                        value={profileData.social.twitter}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Twitter username"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="linkedin" className="block text-sm text-gray-600 mb-1">
                        LinkedIn
                      </label>
                      <input
                        id="linkedin"
                        name="social.linkedin"
                        type="text"
                        value={profileData.social.linkedin}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="LinkedIn profile URL or username"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="website" className="block text-sm text-gray-600 mb-1">
                        Podcast Website
                      </label>
                      <input
                        id="website"
                        name="social.website"
                        type="text"
                        value={profileData.social.website}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Website URL"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="flex items-center justify-center bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors w-full md:w-auto"
                  >
                    {saveLoading ? (
                      <>
                        <div className="mr-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostProfile;