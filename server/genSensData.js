const fs = require('fs');
const csvParser = require('csv-parser');

let csvData = [];

// Function to load the CSV data
function loadSensorData() {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream('./metaData/sensorData.csv')
      .pipe(csvParser({}))
      .on('data', (row) => data.push(row))
      .on('end', () => {
        csvData = data; // Store the data in the global variable
        resolve();
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

// Function to get a random row from the loaded CSV data
function getRandomRow() {
  if (csvData.length === 0) {
    throw new Error('CSV data has not been loaded yet.');
  }
  const sz = csvData.length;
  const rn = Math.floor(Math.random() * sz);
  return csvData[rn];
}

// Main function to load data and then get a random row
async function sensData() {
  try {
    await loadSensorData(); // Load the data first
    const randomRow = getRandomRow(); 
    console.log("randomRow", randomRow); 
  } catch (error) {
    console.error('Error loading or processing sensor data:', error);
  }
}

module.exports = { sensData,getRandomRow , loadSensorData};