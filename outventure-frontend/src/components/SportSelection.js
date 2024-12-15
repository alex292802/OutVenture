import React, { useState } from 'react';
import { Card, Checkbox, Button, Typography, Input, Space, DatePicker, TimePicker } from 'antd';
import moment from 'moment'; 
import axios from 'axios';

const { Title } = Typography;

const sports = [
  'Hiking', 'Cycling', 'Running', 'Swimming', 'Kayaking',
  'Rock Climbing', 'Skiing', 'Snowboarding', 'Surfing', 'Yoga'
];

const SportSelection = () => {
  const [selectedSports, setSelectedSports] = useState([]);
  const [location, setLocation] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('')
  const [date, setDate] = useState(null);
  const [initialTime, setInitialTime] = useState(null); 

  const handleSportChange = (checkedValues) => {
    setSelectedSports(checkedValues);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleTimeChange = (time) => {
    setInitialTime(time);
  };

  const disablePastDates = (current) => {
    return current && (current < moment().startOf('day') || current > moment().add(7, 'days'));
  };

  const handleSubmit = async () => {
    const preferences = {
      sports: selectedSports,
      location: location,
      time_available: timeAvailable,
      date: date ? date.format('YYYY-MM-DD') : null,
      time: initialTime ? initialTime.format('HH:mm') : null,
    };
    console.log(preferences)
  };

  return (
    <Card title="Your Outdoor Preferences" style={{ width: 300, margin: '20px auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4}>Enter your location:</Title>
          <Input 
            placeholder="Enter your city or region" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <Title level={4}>Select a day:</Title>
          <DatePicker 
            onChange={handleDateChange} 
            style={{ width: '100%' }} 
            disabledDate={disablePastDates}
          />
        </div>
        <div>
          <Title level={4}>Select a starting hour:</Title>
          <TimePicker onChange={handleTimeChange} format="HH:mm" style={{ width: '100%' }} />
        </div>
        <div>
        <Title level={4}>Enter your time available:</Title>
        <Input 
          placeholder="Enter your time available" 
          value={location} 
          onChange={(e) => setTimeAvailable(e.target.value)}
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
          disabled={selectedSports.length === 0 || !location || !date || !timeAvailable || !initialTime}
        >
          Save Preferences
        </Button>
      </Space>
    </Card>
  );
};

export default SportSelection;