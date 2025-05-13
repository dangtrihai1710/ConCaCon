// src/store/index.js
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Store chính - quản lý state của ứng dụng
const useAppStore = create(
  devtools(
    (set) => ({
      // State ban đầu
      loading: false,
      error: null,
      
      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'app-store',
    }
  )
);

// Store quản lý người dùng
const useUserStore = create(
  devtools(
    persist(
      (set) => ({
        // State ban đầu
        user: null,
        isAuthenticated: false,
        
        // Actions
        setUser: (user) => set({ 
          user,
          isAuthenticated: !!user,
        }),
        updateUser: (userData) => set((state) => ({
          user: { ...state.user, ...userData }
        })),
        logout: () => {
          localStorage.removeItem('token');
          set({ 
            user: null,
            isAuthenticated: false,
          });
        },
      }),
      {
        name: 'user-store',
        getStorage: () => localStorage,
      }
    ),
    {
      name: 'user-store',
    }
  )
);

// Store quản lý tìm kiếm việc làm
const useJobSearchStore = create(
  devtools(
    persist(
      (set) => ({
        // State ban đầu
        filters: {
          keyword: '',
          industry: '',
          location: '',
          salary: '',
        },
        recentSearches: [],
        savedJobs: [],
        
        // Actions
        setFilters: (filters) => set({ filters }),
        updateFilter: (key, value) => set((state) => ({
          filters: { ...state.filters, [key]: value }
        })),
        clearFilters: () => set({ 
          filters: {
            keyword: '',
            industry: '',
            location: '',
            salary: '',
          } 
        }),
        addRecentSearch: (search) => set((state) => {
          // Loại bỏ tìm kiếm trùng lặp
          const existingIndex = state.recentSearches.findIndex(
            s => s.keyword === search.keyword && 
                s.industry === search.industry &&
                s.location === search.location &&
                s.salary === search.salary
          );
          
          const updatedSearches = [...state.recentSearches];
          
          if (existingIndex !== -1) {
            // Nếu đã có, xóa tìm kiếm cũ
            updatedSearches.splice(existingIndex, 1);
          }
          
          // Thêm tìm kiếm mới vào đầu danh sách
          updatedSearches.unshift({
            ...search,
            timestamp: new Date().toISOString(),
          });
          
          // Giới hạn chỉ lưu 10 tìm kiếm gần nhất
          return { 
            recentSearches: updatedSearches.slice(0, 10)
          };
        }),
        clearRecentSearches: () => set({ recentSearches: [] }),
        saveJob: (job) => set((state) => {
          // Kiểm tra xem công việc đã được lưu chưa
          if (!state.savedJobs.some(j => j.id === job.id)) {
            return { savedJobs: [...state.savedJobs, job] };
          }
          return state;
        }),
        unsaveJob: (jobId) => set((state) => ({
          savedJobs: state.savedJobs.filter(job => job.id !== jobId)
        })),
        clearSavedJobs: () => set({ savedJobs: [] }),
      }),
      {
        name: 'job-search-store',
        getStorage: () => localStorage,
      }
    ),
    {
      name: 'job-search-store',
    }
  )
);

// Store quản lý CV
const useCVStore = create(
  devtools(
    persist(
      (set) => ({
        // State ban đầu
        cvs: [],
        selectedCV: null,
        
        // Actions
        setCVs: (cvs) => set({ cvs }),
        addCV: (cv) => set((state) => ({ 
          cvs: [...state.cvs, cv]
        })),
        updateCV: (id, cvData) => set((state) => ({
          cvs: state.cvs.map(cv => 
            cv.id === id ? { ...cv, ...cvData } : cv
          )
        })),
        deleteCV: (id) => set((state) => ({
          cvs: state.cvs.filter(cv => cv.id !== id),
          selectedCV: state.selectedCV && state.selectedCV.id === id 
            ? null 
            : state.selectedCV
        })),
        selectCV: (cv) => set({ selectedCV: cv }),
        clearSelectedCV: () => set({ selectedCV: null }),
      }),
      {
        name: 'cv-store',
        getStorage: () => localStorage,
      }
    ),
    {
      name: 'cv-store',
    }
  )
);

// Store quản lý nhà tuyển dụng
const useRecruiterStore = create(
  devtools(
    persist(
      (set) => ({
        // State ban đầu
        jobs: [],
        applications: [],
        
        // Actions
        setJobs: (jobs) => set({ jobs }),
        addJob: (job) => set((state) => ({ 
          jobs: [...state.jobs, job]
        })),
        updateJob: (id, jobData) => set((state) => ({
          jobs: state.jobs.map(job => 
            job.id === id ? { ...job, ...jobData } : job
          )
        })),
        deleteJob: (id) => set((state) => ({
          jobs: state.jobs.filter(job => job.id !== id)
        })),
        setApplications: (applications) => set({ applications }),
        updateApplicationStatus: (id, status) => set((state) => ({
          applications: state.applications.map(app => 
            app.id === id ? { ...app, status } : app
          )
        })),
      }),
      {
        name: 'recruiter-store',
        getStorage: () => localStorage,
      }
    ),
    {
      name: 'recruiter-store',
    }
  )
);

export {
  useAppStore,
  useUserStore,
  useJobSearchStore,
  useCVStore,
  useRecruiterStore,
};