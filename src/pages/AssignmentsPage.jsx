import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  watchAssignments,
  watchClasses,
  watchStudents,
  createAssignment,
} from "../lib/db";
import {
  IconPlus,
  IconCalendar,
  IconAcademicCap,
  IconUsers,
  IconChevronRight,
  IconInbox,
} from "../components/icons";

function isOverdue(dueDate) {
  if (!dueDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return dueDate < today;
}

function TargetBadge({ assignment, classes, students }) {
  if (assignment.targetType === "class") {
    const c = classes.find((c) => c.id === assignment.classId);
    return (
      <span className="badge badge-class">
        <IconAcademicCap size={12} />
        {c ? c.name : "Class (deleted)"}
      </span>
    );
  }
  const names = (assignment.studentIds || [])
    .map((id) => students.find((s) => s.id === id)?.name)
    .filter(Boolean);
  return (
    <span className="badge badge-students">
      <IconUsers size={12} />
      {names.length ? names.join(", ") : "No one"}
    </span>
  );
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [targetType, setTargetType] = useState("class");
  const [classId, setClassId] = useState("");
  const [studentIds, setStudentIds] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubA = watchAssignments(setAssignments);
    const unsubC = watchClasses(setClasses);
    const unsubS = watchStudents(setStudents);
    return () => {
      unsubA();
      unsubC();
      unsubS();
    };
  }, []);

  const sortedAssignments = useMemo(() => assignments, [assignments]);

  function toggleStudent(id) {
    setStudentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setTargetType("class");
    setClassId("");
    setStudentIds([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    if (targetType === "class" && !classId) return;
    if (targetType === "students" && studentIds.length === 0) return;

    setSaving(true);
    await createAssignment({
      title: title.trim(),
      description: description.trim(),
      dueDate,
      targetType,
      classId: targetType === "class" ? classId : null,
      studentIds: targetType === "students" ? studentIds : [],
    });
    setSaving(false);
    resetForm();
    setShowForm(false);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Assignments</h1>
          <p className="page-subtitle">Give work to a class, or to specific people.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          <IconPlus size={16} />
          {showForm ? "Cancel" : "New assignment"}
        </button>
      </div>

      {showForm && (
        <form className="panel-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Title</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>

          <label className="field">
            <span>Due date</span>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Extra info (instructions, details, etc.)</span>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="field">
            <span>Assign to</span>
            <div className="radio-row">
              <label>
                <input
                  type="radio"
                  checked={targetType === "class"}
                  onChange={() => setTargetType("class")}
                />
                A whole class
              </label>
              <label>
                <input
                  type="radio"
                  checked={targetType === "students"}
                  onChange={() => setTargetType("students")}
                />
                Specific people
              </label>
            </div>
          </div>

          {targetType === "class" ? (
            <label className="field">
              <span>Class</span>
              <select value={classId} onChange={(e) => setClassId(e.target.value)} required>
                <option value="">Select a class…</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="field">
              <span>People ({studentIds.length} selected)</span>
              {students.length === 0 ? (
                <div className="empty-state">
                  <div className="icon-badge icon-badge-muted">
                    <IconInbox size={18} />
                  </div>
                  No students yet. Add students from a class first.
                </div>
              ) : (
                <div className="checkbox-list">
                  {students.map((s) => (
                    <label key={s.id}>
                      <input
                        type="checkbox"
                        checked={studentIds.includes(s.id)}
                        onChange={() => toggleStudent(s.id)}
                      />
                      {s.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Assign"}
          </button>
        </form>
      )}

      {sortedAssignments.length === 0 ? (
        <div className="empty-state">
          <div className="icon-badge icon-badge-muted">
            <IconInbox size={18} />
          </div>
          No assignments yet.
        </div>
      ) : (
        <ul className="assignment-list assignment-list-full">
          {sortedAssignments.map((a) => {
            const overdue = isOverdue(a.dueDate);
            return (
              <li key={a.id}>
                <Link to={`/assignments/${a.id}`}>
                  <div className="assignment-main">
                    <div className="assignment-row">
                      <span className="assignment-title">{a.title}</span>
                      <span className={`assignment-due${overdue ? " overdue" : ""}`}>
                        <IconCalendar size={13} />
                        {overdue ? "Overdue · " : "Due "}
                        {a.dueDate}
                      </span>
                    </div>
                    <div className="assignment-target">
                      <TargetBadge assignment={a} classes={classes} students={students} />
                    </div>
                  </div>
                  <IconChevronRight size={16} color="var(--text-faint)" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
