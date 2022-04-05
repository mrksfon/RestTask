import React from "react";
import { AuthProvider } from "./hooks/useAuth";
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
