import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, AtSign, Briefcase, MapPin, Save } from 'lucide-react';

interface ProfileData {
  bio: string;
  expertise: string[];
  location: string;
  social: {
    twitter: string;
    linkedin: string;
    website: string;
  };
  profilePicture: string;
}

const GuestProfile: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    bio: '',
    expertise: [],
    location: '',
    social: {
      twitter: '',
      linkedin: '',
      website: ''
    },
    profilePicture: ''
  });
  
  const [newExpertise, setNewExpertise] = useState('');
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For demo purposes, using mock data
    setTimeout(() => {
      setProfileData({
        bio: 'Digital marketing specialist with 5+ years of experience helping SaaS companies grow their online presence.',
        expertise: ['Digital Marketing', 'SEO', 'Content Strategy', 'Social Media'],
        location: 'San Francisco, CA',
        social: {
          twitter: 'twitter_handle',
          linkedin: 'linkedin_profile',
          website: 'example.com'
        },
        profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      });
      setLoading(false);
    }, 1000);
  }, []);
  
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
  
  const addExpertise = () => {
    if (newExpertise.trim() && !profileData.expertise.includes(newExpertise.trim())) {
      setProfileData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };
  
  const removeExpertise = (expertiseToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== expertiseToRemove)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaveLoading(true);
      
      // In a real app, this would be an API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving profile', error);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and profile settings</p>
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
                      <span className="text-gray-600">Guest Account</span>
                    </div>
                    
                    <div className="flex items-center text-sm mb-4">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">{profileData.location || 'Location not set'}</span>
                    </div>
                    
                    <div className="flex items-start text-sm">
                      <Briefcase className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <span className="text-gray-600">{profileData.expertise.join(', ') || 'No expertise specified'}</span>
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
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Tell podcast hosts about yourself..."
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expertise & Topics
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profileData.expertise.map((exp, index) => (
                      <span 
                        key={index} 
                        className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {exp}
                        <button 
                          type="button"
                          onClick={() => removeExpertise(exp)}
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
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Add a topic..."
                    />
                    <button
                      type="button"
                      onClick={addExpertise}
                      className="bg-purple-600 text-white px-4 py-2 rounded-r-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      Add
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={profileData.location}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="City, Country"
                  />
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
                        Personal Website
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

export default GuestProfile;