import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Button, Spin } from 'antd';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const { user, logout, isLoading, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="Loading authentication..." />
      </Layout>
    );
  }

  // Determine current selected keys for the menu
  const currentPath = location.pathname;
  let selectedKeys: string[] = [];
  if (currentPath === '/') selectedKeys = ['/'];
  else if (currentPath.startsWith('/dashboard')) selectedKeys = ['/dashboard'];
  else if (currentPath.startsWith('/login')) selectedKeys = ['/login'];
  else if (currentPath.startsWith('/register')) selectedKeys = ['/register'];
  // Add more conditions if there are other top-level menu items

  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo">
          <Link to={user ? "/dashboard" : "/"}>
            <Title level={3} style={{ color: 'white', margin: 0, lineHeight: '64px' }}>
              Health App
            </Title>
          </Link>
        </div>
        <Menu 
          theme="dark" 
          mode="horizontal" 
          selectedKeys={selectedKeys} // Dynamically set selected keys
          style={{ lineHeight: '64px', flexGrow: 1 }}
        >
          {!user && !token ? (
            <>
              <Menu.Item key="/"> {/* Key matches path */}
                <Link to="/">Home</Link>
              </Menu.Item>
              <Menu.Item key="/login"> {/* Key matches path */}
                <Link to="/login">Login</Link>
              </Menu.Item>
              <Menu.Item key="/register"> {/* Key matches path */}
                <Link to="/register">Register</Link>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="/dashboard"> {/* Key matches path */}
                <Link to="/dashboard">Dashboard</Link>
              </Menu.Item>
              {/* Add other authenticated links here, ensure keys match paths */}
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
              path="/dashboard/*" // Allow nested routes for dashboard
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

// AppWrapper provides the Router context to the App component.
const AppWrapper: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
