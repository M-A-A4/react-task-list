import React from "react";

function TaskItem({ task, onComplete }) {
  return (
    <div className="task-item">
      <span
        className={
          task.completed ? "completed" : ""
        }
      >
        {task.text}
      </span>

      <button
        onClick={() => onComplete(task.id)}
      >
        {task.completed ? "Undo" : "Complete"}
      </button>
    </div>
  );
}

export default TaskItem;