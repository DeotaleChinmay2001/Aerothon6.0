import Navbar from "./Navbar";
// import Dashboard from "../pages/DashboardPage";
import Activity from "../pages/ActivityPage";
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../redux/tabSlice';
import {

  LogOutIcon,
  NavigationIcon, 
  ActivityIcon, 
  FileTextIcon
} from "lucide-react";
import Reports from "../pages/PilotReports";
import SensorData from "../pages/SensorData";

const navLinks = [
  {
    link: "Navigation",
    icon: NavigationIcon, 
  },
  {
    link: "Sensors",
    icon: ActivityIcon, 
  },
  {
    link: "Reports",
    icon: FileTextIcon, 
  },
  {
    link: "Logout",
    icon: LogOutIcon,
  },
];




const Home = () => {
  const activeTab = useSelector((state) => state.tab);
  const dispatch = useDispatch();

  const handleTabChange = (changedTab) => {
    dispatch(setActiveTab(changedTab));
  };

  return (
    <>
      <div className="flex">
      <Navbar navLinks={navLinks} handleTabChange={handleTabChange} />
        <main className="grow">
          {activeTab === 'Navigation' && <Activity />}
          {activeTab === 'Sensors' && <SensorData/>}
          {activeTab === 'Reports' && <Reports/>}
        </main>
      </div>
    </>
  );
};

export default Home;
