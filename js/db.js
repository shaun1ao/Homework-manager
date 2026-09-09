import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { db } from "./firebase-config.js";
import { generateUsername, generatePassword } from "./helpers.js";

// ---------- Teacher settings ----------

const TEACHER_DOC = doc(db, "settings", "teacher");
const DEFAULT_TEACHER = { username: "b.hossain", password: "1234" };

export async function getOrCreateTeacher() {
  const snap = await getDoc(TEACHER_DOC);
  if (snap.exists()) return snap.data();
  await setDoc(TEACHER_DOC, DEFAULT_TEACHER);
  return DEFAULT_TEACHER;
}

export async function updateTeacherCredentials(updates) {
  await setDoc(TEACHER_DOC, updates, { merge: true });
}

// ---------- Classes ----------

export function watchClasses(callback) {
  const q = query(collection(db, "classes"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function createClass(name) {
  return addDoc(collection(db, "classes"), {
    name,
    createdAt: serverTimestamp(),
  });
}

export async function getClass(classId) {
  const snap = await getDoc(doc(db, "classes", classId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function deleteClass(classId) {
  // Clean up the classId reference on any student still enrolled, so it
  // doesn't linger as a dangling entry in their classIds array.
  const enrolled = await getDocs(query(collection(db, "students"), where("classIds", "array-contains", classId)));
  await Promise.all(
    enrolled.docs.map((d) => updateDoc(d.ref, { classIds: arrayRemove(classId) }))
  );
  await deleteDoc(doc(db, "classes", classId));
}

// ---------- Students ----------

export function watchStudents(callback) {
  const q = query(collection(db, "students"), orderBy("name", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function createStudent(name, classIds = [], existingStudents = []) {
  const existingUsernames = existingStudents.map((s) => s.username).filter(Boolean);
  const username = generateUsername(name, existingUsernames);
  const password = generatePassword();
  const docRef = await addDoc(collection(db, "students"), {
    name,
    classIds,
    username,
    password,
    createdAt: serverTimestamp(),
  });
  return { id: docRef.id, username, password };
}

// For students that existed before login credentials were added.
export async function ensureStudentCredentials(studentId, name, existingStudents = []) {
  const existingUsernames = existingStudents.map((s) => s.username).filter(Boolean);
  const username = generateUsername(name, existingUsernames);
  const password = generatePassword();
  await updateDoc(doc(db, "students", studentId), { username, password });
  return { username, password };
}

export async function findStudentByCredentials(username, password) {
  const q = query(collection(db, "students"), where("username", "==", username));
  const snap = await getDocs(q);
  const match = snap.docs.find((d) => d.data().password === password);
  return match ? { id: match.id, ...match.data() } : null;
}

export async function addStudentToClass(studentId, classId) {
  await updateDoc(doc(db, "students", studentId), {
    classIds: arrayUnion(classId),
  });
}

export async function removeStudentFromClass(studentId, classId) {
  await updateDoc(doc(db, "students", studentId), {
    classIds: arrayRemove(classId),
  });
}

export async function deleteStudent(studentId) {
  await deleteDoc(doc(db, "students", studentId));
}

// ---------- Assignments ----------

export function watchAssignments(callback) {
  const q = query(collection(db, "assignments"), orderBy("dueDate", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function watchAssignment(assignmentId, callback) {
  return onSnapshot(doc(db, "assignments", assignmentId), (snap) => {
    callback(snap.exists() ? { id: snap.id, ...snap.data() } : null);
  });
}

export async function createAssignment(data) {
  return addDoc(collection(db, "assignments"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateAssignment(assignmentId, updates) {
  await updateDoc(doc(db, "assignments", assignmentId), updates);
}

export async function deleteAssignment(assignmentId) {
  await deleteDoc(doc(db, "assignments", assignmentId));
}
