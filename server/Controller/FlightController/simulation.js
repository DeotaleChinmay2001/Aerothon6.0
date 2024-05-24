const mongoose = require('mongoose');
const flightHistory = require('../../models/flightHistory');
const { calculateDistance, updatePlanePosition } = require("./geoUtils");
const {
  getWeatherData,
} = require("../../Controller/FlightController/weatherData");
const { loadSensorData, getRandomRow } = require("./genSensData");
const {findNearestAirports } = require('./flightPlan')
const {prepareFlightDataAlt} = require('./prepareFlightData')

const OPENWEATHER_APIKEY = process.env.OPENWEATHER_APIKEY;
const simulationIntervals = new Map();

async function getAlternateRoute(socket, socketID, activeSimulations, coordinates) {
  if (!socketID || !activeSimulations.has(socketID)) {
    console.error("Invalid socket ID or simulation data not found for socket:", socketID);
    return;
  }

  const simulationData = activeSimulations.get(socketID);
  const { currentLocation, currentIndex, path } = simulationData;

  try {
    const nearestAirports = await findNearestAirports(currentLocation.latitude, currentLocation.longitude);
    if (nearestAirports.length === 0) {
      console.error("No nearest airport found from current location:", currentLocation);
      return;
    }
    const nearAirport = nearestAirports.response[0].id;
    const destinationAirport = simulationData.coordinate.destination.ICAO;

    const currentIndex = simulationData.path.findIndex(point => (
      point.lat === currentLocation.latitude && point.lon === currentLocation.longitude
    ));

    let { updatedPath } = await prepareFlightDataAlt(nearAirport, destinationAirport, simulationData, currentIndex);
    
    updatedPath = updatedPath.map(node => {
      const convertedNode = { ...node };
      if (node.latitude !== undefined) {
        convertedNode.lat = node.latitude;
        delete convertedNode.latitude;
      }
      if (node.longitude !== undefined) {
        convertedNode.lon = node.longitude;
        delete convertedNode.longitude;
      }
      return convertedNode;
    });

    
    simulationData.pathUsed = updatedPath;
    simulationData.path = updatedPath;
    simulationData.currentIndex = simulationData.currentIndex+1; 
    activeSimulations.set(socketID, simulationData);

    socket.emit("alternateRouteResponse", { updatedPath });
  } catch (error) {
    console.error("Error fetching alternate route:", error);
  }
}

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

  let planeState = {
    lat: waypoints[0].lat,
    lon: waypoints[0].lon,
  };
  
  const simulationInterval = setInterval(async () => {
    
    let currentWaypointIndex =activeSimulations.get(socket.id).currentIndex;
    if (activeSimulations.get(socket.id).status) {
     let waypoints2 = activeSimulations.get(socket.id).path;
     const nextWaypoint2 = waypoints2[currentWaypointIndex + 1];
      const currentWaypoint = waypoints[currentWaypointIndex];
      const nextWaypoint = waypoints[currentWaypointIndex + 1];
      console.log("nextWaypoint2",nextWaypoint2)
      console.log("nextWaypoint1",nextWaypoint)
      if (!nextWaypoint2) {
        clearInterval(simulationInterval);
        simulationIntervals.delete(socket.id);
        console.log("Plane has arrived at the final destination");
        return;
      }

      const { newLatitude, newLongitude } = updatePlanePosition(
        planeState,
        nextWaypoint2,
        speed,
        intervalTime
      );
      console.log("waypoints ================", planeState);
      console.log(nextWaypoint2);
      planeState.lat = newLatitude;
      planeState.lon = newLongitude;
      if (activeSimulations.has(socket.id)) {
        const simulation = activeSimulations.get(socket.id);
        simulation.currentLocation.longitude = planeState.lon;
        simulation.currentLocation.latitude = planeState.lat;
        simulation.path = activeSimulations.get(socket.id).path,
        simulation.currentIndex = currentWaypointIndex,
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

      console.log("sesor data", sensorData);
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
      console.log("newwaypoint", nextWaypoint);
      console.log("newwaypoint", nextWaypoint2);
      const distanceToNextWaypoint = calculateDistance(
        planeState.lat,
        planeState.lon,
        nextWaypoint2.lat,
        nextWaypoint2.lon
      );

      if (distanceToNextWaypoint <= 0.1) {
        currentWaypointIndex++;
        let temp = activeSimulations.get(socket.id);
        temp.currentIndex = currentWaypointIndex;
        activeSimulations.set(socket.id, temp);
      }
    } else {
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
  getAlternateRoute
};
