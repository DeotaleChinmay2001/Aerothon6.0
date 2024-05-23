const { Server } = require("socket.io");
const geolib = require('geolib');
const {
  fetchAirportData,
} = require("./Controller/FlightController/airportData");
const { startSimulation , stopSimulation, resumeSimulation, pauseSimulation} = require('./Controller/FlightController/simulation');
const { prepareFlightData } = require("./Controller/FlightController/prepareFlightData")
const AIRCRAFT_SPEED = process.env.AIRCRAFT_SPEED;
const SOCKET_INTERVAL = process.env.SOCKET_INTERVAL;
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
      console.log(`User role set to: ${role} for socket ID: ${socket.id}`);
    });

    socket.on('connect', () => {
      console.log('Connected to server', activeSimulations);
      // socket.emit('getAllSimulations', activeSimulations);
    });

    socket.on("airportData", async () => {
      try {
        const airportData = await fetchAirportData();
        socket.emit("airportData", airportData);
        console.log("Airport data sent to client");
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
      console.log("userRoles", data);
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
            longitude: null,
            latitude: null,
          },
          planePaused: 0,
          status: 0,
          weatherError: 0,
          sensorErrorCount: 0,
        }
        console.log("sample", sample);
        activeSimulations.set(socket.id,sample )
        startSimulation(socket, waypoints, AIRCRAFT_SPEED, SOCKET_INTERVAL, activeSimulations);
        console.log("sourceData", sourceData);
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
    });
    socket.on("pauseSimulation", () => {
      pauseSimulation(socket.id, activeSimulations);
    });
    socket.on("resumeSimulation", () => {
      resumeSimulation(socket.id, activeSimulations);
    });
    socket.on("getAllSimulations", () => {
      if (userRoles.get(socket.id) === "airline") {
        console.log("inside");
        socket.emit("updateActiveSimulations", Array.from(activeSimulations.values()));
      }
    });
    socket.on('updateActiveSimulations', (activeSimulations) => {
      console.log('Active Simulations:', activeSimulations);
      setActiveSimulations(activeSimulations);
    });


    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}


function broadcastToAirlineUsers(io, event, data) {
  for (const [socketId, role] of userRoles.entries()) {
    if (role === "airline") {
      io.to(socketId).emit(event, data);
    }
  }
}




module.exports = initializeSocket;
