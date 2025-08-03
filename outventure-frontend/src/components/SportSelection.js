import React, { useState } from 'react';
import { Card, Checkbox, Button, Typography, Input, Space, DatePicker, Radio } from 'antd';
import moment from 'moment';
import MapComponent from './MapComponent';


const { Title } = Typography;

// TODO: this should be sent by the backend
const sports = [
  'Randonnée', 'Vélo', 'Course à pied', 'Natation', 'Kayak',
  'Escalade', 'Ski', 'Snowboard', 'Surf', 'Yoga'
];

const timeOptions = [
  { label: 'Matin', value: 'morning' },
  { label: 'Après-midi', value: 'afternoon' },
  { label: 'Toute la journée', value: 'all_day' },
];

const SportSelection = () => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(null);
  const [timeAvailable, setTimeAvailable] = useState(null);
  const [selectedSports, setSelectedSports] = useState([]);

  const [showMap, setShowMap] = useState(false);
  const [preferences, setPreferences] = useState(null);

  const handleSportChange = (checkedValues) => {
    setSelectedSports(checkedValues);
  };

  const handleDateChange = (date) => {
    setDate(date);
  };

  const handleTimeAvailableChange = (e) => {
    setTimeAvailable(e.target.value);
  };

  const disablePastDates = (current) => {
    return current && (current < moment().startOf('day') || current > moment().add(7, 'days'));
  };

  const handleSubmit = async () => {
    const userPreferences = {
      sports: selectedSports,
      location: location,
      time_available: timeAvailable,
      date: date ? date.format('YYYY-MM-DD') : null,
    };
    setPreferences(userPreferences);
    setShowMap(true);
    // TODO: Send preferences to backend (save them for this user)
  };

  const handleBackToForm = () => {
    setShowMap(false);
    setPreferences(null);
  };

  if (showMap && preferences) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <Button 
          onClick={handleBackToForm} 
          style={{ marginBottom: '16px' }}
        >
          ← Retour aux préférences
        </Button>
        <MapComponent preferences={preferences} center={[45.7640, 4.8357]}/>
      </div>
    );
  }

  return (
    <Card title="Quelle sera votre prochaine aventure ?" style={{ width: 400, margin: '20px auto' }}>
      <Space direction="vertical" size="large">
        <div>
          <Title level={4}>Entrez votre localisation :</Title>
          <Input 
            placeholder="Entrez votre ville ou région" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <Title level={4}>Sélectionnez un jour :</Title>
          <DatePicker 
            onChange={handleDateChange} 
            style={{ width: '100%' }} 
            disabledDate={disablePastDates}
          />
        </div>
        <div>
          <Title level={4}>Sélectionnez votre plage horaire :</Title>
          <Radio.Group onChange={handleTimeAvailableChange} value={timeAvailable}>
            {timeOptions.map(option => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
        <div>
          <Title level={4}>Choisissez vos activités préférées :</Title>
          <Checkbox.Group options={sports} onChange={handleSportChange} />
        </div>
        <Button 
          type="primary" 
          onClick={handleSubmit} 
          style={{ width: '100%' }}
          disabled={selectedSports.length === 0 || !location || !date || !timeAvailable}
        >
          Propose moi une aventure
        </Button>
      </Space>
    </Card>
  );
};

export default SportSelection;