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
    const sourceData = findAirportDataByICAO(airportData, sourceICAO);
    const destinationData = findAirportDataByICAO(airportData, destinationICAO);
    const flightPlan = await fetchFlightPlan(sourceData.ICAO, destinationData.ICAO);
    const pathData = await fetchPathForFlightPlan(flightPlan.id);
    
    const path = [sourceData].concat(pathData.nodes).concat([destinationData]);
    const waypoints = pathData.nodes.map((point) => ({
      lat: point.lat || parseFloat(point.Latitude),
      lon: point.lon || parseFloat(point.Longitude),
    }));
  
    return { sourceData, destinationData, waypoints, pathData };
  }
  
  module.exports = { prepareFlightData };