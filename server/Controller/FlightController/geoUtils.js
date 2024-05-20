const geolib = require('geolib');

function calculateDistance(lat1, lon1, lat2, lon2) {
  return (
    geolib.getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    ) / 1000
  ); 
}

function updatePlanePosition(currentPosition, destination, speed, intervalTime) {
  const distance = calculateDistance(
    currentPosition.lat,
    currentPosition.lon,
    destination.lat,
    destination.lon
  );
  const distanceToTravel = (speed * intervalTime) / 3600; // Distance to travel in this interval

  if (distanceToTravel >= distance) {
    return {
      newLatitude: destination.lat,
      newLongitude: destination.lon,
    };
  }

  const bearing = geolib.getRhumbLineBearing(
    { latitude: currentPosition.lat, longitude: currentPosition.lon },
    { latitude: destination.lat, longitude: destination.lon }
  );

  const newCoords = geolib.computeDestinationPoint(
    { latitude: currentPosition.lat, longitude: currentPosition.lon },
    distanceToTravel * 1000, // Convert to meters
    bearing
  );

  return {
    newLatitude: newCoords.latitude,
    newLongitude: newCoords.longitude,
  };
}

module.exports = { calculateDistance, updatePlanePosition };
