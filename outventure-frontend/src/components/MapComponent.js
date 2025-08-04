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

const MapComponent = ({ preferences, center}) => {
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
        //TODO: add markers of different colors for every suggested spots
      </MapContainer>
      
      {preferences && (
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <h3>Vos préférences :</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><strong>Localisation :</strong> {preferences.location}</li>
            <li><strong>Date choisie :</strong> {preferences.date}</li>
            <li><strong>Plage horaire choisie :</strong> {preferences.time_available.label}</li>
            <li><strong>Sports sélectionnés :</strong> {preferences.sports.join(', ')}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
