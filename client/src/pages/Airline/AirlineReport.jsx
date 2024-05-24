import { useEffect, useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const VITE_CLIENT_REPORT_APIURL = import.meta.env.VITE_CLIENT_REPORT_APIURL;
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          VITE_CLIENT_REPORT_APIURL + "allreports"
        );
        setReports(response.data);
        console.log(response.data); 
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [VITE_CLIENT_REPORT_APIURL]);

  const convertReportDetails = (report) => {
    return {
      id: report.flightId,
      source: report.coordinate.source.City,
      destination: report.coordinate.destination.City,
      currentLocation: `Lat: ${report.currentLocation.latitude}, Lon: ${report.currentLocation.longitude}`,
      user: report.User
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
          <p className="text-gray-600 mb-2"><strong>Source:</strong> {selectedReport.source}</p>
          <p className="text-gray-600 mb-2"><strong>Destination:</strong> {selectedReport.destination}</p>
          <p className="text-gray-600 mb-2"><strong>Current Location:</strong> {selectedReport.currentLocation}</p>
          {/* Add other details as needed */}
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
``