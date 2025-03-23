from sqlalchemy import Column, Integer, String, ForeignKey, Time
from sqlalchemy.orm import relationship
from database import Base, engine  # Import engine here
class Faculty(Base):
    __tablename__ = "faculty"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    department = Column(String(255))
    courses = relationship("Course", back_populates="faculty")
    timetables = relationship("Timetable", back_populates="faculty")

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    faculty_id = Column(Integer, ForeignKey("faculty.id"), nullable=False)
    faculty = relationship("Faculty", back_populates="courses")
    timetables = relationship("Timetable", back_populates="course")

class Classroom(Base):
    __tablename__ = "classrooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    capacity = Column(Integer, nullable=False)
    timetables = relationship("Timetable", back_populates="classroom")

class Timetable(Base):
    __tablename__ = "timetables"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    faculty_id = Column(Integer, ForeignKey("faculty.id"), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    day_of_week = Column(String(50), nullable=False)
    course = relationship("Course", back_populates="timetables")
    classroom = relationship("Classroom", back_populates="timetables")
    faculty = relationship("Faculty", back_populates="timetables")

# Create tables
Base.metadata.create_all(bind=engine)