import { useState } from 'react';

function TaskItem({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
  onAddSubtask,
  onToggleSubtaskComplete,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [subtaskError, setSubtaskError] = useState('');
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((subtask) => subtask.completed).length;
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
        <div className="subtask-summary">
          <button
            className="subtask-toggle"
            type="button"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide subtasks' : 'Subtasks'} ({completedSubtasks}/{subtasks.length})
          </button>
          {subtasks.length > 0 && (
            <div
              className="subtask-progress"
              role="progressbar"
              aria-label={`${task.title} subtask progress`}
              aria-valuemin="0"
              aria-valuemax={subtasks.length}
              aria-valuenow={completedSubtasks}
            >
              <span style={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }} />
            </div>
          )}
        </div>
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
      {isExpanded && (
        <section className="subtask-panel" aria-label={`${task.title} subtasks`}>
          {subtasks.length > 0 ? (
            <ul className="subtask-list">
              {subtasks.map((subtask) => (
                <li className={subtask.completed ? 'subtask-item completed' : 'subtask-item'} key={subtask.id}>
                  <button
                    className={subtask.completed ? 'task-check checked' : 'task-check'}
                    type="button"
                    aria-label={subtask.completed ? `Mark ${subtask.title} incomplete` : `Mark ${subtask.title} complete`}
                    onClick={() => onToggleSubtaskComplete(task.id, subtask.id)}
                  >
                    {subtask.completed ? '✓' : ''}
                  </button>
                  <span>{subtask.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="subtask-empty">Break this assignment into smaller steps.</p>
          )}
          <form
            className="subtask-form"
            onSubmit={(event) => {
              event.preventDefault();
              const trimmedTitle = subtaskTitle.trim();
              if (!trimmedTitle) {
                setSubtaskError('Enter a subtask name.');
                return;
              }
              onAddSubtask(task.id, trimmedTitle);
              setSubtaskTitle('');
              setSubtaskError('');
            }}
          >
            <label className="visually-hidden" htmlFor={`subtask-${task.id}`}>New subtask</label>
            <input
              id={`subtask-${task.id}`}
              type="text"
              placeholder="Add a subtask"
              value={subtaskTitle}
              onChange={(event) => {
                setSubtaskTitle(event.target.value);
                setSubtaskError('');
              }}
            />
            <button type="submit">Add</button>
          </form>
          {subtaskError && <p className="subtask-error" role="alert">{subtaskError}</p>}
        </section>
      )}
    </li>
  );
}

export default TaskItem;
