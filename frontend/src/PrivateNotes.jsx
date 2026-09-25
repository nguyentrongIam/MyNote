import React, { useState, useEffect } from 'react';

function PrivateNotes() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState({ id: null, title: '', content: '' });
    
    // States cho Tìm kiếm, Sắp xếp, Phân trang
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 4;

    const handleLogin = () => {
        fetch('http://localhost:5000/api/private/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordInput })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setIsUnlocked(true);
                    fetchPrivateNotes();
                } else {
                    alert("Sai mật khẩu, vui lòng thử lại!");
                    setPasswordInput('');
                }
            });
    };

    const fetchPrivateNotes = (query = '') => {
        const url = query 
            ? `http://localhost:5000/api/search/private?q=${query}`
            : `http://localhost:5000/api/private/notes`;
            
        fetch(url)
            .then(res => res.json())
            .then(data => setNotes(data));
    };

    useEffect(() => {
        if (isUnlocked) {
            fetchPrivateNotes(searchQuery);
            setCurrentPage(1);
        }
    }, [searchQuery, isUnlocked]);

    const handleSave = () => {
        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id 
            ? `http://localhost:5000/api/private/notes/${formData.id}`
            : `http://localhost:5000/api/private/notes`;
            
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: formData.title, content: formData.content })
        }).then(() => {
            fetchPrivateNotes(searchQuery);
            setFormData({ id: null, title: '', content: '' });
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Xóa ghi chú bí mật này? Hành động này sẽ được lưu log.')) {
            fetch(`http://localhost:5000/api/private/notes/${id}`, { method: 'DELETE' })
                .then(() => fetchPrivateNotes(searchQuery));
        }
    };
    
    const handleEdit = (note) => setFormData({
        id: note.id, title: note.title, content: note.content
    });

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

    // Màn hình khóa
    if (!isUnlocked) {
        return (
            <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl text-center border-t-4 border-red-500">
                <div className="mb-4 text-red-500">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Khu vực Bảo mật</h2>
                <p className="mb-6 text-gray-500 dark:text-gray-400">Vui lòng nhập mật khẩu để truy cập</p>
                <div className="flex gap-2">
                    <input
                        type="password"
                        className="flex-1 p-3 border rounded-md outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Nhập mật khẩu..."
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <button 
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-medium transition-colors"
                        onClick={handleLogin}
                    >
                        Mở khóa
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-red-50/50 dark:bg-gray-800 p-6 rounded-xl shadow-lg border-t-4 border-red-500">
            <h2 className="text-2xl font-bold mb-6 text-red-600 dark:text-red-400 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Ghi chú Riêng tư
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <input 
                    type="text" 
                    placeholder="Tìm kiếm bí mật..." 
                    className="p-2.5 border border-red-200 rounded-md flex-1 outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select 
                    className="p-2.5 border border-red-200 rounded-md outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="title">Tiêu đề (A-Z)</option>
                </select>
            </div>

            <div className="mb-8 p-5 border border-red-200 rounded-xl bg-white dark:bg-gray-700/50 dark:border-gray-600 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-red-700 dark:text-red-400">
                    {formData.id ? 'Sửa bí mật' : 'Thêm bí mật mới'}
                </h3>
                <input
                    className="w-full p-2.5 mb-3 border border-red-100 rounded-md outline-none focus:border-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="Tiêu đề bí mật" 
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
                <textarea
                    className="w-full p-2.5 mb-3 border border-red-100 rounded-md h-28 outline-none focus:border-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none"
                    placeholder="Nội dung bí mật" 
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                />
                <div className="flex gap-3">
                    <button 
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-md transition-colors"
                        onClick={handleSave}
                    >
                        {formData.id ? 'Lưu cập nhật' : 'Lưu bí mật'}
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

            {/* Giao diện khi chưa có ghi chú (Empty State) */}
            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                    <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    <p className="text-lg font-medium">{searchQuery ? "Không có bí mật nào khớp với từ khóa!" : "Khu vực này hiện đang trống."}</p>
                    <p className="text-sm mt-1">Nơi an toàn để cất giữ thông tin quan trọng của bạn.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {currentNotes.map(note => (
                            <div key={note.id} className="border border-red-200 dark:border-gray-600 p-5 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                                <div>
                                    <h4 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-400 break-words">{note.title}</h4>
                                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 line-clamp-4">{note.content}</p>
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
                                className="px-4 py-2 bg-red-100 dark:bg-gray-700 text-red-800 dark:text-red-300 rounded-md disabled:opacity-50 hover:bg-red-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                Trước
                            </button>
                            <span className="font-medium text-gray-600 dark:text-gray-400">
                                Trang {currentPage} / {totalPages}
                            </span>
                            <button 
                                disabled={currentPage === totalPages} 
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="px-4 py-2 bg-red-100 dark:bg-gray-700 text-red-800 dark:text-red-300 rounded-md disabled:opacity-50 hover:bg-red-200 dark:hover:bg-gray-600 transition-colors"
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
export default PrivateNotes;