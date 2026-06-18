import { toggleSubtask } from "../api/agent";
import TaskCard from "./TaskCard";

function TaskList({ tasks, setTasks, onReplan, isSaved }) {
  const handleToggle = async (taskId, subtaskId) => {
    try {
      await toggleSubtask(taskId, subtaskId);
      setTasks(prev => prev.map(t => {
        if (t._id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.map(st => 
              st._id === subtaskId ? { ...st, completed: !st.completed } : st
            )
          };
        }
        return t;
      }));
    } catch (err) {
      console.error("Failed to toggle subtask", err);
    }
  };

  return (
    <div>
      <div style={{ padding: '16px 20px', marginBottom: '30px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '14px', color: '#93c5fd', fontSize: '14px', display: 'flex', gap: '12px', alignItems: 'center', boxShadow: '0 10px 30px -10px rgba(59, 130, 246, 0.1)' }}>
        <span style={{ fontSize: '20px' }}>🤖</span>
        <span style={{ fontWeight: 500, lineHeight: 1.5 }}>This roadmap is hyper-personalized based on your initial assessment and learning level.</span>
      </div>
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onToggle={handleToggle}
          isSaved={isSaved}
        />
      ))}
    </div>
  );
}

export default TaskList;
