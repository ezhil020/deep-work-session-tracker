import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SessionForm from './components/SessionForm';
import ActiveSession from './components/ActiveSession';
import WeeklyReport from './components/WeeklyReport';
import SessionHistory from './components/SessionHistory';
import './App.css';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('schedule'); // 'schedule', 'active', 'history'

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/sessions/history`);
      setSessions(response.data);

      // Find all active or paused sessions
      const actives = response.data.filter(session =>
        session.status === 'active' || session.status === 'paused'
      );
      setActiveSessions(actives);

      // Only switch to active view if any active session exists
      if (actives.length > 0) {
        setView('active');
      }
      setError(null); // Clear error on success
    } catch (err) {
      setError('Failed to fetch sessions. Please try again later.');
      setActiveSessions([]);
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sessions/`, sessionData);
      await fetchSessions();
      return response.data;
    } catch (err) {
      setError('Failed to create session. Please try again.');
      console.error('Error creating session:', err);
      return null;
    }
  };

  const startSession = async (sessionId) => {
    try {
      await axios.patch(`${API_BASE_URL}/sessions/${sessionId}/start`);
      await fetchSessions();
      setView('active');
    } catch (err) {
      setError('Failed to start session. Please try again.');
      console.error('Error starting session:', err);
    }
  };

  const pauseSession = async (sessionId, reason) => {
    try {
      await axios.patch(`${API_BASE_URL}/sessions/${sessionId}/pause`, { reason });
      await fetchSessions();
    } catch (err) {
      setError('Failed to pause session. Please try again.');
      console.error('Error pausing session:', err);
    }
  };

  const resumeSession = async (sessionId) => {
    try {
      await axios.patch(`${API_BASE_URL}/sessions/${sessionId}/resume`);
      await fetchSessions();
    } catch (err) {
      setError('Failed to resume session. Please try again.');
      console.error('Error resuming session:', err);
    }
  };

  const completeSession = async (sessionId) => {
    try {
      await axios.patch(`${API_BASE_URL}/sessions/${sessionId}/complete`);
      await fetchSessions();
      setView('history');
      setActiveSession(null);
    } catch (err) {
      setError('Failed to complete session. Please try again.');
      console.error('Error completing session:', err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    switch (view) {
      case 'schedule':
        return (
          <SessionForm 
            onSubmit={createSession} 
            onStartSession={startSession} 
            sessions={sessions.filter(s => s.status === 'scheduled')}
          />
        );
      case 'active':
        return (
          <div>
            {activeSessions.length === 0 ? (
              <div className="no-active-session">No active session found.</div>
            ) : (
              activeSessions.map(session => (
                <ActiveSession
                  key={session.id}
                  session={session}
                  onPause={pauseSession}
                  onResume={resumeSession}
                  onComplete={completeSession}
                />
              ))
            )}
          </div>
        );
      case 'history':
        return <SessionHistory sessions={sessions} />;

     case 'report':
            return <WeeklyReport sessions={sessions} />;
      default:
        return <div>Invalid view</div>;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Deep Work Session Tracker</h1>
        <nav className="app-nav">
          <button 
            className={view === 'schedule' ? 'active' : ''} 
            onClick={() => setView('schedule')}
          >
            Schedule Session
          </button>
          {activeSession && (
            <button 
              className={view === 'active' ? 'active' : ''} 
              onClick={() => setView('active')}
            >
              Active Session
            </button>
          )}
          {activeSessions.length > 0 && (
            <button
              className={view === 'active' ? 'active' : ''}
              onClick={() => setView('active')}
            >
              Active Sessions ({activeSessions.length})
            </button>
          )}
          <button 
            className={view === 'history' ? 'active' : ''} 
            onClick={() => setView('history')}
          >
            Session History
          </button>

          <button
  className={view === 'report' ? 'active' : ''}
  onClick={() => setView('report')}
>
  Weekly Report
</button>
        </nav>
      </header>
      <main className="app-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;