import { useState } from "react";
// import { useSocket } from "../context/SocketProvider";

const flightsData = [
  {
    id: "0001",
    source: "New York",
    destination: "London",
    currentLocation: "Over Atlantic Ocean",
  },
  {
    id: "0002",
    source: "San Francisco",
    destination: "Tokyo",
    currentLocation: "Over Pacific Ocean",
  },
  {
    id: "0003",
    source: "Los Angeles",
    destination: "Paris",
    currentLocation: "Over Europe",
  },
  {
    id: "0004",
    source: "Chicago",
    destination: "Dubai",
    currentLocation: "Over North America",
  },
  {
    id: "0005",
    source: "Miami",
    destination: "Toronto",
    currentLocation: "Over North America",
  },
  {
    id: "0006",
    source: "Houston",
    destination: "Sydney",
    currentLocation: "Over Pacific Ocean",
  },
  {
    id: "0007",
    source: "Seattle",
    destination: "Hong Kong",
    currentLocation: "Over Pacific Ocean",
  },
  {
    id: "0008",
    source: "Boston",
    destination: "Singapore",
    currentLocation: "Over Pacific Ocean",
  },
  {
    id: "0009",
    source: "Denver",
    destination: "Berlin",
    currentLocation: "Over Atlantic Ocean",
  },
  {
    id: "0010",
    source: "Atlanta",
    destination: "Madrid",
    currentLocation: "Over Atlantic Ocean",
  },
  {
    id: "0011",
    source: "Washington DC",
    destination: "Amsterdam",
    currentLocation: "Over Atlantic Ocean",
  },
  {
    id: "0012",
    source: "Las Vegas",
    destination: "Rome",
    currentLocation: "Over Atlantic Ocean",
  },
  {
    id: "0013",
    source: "Phoenix",
    destination: "Moscow",
    currentLocation: "Over Atlantic Ocean",
  },
  {
    id: "0014",
    source: "Dallas",
    destination: "Beijing",
    currentLocation: "Over Pacific Ocean",
  },
  {
    id: "0015",
    source: "Orlando",
    destination: "Rio de Janeiro",
    currentLocation: "Over South America",
  },
  {
    id: "0016",
    source: "San Diego",
    destination: "Seoul",
    currentLocation: "Over Pacific Ocean",
  },
  {
    id: "0017",
    source: "Philadelphia",
    destination: "Cairo",
    currentLocation: "Over Atlantic Ocean",
  },
  {
    id: "0018",
    source: "San Antonio",
    destination: "Bangkok",
    currentLocation: "Over Pacific Ocean",
  },
  {
    id: "0019",
    source: "Detroit",
    destination: "Athens",
    currentLocation: "Over Atlantic Ocean",
  },
  {
    id: "0020",
    source: "Charlotte",
    destination: "Johannesburg",
    currentLocation: "Over Africa",
  },
];

const AirlineView = () => {
//   const {
//     socket
//   } = useSocket();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredFlights = flightsData.filter(
    (flight) =>
      flight.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.currentLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.id.includes(searchTerm)
  );

  return (
    <div className="flex flex-col py-10 lg:px-16 md:px-10 px-6 h-screen overflow-y-auto w-full">
      <h2 className="lg:text-3xl md:text-2xl text-xl mb-4">
        AirLine Dashboard
      </h2>

      <div className="py-4">
        <input
          type="text"
          placeholder="Search for a flight"
          className="p-3 border rounded w-full md:w-1/2 lg:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
        {filteredFlights.map((flight) => (
          <div
            key={flight.id}
            className="flex flex-col rounded-lg shadow-lg border p-6 h-full justify-center bg-white"
          >
            <h2 className="text-lg font-semibold mb-2">
              Flight ID: {flight.id}
            </h2>
            <p className="text-gray-700 mb-1">
              <strong>Source:</strong> {flight.source}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Destination:</strong> {flight.destination}
            </p>
            <p className="text-gray-700">
              <strong>Current Location:</strong> {flight.currentLocation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirlineView;
