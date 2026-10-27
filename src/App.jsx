import { useState } from 'react';
import CalendarView from './components/CalendarView.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import { loadTasks, saveTasks } from './services/taskStorage.js';

const SAMPLE_TASKS_VERSION = 1;
const CATEGORIES = ['Academic', 'Training', 'Personal'];

const SAMPLE_TASKS = [
  {
    id: crypto.randomUUID(),
    title: 'Biology lab report',
    description: 'BIO 201 - Lab 04',
    dueDate: '2026-10-22',
    priority: 'high',
    category: 'Academic',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Strength & conditioning',
    description: 'Team workout - Athletics center',
    dueDate: '2026-10-22',
    priority: 'high',
    category: 'Training',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Read chapter 6',
    description: 'PSY 210 - Cognitive psychology',
    dueDate: '2026-10-22',
    priority: 'medium',
    category: 'Academic',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Pick up new running shoes',
    description: 'Campus sports store',
    dueDate: '2026-10-23',
    priority: 'low',
    category: 'Personal',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Calculus problem set',
    description: 'MATH 120 - Week 08',
    dueDate: '2026-10-23',
    priority: 'high',
    category: 'Academic',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Away game vs. Westfield',
    description: 'Soccer - arrive 60 min early',
    dueDate: '2026-10-24',
    priority: 'medium',
    category: 'Training',
    completed: false,
  },
  {
    id: crypto.randomUUID(),
    title: 'Book academic advising',
    description: 'Fall semester check-in',
    dueDate: '2026-10-21',
    priority: 'medium',
    category: 'Personal',
    completed: true,
  },
];

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getInitialTasks() {
  const stored = loadTasks();

  if (stored === null || stored.version !== SAMPLE_TASKS_VERSION) {
    saveTasks(SAMPLE_TASKS, SAMPLE_TASKS_VERSION);
    return SAMPLE_TASKS;
  }

  return stored.tasks.map((task) => ({
    ...task,
    category: task.category || 'Academic',
  }));
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function App() {
  const [tasks, setTasks] = useState(getInitialTasks);
  const [editingTask, setEditingTask] = useState(null);
  const [activeView, setActiveView] = useState('tasks');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [taskFilter, setTaskFilter] = useState('All tasks');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const today = toDateKey(new Date());

  function handleSave(taskData) {
    let updatedTasks;

    if (editingTask) {
      updatedTasks = tasks.map((task) =>
        task.id === editingTask.id ? { ...task, ...taskData } : task
      );
    } else {
      updatedTasks = [
        ...tasks,
        {
          id: crypto.randomUUID(),
          ...taskData,
          completed: false,
        },
      ];
    }

    setTasks(updatedTasks);
    saveTasks(updatedTasks, SAMPLE_TASKS_VERSION);
    setEditingTask(null);
    setIsFormOpen(false);
  }

  function handleEdit(task) {
    setEditingTask(task);
    setIsFormOpen(true);
  }

  function handleCancelEdit() {
    setEditingTask(null);
    setIsFormOpen(false);
  }

  function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this task?');

    if (!confirmed) {
      return;
    }

    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks, SAMPLE_TASKS_VERSION);

    if (editingTask && editingTask.id === id) {
      handleCancelEdit();
    }
  }

  function handleToggleComplete(id) {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks, SAMPLE_TASKS_VERSION);
  }

  const categoryCounts = Object.fromEntries(
    CATEGORIES.map((category) => [
      category,
      tasks.filter((task) => task.category === category).length,
    ])
  );

  const visibleTasks = tasks.filter((task) => {
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesFilter =
      taskFilter === 'All tasks' ||
      (taskFilter === 'Today' && task.dueDate === today) ||
      (taskFilter === 'Upcoming' && task.dueDate > today && !task.completed) ||
      (taskFilter === 'Completed' && task.completed);
    return matchesCategory && matchesFilter;
  });

  const nextTask = tasks
    .filter((task) => task.dueDate >= today && !task.completed)
    .sort((first, second) => first.dueDate.localeCompare(second.dueDate))[0];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">T</span> Taskflow <span className="brand-dot" /></div>
        <p className="sidebar-label">Your workspace</p>
        <nav className="primary-nav" aria-label="Workspace views">
          <button
            className={activeView === 'tasks' ? 'nav-link active' : 'nav-link'}
            type="button"
            onClick={() => { setSelectedCategory('All'); setActiveView('tasks'); }}
          >
            <span className="nav-icon">▦</span><span>My tasks</span><span className="nav-count">{tasks.length}</span>
          </button>
          <button
            className={activeView === 'calendar' ? 'nav-link active' : 'nav-link'}
            type="button"
            onClick={() => setActiveView('calendar')}
          >
            <span className="nav-icon">▤</span><span>Calendar</span>
          </button>
        </nav>

        <p className="sidebar-label category-heading">My categories</p>
        <nav className="category-nav" aria-label="Filter by category">
          <button
            className={selectedCategory === 'Academic' ? 'category-link selected' : 'category-link'}
            type="button"
            onClick={() => { setSelectedCategory('Academic'); setActiveView('tasks'); }}
          >
            <span className="category-dot academic" />Academic<span className="category-count">{categoryCounts.Academic}</span>
          </button>
          <button
            className={selectedCategory === 'Training' ? 'category-link selected' : 'category-link'}
            type="button"
            onClick={() => { setSelectedCategory('Training'); setActiveView('tasks'); }}
          >
            <span className="category-dot training" />Training<span className="category-count">{categoryCounts.Training}</span>
          </button>
          <button
            className={selectedCategory === 'Personal' ? 'category-link selected' : 'category-link'}
            type="button"
            onClick={() => { setSelectedCategory('Personal'); setActiveView('tasks'); }}
          >
            <span className="category-dot personal" />Personal<span className="category-count">{categoryCounts.Personal}</span>
          </button>
        </nav>

        <div className="sidebar-note">
          <span className="note-spark">✳</span>
          <strong>A little help goes far.</strong>
          <p>From your first task to a full semester. Just ask.</p>
          <button type="button" onClick={() => { setActiveView('tasks'); setIsFormOpen(true); }}>
            Add a task <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className="profile-row"><span className="avatar">AJ</span><span><strong>Alex Johnson</strong><small>Student-athlete</small></span></div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb"><span>⌂</span><span>Workspace</span><span>›</span><strong>{activeView === 'calendar' ? 'Calendar' : 'My tasks'}</strong></div>
          <time>{formatDate(new Date())}</time>
        </header>

        <main className="dashboard">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">A little structure. More room for everything you do.</p>
              <h1>{activeView === 'calendar' ? 'Your calendar' : 'Find your flow, Alex'} <span aria-hidden="true">{activeView === 'calendar' ? '▦' : '✳'}</span></h1>
              <p className="welcome-caption">{activeView === 'calendar' ? 'Your tasks, right where they belong.' : 'Make space for what matters today.'}</p>
            </div>
            <button className="create-button" type="button" onClick={() => { setEditingTask(null); setIsFormOpen(true); }}>
              <span aria-hidden="true">+</span> Create task
            </button>
          </div>

          <section className="stats-grid" aria-label="Task summary">
            <article className="stat-card"><div className="stat-label">Open tasks <span className="stat-icon">▦</span></div><div className="stat-value">{tasks.filter((task) => !task.completed).length}<small> across {CATEGORIES.filter((category) => categoryCounts[category] > 0).length} categories</small></div></article>
            <article className="stat-card"><div className="stat-label">Due today <span className="stat-icon">▧</span></div><div className="stat-value">{tasks.filter((task) => task.dueDate === today && !task.completed).length}<small> let's make a plan</small></div></article>
            <article className="stat-card"><div className="stat-label">In progress <span className="stat-icon">◷</span></div><div className="stat-value">{tasks.filter((task) => !task.completed).length}<small> keep the momentum</small></div></article>
            <article className="stat-card"><div className="stat-label">Completed <span className="stat-icon">✓</span></div><div className="stat-value">{tasks.filter((task) => task.completed).length}<small> nice work so far</small></div></article>
          </section>

          {activeView === 'calendar' ? (
            <CalendarView tasks={tasks} today={today} onEdit={handleEdit} />
          ) : (
            <div className="content-grid">
              <section className="task-section">
                <div className="section-heading">
                  <div><h2>{selectedCategory === 'All' ? 'My tasks' : selectedCategory}</h2><span className="result-count">{visibleTasks.length} open</span></div>
                  <button className="filter-button" type="button" onClick={() => setTaskFilter(taskFilter === 'All tasks' ? 'Upcoming' : 'All tasks')}>
                    <span aria-hidden="true">☷</span> {taskFilter === 'Upcoming' ? 'Upcoming' : 'Filter'}
                  </button>
                </div>
                <div className="task-tabs" role="tablist" aria-label="Task status filter">
                  {['All tasks', 'Today', 'Upcoming', 'Completed'].map((filter) => (
                    <button
                      key={filter}
                      className={taskFilter === filter ? 'task-tab active' : 'task-tab'}
                      type="button"
                      role="tab"
                      aria-selected={taskFilter === filter}
                      onClick={() => setTaskFilter(filter)}
                    >{filter}</button>
                  ))}
                </div>
                <div className="task-table-head"><span>Task name</span><span>Category</span><span>Due date</span><span>Priority</span><span>Status</span><span>Actions</span></div>
                <TaskList
                  tasks={visibleTasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                />
              </section>

              <aside className="insights-column">
                <section className="spotlight-card">
                  <p className="spotlight-kicker">UP NEXT {nextTask?.dueDate === today ? '· TODAY' : ''}</p>
                  <h2>{nextTask?.title || 'A clear calendar'}</h2>
                  <p>{nextTask?.description || 'You have room to plan something new.'}</p>
                  {nextTask && <div className="spotlight-meta">◷ {nextTask.dueDate} · {nextTask.category}</div>}
                  {nextTask && <button type="button" onClick={() => handleEdit(nextTask)}>View task <span aria-hidden="true">↗</span></button>}
                </section>
                <section className="rhythm-card">
                  <div className="rhythm-heading"><h2>Your categories</h2><span aria-hidden="true">↗</span></div>
                  {CATEGORIES.map((category) => (
                    <button className="category-progress" key={category} type="button" onClick={() => setSelectedCategory(category)}>
                      <span><i className={`category-dot ${category.toLowerCase()}`} />{category}</span>
                      <strong>{categoryCounts[category]}</strong>
                    </button>
                  ))}
                  <p className="rhythm-caption">Small steps add up. You're doing great.</p>
                </section>
                <button className="calendar-shortcut" type="button" onClick={() => setActiveView('calendar')}>▦ <span>See your calendar</span> <span aria-hidden="true">→</span></button>
              </aside>
            </div>
          )}
        </main>
      </div>

      {isFormOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) handleCancelEdit(); }}>
          <section className="task-modal" role="dialog" aria-modal="true" aria-label={editingTask ? 'Edit task' : 'Create task'}>
            <button className="modal-close" type="button" onClick={handleCancelEdit}>Close</button>
            <TaskForm onSubmit={handleSave} editingTask={editingTask} onCancel={handleCancelEdit} />
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
