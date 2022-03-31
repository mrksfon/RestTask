import React from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { onLogin } = useAuth();
  console.log("usao ovde");
  return (
    <>
      <button type="button" onClick={onLogin}>
        Sign In
      </button>
    </>
  );
};

export default Login;
