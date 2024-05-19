import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Mapcont = ({ simulation }) => {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    if (simulation) {
      const { paths } = simulation;
      const modifiedPaths = paths.map((path, pathIndex) => ({
        ...path,
        nodes: path.nodes.map((node, index) => ({
          ...node,
          lat: parseFloat(node.lat) , // Modify latitude slightly for each path
          lon: parseFloat(node.lon)  // Modify longitude slightly for each path
        }))
      }));
      setPaths(modifiedPaths);
    }
  }, [simulation]);

  const colors = ["green", "black", "red"]; // Define colors for each path

  return (
    <MapContainer center={[28.5585, 77.0979]} zoom={5} style={{ height: "80vh" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {paths.map((path, pathIndex) => (
        <React.Fragment key={pathIndex}>
          {path.nodes.map((node, index) => (
            <CircleMarker key={index} center={[node.lat, node.lon]} radius={5} fillColor="black" fillOpacity={0.8}>
              <Popup>{node.name ? node.name : node.ident}</Popup>
            </CircleMarker>
          ))}
          {path.nodes.length >= 2 && (
            <Polyline
              key={pathIndex}
              positions={path.nodes.map((node) => [parseFloat(node.lat), parseFloat(node.lon)])}
              color={colors[pathIndex % colors.length]} // Use modulo to cycle through colors array
            />
          )}
        </React.Fragment>
      ))}
    </MapContainer>
  );
};

export default Mapcont;
