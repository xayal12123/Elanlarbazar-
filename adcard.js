import React, { useState } from 'react';

function AdCard({ price, title, city, date, image, isUrgent }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 hover:border-green-600 transition-all duration-300 relative group cursor-pointer">
      
      <button 
        onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
        className="absolute top-3 right-3 z-10 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 active:scale-90 transition-all"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill={liked ? "#16a34a" : "none"} 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke={liked ? "#16a34a" : "white"} 
          className="w-5 h-5 transition-colors"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>

      <div className="h-44 bg-gray-800 overflow-hidden relative">
        <img 
          src={image || 'https://via.placeholder.com/400x300?text=Səkil+Yoxdur'} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
          alt={title}
        />
        <div className="absolute bottom-2 left-2 flex gap-1">
          <span className="bg-green-600 text-black text-[9px] font-black px-2 py-1 rounded shadow-lg uppercase">VİP</span>
          {isUrgent && (
            <span className="bg-yellow-500 text-black text-[9px] font-black px-2 py-1 rounded shadow-lg uppercase">TƏCİLİ</span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-white tracking-tighter">{price}</span>
          <span className="text-xs font-bold text-green-500 uppercase italic">AZN</span>
        </div>
        <h3 className="text-gray-400 text-xs font-medium h-8 line-clamp-2 mt-2 leading-tight group-hover:text-gray-200 transition-colors">
          {title}
        </h3>
        <div className="flex justify-between mt-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest border-t border-gray-800/50 pt-3">
          <span>{city}</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

export default AdCard;
