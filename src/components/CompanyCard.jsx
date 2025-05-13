// src/components/CompanyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const CompanyCard = ({ company }) => {
  // Format ratings to display stars
  const renderRating = (rating) => {
    const stars = [];
    const fullStar = Math.floor(rating);
    const hasHalfStar = rating - fullStar >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStar) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStar && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
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
          <svg key={i} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="p-4">
        <div className="flex items-center">
          <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md p-2">
            <LazyLoadImage
              src={company.logo || '/default-company-logo.png'}
              alt={company.name}
              effect="blur"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="ml-4">
            <Link to={`/companies/${company.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
              {company.name}
            </Link>
            <div className="mt-1">
              {renderRating(company.rating || 0)}
            </div>
            <div className="mt-1 flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {company.location}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {company.description}
          </p>
        </div>
      </div>
      <div className="px-4 pb-4 flex justify-end">
        <Link to={`/companies/${company.id}`} className="btn-primary text-sm">
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default React.memo(CompanyCard);