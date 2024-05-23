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
  const [socket, setSocket] = useState(null);
  
  const handleSimualationStateChange = (state) =>{
    setSimulationState(state);
  }
  useEffect(()=>{
    initializeSocket()
    console.log(getSocket())
    setSocket(getSocket())
  }, [])

  useEffect(() => {
    if (socket) {
        socket.emit('airportData');
        socket.on("simulationResponse", (data) => {
          setAirplanepath(data.pathData);
          setSimulationState("running");
        });
        socket.on("airportData", (data) => {
          setAirportData(
            data.map((airport) => ({ value: airport.ICAO, label: airport.Name }))
          );
        });
    
        socket.on("simulationUpdate", (data1) => {
          const data = JSON.parse(data1);
          console.log("data", data);
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
        });
        socket.on('updateActiveSimulations', (activeSimulations) => {
          console.log('Active Simulations:', activeSimulations);
        });
    }
    return () => {
      if(socket){
      socket.off("airportData");
      socket.off("simulationUpdate");
      socket.off("simulationResponse");
    }
    };
}, [socket]);
  
  return (
    <SocketContext.Provider value={{socket, simulationState, airplanepath, coordinates, airportData, weatherData, handleSimualationStateChange}}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;