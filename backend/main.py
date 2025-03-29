from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import get_db
from models import User, Faculty, Course, Classroom, Timetable
from pydantic import BaseModel
from services import TimetableService
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta

app = FastAPI(title="Exam Scheduling System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "eb9130be-abac-4fa2-ba0f-23c1534787c9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Pydantic models
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserResponse(BaseModel):
    username: str
    email: str
    class Config:
        from_attributes = True

class ForgotPasswordRequest(BaseModel):
    email: str

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

class Token(BaseModel):
    access_token: str
    token_type: str

class Message(BaseModel):
    message: str

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.username == username).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Authentication Endpoints
@app.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/signup", response_model=Message)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    db_user = User(username=user.username, email=user.email, password_hash=get_password_hash(user.password))
    db.add(db_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/forgot-password", response_model=Message)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):  # Fixed typo here
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    return {"message": "Password reset link sent to your email (simulated)"}

# Profile Endpoints
@app.get("/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@app.put("/profile", response_model=Message)
def update_profile(user_data: UserResponse, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if db.query(User).filter(User.username == user_data.username, User.id != current_user.id).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    if db.query(User).filter(User.email == user_data.email, User.id != current_user.id).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    current_user.username = user_data.username
    current_user.email = user_data.email
    db.commit()
    return {"message": "Profile updated successfully"}

# Faculty Endpoints
@app.get("/faculty/", response_model=list[FacultyResponse])
def get_faculty(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Faculty).all()

@app.post("/faculty/", response_model=FacultyResponse)
def create_faculty(faculty: FacultyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_faculty = Faculty(**faculty.dict())
    db.add(db_faculty)
    db.commit()
    db.refresh(db_faculty)
    return db_faculty

# Course Endpoints
@app.post("/courses/", response_model=CourseResponse)
def create_course(course: CourseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not db.query(Faculty).filter(Faculty.id == course.faculty_id).first():
        raise HTTPException(status_code=404, detail="Faculty not found")
    db_course = Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.get("/courses/", response_model=list[CourseResponse])
def get_courses(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Course).all()

# Classroom Endpoints
@app.post("/classrooms/", response_model=ClassroomResponse)
def create_classroom(classroom: ClassroomCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_classroom = Classroom(**classroom.dict())
    db.add(db_classroom)
    db.commit()
    db.refresh(db_classroom)
    return db_classroom

@app.get("/classrooms/", response_model=list[ClassroomResponse])
def get_classrooms(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Classroom).all()

# Timetable Endpoints
@app.get("/timetable/generate/", response_model=list[TimetableResponse])
def generate_timetable(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
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
def get_timetable(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
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