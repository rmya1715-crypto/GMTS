import TaskItem from './TaskItem.jsx';

function TaskList({
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
  onAddSubtask,
  onToggleSubtaskComplete,
}) {
  if (tasks.length === 0) {
    return <p className="empty-message">No tasks yet. Add one above.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onAddSubtask={onAddSubtask}
          onToggleSubtaskComplete={onToggleSubtaskComplete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
