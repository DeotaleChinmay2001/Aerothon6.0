/* eslint-disable react/prop-types */
import  { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, CircleMarker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import airplaneIconUrl from "../../assets/airplaneicon.png"; // Path to your airplane icon image

// Create a custom icon for the airplane
const airplaneIcon = new L.Icon({
  iconUrl: airplaneIconUrl,
  iconSize: [32, 32],
});

const Mapcont = ({ simulation, coordinates }) => {
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    if (simulation && simulation.length >= 2) {
      const startNode = simulation[0];
      const endNode = simulation[1];
      const dx = endNode.lon - startNode.lon;
      const dy = endNode.lat - startNode.lat;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      setRotationAngle(angle);
    }
  }, [simulation]);

  return (
    <MapContainer center={[28.5585, 77.0979]} zoom={5} style={{ height: "80vh" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Render CircleMarkers for middle positions */}
      {console.log(simulation, typeof(simulation))}
      {simulation && simulation.slice(1, -1).map((node, index) => (
        <CircleMarker key={index} center={[node.lat, node.lon]} radius={5} fillColor="black" fillOpacity={0.8}>
          <Popup>{node.name ? node.name : node.ident}</Popup>
        </CircleMarker>
      ))}
      {/* Render Polyline for connections */}
      {simulation && simulation.length >= 2 && (
        <Polyline positions={simulation.map(node => [node.lat, node.lon])} color="blue" />
      )}
      {/* Render Marker for start position */}
      {simulation && simulation.length > 0 && (
        <Marker position={[simulation[0].lat, simulation[0].lon]}>
          <Popup>Start Position</Popup>
        </Marker>
      )}
      {/* Render Marker for end position */}
      {simulation && simulation.length > 0 && (
        <Marker position={[simulation[simulation.length - 1].lat, simulation[simulation.length - 1].lon]}>
          <Popup>End Position</Popup>
        </Marker>
      )}
      {/* Render Marker with airplane icon for current location */}
      {coordinates && (
        <Marker position={[coordinates.latitude, coordinates.longitude]} icon={airplaneIcon} rotationAngle={rotationAngle} rotationOrigin="center">
          <Popup>
            <div>
              <p>Current Location</p>
              <p>Longitude: {coordinates.longitude}</p>
              <p>Latitude: {coordinates.latitude}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Mapcont;
