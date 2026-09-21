const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors()); // Cho phép FE gọi API
app.use(express.json()); // Đọc dữ liệu JSON từ FE gửi lên
const profilePath = path.join(__dirname, 'data', 'profile.json');
// API 1: Đọc thông tin Profile
app.get('/api/profile', (req, res) => {
try {
const rawData = fs.readFileSync(profilePath, 'utf8');
const profile = JSON.parse(rawData);
res.json(profile);
} catch (error) {
res.status(500).json({ message: "Lỗi đọc file" });
}
});
// API 2: Cập nhật Profile
app.put('/api/profile', (req, res) => {
try {
const newProfile = req.body;
// Ghi đè dữ liệu mới vào file
fs.writeFileSync(profilePath, JSON.stringify(newProfile, null, 2), 'utf8');
res.json({ success: true, message: "Đã cập nhật Profile" });
} catch (error) {
res.status(500).json({ message: "Lỗi ghi file" });
}
});
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend chạy tại http://localhost:${PORT}`));
=======

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
>>>>>>> 2574be881c0ffd0b44970ea7998582ec444b9b11
