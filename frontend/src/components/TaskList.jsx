import TaskCard from "./TaskCard";

function TaskList({ tasks, setTasks, onReplan }) {
  const updateTask = (taskId, status) => {
    const updated = tasks.map((task) =>
      task._id === taskId ? { ...task, status } : task
    );
    setTasks(updated);

    if (status === "skipped") {
      onReplan(); // 🔥 agent ko replan trigger
    }
  };

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          updateTask={updateTask}
        />
      ))}
    </div>
  );
}

export default TaskList;
