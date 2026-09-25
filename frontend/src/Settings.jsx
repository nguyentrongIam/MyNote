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
                if (data.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            });
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        fetch('http://localhost:5000/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        })
            .then(res => res.json())
            .then(() => {
                alert("Lưu cài đặt thành công!");
                if (profile.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            });
    };

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-green-600 dark:text-green-400">Cài đặt hệ thống</h2>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tên hiển thị: </label>
                    <input 
                        className="w-full p-2.5 border rounded-md outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        name="displayName" 
                        value={profile.displayName} 
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Giao diện (Theme): </label>
                    <select 
                        className="w-full p-2.5 border rounded-md outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        name="theme" 
                        value={profile.theme} 
                        onChange={handleChange}
                    >
                        <option value="light">Sáng (Light)</option>
                        <option value="dark">Tối (Dark)</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Mật khẩu khu vực riêng tư: </label>
                    <input 
                        className="w-full p-2.5 border rounded-md outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        type="password" 
                        name="password" 
                        value={profile.password}
                        onChange={handleChange} 
                        placeholder="Để trống nếu không muốn đổi..."
                    />
                </div>
            </div>

            <button 
                className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200"
                onClick={handleSave}
            >
                Lưu thay đổi
            </button>
        </div>
    );
}
export default Settings;