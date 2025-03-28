import axios from "axios";

const API_URL = "http://localhost:8000";

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

export interface Token {
    access_token: string;
    token_type: string;
}

export interface Message {
    message: string;
}

export const fetchFaculty = async (token: string): Promise<Faculty[]> =>
    axios.get(`${API_URL}/faculty/`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

export const createFaculty = async (data: Omit<Faculty, "id">, token: string): Promise<Faculty> =>
    axios.post(`${API_URL}/faculty/`, data, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

export const fetchCourses = async (token: string): Promise<Course[]> =>
    axios.get(`${API_URL}/courses/`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

export const createCourse = async (data: Omit<Course, "id">, token: string): Promise<Course> =>
    axios.post(`${API_URL}/courses/`, data, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

export const fetchClassrooms = async (token: string): Promise<Classroom[]> =>
    axios.get(`${API_URL}/classrooms/`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

export const createClassroom = async (data: Omit<Classroom, "id">, token: string): Promise<Classroom> =>
    axios.post(`${API_URL}/classrooms/`, data, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

export const generateTimetable = async (token: string): Promise<TimetableEntry[]> =>
    axios.get(`${API_URL}/timetable/generate/`, { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data);

export const login = async (username: string, password: string): Promise<Token> =>
    axios.post(`${API_URL}/login`, new URLSearchParams({ username, password }), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }).then(res => res.data);

export const signup = async (username: string, email: string, password: string): Promise<Message> =>
    axios.post(`${API_URL}/signup`, { username, email, password }).then(res => res.data);

export const forgotPassword = async (email: string): Promise<Message> =>
    axios.post(`${API_URL}/forgot-password`, { email }).then(res => res.data);