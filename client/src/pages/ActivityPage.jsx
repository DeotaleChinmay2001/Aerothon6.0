import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Select from 'react-select';
import Mapcont from '../components/map/Mapcont';

const socket = io('http://localhost:8000');

const Activity = () => {
  const [airportData, setAirportData] = useState([]);
  const [startAirport, setStartAirport] = useState(null);
  const [endAirport, setEndAirport] = useState(null);
  const [simulationResponse, setSimulationResponse] = useState(null);

  const startSimulation = () => {
    socket.emit('startSimulation', { source: startAirport, destination: endAirport });
    socket.on('simulationResponse', (data) => {
      console.log('Response from backend:', data);
      setSimulationResponse(data);
    });
  };

  useEffect(() => {
    socket.emit('airportData');

    socket.on('airportData', (data) => {
      setAirportData(data.map((airport) => ({ value: airport.ICAO, label: airport.Name })));
      console.log('Airport data received:', data);
    });

    return () => {
      socket.off('airportData');
    };
  }, []);

  const handleStartAirportChange = (selectedOption) => {
    setStartAirport(selectedOption);
  };

  const handleEndAirportChange = (selectedOption) => {
    setEndAirport(selectedOption);
  };

  return (
    <div className="flex flex-col py-10 lg:px-16 md:px10 px-6 h-screen overflow-y-auto w-full">
      <h2 className="text-3xl mb-6">Activity</h2>

      <div className="flex flex-col md:flex-row md:space-x-8 py-6">
        <div className="flex-1">
          <div className="mb-4" style={{ width: '300px' }}>
            <Select
              value={startAirport}
              onChange={handleStartAirportChange}
              options={airportData}
              placeholder="Select Start Airport"
              isSearchable
              isClearable
            />
          </div>
          <div style={{ width: '300px' }}>
            <Select
              value={endAirport}
              onChange={handleEndAirportChange}
              options={airportData}
              placeholder="Select End Airport"
              isSearchable
              isClearable
            />
          </div>
        </div>
        <div className="flex-1">
          <button className="pt-100 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={startSimulation}>
            Start Simulation
          </button>
        </div>
      </div>

      {simulationResponse && (
        <div className="py-6">
          <h3 className="text-xl mb-4">Map</h3>
          <Mapcont simulation={simulationResponse} />
        </div>
      )}
    </div>
  );
};

export default Activity;
