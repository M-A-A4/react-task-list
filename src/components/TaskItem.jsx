
import React, { useState } from "react";

function TaskItem({
  task,
  onComplete,
  onDelete,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || "");
  const [dateError, setDateError] = useState("");

  const handleSave = () => {
    const trimmedText = editText.trim();

    if (trimmedText === "") {
      return;
    }

    if (editDueDate) {
      const selectedDate = new Date(editDueDate);
      const currentDate = new Date();

      selectedDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      if (isNaN(selectedDate.getTime())) {
        setDateError("Please enter a valid date.");
        return;
      }
    }

    setDateError("");

    onSave(
      task.id,
      trimmedText,
      editPriority,
      editDueDate
    );

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || "");
    setDateError("");
    setIsEditing(false);
  };

  const isOverdue = () => {
    if (!task.dueDate || task.completed) {
      return false;
    }

    const today = new Date();
    const dueDate = new Date(task.dueDate);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  };

  return (
    <div className="task-item">
      {isEditing ? (
        <>
          <div className="edit-section">
            <input
              type="text"
              value={editText}
              onChange={(e) =>
                setEditText(e.target.value)
              }
            />

            <select
              value={editPriority}
              onChange={(e) =>
                setEditPriority(e.target.value)
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <input
              type="date"
              value={editDueDate}
              onChange={(e) =>
                setEditDueDate(e.target.value)
              }
            />
          </div>

          {dateError && (
            <p className="error-message">
              {dateError}
            </p>
          )}

          <div className="task-buttons">
            <button onClick={handleSave}>
              Save
            </button>

            <button onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="task-info">
            <span
              className={
                task.completed ? "completed" : ""
              }
            >
              {task.text}
            </span>

            <span className="priority">
              Priority: {task.priority}
            </span>

            <span className="due-date">
              Due Date:{" "}
              {task.dueDate
                ? task.dueDate
                : "No due date"}
            </span>

            {isOverdue() && (
              <span className="overdue">
                Overdue
              </span>
            )}
          </div>

          <div className="task-buttons">
            <button
              onClick={() =>
                onComplete(task.id)
              }
            >
              {task.completed
                ? "Undo"
                : "Complete"}
            </button>

            <button
              onClick={() => {
                setEditText(task.text);
                setEditPriority(task.priority);
                setEditDueDate(
                  task.dueDate || ""
                );
                setDateError("");
                setIsEditing(true);
              }}
            >
              Edit
            </button>

            <button
              onClick={() =>
                onDelete(task.id)
              }
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;

