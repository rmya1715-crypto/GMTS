import { useState } from 'react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function CalendarView({ tasks, today, onEdit }) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const monthName = visibleMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: firstWeekday }, (_, index) => ({
      key: `blank-${index}`,
      day: null,
    })),
    ...Array.from({ length: daysInMonth }, (_, index) => ({
      key: `day-${index + 1}`,
      day: index + 1,
    })),
  ];

  function moveMonth(offset) {
    setVisibleMonth(new Date(year, month + offset, 1));
  }

  function dateKey(day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  return (
    <section className="calendar-panel" aria-label={`${monthName} calendar`}>
      <div className="calendar-toolbar">
        <div>
          <h2>{monthName}</h2>
          <p>Tasks appear on their due date.</p>
        </div>
        <div className="calendar-controls">
          <button type="button" onClick={() => setVisibleMonth(new Date())}>Today</button>
          <button type="button" aria-label="Previous month" onClick={() => moveMonth(-1)}>‹</button>
          <button type="button" aria-label="Next month" onClick={() => moveMonth(1)}>›</button>
        </div>
      </div>
      <div className="calendar-grid calendar-weekdays" aria-hidden="true">
        {WEEKDAYS.map((weekday) => <span key={weekday}>{weekday}</span>)}
      </div>
      <div className="calendar-grid calendar-days">
        {cells.map(({ key, day }) => {
          if (day === null) {
            return <div className="calendar-cell calendar-empty" key={key} aria-hidden="true" />;
          }

          const currentDate = dateKey(day);
          const dayTasks = tasks.filter((task) => task.dueDate === currentDate);
          const isToday = currentDate === today;

          return (
            <div className={isToday ? 'calendar-cell is-today' : 'calendar-cell'} key={key}>
              <span className="calendar-day-number">{day}</span>
              <div className="calendar-day-tasks">
                {dayTasks.map((task) => (
                  <button
                    className={`calendar-task ${task.category.toLowerCase()}`}
                    key={task.id}
                    type="button"
                    title={`${task.title} - ${task.category}`}
                    onClick={() => onEdit(task)}
                  >
                    <span>{task.title}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default CalendarView;