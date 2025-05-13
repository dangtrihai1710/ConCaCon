// src/services/api.js
import axios from 'axios';

// Tạo instance axios với baseURL là API server
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để đính kèm token xác thực vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication APIs
export const login = async (data) => {
  try {
    const response = await api.post('/users/login', data);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const register = async (data) => {
  try {
    const response = await api.post('/users/register', data);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

// User APIs
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const updateUserProfile = async (data) => {
  try {
    const response = await api.put('/users/profile', data);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const updateAvatar = async (avatarUrl) => {
  try {
    const response = await api.put('/users/avatar', { avatar: avatarUrl });
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const changePassword = async (data) => {
  try {
    const response = await api.put('/users/password', data);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

// Job APIs
export const fetchJobs = async (filters = {}) => {
  try {
    const response = await api.get('/jobs', { params: filters });
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchJobsHighlighted = async () => {
  try {
    const response = await api.get('/jobs/highlighted');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchJobDetail = async (id) => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const createJob = async (jobData) => {
  try {
    const response = await api.post('/jobs', jobData);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const updateJob = async (id, jobData) => {
  try {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const deleteJob = async (id) => {
  try {
    const response = await api.delete(`/jobs/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchRecruiterJobs = async () => {
  try {
    const response = await api.get('/jobs/recruiter/myjobs');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchCompanyJobs = async (companyId) => {
  try {
    const response = await api.get(`/jobs/company/${companyId}`);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

// CV APIs
export const fetchUserCVs = async () => {
  try {
    const response = await api.get('/cvs');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchCVDetail = async (id) => {
  try {
    const response = await api.get(`/cvs/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const createCV = async (cvData) => {
  try {
    const response = await api.post('/cvs', cvData);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const updateCV = async (id, cvData) => {
  try {
    const response = await api.put(`/cvs/${id}`, cvData);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const deleteCV = async (id) => {
  try {
    const response = await api.delete(`/cvs/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

// Company APIs
export const fetchCompanies = async (filters = {}) => {
  try {
    const response = await api.get('/companies', { params: filters });
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchTopCompanies = async () => {
  try {
    const response = await api.get('/companies/top');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchCompanyDetail = async (id) => {
  try {
    const response = await api.get(`/companies/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const createCompany = async (companyData) => {
  try {
    const response = await api.post('/companies', companyData);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const updateCompany = async (id, companyData) => {
  try {
    const response = await api.put(`/companies/${id}`, companyData);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const reviewCompany = async (id, reviewData) => {
  try {
    const response = await api.post(`/companies/${id}/reviews`, reviewData);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchRecruiterCompanies = async () => {
  try {
    const response = await api.get('/companies/recruiter/mycompanies');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

// Application APIs
export const fetchApplications = async () => {
  try {
    const response = await api.get('/applications');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchApplicationDetail = async (id) => {
  try {
    const response = await api.get(`/applications/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const applyForJob = async (jobId, applicationData) => {
  try {
    const response = await api.post('/applications', {
      jobId,
      ...applicationData
    });
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const updateApplicationStatus = async (id, statusData) => {
  try {
    const response = await api.put(`/applications/${id}`, statusData);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const cancelApplication = async (id) => {
  try {
    const response = await api.delete(`/applications/${id}`);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchJobApplications = async (jobId) => {
  try {
    const response = await api.get(`/applications/job/${jobId}`);
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

// Utils APIs
export const fetchIndustries = async () => {
  try {
    const response = await api.get('/utils/industries');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchLocations = async () => {
  try {
    const response = await api.get('/utils/locations');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchCompanySizes = async () => {
  try {
    const response = await api.get('/utils/company-sizes');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchJobLevels = async () => {
  try {
    const response = await api.get('/utils/job-levels');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export const fetchJobTypes = async () => {
  try {
    const response = await api.get('/utils/job-types');
    return response;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra, vui lòng thử lại sau.' };
  }
};

export default api;