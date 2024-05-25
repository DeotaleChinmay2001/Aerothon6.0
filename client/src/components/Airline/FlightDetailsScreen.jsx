/* eslint-disable react/prop-types */
import AirlineMap from "./AirlineMap";

const FlightDetailsView = ({ flight, onBack }) => {
    return (
    <div className="bg-white flex flex-col py-6 lg:px-12 md:px-8 px-4 h-screen overflow-y-auto w-full">
      <div className="h-full overflow-y-auto">
        <div className="rounded-lg shadow-md p-6">
          <button 
            onClick={onBack} 
            className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Back to List
          </button>
          <h2 className="text-lg font-semibold mb-4">Flight ID: {flight.id}</h2>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div className="flex flex-col mb-2">
              <p className="text-gray-700 mr-2">Source:</p>
              <p className="text-gray-900 font-semibold text-blue-600">{flight.source}</p>
            </div>
            <div className="flex flex-col mb-2">
              <p className="text-gray-700 mr-2">Destination:</p>
              <p className="text-gray-900 font-semibold text-blue-600">{flight.destination}</p>
            </div>
            <div className="flex flex-col mb-2">
              <p className="text-gray-700 mr-2">Pilot:</p>
              <p className="text-gray-900 font-semibold text-blue-600">{flight.user}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-1 text-sm">
            <strong>Current Location:</strong> {flight.currentLocation}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
  {/* Box 1: Total Passengers */}
  <div className="bg-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
    <div className="text-gray-700 text-lg font-semibold">Paused</div>
    <div className="text-blue-600 text-3xl font-bold mt-2">{flight.planePaused}</div> 
  </div>

  {/* Box 2: Altitude */}
  <div className="bg-green-200 rounded-lg p-4 flex flex-col items-center justify-center">
    <div className="text-gray-700 text-lg font-semibold">Weather Error</div>
    <div className="text-blue-600 text-3xl font-bold mt-2">{flight.weatherError}</div>
  </div>

  {/* Box 3: Speed */}
  <div className="bg-yellow-200 rounded-lg p-4 flex flex-col items-center justify-center">
    <div className="text-gray-700 text-lg font-semibold">Sensor Error</div>
    <div className="text-blue-600 text-3xl font-bold mt-2">{flight.sensorErrorCount}</div>
  </div>

  {/* Box 4: Estimated Arrival Time */}
  <div className="bg-red-200 rounded-lg p-4 flex flex-col items-center justify-center">
    <div className="text-gray-700 text-lg font-semibold">Status</div>
    <div className={`text-3xl font-bold mt-2 ${flight.status === 0 ? 'text-green-600' : 'text-red-600'}`}>
      {flight.status === 0 ? 'Active' : 'Inactive'}
    </div>
  </div>
</div>

        </div>
        <AirlineMap
          source={flight.sourceDet}
          destination={flight.destDet}
          lat={flight.latitude}
          lon={flight.longitude}
          planePath={flight.planePath}
        />
      </div>
    </div>
    
  );
};

export default FlightDetailsView;