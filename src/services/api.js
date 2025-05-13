// src/services/api.js
import axios from 'axios';

// Cấu hình axios instance cho API calls
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Middleware để thêm token vào headers
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

// Mock API data (sử dụng khi chưa có backend thực)
const mockData = {
  users: [
    {
      id: '1',
      email: 'user@example.com',
      password: 'password123', // Trong thực tế, password không nên được lưu trực tiếp
      role: 'candidate',
      profile: {
        name: 'Nguyễn Văn A',
        avatar: '/avatars/user1.jpg',
        phone: '0901234567',
        address: 'Quận 1, TP.HCM'
      }
    },
    {
      id: '2',
      email: 'recruiter@example.com',
      password: 'password123',
      role: 'recruiter',
      profile: {
        name: 'Công ty ABC',
        avatar: '/avatars/company1.jpg',
        phone: '0909876543',
        address: 'Quận 2, TP.HCM'
      }
    }
  ],
  jobs: [
    {
      id: '1',
      title: 'Frontend Developer',
      companyId: '1',
      description: '<p>Chúng tôi đang tìm kiếm Frontend Developer có kinh nghiệm với ReactJS...</p>',
      requirements: '<ul><li>Có ít nhất 2 năm kinh nghiệm với ReactJS</li><li>Thành thạo HTML, CSS, JavaScript</li></ul>',
      benefits: '<p>Lương thưởng cạnh tranh, chế độ bảo hiểm đầy đủ...</p>',
      salary: { min: 15000000, max: 25000000, currency: 'VNĐ' },
      location: 'TP.HCM',
      industry: 'Công nghệ thông tin',
      level: 'Middle',
      type: 'Toàn thời gian',
      postedDate: '2023-05-15T00:00:00Z',
      status: 'active',
      company: {
        id: '1',
        name: 'Công ty ABC',
        logo: '/logos/company1.png',
        description: 'Công ty phát triển phần mềm hàng đầu',
        location: 'TP.HCM'
      }
    },
    {
      id: '2',
      title: 'Backend Developer',
      companyId: '1',
      description: '<p>Chúng tôi đang tìm kiếm Backend Developer có kinh nghiệm với NodeJS...</p>',
      requirements: '<ul><li>Có ít nhất 2 năm kinh nghiệm với NodeJS</li><li>Kinh nghiệm với cơ sở dữ liệu</li></ul>',
      benefits: '<p>Lương thưởng cạnh tranh, chế độ bảo hiểm đầy đủ...</p>',
      salary: { min: 18000000, max: 30000000, currency: 'VNĐ' },
      location: 'TP.HCM',
      industry: 'Công nghệ thông tin',
      level: 'Senior',
      type: 'Toàn thời gian',
      postedDate: '2023-05-10T00:00:00Z',
      status: 'active',
      company: {
        id: '1',
        name: 'Công ty ABC',
        logo: '/logos/company1.png',
        description: 'Công ty phát triển phần mềm hàng đầu',
        location: 'TP.HCM'
      }
    },
    {
      id: '3',
      title: 'Marketing Manager',
      companyId: '2',
      description: '<p>Chúng tôi đang tìm kiếm Marketing Manager có kinh nghiệm...</p>',
      requirements: '<ul><li>Có ít nhất 3 năm kinh nghiệm marketing</li><li>Thành thạo các công cụ marketing</li></ul>',
      benefits: '<p>Lương thưởng cạnh tranh, chế độ bảo hiểm đầy đủ...</p>',
      salary: { min: 20000000, max: 35000000, currency: 'VNĐ' },
      location: 'Hà Nội',
      industry: 'Marketing',
      level: 'Manager',
      type: 'Toàn thời gian',
      postedDate: '2023-05-05T00:00:00Z',
      status: 'active',
      company: {
        id: '2',
        name: 'Công ty XYZ',
        logo: '/logos/company2.png',
        description: 'Công ty marketing hàng đầu',
        location: 'Hà Nội'
      }
    }
  ],
  companies: [
    {
      id: '1',
      name: 'Công ty ABC',
      logo: '/logos/company1.png',
      coverImage: '/covers/company1.jpg',
      description: 'Công ty ABC là một trong những công ty phát triển phần mềm hàng đầu Việt Nam...',
      size: '100-500 nhân viên',
      website: 'https://abc-company.com',
      industry: 'Công nghệ thông tin',
      location: 'TP.HCM',
      rating: 4.5,
      reviews: [
        {
          id: '1',
          rating: 5,
          title: 'Môi trường làm việc tuyệt vời',
          position: 'Frontend Developer',
          employmentStatus: 'Đang làm việc',
          pros: 'Môi trường làm việc chuyên nghiệp, đồng nghiệp thân thiện',
          cons: 'Đôi khi OT',
          comment: 'Công ty có chế độ đãi ngộ tốt, cơ hội thăng tiến cao...',
          date: '2023-04-15T00:00:00Z'
        },
        {
          id: '2',
          rating: 4,
          title: 'Công ty tốt để phát triển',
          position: 'Backend Developer',
          employmentStatus: 'Đã nghỉ việc',
          pros: 'Được học hỏi nhiều, lương thưởng tốt',
          cons: 'Áp lực công việc cao',
          comment: 'Công ty có nhiều dự án thú vị, được làm việc với công nghệ mới...',
          date: '2023-03-10T00:00:00Z'
        }
      ]
    },
    {
      id: '2',
      name: 'Công ty XYZ',
      logo: '/logos/company2.png',
      coverImage: '/covers/company2.jpg',
      description: 'Công ty XYZ là công ty marketing hàng đầu với nhiều chiến dịch thành công...',
      size: '50-100 nhân viên',
      website: 'https://xyz-company.com',
      industry: 'Marketing',
      location: 'Hà Nội',
      rating: 4.2,
      reviews: [
        {
          id: '1',
          rating: 4,
          title: 'Công ty năng động',
          position: 'Marketing Specialist',
          employmentStatus: 'Đang làm việc',
          pros: 'Môi trường trẻ trung, năng động',
          cons: 'Đôi khi áp lực deadline',
          comment: 'Công ty có nhiều dự án thú vị với các thương hiệu lớn...',
          date: '2023-04-20T00:00:00Z'
        }
      ]
    }
  ],
  cvs: [
    {
      id: '1',
      userId: '1',
      templateId: 'simple',
      content: {
        personalInfo: {
          name: 'Nguyễn Văn A',
          email: 'user@example.com',
          phone: '0901234567',
          address: 'Quận 1, TP.HCM',
          title: 'Frontend Developer'
        },
        skills: ['JavaScript', 'ReactJS', 'HTML/CSS', 'Responsive Design'],
        experience: [
          {
            title: 'Frontend Developer',
            company: 'Công ty ABC',
            location: 'TP.HCM',
            startDate: '01/2020',
            endDate: '03/2022',
            current: false,
            description: 'Phát triển giao diện người dùng cho các ứng dụng web sử dụng ReactJS.'
          },
          {
            title: 'Web Developer',
            company: 'Công ty XYZ',
            location: 'TP.HCM',
            startDate: '06/2018',
            endDate: '12/2019',
            current: false,
            description: 'Phát triển các trang web responsive sử dụng HTML, CSS, JavaScript.'
          }
        ],
        education: [
          {
            school: 'Đại học Bách Khoa TP.HCM',
            degree: 'Cử nhân',
            field: 'Công nghệ thông tin',
            startDate: '09/2014',
            endDate: '06/2018',
            description: 'Tốt nghiệp loại giỏi, chuyên ngành Kỹ thuật phần mềm'
          }
        ]
      },
      createdDate: '2023-04-01T00:00:00Z',
      updatedAt: '2023-04-10T00:00:00Z'
    }
  ],
  applications: [
    {
      id: '1',
      userId: '1',
      jobId: '1',
      cvId: '1',
      coverLetter: 'Tôi rất quan tâm đến vị trí Frontend Developer tại công ty của bạn...',
      status: 'pending',
      appliedDate: '2023-05-15T00:00:00Z',
      candidate: {
        id: '1',
        name: 'Nguyễn Văn A',
        email: 'user@example.com',
        avatar: '/avatars/user1.jpg'
      },
      job: {
        id: '1',
        title: 'Frontend Developer',
        companyId: '1',
        company: {
          name: 'Công ty ABC',
          logo: '/logos/company1.png'
        }
      }
    }
  ],
  industries: [
    { id: 'it', name: 'Công nghệ thông tin' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'finance', name: 'Tài chính - Ngân hàng' },
    { id: 'education', name: 'Giáo dục - Đào tạo' },
    { id: 'retail', name: 'Bán lẻ' }
  ],
  locations: [
    { id: 'hcm', name: 'TP. Hồ Chí Minh' },
    { id: 'hanoi', name: 'Hà Nội' },
    { id: 'danang', name: 'Đà Nẵng' },
    { id: 'cantho', name: 'Cần Thơ' },
    { id: 'other', name: 'Tỉnh thành khác' }
  ]
};

