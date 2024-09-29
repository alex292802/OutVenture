import React, { useState } from 'react';
import { Card, Checkbox, Button, Typography, Input, Space } from 'antd';

const { Title } = Typography;

const sports = [
  'Hiking', 'Cycling', 'Running', 'Swimming', 'Kayaking',
  'Rock Climbing', 'Skiing', 'Snowboarding', 'Surfing', 'Yoga'
];

const SportSelection = ({ onSportsSelected }) => {
  const [selectedSports, setSelectedSports] = useState([]);
  const [location, setLocation] = useState('');

  const handleSportChange = (checkedValues) => {
    setSelectedSports(checkedValues);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = () => {
    onSportsSelected({ sports: selectedSports, location });
  };

  return (
    <Card title="Your Outdoor Preferences" style={{ width: 300, margin: '20px auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4}>Enter your location:</Title>
          <Input 
            placeholder="Enter your city or region" 
            value={location} 
            onChange={handleLocationChange}
          />
        </div>
        <div>
          <Title level={4}>Enter your time available:</Title>
          <Input 
            placeholder="Enter your time available" 
            value={location} 
            onChange={handleLocationChange}
          />
        </div>
        <div>
          <Title level={4}>Choose your preferred outdoor activities:</Title>
          <Checkbox.Group options={sports} onChange={handleSportChange} />
        </div>
        <Button 
          type="primary" 
          onClick={handleSubmit} 
          style={{ width: '100%' }}
          disabled={selectedSports.length === 0 || !location}
        >
          Save Preferences
        </Button>
      </Space>
    </Card>
  );
};

export default SportSelection;