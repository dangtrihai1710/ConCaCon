// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import JobCard from '../components/JobCard';
import CompanyCard from '../components/CompanyCard';
import { useUserStore } from '../store';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { fetchJobsHighlighted, fetchTopCompanies } from '../services/api';

const Home = () => {
  const { user } = useUserStore();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [jobsResponse, companiesResponse] = await Promise.all([
          fetchJobsHighlighted(),
          fetchTopCompanies()
        ]);
        
        setFeaturedJobs(jobsResponse.data);
        setTopCompanies(companiesResponse.data);
      } catch (error) {
        console.error('Error loading home page data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl font-bold mb-4">Tìm việc làm phù hợp với bạn</h1>
              <p className="text-xl mb-8">Khám phá hàng nghìn cơ hội việc làm và xây dựng CV nổi bật để chinh phục nhà tuyển dụng</p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link to="/jobs" className="btn-primary px-8 py-3 text-center">
                  Tìm việc ngay
                </Link>
                <Link to="/cv-builder" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded transition duration-300 text-center">
                  Tạo CV miễn phí
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <img src="/hero-image.svg" alt="Job Search Illustration" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar Section */}
      <section className="bg-white py-8 shadow-md relative -mt-8 rounded-lg max-w-4xl mx-auto px-4">
        <form className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Việc làm, kỹ năng, công ty..."
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:w-1/4">
            <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tất cả ngành nghề</option>
              <option value="technology">Công nghệ thông tin</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Tài chính - Kế toán</option>
              <option value="healthcare">Y tế - Dược phẩm</option>
            </select>
          </div>
          <div className="md:w-1/4">
            <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Tất cả địa điểm</option>
              <option value="hanoi">Hà Nội</option>
              <option value="hcm">TP. Hồ Chí Minh</option>
              <option value="danang">Đà Nẵng</option>
              <option value="other">Tỉnh thành khác</option>
            </select>
          </div>
          <button type="submit" className="btn-primary py-3">
            Tìm kiếm
          </button>
        </form>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Việc làm nổi bật</h2>
            <Link to="/jobs" className="text-blue-600 hover:underline font-medium">
              Xem tất cả
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md h-32 animate-pulse">
                  <div className="p-4 flex">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    <div className="ml-4 flex-grow">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="flex flex-wrap gap-2">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Companies Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Công ty hàng đầu</h2>
            <Link to="/companies" className="text-blue-600 hover:underline font-medium">
              Xem tất cả
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md h-48 animate-pulse">
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                      <div className="ml-4">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topCompanies.map(company => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-12">Tại sao chọn ConCaCon?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">10,000+ Việc làm</h3>
              <p className="text-gray-600">Hàng nghìn cơ hội việc làm từ các công ty hàng đầu trong nhiều lĩnh vực</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">3,000+ Công ty uy tín</h3>
              <p className="text-gray-600">Kết nối với các công ty hàng đầu trong và ngoài nước</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Công cụ tạo CV chuyên nghiệp</h3>
              <p className="text-gray-600">Dễ dàng tạo CV đẹp mắt với các mẫu thiết kế hiện đại</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-12 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Bạn đã sẵn sàng cho công việc tiếp theo?</h2>
            <p className="text-xl mb-8">Đăng ký ngay để khám phá hàng nghìn cơ hội việc làm và xây dựng CV chuyên nghiệp</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded transition duration-300 text-center">
                Đăng ký miễn phí
              </Link>
              <Link to="/login" className="border-2 border-white text-white hover:bg-blue-700 font-semibold py-3 px-8 rounded transition duration-300 text-center">
                Đăng nhập
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;