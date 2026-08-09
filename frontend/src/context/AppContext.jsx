import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLOggedin] = useState(false);
  const [userData, setUserData] = useState(false);
  const [doctorData, setDoctorData] = useState(false);
  const [loading, setLoading] = useState(true)
  const [activePatientCustomId, setActivePatientCustomId] = useState(null);

  // Send cookies with Axios requests
  axios.defaults.withCredentials = true;

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLOggedin(true);
        // Try fetching both or load according to account type
        getUserData();
        getDoctorData();
      }
    } catch (error) {
      setIsLOggedin(false);
      console.error("Auth state error:", error.message);
    }finally {
      setLoading(false); // End loading when check finishes
    }
  };

  // User data fetch 
  const getUserData = async () => {
    try {
      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.get(`${baseUrl}/api/user/data`);

      if (data.success) {
        setUserData(data.userData);
        setIsLOggedin(true);
      } else {
        // Log quietly instead of throwing toast.error("User not found") 
        // when logged in as a Doctor
        console.log("User profile check:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  // Doctor data fetch
  const getDoctorData = async () => {
    try {
      const baseUrl = backendUrl?.endsWith("/")
        ? backendUrl.slice(0, -1)
        : backendUrl;

      const { data } = await axios.get(`${baseUrl}/api/doctor/doctor-data`);

      if (data.success) {
        setDoctorData(data.userData);
        setIsLOggedin(true);
      } else {
        // Log quietly instead of throwing toast.error("User not found") 
        // when logged in as a Patient/User
        console.log("Doctor profile check:", data.message);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error.message);
    }
  };

  const checkActiveSession = useCallback(async () => {
    try {
      axios.defaults.withCredentials = true;
      const baseUrl = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
      const { data } = await axios.get(`${baseUrl}/api/doctor/current-active-session`);

      if (data.success && data.patientCustomId) {
        setActivePatientCustomId(data.patientCustomId);
      } else {
        setActivePatientCustomId(null);
      }
    } catch (error) {
      console.error("Error checking active session:", error);
      setActivePatientCustomId(null);
    }
  }, [backendUrl]);

  // Fetch authentication/user status on initial application load
  useEffect(() => {
    getUserData();
    getDoctorData();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLOggedin,
    userData,
    setUserData,
    doctorData,
    setDoctorData,
    getUserData,
    getAuthState,
    getDoctorData,
    activePatientCustomId,
    setActivePatientCustomId,
    checkActiveSession,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};