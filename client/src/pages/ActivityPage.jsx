/* eslint-disable react/prop-types */
import { useState, useEffect, Component } from "react";
import io from "socket.io-client";
import Select from "react-select";
import { FixedSizeList as List } from "react-window";
import { FaPlay, FaStop, FaPause, FaPlayCircle, FaMap } from 'react-icons/fa'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SOCKET_IP = import.meta.env.VITE_SOCKETURL;
const socket = io(SOCKET_IP);
const height = 35;

class MenuList extends Component {
  render() {
    const { options, children, maxHeight, getValue } = this.props;
    const [value] = getValue();
    const initialOffset = options.indexOf(value) * height;

    return (
      <List
        height={maxHeight}
        itemCount={children.length}
        itemSize={height}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <div style={style}>{children[index]}</div>}
      </List>
    );
  }
}

const Activity = () => {
  const [coordinates, setCoordinates] = useState({ longitude: 0, latitude: 0 });
  const [airportData, setAirportData] = useState([]);
  const [startAirport, setStartAirport] = useState(null);
  const [endAirport, setEndAirport] = useState(null);
  const [simulationState, setSimulationState] = useState('stopped'); 

  const startSimulation = () => {
    if (startAirport===null || endAirport === null) {
      console.log("inn")
      toast.error('Please select both start and end airports');
      
      return; // Stop the function execution if either startAirport or endAirport is empty
    }
    socket.emit("startSimulation", { source: startAirport, destination: endAirport });
    socket.on("simulationResponse", (data) => {
      console.log("Response from backend:", data);
      setSimulationState('running');
    });
  };
  const pauseSimulation = () => {
    socket.emit('pauseSimulation');
    setSimulationState('paused');
  };

  const resumeSimulation = () => {
    socket.emit('resumeSimulation');
    setSimulationState('running');
  };

  const stopSimulation = () => {
    socket.emit('stopSimulation');
    setStartAirport(null);
    setEndAirport(null);
    toast.success("Simulation stopped");
    setSimulationState('stopped');
  };
  const getAlternateRoute = () => {
    console.log("getAlternateRouet");
  }



  useEffect(() => {
    socket.emit("airportData");

    socket.on("airportData", (data) => {
      setAirportData(data.map(airport => ({ value: airport.ICAO, label: airport.Name })));
      console.log("Airport data received:", data);
    });

    socket.on("simulationUpdate", (data) => {
      console.log("Simulation update:", data);
      setCoordinates({
        longitude: data.longitude,
        latitude: data.latitude
      });
    });

    return () => {
      socket.off("airportData");
      socket.off("simulationUpdate");
    };
  }, []);

  // const handleStartAirportChange = (selectedOption) => {
  //   setStartAirport(selectedOption);
  // };

  // const handleEndAirportChange = (selectedOption) => {
  //   setEndAirport(selectedOption);
  // };

  return (
   <div className="flex flex-col py-4 lg:px-12 md:px-8 px-4 h-screen overflow-y-auto w-full">
      <h2 className="text-3xl mb-4">Activity</h2>
      <div className="flex flex-col lg:flex-row lg:space-x-4 py-4">
        <div className="flex-1 mb-4 lg:mb-0">
          <Select
            value={startAirport}
            onChange={setStartAirport}
            options={airportData}
            placeholder="Select Start Airport"
            isSearchable
            isClearable
            components={{ MenuList }}
            isDisabled={simulationState === 'running' || simulationState === 'paused'}
          />
        </div>
        <div className="flex-1 mb-4 lg:mb-0">
          <Select
            value={endAirport}
            onChange={setEndAirport}
            options={airportData}
            placeholder="Select End Airport"
            isSearchable
            isClearable
            components={{ MenuList }}
            isDisabled={simulationState === 'running' || simulationState === 'paused'}
          />
        </div>
        <div className="flex lg:flex-row flex-wrap space-x-4">
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 ${simulationState !== 'stopped' ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={startSimulation}
            disabled={simulationState !== 'stopped'}
          >
            <FaPlay />
          </button>
          <button
            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 ${simulationState !== 'running' ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={stopSimulation}
            disabled={simulationState !== 'running'}
          >
            <FaStop /> 
          </button>
          <button
            className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-2 ${simulationState !== 'running' ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={pauseSimulation}
            disabled={simulationState !== 'running'}
          >
            <FaPause /> 
          </button>
          <button
            className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-2 ${simulationState !== 'paused' ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={resumeSimulation}
            disabled={simulationState !== 'paused'}
          >
            <FaPlayCircle /> 
          </button>
          <button
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2`}
            onClick={getAlternateRoute}
            disabled={simulationState !== 'stopped'}
          >
            <FaMap /> 
          </button>
        </div>
      </div>
      <div className="text-left">
        <p>Longitude: {coordinates.longitude}</p>
        <p>Latitude: {coordinates.latitude}</p>
      </div>
    </div>
  );
};

export default Activity;
