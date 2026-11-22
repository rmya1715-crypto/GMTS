
import { useState } from 'react';

const STORAGE_KEY = 'gmts-notification-settings';

const DEFAULT_SETTINGS = {
  enabled: true,
  daysBefore: 2,
  overdueEnabled: true,
};

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved
      ? { ...DEFAULT_SETTINGS, ...saved }
      : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function getDaysUntil(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const dueDate = new Date(year, month - 1, day);

  if (Number.isNaN(dueDate.getTime())) return null;

  const today = new Date();
  const startToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return Math.round(
    (dueDate - startToday) / 86400000
  );
}

function NotificationSettings({ tasks }) {
  const [settings, setSettings] = useState(loadSettings);
  const [savedMessage, setSavedMessage] = useState('');

  function updateSetting(name, value) {
    setSettings((previous) => ({
      ...previous,
      [name]: value,
    }));
    setSavedMessage('');
  }

  function saveSettings() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings)
    );
    setSavedMessage('Notification preferences saved!');
  }

  const reminders = settings.enabled
    ? tasks.filter((task) => {
        if (task.completed || !task.dueDate) return false;

        const days = getDaysUntil(task.dueDate);
        if (days === null) return false;

        if (days < 0) {
          return settings.overdueEnabled;
        }

        return days <= settings.daysBefore;
      })
    : [];

  return (
    <section className="notification-settings">
      <h2>Notification Settings</h2>
      <p>Customize your assignment reminders.</p>

      <label>
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(event) =>
            updateSetting('enabled', event.target.checked)
          }
        />
        Enable assignment reminders
      </label>

      <div style={{ marginTop: '15px' }}>
        <label htmlFor="reminder-days">
          Remind me before a deadline:
        </label>

        <select
          id="reminder-days"
          value={settings.daysBefore}
          disabled={!settings.enabled}
          onChange={(event) =>
            updateSetting(
              'daysBefore',
              Number(event.target.value)
            )
          }
        >
          <option value={0}>On the due date</option>
          <option value={1}>1 day before</option>
          <option value={2}>2 days before</option>
          <option value={3}>3 days before</option>
          <option value={7}>7 days before</option>
        </select>
      </div>

      <div style={{ marginTop: '15px' }}>
        <label>
          <input
            type="checkbox"
            checked={settings.overdueEnabled}
            disabled={!settings.enabled}
            onChange={(event) =>
              updateSetting(
                'overdueEnabled',
                event.target.checked
              )
            }
          />
          Show overdue assignment reminders
        </label>
      </div>

      <div style={{ marginTop: '15px' }}>
        <button type="button" onClick={saveSettings}>
          Save Notification Settings
        </button>
      </div>

      {savedMessage && (
        <p role="status">{savedMessage}</p>
      )}

      <h3>Assignment Reminders</h3>

      {!settings.enabled ? (
        <p>Assignment reminders are disabled.</p>
      ) : reminders.length === 0 ? (
        <p>No upcoming or overdue reminders.</p>
      ) : (
        <ul>
          {reminders.map((task) => {
            const days = getDaysUntil(task.dueDate);

            return (
              <li key={task.id}>
                <strong>{task.title}</strong>
                {' — '}
                {days < 0
                  ? `${Math.abs(days)} day(s) overdue`
                  : days === 0
                  ? 'Due today'
                  : `Due in ${days} day(s)`}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default NotificationSettings;
