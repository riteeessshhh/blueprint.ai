function TaskCard({ task }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.day}>Day {task.day}</span>
      </div>

      <h3 style={styles.title}>{task.title}</h3>

      <p style={styles.hint}>
        🤖 This topic is placed here based on your assessment and learning level.
      </p>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "14px",
    background: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px"
  },
  day: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#2563eb"
  },
  status: {
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "12px",
    background: "#f3f4f6",
    color: "#374151"
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#111827"
  },
  hint: {
    fontSize: "14px",
    color: "#4b5563"
  }
};

export default TaskCard;
