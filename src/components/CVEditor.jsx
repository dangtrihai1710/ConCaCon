// src/components/CVEditor.jsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import html2pdf from 'html2pdf.js';
import Toast from './Toast';

// CV templates
const templates = {
  simple: {
    id: 'simple',
    name: 'Đơn giản',
    className: 'font-sans bg-white',
  },
  modern: {
    id: 'modern',
    name: 'Hiện đại',
    className: 'font-sans bg-gray-100 text-gray-800 rounded-lg overflow-hidden',
  },
  professional: {
    id: 'professional',
    name: 'Chuyên nghiệp',
    className: 'font-serif bg-white border-t-4 border-blue-600',
  },
};

const CVEditor = ({ initialData, onSave }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(templates.simple);
  const [previewMode, setPreviewMode] = useState(false);
  
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: initialData || {
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
      },
      skills: [''],
      experience: [
        {
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
      education: [
        {
          school: '',
          degree: '',
          field: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit = (data) => {
    if (onSave) {
      onSave({ ...data, templateId: selectedTemplate.id });
      Toast.success('CV đã được lưu thành công!');
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('cv-preview');
    const opt = {
      margin: 1,
      filename: `cv-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save().then(() => {
      Toast.success('CV đã được tải xuống thành công!');
    });
  };

  const addSkill = () => {
    const { skills = [] } = control._formValues;
    skills.push('');
    reset({ ...control._formValues, skills });
  };

  const removeSkill = (index) => {
    const { skills = [] } = control._formValues;
    skills.splice(index, 1);
    reset({ ...control._formValues, skills });
  };

  const addExperience = () => {
    const { experience = [] } = control._formValues;
    experience.push({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    });
    reset({ ...control._formValues, experience });
  };

  const removeExperience = (index) => {
    const { experience = [] } = control._formValues;
    experience.splice(index, 1);
    reset({ ...control._formValues, experience });
  };

  const addEducation = () => {
    const { education = [] } = control._formValues;
    education.push({
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    reset({ ...control._formValues, education });
  };

  const removeEducation = (index) => {
    const { education = [] } = control._formValues;
    education.splice(index, 1);
    reset({ ...control._formValues, education });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h2 className="text-2xl font-bold text-gray-800">Tạo CV chuyên nghiệp</h2>
        <div className="mt-4 md:mt-0 flex space-x-4">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="btn-secondary"
          >
            {previewMode ? 'Quay lại chỉnh sửa' : 'Xem trước'}
          </button>
          {previewMode && (
            <button
              type="button"
              onClick={downloadPDF}
              className="btn-primary"
            >
              Tải xuống PDF
            </button>
          )}
        </div>
      </div>

      {previewMode ? (
        <div className="my-8">
          <div id="cv-preview" className={`max-w-3xl mx-auto p-8 shadow-lg ${selectedTemplate.className}`}>
            {/* Personal Info */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{control._formValues.personalInfo?.name}</h1>
              <p className="text-xl text-blue-600 mt-1">{control._formValues.personalInfo?.title}</p>
              <div className="mt-3 flex flex-wrap text-sm text-gray-600">
                {control._formValues.personalInfo?.email && (
                  <div className="mr-4 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {control._formValues.personalInfo.email}
                  </div>
                )}
                {control._formValues.personalInfo?.phone && (
                  <div className="mr-4 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {control._formValues.personalInfo.phone}
                  </div>
                )}
                {control._formValues.personalInfo?.address && (
                  <div className="mr-4 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {control._formValues.personalInfo.address}
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {control._formValues.skills?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 pb-2 border-b">Kỹ năng</h2>
                <div className="flex flex-wrap">
                  {control._formValues.skills.map((skill, index) => (
                    skill && (
                      <span key={index} className="bg-blue-100 text-blue-800 mr-2 mb-2 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {control._formValues.experience?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 pb-2 border-b">Kinh nghiệm làm việc</h2>
                {control._formValues.experience.map((exp, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company} - {exp.location}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {exp.startDate} - {exp.current ? 'Hiện tại' : exp.endDate}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {control._formValues.education?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 pb-2 border-b">Học vấn</h2>
                {control._formValues.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{edu.school}</h3>
                        <p className="text-gray-600">{edu.degree} - {edu.field}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {edu.startDate} - {edu.endDate}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{edu.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Template Selection */}
          <div className="mb-6">
            <label className="form-label">Chọn mẫu CV</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
              {Object.values(templates).map((template) => (
                <div
                  key={template.id}
                  className={`cursor-pointer border rounded-lg p-4 hover:shadow-md transition duration-300 ${
                    selectedTemplate.id === template.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="text-center">
                    <div className={`h-24 mb-2 flex items-center justify-center ${template.className}`}>
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm text-gray-500">Mẫu CV {template.name}</span>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{template.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="name">Họ và tên</label>
                <input
                  id="name"
                  type="text"
                  className={`input-field ${errors.personalInfo?.name ? 'border-red-500' : ''}`}
                  {...register('personalInfo.name', { required: 'Vui lòng nhập họ tên' })}
                />
                {errors.personalInfo?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.name.message}</p>
                )}
              </div>
              <div>
                <label className="form-label" htmlFor="title">Vị trí ứng tuyển</label>
                <input
                  id="title"
                  type="text"
                  className="input-field"
                  {...register('personalInfo.title')}
                />
              </div>
              <div>
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className={`input-field ${errors.personalInfo?.email ? 'border-red-500' : ''}`}
                  {...register('personalInfo.email', {
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ'
                    }
                  })}
                />
                {errors.personalInfo?.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.personalInfo.email.message}</p>
                )}
              </div>
              <div>
                <label className="form-label" htmlFor="phone">Số điện thoại</label>
                <input
                  id="phone"
                  type="tel"
                  className="input-field"
                  {...register('personalInfo.phone')}
                />
              </div>
              <div className="md:col-span-2">
                <label className="form-label" htmlFor="address">Địa chỉ</label>
                <input
                  id="address"
                  type="text"
                  className="input-field"
                  {...register('personalInfo.address')}
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Kỹ năng</h3>
              <button
                type="button"
                onClick={addSkill}
                className="text-blue-600 hover:text-blue-800"
              >
                + Thêm kỹ năng
              </button>
            </div>
            <div className="space-y-3">
              {control._formValues.skills?.map((_, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ví dụ: JavaScript, Quản lý dự án, ..."
                    {...register(`skills.${index}`)}
                  />
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Kinh nghiệm làm việc</h3>
              <button
                type="button"
                onClick={addExperience}
                className="text-blue-600 hover:text-blue-800"
              >
                + Thêm kinh nghiệm
              </button>
            </div>
            <div className="space-y-6">
              {control._formValues.experience?.map((_, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <h4 className="text-md font-medium">Kinh nghiệm #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="form-label">Vị trí</label>
                      <input
                        type="text"
                        className="input-field"
                        {...register(`experience.${index}.title`)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Công ty</label>
                      <input
                        type="text"
                        className="input-field"
                        {...register(`experience.${index}.company`)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Địa điểm</label>
                      <input
                        type="text"
                        className="input-field"
                        {...register(`experience.${index}.location`)}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-1/2">
                        <label className="form-label">Từ</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="MM/YYYY"
                          {...register(`experience.${index}.startDate`)}
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="form-label">Đến</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="MM/YYYY"
                          {...register(`experience.${index}.endDate`)}
                          disabled={control._formValues.experience[index]?.current}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`current-${index}`}
                          className="rounded text-blue-600 focus:ring-blue-500"
                          {...register(`experience.${index}.current`)}
                        />
                        <label htmlFor={`current-${index}`} className="ml-2 text-sm text-gray-700">
                          Tôi hiện đang làm việc tại đây
                        </label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Mô tả công việc</label>
                      <textarea
                        className="input-field min-h-[100px]"
                        {...register(`experience.${index}.description`)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Học vấn</h3>
              <button
                type="button"
                onClick={addEducation}
                className="text-blue-600 hover:text-blue-800"
              >
                + Thêm học vấn
              </button>
            </div>
            <div className="space-y-6">
              {control._formValues.education?.map((_, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <h4 className="text-md font-medium">Học vấn #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="form-label">Trường</label>
                      <input
                        type="text"
                        className="input-field"
                        {...register(`education.${index}.school`)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Bằng cấp</label>
                      <input
                        type="text"
                        className="input-field"
                        {...register(`education.${index}.degree`)}
                      />
                    </div>
                    <div>
                      <label className="form-label">Chuyên ngành</label>
                      <input
                        type="text"
                        className="input-field"
                        {...register(`education.${index}.field`)}
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-1/2">
                        <label className="form-label">Từ</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="MM/YYYY"
                          {...register(`education.${index}.startDate`)}
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="form-label">Đến</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="MM/YYYY"
                          {...register(`education.${index}.endDate`)}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Mô tả</label>
                      <textarea
                        className="input-field min-h-[100px]"
                        {...register(`education.${index}.description`)}
                      ></textarea>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end mb-8">
            <button
              type="submit"
              className="btn-primary"
            >
              Lưu CV
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default React.memo(CVEditor);