const { useState, useEffect } = React;

// 1. SUPABASE KONFİQURASİYASI
const supabaseUrl = 'https://sjbaxzgkmrzyirhxbgxi.supabase.co';
const supabaseKey = 'EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqYmF6eGdrbXJ6eWlyaHhiZ3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzMyODEsImV4cCI6MjA5NDAwOTI4MX0.6sOiieR9GHYeadYnMqEajLw2vbjKJjlzX-pQeh8c-2I';

// Kitabxananın yükləndiyindən əmin olmaq üçün window üzərindən çağırırıq
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. ELAN KARTI KOMPONENTİ
function AdCard({ title, price, city, image_url, is_vip }) {
  return (
    <div className={`relative bg-zinc-900 border ${is_vip ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-zinc-800'} rounded-2xl overflow-hidden transition-all hover:scale-[1.02]`}>
      {is_vip && (
        <div className="absolute top-3 right-3 bg-green-500 text-black text-[10px] font-black px-2 py-1 rounded-md uppercase z-10 animate-pulse">
          VIP
        </div>
      )}
      <div className="h-48 bg-zinc-800 relative">
        {image_url ? (
          <img src={image_url} alt={title} className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 font-mono text-[10px]">ŞƏKİL YÜKLƏNMƏDİ</div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-white font-bold text-sm truncate uppercase tracking-tight">{title}</h3>
        <div className="flex items-center justify-between mt-4">
          <span className="text-green-500 font-black text-xl">{price} <small className="text-[10px] text-zinc-500 uppercase">AZN</small></span>
          <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{city}</span>
        </div>
      </div>
    </div>
  );
}

// 3. ANA KOMPONENT
function App() {
  const [elanlar, setElanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchElanlar = async () => {
      try {
        // Bazadan məlumatları çəkirik
        const { data, error } = await supabase
          .from('elanlar')
          .select('*')
          .order('is_vip', { ascending: false });

        if (error) throw error;
        setElanlar(data || []);
      } catch (err) {
        console.error("Fetch xətası:", err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchElanlar();
  }, []);

  // XƏTA EKRANI
  if (errorMsg) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-10">
        <div className="text-red-500 font-mono text-xs border border-red-900/50 p-6 rounded-2xl bg-red-950/10 text-center">
          <p className="font-black mb-2">[ SİSTEM XƏTASI ]</p>
          <p className="opacity-70 uppercase">{errorMsg}</p>
          <p className="mt-4 text-zinc-600 text-[10px]">İnternet bağlantınızı və ya VPN-i yoxlayın</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
      {/* NAVİQASİYA */}
      <header className="border-b border-zinc-900 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter shadow-green-500/20">
              ELANBAZARI <span className="text-green-500">NOIR</span>
            </h1>
          </div>
          <button className="bg-white text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-green-500 transition-all active:scale-95">
            GİRİŞ
          </button>
        </div>
      </header>

      {/* ƏSAS HİSSƏ */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none mb-4">Son Elanlar</h2>
          <div className="h-1.5 w-24 bg-green-500 shadow-[0_0_20px_#22c55e]"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">[ BAZA SKAN EDİLİR ]</p>
          </div>
        ) : elanlar.length === 0 ? (
          <div className="border border-zinc-900 rounded-[2rem] p-32 text-center bg-zinc-950/30">
            <p className="text-zinc-700 font-mono text-xs uppercase tracking-[0.3em] italic">Hazırda aktiv elan tapılmadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {elanlar.map((elan) => (
              <AdCard key={elan.id} {...elan} />
            ))}
          </div>
        )}
      </main>
      
      {/* FOOTER */}
      <footer className="py-10 border-t border-zinc-900 text-center">
        <p className="text-zinc-800 font-mono text-[9px] uppercase tracking-[1em]">Noir Platform System v1.0</p>
      </footer>
    </div>
  );
}

// REACT-I BAŞLAT
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
