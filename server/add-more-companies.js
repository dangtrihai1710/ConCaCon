const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/concacon', {});

// Create more companies
const addMoreCompanies = async () => {
  try {
    console.log('Tìm người dùng nhà tuyển dụng...');
    // Tìm user nhà tuyển dụng hiện có
    const recruiter = await User.findOne({ role: 'recruiter' });
    
    if (!recruiter) {
      console.log('Không tìm thấy tài khoản nhà tuyển dụng. Vui lòng chạy seed.js trước.');
      process.exit(1);
    }
    
    console.log('Thêm công ty mới...');
    
    // Thêm Công ty 1: Vingroup
    const vingroup = await Company.create({
      name: 'Vingroup',
      logo: '/default-company-logo.png',
      coverImage: '/default-company-cover.jpg',
      description: 'Vingroup là tập đoàn kinh tế hàng đầu Việt Nam, hoạt động trong nhiều lĩnh vực như công nghệ, bất động sản, bán lẻ, y tế, giáo dục và sản xuất ô tô.',
      size: 'over1000',
      website: 'https://vingroup.net',
      industry: 'technology',
      location: 'Hà Nội',
      userId: recruiter._id,
      rating: 4.6,
      reviews: []
    });
    
    // Thêm Công ty 2: Techcombank
    const techcombank = await Company.create({
      name: 'Techcombank',
      logo: '/default-company-logo.png',
      coverImage: '/default-company-cover.jpg',
      description: 'Techcombank là một trong những ngân hàng thương mại cổ phần hàng đầu tại Việt Nam, cung cấp các dịch vụ tài chính đa dạng cho cá nhân và doanh nghiệp.',
      size: 'over1000',
      website: 'https://techcombank.com.vn',
      industry: 'finance',
      location: 'TP.HCM',
      userId: recruiter._id,
      rating: 4.4,
      reviews: []
    });
    
    // Thêm Công ty 3: Grab Vietnam
    const grab = await Company.create({
      name: 'Grab Vietnam',
      logo: '/default-company-logo.png',
      coverImage: '/default-company-cover.jpg',
      description: 'Grab là công ty công nghệ hàng đầu khu vực Đông Nam Á, cung cấp dịch vụ đặt xe, giao hàng, thanh toán và nhiều dịch vụ khác dựa trên nền tảng ứng dụng di động.',
      size: 'over1000',
      website: 'https://grab.com',
      industry: 'technology',
      location: 'TP.HCM',
      userId: recruiter._id,
      rating: 4.7,
      reviews: []
    });
    
    // Thêm Công ty 4: Momo
    const momo = await Company.create({
      name: 'MoMo',
      logo: '/default-company-logo.png',
      coverImage: '/default-company-cover.jpg',
      description: 'MoMo là ví điện tử hàng đầu Việt Nam, cung cấp các dịch vụ thanh toán, chuyển tiền và nhiều tiện ích tài chính khác thông qua ứng dụng di động.',
      size: '500-1000',
      website: 'https://momo.vn',
      industry: 'fintech',
      location: 'TP.HCM',
      userId: recruiter._id,
      rating: 4.5,
      reviews: []
    });
    
    // Thêm Công ty 5: KMS Technology
    const kms = await Company.create({
      name: 'KMS Technology',
      logo: '/default-company-logo.png',
      coverImage: '/default-company-cover.jpg',
      description: 'KMS Technology là công ty phát triển phần mềm và tư vấn công nghệ, chuyên cung cấp các dịch vụ phát triển, kiểm thử và bảo trì phần mềm cho khách hàng quốc tế.',
      size: '500-1000',
      website: 'https://kms-technology.com',
      industry: 'it',
      location: 'TP.HCM',
      userId: recruiter._id,
      rating: 4.6,
      reviews: []
    });
    
    console.log('Thêm việc làm mới...');
    
    // Thêm việc làm cho Vingroup
    await Job.create({
      title: 'Data Scientist',
      companyId: vingroup._id,
      description: '<p>Vingroup đang tìm kiếm Data Scientist tài năng để tham gia xây dựng các giải pháp AI cho nhiều lĩnh vực khác nhau trong tập đoàn.</p>',
      requirements: '<p>- Tốt nghiệp Thạc sĩ trở lên trong lĩnh vực Khoa học Máy tính, Khoa học Dữ liệu, Toán học hoặc tương đương<br>- Có kinh nghiệm với Machine Learning, Deep Learning<br>- Thành thạo Python, TensorFlow, PyTorch</p>',
      benefits: '<p>- Lương và thưởng cạnh tranh<br>- Làm việc với đội ngũ chuyên gia hàng đầu<br>- Cơ hội phát triển sự nghiệp quốc tế</p>',
      salary: {
        min: 30000000,
        max: 70000000,
        currency: 'VNĐ'
      },
      location: 'Hà Nội',
      industry: 'technology',
      level: 'senior',
      type: 'fulltime',
      user: recruiter._id,
      status: 'active',
      postedDate: new Date()
    });
    
    // Thêm việc làm cho Techcombank
    await Job.create({
      title: 'Digital Banking Product Manager',
      companyId: techcombank._id,
      description: '<p>Techcombank đang tìm kiếm Product Manager để phát triển các sản phẩm ngân hàng số mới và cải tiến các sản phẩm hiện có.</p>',
      requirements: '<p>- Tối thiểu 5 năm kinh nghiệm trong lĩnh vực phát triển sản phẩm số<br>- Hiểu biết sâu sắc về ngành ngân hàng và fintech<br>- Kỹ năng phân tích và tư duy chiến lược tốt</p>',
      benefits: '<p>- Môi trường làm việc năng động<br>- Cơ hội học hỏi và phát triển<br>- Chế độ phúc lợi hấp dẫn</p>',
      salary: {
        min: 35000000,
        max: 65000000,
        currency: 'VNĐ'
      },
      location: 'TP.HCM',
      industry: 'finance',
      level: 'senior',
      type: 'fulltime',
      user: recruiter._id,
      status: 'active',
      postedDate: new Date()
    });
    
    // Thêm việc làm cho Grab
    await Job.create({
      title: 'Software Engineer - Backend',
      companyId: grab._id,
      description: '<p>Grab đang tìm kiếm Backend Engineer để phát triển và tối ưu hóa các API và dịch vụ vi mô (microservices) cho ứng dụng Grab.</p>',
      requirements: '<p>- Ít nhất 3 năm kinh nghiệm phát triển backend<br>- Thành thạo Java, Golang, hoặc Node.js<br>- Kinh nghiệm với distributed systems và microservices<br>- Hiểu biết về caching, message queues, và database scaling</p>',
      benefits: '<p>- Chế độ đãi ngộ cạnh tranh<br>- Không gian làm việc hiện đại<br>- Văn hóa công ty đổi mới và hòa nhập</p>',
      salary: {
        min: 28000000,
        max: 50000000,
        currency: 'VNĐ'
      },
      location: 'TP.HCM',
      industry: 'technology',
      level: 'middle',
      type: 'fulltime',
      user: recruiter._id,
      status: 'active',
      postedDate: new Date()
    });
    
    // Thêm việc làm cho MoMo
    await Job.create({
      title: 'Mobile Developer (iOS/Android)',
      companyId: momo._id,
      description: '<p>MoMo đang tìm kiếm Mobile Developer tài năng để phát triển và cải tiến ứng dụng thanh toán di động MoMo.</p>',
      requirements: '<p>- Tối thiểu 2 năm kinh nghiệm phát triển ứng dụng iOS hoặc Android<br>- Thành thạo Swift/Objective-C (iOS) hoặc Kotlin/Java (Android)<br>- Hiểu biết về các thư viện và framework phổ biến</p>',
      benefits: '<p>- Môi trường làm việc trẻ trung, năng động<br>- Cơ hội học hỏi và phát triển<br>- Chính sách lương thưởng hấp dẫn</p>',
      salary: {
        min: 25000000,
        max: 45000000,
        currency: 'VNĐ'
      },
      location: 'TP.HCM',
      industry: 'fintech',
      level: 'middle',
      type: 'fulltime',
      user: recruiter._id,
      status: 'active',
      postedDate: new Date()
    });
    
    // Thêm việc làm cho KMS Technology
    await Job.create({
      title: 'QA Automation Engineer',
      companyId: kms._id,
      description: '<p>KMS Technology đang tìm kiếm QA Automation Engineer để phát triển và duy trì hệ thống kiểm thử tự động cho các dự án của công ty.</p>',
      requirements: '<p>- Ít nhất 2 năm kinh nghiệm trong lĩnh vực kiểm thử phần mềm tự động<br>- Thành thạo Selenium, TestNG, JUnit, Cucumber<br>- Kỹ năng lập trình tốt với Java hoặc Python<br>- Kinh nghiệm với CI/CD tools như Jenkins</p>',
      benefits: '<p>- Môi trường làm việc quốc tế<br>- Cơ hội đào tạo và phát triển<br>- Chế độ phúc lợi hấp dẫn</p>',
      salary: {
        min: 20000000,
        max: 35000000,
        currency: 'VNĐ'
      },
      location: 'TP.HCM',
      industry: 'it',
      level: 'middle',
      type: 'fulltime',
      user: recruiter._id,
      status: 'active',
      postedDate: new Date()
    });
    
    console.log('Đã thêm dữ liệu công ty và việc làm mới thành công!');
    process.exit();
  } catch (error) {
    console.error('Lỗi:', error);
    process.exit(1);
  }
};

addMoreCompanies();