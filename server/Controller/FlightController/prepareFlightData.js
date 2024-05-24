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
  
  async function prepareFlightDataAlt(startAirportICAO, destinationICAO, simulationData) {
    try {
      startAirportICAO = startAirportICAO.toUpperCase();
      const flightPlan = await fetchFlightPlan(startAirportICAO, destinationICAO);
        const pathData = await fetchPathForFlightPlan(flightPlan.id);
    
       const currentLocation = simulationData.currentLocation;
       let updatedPath =[];
       const previousPath = simulationData.path;
       const currentIndex = simulationData.currentIndex;
       
       
       
       for (let i = 0; i <= currentIndex; i++) {
         updatedPath.push(previousPath[i]);
        }
        updatedPath.push(currentLocation);
        console.log("pathData", pathData);
        for (const node of pathData.nodes) {
          updatedPath.push(node);
       }



       return {  updatedPath };
      // Construct waypoints using the destination airport
      
      
    } catch (error) {
      console.error('Error preparing alternate route data:', error);
      throw error;
    }
  }



  module.exports = { prepareFlightData , prepareFlightDataAlt};