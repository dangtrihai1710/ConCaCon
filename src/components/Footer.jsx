// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img className="h-8 w-auto" src="/logo-white.svg" alt="ConCaCon Logo" />
              <span className="ml-2 text-xl font-bold">ConCaCon</span>
            </Link>
            <p className="text-gray-300 text-sm">
              Nền tảng tuyển dụng và tạo CV trực tuyến hàng đầu Việt Nam
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Dành cho ứng viên</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-gray-300 hover:text-white text-sm">
                  Tìm việc làm
                </Link>
              </li>
              <li>
                <Link to="/cv-builder" className="text-gray-300 hover:text-white text-sm">
                  Tạo CV
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-gray-300 hover:text-white text-sm">
                  Danh sách công ty
                </Link>
              </li>
              <li>
                <Link to="/career-advice" className="text-gray-300 hover:text-white text-sm">
                  Cẩm nang nghề nghiệp
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Dành cho nhà tuyển dụng</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/recruitment-services" className="text-gray-300 hover:text-white text-sm">
                  Dịch vụ tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="text-gray-300 hover:text-white text-sm">
                  Đăng tin tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/resume-search" className="text-gray-300 hover:text-white text-sm">
                  Tìm kiếm CV
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="flex items-start text-sm">
                <svg className="h-5 w-5 text-gray-300 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-300">
                  123 Nguyễn Huệ, Quận 1, TP.HCM
                </span>
              </li>
              <li className="flex items-start text-sm">
                <svg className="h-5 w-5 text-gray-300 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-300">
                  (84) 123 456 789
                </span>
              </li>
              <li className="flex items-start text-sm">
                <svg className="h-5 w-5 text-gray-300 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-300">
                  contact@concacon.vn
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-300 text-center">
          <p>&copy; {new Date().getFullYear()} ConCaCon. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default React.memo(Footer);