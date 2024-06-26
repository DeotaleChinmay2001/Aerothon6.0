const { Server } = require("socket.io");
const geolib = require('geolib');
const {
  fetchAirportData,
} = require("./Controller/FlightController/airportData");
const { startSimulation , getAlternateRoute,stopSimulation, resumeSimulation, pauseSimulation} = require('./Controller/FlightController/simulation');
const { prepareFlightData } = require("./Controller/FlightController/prepareFlightData")
const AIRCRAFT_SPEED = process.env.AIRCRAFT_SPEED;
const SOCKET_INTERVAL = process.env.SOCKET_INTERVAL;
const {findNearestAirports} = require('./Controller/FlightController/flightPlan')
const activeSimulations = new Map();
const userRoles = new Map(); 
const { v4: uuidv4 } = require('uuid');

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("setRole", (role) => {
      userRoles.set(socket.id, role);
    });

    socket.on("airportData", async () => {
      try {
        const airportData = await fetchAirportData();
        socket.emit("airportData", airportData);
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("startSimulation", async (data) => {
      const sourceICAO = data.source.value;
      const destinationICAO = data.destination.value;
      const userType = data.userType;
      const userName = data.userName;
      userRoles.set(socket.id, userType);
      try {
        const {
          sourceData,
          destinationData,
          waypoints,
          pathData
        } = await prepareFlightData(sourceICAO, destinationICAO);
        sample = {
          flightId: uuidv4(),
          User: userName,
          coordinate: {
            source: sourceData,
            destination: destinationData,
          },
          currentLocation:{
            longitude: sourceData.Latitude,
            latitude: sourceData.Longitude,
          },
          planePaused: 0,
          status: 1,
          weatherError: 0,
          sensorErrorCount: 0,
          pathUsed: waypoints,
          path: waypoints,
          currentIndex: 0,
          sensorList:[],
        }
        activeSimulations.set(socket.id,sample )
        startSimulation(socket, waypoints, AIRCRAFT_SPEED, SOCKET_INTERVAL, activeSimulations);
        socket.emit("simulationResponse", {
          sourceData: sourceData,
          destinationData: destinationData,
          pathData: pathData.nodes,
        });
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("stopSimulation", () => {
      console.log("Socket disconnect event. Socket ID:", socket.id);
      stopSimulation(socket.id, activeSimulations);
      activeSimulations.delete(socket.id);
      socket.emit("simulationMessage", { message: "Simulation stopped successfully" });
    });
    socket.on("pauseSimulation", () => {
      pauseSimulation(socket.id, activeSimulations);
      socket.emit("simulationMessage", { message: "Simulation paused successfully" });

    });
    socket.on("resumeSimulation", () => {
      resumeSimulation(socket.id, activeSimulations);
      socket.emit("simulationMessage", { message: "Simulation resumed successfully" });

    });

    socket.on("getAlternateRoute", async (coordinates) => {
     
      try {
        getAlternateRoute(socket, socket.id,activeSimulations,coordinates);
        const nearestAirports = await findNearestAirports(coordinates.latitude, coordinates.longitude);
        socket.emit("nearestAirportsResponse", nearestAirports);
      } catch (error) {
        console.error("Error fetching nearest airports:", error);
      }
    });

    socket.on("getAllSimulations", () => {
      if (userRoles.get(socket.id) === "airline") {
        socket.emit("updateActiveSimulations", Array.from(activeSimulations.values()));
        
        const intervalId = setInterval(() => {
          socket.emit("updateActiveSimulations", Array.from(activeSimulations.values()));
        }, 3000);
  
        socket.on("disconnect", () => {
          clearInterval(intervalId);
          stopSimulation(socket.id, activeSimulations);
          activeSimulations.delete(socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      stopSimulation(socket.id, activeSimulations);
      activeSimulations.delete(socket.id);
    });
  });
}

module.exports = initializeSocket;
