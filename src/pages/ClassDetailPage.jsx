import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  watchClasses,
  watchStudents,
  watchAssignments,
  createStudent,
  addStudentToClass,
  removeStudentFromClass,
} from "../lib/db";
import {
  IconArrowLeft,
  IconTrash,
  IconUserPlus,
  IconInbox,
  IconCalendar,
  IconChevronRight,
} from "../components/icons";

function initials(name) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase();
}

export default function ClassDetailPage() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [newName, setNewName] = useState("");
  const [existingPick, setExistingPick] = useState("");

  useEffect(() => {
    const unsubC = watchClasses(setClasses);
    const unsubS = watchStudents(setStudents);
    const unsubA = watchAssignments(setAssignments);
    return () => {
      unsubC();
      unsubS();
      unsubA();
    };
  }, []);

  const klass = classes.find((c) => c.id === classId);
  const roster = students.filter((s) => (s.classIds || []).includes(classId));
  const notInClass = students.filter((s) => !(s.classIds || []).includes(classId));

  const classAssignments = useMemo(
    () =>
      assignments.filter(
        (a) => a.targetType === "class" && a.classId === classId
      ),
    [assignments, classId]
  );

  async function handleAddNew(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    await createStudent(newName.trim(), [classId]);
    setNewName("");
  }

  async function handleAddExisting(e) {
    e.preventDefault();
    if (!existingPick) return;
    await addStudentToClass(existingPick, classId);
    setExistingPick("");
  }

  async function handleRemove(studentId) {
    await removeStudentFromClass(studentId, classId);
  }

  if (!klass) {
    return (
      <div className="page">
        <button className="back-link" onClick={() => navigate("/classes")}>
          <IconArrowLeft size={15} />
          Back to classes
        </button>
        <p className="empty-state">Loading…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate("/classes")}>
        <IconArrowLeft size={15} />
        Back to classes
      </button>
      <div className="page-header">
        <h1>{klass.name}</h1>
      </div>

      <section className="section">
        <h2>Roster ({roster.length})</h2>
        {roster.length === 0 ? (
          <div className="empty-state">
            <div className="icon-badge icon-badge-muted">
              <IconInbox size={18} />
            </div>
            No students in this class yet.
          </div>
        ) : (
          <ul className="roster-list">
            {roster.map((s) => (
              <li key={s.id}>
                <span className="roster-person">
                  <span className="avatar">{initials(s.name)}</span>
                  {s.name}
                </span>
                <button className="btn btn-danger-ghost" onClick={() => handleRemove(s.id)}>
                  <IconTrash size={14} />
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="two-col">
          <form className="inline-form" onSubmit={handleAddNew}>
            <input
              placeholder="Add a new person by name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button className="btn btn-secondary" type="submit">
              <IconUserPlus size={16} />
              Add new
            </button>
          </form>

          {notInClass.length > 0 && (
            <form className="inline-form" onSubmit={handleAddExisting}>
              <select value={existingPick} onChange={(e) => setExistingPick(e.target.value)}>
                <option value="">Add existing person…</option>
                {notInClass.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button className="btn btn-secondary" type="submit">
                Add
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="section">
        <h2>Assignments for this class</h2>
        {classAssignments.length === 0 ? (
          <div className="empty-state">
            <div className="icon-badge icon-badge-muted">
              <IconInbox size={18} />
            </div>
            No assignments given to this class yet.
          </div>
        ) : (
          <ul className="assignment-list">
            {classAssignments.map((a) => (
              <li key={a.id}>
                <Link to={`/assignments/${a.id}`}>
                  <div className="assignment-main">
                    <div className="assignment-row">
                      <span className="assignment-title">{a.title}</span>
                      <span className="assignment-due">
                        <IconCalendar size={13} />
                        Due {a.dueDate}
                      </span>
                    </div>
                  </div>
                  <IconChevronRight size={16} color="var(--text-faint)" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
