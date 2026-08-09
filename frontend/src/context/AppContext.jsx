import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLOggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  // Send cookies with Axios requests
  axios.defaults.withCredentials = true;

  const getUserData = async () => {
    try {
      // Standardize base URL trailing slashes
      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.get(`${baseUrl}/api/user/data`);

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      toast.error(errorMessage);
    }
  };

  // FIX: Fetch authentication/user status on initial application load
  useEffect(() => {
    getUserData();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLOggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};