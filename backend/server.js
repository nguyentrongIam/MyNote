const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Cấu hình CORS (Cho phép truy cập từ client)
app.use(cors());

// 2. Middleware đọc dữ liệu JSON & URL-encoded từ request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Định nghĩa các Routes
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server Express đang hoạt động tốt!'
  });
});

app.get('/api/data', (req, res) => {
  res.json({
    id: 1,
    name: 'Sản phẩm mẫu',
    price: 100000
  });
});

// 4. Khởi chạy Server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});