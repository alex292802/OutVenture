import React, { useState } from 'react';
import { Space, Button, Layout, Typography } from 'antd';
import Login from './components/Login';
import Register from './components/Register';
import SportSelection from './components/SportSelection';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Layout className="layout">
      <Header>
        <Title level={3} style={{ color: 'white', margin: '16px 0' }}>OutVenture</Title>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          {!isLoggedIn ? (
            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
              {showLogin ? (
                <Login onLoginSuccess={handleLogin} />
              ) : (
                <Register onRegisterSuccess={handleLogin} />
              )}
              <Button onClick={() => setShowLogin(!showLogin)}>
                {showLogin ? 'Need to register?' : 'Already have an account?'}
              </Button>
            </Space>
          ) : (
            <SportSelection />
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>OutVenture ©2024 Created by Alexandre Berger</Footer>
    </Layout>
  );
}

export default App;