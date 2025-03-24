import axios from "axios";

const API_URL = "http://localhost:8000"; // Update to Render URL later

// Type definitions matching backend response models
export interface Faculty {
    id: number;
    name: string;
    department: string;
}

export interface Course {
    id: number;
    name: string;
    department: string;
    faculty_id: number;
}

export interface Classroom {
    id: number;
    name: string;
    capacity: number;
}

export interface TimetableEntry {
    id: number;
    course_name: string;
    classroom_name: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
}

// API functions
export const fetchFaculty = async (): Promise<Faculty[]> =>
    axios.get(`${API_URL}/faculty/`).then(res => res.data);

export const createFaculty = async (data: Omit<Faculty, "id">): Promise<Faculty> =>
    axios.post(`${API_URL}/faculty/`, data).then(res => res.data);

export const fetchCourses = async (): Promise<Course[]> =>
    axios.get(`${API_URL}/courses/`).then(res => res.data);

export const createCourse = async (data: Omit<Course, "id">): Promise<Course> =>
    axios.post(`${API_URL}/courses/`, data).then(res => res.data);

export const fetchClassrooms = async (): Promise<Classroom[]> =>
    axios.get(`${API_URL}/classrooms/`).then(res => res.data);

export const createClassroom = async (data: Omit<Classroom, "id">): Promise<Classroom> =>
    axios.post(`${API_URL}/classrooms/`, data).then(res => res.data);

export const generateTimetable = async (): Promise<TimetableEntry[]> =>
    axios.get(`${API_URL}/timetable/generate/`).then(res => res.data);