 
 import React, { useState } from 'react';
 import './SessionForm.css';
 
 const SessionForm = ({ onSubmit, onStartSession, sessions }) => {
   const [formData, setFormData] = useState({
     title: '',
     goal: '',
     scheduled_duration: 25,
   });
   const [successMessage, setSuccessMessage] = useState('');
 
   const handleChange = (e) => {
     const { name, value } = e.target;
     setFormData({
       ...formData,
       [name]: name === 'scheduled_duration' ? parseInt(value, 10) : value,
     });
   };
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     const result = await onSubmit(formData);
     if (result) {
       setSuccessMessage(`Session "${formData.title}" scheduled successfully!`);
       setFormData({
         title: '',
         goal: '',
         scheduled_duration: 25,
       });
       setTimeout(() => setSuccessMessage(''), 3000);
     }
   };
 
   const handleStartSession = async (sessionId) => {
     await onStartSession(sessionId);
   };
 
   return (
     <div className="session-form-container">
       <div className="form-section">
         <h2>Create a New Deep Work Session</h2>
         {successMessage && <div className="success-message">{successMessage}</div>}
         <form onSubmit={handleSubmit} className="session-form">
           <div className="form-group">
             <label htmlFor="title">Session Title:</label>
             <input
               type="text"
               id="title"
               name="title"
               value={formData.title}
               onChange={handleChange}
               required
               placeholder="What are you working on?"
             />
           </div>
           
           <div className="form-group">
             <label htmlFor="goal">Session Goal:</label>
             <textarea
               id="goal"
               name="goal"
               value={formData.goal}
               onChange={handleChange}
               placeholder="What do you want to accomplish?"
               rows="3"
             />
           </div>
           
           <div className="form-group">
             <label htmlFor="scheduled_duration">Duration (minutes):</label>
             <input
               type="number"
               id="scheduled_duration"
               name="scheduled_duration"
               value={formData.scheduled_duration}
               onChange={handleChange}
               min="1"
               max="180"
               required
             />
           </div>
           
           <button type="submit" className="btn btn-primary">Schedule Session</button>
         </form>
       </div>
 
       {sessions && sessions.length > 0 && (
         <div className="scheduled-sessions-section">
           <h2>Scheduled Sessions</h2>
           <div className="scheduled-sessions-list">
             {sessions.map(session => (
               <div key={session.id} className="scheduled-session-card">
                 <h3>{session.title}</h3>
                 <p className="session-goal">{session.goal || 'No goal set'}</p>
                 <p className="session-duration">{session.scheduled_duration} minutes</p>
                 <button 
                   onClick={() => handleStartSession(session.id)}
                   className="btn btn-success"
                 >
                   Start Now
                 </button>
               </div>
             ))}
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default SessionForm;