import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [loginErrors, setLoginErrors] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [alertNotification, setAlertNotification] = useState(0);

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email: email,
        password: password,
      });

      const { data } = response;

      setUser(data.user);
      setToken(data.token);
      setIsAdmin(data.user.is_admin);
      localStorage.setItem("auction_token", token);
      setLoginErrors(null);
    } catch (err) {
      setLoginErrors(err.response.data);
    }

    navigate("/dashboard");
  };

  const handleLogout = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/logout",
        null,
        config
      );

      setUser(null);
      setIsAdmin(false);
      setToken(null);
    } catch (err) {
      setLoginErrors(err.response.data);
    }

    setLoginErrors(null);

    navigate("/login");
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
    isAdmin,
    setEmail,
    setPassword,
    loginErrors,
    user,
    setLoginErrors,
    navigate,
    setBidAmount,
    notificationCount,
    setNotificationCount,
    setAlertNotification,
    email,
    password,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default function useAuth() {
  return useContext(AuthContext);
}
