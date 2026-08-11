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

  // Configure Axios defaults
  axios.defaults.withCredentials = true;

  // Axios Request Interceptor: Automatically attaches Authorization Bearer token from localStorage
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

  const getUserData = async (overrideToken) => {
    try {
      const token = overrideToken || localStorage.getItem("token");
      const { data } = await axios.get(`${baseUrl}/api/user/data`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (data.success) {
        setUserData(data.userData);
        return true;
      }
      setUserData(null);
      return false;
    } catch (error) {
      setUserData(null);
      return false;
    }
  };

  const getDoctorData = async (overrideToken) => {
    try {
      const token = overrideToken || localStorage.getItem("token");
      const { data } = await axios.get(`${baseUrl}/api/doctor/doctor-data`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (data.success) {
        setDoctorData(data.userData || data.doctorData);
        return true;
      }
      setDoctorData(null);
      return false;
    } catch (error) {
      setDoctorData(null);
      return false;
    }
  };

  const getPharmacyData = async (overrideToken) => {
    try {
      const token = overrideToken || localStorage.getItem("token");
      const { data } = await axios.get(`${baseUrl}/api/pharmacy/pharmacy-data`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

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
      return false;
    }
  };

  const restoreSession = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setIsLOggedin(false);
      return;
    }

    setLoading(true);
    try {
      // Check patient role first
      const userLoggedIn = await getUserData(token);
      if (userLoggedIn) {
        setIsLOggedin(true);
        return;
      }

      // Check doctor role next
      const doctorLoggedIn = await getDoctorData(token);
      if (doctorLoggedIn) {
        setIsLOggedin(true);
        return;
      }

      // Check pharmacy role next
      const pharmacyLoggedIn = await getPharmacyData(token);
      if (pharmacyLoggedIn) {
        setIsLOggedin(true);
        return;
      }

      // If token is invalid or expired
      localStorage.removeItem("token");
      setIsLOggedin(false);
    } catch (error) {
      console.error("Session restoration failed:", error);
      setIsLOggedin(false);
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
      const success = await getUserData(token);
      if (success) setIsLOggedin(true);
    } finally {
      setLoading(false);
    }
  };

  const doctorLoginSuccess = async (token) => {
    if (token) localStorage.setItem("token", token);
    setLoading(true);
    try {
      const success = await getDoctorData(token);
      if (success) setIsLOggedin(true);
    } finally {
      setLoading(false);
    }
  };

  const pharmacyLoginSuccess = async (token) => {
    if (token) localStorage.setItem("token", token);
    setLoading(true);
    try {
      const success = await getPharmacyData(token);
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