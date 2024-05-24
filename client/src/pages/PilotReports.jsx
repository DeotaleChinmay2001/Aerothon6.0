import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const VITE_CLIENT_REPORT_APIURL = import.meta.env.VITE_CLIENT_REPORT_APIURL;
  const [reports, setReports] = useState([]);
  const { userName } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log("user", userName);
        const response = await axios.get(
          VITE_CLIENT_REPORT_APIURL + 'user/' + userName
        );
        setReports(response.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, [userName]);

  const convertReportDetails = (report) => {
    console.log("report=========================",report)
    return {
      id: report.flightId,
      source: report.coordinate.City,
      destination: report.coordinate.destination.City,
      currentLocation: `Lat: ${report.currentLocation.latitude}, Lon: ${report.currentLocation.longitude}`,
      user: report.User,
      sourceDet:report.coordinate.source,
      destinationDet:report.coordinate.destination,
      paused:report.planePaused,
      sensorErrorCount:report.sensorErrorCount,
      weatherError:report.weatherError,
      status:report.status 
    };
  };

  if (selectedReport) {
    return (
      <div className="flex flex-col py-4 lg:px-12 md:px-8 px-4 h-screen overflow-y-auto w-full">
      <div className="bg-white rounded-lg shadow-md p-6">
        <button 
          onClick={() => setSelectedReport(null)} 
          className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back to List
        </button>
        <h2 className="text-3xl mb-4">Report Details</h2>
        <p className="text-lg font-semibold">Report ID: {selectedReport.id}</p>
        <p className="text-gray-600 mb-2"><strong>User:</strong> {selectedReport.user}</p>
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-lime-200 rounded-lg p-4">
            <div className="text-gray-700 text-lg font-semibold mb-2">From</div>
            <div className="text-blue-600 text-2xl font-bold mb-2">{selectedReport.sourceDet.ICAO}</div>
            <div className="text-gray-600 text-sm">
              <div className="mb-2">
                <span className="font-semibold">City: </span><span>{selectedReport.sourceDet.City}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Country: </span><span>{selectedReport.sourceDet.Country}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">IATA: </span><span>{selectedReport.sourceDet.IATA}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Latitude: </span><span>{selectedReport.sourceDet.Latitude}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Longitude: </span><span>{selectedReport.sourceDet.Longitude}</span>
              </div>
              <div>
                <span className="font-semibold">Name: </span><span>{selectedReport.sourceDet.Name}</span>
              </div>
            </div>
          </div>
    
          <div className="bg-cyan-200 rounded-lg p-4">
            <div className="text-gray-700 text-lg font-semibold mb-2">To</div>
            <div className="text-blue-600 text-2xl font-bold mb-2">{selectedReport.destinationDet.ICAO}</div>
            <div className="text-gray-600 text-sm">
            <div className="mb-2">
                <span className="font-semibold">City: </span><span>{selectedReport.destinationDet.City}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Country: </span><span>{selectedReport.destinationDet.Country}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">IATA: </span><span>{selectedReport.destinationDet.IATA}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Latitude: </span><span>{selectedReport.destinationDet.Latitude}</span>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Longitude: </span><span>{selectedReport.destinationDet.Longitude}</span>
              </div>
              <div>
                <span className="font-semibold">Name: </span><span>{selectedReport.destinationDet.Name}</span>
              </div>
            </div>
          </div>
        </div>
    
       
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Box 1: Total Passengers */}
        <div className="bg-gray-200 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="text-gray-700 text-lg font-semibold">Paused</div>
          <div className="text-blue-600 text-3xl font-bold mt-2">{selectedReport.paused}</div> 
        </div>

        {/* Box 2: Altitude */}
        <div className="bg-green-200 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="text-gray-700 text-lg font-semibold">Weather Error</div>
          <div className="text-blue-600 text-3xl font-bold mt-2">{selectedReport.weatherError} </div>
        </div>

        {/* Box 3: Speed */}
        <div className="bg-yellow-200 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="text-gray-700 text-lg font-semibold">Sensor Error </div>
          <div className="text-blue-600 text-3xl font-bold mt-2">{selectedReport.sensorErrorCount} </div>
        </div>

        {/* Box 4: Estimated Arrival Time */}
        <div className="bg-red-200 rounded-lg p-4 flex flex-col items-center justify-center">
          <div className="text-gray-700 text-lg font-semibold">Status</div>
          <div className={`text-3xl font-bold mt-2 ${selectedReport.status === 0 ? 'text-green-600' : 'text-red-600'}`}>
            {selectedReport.status === 0 ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>
    </div>
    </div>
    );
  }

  return (
    <div className="flex flex-col py-4 lg:px-12 md:px-8 px-4 h-screen overflow-y-auto w-full">
      <h2 className="text-3xl mb-4">Reports</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-3">
        {reports.length > 0 ? (
          reports.map((report) => {
            const formattedReport = convertReportDetails(report);
            return (
              <div
                key={formattedReport.id}
                className="flex flex-col rounded-lg shadow-lg border p-4 h-full justify-center bg-white cursor-pointer hover:shadow-xl transition-shadow duration-200"
                onClick={() => setSelectedReport(formattedReport)}
              >
                <h2 className="text-lg font-semibold mb-2 text-gray-900">
                  Report ID: {formattedReport.id}
                </h2>
                <p className="text-gray-700 mb-1 text-sm">
                  <strong>Source:</strong> {formattedReport.source}
                </p>
                <p className="text-gray-700 mb-1 text-sm">
                  <strong>Destination:</strong> {formattedReport.destination}
                </p>
                <p className="text-gray-700 text-sm">
                  <strong>User:</strong> {formattedReport.user}
                </p>
              </div>
            );
          })
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-10 bg-gray-100 rounded-lg">
            <p className="text-red-600 text-lg font-medium">No reports</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
