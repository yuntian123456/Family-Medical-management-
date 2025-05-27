import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom'; // Outlet is no longer needed
import { useAuth } from '../contexts/AuthContext';
import { Spin, Layout } from 'antd'; // Import Spin for loading indicator

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, token } = useAuth();

  if (isLoading) {
    // Show a loading spinner while checking auth status
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </Layout>
    );
  }

  // Ensure we check for token as well, as user object might be set later
  // depending on how token validation/decoding is implemented.
  // For this implementation, AuthContext sets user after validating/decoding token.
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }
  
  // If there's a token but user is not yet set (e.g. async validation ongoing),
  // it might still be loading. However, our AuthContext sets isLoading=false after initial load.
  // So, if isLoading is false AND user is null but token exists, it implies an issue or logout.
  // But the primary check should be `user` for rendering protected content.
  // If `user` is available (meaning token was valid and decoded), allow access.
  if (user) {
    return <>{children}</>;
  }

  // Fallback if somehow isLoading is false, token exists, but user is null (e.g. failed decoding, expired)
  // This scenario should ideally be handled by AuthContext setting token to null.
  return <Navigate to="/login" replace />;

};

export default ProtectedRoute;
