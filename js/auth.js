import { getOrCreateTeacher, updateTeacherCredentials } from "./db.js";

const SESSION_KEY = "homework-manager-logged-in";
const USERNAME_KEY = "homework-manager-username";

export function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === "true";
}

export function currentUsername() {
  return localStorage.getItem(USERNAME_KEY) || "";
}

// Redirects to the login page if there's no active session. Call this at
// the top of every protected page before rendering anything.
export function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = "index.html";
  }
}

export async function login(username, password) {
  const current = await getOrCreateTeacher();
  if (username === current.username && password === current.password) {
    localStorage.setItem(SESSION_KEY, "true");
    localStorage.setItem(USERNAME_KEY, current.username);
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USERNAME_KEY);
  window.location.href = "index.html";
}

export async function changeCredentials(updates) {
  await updateTeacherCredentials(updates);
  if (updates.username) {
    localStorage.setItem(USERNAME_KEY, updates.username);
  }
}

// Fills in the sidebar's user initials/name and wires up the logout button.
// Expects the sidebar markup shared across every protected page (see
// partials in each .html file): #sidebarInitials, #sidebarUsername, #logoutBtn.
export function initSidebar() {
  const name = currentUsername() || "?";
  const initialsEl = document.getElementById("sidebarInitials");
  const nameEl = document.getElementById("sidebarUsername");
  if (initialsEl) initialsEl.textContent = name.slice(0, 2).toUpperCase();
  if (nameEl) nameEl.textContent = name;

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
}
