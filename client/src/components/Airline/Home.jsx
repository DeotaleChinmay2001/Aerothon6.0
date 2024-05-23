import Navbar from "./Navbar";
import Dashboard from "../pages/DashboardPage";
import Activity from "../pages/ActivityPage";
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../redux/tabSlice';

const Home = () => {
  const activeTab = useSelector((state) => state.tab);
  const dispatch = useDispatch();

  const handleTabChange = (changedTab) => {
    dispatch(setActiveTab(changedTab));
  };

  return (
    <>
      <div className="flex">
        <Navbar handleTabChange={handleTabChange} />
        <main className="grow">
          {activeTab === 'Dashboard' && <Dashboard />}
          {activeTab === 'Activity' && <Activity />}
          {activeTab === 'Transactions' && <>Transaction</>}
        </main>
      </div>
    </>
  );
};

export default Home;
