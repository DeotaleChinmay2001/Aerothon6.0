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
                    limit: 10
                },
                headers: {
                    'Authorization': 'Basic bzl6UmhvbDNZeVB4OVFFeVVwcmpYaklZbjg4c1RobGJGMlZUMXd4Sjo='
                }
            });
            // Initialize an array to store all paths
            
            const paths = []; // Array to store unique path IDs
            const uniquePathIds = []; // Array to store unique path IDs
            
            for (let i = 0; i < response.data.length; i++) {
                const pathId = response.data[i].id;
                  console.log(pathId)
                if (!uniquePathIds.includes(pathId)) {

                    uniquePathIds.push(pathId);
                    if (uniquePathIds.length === 3) break; // Break the loop once you have 3 unique path IDs
                }
            }
            
            for (const pathId of uniquePathIds) {
                try {
                    const pathResponse = await axios.get(`https://api.flightplandatabase.com/plan/${pathId}`, {
                        headers: {
                            'Authorization': 'Basic bzl6UmhvbDNZeVB4OVFFeVVwcmpYaklZbjg4c1RobGJGMlZUMXd4Sjo='
                        }
                    });
                    paths.push(pathResponse.data.route); // Store each path in the array
                } catch (error) {
                    console.error("Error fetching path:", error);
                }
            }
            // Emit the array containing all paths to the frontend
            socket.emit("simulationResponse", { "sourceData": sourceData, "destinationData": destinationData, "paths": paths });
            
        });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

module.exports = initializeSocket;
