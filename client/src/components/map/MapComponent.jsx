import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

const MapComponent = ({ source, destination }) => {
  const [center, setCenter] = useState([0, 0]);

  useEffect(() => {
    if (source && destination) {
      const sourceCoords = [parseFloat(source.Latitude), parseFloat(source.Longitude)];
      const destinationCoords = [parseFloat(destination.Latitude), parseFloat(destination.Longitude)];
      setCenter(sourceCoords);
    }
  }, [source, destination]);

  return (
    <div className="map-container">
      <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {source && (
          <Marker position={[parseFloat(source.Latitude), parseFloat(source.Longitude)]}>
            <Popup>{source.Name}</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[parseFloat(destination.Latitude), parseFloat(destination.Longitude)]}>
            <Popup>{destination.Name}</Popup>
          </Marker>
        )}
        {source && destination && (
          <Polyline positions={[[parseFloat(source.Latitude), parseFloat(source.Longitude)], [parseFloat(destination.Latitude), parseFloat(destination.Longitude)]]} />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
