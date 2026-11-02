function TaskStatistics({ tasks }) {
  const activeCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.filter((task) => task.completed === true).length;

  return (
    <section className="task-statistics" aria-label="Task statistics">
      <div className="stat-card active-stat">
        <span className="stat-count">{activeCount}</span>
        <span className="stat-label">Active Tasks</span>
      </div>
      <div className="stat-card completed-stat">
        <span className="stat-count">{completedCount}</span>
        <span className="stat-label">Completed Tasks</span>
      </div>
    </section>
  );
}

export default TaskStatistics;
