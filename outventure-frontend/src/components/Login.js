import React, { useContext, useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message, Space } from 'antd';
import { AuthContext } from '../context/AuthContext';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false); 
  const { login } = useContext(AuthContext);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values);
      message.success('Connexion réussie');
      onLoginSuccess();
    } catch (error) {
      message.error('Échec de la connexion, veuillez vérifier vos identifiants'); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Card title="Connexion" style={{ width: 300, margin: '20px auto' }}>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Veuillez saisir votre nom d'utilisateur" }]}
        >
          <Input 
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Nom d'utilisateur" 
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Veuillez saisir votre mot de passe" }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Mot de passe"
          />
        </Form.Item>
        <Form.Item>
          <Space direction="vertical">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Se souvenir de moi</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Mot de passe oublié
            </a>
          </Space>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%' }} loading={loading}>
            Se connecter
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Login;