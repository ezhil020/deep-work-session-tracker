
@echo off
echo Starting backend...
cd backend
call env\Scripts\activate
start uvicorn main:app --reload
cd ..

echo Starting frontend...
cd deepwork_Frontend
start npm start
cd ..

echo Both backend and frontend are running.
pause