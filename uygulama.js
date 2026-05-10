import React, { useState, useEffect } from 'react';
import AdCard from './adcard';
// Supabase-i birbaşa internetdən (CDN) çəkirik
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Baza bağlantımızı birbaşa bura qururuq
const supabaseUrl = 'https://sjbaxzgkmrzyirhxbgxi.supabase.co';
const supabaseKey = 'Sb_publishable_fjwitosjQ02wGWXrpoJ19g_KzppuTlb';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [elanlar, setElanlar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElanlar = async () => {
      try {
        const { data, error } = await supabase
          .from('elanlar')
          .select('*')
          .order('is_vip', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }
        
        setElanlar(data);
      } catch (error) {
        console.error("Baza xətası:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElanlar();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Üst Panel */}
      <header className="border-b border-green-500/30 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black text-green-500 tracking-widest italic uppercase">
            Elanbazarı <span className="text-white text-sm">NOIR</span>
          </h1>
          <button className="bg-green-600 text-black px-6 py-2 rounded-xl font-bold uppercase tracking-widest hover:bg-green-500 shadow-[0_0_15px_rgba(22,163,74,0.4)] transition-all">
            Giriş
          </button>
        </div>
      </header>

      {/* Ana Məzmun */}
      <main className="container mx-auto p-4 mt-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-8 w-2 bg-green-600 rounded-full shadow-[0_0_15px_#16a34a]"></div>
          <h2 className="text-3xl font-black italic uppercase">Son Elanlar</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-green-500 animate-pulse font-mono text-xl uppercase tracking-widest">
              [ Sistem Skan Edilir... ]
            </div>
          </div>
        ) : elanlar.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-600 font-mono text-sm uppercase tracking-widest border border-gray-800 p-8 rounded-2xl">
              Hazırda bazada heç bir məlumat tapılmadı.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {elanlar.map((elan) => (
              <AdCard key={elan.id} {...elan} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
