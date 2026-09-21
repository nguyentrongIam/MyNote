const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Khai báo đường dẫn
const profilePath = path.join(__dirname, 'data', 'profile.json');
const notesDir = path.join(__dirname, 'data', 'notes');

// Tự động khởi tạo thư mục notes nếu chưa có
if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir, { recursive: true });
}

// ==========================================
// SPRINT 1: API PROFILE & CẤU HÌNH
// ==========================================
app.get('/api/profile', (req, res) => {
  try {
    if (!fs.existsSync(profilePath)) {
      const defaultProfile = { displayName: "Sinh viên", theme: "light", password: "" };
      fs.writeFileSync(profilePath, JSON.stringify(defaultProfile, null, 2), 'utf8');
    }
    const rawData = fs.readFileSync(profilePath, 'utf8');
    res.json(JSON.parse(rawData));
  } catch (error) {
    res.status(500).json({ message: "Lỗi đọc file profile" });
  }
});

app.put('/api/profile', (req, res) => {
  try {
    const newProfile = req.body;
    fs.writeFileSync(profilePath, JSON.stringify(newProfile, null, 2), 'utf8');
    res.json({ success: true, message: "Đã cập nhật Profile" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi ghi file profile" });
  }
});

// ==========================================
// SPRINT 2: API GHI CHÚ CÔNG KHAI (CRUD)
// ==========================================
const getFilePath = (topic) => path.join(notesDir, `${topic}.json`);

// 1. GET: Lấy danh sách ghi chú theo chủ đề
app.get('/api/notes/:topic', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.json([]);
    const data = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ message: "Lỗi đọc danh sách ghi chú" });
  }
});

// 2. POST: Thêm mới ghi chú theo chủ đề
app.post('/api/notes/:topic', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    let notes = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : [];
    const newNote = {
      id: Date.now().toString(),
      title: req.body.title || "Không tiêu đề",
      content: req.body.content || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.push(newNote);
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
    res.json({ success: true, note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm ghi chú" });
  }
});

// 3. PUT: Chỉnh sửa ghi chú
app.put('/api/notes/:topic/:id', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File không tồn tại" });
    let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const index = notes.findIndex(n => n.id === req.params.id);
    if (index !== -1) {
      notes[index].title = req.body.title ?? notes[index].title;
      notes[index].content = req.body.content ?? notes[index].content;
      notes[index].updatedAt = new Date().toISOString();
      fs.writeFileSync(filePath, JSON.stringify(notes, null, 2), 'utf8');
      return res.json({ success: true, message: "Đã cập nhật ghi chú" });
    }
    res.status(404).json({ message: "Không tìm thấy ghi chú" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật ghi chú" });
  }
});

// 4. DELETE: Xóa ghi chú
app.delete('/api/notes/:topic/:id', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File không tồn tại" });
    let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const newNotes = notes.filter(n => n.id !== req.params.id);
    fs.writeFileSync(filePath, JSON.stringify(newNotes, null, 2), 'utf8');
    res.json({ success: true, message: "Đã xóa ghi chú thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa ghi chú" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));