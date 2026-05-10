import React from 'react';

function Navbar({ onNewAdClick }) {
  return (
    <nav className="bg-gray-900 text-white shadow-2xl p-4 border-b border-gray-800 sticky top-0 z-[100]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="text-3xl font-black tracking-tighter text-green-500 cursor-pointer hover:text-green-400 transition-colors italic uppercase">
          ELANBAZARI
        </div>

        <div className="flex w-full md:w-1/2 shadow-lg">
          <input
            type="text"
            placeholder="Nə axtarırsınız?"
            className="w-full px-4 py-3 text-gray-200 bg-gray-800 border border-gray-700 rounded-l-2xl focus:outline-none focus:border-green-600 transition-all text-sm"
          />
          <button className="bg-green-600 px-6 py-3 rounded-r-2xl font-bold hover:bg-green-700 transition-all text-black uppercase text-xs tracking-widest">
            Axtar
          </button>
        </div>

        <button 
          onClick={onNewAdClick}
          className="bg-green-600 text-black flex items-center gap-2 px-6 py-3 rounded-2xl font-black hover:bg-green-500 transition-all w-full md:w-auto justify-center shadow-lg shadow-green-900/40 uppercase tracking-tighter text-sm"
        >
          <span className="text-xl">+</span> Yeni Elan
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

