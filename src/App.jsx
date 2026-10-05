import React, { useEffect, useMemo, useState } from "react";
import TaskItem from "./components/TaskItem";
import "./styles/TaskItem.css";

const initialTasks = [
  {
    id: 1,
    text: "Study React",
    completed: false,
    priority: "High",
  },
  {
    id: 2,
    text: "Finish Homework",
    completed: false,
    priority: "Medium",
  },
  {
    id: 3,
    text: "Read Documentation",
    completed: false,
    priority: "Low",
  },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("tasks");

      if (!savedTasks) {
        return initialTasks;
      }

      const parsedTasks = JSON.parse(savedTasks);

      if (!Array.isArray(parsedTasks)) {
        return initialTasks;
      }

      return parsedTasks;
    } catch (error) {
      return initialTasks;
    }
  });

  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // CREATE
  const addTask = () => {
    const trimmedText = newTask.trim();

    if (trimmedText === "") {
      return;
    }

    const task = {
      id: Date.now(),
      text: trimmedText,
      completed: false,
      priority: newPriority,
    };

    setTasks([...tasks, task]);
    setNewTask("");
    setNewPriority("Medium");
  };

  // COMPLETE / UNDO
  const completeTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // DELETE
  const deleteTask = (id) => {
    setTasks(
      tasks.filter((task) => task.id !== id)
    );

    if (editingId === id) {
      setEditingId(null);
      setEditText("");
    }
  };

  // START EDITING
  const startEditing = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditPriority(task.priority);
  };

  // SAVE EDIT
  const saveEdit = (id) => {
    const trimmedText = editText.trim();

    if (trimmedText === "") {
      return;
    }

    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              text: trimmedText,
              priority: editPriority,
            }
          : task
      )
    );

    setEditingId(null);
    setEditText("");
    setEditPriority("Medium");
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditPriority("Medium");
  };

  // COUNTS
  const totalCount = tasks.length;

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const activeCount = tasks.filter(
    (task) => !task.completed
  ).length;

  // SEARCH + FILTER
  const filteredTasks = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch = task.text
        .toLowerCase()
        .includes(search);

      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !task.completed) ||
        (filter === "completed" && task.completed);

      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchTerm, filter]);

  return (
    <div className="container">
      <h1>Task Manager</h1>

      {/* ADD TASK */}
      <div className="add-task">
        <input
          type="text"
          placeholder="Enter a task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />

        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button onClick={addTask}>
          Add Task
        </button>
      </div>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* FILTER BUTTONS */}
      <div className="filters">
        <button
          className={filter === "all" ? "active-filter" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={filter === "active" ? "active-filter" : ""}
          onClick={() => setFilter("active")}
        >
          Active
        </button>

        <button
          className={
            filter === "completed" ? "active-filter" : ""
          }
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* COUNTS */}
      <div className="count">
        <p>Total: {totalCount}</p>
        <p>Active: {activeCount}</p>
        <p>Completed: {completedCount}</p>
      </div>

      {/* EMPTY STATES */}
      {tasks.length === 0 ? (
        <p className="empty-message">
          No tasks yet.
        </p>
      ) : filteredTasks.length === 0 ? (
        <p className="empty-message">
          No matching tasks.
        </p>
      ) : (
        filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={completeTask}
            onDelete={deleteTask}
            onEdit={startEditing}
            onSave={saveEdit}
            onCancel={cancelEdit}
            editingId={editingId}
            editText={editText}
            setEditText={setEditText}
            editPriority={editPriority}
            setEditPriority={setEditPriority}
          />
        ))
      )}
    </div>
  );
}

export default App;