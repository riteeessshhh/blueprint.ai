function TaskCard({ task, onToggle, isSaved }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.day}>Day {task.day}</span>
      </div>

      <h3 style={styles.title}>{task.title}</h3>

      {task.subtasks && task.subtasks.length > 0 && (
        <div style={styles.subtasksContainer}>
          {task.subtasks.map((st) => (
            <div 
              key={st._id} 
              style={{
                ...styles.subtask,
                opacity: (isSaved && st.completed) ? 0.6 : 1,
                borderLeftColor: (isSaved && st.completed) ? "#10b981" : "#3b82f6"
              }}
            >
              {isSaved && (
                <input 
                  type="checkbox" 
                  checked={st.completed}
                  onChange={() => onToggle(task._id, st._id)}
                  style={styles.checkbox}
                />
              )}
              <span style={styles.hourBadge}>{st.hour}</span>
              <span style={{
                ...styles.activity,
                textDecoration: (isSaved && st.completed) ? "line-through" : "none"
              }}>
                {st.activity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "20px",
    background: "rgba(31, 41, 55, 0.4)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  day: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#60a5fa",
    textTransform: "uppercase",
    letterSpacing: "1px"
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#f9fafb",
    letterSpacing: "-0.5px"
  },
  subtasksContainer: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  subtask: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    padding: "16px",
    background: "rgba(17, 24, 39, 0.6)",
    borderRadius: "12px",
    borderLeft: "3px solid #3b82f6",
    borderTop: "1px solid rgba(255, 255, 255, 0.03)",
    borderRight: "1px solid rgba(255, 255, 255, 0.03)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.03)"
  },
  hourBadge: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#93c5fd",
    background: "rgba(59, 130, 246, 0.15)",
    padding: "4px 8px",
    borderRadius: "6px",
    whiteSpace: "nowrap"
  },
  activity: {
    fontSize: "15px",
    color: "#d1d5db",
    lineHeight: "1.6",
    fontWeight: "400",
    transition: "all 0.2s ease"
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#c084fc",
    marginTop: "2px"
  }
};

export default TaskCard;
