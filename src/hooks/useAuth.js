import { createContext, useContext, useMemo, useState } from "react";
import { json, useNavigate } from "react-router-dom";

const AuthContext = createContext();

// https://blog.logrocket.com/complete-guide-authentication-with-react-router-v6
export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const navigate = useNavigate();

  const login = async user => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    navigate("/", { replace: true });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate("/", { replace: true });
  };

  const provided = useMemo(() => ({ user, login, logout }), [user]);

  return (
    <AuthContext.Provider value={provided}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);