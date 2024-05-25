/* eslint-disable react/prop-types */
// import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from "../../assets/airplaneicon.png";

const AirlineMap = ({ source, destination, lat, lon, planePath }) => {
  if (!lat || !lon || !source || !destination || !source.Latitude || !source.Longitude || !destination.Latitude || !destination.Longitude) {
    console.error('Invalid coordinates:', { lat, lon, source, destination });
    return <div>Error: Invalid coordinates provided</div>;
  }

  const planeIcon = new L.Icon({
    iconUrl: iconUrl,
    iconSize: [32, 32],
  });

  return (
    <MapContainer center={[lat, lon]} zoom={5} style={{ height: "400px" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Marker for source */}
      <Marker position={[source.Latitude, source.Longitude]}>
        <Popup>{source.City}</Popup>
      </Marker>
      {/* Marker for destination */}
      <Marker position={[destination.Latitude, destination.Longitude]}>
        <Popup>{destination.City}</Popup>
      </Marker>
      {/* Polyline for plane path */}
      {planePath && planePath.length > 0 && (
        <Polyline positions={planePath.map((point) => [point.lat, point.lon])} color="blue" />
      )}
      {/* Marker for current location */}
      <Marker position={[lat, lon]} icon={planeIcon}>
        <Popup>Current Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default AirlineMap;