// MapComponent.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix icons for Leaflet (important for webpack/Vite/CRA)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const createRedIcon = () => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #ff4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const MapComponent = ({ preferences, center}) => {
  // TODO: get suggested spots from the backend
  const suggestedSpot = {
    id: 1,
    name: "Parc de la Tête d'Or",
    location: [45.7772, 4.8557],
    description: "Grand parc urbain avec lac, jardin botanique et nombreuses activités sportives",
    activities: ["Course à pied", "Vélo"],
    rating: 4.5,
    distance: "2.3 km"
  };

  return (
    <div>
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={center}>
          <Popup>Vous êtes ici !</Popup>
        </Marker>
        <Marker position={suggestedSpot.location} icon={createRedIcon()}>
          <Popup>
            <div>
              <h4>{suggestedSpot.name}</h4>
              <p>{suggestedSpot.description}</p>
              <p><strong>Activités:</strong> {suggestedSpot.activities.join(', ')}</p>
              <p><strong>Note:</strong> ⭐ {suggestedSpot.rating}/5</p>
              <p><strong>Distance:</strong> {suggestedSpot.distance}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    
      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#fff3cd', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
        <h3 style={{ color: '#856404', marginBottom: '16px' }}>📍 Spots suggérés</h3>
        <div style={{ 
          padding: '12px', 
          backgroundColor: 'white', 
          borderRadius: '6px', 
          border: '1px solid #ddd',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{suggestedSpot.name}</h4>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>{suggestedSpot.description}</p>
              <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                <span><strong>Activités:</strong> {suggestedSpot.activities.join(', ')}</span>
                <span><strong>Distance:</strong> {suggestedSpot.distance}</span>
                <span><strong>Note:</strong> ⭐ {suggestedSpot.rating}/5</span>
              </div>
            </div>
            <div style={{ 
              backgroundColor: '#ff4444', 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
