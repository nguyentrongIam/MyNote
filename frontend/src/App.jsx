import React, { useState } from 'react';
import Notes from './Notes';
import PrivateNotes from './PrivateNotes';
import Settings from './Settings';

function App() {
  const [activeTab, setActiveTab] = useState('notes');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 shadow-sm p-4 flex gap-4 justify-center">
        <button 
          className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'notes' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300'}`}
          onClick={() => setActiveTab('notes')}
        >
          Ghi chú công khai
        </button>
        <button 
          className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'private' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300'}`}
          onClick={() => setActiveTab('private')}
        >
          Ghi chú riêng tư
        </button>
        <button 
          className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === 'settings' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300'}`}
          onClick={() => setActiveTab('settings')}
        >
          Cài đặt
        </button>
      </nav>

      <div className="container mx-auto p-4 md:p-8">
        {activeTab === 'notes' && <Notes />}
        {activeTab === 'private' && <PrivateNotes />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  );
}

export default App;