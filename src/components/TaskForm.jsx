function TaskForm({
  newTask,
  setNewTask,
  priority,
  setPriority,
  addTask,
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

      <button onClick={addTask}>
        Add Task
      </button>
    </div>
  );
}

export default TaskForm;