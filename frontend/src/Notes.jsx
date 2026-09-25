import React, { useState, useEffect } from 'react';

function Notes() {
    const [view, setView] = useState('list'); // 'list' hoặc 'form'
    const [topic, setTopic] = useState('hoc-tap');
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState({ id: null, title: '', content: '' });
    
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest'); 
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 6;

    const fetchNotes = (query = '') => {
        const url = query 
            ? `http://localhost:5000/api/search/notes/${topic}?q=${query}`
            : `http://localhost:5000/api/notes/${topic}`;
        fetch(url).then(res => res.json()).then(data => setNotes(data));
    };

    useEffect(() => { 
        fetchNotes(searchQuery); 
        setCurrentPage(1); 
    }, [topic, searchQuery]);

    const handleSave = () => {
        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id
            ? `http://localhost:5000/api/notes/${topic}/${formData.id}`
            : `http://localhost:5000/api/notes/${topic}`;
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: formData.title, content: formData.content })
        }).then(() => {
            fetchNotes(searchQuery);
            setFormData({ id: null, title: '', content: '' });
            setView('list'); // Lưu xong quay về danh sách
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa ghi chú này?')) {
            fetch(`http://localhost:5000/api/notes/${topic}/${id}`, { method: 'DELETE' })
                .then(() => fetchNotes(searchQuery));
        }
    };

    const handleEdit = (note) => {
        setFormData({ id: note.id, title: note.title, content: note.content });
        setView('form'); // Chuyển sang trang sửa
    };

    const handleAddNew = () => {
        setFormData({ id: null, title: '', content: '' });
        setView('form');
    }

    const sortedNotes = [...notes].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
    });

    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = sortedNotes.slice(indexOfFirstNote, indexOfLastNote);
    const totalPages = Math.ceil(sortedNotes.length / notesPerPage);

    // ==========================================
    // MÀN HÌNH 2: FORM THÊM / SỬA GHI CHÚ
    // ==========================================
    if (view === 'form') {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <button 
                    onClick={() => setView('list')}
                    className="mb-6 flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Quay lại danh sách
                </button>

                <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                    {formData.id ? 'Sửa ghi chú' : 'Thêm ghi chú mới'}
                </h3>
                
                <input
                    className="w-full p-4 mb-4 text-lg font-medium border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    placeholder="Tiêu đề..." 
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
                <textarea
                    className="w-full p-4 mb-6 border rounded-xl h-64 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none"
                    placeholder="Nội dung chi tiết..." 
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                />
                <div className="flex gap-4">
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/30"
                        onClick={handleSave}
                    >
                        {formData.id ? 'Lưu thay đổi' : 'Lưu ghi chú'}
                    </button>
                </div>
            </div>
        );
    }

    // ==========================================
    // MÀN HÌNH 1: DANH SÁCH GHI CHÚ
    // ==========================================
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Ghi chú Công khai</h2>
                <button 
                    onClick={handleAddNew}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Tạo mới
                </button>
            </div>
            
            {/* Vùng Lọc và Tìm Kiếm */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                <select 
                    className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    value={topic} 
                    onChange={(e) => setTopic(e.target.value)}
                >
                    <option value="hoc-tap">📚 Học tập</option>
                    <option value="cong-viec">💼 Công việc</option>
                    <option value="ca-nhan">👤 Cá nhân</option>
                </select>
                
                <input 
                    type="text" 
                    placeholder="Tìm kiếm..." 
                    className="p-3 border rounded-lg flex-1 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select 
                    className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="title">A - Z</option>
                </select>
            </div>

            {/* Hiển thị Ghi chú */}
            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <p className="text-lg font-medium">{searchQuery ? "Không tìm thấy kết quả" : "Chưa có ghi chú nào."}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentNotes.map(note => (
                            <div key={note.id} className="border border-gray-100 dark:border-gray-700 p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                                <div>
                                    <h4 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-100 line-clamp-1">{note.title}</h4>
                                    <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-400 line-clamp-4 text-sm">{note.content}</p>
                                </div>
                                <div className="mt-5 flex justify-between items-center pt-4 border-t border-gray-50 dark:border-gray-700/50">
                                    <span className="text-xs font-medium text-gray-400">
                                        {new Date(note.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(note)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(note.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors">Trước</button>
                            <span className="font-medium text-gray-600 dark:text-gray-400">Trang {currentPage} / {totalPages}</span>
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-colors">Sau</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
export default Notes;