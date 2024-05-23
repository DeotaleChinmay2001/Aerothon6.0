import {useEffect, useState} from 'react'
import axios from 'axios'
import {useAuth} from '../context/AuthContext'
const Reports = () => {
  const VITE_CLIENT_REPORT_APIURL = import.meta.env.VITE_CLIENT_REPORT_APIURL;
  const [/*reports*/, setReports] = useState([]);
  const {userName} = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          VITE_CLIENT_REPORT_APIURL + "user/" + userName
        );
        setReports(response.data);
        console.log("response" , response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="flex flex-col py-4 lg:px-12 md:px-8 px-4 h-screen overflow-y-auto w-full">
      <h2 className="text-3xl mb-4">Reports</h2>
    </div>
  );
};

export default Reports;
