import TaskItem from "./TaskItem";

function TaskList({
  tasks,
  onComplete,
  onDelete,
  onUpdate,
}) {
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onComplete={onComplete}
          onDelete={onDelete}
          onSave={onUpdate}
        />
      ))}
    </div>
  );
}

export default TaskList;