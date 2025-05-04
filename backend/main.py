from datetime import datetime, timedelta
from typing import List, Optional, Union

from fastapi import Depends, FastAPI, HTTPException, Path, Query, status
from pydantic import BaseModel, constr
from sqlmodel import Field, Session, SQLModel, create_engine, select
from fastapi.middleware.cors import CORSMiddleware

# --- Database Models ---

class SessionStatus:
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    INTERRUPTED = "interrupted"
    ABANDONED = "abandoned"
    OVERDUE = "overdue"

class WorkSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    goal: Optional[str] = None
    scheduled_duration: int  # in minutes
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: str = Field(default=SessionStatus.SCHEDULED)
    created_at: datetime = Field(default_factory=datetime.now)

class Interruption(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: int = Field(foreign_key="worksession.id", index=True)
    reason: str
    pause_time: datetime = Field(default_factory=datetime.now)

# --- Pydantic Schemas for API ---

class InterruptionRead(BaseModel):
    id: int
    reason: str
    pause_time: datetime

class SessionCreate(BaseModel):
    title: constr(min_length=1)
    scheduled_duration: int  # minutes
    goal: Optional[str] = None

class SessionRead(BaseModel):
    id: int
    title: str
    goal: Optional[str]
    scheduled_duration: int
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    status: str
    created_at: datetime

class PauseRequest(BaseModel):
    reason: constr(min_length=1)

class SessionSummary(BaseModel):
    id: int
    title: str
    goal: Optional[str]
    scheduled_duration: int
    actual_duration: Optional[int]  # in minutes
    pauses_count: int
    status: str
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    interruptions: list[InterruptionRead] = []

# --- Database Setup ---

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

# --- FastAPI App ---

app = FastAPI(title="Deep Work Session Tracker")
# Add this after creating your FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Or ["*"] to allow all origins (not recommended in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.on_event("startup")
# def on_startup():
#     create_db_and_tables()

# --- Helper Functions ---

def get_session_or_404(session_id: int, db: Session) -> WorkSession:
    session_obj = db.get(WorkSession, session_id)
    if not session_obj:
        raise HTTPException(status_code=404, detail="Session not found")
    return session_obj

def count_pauses(session_id: int, db: Session) -> int:
    return len(db.exec(select(Interruption).where(Interruption.session_id == session_id)).all())

def get_last_interruption(session_id: int, db: Session) -> Optional[Interruption]:
    interruptions = db.exec(
        select(Interruption)
        .where(Interruption.session_id == session_id)
        .order_by(Interruption.pause_time.desc())
    ).all()
    return interruptions[0] if interruptions else None

# --- API Endpoints ---

@app.post("/sessions/", response_model=SessionRead, status_code=status.HTTP_201_CREATED)
def create_session(session_in: SessionCreate, db: Session = Depends(get_session)):
    session_obj = WorkSession(
        title=session_in.title,
        goal=session_in.goal,
        scheduled_duration=session_in.scheduled_duration,
        status=SessionStatus.SCHEDULED,
    )
    db.add(session_obj)
    db.commit()
    db.refresh(session_obj)
    return session_obj

@app.patch("/sessions/{session_id}/start", response_model=SessionRead)
def start_session(
    session_id: int = Path(..., gt=0),
    db: Session = Depends(get_session),
):
    session_obj = get_session_or_404(session_id, db)
    if (session_obj.status != SessionStatus.SCHEDULED):
        raise HTTPException(status_code=400, detail="Session can only be started from scheduled status")
    session_obj.start_time = datetime.now()
    session_obj.status = SessionStatus.ACTIVE
    db.add(session_obj)
    db.commit()
    db.refresh(session_obj)
    return session_obj

@app.patch("/sessions/{session_id}/pause", response_model=SessionRead)
def pause_session(
    pause_req: PauseRequest,
    session_id: int = Path(..., gt=0),
    db: Session = Depends(get_session),
):
    session_obj = get_session_or_404(session_id, db)
    if session_obj.status != SessionStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Session can only be paused if it is active")
    # Log interruption
    interruption = Interruption(session_id=session_id, reason=pause_req.reason)
    db.add(interruption)
    # Update session status
    session_obj.status = SessionStatus.PAUSED
    db.add(session_obj)
    db.commit()
    db.refresh(session_obj)

    # Check if pauses exceed 3 → mark interrupted
    pauses_count = count_pauses(session_id, db)
    if pauses_count > 3:
        session_obj.status = SessionStatus.INTERRUPTED
        db.add(session_obj)
        db.commit()
        db.refresh(session_obj)

    return session_obj

@app.patch("/sessions/{session_id}/resume", response_model=SessionRead)
def resume_session(
    session_id: int = Path(..., gt=0),
    db: Session = Depends(get_session),
):
    session_obj = get_session_or_404(session_id, db)
    if session_obj.status != SessionStatus.PAUSED:
        raise HTTPException(status_code=400, detail="Session can only be resumed if it is paused")
    session_obj.status = SessionStatus.ACTIVE
    db.add(session_obj)
    db.commit()
    db.refresh(session_obj)
    return session_obj

@app.patch("/sessions/{session_id}/complete", response_model=SessionRead)
def complete_session(
    session_id: int = Path(..., gt=0),
    db: Session = Depends(get_session),
):
    session_obj = get_session_or_404(session_id, db)
    if session_obj.status not in [SessionStatus.ACTIVE, SessionStatus.PAUSED]:
        raise HTTPException(status_code=400, detail="Session can only be completed if active or paused")

    # Mark end time as now
    session_obj.end_time = datetime.now()

    # Determine actual duration in minutes
    if session_obj.start_time is None:
        raise HTTPException(status_code=400, detail="Session has not been started")
    actual_duration = (session_obj.end_time - session_obj.start_time).total_seconds() / 60

    # Check if session was abandoned (paused but never resumed)
    if session_obj.status == SessionStatus.PAUSED:
        # If last interruption exists and session never resumed after that pause
        # Mark abandoned
        session_obj.status = SessionStatus.ABANDONED
    else:
        # Check if overdue (completed outside 10% margin)
        allowed_duration = session_obj.scheduled_duration * 1.1
        if actual_duration > allowed_duration:
            session_obj.status = SessionStatus.OVERDUE
        else:
            # Check if interrupted by pauses > 3 already handled in pause endpoint
            if session_obj.status != SessionStatus.INTERRUPTED:
                session_obj.status = SessionStatus.COMPLETED

    db.add(session_obj)
    db.commit()
    db.refresh(session_obj)
    return session_obj

@app.get("/sessions/history", response_model=List[SessionSummary])
def get_sessions_history(
    db: Session = Depends(get_session),
    offset: int = Query(0, ge=0),
    limit: int = Query(100, le=100),
):
    sessions = db.exec(select(WorkSession).offset(offset).limit(limit)).all()
    summaries = []
    for s in sessions:
        # Calculate actual duration if possible
        actual_duration = None
        if s.start_time and s.end_time:
            actual_duration = int((s.end_time - s.start_time).total_seconds() / 60)
        pauses_count = count_pauses(s.id, db)
        # Fetch interruptions for this session
        interruptions = db.exec(
            select(Interruption).where(Interruption.session_id == s.id)
        ).all()
        interruptions_data = [
            InterruptionRead(
                id=i.id,
                reason=i.reason,
                pause_time=i.pause_time
            ) for i in interruptions
        ]
        summaries.append(
            SessionSummary(
                id=s.id,
                title=s.title,
                goal=s.goal,
                scheduled_duration=s.scheduled_duration,
                actual_duration=actual_duration,
                pauses_count=pauses_count,
                status=s.status,
                start_time=s.start_time,
                end_time=s.end_time,
                interruptions=interruptions_data
            )
        )
    return summaries
