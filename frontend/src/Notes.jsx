import React, { useState, useEffect } from 'react';

function Notes() {
    const [topic, setTopic] = useState('hoc-tap');
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState({ id: null, title: '', content: '' });
    
    // States cho Tìm kiếm, Sắp xếp, Phân trang
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest'); 
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 4; // Số ghi chú trên mỗi trang

    const fetchNotes = (query = '') => {
        const url = query 
            ? `http://localhost:5000/api/search/notes/${topic}?q=${query}`
            : `http://localhost:5000/api/notes/${topic}`;
            
        fetch(url)
            .then(res => res.json())
            .then(data => setNotes(data));
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
        })
            .then(res => res.json())
            .then(() => {
                fetchNotes(searchQuery);
                setFormData({ id: null, title: '', content: '' });
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa ghi chú này? (Lịch sử xóa sẽ được lưu lại server)')) {
            fetch(`http://localhost:5000/api/notes/${topic}/${id}`, { method: 'DELETE' })
                .then(() => fetchNotes(searchQuery));
        }
    };

    const handleEdit = (note) => setFormData({
        id: note.id, title: note.title, content: note.content
    });

    // --- LOGIC SẮP XẾP ---
    const sortedNotes = [...notes].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
    });

    // --- LOGIC PHÂN TRANG ---
    const indexOfLastNote = currentPage * notesPerPage;
    const indexOfFirstNote = indexOfLastNote - notesPerPage;
    const currentNotes = sortedNotes.slice(indexOfFirstNote, indexOfLastNote);
    const totalPages = Math.ceil(sortedNotes.length / notesPerPage);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">Ghi chú Công khai</h2>
            
            {/* Vùng Lọc và Tìm Kiếm */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <strong className="whitespace-nowrap text-gray-700 dark:text-gray-300">Chủ đề: </strong>
                    <select 
                        className="p-2.5 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={topic} 
                        onChange={(e) => setTopic(e.target.value)}
                    >
                        <option value="hoc-tap">Học tập</option>
                        <option value="cong-viec">Công việc</option>
                        <option value="ca-nhan">Cá nhân</option>
                    </select>
                </div>
                
                <div className="flex-1 flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm nội dung, tiêu đề..." 
                        className="p-2.5 border rounded-md flex-1 outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select 
                        className="p-2.5 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="title">Tiêu đề (A-Z)</option>
                    </select>
                </div>
            </div>

            {/* Vùng Nhập Liệu */}
            <div className="mb-8 p-5 border rounded-xl bg-blue-50/50 dark:bg-gray-700/50 dark:border-gray-600">
                <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-300">
                    {formData.id ? 'Sửa ghi chú' : 'Thêm ghi chú mới'}
                </h3>
                <input
                    className="w-full p-2.5 mb-3 border rounded-md outline-none focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="Nhập tiêu đề..." 
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
                <textarea
                    className="w-full p-2.5 mb-3 border rounded-md h-28 outline-none focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
                    placeholder="Nhập nội dung..." 
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                />
                <div className="flex gap-3">
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition-colors"
                        onClick={handleSave}
                    >
                        {formData.id ? 'Lưu cập nhật' : 'Thêm mới'}
                    </button>
                    {formData.id && (
                        <button 
                            className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-5 py-2 rounded-md transition-colors"
                            onClick={() => setFormData({ id: null, title: '', content: '' })}
                        >
                            Hủy sửa
                        </button>
                    )}
                </div>
            </div>

            {/* Hiển thị Ghi chú hoặc Giao diện rỗng (Empty State) */}
            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                    <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <p className="text-lg font-medium">{searchQuery ? "Không tìm thấy ghi chú nào phù hợp!" : "Chưa có ghi chú nào ở chủ đề này."}</p>
                    <p className="text-sm mt-1">Hãy tạo một ghi chú mới ở khung phía trên.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {currentNotes.map(note => (
                            <div key={note.id} className="border border-blue-100 dark:border-gray-600 p-5 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                                <div>
                                    <h4 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-400 break-words">{note.title}</h4>
                                    <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 line-clamp-4">{note.content}</p>
                                </div>
                                <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <span className="text-xs text-gray-400">
                                        {new Date(note.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                    <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button 
                                            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                                            onClick={() => handleEdit(note)}
                                        >Sửa</button>
                                        <button 
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                                            onClick={() => handleDelete(note.id)}
                                        >Xóa</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button 
                                disabled={currentPage === 1} 
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Trước
                            </button>
                            <span className="font-medium text-gray-600 dark:text-gray-400">
                                Trang {currentPage} / {totalPages}
                            </span>
                            <button 
                                disabled={currentPage === totalPages} 
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
export default Notes;