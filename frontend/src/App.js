import React, { useEffect } from "react";
import useAuth, { AuthProvider } from "./hooks/useAuth";
import Navigation from "./components/layout/Navigation";
import Router from "./components/Router";
import AlertNotification from "./components/layout/AlertNotification";
import Pusher from "pusher-js";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Navigation />
        {/* <AlertNotification /> */}

        <Router />
      </AuthProvider>
    </>
  );
};

export default App;
