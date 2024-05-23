/* eslint-disable react/prop-types */
const FlightDetailsView = ({ flight, onBack }) => {
    return (
      <div className="flex flex-col py-6 lg:px-12 md:px-8 px-4 h-screen overflow-y-auto w-full">
        <button 
          onClick={onBack} 
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to List
        </button>
        <h2 className="text-lg font-semibold mb-4">Flight ID: {flight.id}</h2>
        <p className="text-gray-700 mb-2">
          <strong>Source:</strong> {flight.source}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Destination:</strong> {flight.destination}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Current Location:</strong> {flight.currentLocation}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Pilot:</strong> {flight.user}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Other details:</strong> Add other flight details here
        </p>
      </div>
    );
  };

export default FlightDetailsView;
