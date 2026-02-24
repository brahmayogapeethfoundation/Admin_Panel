import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../config/env"; 

// Single Axios instance for /admin routes
const API = axios.create({
  baseURL: `${API_BASE_URL}/api/admin`,
  withCredentials: false,
});

// Admin login (general API, no /admin prefix)
export const adminLogin = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username,
      password,
    });
    toast.success("Login Successful");
    return response.data;
  } catch (error) {
    // console.error("Login Error:", error);
    toast.error(error.response?.data?.message || "Invalid username or password");
    throw error;
  }
};

export default API;


const getToken = () => localStorage.getItem("token");


API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



export const createTestimonial = async (data) => {
  const formData = new FormData();
  formData.append(
    "testimonial",
    JSON.stringify({
      name: data.name,
      feedback: data.feedback,
      rating: data.rating,
    })
  );
  if (data.photo) formData.append("photo", data.photo);

  return (await API.post("/testimonials", formData)).data;
};

export const updateTestimonial = async (id, data) => {
  const formData = new FormData();
  formData.append(
    "testimonial",
    JSON.stringify({
      name: data.name,
      feedback: data.feedback,
      rating: data.rating,
    })
  );
  if (data.photo) formData.append("photo", data.photo);

  return (await API.put(`/testimonials/${id}`, formData)).data;
};

export const getTestimonials = async () => {
  const res = await API.get("/testimonials");
  return res.data;
};

export const deleteTestimonial = async (id) => {
  await API.delete(`/testimonials/${id}`);
};




export const createGallery = async (data) => {
  const formData = new FormData();
  formData.append("gallery", JSON.stringify({ category: data.category }));
  if (data.image) formData.append("image", data.image);

  return (await API.post("/gallery", formData)).data;
};

export const updateGallery = async (id, data) => {
  const formData = new FormData();
  formData.append("gallery", JSON.stringify({ category: data.category }));
  if (data.image) formData.append("image", data.image);

  return (await API.put(`/gallery/${id}`, formData)).data;
};

export const getGallery = async () => {
  return (await API.get("/gallery")).data;
};

export const deleteGallery = async (id) => {
  await API.delete(`/gallery/${id}`);
};




export const createInstructor = async (data) => {
  const formData = new FormData();
  formData.append(
    "instructor",
    JSON.stringify({
      name: data.name,
      role: data.role,
      description: data.bio,
    })
  );
  if (data.photo) formData.append("photo", data.photo);

  return (await API.post("/instructors", formData)).data;
};

export const updateInstructor = async (id, data) => {
  const formData = new FormData();
  formData.append(
    "instructor",
    JSON.stringify({
      name: data.name,
      role: data.role,
      description: data.bio,
    })
  );
  if (data.photo) formData.append("photo", data.photo);

  return (await API.put(`/instructors/${id}`, formData)).data;
};

export const getInstructors = async () => {
  return (await API.get("/instructors")).data;
};

export const getInstructorById = async (id) => {
  return (await API.get(`/instructors/${id}`)).data;
};

export const deleteInstructor = async (id) => {
  await API.delete(`/instructors/${id}`);
};



export const createCourse = async (course, mainImage, option1, option2, option3) => {
  const fd = new FormData();
  fd.append("course", new Blob([JSON.stringify(course)], { type: "application/json" }));

  if (mainImage) fd.append("image", mainImage);
  if (option1) fd.append("optionImage1", option1);
  if (option2) fd.append("optionImage2", option2);
  if (option3) fd.append("optionImage3", option3);

  console.log("create course:", mainImage, option1, option2, option3);

  const res = await API.post("/courses", fd);
  return res.data;
};


export const updateCourse = async (
  id,
  course,
  mainImage,
  option1,
  option2,
  option3
) => {
  const fd = new FormData();
  fd.append("course", new Blob([JSON.stringify(course)], { type: "application/json" }));

  if (mainImage) fd.append("image", mainImage);
  if (option1) fd.append("optionImage1", option1);
  if (option2) fd.append("optionImage2", option2);
  if (option3) fd.append("optionImage3", option3);

  if (course.removeMainImage) fd.append("removeImage", "true");
  if (course.removeOptionImage1) fd.append("removeOptionImage1", "true");
  if (course.removeOptionImage2) fd.append("removeOptionImage2", "true");
  if (course.removeOptionImage3) fd.append("removeOptionImage3", "true");

  return (await API.put(`/courses/${id}`, fd)).data;
};

export const getCourses = async (onlyVisible = false) => {
  return (
    await API.get("/courses", { params: { onlyVisible } })
  ).data;
};

export const getCourseById = async (id) => {
  return (await API.get(`/courses/${id}`)).data;
};

export const deleteCourse = async (id) => {
  await API.delete(`/courses/${id}`);
};

export const toggleCourseVisibility = async (id) => {
  const res = await API.patch(`/courses/${id}/visibility`);
  return res.data; // this will be the updated CourseResponseDTO
};



export const createAccommodation = async (formData) => {
  return (await API.post("/accommodations", formData)).data;
};

export const updateAccommodation = async (id, formData) => {
  return (await API.put(`/accommodations/${id}`, formData)).data;
};

export const getAccommodations = async () => {
  return (await API.get("/accommodations")).data;
};

export const getAccommodationById = async (id) => {
  return (await API.get(`/accommodations/${id}`)).data;
};


export const deleteAccommodation = async (id) => {
  await API.delete(`/accommodations/${id}`);
};


export const createEnrollment = async (data) => {
  return (await API.post("/enrollments", data)).data;
};



export const updateEnrollment = async (id, data) => {
  return (await API.put(`/enrollments/${id}`, data)).data;
};

export const getEnrollments = async () => {
  return (await API.get("/enrollments")).data;
};

export const getEnrollmentById = async (id) => {
  return (await API.get(`/enrollments/${id}`)).data;
};

export const updateEnrollmentPaymentStatus = async (id, paymentStatus) => {
  return (
    await API.put(`/enrollments/${id}/payment`, { paymentStatus })
  ).data;
};

export const deleteEnrollment = async (id) => {
  await API.delete(`/enrollments/${id}`);
};


export const createEnquiry = async (data) => {
  return (await API.post("/enquiries", data)).data;
};

export const getEnquiries = async () => {
  return (await API.get("/enquiries")).data;
};

export const getEnquiryById = async (id) => {
  return (await API.get(`/enquiries/${id}`)).data;
};


export const updateEnquiryStatus = async (id, status) => {
  // Send an object { status: "PENDING" | "IN_PROGRESS" | "RESOLVED" }
  const payload = { status };

  const response = await API.patch(`/enquiries/${id}/status`, payload);
  return response.data; // returns EnquiryResponseDTO from backend
};


export const deleteEnquiry = async (id) => {
  await API.delete(`/enquiries/${id}`);
};

