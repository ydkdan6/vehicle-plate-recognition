import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { lazy, Suspense, useEffect } from 'react';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Login = lazy(() => import('./pages/auth/Login'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const UserDashboard = lazy(() => import('./pages/user/Dashboard'));
const VehicleRegistration = lazy(() => import('./pages/user/VehicleRegistration'));
const VehicleList = lazy(() => import('./pages/user/VehicleList'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const UserManagement = lazy(() => import('./pages/admin/UserManagement'));
const VehicleVerification = lazy(() => import('./pages/admin/VehicleVerification'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Components
import LoadingScreen from './components/common/LoadingScreen';

function App() {
  const { isAuthenticated, isAdmin, initializing, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          
          {/* Protected User Routes */}
          <Route
            element={
              <ProtectedRoute 
                isAuthenticated={isAuthenticated} 
                redirectPath="/login"
              >
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/vehicles/register" element={<VehicleRegistration />} />
            <Route path="/vehicles" element={<VehicleList />} />
          </Route>
          
          {/* Protected Admin Routes */}
          <Route
            element={
              <ProtectedRoute 
                isAuthenticated={isAuthenticated && isAdmin} 
                redirectPath="/login"
              >
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/verification" element={<VehicleVerification />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Route>
          
          {/* Redirects */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/onboarding"} replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  redirectPath: string;
  children: React.ReactNode;
}

function ProtectedRoute({ isAuthenticated, redirectPath, children }: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return <>{children}</>;
}

export default App;