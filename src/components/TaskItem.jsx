import React, { useState } from "react";

function TaskItem({
  task,
  onComplete,
  onDelete,
  onSave,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [editText, setEditText] = useState(task.text);

  const [editPriority, setEditPriority] = useState(
    task.priority
  );

  const handleSave = () => {
    onSave(
      task.id,
      editText,
      editPriority
    );

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditPriority(task.priority);
    setIsEditing(false);
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
          </div>

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
                setEditPriority(
                  task.priority
                );
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