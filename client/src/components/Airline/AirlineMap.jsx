/* eslint-disable react/prop-types */
// import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, CircleMarker } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from "../../assets/airplaneicon.png";

const AirlineMap = ({ source, destination, lat, lon, planePath }) => {
  console.log(planePath)
  if (!lat || !lon || !source || !destination || !source.Latitude || !destination.Latitude || !source.Longitude || !destination.Longitude) {
    console.error('Invalid coordinates:', { lat, lon, source, destination });
    return <div>Error: Invalid coordinates provided</div>;
  }

  const planeIcon = new L.Icon({
    iconUrl: iconUrl,
    iconSize: [32, 32],
  });

  // Combine source, planePath, and destination into a single array of points
  const pathPoints = [
    { lat: source.Latitude, lon: source.Longitude, type: 'source', city: source.City },
    ...planePath.map((point, index) => ({ ...point, type: 'intermediate', index: index + 1 })),
    { lat: destination.Latitude, lon: destination.Longitude, type: 'destination', city: destination.City }
  ];

  return (
    <MapContainer center={[lat, lon]} zoom={5} style={{ height: "400px" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Polyline for full path */}
      <Polyline positions={pathPoints.map(point => [point.lat, point.lon])} color="blue" />
      {/* Markers and circle markers for all points */}
      {pathPoints.map((point, index) => {
        if (point.type === 'source') {
          return (
            <Marker key={index} position={[point.lat, point.lon]}>
              <Popup>{point.city}</Popup>
            </Marker>
          );
        }
        if (point.type === 'destination') {
          return (
            <Marker key={index} position={[point.lat, point.lon]}>
              <Popup>{point.city}</Popup>
            </Marker>
          );
        }
        return (
          <CircleMarker key={index} center={[point.lat, point.lon]} radius={5} color="green">
            <Popup>Intermediate Point {point.index}</Popup>
          </CircleMarker>
        );
      })}
      {/* Marker for current location */}
      <Marker position={[lat, lon]} icon={planeIcon}>
        <Popup>Current Location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default AirlineMap;