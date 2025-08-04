import React, { useState } from 'react';
import { Select, message, Card, Checkbox, Button, Typography, Input, Space, DatePicker, TimePicker} from 'antd';
import moment from 'moment';
import axios from "axios";


// TODO: add cleaning of location


const { Title } = Typography;

const sports = [
  {
    label: "Randonnée",
    value: "Randonnée",
  },
  {
    label: 'Vélo',
    value: 'Vélo',
  },
  {
    label: 'Course à pied',
    value: 'Course à pied',
  },
  {
    label: 'Nage',
    value: 'Nage',
  },
  {
    label: 'Kayak',
    value: 'Kayak',
  },
  {
    label: 'Escalade',
    value: 'Escalade',
  },
  {
    label: 'Surf',
    value: 'Surf',
  },
];

const durations = [
  {
    label: "Moins d'une heure",
  },
  {
    label: 'Une ou deux heures',
  },
  {
    label: 'Deux ou trois heures',
  },
  {
    label: 'Une demi-journée',
  },
  {
    label: 'Une journée',
  },
];

const SpotSearch = () => {
  const [selectedSports, setSelectedSports] = useState([]);
  const [location, setLocation] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('')
  const [date, setDate] = useState(null);
  const [initialTime, setInitialTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCityValidated, setIsCityValidated] = useState(false);

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

  const handleSubmitLocalisation = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
          `/city/?city=${location}`
      );
      const validatedCity = response["data"]["validated_city"]
      setIsCityValidated(true)
      setLocation(validatedCity)
    }
    catch(e){message.error("La localisation entrée n'est pas valide")}
    finally {
      setLoading(false);
    }
  }

  return (
    <Card style={{ width: 300, margin: '20px auto' }}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <div>
          <Title level={4}>Saisissez votre localisation</Title>
          <Input
              placeholder="Entrer une ville ou un village"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading || isCityValidated}
          />
        </div>
        <Button
            type="primary"
            onClick={handleSubmitLocalisation}
            style={{width: '100%'}}
            disabled={!location || loading}
        >
          Valider ma localisation
        </Button>
        <div>
          <Title level={4}>Choisissez un jour</Title>
          <DatePicker
              onChange={(date) => {
                setDate(date)
              }}
              style={{width: '100%'}}
              disabledDate={disablePastDates}
              placeholder="Sélectionner jour"
          />
        </div>
        <div>
          <Title level={4}>Choisissez une heure</Title>
          <TimePicker
              onChange={(time) => {
                setInitialTime(time)
              }}
              format="HH:mm"
              style={{width: '100%'}}
              placeholder="Sélectionner heure"
          />
        </div>
        <div>
          <Title level={4}>Choisissez une durée</Title>
          <Select
              placeholder="Sélectionner durée"
              options={durations}
              style={{width: '100%'}}
              onChange={(e) => setTimeAvailable(e.target.value)}
          />
        </div>
        <div>
          <Title level={4}>Choisissez une ou plusieurs activités</Title>
          <Checkbox.Group options={sports} onChange={(checkedValues) => {
            setSelectedSports(checkedValues)
          }}/>
        </div>
        <Button
            type="primary"
            onClick={handleSubmit}
            style={{width: '100%'}}
            disabled={selectedSports.length === 0 || !location || !date || !timeAvailable || !initialTime}
        >
          Trouver un spot
        </Button>
      </Space>
    </Card>
  );
};

export default SpotSearch;