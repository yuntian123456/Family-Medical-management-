import React from 'react';
import { Typography } from 'antd';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph } = Typography;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      {user ? (
        <Paragraph>
          Welcome, {user.email}! This is your personalized dashboard.
        </Paragraph>
      ) : (
        <Paragraph>
          Loading user data...
        </Paragraph>
      )}
      <Paragraph>
        Here you will be able to manage your family members' health records, prescriptions, and health indicators.
      </Paragraph>
    </div>
  );
};

export default DashboardPage;
