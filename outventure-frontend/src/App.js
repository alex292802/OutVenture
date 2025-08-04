import React, { useState, useContext } from 'react';
import { Space, Button, Layout, Typography } from 'antd';
import Login from './components/Login';
import Register from './components/Register';
import SportSelection from './components/SportSelection';
import { AuthContext } from './context/AuthContext';
import 'leaflet/dist/leaflet.css';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const { user } = useContext(AuthContext);

  return (
    <Layout className="layout">
      <Header>
        <Title level={3} style={{ color: 'white', margin: '16px 0' }}>OutVenture</Title>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          {!user ? (
            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
              {showLogin ? (
                <Login />
              ) : (
                <Register />
              )}
              <Button onClick={() => setShowLogin(!showLogin)}>
                {showLogin ? "Inscription" : 'Vous avez déjà un compte ?'}
              </Button>
            </Space>
          ) : (
            <SportSelection />
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>OutVenture ©2024 Créé par Alexandre Berger</Footer>
    </Layout>
  );
}

export default App;