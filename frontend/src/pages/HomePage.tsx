import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const HomePage: React.FC = () => {
  return (
    <div>
      <Title level={2}>Home Page</Title>
      <p>Welcome to the Health Records Management App!</p>
    </div>
  );
};

export default HomePage;
