const { useState, useEffect } = React;

// 1. SUPABASE AYARLARI
const supabaseUrl = 'https://sjbaxzgkmrzyirhxbgxi.supabase.co';
const supabaseKey = 'EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqYmF6eGdrbXJ6eWlyaHhiZ3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MzMyODEsImV4cCI6MjA5NDAwOTI4MX0.6sOiieR9GHYeadYnMqEajLw2vbjKJjlzX-pQeh8c-2I';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. KART KOMPONENTİ
function AdCard({ title, price, city, image_url, is_vip }) {
  return (
    <div className={`relative bg-zinc-900 border ${is_vip ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-zinc-800'} rounded-2xl overflow-hidden`}>
      {is_vip && <div className="absolute top-2 right-2 bg-green-500 text-black text-[9px] font-black px-2 py-0.5 rounded-md uppercase z-10">VIP</div>}
      <div className="h-44 bg-zinc-800">
        {image_url ? <img src={image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[10px]">NO IMAGE</div>}
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-sm truncate uppercase tracking-tight">{title}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-green-500 font-black text-lg">{price} AZN</span>
          <span className="text-zinc-500 text-[10px] uppercase font-bold">{city}</span>
        </div>
      </div>
    </div>
  );
}

// 3. ANA SƏHİFƏ
function App() {
  const [elanlar, setElanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getData = async () => {
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
    getData();
  }, []);

  if (errorMsg) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono text-[10px] p-10 uppercase text-center border border-red-900 m-4 rounded-2xl tracking-[0.2em]">[ XƏTA: {errorMsg} ]</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 sticky top-0 bg-black/90 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-black italic tracking-tighter">ELANBAZARI <span className="text-green-500 uppercase">Noir</span></h1>
          <button className="bg-white text-black px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">GİRİŞ</button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-10">
        <div className="mb-8 font-black italic text-3xl uppercase tracking-tighter">Son Elanlar <div className="h-1 w-12 bg-green-500 mt-2"></div></div>
        {loading ? (
          <div className="py-20 text-center animate-pulse text-zinc-600 font-mono text-[10px] tracking-[0.5em] uppercase">[ YÜKLƏNİR... ]</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {elanlar.map(e => <AdCard key={e.id} {...e} />)}
          </div>
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
