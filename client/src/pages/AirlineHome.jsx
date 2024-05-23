import { useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../redux/tabSlice';
import AirlineView from '../components/Airline/AirlineDashboard'
import {
  NavigationIcon, 
  FileTextIcon, 
  LogOutIcon,
} from "lucide-react";

const navLinks = [
  {
    link: "Active Flights",
    icon: NavigationIcon, 
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



const AirlineDashboard = () => {
  const activeTab = useSelector((state) => state.tab);
  const dispatch = useDispatch();

  const handleTabChange = (changedTab) => {
    dispatch(setActiveTab(changedTab));
  };


  // const [activeSimulations, setActiveSimulations] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit("setRole", "airline");
      socket.emit("getAllSimulations");
      socket.on("updateActiveSimulations", (data)=>{
        console.log("data", data);
      })
      return () => {
        socket.disconnect();
      };
    }
  }, []);

  return (
    <>
      <div className="flex">
      <Navbar navLinks={navLinks} handleTabChange={handleTabChange} />
        <main className="grow">
          {activeTab === 'Active Flights' && <AirlineView/>}
          {activeTab === 'Activity' && <>Reports</>}
        </main>
      </div>
    </>
  );
};

export default AirlineDashboard;
