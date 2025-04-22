import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Users, Calendar, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Mic className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-semibold text-gray-900">PodConnect</span>
          </div>
          
          <div className="space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
              Log in
            </Link>
            <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-700 to-purple-900 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Connect Podcast Hosts & Guests
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-10 text-purple-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Find the perfect match for your next podcast episode or share your expertise as a guest
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link 
                to="/register?type=host" 
                className="bg-white text-purple-700 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Join as Host
              </Link>
              
              <Link 
                to="/register?type=guest" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Join as Guest
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Create Your Profile</h3>
              <p className="text-gray-600">
                Sign up as a podcast host or guest and create your profile with your expertise, interests, and requirements.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Set Availability</h3>
              <p className="text-gray-600">
                Hosts can set their availability and topics they're interested in discussing. Guests specify their needs.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <Mic className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Connect & Record</h3>
              <p className="text-gray-600">
                Match with the perfect host or guest, schedule your podcast session, and create amazing content together.
              </p>
            </motion.div>
          </div>
          
          <div className="text-center mt-16">
            <Link 
              to="/register" 
              className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700"
            >
              <span>Get started today</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Mic className="w-6 h-6 text-purple-600 mr-2" />
              <span className="text-gray-800 font-medium">PodConnect</span>
            </div>
            
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} PodConnect. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;