# Deep Work Session Tracker - React Frontend

This is the frontend for the Deep Work Session Tracker application, built with React. The application allows users to schedule, start, pause, resume, and complete focused work sessions, as well as view their session history and productivity statistics.

## Project Structure

```
deep-work-session-tracker/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ActiveSession.jsx
│   │   ├── ActiveSession.css
│   │   ├── SessionForm.jsx
│   │   ├── SessionForm.css
│   │   ├── SessionHistory.jsx
│   │   └── SessionHistory.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)
- The FastAPI backend server must be running on http://localhost:8000

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd deep-work-session-tracker/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make sure your backend server is running on http://localhost:8000

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to http://localhost:3000

## Features

### 1. Schedule New Sessions
- Create new work sessions with title, goal, and duration
- View a list of scheduled sessions that haven't been started yet

### 2. Manage Active Sessions
- Start scheduled sessions
- Pause active sessions (with reason tracking)
- Resume paused sessions
- Complete sessions
- View real-time timer countdown
- Track interruptions

### 3. View Session History
- See all past and current sessions
- Filter sessions by status
- Sort sessions by various criteria
- View productivity statistics

## Component Overview

### App.jsx
The main application component that manages routing between views and handles API communication.

### SessionForm.jsx
Handles the creation of new work sessions and allows users to start scheduled sessions.

### ActiveSession.jsx
Manages active sessions, including pause/resume functionality, completion, and interruption tracking.

### SessionHistory.jsx
Displays session history with filtering and sorting options, as well as productivity statistics.

## API Integration

The frontend communicates with the FastAPI backend through the following endpoints:

- `GET /sessions/history` - Fetch session history
- `POST /sessions/` - Create a new session
- `PATCH /sessions/{session_id}/start` - Start a session
- `PATCH /sessions/{session_id}/pause` - Pause a session
- `PATCH /sessions/{session_id}/resume` - Resume a session
- `PATCH /sessions/{session_id}/complete` - Complete a session

## Notes on Session States

The application handles various session states:

- **Scheduled**: Session is created but not yet started
- **Active**: Session is currently in progress
- **Paused**: Session is temporarily paused
- **Completed**: Session was successfully completed
- **Interrupted**: Session had more than 3 pauses
- **Abandoned**: Session was never resumed after being paused
- **Overdue**: Session took longer than 110% of its scheduled duration