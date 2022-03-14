import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext({
  isAuthenticated: false,
  setAuthenticated: () => {},
});

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  function setAuthenticated(val) {
    if (!val) localStorage.removeItem("token");
    setIsAuthenticated(val);
  }
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthProtected() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  if (!isAuthenticated) {
    navigate("/signin");
    return false;
  }

  return true;
}

export function useNonAuthProtected() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  if (isAuthenticated) {
    navigate("/");
    return false;
  }

  return true;
}

export function useSetAuth() {
  const { setAuthenticated } = useContext(AuthContext);
  return setAuthenticated;
}
