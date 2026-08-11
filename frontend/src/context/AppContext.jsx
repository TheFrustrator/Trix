import axios from "axios";
import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLOggedin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [pharmacyData, setPharmacyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePatientCustomId, setActivePatientCustomId] = useState(null);

  const baseUrl = backendUrl?.endsWith("/")
    ? backendUrl.slice(0, -1)
    : backendUrl;

  // Configure Axios defaults & Interceptors
  axios.defaults.withCredentials = true;

  // Add an Axios Request Interceptor to dynamically attach the token on every request
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
        return true;
      }
      setUserData(null);
      return false;
    } catch (error) {
      setUserData(null);
      console.log(
        "User session error:",
        error.response?.data?.message || error.message
      );
      return false;
    }
  };

  const getDoctorData = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/doctor/doctor-data`);
      if (data.success) {
        setDoctorData(data.userData || data.doctorData);
        return true;
      }
      setDoctorData(null);
      return false;
    } catch (error) {
      setDoctorData(null);
      console.log(
        "Doctor session error:",
        error.response?.data?.message || error.message
      );
      return false;
    }
  };

  const getPharmacyData = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/api/pharmacy/pharmacy-data`);
      if (data.success) {
        setPharmacyData(
          data.pharmacyData || data.userData || data.data
        );
        return true;
      }
      setPharmacyData(null);
      return false;
    } catch (error) {
      setPharmacyData(null);
      console.log(
        "Pharmacy session error:",
        error.response?.data?.message || error.message
      );
      return false;
    }
  };

  const restoreSession = async () => {
    setLoading(true);

    try {
      // Check patient
      const userLoggedIn = await getUserData();
      if (userLoggedIn) {
        setIsLOggedin(true);
        return;
      }

      // Check doctor
      const doctorLoggedIn = await getDoctorData();
      if (doctorLoggedIn) {
        setIsLOggedin(true);
        return;
      }

      // Check pharmacy
      const pharmacyLoggedIn = await getPharmacyData();
      if (pharmacyLoggedIn) {
        setIsLOggedin(true);
        return;
      }

      // Nobody authenticated
      setIsLOggedin(false);
      setUserData(null);
      setDoctorData(null);
      setPharmacyData(null);
    } catch (error) {
      console.error("Session restoration failed:", error);
      setIsLOggedin(false);
      setUserData(null);
      setDoctorData(null);
      setPharmacyData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    restoreSession();
  }, []);

  const loginSuccess = async (token) => {
    if (token) localStorage.setItem("token", token);
    setLoading(true);
    try {
      const success = await getUserData();
      if (success) setIsLOggedin(true);
    } finally {
      setLoading(false);
    }
  };

  const doctorLoginSuccess = async (token) => {
    if (token) localStorage.setItem("token", token);
    setLoading(true);
    try {
      const success = await getDoctorData();
      if (success) setIsLOggedin(true);
    } finally {
      setLoading(false);
    }
  };

  const pharmacyLoginSuccess = async (token) => {
    if (token) localStorage.setItem("token", token);
    setLoading(true);
    try {
      const success = await getPharmacyData();
      if (success) setIsLOggedin(true);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${baseUrl}/api/auth/logout`, {});
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    } finally {
      localStorage.removeItem("token");
      setIsLOggedin(false);
      setUserData(null);
      setDoctorData(null);
      setPharmacyData(null);
    }
  };

  const pharmacyLogout = async () => {
    try {
      await axios.post(`${baseUrl}/api/pharmacy/logout`, {});
    } catch (error) {
      console.error(
        "Pharmacy logout error:",
        error.response?.data || error.message
      );
    } finally {
      localStorage.removeItem("token");
      setIsLOggedin(false);
      setPharmacyData(null);
    }
  };

  const checkActiveSession = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/doctor/current-active-session`
      );

      if (data.success && data.patientCustomId) {
        setActivePatientCustomId(data.patientCustomId);
      } else {
        setActivePatientCustomId(null);
      }
    } catch (error) {
      console.error("Error checking active session:", error);
      setActivePatientCustomId(null);
    }
  }, [baseUrl]);

  const value = {
    backendUrl,
    baseUrl,

    isLoggedin,
    setIsLOggedin,

    userData,
    setUserData,

    doctorData,
    setDoctorData,

    pharmacyData,
    setPharmacyData,

    loading,
    setLoading,

    getUserData,
    getDoctorData,
    getPharmacyData,

    loginSuccess,
    doctorLoginSuccess,
    pharmacyLoginSuccess,

    logout,
    pharmacyLogout,

    activePatientCustomId,
    setActivePatientCustomId,
    checkActiveSession,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};