import React from 'react';
import './WeeklyReport.css';

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  return new Date(d.setDate(diff));
}

function WeeklyReport({ sessions = [] }) {
  const now = new Date();
  const startOfWeek = getStartOfWeek(now);
  const weekSessions = sessions.filter(s => {
    if (!s.start_time) return false;
    const sessionDate = new Date(s.start_time);
    return sessionDate >= startOfWeek && sessionDate <= now;
  });

  const completed = weekSessions.filter(s => s.status === 'completed').length;
  const interrupted = weekSessions.filter(s => s.status === 'interrupted').length;
  const abandoned = weekSessions.filter(s => s.status === 'abandoned').length;
  const overdue = weekSessions.filter(s => s.status === 'overdue').length;
  const total = weekSessions.length;

  const avgDuration = weekSessions.length
    ? (
        weekSessions.reduce((sum, s) => {
          if (!s.start_time || !s.end_time) return sum;
          return sum + (new Date(s.end_time) - new Date(s.start_time)) / (1000 * 60);
        }, 0) / weekSessions.length
      ).toFixed(1)
    : 0;

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'interrupted': return 'status-interrupted';
      case 'abandoned': return 'status-abandoned';
      case 'overdue': return 'status-overdue';
      default: return 'status-default';
    }
  };

  // Status icon mapping with simpler icons
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': 
        return (
          <span className="status-icon status-completed">
            ✓
          </span>
        );
      case 'interrupted': 
        return (
          <span className="status-icon status-interrupted">
            !
          </span>
        );
      case 'abandoned': 
        return (
          <span className="status-icon status-abandoned">
            ✕
          </span>
        );
      case 'overdue': 
        return (
          <span className="status-icon status-overdue">
            ⧖
          </span>
        );
      default: return null;
    }
  };

  // Format duration from minutes
  const formatDuration = (minutes) => {
    if (minutes === '-') return '-';
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  };

  // Sample data for preview
  const sampleSessions = weekSessions.length > 0 ? weekSessions : [
    {
      title: "Project Planning",
      status: "completed",
      start_time: "2025-05-01T09:00:00",
      end_time: "2025-05-01T10:30:00"
    },
    {
      title: "Client Meeting",
      status: "interrupted",
      start_time: "2025-05-02T13:00:00",
      end_time: "2025-05-02T14:15:00"
    },
    {
      title: "Research Task",
      status: "abandoned",
      start_time: "2025-05-03T15:00:00",
      end_time: "2025-05-03T15:45:00"
    }
  ];

  const sessionsToDisplay = weekSessions.length > 0 ? weekSessions : sampleSessions;

  return (
    <div className="weekly-report-container">
      {/* Header */}
      <div className="report-header">
        <div className="report-header-content">
          <h1 className="report-title">Weekly Productivity Report</h1>
          <div className="report-date">
            <span className="report-calendar-icon">📅</span>
            <span>{startOfWeek.toLocaleDateString()} - {now.toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stats-card">
          <h2 className="stats-card-title">Sessions Overview</h2>
          <div className="stats-card-content">
            <div className="stats-row">
              <span className="stats-label">Total Sessions:</span>
              <span className="stats-value">{total}</span>
            </div>
            <div className="stats-row">
              <div className="stats-label-icon">
                <span className="status-icon status-completed">✓</span>
                <span className="stats-label">Completed:</span>
              </div>
              <span className="stats-value stats-value-completed">{completed}</span>
            </div>
            <div className="stats-row">
              <div className="stats-label-icon">
                <span className="status-icon status-interrupted">!</span>
                <span className="stats-label">Interrupted:</span>
              </div>
              <span className="stats-value stats-value-interrupted">{interrupted}</span>
            </div>
            <div className="stats-row">
              <div className="stats-label-icon">
                <span className="status-icon status-abandoned">✕</span>
                <span className="stats-label">Abandoned:</span>
              </div>
              <span className="stats-value stats-value-abandoned">{abandoned}</span>
            </div>
            <div className="stats-row">
              <div className="stats-label-icon">
                <span className="status-icon status-overdue">⧖</span>
                <span className="stats-label">Overdue:</span>
              </div>
              <span className="stats-value stats-value-overdue">{overdue}</span>
            </div>
          </div>
        </div>

        <div className="stats-card stats-card-analytics">
          <h2 className="stats-card-title">Time Analytics</h2>
          <div className="time-analytics">
            <div className="time-analytics-content">
              <div className="time-analytics-row">
                <span className="time-analytics-icon">⏱</span>
                <span className="time-analytics-value">{avgDuration}</span>
              </div>
              <p className="time-analytics-label">Average Session Duration (minutes)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="sessions-table-section">
        <h2 className="sessions-table-title">Sessions This Week</h2>
        <div className="sessions-table-wrapper">
          <table className="sessions-table">
            <thead>
              <tr className="sessions-table-header-row">
                <th>Title</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {sessionsToDisplay.map((s, index) => {
                const duration = s.start_time && s.end_time
                  ? Math.round((new Date(s.end_time) - new Date(s.start_time)) / (1000 * 60))
                  : '-';
                
                return (
                  <tr key={index} className="sessions-table-row">
                    <td className="sessions-table-cell sessions-table-title-cell">{s.title}</td>
                    <td className="sessions-table-cell">
                      <div className="status-cell">
                        {getStatusIcon(s.status)}
                        <span className={`status-label ${getStatusColor(s.status)}`}>{s.status}</span>
                      </div>
                    </td>
                    <td className="sessions-table-cell">
                      {s.start_time ? new Date(s.start_time).toLocaleString() : '-'}
                    </td>
                    <td className="sessions-table-cell">
                      {s.end_time ? new Date(s.end_time).toLocaleString() : '-'}
                    </td>
                    <td className="sessions-table-cell sessions-table-duration-cell">
                      {formatDuration(duration)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <span className="footer-dot">●</span> Generated on {new Date().toLocaleString()}
      </div>
    </div>
  );
}

export default WeeklyReport;
