import React, { useState, useEffect } from 'react';
import './ActiveSession.css';

const ActiveSession = ({ session, onPause, onResume, onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [pauseReason, setPauseReason] = useState('');
  const [showPauseDialog, setShowPauseDialog] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!session) return;
    
    const startTime = new Date(session.start_time);
    const scheduledDuration = session.scheduled_duration * 60 * 1000; // convert to ms
    const endTime = new Date(startTime.getTime() + scheduledDuration);
    
    if (session.status === 'active') {
      const timer = setInterval(() => {
        const now = new Date();
        const remaining = Math.max(0, endTime - now);
        setTimeRemaining(remaining);
        
        // Calculate elapsed time
        const elapsed = now - startTime;
        setElapsedTime(elapsed);
        
        if (remaining <= 0) {
          clearInterval(timer);
        }
      }, 1000);
      
      return () => clearInterval(timer);
    } else if (session.status === 'paused') {
      // When paused, calculate the time remaining when it was paused
      const pauseTime = new Date(session.interruptions[session.interruptions.length - 1].pause_time);
      const remainingAtPause = Math.max(0, endTime - pauseTime);
      setTimeRemaining(remainingAtPause);
      
      // Calculate elapsed time until pause
      const elapsed = pauseTime - startTime;
      setElapsedTime(elapsed);
    }
  }, [session]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePauseClick = () => {
    setShowPauseDialog(true);
  };

  const handlePauseSubmit = () => {
    if (pauseReason.trim()) {
      onPause(session.id, pauseReason);
      setShowPauseDialog(false);
      setPauseReason('');
    }
  };

  const handleResumeClick = () => {
    onResume(session.id);
  };

  const handleCompleteClick = () => {
    onComplete(session.id);
  };

  if (!session) {
    return <div className="no-active-session">No active session found.</div>;
  }

  const isPaused = session.status === 'paused';
  const interruptions = session.interruptions || [];
  const interruptionCount = interruptions.length;
  
  // Calculate progress percentage
  const progressPercentage = session.scheduled_duration > 0 
    ? Math.min(100, (elapsedTime / (session.scheduled_duration * 60 * 1000)) * 100)
    : 0;

  return (
    <div className="active-session-container">
      <div className="session-header">
        <h2>{session.title}</h2>
        <div className="session-status">Status: <span className={session.status}>{session.status}</span></div>
      </div>
      
      <div className="session-goal">
        <h3>Goal:</h3>
        <p>{session.goal || 'No goal set'}</p>
      </div>
      
      <div className="time-display">
        <div className="time-remaining">
          <h3>Time Remaining:</h3>
          <div className="countdown">{formatTime(timeRemaining)}</div>
        </div>
        
        <div className="duration-info">
          <p>Total Duration: {session.scheduled_duration} minutes</p>
          <p>Started at: {new Date(session.start_time).toLocaleTimeString()}</p>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {interruptionCount > 0 && (
        <div className="interruptions-info">
          <h3>Interruptions: {interruptionCount}</h3>
          <ul className="interruptions-list">
            {interruptions.map((interruption, index) => (
              <li key={index}>
                <span className="interruption-time">
                  {new Date(interruption.pause_time).toLocaleTimeString()}
                </span>
                <span className="interruption-reason">{interruption.reason}</span>
              </li>
            ))}
          </ul>
          {interruptionCount >= 3 && (
            <div className="warning">Warning: Session will be marked as interrupted if paused again.</div>
          )}
        </div>
      )}
      
      <div className="session-controls">
        {!isPaused ? (
          <button onClick={handlePauseClick} className="btn btn-warning">
            Pause Session
          </button>
        ) : (
          <button onClick={handleResumeClick} className="btn btn-info">
            Resume Session
          </button>
        )}
        <button onClick={handleCompleteClick} className="btn btn-success">
          Complete Session
        </button>
      </div>

      {showPauseDialog && (
        <div className="pause-dialog">
          <h3>Why are you pausing?</h3>
          <select 
            value={pauseReason} 
            onChange={(e) => setPauseReason(e.target.value)}
            className="pause-reason-select"
          >
            <option value="">Select a reason...</option>
            <option value="Phone call">Phone call</option>
            <option value="Slack message">Slack message</option>
            <option value="Email interruption">Email interruption</option>
            <option value="Colleague interruption">Colleague interruption</option>
            <option value="Need a break">Need a break</option>
            <option value="Distraction">Distraction</option>
            <option value="Other">Other</option>
          </select>
          {pauseReason === 'Other' && (
            <input
              type="text"
              placeholder="Specify reason..."
              value={pauseReason}
              onChange={(e) => setPauseReason(e.target.value)}
              className="pause-reason-input"
            />
          )}
          <div className="dialog-buttons">
            <button onClick={() => setShowPauseDialog(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button 
              onClick={handlePauseSubmit} 
              disabled={!pauseReason.trim()} 
              className="btn btn-primary"
            >
              Pause
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveSession;