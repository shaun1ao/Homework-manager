import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  watchAssignment,
  watchClasses,
  watchStudents,
  deleteAssignment,
} from "../lib/db";
import {
  IconArrowLeft,
  IconTrash,
  IconCalendar,
  IconUsers,
  IconClipboard,
  IconAlertCircle,
} from "../components/icons";

function isOverdue(dueDate) {
  if (!dueDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return dueDate < today;
}

export default function AssignmentDetailPage() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(undefined);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const unsubA = watchAssignment(assignmentId, setAssignment);
    const unsubC = watchClasses(setClasses);
    const unsubS = watchStudents(setStudents);
    return () => {
      unsubA();
      unsubC();
      unsubS();
    };
  }, [assignmentId]);

  async function handleDelete() {
    if (!confirm("Delete this assignment?")) return;
    await deleteAssignment(assignmentId);
    navigate("/assignments");
  }

  if (assignment === undefined) {
    return (
      <div className="page">
        <p className="empty-state">Loading…</p>
      </div>
    );
  }

  if (assignment === null) {
    return (
      <div className="page">
        <button className="back-link" onClick={() => navigate("/assignments")}>
          <IconArrowLeft size={15} />
          Back to assignments
        </button>
        <p className="empty-state">This assignment no longer exists.</p>
      </div>
    );
  }

  const targetClass =
    assignment.targetType === "class"
      ? classes.find((c) => c.id === assignment.classId)
      : null;
  const targetStudents =
    assignment.targetType === "students"
      ? (assignment.studentIds || [])
          .map((id) => students.find((s) => s.id === id))
          .filter(Boolean)
      : [];
  const overdue = isOverdue(assignment.dueDate);

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate("/assignments")}>
        <IconArrowLeft size={15} />
        Back to assignments
      </button>

      <div className="detail-card">
        <div className="detail-header">
          <div className="icon-badge">
            <IconClipboard size={18} />
          </div>
          <h1 style={{ flex: 1, marginLeft: 14 }}>{assignment.title}</h1>
          <button className="btn btn-danger-ghost" onClick={handleDelete}>
            <IconTrash size={14} />
            Delete
          </button>
        </div>

        <div className="detail-row">
          <span className="detail-label">
            <IconCalendar size={15} />
            Due date
          </span>
          <span className="detail-value">
            {assignment.dueDate}
            {overdue && (
              <span className="badge" style={{ marginLeft: 8, color: "var(--danger)", borderColor: "var(--danger-border)", background: "var(--danger-light)" }}>
                <IconAlertCircle size={12} />
                Overdue
              </span>
            )}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">
            <IconUsers size={15} />
            Assigned to
          </span>
          <span className="detail-value">
            {assignment.targetType === "class"
              ? targetClass
                ? `Class: ${targetClass.name}`
                : "Class (deleted)"
              : targetStudents.length
              ? targetStudents.map((s) => s.name).join(", ")
              : "No one"}
          </span>
        </div>

        {assignment.description && (
          <div className="detail-row detail-row-block">
            <span className="detail-label">Extra info</span>
            <p className="detail-description">{assignment.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
