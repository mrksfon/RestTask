import React, { createContext, useContext, useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  Navigate,
} from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const AuthContext = createContext(null);

const App = () => {
  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    const token = await fakeAuth();

    setToken(token);
  };

  const handleLogout = () => {
    setToken(null);
  };
  return (
    <>
      <AuthProvider>
        <h1>React Router</h1>

        <Navigation token={token} onLogout={handleLogout} />

        <Routes>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </AuthProvider>
    </>
  );
};

const Navigation = () => {
  const { token, onLogout } = useAuth();
  return (
    <nav>
      <NavLink to="/home">Home</NavLink>
      <NavLink to="/dashboard">DashBoard</NavLink>
      {token && (
        <button type="button" onClick={onLogout}>
          Sign Out
        </button>
      )}
    </nav>
  );
};

const fakeAuth = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve("2342f2f1d131rf12"), 250);
  });

const Home = () => {
  const { onLogin } = useAuth();
  return (
    <>
      <h2>Home (public)</h2>

      <button type="button" onClick={onLogin}>
        Sign In
      </button>
    </>
  );
};

const DashBoard = () => {
  const { token } = useAuth();

  return (
    <>
      <h2>DashBoard (protected)</h2>

      <div>Authenticated as {token}</div>
    </>
  );
};

const NoMatch = () => {
  return (
    <>
      <h3>NoMatch</h3>
    </>
  );
};

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    const token = await fakeAuth();

    setToken(token);

    navigate("/dashboard");
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  return useContext(AuthContext);
};

export default App;
