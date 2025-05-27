import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Alert } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<{ token: string }>('/auth/login', {
        email: values.email,
        password: values.password,
      });
      login(response.data.token); // AuthContext handles token storage and user state
      message.success('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard or a protected route
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please check your credentials.');
      }
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 50 }}>
      <Title level={2} style={{ textAlign: 'center' }}>Login</Title>
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />}
      <Form
        form={form}
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark="optional"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your Email!' },
            { type: 'email', message: 'The input is not valid E-mail!' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Login
          </Button>
        </Form.Item>
        <div style={{ textAlign: 'center' }}>
          Don't have an account? <Link to="/register">Register now!</Link>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
