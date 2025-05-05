-- seed_data.sql
-- Sample data for Deep Work Session Tracker

-- Insert pre-scheduled sessions (using local time to match main.py's datetime.now)
INSERT INTO worksession (title, goal, scheduled_duration, status, created_at)
VALUES
  ('Write Blog Post', 'Draft the     productivity article', 60, 'scheduled', DATETIME('now', 'localtime')),
  ('Read Research Paper', 'Understand latest ML techniques', 90, 'scheduled', DATETIME('now', 'localtime'));


-- Insert interruptions for the completed session (assuming its id is 3)
INSERT INTO interruption (session_id, reason, pause_time)
VALUES
  (3, 'Phone call', DATETIME('now', '-45 minutes', 'localtime')),
  (3, 'Short break', DATETIME('now', '-30 minutes', 'localtime'));