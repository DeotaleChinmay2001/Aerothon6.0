/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { initializeSocket, getSocket } from "../socket";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const [simulationState, setSimulationState] = useState("stopped");
  const [airplanepath, setAirplanepath] = useState(null);
  const [coordinates, setCoordinates] = useState({ longitude: 0, latitude: 0 });
  const [airportData, setAirportData] = useState([]);
  const [weatherData, setWeatherData] = useState({
    description: "moderate rain",
    temp: 298.48,
    temp_min: 297.56,
    temp_max: 300.05,
    pressure: 1015,
    humidity: 64,
    sea_level: 1015,
    grnd_level: 933,
    sensor_health: 1,
    weather_verdict: 2,
  });
  const [sensorData, setSensorData] = useState(null);
  const [sensorDataQueue, setSensorDataQueue] = useState([]);
  const [socket, setSocket] = useState(null);

  const handleSimualationStateChange = (state) => {
    setSimulationState(state);
  };
  useEffect(() => {
    initializeSocket();
    setSocket(getSocket());
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("airportData");
      socket.on("simulationResponse", (data) => {
        setAirplanepath(data.pathData);
        setSimulationState("running");
      });
      socket.on("airportData", (data) => {
        setAirportData(
          data.map((airport) => ({ value: airport.ICAO, label: airport.Name }))
        );
      });

      socket.on("alternateRouteResponse", (data)=>{
      //   const convertedPath = data.updatedPath.map(node => {
      //     const convertedNode = { ...node };
          
      //     if (node.latitude !== undefined) {
      //         convertedNode.lat = node.latitude;
      //         delete convertedNode.latitude;
      //     }
      
      //     if (node.longitude !== undefined) {
      //         convertedNode.lon = node.longitude;
      //         delete convertedNode.longitude;
      //     }
      
      //     return convertedNode;
      // });
      // console.log("dataaaaaaaaaa", convertedPath);
        setAirplanepath(data.updatedPath);
        console.log("dataaaaaaaaaa1",  airplanepath);
      })
      socket.on("simulationUpdate", (data1) => {
        const data = JSON.parse(data1);
        console.log("simulationUpdate", data);
        
        
        setSensorDataQueue(sensorDataQueue.push(data.sensorData));
        if (sensorDataQueue.length > 4) {
          sensorDataQueue.shift();
        }
        setCoordinates({
          longitude: data.currentLocation.longitude,
          latitude: data.currentLocation.latitude,
        });
        setWeatherData({
          description: data.weatherdata.weather[0].description,
          temp: data.weatherdata.main.temp,
          temp_min: data.weatherdata.main.temp_min,
          temp_max: data.weatherdata.main.temp_max,
          pressure: data.weatherdata.main.pressure,
          humidity: data.weatherdata.main.humidity,
          wind_speed: data.weatherdata.wind.speed,
          sensor_health: 1,
          weather_verdict: 2,
        });
        setSensorData(data.sensorData);
      });
      socket.on("updateActiveSimulations", (activeSimulations) => {
        console.log("Active Simulations:", activeSimulations);
      });
    }
    return () => {
      if (socket) {
        socket.off("airportData");
        socket.off("simulationUpdate");
        socket.off("simulationResponse");
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        simulationState,
        airplanepath,
        coordinates,
        airportData,
        weatherData,
        sensorData,
        sensorDataQueue,
        handleSimualationStateChange,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
