import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Button, Typography, Input, Space, DatePicker, Radio, message } from 'antd';
import moment from 'moment';
import MapComponent from './MapComponent';
import axios from "axios";
const { Title } = Typography;

// TODO: handle this in backend ? Or use something to pick schedules in a day ?
const timeOptions = [
  { label: 'Matin', value: 'morning' },
  { label: 'Après-midi', value: 'afternoon' },
  { label: 'Toute la journée', value: 'all_day' },
];

const PreferencesForm = () => {
  // location related states²
  const [validatingLocation, setValidatingLocation] = useState(false);
  const [city, setCity] = useState('');
  const [longitude, setLongitude] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [isCityValidated, setIsCityValidated] = useState(false)

  // activities related states
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [selectedActivities, setSelectedActivities] = useState([]);

  // time related states
  const [date, setDate] = useState(null);
  const [timeAvailable, setTimeAvailable] = useState(null);

  const [showMap, setShowMap] = useState(false);
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    const loadActivities = async () => {
      setLoadingActivities(true);
      try {
        const response = await axios.get('/activities/');
        setActivities(response.data.map(activity => activity.name) || []);
      } catch (error) {
        message.error('Erreur lors du chargement des activités');
        setActivities([]);
      } finally {
        setLoadingActivities(false);
      }
    };
    loadActivities();
  }, []); // No dependency here, hence []

  const resetLocalisationInfos = () => {
    setCity("")
    setLatitude(null)
    setLongitude(null)
    setIsCityValidated(false)
  }

  const handleSubmitLocalisation = async () => {
    setValidatingLocation(true);
    if (city) {
      if (longitude || latitude){
        message.error("Vous ne pouvez pas entrer une ville et des coordonnées GPS. Choisissez l’un ou l’autre.")
        resetLocalisationInfos()
      }
      else{
        try {
          const response = await axios.get(
              `/city/?city=${city}`
          );
          const validatedCity = `${response["data"]["city"]} (${response["data"]["postal"]}) ${response["data"]["country"]}`
          setLatitude(response["data"]["latitude"])
          setLongitude(response["data"]["longitude"])
          setCity(validatedCity)
          setIsCityValidated(true)
        }
        catch(e){
          message.error("La localisation entrée n'est pas valide")
          resetLocalisationInfos()
        }
      }
    }
    else if (longitude && latitude) {
      const lon = parseFloat(longitude);
      const lat = parseFloat(latitude);
      if (isNaN(lon) || isNaN(lat)) {
        message.error("Veuillez entrer des coordonnées valides.")
        resetLocalisationInfos()
      }
      else {
        setIsCityValidated(true)
      }
    }
    else {
      message.error("Veuillez entrer une ville ou des coordonnées GPS.");
      resetLocalisationInfos()
    }
    setValidatingLocation(false);
  }

  const handleActivityChange = (checkedValues) => {
    setSelectedActivities(checkedValues);
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
    const selectedTimeOption = timeOptions.find(option => option.value === timeAvailable);
    const userPreferences = {
      activities: selectedActivities,
      longitude: longitude,
      latitude: latitude,
      city: city,
      time_available: selectedTimeOption,
      date: date ? date.format('YYYY-MM-DD') : null,
    };
    setPreferences(userPreferences);
    setShowMap(true);
    // TODO: Send preferences to backend (save them for this user)
  };

  const handleBackToForm = () => {
    setShowMap(false);
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
        <MapComponent preferences={preferences} center={[latitude, longitude]}/>
      </div>
    );
  }
    // TODO 1: add the possibility to use information of localisation from the user (use pop up to ask authorization to read position of device)
    // TODO 2: when the localisation will be validated, displays a pop up showing user localisation and he should be able to move the point if necessary
    // TODO 3: On devrait pouvoir sélectionner une durée => 1h, 1/2 journée, la journée ? On devrait aussi pouvoir sélectionner 
    // une heure de début ? Mais ça serait aussi cool de pouvoir saisir un créneau horaire (Faire un champ quand êtes vous libres ce jour ?).
    //  On pourra sélectionner des créneaux sur la journée (disabled si c'est passé).
    return (
      <Card
        title="Quelle sera votre prochaine aventure ?"
        style={{ width: 400, margin: '20px auto' }}
      >
        <Space direction="vertical" size="large">
          
          <Card size="small" bordered style={{ backgroundColor: isCityValidated? "#e6ffed" : "#eeeeee" }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Title level={4}>Saisissez votre localisation...</Title>
                <Input
                  placeholder="Entrer une ville ou un village"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={validatingLocation || isCityValidated}
                />
              </div>
    
              <div>
                <Title level={4}>Ou alors indiquez vos coordonnées GPS.</Title>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Input
                    addonBefore="Longitude"
                    addonAfter="°"
                    placeholder="Ex: 2.3522"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    disabled={validatingLocation || isCityValidated}
                  />
                  <Input
                    addonBefore="Latitude"
                    addonAfter="°"
                    placeholder="Ex: 48.8566"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    disabled={validatingLocation || isCityValidated}
                  />
                </Space>
              </div>
              <Button
                onClick={resetLocalisationInfos}
                style={{ width: '100%' }}
              >
                Réinitialiser 
              </Button>
              <Button
                type="primary"
                onClick={handleSubmitLocalisation}
                style={{ width: '100%' }}
                disabled={!city && (!longitude || !latitude) || validatingLocation || isCityValidated}
              >
                Valider ma localisation
              </Button>
            </Space>
          </Card>
    
          <div>
            <Title level={4}>Sélectionnez un jour :</Title>
            <DatePicker
              value={date}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              disabledDate={disablePastDates}
              placeholder="Sélectionner une date"
              style={{ width: '100%' }}
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
            {loadingActivities ? (
              <div>Chargement des activités...</div>
            ) : activities && activities.length > 0 ? (
              <Checkbox.Group options={activities} onChange={handleActivityChange} value={selectedActivities}/>
            ) : (
              <div>Aucune activité disponible</div>
            )}
          </div>
    
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ width: '100%' }}
            disabled={selectedActivities.length === 0 || !isCityValidated || !date || !timeAvailable}
          >
            Suggère moi une activité
          </Button>
        </Space>
      </Card>
    );    
    
};

export default PreferencesForm;