import React, { useEffect } from "react";
import useAuth, { AuthProvider } from "./hooks/useAuth";
import Navigation from "./components/layout/Navigation";
import Router from "./components/Router";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Navigation />

        <Router />
      </AuthProvider>
    </>
  );
};

export default App;
