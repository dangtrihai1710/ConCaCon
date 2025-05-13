import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';

// Lazy loading các trang để tối ưu hiệu năng
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const JobSearch = lazy(() => import('./pages/JobSearch'));
const JobDetail = lazy(() => import('./pages/JobDetail'));
const CVBuilder = lazy(() => import('./pages/CVBuilder'));
const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard'));
const CompanyProfile = lazy(() => import('./pages/CompanyProfile'));

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Đang tải...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobSearch />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/cv-builder" element={<CVBuilder />} />
            <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
            <Route path="/companies/:id" element={<CompanyProfile />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;