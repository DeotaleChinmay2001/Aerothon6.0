/* eslint-disable react/prop-types */
import { useState,  Component, useEffect } from "react";
import Select from "react-select";
import { FixedSizeList as List } from "react-window";
import { FaPlay, FaStop, FaPause, FaPlayCircle, FaMap } from "react-icons/fa";
import { toast } from "react-toastify";
import Mapcont from "../components/map/Mapcont";
import { useSocket } from "../context/SocketProvider";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";


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
  const {socket, airplanepath, simulationState, coordinates, weatherData, airportData, handleSimualationStateChange, predictions, servermsg} = useSocket();

  const [startAirport, setStartAirport] = useState(null);
  const [endAirport, setEndAirport] = useState(null);

  const { userName } = useAuth();
  const startSimulation = () => {
    if (startAirport === null || endAirport === null) {
      toast.error("Please select both start and end airports");
      return;
    }
    socket.emit("startSimulation", {
      source: startAirport,
      destination: endAirport,
      userType : "pilot",
      userName : userName
    });
    
  };

  const pauseSimulation = () => {
    socket.emit("pauseSimulation");
    handleSimualationStateChange("paused");
  };

  const resumeSimulation = () => {
    socket.emit("resumeSimulation");
    handleSimualationStateChange("running");
  };

  const stopSimulation = () => {
    socket.emit("stopSimulation");
    setStartAirport(null);
    setEndAirport(null);
    handleSimualationStateChange("stopped");
  };

  const getAlternateRoute = () => {
    if (coordinates) {
      socket.emit("getAlternateRoute", {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude
      });
    }
  };

  useEffect(() => {
    if (servermsg) {
      toast.info(servermsg);
    }
  }, [servermsg]);

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
            isDisabled={
              simulationState === "running" || simulationState === "paused"
            }
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
            isDisabled={
              simulationState === "running" || simulationState === "paused"
            }
          />
        </div>
        <div className="flex lg:flex-row flex-wrap space-x-4">
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2 ${
              simulationState !== "stopped"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={startSimulation}
            disabled={simulationState !== "stopped"}
          >
            <FaPlay />
          </button>
          <button
            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 ${
              simulationState !== "running"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={stopSimulation}
            disabled={simulationState !== "running"}
          >
            <FaStop />
          </button>
          <button
            className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-2 ${
              simulationState !== "running"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={pauseSimulation}
            disabled={simulationState !== "running"}
          >
            <FaPause />
          </button>
          <button
            className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-2 ${
              simulationState !== "paused"
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={resumeSimulation}
            disabled={simulationState !== "paused"}
          >
            <FaPlayCircle />
          </button>
          <button
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2`}
            onClick={getAlternateRoute}
            // disabled={simulationState !== "stopped"}
          >
            <FaMap />
          </button>
        </div>
      </div>
      {airplanepath && (
        <div className="flex flex-row flex-1">
          <div className="w-3/4 ">
            <Mapcont simulation={airplanepath} coordinates={coordinates} />
          </div>
          <div className="w-1/4 bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-700">
              Real-time Feed
            </h3>
            <div className="mb-3">
              <p className="text-sm text-gray-600">
                <strong>Longitude:</strong> {coordinates.longitude.toFixed(4)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Latitude:</strong> {coordinates.latitude.toFixed(4)}
              </p>
            </div>
            <div className="mb-2 flex items-center">
              <i className="fas fa-cloud-showers-heavy text-blue-500"></i>
              <p className="text-sm text-gray-600 ml-2">
                <strong>Description:</strong> {weatherData.description}
              </p>
            </div>
            <div className="mb-2 flex items-center">
              <i className="fas fa-thermometer-half text-yellow-500"></i>
              <p className="text-sm text-gray-600 ml-2">
                <strong>Temperature:</strong> {weatherData.temp} K
              </p>
            </div>
            <div className="mb-2 flex items-center">
              <i className="fas fa-temperature-low text-blue-500"></i>
              <p className="text-sm text-gray-600 ml-2">
                <strong>Min Temp:</strong> {weatherData.temp_min} K
              </p>
            </div>
            <div className="mb-2 flex items-center">
              <i className="fas fa-temperature-high text-red-500"></i>
              <p className="text-sm text-gray-600 ml-2">
                <strong>Max Temp:</strong> {weatherData.temp_max} K
              </p>
            </div>
            <div className="mb-2 flex items-center">
              <i className="fas fa-tachometer-alt text-green-500"></i>
              <p className="text-sm text-gray-600 ml-2">
                <strong>Pressure:</strong> {weatherData.pressure} hPa
              </p>
            </div>
            <div className="mb-2 flex items-center">
              <i className="fas fa-tint text-teal-500"></i>
              <p className="text-sm text-gray-600 ml-2">
                <strong>Humidity:</strong> {weatherData.humidity} %
              </p>
            </div>
            <div className="mb-2 flex items-center">
              <i className="fas fa-water text-indigo-500"></i>
              <p className="text-sm text-gray-600 ml-2">
                <strong>Sea Level:</strong> {weatherData.wind_speed} hPa
              </p>
            </div>
            <div className="mb-2 flex items-center">
              <i
                className={`fas ${
                  weatherData.sensor_health
                    ? "fa-check-circle text-green-500"
                    : "fa-times-circle text-red-500"
                }`}
              ></i>
              <p className="text-sm text-gray-600 ml-2">
                <strong>Sensor Health:</strong>{" "}
                { predictions.sensor }
              </p>
            </div>
            <div className="flex items-center">
              <i
                className={`fas ${
                  [
                    "fa-smile text-green-500",
                    "fa-meh text-yellow-500",
                    "fa-frown text-red-500",
                  ][weatherData.weather_verdict]
                }`}
              ></i>
              <p className="text-sm text-gray-600 ml-2">
                <strong>Weather Verdict:</strong>{" "}
                {predictions.weather ? predictions.weather : '-'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;
