import React, { useState, useEffect } from 'react';

function Settings() {
    const [profile, setProfile] = useState({
        displayName: '', theme: 'light', password: ''
    });

    useEffect(() => {
        fetch('http://localhost:5000/api/profile')
            .then(res => res.json())
            .then(data => {
                setProfile(data);
                if (data.theme === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
            });
    }, []);

    const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

    const handleSave = () => {
        fetch('http://localhost:5000/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        }).then(() => {
            alert("Lưu cài đặt thành công!");
            if (profile.theme === 'dark') document.documentElement.classList.add('dark');
            else document.documentElement.classList.remove('dark');
        });
    };

    return (
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 flex items-center gap-3">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Cài đặt hệ thống
            </h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tên hiển thị</label>
                    <input className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white" name="displayName" value={profile.displayName} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Giao diện (Theme)</label>
                    <select className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white" name="theme" value={profile.theme} onChange={handleChange}>
                        <option value="light">Sáng (Light)</option>
                        <option value="dark">Tối (Dark)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mật khẩu vùng kín</label>
                    <input type="password" placeholder="Bỏ trống nếu không muốn đổi..." className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-white" name="password" value={profile.password} onChange={handleChange} />
                </div>
            </div>

            <button onClick={handleSave} className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-colors duration-200">
                Lưu thay đổi
            </button>
        </div>
    );
}
export default Settings;