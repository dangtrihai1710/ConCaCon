// src/pages/RecruiterDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import { fetchRecruiterJobs, fetchRecruiterApplications, deleteJob } from '../services/api';
import Toast from '../components/Toast';

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      Toast.info('Vui lòng đăng nhập để sử dụng chức năng này');
      navigate('/login', { state: { returnUrl: '/recruiter-dashboard' } });
      return;
    }

    // Redirect if user is not a recruiter
    if (user.role !== 'recruiter') {
      Toast.info('Chỉ nhà tuyển dụng mới có thể truy cập trang này');
      navigate('/');
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (activeTab === 'jobs') {
          const response = await fetchRecruiterJobs();
          setJobs(response.data);
        } else if (activeTab === 'applications') {
          const response = await fetchRecruiterApplications();
          setApplications(response.data);
        }
      } catch (error) {
        console.error(`Error loading ${activeTab}:`, error);
        Toast.error(`Không thể tải dữ liệu. Vui lòng thử lại sau.`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [activeTab, user, navigate]);

  const handleDeleteJob = (job) => {
    setJobToDelete(job);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteJob = async () => {
    try {
      await deleteJob(jobToDelete.id);
      setJobs(jobs.filter(job => job.id !== jobToDelete.id));
      Toast.success('Xóa tin tuyển dụng thành công!');
      setShowDeleteConfirm(false);
      setJobToDelete(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      Toast.error('Không thể xóa tin tuyển dụng. Vui lòng thử lại sau.');
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Thỏa thuận';
    if (typeof salary === 'object' && salary.min && salary.max) {
      return `${salary.min} - ${salary.max} ${salary.currency || 'VNĐ'}`;
    }
    return `${salary} VNĐ`;
  };

  const getApplicationStatusLabel = (status) => {
    const statusMap = {
      'pending': { text: 'Chờ xem xét', class: 'bg-yellow-100 text-yellow-800' },
      'reviewing': { text: 'Đang xem xét', class: 'bg-blue-100 text-blue-800' },
      'interviewed': { text: 'Đã phỏng vấn', class: 'bg-purple-100 text-purple-800' },
      'accepted': { text: 'Đã chấp nhận', class: 'bg-green-100 text-green-800' },
      'rejected': { text: 'Đã từ chối', class: 'bg-red-100 text-red-800' }
    };
    
    return statusMap[status] || { text: 'Không xác định', class: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý tuyển dụng</h1>
          {activeTab === 'jobs' && (
            <Link to="/post-job" className="mt-4 md:mt-0 btn-primary">
              + Đăng tin tuyển dụng
            </Link>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'jobs'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('jobs')}
            >
              Tin tuyển dụng
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'applications'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('applications')}
            >
              Hồ sơ ứng tuyển
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              {[...Array(3)].map((_, index) => (
                <div key={index} className="mb-6">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'jobs' ? (
          // Jobs Tab Content
          <>
            {jobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Chưa có tin tuyển dụng nào</h2>
                <p className="text-gray-600 mb-6">
                  Bạn chưa đăng tin tuyển dụng nào. Hãy đăng tin đầu tiên để tìm kiếm ứng viên phù hợp.
                </p>
                <Link to="/post-job" className="btn-primary">
                  Đăng tin tuyển dụng
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tiêu đề
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Địa điểm
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày đăng
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lượt ứng tuyển
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          <div className="text-sm text-gray-500">{formatSalary(job.salary)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{job.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(job.postedDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{job.applicationsCount || 0}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            job.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {job.status === 'active' ? 'Đang hiển thị' : 'Bản nháp'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/jobs/${job.id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                            Xem
                          </Link>
                          <Link to={`/edit-job/${job.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                            Sửa
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(job)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          // Applications Tab Content
          <>
            {applications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Chưa có hồ sơ ứng tuyển nào</h2>
                <p className="text-gray-600 mb-6">
                  Hiện chưa có ứng viên nào ứng tuyển vào tin tuyển dụng của bạn.
                </p>
                <Link to="/jobs" className="btn-primary">
                  Xem việc làm đã đăng
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ứng viên
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vị trí ứng tuyển
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày ứng tuyển
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => {
                      const statusLabel = getApplicationStatusLabel(application.status);
                      
                      return (
                        <tr key={application.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={application.candidate.avatar || '/default-avatar.png'}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {application.candidate.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {application.candidate.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{application.job.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatDate(application.appliedDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusLabel.class}`}>
                              {statusLabel.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link to={`/applications/${application.id}`} className="text-blue-600 hover:text-blue-900">
                              Xem chi tiết
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Xác nhận xóa tin tuyển dụng</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa tin tuyển dụng "{jobToDelete?.title}"? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmDeleteJob}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Xóa tin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;