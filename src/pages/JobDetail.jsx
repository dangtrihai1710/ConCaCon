// src/pages/JobDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useUserStore } from '../store';
import { fetchJobDetail, applyForJob, fetchUserCVs } from '../services/api';
import Toast from '../components/Toast';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [userCVs, setUserCVs] = useState([]);
  const [selectedCV, setSelectedCV] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchJobDetail(id);
        setJob(response.data.job);
        setSimilarJobs(response.data.similarJobs || []);
        
        // If user is logged in and a candidate, fetch their CVs
        if (user && user.role === 'candidate') {
          try {
            const cvsResponse = await fetchUserCVs();
            setUserCVs(cvsResponse.data);
            if (cvsResponse.data.length > 0) {
              setSelectedCV(cvsResponse.data[0].id);
            }
          } catch (error) {
            console.error('Error fetching user CVs:', error);
          }
        }
      } catch (error) {
        console.error('Error loading job details:', error);
        Toast.error('Không thể tải thông tin công việc. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, user]);

  const handleApply = () => {
    if (!user) {
      Toast.info('Vui lòng đăng nhập để ứng tuyển');
      navigate('/login', { state: { returnUrl: `/jobs/${id}` } });
      return;
    }

    if (user.role !== 'candidate') {
      Toast.info('Chỉ người tìm việc mới có thể ứng tuyển');
      return;
    }

    setShowApplyModal(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (!selectedCV) {
      Toast.error('Vui lòng chọn CV để ứng tuyển');
      return;
    }

    try {
      setIsSubmitting(true);
      await applyForJob(id, { cvId: selectedCV, coverLetter });
      setShowApplyModal(false);
      Toast.success('Ứng tuyển thành công!');
    } catch (error) {
      console.error('Error applying for job:', error);
      Toast.error(error.response?.data?.message || 'Ứng tuyển thất bại. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Thỏa thuận';
    if (typeof salary === 'object' && salary.min && salary.max) {
      return `${salary.min} - ${salary.max} ${salary.currency || 'VNĐ'}`;
    }
    return `${salary} VNĐ`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="flex mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded mr-4"></div>
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Không tìm thấy công việc</h2>
        <p className="text-gray-600 mb-6">Công việc này có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/jobs" className="btn-primary">
          Quay lại trang tìm việc
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start">
            <div className="w-20 h-20 flex-shrink-0 mb-4 md:mb-0">
              <LazyLoadImage
                src={job.company?.logo || '/default-company-logo.png'}
                alt={job.company?.name || 'Company logo'}
                effect="blur"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="md:ml-6 flex-grow">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <Link to={`/companies/${job.companyId}`} className="text-lg text-blue-600 hover:underline mb-2 inline-block">
                {job.company?.name}
              </Link>
              <div className="flex flex-wrap mt-2">
                <span className="inline-flex items-center mr-4 mb-2 text-gray-600">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </span>
                <span className="inline-flex items-center mr-4 mb-2 text-gray-600">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatSalary(job.salary)}
                </span>
                <span className="inline-flex items-center mb-2 text-gray-600">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Đăng ngày {formatDate(job.postedDate)}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleApply}
                className="btn-primary w-full md:w-auto"
              >
                Ứng tuyển ngay
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Mô tả công việc</h2>
              <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: job.description }}></div>
            </div>

            {/* Job Requirements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Yêu cầu công việc</h2>
              <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: job.requirements }}></div>
            </div>

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Quyền lợi</h2>
                <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: job.benefits }}></div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin công ty</h2>
              <div className="flex items-center mb-4">
                <LazyLoadImage
                  src={job.company?.logo || '/default-company-logo.png'}
                  alt={job.company?.name || 'Company logo'}
                  effect="blur"
                  className="w-12 h-12 object-contain mr-3"
                />
                <Link to={`/companies/${job.companyId}`} className="text-blue-600 hover:underline font-medium">
                  {job.company?.name}
                </Link>
              </div>
              <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{job.company?.location || job.location}</span>
                </div>
                {job.company?.size && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{job.company.size} nhân viên</span>
                  </div>
                )}
                {job.company?.website && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {job.company.website.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Link to={`/companies/${job.companyId}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Xem thêm thông tin công ty &rarr;
                </Link>
              </div>
            </div>

            {/* Job Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Tổng quan công việc</h2>
              <div className="space-y-3 text-sm">
                {job.industry && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-gray-500">Ngành nghề</p>
                      <p className="font-medium text-gray-800">{job.industry}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-500">Loại công việc</p>
                    <p className="font-medium text-gray-800">{job.type || 'Toàn thời gian'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-gray-500">Cấp bậc</p>
                    <p className="font-medium text-gray-800">{job.level || 'Không yêu cầu'}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-500">Mức lương</p>
                    <p className="font-medium text-gray-800">{formatSalary(job.salary)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Việc làm tương tự</h2>
                <div className="space-y-4">
                  {similarJobs.map(similarJob => (
                    <div key={similarJob.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <Link to={`/jobs/${similarJob.id}`} className="text-blue-600 hover:underline font-medium">
                        {similarJob.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">{similarJob.company?.name}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <span className="inline-flex items-center mr-3">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {similarJob.location}
                        </span>
                        <span className="inline-flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatSalary(similarJob.salary)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Ứng tuyển cho vị trí {job.title}</h3>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmitApplication}>
                {userCVs.length > 0 ? (
                  <div className="mb-4">
                    <label htmlFor="cv" className="block text-sm font-medium text-gray-700 mb-1">
                      Chọn CV của bạn
                    </label>
                    <select
                      id="cv"
                      value={selectedCV}
                      onChange={(e) => setSelectedCV(e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">-- Chọn CV --</option>
                      {userCVs.map(cv => (
                        <option key={cv.id} value={cv.id}>
                          {cv.content?.personalInfo?.name || `CV #${cv.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="mb-4 p-4 bg-yellow-50 text-yellow-800 rounded-md">
                    <p className="text-sm">
                      Bạn chưa có CV nào. 
                      <Link to="/cv-builder" className="font-medium text-blue-600 hover:underline ml-1">
                        Tạo CV mới
                      </Link>
                    </p>
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                    Thư xin việc (tùy chọn)
                  </label>
                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={5}
                    className="input-field"
                    placeholder="Giới thiệu ngắn gọn về bản thân và lý do bạn phù hợp với vị trí này..."
                  />
                </div>
                
                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || userCVs.length === 0}
                    className="btn-primary"
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Gửi hồ sơ ứng tuyển'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;