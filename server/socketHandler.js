const { Server } = require("socket.io");
const geolib = require('geolib');
const {
  fetchAirportData,
} = require("./Controller/FlightController/airportData");
const { startSimulation , stopSimulation, resumeSimulation, pauseSimulation} = require('./Controller/FlightController/simulation');
const { prepareFlightData } = require("./Controller/FlightController/prepareFlightData")

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

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

      try {
        const {
          sourceData,
          destinationData,
          waypoints,
          pathData
        } = await prepareFlightData(sourceICAO, destinationICAO);

        const speed = 100000; 
        const intervalTime = 3; 

        startSimulation(socket, waypoints, speed, intervalTime);
        
        
        socket.emit("simulationResponse", {
          sourceData: sourceData,
          destinationData: destinationData,
          pathData: pathData.route,
        });
      } catch (error) {
        console.error(error);
      }
    });

    socket.on("stopSimulation", () => {
      console.log("Socket disconnect event. Socket ID:", socket.id);
      stopSimulation(socket.id);
    });
    socket.on("pauseSimulation", () => {
      pauseSimulation(socket.id);
    });
    socket.on("resumeSimulation", () => {
      resumeSimulation(socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

module.exports = initializeSocket;
