import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = async () => {
    const token = await fakeAuth();

    setToken(token);
    setIsAdmin(true);
    console.log("usao ovde");

    navigate("/dashboard");
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const fakeAuth = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve("2342f2f1d131rf12"), 250);
  });

export default function useAuth() {
  return useContext(AuthContext);
}