// Hàm hỗ trợ để delay response (giả lập API call)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Authentication APIs
export const login = async (data) => {
  // Giả lập API call
  await delay(1000);
  
  // Tìm user trong mock data
  const user = mockData.users.find(u => u.email === data.email);
  if (!user || user.password !== data.password) {
    throw { response: { data: { message: 'Email hoặc mật khẩu không đúng' } } };
  }
  
  // Loại bỏ password trước khi trả về
  const { password, ...userWithoutPassword } = user;
  
  return {
    data: {
      user: userWithoutPassword,
      token: 'mock-jwt-token'
    }
  };
};

export const register = async (data) => {
  // Giả lập API call
  await delay(1000);
  
  // Check nếu email đã tồn tại
  if (mockData.users.some(u => u.email === data.email)) {
    throw { response: { data: { message: 'Email đã được sử dụng' } } };
  }
  
  // Tạo user mới
  const newUser = {
    id: `${mockData.users.length + 1}`,
    email: data.email,
    password: data.password,  // Trong thực tế, password sẽ được hash
    role: data.role,
    profile: {
      name: '',
      avatar: '/avatars/default.jpg',
      phone: '',
      address: ''
    }
  };
  
  // Thêm user vào danh sách
  mockData.users.push(newUser);
  
  // Loại bỏ password trước khi trả về
  const { password, ...userWithoutPassword } = newUser;
  
  return {
    data: {
      user: userWithoutPassword,
      token: 'mock-jwt-token'
    }
  };
};

