/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    if (token && userType) {
      setIsAuthenticated(true);
      setUserType(userType);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, userType, navigate) => {
    const SERVER_LINK = import.meta.env.VITE_CLIENT_USER_APIURL;
    const encryptionKey = 'airbusaerothon6';
    console.log(SERVER_LINK, encryptionKey);
    try {
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify({ email, password, userType }),
        encryptionKey
      ).toString();
      const response = await axios.post(SERVER_LINK + "login", {
        data: encryptedData,
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userType", userType);
        localStorage.setItem("userName", email);
        setIsAuthenticated(true);
        setUserType(userType);
        if (userType === "pilot") {
          navigate("/pilot/home", { replace: true });
        } else if (userType === "airline") {
          navigate("/airline/home", { replace: true });
        }
      } else {
        console.error("Sign in failed");
      }
    } catch (error) {
      console.error("Error occurred while signing in:", error);
    }
  };

  const logout = (navigate) => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    setIsAuthenticated(false);
    setUserType(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userType, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
