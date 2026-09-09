import { useState } from "react";
import { useAuth } from "../lib/AuthContext";
import { IconAlertCircle, IconLock } from "../components/icons";

export default function SettingsPage() {
  const { teacher, changeCredentials } = useAuth();
  const [username, setUsername] = useState(teacher?.username ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!username.trim()) {
      setError("Username can't be empty.");
      return;
    }
    if (password && password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    const updates = { username: username.trim() };
    if (password) updates.password = password;

    await changeCredentials(updates);
    setPassword("");
    setConfirmPassword("");
    setStatus("Saved.");
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p className="page-subtitle">Update your sign-in credentials.</p>
        </div>
      </div>

      <form className="panel-form panel-form-narrow" onSubmit={handleSubmit}>
        <label className="field">
          <span>Username</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>

        <label className="field">
          <span>New password</span>
          <input
            type="password"
            placeholder="Leave blank to keep current password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label className="field">
          <span>Confirm new password</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>

        {error && (
          <div className="error-text">
            <IconAlertCircle size={16} />
            {error}
          </div>
        )}
        {status && (
          <div className="success-text">
            <IconLock size={16} />
            {status}
          </div>
        )}

        <button className="btn btn-primary" type="submit">
          Save changes
        </button>
      </form>
    </div>
  );
}
