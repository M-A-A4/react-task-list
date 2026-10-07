import React, { useMemo, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import useLocalStorage from "./hooks/useLocalStorage";
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
  const [tasks, setTasks] = useLocalStorage(
    "tasks",
    initialTasks
  );

  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [dateError, setDateError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");

  const [deletedTask, setDeletedTask] = useState(null);

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
    const taskToDelete = tasks.find(
      (task) => task.id === id
    );

    if (!taskToDelete) {
      return;
    }

    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );

    setDeletedTask(taskToDelete);

    setTimeout(() => {
      setDeletedTask((current) => {
        if (
          current &&
          current.id === taskToDelete.id
        ) {
          return null;
        }

        return current;
      });
    }, 5000);
  };

  const undoDelete = () => {
    if (!deletedTask) {
      return;
    }

    setTasks((prev) => {
      const alreadyExists = prev.some(
        (task) => task.id === deletedTask.id
      );

      if (alreadyExists) {
        return prev;
      }

      return [...prev, deletedTask];
    });

    setDeletedTask(null);
  };

  const updateTask = (
    id,
    updatedText,
    updatedPriority,
    updatedDueDate
  ) => {
    const trimmedText = updatedText.trim();

    if (trimmedText === "") {
      return false;
    }

    if (updatedDueDate) {
      const selectedDate = new Date(updatedDueDate);

      if (isNaN(selectedDate.getTime())) {
        return false;
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

    return true;
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

    const result = tasks.filter((task) => {
      const matchesSearch = task.text
        .toLowerCase()
        .includes(search);

      const matchesStatus =
        filter === "all" ||
        (filter === "active" && !task.completed) ||
        (filter === "completed" && task.completed);

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });

    return [...result].sort((a, b) => {
      if (sortOption === "newest") {
        return Number(b.id) - Number(a.id);
      }

      if (sortOption === "oldest") {
        return Number(a.id) - Number(b.id);
      }

      if (sortOption === "dueDate") {
        if (!a.dueDate && !b.dueDate) {
          return 0;
        }

        if (!a.dueDate) {
          return 1;
        }

        if (!b.dueDate) {
          return -1;
        }

        return (
          new Date(a.dueDate) -
          new Date(b.dueDate)
        );
      }

      return 0;
    });
  }, [
    tasks,
    searchTerm,
    filter,
    priorityFilter,
    sortOption,
  ]);

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
          onClick={() =>
            setFilter("completed")
          }
        >
          Completed
        </button>
      </div>

      <div className="priority-filters">
        <button
          className={
            priorityFilter === "all"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setPriorityFilter("all")
          }
        >
          All Priorities
        </button>

        <button
          className={
            priorityFilter === "Low"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setPriorityFilter("Low")
          }
        >
          Low
        </button>

        <button
          className={
            priorityFilter === "Medium"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setPriorityFilter("Medium")
          }
        >
          Medium
        </button>

        <button
          className={
            priorityFilter === "High"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setPriorityFilter("High")
          }
        >
          High
        </button>
      </div>

      <div className="sort-box">
        <label htmlFor="sort">
          Sort:
        </label>

        <select
          id="sort"
          value={sortOption}
          onChange={(e) =>
            setSortOption(e.target.value)
          }
        >
          <option value="newest">
            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>

          <option value="dueDate">
            Due Date
          </option>
        </select>
      </div>

      <div className="count">
        <p>Total: {totalCount}</p>
        <p>Active: {activeCount}</p>
        <p>Completed: {completedCount}</p>
      </div>

      {deletedTask && (
        <div className="undo-message">
          <span>
            Deleted: {deletedTask.text}
          </span>

          <button onClick={undoDelete}>
            Undo
          </button>
        </div>
      )}

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