const fs = require('fs');
const csvParser = require('csv-parser');

// Function to fetch airport data from CSV
const fetchAirportData = async () => {
  return new Promise((resolve, reject) => {
    const airportData = [];
    fs.createReadStream('./metaData/airports.csv')
      .pipe(csvParser())
      .on('data', (row) => {
        airportData.push(row);
      })
      .on('end', () => {
        resolve(airportData);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Function to find airport data by ICAO code
const findAirportDataByICAO = (airportData, icaoCode) => {
  return airportData.find(airport => airport.ICAO === icaoCode);
};

module.exports = { fetchAirportData, findAirportDataByICAO };
