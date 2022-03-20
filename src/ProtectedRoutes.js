import { Navigate, Outlet } from "react-router-dom";
import { useAuthProtected } from "./effects/use-auth";
const ProtectedRoutes = () => {
  const isAuth = useAuthProtected();
  return isAuth ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoutes;
