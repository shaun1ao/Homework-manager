export function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

export function initials(name) {
  const parts = (name || "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

export function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export function isOverdue(dueDate) {
  if (!dueDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return dueDate < today;
}

export function sortByDueDate(assignments) {
  return [...assignments].sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
}

const PASSWORD_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I/L — easy to read aloud

export function generateUsername(name, existingUsernames = []) {
  const parts = (name || "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  const first = (parts[0] || "student").replace(/[^a-z]/g, "");
  const lastInitial = parts.length > 1 ? parts[parts.length - 1][0]?.replace(/[^a-z]/g, "") : "";
  const base = lastInitial ? `${first}.${lastInitial}` : first || "student";

  let candidate = base;
  let n = 1;
  while (existingUsernames.includes(candidate)) {
    n += 1;
    candidate = `${base}${n}`;
  }
  return candidate;
}

export function generatePassword(length = 6) {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)];
  }
  return out;
}
