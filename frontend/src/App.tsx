import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Typography, Button, Spin } from 'antd';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // Import DashboardPage
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import { useAuth } from './contexts/AuthContext'; // Import useAuth
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const { user, logout, isLoading, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  // Render a loading spinner centrally if auth state is loading
  if (isLoading) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="Loading authentication..." />
      </Layout>
    );
  }

  return (
    // Router is already provided by index.tsx's wrapping of App.
    // If not, or if this App component is used elsewhere without Router, it would need to be here.
    // For CRA setup, Router in index.tsx or App.tsx is fine. Let's assume it's fine.
    // No, Router should be here if App.tsx is the main routing hub.
    // Let's re-add Router here for clarity as App.tsx defines all routes.
    // It was removed in a previous step, that was a mistake.
    // Correction: The initial setup placed BrowserRouter in App.tsx. It should remain here.
    <Layout className="layout">
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo">
          <Link to={user ? "/dashboard" : "/"}>
            <Title level={3} style={{ color: 'white', margin: 0, lineHeight: '64px' }}>
              Health App
            </Title>
          </Link>
        </div>
        <Menu theme="dark" mode="horizontal" selectedKeys={[]} style={{ lineHeight: '64px', flexGrow: 1 }}>
          {!user && !token ? (
            <>
              <Menu.Item key="home">
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="login">
                <Link to="/login">Login</Link>
              </Menu.Item>
              <Menu.Item key="register">
                <Link to="/register">Register</Link>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="dashboard">
                <Link to="/dashboard">Dashboard</Link>
              </Menu.Item>
              {/* Add other authenticated links here */}
            </>
          )}
        </Menu>
        {user && token && (
          <Button type="primary" onClick={handleLogout} style={{ marginLeft: 'auto' }}>
            Logout ({user.email})
          </Button>
        )}
      </Header>
      <Content style={{ padding: '0 48px', marginTop: '24px' }}>
        <div className="site-layout-content" style={{ background: '#ffffff', padding: 24, borderRadius: 8 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            {/* Add other routes here, potentially protected */}
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', padding: '24px 0' }}>
        Health Records Management App ©{new Date().getFullYear()} Created by AI
      </Footer>
    </Layout>
  );
};


// Wrapper component to include Router if it's not in index.tsx
const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);


export default AppWrapper; // Export the wrapper
// Or if Router is definitely in index.tsx, just export App.
// For this project, let's stick to Router here as per original CRA structure.
// The `index.tsx` wraps App with AuthProvider, so AppWrapper (with Router) should be the default export.
