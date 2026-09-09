import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { watchClasses, watchStudents, createClass, deleteClass } from "../lib/db";
import { IconAcademicCap, IconPlus, IconTrash, IconUsers, IconInbox } from "../components/icons";

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsubClasses = watchClasses(setClasses);
    const unsubStudents = watchStudents(setStudents);
    return () => {
      unsubClasses();
      unsubStudents();
    };
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newClassName.trim()) return;
    setCreating(true);
    await createClass(newClassName.trim());
    setNewClassName("");
    setCreating(false);
  }

  async function handleDelete(id, name) {
    if (!confirm(`Delete class "${name}"? This does not delete the students themselves.`)) return;
    await deleteClass(id);
  }

  function studentCount(classId) {
    return students.filter((s) => (s.classIds || []).includes(classId)).length;
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Classes</h1>
          <p className="page-subtitle">Create classes and manage who's in them.</p>
        </div>
      </div>

      <form className="inline-form" onSubmit={handleCreate}>
        <input
          placeholder="New class name (e.g. Period 3 - Algebra)"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={creating}>
          <IconPlus size={16} />
          Add class
        </button>
      </form>

      {classes.length === 0 ? (
        <div className="empty-state">
          <div className="icon-badge icon-badge-muted">
            <IconInbox size={18} />
          </div>
          No classes yet. Create one above.
        </div>
      ) : (
        <div className="card-grid">
          {classes.map((c) => (
            <Link to={`/classes/${c.id}`} className="card class-card" key={c.id}>
              <div className="card-top">
                <div className="icon-badge">
                  <IconAcademicCap size={17} />
                </div>
              </div>
              <div className="card-title">{c.name}</div>
              <div className="card-meta">
                <IconUsers size={14} />
                {studentCount(c.id)} student{studentCount(c.id) === 1 ? "" : "s"}
              </div>
              <button
                className="btn btn-danger-ghost"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(c.id, c.name);
                }}
              >
                <IconTrash size={14} />
                Delete
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
