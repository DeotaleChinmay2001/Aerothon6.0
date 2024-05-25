import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import PageNotFound from "./pages/404Page";
import Home from "./components/Home";
import Welcome from "./pages/Welcome";
import { useAuth } from "./context/AuthContext";
import AirlineDashboard from "./pages/Airline/AirlineHome";

const App = () => {
  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/airline/home"
        element={isAuthenticated && userType === "airline" ?<AirlineDashboard/>: <Navigate to="/login" />}
      />
      <Route
        path="/pilot/home"
        element={isAuthenticated && userType === "pilot" ? <Home /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
