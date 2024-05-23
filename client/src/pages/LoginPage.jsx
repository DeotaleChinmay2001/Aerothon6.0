import { useState } from "react";
import { useNavigate } from "react-router-dom";
import googleSVG from "../assets/google.svg";
import PlaneImage from "../assets/Plane.jpg";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");

  function handleChange(e) {
    setUserType(e.target.value);
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    login(email, password, userType, navigate);
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 h-screen">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
        <form className="flex flex-col flex-start justify-center p-6">
          <span className="mb-2 text-3xl font-bold text-center">Airbus Aerothon</span>
          <div className="py-2">
            <span className="mb-1 text-sm">Email</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md placeholder-light placeholder-gray-500"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div className="py-2">
            <span className="mb-1 text-sm">Password</span>
            <input
              type="password"
              name="pass"
              id="pass"
              className="w-full p-2 border border-gray-300 rounded-md placeholder-light placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <div className="py-2">
            <span className="mb-1 text-sm">Select User Type</span>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              name="userType"
              id="userType"
              value={userType}
              onChange={handleChange}
            >
              <option value="">select</option>
              <option value="pilot">Pilot</option>
              <option value="airline">Airline</option>
            </select>
          </div>

          <button
            className="w-full bg-black text-white p-2 rounded-lg mb-4 hover:bg-white hover:text-black hover:border hover:border-gray-300"
            onClick={handleSignIn}
          >
            Sign in
          </button>
          <button className="w-full border border-gray-300 text-sm p-2 rounded-lg mb-4 hover:bg-black hover:text-white">
            <img
              src={googleSVG}
              alt="Google Logo"
              className="w-6 h-6 inline mr-2"
            />
            Sign in with Google
          </button>
        </form>
        <div className="relative flex-shrink-0">
          <img
            src={PlaneImage}
            alt="Plane Image"
            className="w-full h-full md:w-[400px] md:h-full md:max-h-full rounded-r-2xl object-cover md:object-center"
          />
          <div className="absolute bottom-4 right-4 p-4 bg-white bg-opacity-30 backdrop-blur-sm rounded-lg shadow-md md:hidden">
            <span className="text-white text-lg">Airbus Aerothon</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
