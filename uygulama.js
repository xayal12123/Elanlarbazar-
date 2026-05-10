import React, { useState } from 'react';
import Navbar from './navbar.js';
import AdCard from './adcard.js';

function App() {
  const categories = ["Nəqliyyat", "Əmlak", "Elektronika", "Xidmətlər", "İş", "Şəxsi"];
  
  const [elanlar, setElanlar] = useState([
    { 
      id: 1, price: 1250, title: 'iPhone 15 Pro Max - 256GB, Black Titanium', city: 'Bakı', date: 'Bugün, 14:20', 
      isUrgent: true, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
      desc: 'İdeal vəziyyətdədir. Karobkası var. Çatdırılma mümkündür.', phone: '055-123-45-67'
    },
    { 
      id: 2, price: 45000, title: 'BMW M5 F10 - Full Edition, 2020 il', city: 'Bakı', date: 'Bugün, 11:05', 
      isUrgent: false, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600',
      desc: 'Bezkraska. İdeal vəziyyətdədir. Real alıcıya endirim olacaq.', phone: '050-987-65-43'
    }
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false); 
  const [selectedAd, setSelectedAd] = useState(null); 
  const [newAd, setNewAd] = useState({ title: '', price: '', city: 'Bakı', image: '', desc: '', phone: '' });

  const handlePublish = (e) => {
    e.preventDefault();
    setElanlar([{ ...newAd, id: Date.now(), date: 'İndi', isUrgent: false }, ...elanlar]);
    setIsFormOpen(false);
    setNewAd({ title: '', price: '', city: 'Bakı', image: '', desc: '', phone: '' });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <Navbar onNewAdClick={() => setIsFormOpen(true)} />

      <section className="bg-gray-950 border-b border-gray-900 overflow-x-auto py-3 px-4">
        <div className="container mx-auto flex gap-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
          {categories.map(cat => (
            <span key={cat} className="cursor-pointer hover:text-green-500 transition-colors shrink-0">{cat}</span>
          ))}
        </div>
      </section>

      <main className="container mx-auto p-4 mt-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-8 w-2 bg-green-600 rounded-full shadow-[0_0_15px_rgba(22,163,74,0.6)]"></div>
          <h2 className="text-3xl font-black italic uppercase italic">VİP ELANLAR</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {elanlar.map(e => (
            <div key={e.id} onClick={() => setSelectedAd(e)}>
              <AdCard {...e} />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-900 mt-24 py-16 text-center">
        <div className="text-3xl font-black text-green-500 mb-6 tracking-tighter italic">ELANBAZARI</div>
        <p className="text-gray-800 text-[10px] font-bold tracking-[5px]">NOIR GREEN © 2026</p>
      </footer>

      {/* Mobil Alt Menyu */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 px-6 py-3 flex justify-between items-center z-[150] rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <button onClick={() => window.location.reload()} className="flex flex-col items-center gap-1 text-green-500">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[9px] font-bold uppercase">Ana Səhifə</span>
        </button>
        <button onClick={() => setIsFormOpen(true)} className="flex flex-col items-center gap-1 text-gray-500">
          <div className="bg-green-600 p-3 rounded-full -mt-12 shadow-xl shadow-green-950 text-black border-4 border-black active:scale-90 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </div>
          <span className="text-[9px] font-bold mt-1 uppercase text-green-500">Elan Ver</span>
        </button>
        <button onClick={() => alert("Profil hazırlanır...")} className="flex flex-col items-center gap-1 text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
          <span className="text-[9px] font-bold uppercase">Kabinet</span>
        </button>
      </div>

      {/* --- MODALLAR --- */}

      {/* 1. Elan Detalları */}
      {selectedAd && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[300] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-green-900/30 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative text-left">
            <button onClick={() => setSelectedAd(null)} className="absolute top-5 right-5 z-50 bg-black/50 p-2 rounded-full text-white">✕</button>
            <div className="relative h-64 bg-gray-800">
              <img src={selectedAd.image} className="w-full h-full object-cover" alt="Ad" />
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-4xl font-black text-green-500 italic mb-2 tracking-tighter">{selectedAd.price} AZN</h3>
                  <h4 className="text-xl font-bold">{selectedAd.title}</h4>
                </div>
                <div className="text-right text-gray-600 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  <p>{selectedAd.city}</p><p>{selectedAd.date}</p>
                </div>
              </div>
              <p className="text-gray-400 mb-8 border-t border-gray-800/50 pt-6 text-sm">{selectedAd.desc}</p>
              <a href={`tel:${selectedAd.phone}`} className="block w-full bg-green-600 text-black text-center py-5 rounded-2xl font-black text-lg uppercase tracking-widest">
                ZƏNG ET: {selectedAd.phone}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Yeni Elan Forması */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[300] flex items-center justify-center p-4">
          <div className="bg-gray-900 p-8 rounded-[2.5rem] w-full max-w-md border border-green-900/20">
            <h3 className="text-2xl font-black text-green-500 mb-8 italic uppercase tracking-tighter text-left">Yenİ Elan Paylaş</h3>
            <form onSubmit={handlePublish} className="space-y-4">
              <input type="text" placeholder="Məhsulun adı" required className="w-full bg-gray-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-green-600" value={newAd.title} onChange={e => setNewAd({...newAd, title: e.target.value})} />
              <input type="number" placeholder="Qiymət (AZN)" required className="w-full bg-gray-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-green-600" value={newAd.price} onChange={e => setNewAd({...newAd, price: e.target.value})} />
              <input type="text" placeholder="Telefon nömrəsi" required className="w-full bg-gray-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-green-600" value={newAd.phone} onChange={e => setNewAd({...newAd, phone: e.target.value})} />
              <textarea placeholder="Məhsul haqqında ətraflı..." className="w-full bg-gray-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-green-600 h-28 resize-none" value={newAd.desc} onChange={e => setNewAd({...newAd, desc: e.target.value})} />
              <input type="text" placeholder="Şəkil linki (URL)" className="w-full bg-gray-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-green-600" value={newAd.image} onChange={e => setNewAd({...newAd, image: e.target.value})} />
              
              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-grow bg-green-600 text-black font-black py-4 rounded-2xl hover:bg-green-500 uppercase tracking-widest transition-colors">Paylaş</button>
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-4 text-gray-500 font-bold uppercase text-[10px] tracking-widest">Ləğv et</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;