// Job APIs
export const fetchJobs = async (params) => {
  // Giả lập API call
  await delay(1000);
  
  // Filter theo các tiêu chí
  let filteredJobs = [...mockData.jobs];
  
  if (params) {
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(keyword) || 
        job.description.toLowerCase().includes(keyword) ||
        job.company.name.toLowerCase().includes(keyword)
      );
    }
    
    if (params.industry) {
      filteredJobs = filteredJobs.filter(job => job.industry === params.industry);
    }
    
    if (params.location) {
      filteredJobs = filteredJobs.filter(job => job.location === params.location);
    }
    
    if (params.salary) {
      const [min, max] = params.salary.split('-').map(Number);
      filteredJobs = filteredJobs.filter(job => {
        if (job.salary && typeof job.salary === 'object') {
          return (
            (!min || job.salary.max >= min) &&
            (!max || job.salary.min <= max)
          );
        }
        return true;
      });
    }
  }
  
  // Pagination
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
  
  return {
    data: {
      jobs: paginatedJobs,
      total: filteredJobs.length
    }
  };
};

export const fetchJobsHighlighted = async () => {
  // Giả lập API call
  await delay(1000);
  
  // Return 4 việc làm nổi bật
  return {
    data: mockData.jobs.slice(0, 4)
  };
};

