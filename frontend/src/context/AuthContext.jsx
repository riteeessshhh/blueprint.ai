import { createContext, useState, useEffect } from "react";
import { login as loginAPI, register as registerAPI } from "../api/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email, password) => {
    const { data } = await loginAPI(email, password);
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  };

  const register = async (email, password) => {
    const { data } = await registerAPI(email, password);
    setUser(data);
    localStorage.setItem("userInfo", JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
