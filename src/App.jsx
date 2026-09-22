import { useState } from 'react';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import { loadTasks, saveTasks } from './services/taskStorage.js';

const SAMPLE_TASKS = [
  {
    id: crypto.randomUUID(),
    title: 'Update Games',
    description: 'Update: Call of Duty, Fortnite, Minecraft, GTA V.',
    dueDate: '2026-10-01',
    priority: 'medium',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'GMTS Features',
    description: 'Implement GTA features in the GMTS project.',
    dueDate: '2026-11-18',
    priority: 'high',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Send Updates in GroupMe',
    description: 'Send Updates about changes and Idead to GroupMembers in GroupMe.',
    dueDate: '2026-09-25',
    priority: 'High',
    completed: true,
  },
];

function getInitialTasks() {
  const stored = loadTasks();

  if (stored === null) {
    saveTasks(SAMPLE_TASKS);
    return SAMPLE_TASKS;
  }

  return stored;
}

function App() {
  const [tasks, setTasks] = useState(getInitialTasks);
  const [editingTask, setEditingTask] = useState(null);

  function handleSave(taskData) {
    let updatedTasks;

    if (editingTask) {
      updatedTasks = tasks.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: taskData.title,
              description: taskData.description,
              dueDate: taskData.dueDate,
              priority: taskData.priority,
            }
          : task
      );
      setEditingTask(null);
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate,
        priority: taskData.priority,
        completed: false,
      };
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function handleEdit(task) {
    setEditingTask(task);
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this task?');

    if (!confirmed) {
      return;
    }

    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    if (editingTask && editingTask.id === id) {
      setEditingTask(null);
    }
  }

  function handleToggleComplete(id) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  return (
    <div className="app">
      <h1>TaskFlow</h1> 
      <p>A simple task manager that stores data in your browser.</p> 

      <TaskForm
        onSubmit={handleSave}
        editingTask={editingTask}
        onCancel={handleCancelEdit}
      />

      <h2>Tasks</h2>
      <TaskList
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleComplete={handleToggleComplete}
      />
    </div>
  );
}

export default App;
