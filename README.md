<<<<<<< HEAD
# CSC400 Task Flow Base Code

A simple task management application built with React and Vite. Tasks are stored in the browser with `localStorage` — there is no backend or database.

## Installation

```bash
cd csc400-task-flow-base-code-wiktor
npm install
```

## npm Commands

| Command | Description |
| --- | --- |
| `npm.cmd run dev` | Start the development server |
| `npm run build` | Build the app for production |
| `npm run preview` | Preview the production build locally |

## Current Features

- Create a new task (title, description, due date, priority)
- Display all tasks
- Edit an existing task
- Delete a task (with confirmation)
- Mark a task complete or incomplete
- Persist tasks in `localStorage`
- Load saved tasks on startup
- Validate that a title is required
- Empty-state message when no tasks exist
- Sample tasks on first visit

## Folder Structure

```
csc400-task-flow-base-code-wiktor/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    ├── components/
    │   ├── TaskForm.jsx
    │   ├── TaskList.jsx
    │   └── TaskItem.jsx
    └── services/
        └── taskStorage.js
```

## Ideas for Future Enhancements

- Filter tasks by status (all / active / completed)
- Sort by due date or priority
- Search tasks by title
- Add categories or tags
- Due-date reminders
- Export / import tasks as JSON
- Connect to a backend API for multi-device sync
=======
# GMTS
Final Project repo
>>>>>>> 95adebcc8785965d4f8332d2453fa2b6b553c342
