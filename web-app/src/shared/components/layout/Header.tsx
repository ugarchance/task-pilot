import React from 'react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 h-12">
      <div className="container mx-auto px-3 h-full">
        <nav className="flex items-center justify-between h-full">
          <div className="text-base font-bold text-blue-600">Task Pilot</div>
          <div className="flex items-center space-x-3">
            <a href="/tasks" className="text-sm text-gray-600 hover:text-blue-600">Görevler</a>
            <a href="/analytics" className="text-sm text-gray-600 hover:text-blue-600">Analitik</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header; 