// React-ı pəncərədən (window) alırıq (İmportlara ehtiyac qalmadı)
const { useState, useEffect } = React;

// Supabase Bağlantısı
const supabaseUrl = 'https://sjbaxzgkmrzyirhxbgxi.supabase.co';
const supabaseKey = 'Sb_publishable_fjwitosjQ02wGWXrpoJ19g_KzppuTlb';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 1. VİP KART KOMPONENTİ (Birbaşa bura əlavə etdik)
function AdCard({ title, price, city, image_url, is_vip }) {
  return (
    <div className={`relative bg-gray-900 border ${is_vip ? 'border-green-500 shadow-[0_0_15px_rgba(22,163,74,0.3)]' : 'border-gray-800'} rounded-xl overflow-hidden`}>
      {is_vip && <div className="absolute top-2 right-2 bg-green-600 text-black text-xs font-bold px-2 py-1 rounded animate-pulse">VIP</div>}
      <div className="h-32 bg-gray-800 flex items-center justify-center overflow-hidden">
        {image_url ? (
           <img src={image_url} alt={title} className="object-cover w-full h-full opacity-80" />
        ) : (
           <span className="text-gray-600 text-xs font-mono">Şəkil yoxdur</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold truncate">{title || 'Adsız Elan'}</h3>
        <p className="text-green-500 font-black mt-1">{price ? price + ' AZN' : 'Qiymət yoxdur'}</p>
        <p className="text-gray-500 text-xs mt-2 font-mono uppercase">{city || 'Bilinmir'}</p>
      </div>
    </div>
  );
}

// 2. ANA SAYT KOMPONENTİ
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

        if (error) throw error;
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

      <main className="container mx-auto p-4 mt-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-8 w-2 bg-green-600 rounded-full shadow-[0_0_15px_#16a34a]"></div>
          <h2 className="text-3xl font-black italic uppercase">Son Elanlar</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-green-500 animate-pulse font-mono text-xl uppercase tracking-widest">
              [ BAZA SKAN EDİLİR... ]
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

// 3. SİSTEMİ EKRANA ÇIXARIRIQ
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
