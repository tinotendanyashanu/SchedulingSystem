from sqlalchemy.orm import Session
from models import Course, Classroom, Timetable
from datetime import time

class TimetableService:
    def generate_timetable(self, db: Session):
        courses = db.query(Course).all()
        classrooms = db.query(Classroom).all()
        time_slots = [
            {"day": "Monday", "start": time(8, 0), "end": time(10, 0)},
            {"day": "Monday", "start": time(10, 0), "end": time(12, 0)},
            {"day": "Tuesday", "start": time(8, 0), "end": time(10, 0)},
        ]

        # Clear existing timetable
        db.query(Timetable).delete()
        db.commit()

        timetable = []
        for course in courses:
            for slot in time_slots:
                classroom = self._find_available_classroom(db, classrooms, slot)
                if classroom and not self._has_conflict(db, course, slot):
                    entry = Timetable(
                        course_id=course.id,
                        classroom_id=classroom.id,
                        faculty_id=course.faculty_id,
                        start_time=slot["start"],
                        end_time=slot["end"],
                        day_of_week=slot["day"]
                    )
                    db.add(entry)
                    db.commit()
                    db.refresh(entry)
                    timetable.append(entry)
                    break
        return timetable

    def _find_available_classroom(self, db: Session, classrooms, slot):
        for classroom in classrooms:
            conflict = db.query(Timetable).filter(
                Timetable.classroom_id == classroom.id,
                Timetable.day_of_week == slot["day"],
                Timetable.start_time <= slot["end"],
                Timetable.end_time >= slot["start"]
            ).first()
            if not conflict:
                return classroom
        return None

    def _has_conflict(self, db: Session, course, slot):
        return db.query(Timetable).filter(
            Timetable.faculty_id == course.faculty_id,
            Timetable.day_of_week == slot["day"],
            Timetable.start_time <= slot["end"],
            Timetable.end_time >= slot["start"]
        ).first() is not None