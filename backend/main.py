from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db
from models import Faculty, Course, Classroom, Timetable
from pydantic import BaseModel
from services import TimetableService

app = FastAPI(title="Exam Scheduling System API")
# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Pydantic models for requests
class FacultyCreate(BaseModel):
    name: str
    department: str

class CourseCreate(BaseModel):
    name: str
    department: str
    faculty_id: int

class ClassroomCreate(BaseModel):
    name: str
    capacity: int

# Pydantic models for responses (with from_attributes=True)
class FacultyResponse(BaseModel):
    id: int
    name: str
    department: str

    class Config:
        from_attributes = True  # Replaces orm_mode in Pydantic v2

class CourseResponse(BaseModel):
    id: int
    name: str
    department: str
    faculty_id: int

    class Config:
        from_attributes = True

class ClassroomResponse(BaseModel):
    id: int
    name: str
    capacity: int

    class Config:
        from_attributes = True

# Response models
class FacultyResponse(BaseModel):
    id: int
    name: str
    department: str
    class Config:
        from_attributes = True

class CourseResponse(BaseModel):
    id: int
    name: str
    department: str
    faculty_id: int
    class Config:
        from_attributes = True

class ClassroomResponse(BaseModel):
    id: int
    name: str
    capacity: int
    class Config:
        from_attributes = True

class TimetableResponse(BaseModel):
    id: int
    course_name: str
    classroom_name: str
    day_of_week: str
    start_time: str
    end_time: str
    class Config:
        from_attributes = True

# Faculty Endpoints
@app.post("/faculty/", response_model=FacultyResponse)
def create_faculty(faculty: FacultyCreate, db: Session = Depends(get_db)):
    db_faculty = Faculty(**faculty.dict())
    db.add(db_faculty)
    db.commit()
    db.refresh(db_faculty)
    return db_faculty

@app.get("/faculty/", response_model=list[FacultyResponse])
def get_faculty(db: Session = Depends(get_db)):
    return db.query(Faculty).all()

# Course Endpoints
@app.post("/courses/", response_model=CourseResponse)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    if not db.query(Faculty).filter(Faculty.id == course.faculty_id).first():
        raise HTTPException(status_code=404, detail="Faculty not found")
    db_course = Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.get("/courses/", response_model=list[CourseResponse])
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

# Classroom Endpoints
@app.post("/classrooms/", response_model=ClassroomResponse)
def create_classroom(classroom: ClassroomCreate, db: Session = Depends(get_db)):
    db_classroom = Classroom(**classroom.dict())
    db.add(db_classroom)
    db.commit()
    db.refresh(db_classroom)
    return db_classroom

@app.get("/classrooms/", response_model=list[ClassroomResponse])
def get_classrooms(db: Session = Depends(get_db)):
    return db.query(Classroom).all()

@app.get("/timetable/generate/", response_model=list[TimetableResponse])
def generate_timetable(db: Session = Depends(get_db)):
    service = TimetableService()
    timetable = service.generate_timetable(db)
    return [
        TimetableResponse(
            id=t.id,
            course_name=t.course.name,
            classroom_name=t.classroom.name,
            day_of_week=t.day_of_week,
            start_time=t.start_time.strftime("%H:%M"),
            end_time=t.end_time.strftime("%H:%M")
        )
        for t in timetable
    ]

@app.get("/timetable/", response_model=list[TimetableResponse])
def get_timetable(db: Session = Depends(get_db)):
    timetable = db.query(Timetable).all()
    return [
        TimetableResponse(
            id=t.id,
            course_name=t.course.name,
            classroom_name=t.classroom.name,
            day_of_week=t.day_of_week,
            start_time=t.start_time.strftime("%H:%M"),
            end_time=t.end_time.strftime("%H:%M")
        )
        for t in timetable
    ]
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)