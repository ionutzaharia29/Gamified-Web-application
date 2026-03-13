const API_URL = "http://localhost:8080/api/courses";

export async function getAllCourses() {
    const res = await fetch(API_URL);
    return res.json();
}