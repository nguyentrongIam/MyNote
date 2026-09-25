const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Khai báo đường dẫn dữ liệu
const profilePath = path.join(__dirname, 'data', 'profile.json');
const privateNotesFile = path.join(__dirname, 'data', 'private.json');
const notesDir = path.join(__dirname, 'data', 'notes');
const logFile = path.join(__dirname, 'data', 'history.log'); // File lưu log xóa

if (!fs.existsSync(notesDir)) fs.mkdirSync(notesDir, { recursive: true });
if (!fs.existsSync(privateNotesFile)) fs.writeFileSync(privateNotesFile, '[]', 'utf8');
if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, '', 'utf8');

// Hàm ghi log
const writeLog = (action) => {
  const time = new Date().toLocaleString('vi-VN');
  const logMessage = `[${time}] ${action}\n`;
  fs.appendFileSync(logFile, logMessage, 'utf8');
  console.log(logMessage.trim()); // In ra console của server
};

// ==========================================
// API PROFILE & CẤU HÌNH
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
    fs.writeFileSync(profilePath, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ success: true, message: "Đã cập nhật Profile" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi ghi file profile" });
  }
});

// ==========================================
// GHI CHÚ CÔNG KHAI
// ==========================================
const getFilePath = (topic) => path.join(notesDir, `${topic}.json`);

app.get('/api/notes/:topic', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.json([]);
    res.json(JSON.parse(fs.readFileSync(filePath, 'utf8')));
  } catch (error) {
    res.status(500).json({ message: "Lỗi đọc danh sách ghi chú" });
  }
});

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

app.delete('/api/notes/:topic/:id', (req, res) => {
  const filePath = getFilePath(req.params.topic);
  try {
    let notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const noteToDelete = notes.find(n => n.id === req.params.id);
    const newNotes = notes.filter(n => n.id !== req.params.id);
    fs.writeFileSync(filePath, JSON.stringify(newNotes, null, 2), 'utf8');
    
    // GHI LOG QUÁ TRÌNH XÓA
    if (noteToDelete) {
      writeLog(`ĐÃ XÓA GHI CHÚ CÔNG KHAI - Chủ đề: ${req.params.topic} | Tiêu đề: "${noteToDelete.title}" | ID: ${noteToDelete.id}`);
    }

    res.json({ success: true, message: "Đã xóa ghi chú thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa ghi chú" });
  }
});

// ==========================================
// BẢO MẬT & GHI CHÚ RIÊNG TƯ
// ==========================================
app.post('/api/private/auth', (req, res) => {
  try {
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    if (profile.password === req.body.password) res.json({ success: true });
    else res.status(401).json({ success: false, message: "Sai mật khẩu!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống xác thực" });
  }
});

app.get('/api/private/notes', (req, res) => {
  try {
    res.json(JSON.parse(fs.readFileSync(privateNotesFile, 'utf8')));
  } catch (error) {
    res.status(500).json({ message: "Lỗi đọc ghi chú riêng tư" });
  }
});

app.post('/api/private/notes', (req, res) => {
  try {
    let notes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));
    const newNote = {
      id: Date.now().toString(),
      title: req.body.title || "Lưu bút mật",
      content: req.body.content || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.push(newNote);
    fs.writeFileSync(privateNotesFile, JSON.stringify(notes, null, 2), 'utf8');
    res.json({ success: true, note: newNote });
  } catch (error) {
    res.status(500).json({ message: "Lỗi thêm ghi chú riêng tư" });
  }
});

app.put('/api/private/notes/:id', (req, res) => {
  try {
    let notes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));
    const index = notes.findIndex(n => n.id === req.params.id);
    if (index !== -1) {
      notes[index].title = req.body.title ?? notes[index].title;
      notes[index].content = req.body.content ?? notes[index].content;
      notes[index].updatedAt = new Date().toISOString();
      fs.writeFileSync(privateNotesFile, JSON.stringify(notes, null, 2), 'utf8');
      return res.json({ success: true, message: "Đã sửa ghi chú riêng tư" });
    }
    res.status(404).json({ message: "Không tìm thấy ghi chú" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật" });
  }
});

app.delete('/api/private/notes/:id', (req, res) => {
  try {
    let notes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));
    const noteToDelete = notes.find(n => n.id === req.params.id);
    
    fs.writeFileSync(privateNotesFile, JSON.stringify(notes.filter(n => n.id !== req.params.id), null, 2), 'utf8');
    
    // GHI LOG QUÁ TRÌNH XÓA
    if (noteToDelete) {
      writeLog(`ĐÃ XÓA BÍ MẬT - Tiêu đề: "${noteToDelete.title}" | ID: ${noteToDelete.id}`);
    }

    res.json({ success: true, message: "Đã xóa ghi chú riêng tư" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa" });
  }
});

// ==========================================
// TÌM KIẾM & LỌC GHI CHÚ
// ==========================================
app.get('/api/search/notes/:topic', (req, res) => {
  const keyword = (req.query.q || '').toLowerCase();
  const filePath = getFilePath(req.params.topic);
  try {
    if (!fs.existsSync(filePath)) return res.json([]);
    const notes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const filtered = notes.filter(n => 
      n.title.toLowerCase().includes(keyword) || 
      n.content.toLowerCase().includes(keyword)
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tìm kiếm công khai" });
  }
});

app.get('/api/search/private', (req, res) => {
  const keyword = (req.query.q || '').toLowerCase();
  try {
    const notes = JSON.parse(fs.readFileSync(privateNotesFile, 'utf8'));
    const filtered = notes.filter(n => 
      n.title.toLowerCase().includes(keyword) || 
      n.content.toLowerCase().includes(keyword)
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tìm kiếm riêng tư" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));