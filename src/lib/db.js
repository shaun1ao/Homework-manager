import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

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

export async function deleteClass(classId) {
  await deleteDoc(doc(db, "classes", classId));
}

// ---------- Students ----------

export function watchStudents(callback) {
  const q = query(collection(db, "students"), orderBy("name", "asc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function createStudent(name, classIds = []) {
  return addDoc(collection(db, "students"), {
    name,
    classIds,
    createdAt: serverTimestamp(),
  });
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
