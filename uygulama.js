const { useState, useEffect } = React;

// 1. SƏNİN BAZA MƏLUMATLARIN
const supabaseUrl = 'https://sjbaxzgkmrzyirhxbgxi.supabase.co';
const supabaseKey = 'Sb_publishable_fjwitosjQ02wGWXrpoJ19g_KzppuTlb';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. ELAN KARTI (DİZAYN)
function AdCard({ title, price, city, image_url, is_vip }) {
  return (
    <div className={`relative bg-zinc-900 border ${is_vip ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-zinc-800'} rounded-2xl overflow-hidden transition-all hover:scale-[1.02]`}>
      {is_vip && (
        <div className="absolute top-3 right-3 bg-green-500 text-black text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter z-10 animate-pulse">
          VIP
        </div>
      )}
      <div className="h-40 bg-zinc-800 relative">
        {image_url ? (
          <img src={image_url} alt={title} className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700 font-mono text-xs italic">Şəkil yüklənmədi</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-sm truncate uppercase tracking-tight">{title}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-green-500 font-black text-lg">{price} <small className="text-[10px]">AZN</small></span>
          <span className="text-zinc-500 text-[10px] uppercase font-medium">{city}</span>
        </div>
      </div>
    </div>
  );
}

// 3. ANA SİSTEM
function App() {
  const [elanlar, setElanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchElanlar = async () => {
      try {
        const { data, error } = await supabase
          .from('elanlar')
          .select('*')
          .order('is_vip', { ascending: false });

        if (error) throw error;
        setElanlar(data || []);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchElanlar();
  }, []);

  if (errorMsg) return <div className="p-10 text-red-500 font-mono text-xs text-center">[ SİSTEM XƏTASI: {errorMsg} ]</div>;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
      <header className="border-b border-zinc-900 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]"></div>
            <h1 className="text-xl font-black tracking-tighter italic uppercase">Elanbazarı <span className="text-green-500">NOIR</span></h1>
          </div>
          <button className="bg-white text-black px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-green-500 transition-colors">Giriş</button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="mb-10">
            <h2 className="text-4xl font-black italic uppercase leading-none">Son Elanlar</h2>
            <div className="h-1 w-20 bg-green-500 mt-4"></div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em]">[ Baza Skan Edilir ]</p>
          </div>
        ) : elanlar.length === 0 ? (
          <div className="border border-zinc-900 rounded-3xl p-20 text-center">
            <p className="text-zinc-600 font-mono text-sm uppercase tracking-widest italic">Hazırda aktiv elan tapılmadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {elanlar.map((elan) => (
              <AdCard key={elan.id} {...elan} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
