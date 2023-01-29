import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { checkIsAuthenticated } from "../services/auth/isAuthenticated";
import { Props } from "../types/utils";
import { loginPath } from "../utils/config";

const RequireAuth: React.FC<Props> = ({ children }) => {
  // Get the global state isAuthenticated from redux store management
  const isAuthenticated = checkIsAuthenticated();

  const location = useLocation();

  // const navigate = useNavigate();
  // console.log("isAuthenticated", isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;

  } else {
    return <>{children}</>;

  }

};

export default RequireAuth;
