// src/components/JobCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const JobCard = ({ job }) => {
  const formatSalary = (salary) => {
    if (!salary) return 'Thỏa thuận';
    if (typeof salary === 'object' && salary.min && salary.max) {
      return `${salary.min} - ${salary.max} ${salary.currency || 'VNĐ'}`;
    }
    return `${salary} VNĐ`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return `${Math.floor(diffDays / 30)} tháng trước`;
  };

  return (
    <div className="card">
      <div className="p-4 flex">
        <div className="w-16 h-16 flex-shrink-0">
          <LazyLoadImage
            src={job.company?.logo || '/default-company-logo.png'}
            alt={job.company?.name || 'Company logo'}
            effect="blur"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="ml-4 flex-grow">
          <Link to={`/jobs/${job.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
            {job.title}
          </Link>
          <Link to={`/companies/${job.companyId}`} className="block text-gray-600 mt-1 hover:text-blue-500">
            {job.company?.name || 'Công ty ẩn danh'}
          </Link>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </span>
            <span className="inline-flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatSalary(job.salary)}
            </span>
            <span className="inline-flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(job.postedDate)}
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 flex justify-end">
        <Link to={`/jobs/${job.id}`} className="btn-primary text-sm">
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default React.memo(JobCard);