export const fetchJobDetail = async (id) => {
  // Giả lập API call
  await delay(1000);
  
  // Tìm job theo id
  const job = mockData.jobs.find(j => j.id === id);
  if (!job) {
    throw { response: { data: { message: 'Không tìm thấy công việc' } } };
  }
  
  // Tìm các việc làm tương tự
  const similarJobs = mockData.jobs
    .filter(j => j.id !== id && (j.industry === job.industry || j.companyId === job.companyId))
    .slice(0, 3);
  
  return {
    data: {
      job,
      similarJobs
    }
  };
};

export const applyForJob = async (jobId, data) => {
  // Giả lập API call
  await delay(1000);
  
  // Check if job exists
  const job = mockData.jobs.find(j => j.id === jobId);
  if (!job) {
    throw { response: { data: { message: 'Không tìm thấy công việc' } } };
  }
  
  // Lấy user hiện tại (giả lập)
  const user = mockData.users.find(u => u.role === 'candidate');
  
  // Check if CV exists
  const cv = mockData.cvs.find(c => c.id === data.cvId);
  if (!cv) {
    throw { response: { data: { message: 'Không tìm thấy CV' } } };
  }
  
  // Tạo đơn ứng tuyển mới
  const newApplication = {
    id: `${mockData.applications.length + 1}`,
    userId: user.id,
    jobId,
    cvId: data.cvId,
    coverLetter: data.coverLetter || '',
    status: 'pending',
    appliedDate: new Date().toISOString(),
    candidate: {
      id: user.id,
      name: user.profile.name || user.email,
      email: user.email,
      avatar: user.profile.avatar
    },
    job: {
      id: job.id,
      title: job.title,
      companyId: job.companyId,
      company: {
        name: job.company.name,
        logo: job.company.logo
      }
    }
  };
  
  // Thêm đơn ứng tuyển vào danh sách
  mockData.applications.push(newApplication);
  
  return {
    data: newApplication
  };
};

// Company APIs
export const fetchTopCompanies = async () => {
  // Giả lập API call
  await delay(1000);
  
  // Return top 3 công ty
  return {
    data: mockData.companies.slice(0, 3)
  };
};

export const fetchCompanyDetail = async (id) => {
  // Giả lập API call
  await delay(1000);
  
  // Tìm công ty theo id
  const company = mockData.companies.find(c => c.id === id);
  if (!company) {
    throw { response: { data: { message: 'Không tìm thấy công ty' } } };
  }
  
  return {
    data: company
  };
};

export const fetchCompanyJobs = async (companyId) => {
  // Giả lập API call
  await delay(1000);
  
  // Tìm các việc làm của công ty
  const jobs = mockData.jobs.filter(j => j.companyId === companyId);
  
  return {
    data: jobs
  };
};

// CV APIs
export const fetchUserCVs = async () => {
  // Giả lập API call
  await delay(1000);
  
  // Lấy user hiện tại (giả lập)
  const user = mockData.users.find(u => u.role === 'candidate');
  
  // Tìm các CV của user
  const cvs = mockData.cvs.filter(c => c.userId === user.id);
  
  return {
    data: cvs
  };
};

