import React, { useState } from 'react';
import './SessionHistory.css';

const SessionHistory = ({ sessions }) => {
  const [filter, setFilter] = useState('all');
  const [sortField, setSortField] = useState('start_time');
  const [sortDirection, setSortDirection] = useState('desc');

  // Filter sessions based on filter state
  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  // Sort sessions based on sortField and sortDirection
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate summary statistics
  const calculateStats = () => {
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalSessions = sessions.length;
    const completionRatio = totalSessions > 0 ? (completedSessions.length / totalSessions) * 100 : 0;
    
    const totalDuration = completedSessions.reduce((sum, session) => {
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);
      return sum + (end - start);
    }, 0);
    
    const averageDuration = completedSessions.length > 0 ? totalDuration / completedSessions.length : 0;
    
    const totalInterruptions = sessions.reduce((sum, session) => {
      return sum + (session.interruptions ? session.interruptions.length : 0);
    }, 0);
    
    return {
      totalSessions,
      completedSessions: completedSessions.length,
      completionRatio: completionRatio.toFixed(1),
      averageDuration: (averageDuration / (1000 * 60)).toFixed(1), // in minutes
      totalInterruptions,
      avgInterruptionsPerSession: totalSessions > 0 ? (totalInterruptions / totalSessions).toFixed(1) : 0
    };
  };

  const stats = calculateStats();

  // Helper function to format duration
  const formatDuration = (startTime, endTime) => {
    if (!startTime) return 'N/A';
    
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = (end - start) / (1000 * 60); // duration in minutes (float)
    return `${duration.toFixed(1)} min`;
  };

  // Helper function to determine status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'active': return 'status-active';
      case 'paused': return 'status-paused';
      case 'interrupted': return 'status-interrupted';
      case 'abandoned': return 'status-abandoned';
      case 'overdue': return 'status-overdue';
      default: return 'status-scheduled';
    }
  };

  // Helper function to convert sessions to CSV
  const exportToCSV = () => {
    if (!sessions || sessions.length === 0) return;
  
    const headers = [
      "Title",
      "Goal",
      "Status",
      "Start Date",
      "Start Time",
      "End Date",
      "End Time",
      "Duration (min)",
      "Interruptions"
    ];
  
    const rows = sessions.map(session => [
      `"${session.title}"`,
      `"${session.goal || ''}"`,
      session.status,
      session.start_time ? new Date(session.start_time).toLocaleString() : '',
      session.end_time ? new Date(session.end_time).toLocaleString() : '',
      session.start_time && session.end_time
        ? Math.round((new Date(session.end_time) - new Date(session.start_time)) / (1000 * 60))
        : '',
      session.interruptions ? session.interruptions.length : 0
    ]);
  
    const csvContent =
      [headers, ...rows]
        .map(e => e.join(","))
        .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "session_history.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate focus score: 100 - (interruptions / scheduled_duration) * 100
  const getFocusScore = (session) => {
    if (!session.scheduled_duration || session.scheduled_duration === 0) return 100;
    const interruptions = session.interruptions ? session.interruptions.length : 0;
    let score = 100 - (interruptions / session.scheduled_duration) * 100;
    if (score < 0) score = 0;
    return Math.round(score);
  };

  return (
    <div className="session-history-container">
      <div className="history-header">
        <h2>Session History</h2>
        <div className="filter-sort-controls">
          <div className="filter-controls">
            <label htmlFor="statusFilter">Filter by status:</label>
            <select 
              id="statusFilter" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Sessions</option>
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="interrupted">Interrupted</option>
              <option value="abandoned">Abandoned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <button className="btn btn-secondary" onClick={exportToCSV}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="stats-summary">
        <h3>Summary Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalSessions}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completedSessions}</div>
            <div className="stat-label">Completed Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completionRatio}%</div>
            <div className="stat-label">Completion Ratio</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.averageDuration}</div>
            <div className="stat-label">Avg. Duration (min)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.totalInterruptions}</div>
            <div className="stat-label">Total Interruptions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.avgInterruptionsPerSession}</div>
            <div className="stat-label">Avg. Interruptions</div>
          </div>
        </div>
      </div>

      {sortedSessions.length > 0 ? (
        <div className="sessions-table-container">
          <table className="sessions-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('title')}>
                  Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('start_time')}>
                  Start Time {sortField === 'start_time' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Duration</th>
                <th>Interruptions</th>
                <th>Focus Score</th>
                <th onClick={() => handleSort('status')}>
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSessions.map(session => (
                <tr key={session.id} className="session-row">
                  <td className="session-title">
                    <strong>{session.title}</strong>
                    <div className="session-goal">{session.goal || 'No goal set'}</div>
                  </td>
                  <td>
                    {session.start_time 
                      ? new Date(session.start_time).toLocaleString() 
                      : 'Not started'}
                  </td>
                  <td>{formatDuration(session.start_time, session.end_time)}</td>
                  <td>
                    {session.interruptions && session.interruptions.length > 0 
                      ? session.interruptions.length 
                      : 0}
                  </td>
                  <td>
                    {getFocusScore(session)}%
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(session.status)}`}>
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-sessions-message">
          No sessions match your filter criteria.
        </div>
      )}
    </div>
  );
};

export default SessionHistory;