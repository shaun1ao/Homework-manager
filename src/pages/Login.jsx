import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { IconAcademicCap, IconAlertCircle } from "../components/icons";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const ok = await login(username.trim(), password);
    setSubmitting(false);
    if (!ok) setError("Incorrect username or password.");
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <IconAcademicCap size={24} />
        </div>
        <h1>Homework Manager</h1>
        <p className="auth-subtitle">Sign in to manage classes and assignments</p>

        <label className="field">
          <span>Username</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            autoComplete="username"
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && (
          <div className="error-text">
            <IconAlertCircle size={16} />
            {error}
          </div>
        )}

        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
