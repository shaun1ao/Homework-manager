import { getOrCreateTeacher, updateTeacherCredentials, findStudentByCredentials } from "./db.js";

const SESSION_KEY = "homework-manager-logged-in";
const ROLE_KEY = "homework-manager-role";
const USERNAME_KEY = "homework-manager-username";
const STUDENT_ID_KEY = "homework-manager-student-id";

export function isLoggedIn() {
  return localStorage.getItem(SESSION_KEY) === "true";
}

export function currentRole() {
  return localStorage.getItem(ROLE_KEY) || "teacher";
}

export function currentUsername() {
  return localStorage.getItem(USERNAME_KEY) || "";
}

export function currentStudentId() {
  return localStorage.getItem(STUDENT_ID_KEY) || "";
}

// Teacher-only pages (classes, assignments management, settings).
export function requireTeacherAuth() {
  if (!isLoggedIn()) {
    window.location.href = "index.html";
  } else if (currentRole() !== "teacher") {
    window.location.href = "student.html";
  }
}

// The student's own assignments page.
export function requireStudentAuth() {
  if (!isLoggedIn()) {
    window.location.href = "index.html";
  } else if (currentRole() !== "student") {
    window.location.href = "classes.html";
  }
}

// Pages either role can see (the assignment detail page).
export function requireAnyAuth() {
  if (!isLoggedIn()) {
    window.location.href = "index.html";
  }
}

// Tries the teacher account first, then falls back to student credentials.
// Returns { role: "teacher" } | { role: "student", studentId, name } | null.
export async function login(username, password) {
  const teacher = await getOrCreateTeacher();
  if (username === teacher.username && password === teacher.password) {
    localStorage.setItem(SESSION_KEY, "true");
    localStorage.setItem(ROLE_KEY, "teacher");
    localStorage.setItem(USERNAME_KEY, teacher.username);
    localStorage.removeItem(STUDENT_ID_KEY);
    return { role: "teacher" };
  }

  const student = await findStudentByCredentials(username, password);
  if (student) {
    localStorage.setItem(SESSION_KEY, "true");
    localStorage.setItem(ROLE_KEY, "student");
    localStorage.setItem(USERNAME_KEY, student.username);
    localStorage.setItem(STUDENT_ID_KEY, student.id);
    return { role: "student", studentId: student.id, name: student.name };
  }

  return null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(STUDENT_ID_KEY);
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
