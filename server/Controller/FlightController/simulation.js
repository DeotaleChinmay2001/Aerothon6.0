const { calculateDistance, updatePlanePosition } = require("./geoUtils");

const simulationIntervals = new Map();
const pausedSimulations = new Map();

function startSimulation(socket, waypoints, speed, intervalTime) {
  if (!socket || !socket.id) {
    console.error("Invalid socket object passed to startSimulation");
    return;
  }
  pausedSimulations.set(socket.id, 1);
  console.log("heyyy", pausedSimulations);

  let currentWaypointIndex = 0;
  let planeState = {
    lat: waypoints[0].lat,
    lon: waypoints[0].lon,
  };

  const simulationInterval = setInterval(() => {
    if (pausedSimulations.get(socket.id)) {
      const currentWaypoint = waypoints[currentWaypointIndex];
      const nextWaypoint = waypoints[currentWaypointIndex + 1];

      if (!nextWaypoint) {
        clearInterval(simulationInterval);
        simulationIntervals.delete(socket.id);
        console.log("Plane has arrived at the final destination");
        return;
      }

      const { newLatitude, newLongitude } = updatePlanePosition(
        planeState,
        nextWaypoint,
        speed,
        intervalTime
      );

      planeState.lat = newLatitude;
      planeState.lon = newLongitude;
      socket.emit("simulationUpdate", {
        latitude: planeState.lat,
        longitude: planeState.lon,
      });
      console.log("Plane's Current Position:", planeState, socket.id);

      const distanceToNextWaypoint = calculateDistance(
        planeState.lat,
        planeState.lon,
        nextWaypoint.lat,
        nextWaypoint.lon
      );

      if (distanceToNextWaypoint <= 0.1) {
        // Consider plane has reached the waypoint if within 100 meters
        currentWaypointIndex++;
      }
    } else {
      console.log("paused", pausedSimulations[socket.id], socket.id);
    }
  }, intervalTime * 1000);

  simulationIntervals.set(socket.id, simulationInterval);
}

function stopSimulation(socketID) {
  if (!socketID) {
    console.error("Invalid socket object passed to stopSimulation:", socketID);
    return;
  }

  const simulationInterval = simulationIntervals.get(socketID);
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationIntervals.delete(socketID);
    console.log("Simulation stopped for client:", socketID);
  }
}

function pauseSimulation(socketID) {
  if (!socketID) {
    console.error("Invalid socket object passed to pauseSimulation:", socketID);
    return;
  }
  pausedSimulations.set(socketID, 0);
}

function resumeSimulation(socketID) {
  if (!socketID) {
    console.error(
      "Invalid socket object passed to resumeSimulation:",
      socketID
    );
  }
  pausedSimulations.set(socketID, 1);
  console.log("resume", socketID, pausedSimulations);

  return;
}

module.exports = {
  startSimulation,
  stopSimulation,
  pauseSimulation,
  resumeSimulation,
  simulationIntervals,
};
