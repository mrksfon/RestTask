import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import {
  DASHBOARD,
  CONFIGURATION,
  CREATE_AUCTION_ITEM,
  EDIT_AUCTION_ITEM,
  HOME_PAGE,
  LOGIN_PAGE,
  SHOW_AUCTION_ITEM,
} from "../constants/routes";
import useAuth from "../hooks/useAuth";
import AuctionItemShow from "../pages/AuctionItemShow";
import Configuration from "../pages/Configuration";
import CreateAuctionItem from "../pages/CreateAuctionItem";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Nomatch from "../pages/Nomatch";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const ProtectedRouteAdmin = ({ children }) => {
  const { token, isAdmin } = useAuth();

  if (!token) {
    return <Navigate to={LOGIN_PAGE} replace />;
  }

  if (token && !isAdmin) {
    return <Navigate to={DASHBOARD} replace />;
  }
  return children;
};

const Router = () => {
  return (
    <Routes>
      <Route path={HOME_PAGE} element={<Home />} />
      <Route path={LOGIN_PAGE} element={<Login />} />
      <Route
        path={DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={DASHBOARD}
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path={CONFIGURATION}
        element={
          <ProtectedRoute>
            <Configuration />
          </ProtectedRoute>
        }
      />
      <Route
        path={CREATE_AUCTION_ITEM}
        element={
          <ProtectedRouteAdmin>
            <CreateAuctionItem />
          </ProtectedRouteAdmin>
        }
      />
      <Route path="*" element={<Nomatch />} />
    </Routes>
  );
};

export default Router;