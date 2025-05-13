# Hướng dẫn cài đặt và sử dụng Backend cho dự án ConCaCon

## Giới thiệu

Backend cho ConCaCon được xây dựng trên Node.js, Express và MongoDB, cung cấp API RESTful cho nền tảng tuyển dụng và tạo CV trực tuyến. Backend này hỗ trợ đầy đủ chức năng quản lý người dùng, đăng tin tuyển dụng, tạo CV, ứng tuyển, và quản lý công ty.

## Các tính năng chính

1. **Quản lý người dùng**: Đăng ký, đăng nhập, cập nhật thông tin cá nhân
2. **Quản lý việc làm**: Đăng tin, tìm kiếm, lọc, cập nhật, xóa tin tuyển dụng
3. **Quản lý CV**: Tạo, cập nhật, xóa CV
4. **Quản lý công ty**: Tạo, cập nhật thông tin công ty, đánh giá công ty
5. **Quản lý đơn ứng tuyển**: Ứng tuyển, cập nhật trạng thái, xem danh sách

## Yêu cầu hệ thống

- Node.js (>= 14.x)
- MongoDB (>= 4.x)
- npm hoặc yarn

## Cài đặt

1. Clone mã nguồn về máy:
```bash
git clone <repository-url>
cd concacon/server
```

2. Cài đặt các dependencies:
```bash
npm install
# hoặc
yarn install
```

3. Tạo file .env dựa trên file .env.example:
```bash
cp .env.example .env
```

