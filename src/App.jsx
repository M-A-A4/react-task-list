
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
    dueDate: "",
  },
  {
    id: 2,
    text: "Finish Homework",
    completed: false,
    priority: "Medium",
    dueDate: "",
  },
  {
    id: 3,
    text: "Read Documentation",
    completed: false,
    priority: "Low",
    dueDate: "",
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
  const [dueDate, setDueDate] = useState("");
  const [dateError, setDateError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmedText = newTask.trim();

    if (trimmedText === "") {
      return;
    }

    if (dueDate) {
      const selectedDate = new Date(dueDate);

      if (isNaN(selectedDate.getTime())) {
        setDateError("Please enter a valid date.");
        return;
      }
    }

    setDateError("");

    const task = {
      id: Date.now(),
      text: trimmedText,
      completed: false,
      priority: newPriority,
      dueDate: dueDate,
    };

    setTasks((prev) => [...prev, task]);

    setNewTask("");
    setNewPriority("Medium");
    setDueDate("");
  };

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

  const deleteTask = (id) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  const updateTask = (
    id,
    updatedText,
    updatedPriority,
    updatedDueDate
  ) => {
    const trimmedText = updatedText.trim();

    if (trimmedText === "") {
      return;
    }

    if (updatedDueDate) {
      const selectedDate = new Date(updatedDueDate);

      if (isNaN(selectedDate.getTime())) {
        return;
      }
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              text: trimmedText,
              priority: updatedPriority,
              dueDate: updatedDueDate,
            }
          : task
      )
    );
  };

  const totalCount = tasks.length;

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const activeCount = tasks.filter(
    (task) => !task.completed
  ).length;

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

      <TaskForm
        newTask={newTask}
        setNewTask={setNewTask}
        priority={newPriority}
        setPriority={setNewPriority}
        dueDate={dueDate}
        setDueDate={setDueDate}
        addTask={addTask}
        dateError={dateError}
      />

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

      <div className="filters">
        <button
          className={
            filter === "all"
              ? "active-filter"
              : ""
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

      <div className="count">
        <p>Total: {totalCount}</p>
        <p>Active: {activeCount}</p>
        <p>Completed: {completedCount}</p>
      </div>

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
