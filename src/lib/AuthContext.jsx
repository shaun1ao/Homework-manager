import { createContext, useContext, useEffect, useState } from "react";
import { getOrCreateTeacher, updateTeacherCredentials } from "./db";

const AuthContext = createContext(null);

const SESSION_KEY = "homework-manager-logged-in";

export function AuthProvider({ children }) {
  const [teacher, setTeacher] = useState(null);
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem(SESSION_KEY) === "true"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrCreateTeacher()
      .then(setTeacher)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const current = await getOrCreateTeacher();
    if (username === current.username && password === current.password) {
      setTeacher(current);
      setLoggedIn(true);
      localStorage.setItem(SESSION_KEY, "true");
      return true;
    }
    return false;
  }

  function logout() {
    setLoggedIn(false);
    localStorage.removeItem(SESSION_KEY);
  }

  async function changeCredentials(updates) {
    await updateTeacherCredentials(updates);
    setTeacher((prev) => ({ ...prev, ...updates }));
  }

  return (
    <AuthContext.Provider
      value={{ teacher, loggedIn, loading, error, login, logout, changeCredentials }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
