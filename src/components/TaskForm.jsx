import { useState, useEffect } from 'react';

function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Academic');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setDueDate(editingTask.dueDate);
      setPriority(editingTask.priority);
      setCategory(editingTask.category || 'Academic');
      setError('');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setCategory('Academic');
      setError('');
    }
  }, [editingTask]);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title is required.');
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      dueDate,
      priority,
      category,
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setCategory('Academic');
    setError('');
  }

  function handleCancel() {
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setCategory('Academic');
    setError('');
    onCancel();
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>

      <div className="form-field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows="3"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="dueDate">Due Date</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="Academic">Academic</option>
          <option value="Training">Training</option>
          <option value="Personal">Personal</option>
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="priority">Priority</label>
        <select
          id="priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
        {editingTask && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
