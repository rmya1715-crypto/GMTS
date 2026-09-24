const STORAGE_KEY = 'taskflow-tasks';

export function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === null) {
    return null;
  }

  const parsed = JSON.parse(stored);

  // Support the array format saved by earlier versions of the app.
  return Array.isArray(parsed) ? { tasks: parsed, version: null } : parsed;
}

export function saveTasks(tasks, version) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, version }));
}
