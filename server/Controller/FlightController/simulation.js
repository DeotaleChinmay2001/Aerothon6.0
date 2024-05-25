const mongoose = require("mongoose");
const flightHistory = require("../../models/flightHistory");
const { calculateDistance, updatePlanePosition } = require("./geoUtils");
const {
  getWeatherData,
} = require("../../Controller/FlightController/weatherData");
const { loadSensorData, getRandomRow } = require("./genSensData");
const { findNearestAirports } = require("./flightPlan");
const { prepareFlightDataAlt } = require("./prepareFlightData");
const axios = require('axios');


const OPENWEATHER_APIKEY = process.env.OPENWEATHER_APIKEY;
const simulationIntervals = new Map();

async function getAlternateRoute(
  socket,
  socketID,
  activeSimulations,
  coordinates
) {
  if (!socketID || !activeSimulations.has(socketID)) {
    console.error(
      "Invalid socket ID or simulation data not found for socket:",
      socketID
    );
    return;
  }

  const simulationData = activeSimulations.get(socketID);
  const { currentLocation } = simulationData;

  try {
    const nearestAirports = await findNearestAirports(
      currentLocation.latitude,
      currentLocation.longitude
    );
    if (nearestAirports.length === 0) {
      console.error(
        "No nearest airport found from current location:",
        currentLocation
      );
      return;
    }
    const nearAirport = nearestAirports.response[0].id;
    const destinationAirport = simulationData.coordinate.destination.ICAO;

    const currentIndex = simulationData.path.findIndex(
      (point) =>
        point.lat === currentLocation.latitude &&
        point.lon === currentLocation.longitude
    );

    let { updatedPath } = await prepareFlightDataAlt(
      nearAirport,
      destinationAirport,
      simulationData,
      currentIndex
    );

    updatedPath = updatedPath.map((node) => {
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
    simulationData.currentIndex = simulationData.currentIndex + 1;
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
    let currentWaypointIndex = activeSimulations.get(socket.id).currentIndex;
    if (activeSimulations.get(socket.id).status) {
      let waypoints2 = activeSimulations.get(socket.id).path;
      const nextWaypoint2 = waypoints2[currentWaypointIndex + 1];
      const currentWaypoint = waypoints[currentWaypointIndex];
      const nextWaypoint = waypoints[currentWaypointIndex + 1];
      if (!nextWaypoint2) {
        clearInterval(simulationInterval);
        simulationIntervals.delete(socket.id);
        socket.emit("simulationMessage", { message: "Plane Reached destination " });
        return;
      }

      const { newLatitude, newLongitude } = updatePlanePosition(
        planeState,
        nextWaypoint2,
        speed,
        intervalTime
      );
      planeState.lat = newLatitude;
      planeState.lon = newLongitude;
      if (activeSimulations.has(socket.id)) {
        const simulation = activeSimulations.get(socket.id);
        simulation.currentLocation.longitude = planeState.lon;
        simulation.currentLocation.latitude = planeState.lat;
        (simulation.path = activeSimulations.get(socket.id).path),
          (simulation.currentIndex = currentWaypointIndex),
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
      const formatedSensorData = {
        id: [parseFloat(sensorData.id)],
        cycle: [parseFloat(sensorData.cycle)],
        setting1: [parseFloat(sensorData.setting1)],
        setting2: [parseFloat(sensorData.setting2)],
        setting3: [parseFloat(sensorData.setting3)],
        s1: [parseFloat(sensorData.s1)],
        s2: [parseFloat(sensorData.s2)],
        s3: [parseFloat(sensorData.s3)],
        s4: [parseFloat(sensorData.s4)],
        s5: [parseFloat(sensorData.s5)],
        s6: [parseFloat(sensorData.s6)],
        s7: [parseFloat(sensorData.s7)],
        s8: [parseFloat(sensorData.s8)],
        s9: [parseFloat(sensorData.s9)],
        s10: [parseFloat(sensorData.s10)],
        s11: [parseFloat(sensorData.s11)],
        s12: [parseFloat(sensorData.s12)],
        s13: [parseFloat(sensorData.s13)],
        s14: [parseFloat(sensorData.s14)],
        s15: [parseFloat(sensorData.s15)],
        s16: [parseFloat(sensorData.s16)],
        s17: [parseFloat(sensorData.s17)],
        s18: [parseFloat(sensorData.s18)],
        s19: [parseFloat(sensorData.s19)],
        s20: [parseFloat(sensorData.s20)],
        s21: [parseFloat(sensorData.s21)],
      };

      const updatedWeatherData = {
        main_temp: weatherdata.main.temp,
        visibility: weatherdata.visibility,
        wind_speed: weatherdata.wind.speed,
        pressure: weatherdata.main.pressure,
        humidity: weatherdata.main.humidity,
        sea_level: weatherdata.main.sea_level,
        grnd_level: weatherdata.main.grnd_level,
      };

      const prediction = {
        weather: 0,
        sensor: 0
      };
      
      try {
        const flaskResponseWeather = await axios.post(
          "http://127.0.0.1:5000/weatherPredict",
          updatedWeatherData
        );
        prediction["weather"] = flaskResponseWeather.data; // Use "weather" as a string
      } catch (error) {
        console.error("Error making prediction:", error);
      }
      
      try {
        const flaskResponseSensor = await axios.post(
          "http://127.0.0.1:5000/sensorPredict",
          formatedSensorData
        );
        prediction["sensor"] = flaskResponseSensor.data; // Use "sensor" as a string
      
      } catch (error) {
        console.error("Error making prediction:", error);
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
          prediction: prediction,
        })
      );
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
      User: "chinmay@airbus.com",
      coordinate: {
        source: {
          Name: data.coordinate.source.Name,
          City: data.coordinate.source.City,
          Country: data.coordinate.source.Country,
          IATA: data.coordinate.source.IATA,
          ICAO: data.coordinate.source.ICAO,
          Latitude: data.coordinate.source.Latitude,
          Longitude: data.coordinate.source.Longitude,
        },
        destination: {
          Name: data.coordinate.destination.Name,
          City: data.coordinate.destination.City,
          Country: data.coordinate.destination.Country,
          IATA: data.coordinate.destination.IATA,
          ICAO: data.coordinate.destination.ICAO,
          Latitude: data.coordinate.destination.Latitude,
          Longitude: data.coordinate.destination.Longitude,
        },
      },
      currentLocation: {
        longitude: data.currentLocation.longitude,
        latitude: data.currentLocation.latitude,
      },
      planePaused: data.planePaused,
      status: data.status,
      weatherError: data.weatherError,
      sensorErrorCount: data.sensorErrorCount,
    });

    try {
      const savedSample = await newSample.save();
      console.log("Sample saved:", savedSample);
    } catch (error) {
      console.error("Error saving sample:", error);
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
    simulation.planePaused = simulation.planePaused + 1;
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

  return;
}

module.exports = {
  startSimulation,
  stopSimulation,
  pauseSimulation,
  resumeSimulation,
  simulationIntervals,
  getAlternateRoute,
};
