import {
  createContext,
  useState,
  useContext,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
} from "../services/authService";

const AuthContext = createContext();
const GUEST_TOKEN = "guest-demo-token";
const GUEST_USER = { username: "Guest", email: "guest@local" };

export const useAuth = () => useContext(AuthContext);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(readStoredUser);
  const isGuestMode = token === GUEST_TOKEN;

  const persistSession = (nextToken, nextUser) => {
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
  };

  const login = async (username, password) => {
    const res = await apiLogin(username, password);
    const nextUser = { username: res.username, email: res.email };
    setToken(res.token);
    setUser(nextUser);
    persistSession(res.token, nextUser);
  };

  const register = async (username, password) => {
    const res = await apiRegister(username, password);
    const nextUser = { username: res.username, email: res.email };
    setToken(res.token);
    setUser(nextUser);
    persistSession(res.token, nextUser);
  };

  const enterGuestMode = () => {
    setToken(GUEST_TOKEN);
    setUser(GUEST_USER);
    persistSession(GUEST_TOKEN, GUEST_USER);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, login, register, logout, enterGuestMode, isGuestMode }}
    >
      {children}
    </AuthContext.Provider>
  );
};
