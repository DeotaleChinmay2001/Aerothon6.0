const {
  fetchAirportData,
  findAirportDataByICAO,
} = require("./airportData");
const {
  fetchFlightPlan,
  fetchPathForFlightPlan,
} = require("./flightPlan");


async function prepareFlightData(sourceICAO, destinationICAO) {
    const airportData = await fetchAirportData();
    console.log("1abycuvwe", airportData);
    const sourceData = findAirportDataByICAO(airportData, sourceICAO);
    console.log("1abycuvwe", sourceData);

    const destinationData = findAirportDataByICAO(airportData, destinationICAO);
    const flightPlan = await fetchFlightPlan(sourceData.ICAO, destinationData.ICAO);
    console.log("flightPlan",flightPlan);
    const pathData = await fetchPathForFlightPlan(flightPlan.id);
    
    const path = [sourceData].concat(pathData.nodes).concat([destinationData]);
    const waypoints = pathData.nodes.map((point) => ({
      lat: point.lat || parseFloat(point.Latitude),
      lon: point.lon || parseFloat(point.Longitude),
    }));
  
    return { sourceData, destinationData, waypoints, pathData };
  }
  
  module.exports = { prepareFlightData };