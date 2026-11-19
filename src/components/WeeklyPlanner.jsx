import { useState } from 'react';

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hoursFor(tasks) {
  return tasks
    .filter((task) => !task.completed)
    .reduce((sum, task) => sum + (Number(task.estimatedHours) || 0), 0);
}

function WeeklyPlanner({ tasks, today, onEdit }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + weekOffset * 7);

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const key = toDateKey(date);
    const dayTasks = tasks.filter((task) => task.dueDate === key);
    return { date, key, dayTasks, hours: hoursFor(dayTasks) };
  });

  const weekTotal = days.reduce((sum, day) => sum + day.hours, 0);
  const maxHours = Math.max(...days.map((day) => day.hours), 1);
  const rangeLabel = `${days[0].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${days[6].date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <section className="planner-panel" aria-label="Weekly study planner">
      <div className="planner-toolbar">
        <div>
          <h2>{rangeLabel}</h2>
          <p>{weekTotal}h of estimated study time this week</p>
        </div>
        <div className="calendar-controls">
          <button type="button" onClick={() => setWeekOffset(0)}>This week</button>
          <button type="button" aria-label="Previous week" onClick={() => setWeekOffset(weekOffset - 1)}>‹</button>
          <button type="button" aria-label="Next week" onClick={() => setWeekOffset(weekOffset + 1)}>›</button>
        </div>
      </div>

      <div className="planner-grid">
        {days.map(({ date, key, dayTasks, hours }) => (
          <div className={key === today ? 'planner-day is-today' : 'planner-day'} key={key}>
            <div className="planner-day-header">
              <strong>{date.toLocaleDateString('en-US', { weekday: 'short' })}</strong>
              <span>{date.getDate()}</span>
            </div>
            <div className="planner-bar-track">
              <div className="planner-bar" style={{ width: `${(hours / maxHours) * 100}%` }} />
            </div>
            <p className="planner-hours">{hours}h study</p>
            <div className="planner-tasks">
              {dayTasks.length === 0 && <p className="planner-empty">No deadlines</p>}
              {dayTasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  className={task.completed ? 'planner-task done' : 'planner-task'}
                  onClick={() => onEdit(task)}
                >
                  <span>{task.title}</span>
                  <small>{task.estimatedHours > 0 ? `${task.estimatedHours}h` : 'No estimate'}</small>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WeeklyPlanner;