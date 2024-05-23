const mongoose = require('mongoose');
const flightHistory = require('../../models/flightHistory');
const { calculateDistance, updatePlanePosition } = require("./geoUtils");
const {
  getWeatherData,
} = require("../../Controller/FlightController/weatherData");
const { loadSensorData, getRandomRow } = require("./genSensData");

const OPENWEATHER_APIKEY = process.env.OPENWEATHER_APIKEY;
const simulationIntervals = new Map();

function startSimulation(
  socket,
  waypoints,
  speed,
  intervalTime,
  activeSimulations
) {
  if (!socket || !socket.id) {
    console.error("Invalid socket object passed to startSimulation");
    return;
  }
  if (activeSimulations.has(socket.id)) {
    const simulation = activeSimulations.get(socket.id);
    simulation.status = 1;
    simulation.planePath = waypoints;
    activeSimulations.set(socket.id, simulation);
  }
  let currentWaypointIndex = 0;
  let planeState = {
    lat: waypoints[0].lat,
    lon: waypoints[0].lon,
  };

  const simulationInterval = setInterval(async () => {
    if (activeSimulations.get(socket.id).status) {
      const currentWaypoint = waypoints[currentWaypointIndex];
      const nextWaypoint = waypoints[currentWaypointIndex + 1];

      if (!nextWaypoint) {
        clearInterval(simulationInterval);
        simulationIntervals.delete(socket.id);
        console.log("Plane has arrived at the final destination");
        return;
      }

      const { newLatitude, newLongitude } = updatePlanePosition(
        planeState,
        nextWaypoint,
        speed,
        intervalTime
      );

      planeState.lat = newLatitude;
      planeState.lon = newLongitude;
      if (activeSimulations.has(socket.id)) {
        const simulation = activeSimulations.get(socket.id);
        simulation.currentLocation.longitude = planeState.lon;
        simulation.currentLocation.latitude = planeState.lat;
        activeSimulations.set(socket.id, simulation);
      }
      const weatherdata = await getWeatherData(
        OPENWEATHER_APIKEY,
        newLatitude,
        newLongitude
      ).catch((error) => {
        console.error("Error:", error);
      });
      try {
        await loadSensorData(); 
        sensorData = getRandomRow();
      } catch (error) {
        console.error("Error loading or processing sensor data:", error);
      }
      socket.emit(
        "simulationUpdate",
        JSON.stringify({
          currentLocation: {
            latitude: planeState.lat,
            longitude: planeState.lon,
          },
          weatherdata: weatherdata,
          sensorData: sensorData,
        })
      );
      console.log("Plane's Current Position:", activeSimulations.get(socket.id));

      const distanceToNextWaypoint = calculateDistance(
        planeState.lat,
        planeState.lon,
        nextWaypoint.lat,
        nextWaypoint.lon
      );

      if (distanceToNextWaypoint <= 0.1) {
        currentWaypointIndex++;
      }
    } else {
      // console.log("paused", activeSimulations[socket.id], socket.id);
    }
  }, intervalTime * 1000);

  simulationIntervals.set(socket.id, simulationInterval);
}

async function stopSimulation(socketID, activeSimulations) {
  if (!socketID) {
    console.error("Invalid socket object passed to stopSimulation:", socketID);
    return;
  }

  const simulationInterval = simulationIntervals.get(socketID);
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationIntervals.delete(socketID);
    const data = activeSimulations.get(socketID);
    const newSample = new flightHistory({
      flightId: data.flightId,
      User: data.User,
      coordinate: {
        source: {
          Name: data.coordinate.source.Name,
          City: data.coordinate.source.City,
          Country: data.coordinate.source.Country,
          IATA: data.coordinate.source.IATA,
          ICAO: data.coordinate.source.ICAO,
          Latitude: data.coordinate.source.Latitude,
          Longitude: data.coordinate.source.Longitude
        },
        destination: {  
          Name: data.coordinate.destination.Name,
          City: data.coordinate.destination.City,
          Country: data.coordinate.destination.Country,
          IATA: data.coordinate.destination.IATA,
          ICAO: data.coordinate.destination.ICAO,
          Latitude: data.coordinate.destination.Latitude,
          Longitude: data.coordinate.destination.Longitude
        }
      },
      currentLocation: {
        longitude: data.currentLocation.longitude,
        latitude: data.currentLocation.latitude
      },
      planePaused: data.planePaused,
      status: data.status,
      weatherError: data.weatherError,
      sensorErrorCount: data.sensorErrorCount
    });
  
    try {
      const savedSample = await newSample.save();
      console.log('Sample saved:', savedSample);
    } catch (error) {
      console.error('Error saving sample:', error);
    }


    console.log("Simulation stopped for client:", socketID);
  }
}

function pauseSimulation(socketID, activeSimulations) {
  if (!socketID) {
    console.error("Invalid socket object passed to pauseSimulation:", socketID);
    return;
  }
  if (activeSimulations.has(socketID)) {
      const simulation = activeSimulations.get(socketID);
      simulation.planePaused=  simulation.planePaused+1;
      simulation.status = 0;
      activeSimulations.set(socketID, simulation);
  }
}

function resumeSimulation(socketID, activeSimulations) {
  if (!socketID) {
    console.error(
      "Invalid socket object passed to resumeSimulation:",
      socketID
    );
  }
  if (activeSimulations.has(socketID)) {
    const simulation = activeSimulations.get(socketID);
      simulation.status = 1;
      activeSimulations.set(socketID, simulation);
  }
  console.log("resume", socketID, activeSimulations);

  return;
}

module.exports = {
  startSimulation,
  stopSimulation,
  pauseSimulation,
  resumeSimulation,
  simulationIntervals,
};
