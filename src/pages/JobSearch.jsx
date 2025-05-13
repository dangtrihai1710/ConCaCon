// src/pages/JobSearch.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import JobCard from '../components/JobCard';
import { fetchJobs, fetchIndustries, fetchLocations } from '../services/api';
import Toast from '../components/Toast';

const JobSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    industry: searchParams.get('industry') || '',
    location: searchParams.get('location') || '',
    salary: searchParams.get('salary') || '',
  });
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const jobsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch filter options
        const [industriesResponse, locationsResponse] = await Promise.all([
          fetchIndustries(),
          fetchLocations()
        ]);
        
        setIndustries(industriesResponse.data);
        setLocations(locationsResponse.data);
        
        // Fetch jobs with current filters
        const params = {
          keyword: filters.keyword,
          industry: filters.industry,
          location: filters.location,
          salary: filters.salary,
          page: currentPage,
          limit: jobsPerPage,
        };
        
        const jobsResponse = await fetchJobs(params);
        setJobs(jobsResponse.data.jobs);
        setTotalJobs(jobsResponse.data.total);
      } catch (error) {
        console.error('Error loading job search data:', error);
        Toast.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentPage, filters]);

  // Update URL when filters change
  useEffect(() => {
    const params = {};
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.industry) params.industry = filters.industry;
    if (filters.location) params.location = filters.location;
    if (filters.salary) params.salary = filters.salary;
    if (currentPage > 1) params.page = currentPage;
    
    setSearchParams(params);
  }, [filters, currentPage, setSearchParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // No need to do anything here since useEffect will trigger when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const pageNumbers = [];
  
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pageNumbers.push('...');
    }
  }

  // Filter out duplicates from pageNumbers array (for the ellipsis)
  const filteredPageNumbers = pageNumbers.filter((number, index, self) => 
    self.indexOf(number) === index
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tìm kiếm việc làm</h1>
        
        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                  Từ khóa
                </label>
                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  placeholder="Chức danh, kỹ năng..."
                  className="input-field"
                />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Ngành nghề
                </label>
                <select
                  id="industry"
                  name="industry"
                  value={filters.industry}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">Tất cả ngành nghề</option>
                  {industries.map(industry => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Địa điểm
                </label>
                <select
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">Tất cả địa điểm</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                  Mức lương
                </label>
                <select
                  id="salary"
                  name="salary"
                  value={filters.salary}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">Tất cả mức lương</option>
                  <option value="0-5000000">Dưới 5 triệu</option>
                  <option value="5000000-10000000">5 - 10 triệu</option>
                  <option value="10000000-20000000">10 - 20 triệu</option>
                  <option value="20000000">Trên 20 triệu</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="btn-primary"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
        
        {/* Results */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {isLoading ? 'Đang tìm kiếm...' : `Tìm thấy ${totalJobs} việc làm phù hợp`}
          </h2>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Sắp xếp theo:</span>
            <select className="input-field text-sm py-1">
              <option value="newest">Mới nhất</option>
              <option value="relevance">Phù hợp nhất</option>
              <option value="salary-desc">Lương cao nhất</option>
              <option value="salary-asc">Lương thấp nhất</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
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
          <>
            {jobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy việc làm</h3>
                <p className="text-gray-600">
                  Không có việc làm nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử sử dụng các từ khóa khác hoặc mở rộng phạm vi tìm kiếm.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="mr-2 px-3 py-1 rounded border bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  
                  {filteredPageNumbers.map((number, index) => (
                    <button
                      key={index}
                      onClick={() => typeof number === 'number' && handlePageChange(number)}
                      className={`mx-1 px-3 py-1 rounded ${
                        number === currentPage
                          ? 'bg-blue-600 text-white'
                          : number === '...'
                          ? 'cursor-default'
                          : 'border bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                      disabled={number === '...'}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-2 px-3 py-1 rounded border bg-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tiếp
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobSearch;