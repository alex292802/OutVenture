import React, { useContext, useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false); 
  const { login } = useContext(AuthContext);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values);
      onLoginSuccess();
    } catch (error) {
      message.error('Login failed. Please check your credentials.'); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Card title="Login" style={{ width: 300, margin: '20px auto' }}>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input 
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username" 
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }} loading={loading}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;