export const createCV = async (data) => {
  // Giả lập API call
  await delay(1000);
  
  // Lấy user hiện tại (giả lập)
  const user = mockData.users.find(u => u.role === 'candidate');
  
  // Tạo CV mới
  const newCV = {
    id: `${mockData.cvs.length + 1}`,
    userId: user.id,
    templateId: data.templateId || 'simple',
    content: data,
    createdDate: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Thêm CV vào danh sách
  mockData.cvs.push(newCV);
  
  return {
    data: newCV
  };
};

export const updateCV = async (id, data) => {
  // Giả lập API call
  await delay(1000);
  
  // Tìm CV theo id
  const cvIndex = mockData.cvs.findIndex(c => c.id === id);
  if (cvIndex === -1) {
    throw { response: { data: { message: 'Không tìm thấy CV' } } };
  }
  
  // Cập nhật CV
  const updatedCV = {
    ...mockData.cvs[cvIndex],
    templateId: data.templateId || mockData.cvs[cvIndex].templateId,
    content: data,
    updatedAt: new Date().toISOString()
  };
  
  // Cập nhật trong danh sách
  mockData.cvs[cvIndex] = updatedCV;
  
  return {
    data: updatedCV
  };
};

export const deleteCV = async (id) => {
  // Giả lập API call
  await delay(1000);
  
  // Tìm CV theo id
  const cvIndex = mockData.cvs.findIndex(c => c.id === id);
  if (cvIndex === -1) {
    throw { response: { data: { message: 'Không tìm thấy CV' } } };
  }
  
  // Xóa CV khỏi danh sách
  mockData.cvs.splice(cvIndex, 1);
  
  return {
    data: { message: 'Xóa CV thành công' }
  };
};

// Recruiter APIs
export const fetchRecruiterJobs = async () => {
  // Giả lập API call
  await delay(1000);
  
  // Lấy user hiện tại (giả lập)
  const user = mockData.users.find(u => u.role === 'recruiter');
  
  // Lấy các việc làm của công ty
  const companyId = user.id; // Giả sử id user recruiter trùng với id công ty
  const jobs = mockData.jobs.filter(j => j.companyId === companyId);
  
  // Thêm số lượng ứng tuyển cho mỗi công việc
  const jobsWithStats = jobs.map(job => {
    const applicationsCount = mockData.applications.filter(a => a.jobId === job.id).length;
    return { ...job, applicationsCount };
  });
  
  return {
    data: jobsWithStats
  };
};

export const fetchRecruiterApplications = async () => {
  // Giả lập API call
  await delay(1000);
  
  // Lấy user hiện tại (giả lập)
  const user = mockData.users.find(u => u.role === 'recruiter');
  
  // Lấy danh sách công việc của công ty
  const companyId = user.id; // Giả sử id user recruiter trùng với id công ty
  const jobIds = mockData.jobs.filter(j => j.companyId === companyId).map(j => j.id);
  
  // Lấy các đơn ứng tuyển cho các việc làm đó
  const applications = mockData.applications.filter(a => jobIds.includes(a.jobId));
  
  return {
    data: applications
  };
};

export const deleteJob = async (id) => {
  // Giả lập API call
  await delay(1000);
  
  // Tìm job theo id
  const jobIndex = mockData.jobs.findIndex(j => j.id === id);
  if (jobIndex === -1) {
    throw { response: { data: { message: 'Không tìm thấy công việc' } } };
  }
  
  // Xóa job khỏi danh sách
  mockData.jobs.splice(jobIndex, 1);
  
  // Xóa các đơn ứng tuyển liên quan
  const applicationIndices = mockData.applications
    .map((a, index) => a.jobId === id ? index : -1)
    .filter(index => index !== -1)
    .sort((a, b) => b - a); // Sort để xóa từ cuối lên để không ảnh hưởng index
  
  applicationIndices.forEach(index => {
    mockData.applications.splice(index, 1);
  });
  
  return {
    data: { message: 'Xóa tin tuyển dụng thành công' }
  };
};

// Filter APIs
export const fetchIndustries = async () => {
  // Giả lập API call
  await delay(500);
  
  return {
    data: mockData.industries
  };
};

export const fetchLocations = async () => {
  // Giả lập API call
  await delay(500);
  
  return {
    data: mockData.locations
  };
};

export default api;