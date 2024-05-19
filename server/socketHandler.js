const { Server } = require("socket.io");
const fs = require("fs");
const csvParser = require("csv-parser");
const axios = require('axios');


  

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("airportData", () => {
      const airportData = [];

      fs.createReadStream("./metaData/airports.csv")
        .pipe(csvParser())
        .on("data", (row) => {
          airportData.push({ Name: row.Name, ICAO: row.ICAO });
        })
        .on("end", () => {
          socket.emit("airportData", airportData);
          console.log("Airport data sent to client");
        });
    });

    socket.on("startSimulation", (data) => {
        const sourceICAO = data.source.value;
        const destinationICAO = data.destination.value;
        const airportData = [];
        let sourceData = {};
        let destinationData = {};
        
        fs.createReadStream("./metaData/airports.csv")
        .pipe(csvParser())
        .on("data", (row) => {
          airportData.push(row);
        })
        .on("end", async () => {
            const findAirportDataByICAO = (icaoCode) => {
                return airportData.find(airport => airport.ICAO === icaoCode);
              };
            sourceData = findAirportDataByICAO(sourceICAO);
            destinationData = findAirportDataByICAO(destinationICAO);
            const response = await axios.get('https://api.flightplandatabase.com/search/plans', {
                params: {
                    fromICAO: sourceData.ICAO,
                    toICAO: destinationData.ICAO,
                    limit: 2
                },
                headers: {
                    'Authorization': 'Basic bzl6UmhvbDNZeVB4OVFFeVVwcmpYaklZbjg4c1RobGJGMlZUMXd4Sjo='
                }
            });

            const path = await axios.get(`https://api.flightplandatabase.com/plan/${response.data[0]["id"]}`, {
                headers: {
                    'Authorization': 'Basic bzl6UmhvbDNZeVB4OVFFeVVwcmpYaklZbjg4c1RobGJGMlZUMXd4Sjo='
                }
                });

            console.log("response", path.data.route);
            socket.emit("simulationResponse", { "sourceData": sourceData, "destinationData": destinationData, "pathData":path.data.route });
        });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

module.exports = initializeSocket;
