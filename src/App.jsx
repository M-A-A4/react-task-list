import React, { useState } from "react";
import TaskItem from "./components/TaskItem";
import "./styles/TaskItem.css";

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Study React", completed: false },
    { id: 2, text: "Finish Homework", completed: false },
    { id: 3, text: "Read Documentation", completed: false },
  ]);

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() === "") return;

      const task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      };

    setTasks([...tasks, task]);
    setNewTask("");
  };

  const completeTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const incompleteCount = tasks.filter(
    (task) => !task.completed
  ).length;

  return (
    <div className="container">
      <h1>Task List</h1>

      <div className="add-task">
        <input
          type="text"
          placeholder="Enter a task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />

        <button onClick={addTask}>Add Task</button>
      </div>

      <p className="count">
        Incomplete Tasks: {incompleteCount}
      </p>

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={completeTask}
        />
      ))}
    </div>
  );
}

export default App;