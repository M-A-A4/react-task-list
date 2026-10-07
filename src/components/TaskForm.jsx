
import React from "react";

function TaskForm({
  newTask,
  setNewTask,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  addTask,
  dateError,
}) {
  return (
    <div>
      <input
        type="text"
        placeholder="Enter task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button onClick={addTask}>
        Add Task
      </button>

      {dateError && (
        <p className="error-message">
          {dateError}
        </p>
      )}
    </div>
  );
}

export default TaskForm;


