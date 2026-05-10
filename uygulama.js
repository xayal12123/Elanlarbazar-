const { useState, useEffect } = React;

const supabaseUrl = 'https://sjbaxzgkmrzyirhxbgxi.supabase.co';
const supabaseKey = 'Sb_publishable_fjwitosjQ02wGWXrpoJ19g_KzppuTlb';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

function AdCard({ title, price, city, image_url, is_vip }) {
  return (
    <div className={`relative bg-zinc-900 border ${is_vip ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-zinc-800'} rounded-2xl overflow-hidden`}>
      {is_vip && <div className="absolute top-3 right-3 bg-green-500 text-black text-[10px] font-black px-2 py-1 rounded-md uppercase z-10">VIP</div>}
      <div className="h-40 bg-zinc-800">
        {image_url && <img src={image_url} alt={title} className="w-full h-full object-cover opacity-90" />}
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-sm truncate uppercase tracking-tight">{title}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-green-500 font-black text-lg">{price} AZN</span>
          <span className="text-zinc-500 text-[10px] uppercase font-medium">{city}</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [elanlar, setElanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchElanlar = async () => {
      try {
        const { data, error } = await supabase.from('elanlar').select('*').order('is_vip', { ascending: false });
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

  if (errorMsg) return <div className="p-10 text-red-500 font-mono text-xs text-center">[ XƏTA: {errorMsg} ]</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 bg-black/90 p-5 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-black italic uppercase">Elanbazarı <span className="text-green-500">NOIR</span></h1>
        <button className="bg-white text-black px-5 py-2 rounded-full text-xs font-black uppercase">Giriş</button>
      </header>
      <main className="container mx-auto px-6 py-10">
        <h2 className="text-4xl font-black italic uppercase mb-10">Son Elanlar</h2>
        {loading ? (
          <div className="text-center py-20 animate-pulse text-zinc-500 font-mono">[ SKAN EDİLİR... ]</div>
        ) : elanlar.length === 0 ? (
          <div className="text-center py-20 text-zinc-600 font-mono">Hələ elan yoxdur.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {elanlar.map((elan) => <AdCard key={elan.id} {...elan} />)}
          </div>
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
