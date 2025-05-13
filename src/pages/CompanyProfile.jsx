// src/pages/CompanyProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import JobCard from '../components/JobCard';
import { fetchCompanyDetail, fetchCompanyJobs } from '../services/api';
import Toast from '../components/Toast';

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch company details and jobs
        const [companyResponse, jobsResponse] = await Promise.all([
          fetchCompanyDetail(id),
          fetchCompanyJobs(id)
        ]);
        
        setCompany(companyResponse.data);
        setJobs(jobsResponse.data);
      } catch (error) {
        console.error('Error loading company profile:', error);
        Toast.error('Không thể tải thông tin công ty. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Format ratings to display stars
  const renderRating = (rating) => {
    const stars = [];
    const fullStar = Math.floor(rating);
    const hasHalfStar = rating - fullStar >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStar) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStar && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-star" x1="0" x2="100%" y1="0" y2="0">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#half-star)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Không tìm thấy công ty</h2>
        <p className="text-gray-600 mb-6">Công ty này có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/companies" className="btn-primary">
          Xem danh sách công ty
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-700 relative">
            {company.coverImage && (
              <img 
                src={company.coverImage} 
                alt={`${company.name} cover`} 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 w-full h-full bg-black bg-opacity-20"></div>
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-end">
              <div className="bg-white p-2 rounded-lg shadow-lg mr-4">
                <LazyLoadImage
                  src={company.logo || '/default-company-logo.png'}
                  alt={company.name}
                  effect="blur"
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">{company.name}</h1>
                <div className="mt-1 text-white">
                  {renderRating(company.rating || 0)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Company Info */}
          <div className="p-6">
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{company.location}</span>
            </div>
            
            <p className="text-gray-700 mb-6">{company.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-gray-500 text-sm mb-1">Quy mô công ty</div>
                <div className="font-medium">{company.size || 'Không có thông tin'}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-gray-500 text-sm mb-1">Ngành nghề</div>
                <div className="font-medium">{company.industry || 'Không có thông tin'}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="text-gray-500 text-sm mb-1">Website</div>
                <div className="font-medium">
                  {company.website ? (
                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {company.website}
                    </a>
                  ) : (
                    'Không có thông tin'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Company Jobs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Việc làm tại {company.name}</h2>
          
          {jobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có việc làm</h3>
              <p className="text-gray-600">
                Hiện tại công ty này không có tin tuyển dụng nào. Vui lòng quay lại sau.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
        
        {/* Company Reviews */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Đánh giá từ nhân viên</h2>
            <button className="btn-primary">Viết đánh giá</button>
          </div>
          
          {company.reviews?.length > 0 ? (
            <div className="space-y-6">
              {company.reviews.map((review, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center">
                        {renderRating(review.rating)}
                        <span className="ml-2 font-semibold">{review.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {review.position} - {review.employmentStatus}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Ưu điểm</h4>
                    <p className="text-gray-600">{review.pros}</p>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Nhược điểm</h4>
                    <p className="text-gray-600">{review.cons}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Nhận xét</h4>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đánh giá</h3>
              <p className="text-gray-600 mb-4">
                Hãy là người đầu tiên đánh giá về môi trường làm việc tại {company.name}.
              </p>
              <button className="btn-primary">Viết đánh giá đầu tiên</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;