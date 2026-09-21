const express = require('express');
<<<<<<< HEAD
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

=======
const cors = require('cors');const fs = require('fs');
const path = require('path');
>>>>>>> d3224c497900bc4629bc1b25a35d45873537428b
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
<<<<<<< HEAD

// 4. Khởi chạy Server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});
>>>>>>> 2574be881c0ffd0b44970ea7998582ec444b9b11
=======
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend chạy tại http://localhost:${PORT}`));
>>>>>>> d3224c497900bc4629bc1b25a35d45873537428b
