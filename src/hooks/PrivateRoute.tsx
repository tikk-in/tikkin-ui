import { Navigate } from 'react-router-dom';
import {useAuth} from "./AuthContext.tsx";
import React from "react";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  if (!auth?.token || auth.token === "") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