4. Chỉnh sửa file .env với thông tin cấu hình của bạn:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/concacon
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CORS_ORIGIN=http://localhost:3000
```

5. Khởi động MongoDB:
```bash
# Nếu sử dụng MongoDB local
mongod
```

6. Khởi động server:
```bash
npm run dev
# hoặc
yarn dev
```

Server sẽ chạy trên cổng được cấu hình trong .env (mặc định là 5000).

## Cấu trúc thư mục

```
server/
├── config/         # Cấu hình
│   └── db.js       # Kết nối MongoDB
├── middleware/     # Middleware
│   └── auth.js     # Xác thực JWT
├── models/         # Mô hình dữ liệu
│   ├── User.js
│   ├── Job.js
│   ├── CV.js
│   ├── Company.js
│   └── Application.js
├── routes/         # Định tuyến API
│   ├── users.js
│   ├── jobs.js
│   ├── cvs.js
│   ├── companies.js
│   ├── applications.js
│   └── utils.js
├── .env            # Biến môi trường
├── .env.example    # Mẫu biến môi trường
├── package.json    # Thông tin và dependencies
└── server.js       # Entry point
```

## API Endpoints

### Users

- `POST /api/users/register`: Đăng ký người dùng mới
- `POST /api/users/login`: Đăng nhập
- `GET /api/users/profile`: Lấy thông tin profile của người dùng
- `PUT /api/users/profile`: Cập nhật thông tin profile
- `PUT /api/users/avatar`: Cập nhật avatar
- `PUT /api/users/password`: Đổi mật khẩu

### Jobs

- `GET /api/jobs`: Lấy danh sách việc làm (có hỗ trợ lọc và tìm kiếm)
- `GET /api/jobs/highlighted`: Lấy danh sách việc làm nổi bật
- `GET /api/jobs/:id`: Lấy chi tiết việc làm
- `POST /api/jobs`: Tạo việc làm mới (cho nhà tuyển dụng)
- `PUT /api/jobs/:id`: Cập nhật việc làm (cho nhà tuyển dụng)
- `DELETE /api/jobs/:id`: Xóa việc làm (cho nhà tuyển dụng)
- `GET /api/jobs/recruiter/myjobs`: Lấy danh sách việc làm của nhà tuyển dụng
- `GET /api/jobs/company/:companyId`: Lấy danh sách việc làm của công ty

### CVs

- `GET /api/cvs`: Lấy danh sách CV của người dùng
- `GET /api/cvs/:id`: Lấy chi tiết CV
- `POST /api/cvs`: Tạo CV mới
- `PUT /api/cvs/:id`: Cập nhật CV
- `DELETE /api/cvs/:id`: Xóa CV

### Companies

- `GET /api/companies`: Lấy danh sách công ty (có hỗ trợ lọc và tìm kiếm)
- `GET /api/companies/top`: Lấy danh sách công ty hàng đầu
- `GET /api/companies/:id`: Lấy chi tiết công ty
- `POST /api/companies`: Tạo công ty mới (cho nhà tuyển dụng)
- `PUT /api/companies/:id`: Cập nhật thông tin công ty (cho nhà tuyển dụng)
- `POST /api/companies/:id/reviews`: Thêm đánh giá công ty
- `GET /api/companies/recruiter/mycompanies`: Lấy danh sách công ty của nhà tuyển dụng

### Applications

- `GET /api/applications`: Lấy danh sách đơn ứng tuyển (của ứng viên hoặc nhà tuyển dụng)
- `GET /api/applications/:id`: Lấy chi tiết đơn ứng tuyển
- `POST /api/applications`: Ứng tuyển công việc (cho ứng viên)
- `PUT /api/applications/:id`: Cập nhật trạng thái đơn ứng tuyển (cho nhà tuyển dụng)
- `DELETE /api/applications/:id`: Hủy đơn ứng tuyển (cho ứng viên)
- `GET /api/applications/job/:jobId`: Lấy danh sách đơn ứng tuyển cho một công việc (cho nhà tuyển dụng)

### Utils

- `GET /api/utils/industries`: Lấy danh sách ngành nghề
- `GET /api/utils/locations`: Lấy danh sách địa điểm
- `GET /api/utils/company-sizes`: Lấy danh sách quy mô công ty
- `GET /api/utils/job-levels`: Lấy danh sách cấp bậc công việc
- `GET /api/utils/job-types`: Lấy danh sách loại hình công việc

## Xác thực và Phân quyền

Backend sử dụng JWT (JSON Web Token) để xác thực người dùng. Khi đăng nhập, hệ thống trả về một token mà frontend cần lưu trữ (thường là trong localStorage) và gửi kèm trong header của các request yêu cầu xác thực.

```javascript
// Ví dụ cách gửi request có xác thực từ frontend
const response = await fetch('/api/users/profile', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

Hệ thống phân quyền dựa trên vai trò người dùng:
- `candidate`: Ứng viên (tạo CV, ứng tuyển việc làm, v.v.)
- `recruiter`: Nhà tuyển dụng (đăng tin tuyển dụng, quản lý đơn ứng tuyển, v.v.)

## Mô hình dữ liệu

### User
```javascript
{
  email: String,          // Email (unique)
  password: String,       // Mật khẩu (đã hash)
  role: String,           // Vai trò (candidate/recruiter)
  profile: {
    name: String,         // Họ tên
    avatar: String,       // URL avatar
    phone: String,        // Số điện thoại
    address: String       // Địa chỉ
  },
  createdAt: Date         // Ngày tạo
}
```

### Job
```javascript
{
  title: String,          // Tiêu đề công việc
  companyId: ObjectId,    // ID của công ty
  description: String,    // Mô tả công việc
  requirements: String,   // Yêu cầu công việc
  benefits: String,       // Quyền lợi
  salary: {
    min: Number,          // Lương tối thiểu
    max: Number,          // Lương tối đa
    currency: String      // Đơn vị tiền tệ
  },
  location: String,       // Địa điểm làm việc
  industry: String,       // Ngành nghề
  level: String,          // Cấp bậc
  type: String,           // Loại hình công việc
  postedDate: Date,       // Ngày đăng
  status: String,         // Trạng thái (active/draft/closed)
  user: ObjectId          // ID của nhà tuyển dụng
}
```

### CV
```javascript
{
  userId: ObjectId,       // ID của ứng viên
  templateId: String,     // ID mẫu CV (simple/modern/professional)
  content: {
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      address: String,
      title: String
    },
    skills: [String],
    experience: [{
      title: String,
      company: String,
      location: String,
      startDate: String,
      endDate: String,
      current: Boolean,
      description: String
    }],
    education: [{
      school: String,
      degree: String,
      field: String,
      startDate: String,
      endDate: String,
      description: String
    }]
  },
  createdDate: Date,      // Ngày tạo
  updatedAt: Date         // Ngày cập nhật
}
```

### Company
```javascript
{
  name: String,           // Tên công ty
  logo: String,           // URL logo
  coverImage: String,     // URL ảnh bìa
  description: String,    // Mô tả
  size: String,           // Quy mô
  website: String,        // Website
  industry: String,       // Ngành nghề
  location: String,       // Địa điểm
  userId: ObjectId,       // ID của nhà tuyển dụng
  reviews: [{
    userId: ObjectId,     // ID người đánh giá
    rating: Number,       // Đánh giá (1-5)
    title: String,        // Tiêu đề đánh giá
    position: String,     // Vị trí công việc
    employmentStatus: String, // Trạng thái làm việc
    pros: String,         // Ưu điểm
    cons: String,         // Nhược điểm
    comment: String,      // Nhận xét
    date: Date            // Ngày đánh giá
  }],
  rating: Number,         // Đánh giá trung bình
  createdAt: Date         // Ngày tạo
}
```

### Application
```javascript
{
  userId: ObjectId,       // ID của ứng viên
  jobId: ObjectId,        // ID của công việc
  cvId: ObjectId,         // ID của CV
  coverLetter: String,    // Thư ngỏ
  status: String,         // Trạng thái (pending/reviewing/interviewed/accepted/rejected)
  appliedDate: Date,      // Ngày ứng tuyển
  updatedAt: Date,        // Ngày cập nhật
  notes: String           // Ghi chú (của nhà tuyển dụng)
}
```

## Kết nối Frontend với Backend

Để kết nối frontend React với backend:

1. Cập nhật baseURL trong services/api.js:

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL của backend
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Export các hàm gọi API tại đây
```

2. Chuyển từ mock API sang real API bằng cách sửa các hàm gọi API:

```javascript
// Ví dụ: Hàm login
export const login = async (data) => {
  try {
    const response = await api.post('/users/login', data);
    return response;
  } catch (error) {
    throw error.response.data;
  }
};
```

## Mở rộng ứng dụng

Dưới đây là một số gợi ý để mở rộng chức năng của backend:

1. **Thêm tính năng tìm kiếm nâng cao**: Sử dụng MongoDB Text Search hoặc tích hợp Elasticsearch
2. **Tích hợp thanh toán**: Thêm gói dịch vụ cho nhà tuyển dụng (Stripe, PayPal)
3. **Chức năng thông báo**: Email, push notification khi có ứng tuyển mới hoặc cập nhật trạng thái
4. **Tích hợp upload file**: Cloudinary hoặc AWS S3 cho upload ảnh và file
5. **Phân tích dữ liệu**: Thống kê, báo cáo về tình trạng tuyển dụng, xu hướng thị trường

## Triển khai (Deployment)

Để triển khai backend lên môi trường production:

1. **Cấu hình .env cho production**:
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/concacon
JWT_SECRET=strong_random_secret
JWT_EXPIRE=30d
CORS_ORIGIN=https://your-frontend-domain.com
```

2. **Triển khai lên các dịch vụ hosting**:
   - Heroku
   - Digital Ocean
   - AWS EC2
   - MongoDB Atlas (cho database)

3. **Thiết lập Continuous Integration/Continuous Deployment (CI/CD)**:
   - GitHub Actions
   - GitLab CI/CD
   - Jenkins

## Khắc phục sự cố

### Vấn đề kết nối MongoDB
- Kiểm tra chuỗi kết nối MongoDB trong .env
- Đảm bảo MongoDB đang chạy (nếu sử dụng cục bộ)
- Kiểm tra quyền truy cập và whitelist IP (nếu sử dụng MongoDB Atlas)

### Lỗi xác thực
- Đảm bảo JWT_SECRET nhất quán
- Kiểm tra token đang được đính kèm đúng cách trong header

### Lỗi CORS
- Kiểm tra cấu hình CORS trong server.js
- Đảm bảo origin đã được whitelist

## Kết luận

Backend ConCaCon cung cấp các API cần thiết cho ứng dụng tuyển dụng và tạo CV trực tuyến. Kiến trúc của backend được thiết kế để dễ dàng mở rộng và bảo trì. Hãy tham khảo mã nguồn và API documentation để hiểu rõ hơn về cách thức hoạt động và tích hợp với frontend.