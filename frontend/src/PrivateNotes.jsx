import React, { useState, useEffect } from 'react';

function PrivateNotes() {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    
    const [view, setView] = useState('list');
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState({ id: null, title: '', content: '' });
    
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 6;

    const handleLogin = () => {
        fetch('http://localhost:5000/api/private/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordInput })
        }).then(res => res.json()).then(data => {
            if (data.success) {
                setIsUnlocked(true);
                fetchPrivateNotes();
            } else {
                alert("Sai mật khẩu!");
                setPasswordInput('');
            }
        });
    };

    const fetchPrivateNotes = (query = '') => {
        const url = query ? `http://localhost:5000/api/search/private?q=${query}` : `http://localhost:5000/api/private/notes`;
        fetch(url).then(res => res.json()).then(data => setNotes(data));
    };

    useEffect(() => {
        if (isUnlocked) {
            fetchPrivateNotes(searchQuery);
            setCurrentPage(1);
        }
    }, [searchQuery, isUnlocked]);

    const handleSave = () => {
        const method = formData.id ? 'PUT' : 'POST';
        const url = formData.id ? `http://localhost:5000/api/private/notes/${formData.id}` : `http://localhost:5000/api/private/notes`;
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: formData.title, content: formData.content })
        }).then(() => {
            fetchPrivateNotes(searchQuery);
            setFormData({ id: null, title: '', content: '' });
            setView('list');
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Xóa bí mật này?')) {
            fetch(`http://localhost:5000/api/private/notes/${id}`, { method: 'DELETE' }).then(() => fetchPrivateNotes(searchQuery));
        }
    };
    
    const handleEdit = (note) => {
        setFormData({ id: note.id, title: note.title, content: note.content });
        setView('form');
    };

    const sortedNotes = [...notes].sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
    });

    const indexOfLastNote = currentPage * notesPerPage;
    const currentNotes = sortedNotes.slice(indexOfLastNote - notesPerPage, indexOfLastNote);
    const totalPages = Math.ceil(sortedNotes.length / notesPerPage);

    if (!isUnlocked) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 text-center">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">Khu vực Bảo mật</h2>
                    <p className="mb-8 text-gray-500 dark:text-gray-400">Nhập mật khẩu để truy cập</p>
                    <input
                        type="password"
                        className="w-full p-4 mb-4 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white text-center tracking-[0.3em] text-lg"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <button onClick={handleLogin} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold transition-colors">
                        MỞ KHÓA
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'form') {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border-t-4 border-red-500 dark:border-red-600">
                <button onClick={() => setView('list')} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Quay lại
                </button>
                <h3 className="text-2xl font-bold mb-6 text-red-600 dark:text-red-400">{formData.id ? 'Sửa bí mật' : 'Thêm bí mật mới'}</h3>
                <input
                    className="w-full p-4 mb-4 text-lg font-medium border rounded-xl outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    placeholder="Tiêu đề bí mật" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
                <textarea
                    className="w-full p-4 mb-6 border rounded-xl h-64 outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white resize-none"
                    placeholder="Nội dung bí mật..." value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}
                />
                <button onClick={handleSave} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg shadow-red-600/30">
                    {formData.id ? 'Lưu cập nhật' : 'Lưu bí mật'}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 flex items-center gap-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Ghi chú Riêng tư
                </h2>
                <button onClick={() => { setFormData({ id: null, title: '', content: '' }); setView('form'); }} className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/30">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Tạo bí mật
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                <input type="text" placeholder="Tìm kiếm bí mật..." className="p-3 border rounded-lg flex-1 outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <select className="p-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="title">A - Z</option>
                </select>
            </div>

            {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-red-200 dark:border-gray-700 text-gray-400 dark:text-gray-500">
                    <svg className="w-16 h-16 mb-4 opacity-50 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    <p className="text-lg font-medium">{searchQuery ? "Không có bí mật nào khớp!" : "Khu vực này hiện đang trống."}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentNotes.map(note => (
                            <div key={note.id} className="border border-red-100 dark:border-red-900/30 p-5 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                                <div>
                                    <h4 className="text-lg font-bold mb-2 text-red-700 dark:text-red-400 line-clamp-1">{note.title}</h4>
                                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 line-clamp-4 text-sm">{note.content}</p>
                                </div>
                                <div className="mt-5 flex justify-between items-center pt-4 border-t border-red-50 dark:border-gray-700/50">
                                    <span className="text-xs font-medium text-gray-400">{new Date(note.createdAt).toLocaleDateString('vi-VN')}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(note)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                                        <button onClick={() => handleDelete(note.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 bg-white dark:bg-gray-800 text-red-700 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/50 disabled:opacity-50 hover:bg-red-50 transition-colors">Trước</button>
                            <span className="font-medium text-gray-600 dark:text-gray-400">Trang {currentPage} / {totalPages}</span>
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 bg-white dark:bg-gray-800 text-red-700 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/50 disabled:opacity-50 hover:bg-red-50 transition-colors">Sau</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
export default PrivateNotes;