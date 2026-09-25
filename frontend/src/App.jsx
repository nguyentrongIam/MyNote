import React, { useState } from 'react';
import Notes from './Notes';
import PrivateNotes from './PrivateNotes';
import Settings from './Settings';

function App() {
  const [activeTab, setActiveTab] = useState('notes');

  const navItems = [
    { 
      id: 'notes', 
      label: 'Công khai', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> 
    },
    { 
      id: 'private', 
      label: 'Riêng tư', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> 
    },
    { 
      id: 'settings', 
      label: 'Cài đặt', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> 
    },
  ];

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans min-h-screen transition-colors duration-200">
      
      {/* 1. SIDEBAR CHO PC (Hiển thị từ màn hình md trở lên) */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 z-20">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Notes</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === item.id ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH */}
      <main className="flex-1 md:ml-64 w-full p-4 pb-24 md:pb-8 md:p-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'notes' && <Notes />}
          {activeTab === 'private' && <PrivateNotes />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>

      {/* 3. BOTTOM MENU CHO MOBILE (Ẩn trên PC) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgba(0,0,0,0.2)] border-t border-gray-100 dark:border-gray-700 flex justify-around items-center h-16 z-30 pb-safe">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}

export default App;