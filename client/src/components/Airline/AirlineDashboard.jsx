/* eslint-disable react/prop-types */
import { useState } from "react";
import FlightDetailsView from '../../components/Airline/FlightDetailsScreen'; 

function convertFlightDetails(details) {
  return details.map(flight => ({
    
    id: flight.flightId,
    source: flight.coordinate.source.City,
    destination: flight.coordinate.destination.City,
    currentLocation: `Lat: ${flight.currentLocation.latitude}, Lon: ${flight.currentLocation.longitude}`,
    user: flight.User,
    planePaused:flight.planePaused,
    sensorErrorCount:flight.sensorErrorCount,
    status:flight.status,
    weatherError:flight.weatherError,
    planePath:flight.path,
    sourceDet:flight.coordinate.source,
    destDet:flight.coordinate.destination,
    latitude:`${flight.currentLocation.latitude}`,
    longitude:`${flight.currentLocation.longitude}`,
    
  }));

}

const AirlineView = ({ activeSimulations }) => {
  const flightsData = convertFlightDetails(activeSimulations);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLatitude, setSelectedLatitude] = useState(null);
  const [selectedLongitude, setSelectedLongitude] = useState(null);
const [selectedFlight, setSelectedFlight] = useState(null);
  const filteredFlights = flightsData.filter(
    (flight) =>
      flight.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.currentLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.id.includes(searchTerm)
  );

  if (selectedFlight) {
    return (
      <FlightDetailsView 
      flight={selectedFlight} 
      latitude={selectedLatitude} 
        longitude={selectedLongitude} 
      onBack={() => {
        setSelectedFlight(null);
        setSelectedLatitude(null); 
        setSelectedLongitude(null); 
      }} 
    />
    );
  }

  return (
    <div className="flex flex-col py-6 lg:px-12 md:px-8 px-4 h-screen overflow-y-auto w-full">
      <h2 className="lg:text-2xl md:text-xl text-lg mb-3">
        Airline Dashboard
      </h2>

      <div className="py-3">
        <input
          type="text"
          placeholder="Search for a flight"
          className="p-2 border rounded w-full md:w-1/2 lg:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-3">
  {filteredFlights.length > 0 ? (
    filteredFlights.map((flight) => (
      <div
        key={flight.id}
        className="flex flex-col rounded-lg shadow-lg border p-4 h-full justify-center bg-white cursor-pointer hover:shadow-xl transition-shadow duration-200"
        onClick={() => setSelectedFlight(flight)}
      >
        <h2 className="text-lg font-semibold mb-2 text-gray-900">
          Flight ID: {flight.id}
        </h2>
        <p className="text-gray-700 mb-1 text-sm">
          <strong>Source:</strong> {flight.source}
        </p>
        <p className="text-gray-700 mb-1 text-sm">
          <strong>Destination:</strong> {flight.destination}
        </p>
        <p className="text-gray-700 mb-1 text-sm">
          <strong>Current Location:</strong> {flight.currentLocation}
        </p>
        <p className="text-gray-700 text-sm">
          <strong>Pilot:</strong> {flight.user}
        </p>
      </div>
    ))
  ) : (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-10 bg-gray-100 rounded-lg">
      <p className="text-red-600 text-lg font-medium">No active flights</p>
    </div>
  )}
</div>



    </div>
  );
};

export default AirlineView;
