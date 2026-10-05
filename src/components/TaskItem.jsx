import React from "react";

function TaskItem({
  task,
  onComplete,
  onDelete,
  onEdit,
  onSave,
  onCancel,
  editingId,
  editText,
  setEditText,
  editPriority,
  setEditPriority,
}) {
  const isEditing = editingId === task.id;

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
          </div>

          <div className="task-buttons">
            <button
              onClick={() => onSave(task.id)}
            >
              Save
            </button>

            <button onClick={onCancel}>
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
          </div>

          <div className="task-buttons">
            <button
              onClick={() => onComplete(task.id)}
            >
              {task.completed
                ? "Undo"
                : "Complete"}
            </button>

            <button
              onClick={() => onEdit(task)}
              disabled={
                editingId !== null &&
                editingId !== task.id
              }
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(task.id)}
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