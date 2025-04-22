import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import GuestDashboard from './pages/guest/GuestDashboard';
import GuestNewRequest from './components/GuestRequestPage';
import GuestPodcastRequests from './pages/guest/GuestPodcastRequests';
import GuestProfile from './pages/guest/GuestProfile';
import HostAvailability from './pages/host/HostAvailability';
import HostDashboard from './pages/host/HostDashboard';
import HostProfile from './pages/host/HostProfile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Guest Routes */}
          <Route path="/guest" element={
            <ProtectedRoute userType="guest">
              <MainLayout userType="guest" />
            </ProtectedRoute>
          }>
            <Route index element={<GuestDashboard />} />
            <Route path="profile" element={<GuestProfile />} />
            <Route path="requests" element={<GuestPodcastRequests />} />
            <Route path="new-req" element={<GuestNewRequest />} />
          </Route>
          
          {/* Host Routes */}
          <Route path="/host" element={
            <ProtectedRoute userType="host">
              <MainLayout userType="host" />
            </ProtectedRoute>
          }>
            <Route index element={<HostDashboard />} />
            <Route path="profile" element={<HostProfile />} />
            <Route path="availability" element={<HostAvailability />} />
          </Route>
          
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;