import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const user = sessionStorage.getItem("user"); 

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
