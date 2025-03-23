import axios from "axios";

const API_URL = "http://localhost:8000";

export interface Course {
    id: number;
    name: string;
    department: string;
    faculty_id: string;
}

export interface TimetableEntry {
    course: string;
    classroom: string;
    day: string;
    start: string;
    end: string;
}

export const fetchCourses = async (): Promise<Course[]> =>
    axios.get(`${API_URL}/courses/`).then(res => res.data);

export const createCourse = async (data: Omit<Course, "id">): Promise<Course> =>
    axios.post(`${API_URL}/courses/`, data).then(res => res.data);

export const generateTimetable = async (): Promise<TimetableEntry[]> =>
    axios.get(`${API_URL}/timetable/generate/`).then(res => res.data);