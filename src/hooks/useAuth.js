import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(true);
  const navigate = useNavigate();

  const login = async data => {
    setUser(data);
    navigate("/", { replace: true });
  };

  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const provided = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={ provided }>
      { children }
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);