// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img className="h-8 w-auto" src="/logo.svg" alt="ConCaCon Logo" />
              <span className="ml-2 text-xl font-bold text-blue-600">ConCaCon</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/jobs" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Tìm việc làm
            </Link>
            <Link to="/cv-builder" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Tạo CV
            </Link>
            <Link to="/companies" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Công ty
            </Link>
            
            {user ? (
              <div className="relative ml-3">
                <div className="flex items-center">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <img className="h-8 w-8 rounded-full" src={user.profile?.avatar || "/default-avatar.png"} alt="" />
                  </button>
                  <span className="ml-2">{user.profile?.name || user.email}</span>
                </div>
                
                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {user.role === 'recruiter' && (
                      <Link to="/recruiter-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Quản lý tuyển dụng
                      </Link>
                    )}
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Hồ sơ cá nhân
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Đăng nhập
                </Link>
                <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/jobs" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium">
            Tìm việc làm
          </Link>
          <Link to="/cv-builder" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium">
            Tạo CV
          </Link>
          <Link to="/companies" className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium">
            Công ty
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src={user.profile?.avatar || "/default-avatar.png"} alt="" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.profile?.name || user.email}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {user.role === 'recruiter' && (
                  <Link to="/recruiter-dashboard" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                    Quản lý tuyển dụng
                  </Link>
                )}
                <Link to="/profile" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                  Hồ sơ cá nhân
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2 px-4">
              <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">
                Đăng nhập
              </Link>
              <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium text-center transition duration-300">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);