import React, { useContext, useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false); // To manage loading state
  const { login } = useContext(AuthContext);
  const onFinish = (values) => {
    console.log('Received values of form: ', credentials);
  };

  const handleSubmit = async (values) => {
    setLoading(true); // Set loading to true when starting the request
    try {
      // Call the login function from AuthContext with the form values
      await login(values);
      message.success('Login successful!'); // Show success message
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please check your credentials.'); // Show error message
    } finally {
      setLoading(false); // Reset loading state
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
            alue={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
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
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
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
          <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;