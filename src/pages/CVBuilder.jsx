// src/pages/CVBuilder.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store';
import CVEditor from '../components/CVEditor';
import { fetchUserCVs, createCV, updateCV, deleteCV } from '../services/api';
import Toast from '../components/Toast';

const CVBuilder = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [userCVs, setUserCVs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cvToDelete, setCvToDelete] = useState(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      Toast.info('Vui lòng đăng nhập để sử dụng chức năng này');
      navigate('/login', { state: { returnUrl: '/cv-builder' } });
      return;
    }

    // Redirect if user is not a candidate
    if (user.role !== 'candidate') {
      Toast.info('Chỉ người tìm việc mới có thể tạo CV');
      navigate('/');
      return;
    }

    // Load user's CVs
    const loadUserCVs = async () => {
      try {
        setIsLoading(true);
        const response = await fetchUserCVs();
        setUserCVs(response.data);
      } catch (error) {
        console.error('Error loading user CVs:', error);
        Toast.error('Không thể tải danh sách CV. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserCVs();
  }, [user, navigate]);

  const handleNewCV = () => {
    setSelectedCV(null);
    setIsEditing(true);
  };

  const handleEditCV = (cv) => {
    setSelectedCV(cv);
    setIsEditing(true);
  };

  const handleDeleteCV = (cv) => {
    setCvToDelete(cv);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCV = async () => {
    try {
      await deleteCV(cvToDelete.id);
      setUserCVs(userCVs.filter(cv => cv.id !== cvToDelete.id));
      Toast.success('Xóa CV thành công!');
      setShowDeleteConfirm(false);
      setCvToDelete(null);
    } catch (error) {
      console.error('Error deleting CV:', error);
      Toast.error('Không thể xóa CV. Vui lòng thử lại sau.');
    }
  };

  const handleSaveCV = async (cvData) => {
    try {
      if (selectedCV) {
        // Update existing CV
        const response = await updateCV(selectedCV.id, cvData);
        setUserCVs(userCVs.map(cv => cv.id === selectedCV.id ? response.data : cv));
      } else {
        // Create new CV
        const response = await createCV(cvData);
        setUserCVs([...userCVs, response.data]);
      }
      
      setIsEditing(false);
      setSelectedCV(null);
      Toast.success(selectedCV ? 'Cập nhật CV thành công!' : 'Tạo CV mới thành công!');
    } catch (error) {
      console.error('Error saving CV:', error);
      Toast.error('Không thể lưu CV. Vui lòng thử lại sau.');
    }
  };

  // Function to get template name from ID
  const getTemplateName = (templateId) => {
    const templates = {
      'simple': 'Đơn giản',
      'modern': 'Hiện đại',
      'professional': 'Chuyên nghiệp'
    };
    return templates[templateId] || 'Mẫu CV';
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý CV</h1>
          {!isEditing && (
            <button
              onClick={handleNewCV}
              className="mt-4 md:mt-0 btn-primary"
            >
              + Tạo CV mới
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        ) : isEditing ? (
          <CVEditor
            initialData={selectedCV?.content}
            onSave={handleSaveCV}
          />
        ) : userCVs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCVs.map(cv => (
              <div key={cv.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center border-b">
                  <div className="w-32 h-40 bg-white shadow-md overflow-hidden mx-auto flex items-center justify-center">
                    <div className="w-full h-full p-2 text-center text-xs overflow-hidden text-gray-500">
                      {cv.content?.personalInfo?.name || 'CV mẫu'}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {cv.content?.personalInfo?.name || 'CV chưa đặt tên'}
                  </h3>
                  <div className="mt-2 flex flex-col text-sm">
                    <span className="text-gray-600">
                      Mẫu: {getTemplateName(cv.templateId)}
                    </span>
                    <span className="text-gray-600">
                      Cập nhật: {formatDate(cv.updatedAt || cv.createdDate)}
                    </span>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleEditCV(cv)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition duration-300"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => handleDeleteCV(cv)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded transition duration-300"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Bạn chưa có CV nào</h2>
            <p className="text-gray-600 mb-6">
              Tạo CV chuyên nghiệp ngay bây giờ để tăng cơ hội tìm việc của bạn.
            </p>
            <button
              onClick={handleNewCV}
              className="btn-primary"
            >
              Tạo CV đầu tiên
            </button>
          </div>
        )}

        {/* CV Templates Showcase */}
        {!isEditing && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mẫu CV chuyên nghiệp</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center border-b">
                  <img src="/cv-template-simple.jpg" alt="CV mẫu đơn giản" className="h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">Mẫu CV đơn giản</h3>
                  <p className="mt-2 text-gray-600">
                    Thiết kế sạch sẽ, dễ đọc, phù hợp với mọi ngành nghề.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCV(null);
                      setIsEditing(true);
                    }}
                    className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition duration-300"
                  >
                    Sử dụng mẫu này
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center border-b">
                  <img src="/cv-template-modern.jpg" alt="CV mẫu hiện đại" className="h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">Mẫu CV hiện đại</h3>
                  <p className="mt-2 text-gray-600">
                    Thiết kế sáng tạo, phù hợp với các ngành sáng tạo và công nghệ.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCV(null);
                      setIsEditing(true);
                    }}
                    className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition duration-300"
                  >
                    Sử dụng mẫu này
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center border-b">
                  <img src="/cv-template-professional.jpg" alt="CV mẫu chuyên nghiệp" className="h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">Mẫu CV chuyên nghiệp</h3>
                  <p className="mt-2 text-gray-600">
                    Thiết kế chuyên nghiệp, phù hợp với các vị trí cấp cao và ngành tài chính.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCV(null);
                      setIsEditing(true);
                    }}
                    className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition duration-300"
                  >
                    Sử dụng mẫu này
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* CV Tips */}
        {!isEditing && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Mẹo tạo CV hiệu quả</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Nêu bật thành tích</h3>
                  <p className="text-gray-600">
                    Thay vì chỉ liệt kê nhiệm vụ, hãy nêu rõ thành tích và kết quả cụ thể của bạn tại mỗi vị trí công việc.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Sử dụng từ khóa phù hợp</h3>
                  <p className="text-gray-600">
                    Nghiên cứu và sử dụng các từ khóa liên quan đến ngành nghề để CV của bạn dễ dàng được tìm thấy bởi nhà tuyển dụng.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Giữ CV ngắn gọn và rõ ràng</h3>
                  <p className="text-gray-600">
                    CV không nên quá 2 trang. Hãy tập trung vào những thông tin quan trọng và liên quan nhất đến vị trí ứng tuyển.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Cá nhân hóa cho từng vị trí</h3>
                  <p className="text-gray-600">
                    Điều chỉnh CV của bạn cho phù hợp với từng vị trí ứng tuyển, nhấn mạnh những kỹ năng và kinh nghiệm liên quan.
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link to="/career-advice" className="text-blue-600 hover:text-blue-800 font-medium">
                  Xem thêm mẹo tìm việc &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Xác nhận xóa CV</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa CV "{cvToDelete?.content?.personalInfo?.name || 'Không có tên'}"? Hành động này không thể hoàn tác.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmDeleteCV}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Xóa CV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVBuilder;