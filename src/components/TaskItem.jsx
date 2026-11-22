function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
  const formattedDueDate = task.dueDate
    ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : 'No date';

  return (
    <li className={task.completed ? 'task-item completed' : 'task-item'}>
      <button
        className={task.completed ? 'task-check checked' : 'task-check'}
        type="button"
        aria-label={task.completed ? `Mark ${task.title} incomplete` : `Mark ${task.title} complete`}
        onClick={() => onToggleComplete(task.id)}
      >
        {task.completed ? '✓' : ''}
      </button>
      <div className="task-info">
        <h3>{task.title}</h3>
        <p>{task.description || 'No description'}</p>
      </div>
      <span className={`category-badge ${task.category.toLowerCase()}`}>{task.category}</span>
      <span className="task-due">{formattedDueDate}</span>
      <span className={`priority-label ${task.priority.toLowerCase()}`}><i />{task.priority}</span>
      <span className={`status-badge ${task.completed ? 'done' : 'open'}`}>
        {task.completed ? 'Completed' : 'Not started'}
      </span>
      <div className="task-actions">
        <button type="button" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}>✎</button>
        <button type="button" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task.id)}>⌫</button>
      </div>
    </li>
  );
}

export default TaskItem;
