const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');
const CV = require('./models/CV');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/concacon', {});

// Create seed data
const createSeedData = async () => {
  try {
    console.log('Xóa dữ liệu cũ...');
    await User.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await CV.deleteMany();

    console.log('Tạo người dùng mẫu...');
    // Tạo người dùng nhà tuyển dụng
    const recruiterPassword = await bcrypt.hash('123456', 10);
    const recruiter = await User.create({
      email: 'recruiter@example.com',
      password: recruiterPassword,
      role: 'recruiter',
      profile: {
        name: 'Nguyễn Nhà Tuyển Dụng',
        avatar: '/default-avatar.png',
        phone: '0901234567',
        address: 'TP.HCM'
      }
    });

    // Tạo người dùng ứng viên
    const candidatePassword = await bcrypt.hash('123456', 10);
    const candidate = await User.create({
      email: 'candidate@example.com',
      password: candidatePassword,
      role: 'candidate',
      profile: {
        name: 'Trần Ứng Viên',
        avatar: '/default-avatar.png',
        phone: '0909876543',
        address: 'Hà Nội'
      }
    });

    console.log('Tạo công ty mẫu...');
    // Tạo công ty
    const company1 = await Company.create({
      name: 'FPT Software',
      logo: '/default-company-logo.png',
      coverImage: '/default-company-cover.jpg',
      description: 'FPT Software là công ty công nghệ hàng đầu Việt Nam, cung cấp dịch vụ phát triển phần mềm và chuyển đổi số cho khách hàng trên toàn cầu.',
      size: 'over1000',
      website: 'https://fptsoftware.com',
      industry: 'it',
      location: 'Hà Nội',
      userId: recruiter._id,
      rating: 4.5
    });

    const company2 = await Company.create({
      name: 'VNG Corporation',
      logo: '/default-company-logo.png',
      coverImage: '/default-company-cover.jpg',
      description: 'VNG là công ty công nghệ hàng đầu Việt Nam, cung cấp nền tảng giải trí, thanh toán và dịch vụ đám mây.',
      size: 'over1000',
      website: 'https://vng.com.vn',
      industry: 'it',
      location: 'TP.HCM',
      userId: recruiter._id,
      rating: 4.3
    });

    console.log('Tạo việc làm mẫu...');
    // Tạo việc làm
    await Job.create({
      title: 'Senior Web Developer',
      companyId: company1._id,
      description: '<p>Chúng tôi đang tìm kiếm một Senior Web Developer có nhiều kinh nghiệm làm việc với ReactJS, Node.js và MongoDB.</p>',
      requirements: '<p>- Ít nhất 3 năm kinh nghiệm với ReactJS và Node.js<br>- Hiểu biết sâu về MongoDB và Express<br>- Có kinh nghiệm làm việc với Git</p>',
      benefits: '<p>- Lương cạnh tranh<br>- Môi trường làm việc quốc tế<br>- Cơ hội thăng tiến</p>',
      salary: {
        min: 25000000,
        max: 40000000,
        currency: 'VNĐ'
      },
      location: 'Hà Nội',
      industry: 'it',
      level: 'senior',
      type: 'fulltime',
      user: recruiter._id
    });

    await Job.create({
      title: 'React Native Developer',
      companyId: company2._id,
      description: '<p>VNG đang tìm kiếm React Native Developer có kinh nghiệm để phát triển ứng dụng di động đa nền tảng.</p>',
      requirements: '<p>- Ít nhất 2 năm kinh nghiệm với React Native<br>- Hiểu biết về iOS và Android<br>- Có kinh nghiệm với Redux, GraphQL</p>',
      benefits: '<p>- Lương cạnh tranh<br>- Môi trường làm việc trẻ trung, năng động<br>- Chế độ đãi ngộ tốt</p>',
      salary: {
        min: 20000000,
        max: 35000000,
        currency: 'VNĐ'
      },
      location: 'TP.HCM',
      industry: 'it',
      level: 'middle',
      type: 'fulltime',
      user: recruiter._id
    });

    console.log('Tạo CV mẫu...');
    // Tạo CV
    await CV.create({
      userId: candidate._id,
      templateId: 'modern',
      content: {
        personalInfo: {
          name: 'Trần Ứng Viên',
          email: 'candidate@example.com',
          phone: '0909876543',
          address: 'Hà Nội',
          title: 'React Developer'
        },
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
        experience: [
          {
            title: 'React Developer',
            company: 'VNG Corporation',
            location: 'TP.HCM',
            startDate: '06/2020',
            endDate: '',
            current: true,
            description: 'Phát triển và bảo trì các ứng dụng web sử dụng ReactJS và Redux.'
          },
          {
            title: 'Frontend Developer',
            company: 'Tiki Corporation',
            location: 'TP.HCM',
            startDate: '01/2018',
            endDate: '05/2020',
            current: false,
            description: 'Phát triển frontend cho website thương mại điện tử sử dụng Angular.'
          }
        ],
        education: [
          {
            school: 'Đại học Công nghệ - ĐHQGHN',
            degree: 'Kỹ sư',
            field: 'Công nghệ thông tin',
            startDate: '09/2014',
            endDate: '06/2018',
            description: 'Tốt nghiệp loại Khá, chuyên ngành Kỹ thuật phần mềm.'
          }
        ]
      }
    });

    console.log('Đã tạo dữ liệu mẫu thành công!');
    process.exit();
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
};

createSeedData();