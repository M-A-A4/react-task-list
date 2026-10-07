import React, { useEffect, useMemo, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
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

  // State for adding a new task
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Save tasks to localStorage
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

    setTasks((prev) => [...prev, task]);

    setNewTask("");
    setNewPriority("Medium");
  };

  // COMPLETE / UNDO
  const completeTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  // DELETE
  const deleteTask = (id) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  // UPDATE TASK
  const updateTask = (
    id,
    updatedText,
    updatedPriority
  ) => {
    const trimmedText = updatedText.trim();

    if (trimmedText === "") {
      return;
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              text: trimmedText,
              priority: updatedPriority,
            }
          : task
      )
    );
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
      <TaskForm
        newTask={newTask}
        setNewTask={setNewTask}
        priority={newPriority}
        setPriority={setNewPriority}
        addTask={addTask}
      />

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      {/* FILTER BUTTONS */}
      <div className="filters">
        <button
          className={
            filter === "all" ? "active-filter" : ""
          }
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={
            filter === "active"
              ? "active-filter"
              : ""
          }
          onClick={() => setFilter("active")}
        >
          Active
        </button>

        <button
          className={
            filter === "completed"
              ? "active-filter"
              : ""
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

      {/* TASKS */}
      {tasks.length === 0 ? (
        <p className="empty-message">
          No tasks yet.
        </p>
      ) : filteredTasks.length === 0 ? (
        <p className="empty-message">
          No matching tasks.
        </p>
      ) : (
        <TaskList
          tasks={filteredTasks}
          onComplete={completeTask}
          onDelete={deleteTask}
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}

export default App;