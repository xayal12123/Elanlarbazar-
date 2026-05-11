const { useState, useEffect } = React;

// 1. FIREBASE & IMGBB CONFIG (Sənin məlumatların qorunur)
const firebaseConfig = {
  apiKey: "AIzaSyDMP46oea0EhxFMrEbRClWFIt2MHT9Kccs",
  authDomain: "elan-856a5.firebaseapp.com",
  projectId: "elan-856a5",
  storageBucket: "elan-856a5.firebasestorage.app",
  messagingSenderId: "234019258715",
  appId: "1:234019258715:web:9dd195954ce65b6e5d5a7e"
};

const IMGBB_API_KEY = "01012f50423d7d208a5865ebeebbc6bc"; 

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. TAP.AZ ÜSLUBUNDA ELAN KARTI
function AdCard({ title, price, city, image_url, phone, is_vip }) {
  return (
    <div className={`bg-zinc-900 border ${is_vip ? 'border-green-500 shadow-lg shadow-green-500/10' : 'border-zinc-800'} rounded-2xl overflow-hidden flex flex-col h-full transition-transform hover:scale-[1.01]`}>
      <div className="h-44 bg-zinc-800 relative">
        <img src={image_url || 'https://via.placeholder.com/400x300'} className="w-full h-full object-cover" />
        {is_vip && <span className="absolute top-2 right-2 bg-green-500 text-black text-[10px] font-black px-2 py-0.5 rounded italic shadow-lg">VIP</span>}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-white font-bold text-sm leading-tight uppercase line-clamp-2 mb-2">{title}</h3>
        <div className="text-green-500 font-black text-xl mb-1">{price} AZN</div>
        <div className="text-zinc-500 text-[11px] font-bold uppercase mb-4">{city}</div>
        
        {/* ƏLAQƏ DÜYMƏSİ */}
        <a href={`tel:${phone || '000'}`} className="mt-auto w-full bg-white text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all text-xs uppercase italic">
          <span className="text-base">📞</span> Zəng Et
        </a>
      </div>
    </div>
  );
}

// 3. ANA APP
function App() {
  const [elanlar, setElanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Forma State-ləri
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("Bakı");
  const [phone, setPhone] = useState(""); // Yeni xana üçün state
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = db.collection("elanlar").orderBy("createdAt", "desc").onSnapshot(s => {
      setElanlar(s.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const elanPaylas = async (e) => {
    e.preventDefault();
    if(!imageFile || !phone) return alert("Nömrə və şəkil mütləqdir!");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: formData });
      const data = await res.json();
      
      await db.collection("elanlar").add({
        title,
        price: Number(price),
        city,
        phone, // Nömrəni bazaya yazırıq
        image_url: data.data.url,
        is_vip: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      setTitle(""); setPrice(""); setPhone(""); setImageFile(null);
      alert("Elan Tap.az üslubunda yayımlandı!");
    } catch (err) {
      alert("Xəta: " + err.message);
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-sans">
      <header className="p-6 border-b border-zinc-900 bg-black/80 backdrop-blur sticky top-0 z-50">
        <h1 className="text-2xl font-black italic tracking-tighter text-center">ELANBAZARI <span className="text-green-500 font-bold">NOIR</span></h1>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        {/* ELAN FORMASI */}
        <section className="mb-16 bg-zinc-950 border border-zinc-800 p-8 rounded-[2rem]">
          <h2 className="text-lg font-black uppercase italic mb-6 text-green-500">Məlumatları Doldur</h2>
          <form onSubmit={elanPaylas} className="space-y-4">
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Elanın adı (məs: iPhone 15 Pro)" className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500 text-white" />
            <div className="grid grid-cols-2 gap-4">
              <input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Qiymət" className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500 text-white" />
              <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Nömrə (məs: 050XXXXXXX)" className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500 text-white text-green-500 font-bold" />
            </div>
            <input required value={city} onChange={e => setCity(e.target.value)} placeholder="Şəhər" className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500 text-white" />
            
            <div className="relative border-2 border-dashed border-zinc-800 bg-zinc-900/30 p-8 rounded-2xl cursor-pointer hover:border-green-500 transition-all text-center">
              <input required type="file" accept="image/*" id="fPicker" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
              <label htmlFor="fPicker" className="cursor-pointer">
                <span className="text-2xl block mb-2">📸</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase">{imageFile ? imageFile.name : "Şəkil seçin"}</span>
              </label>
            </div>

            <button disabled={uploading} className="w-full bg-green-500 text-black font-black py-5 rounded-2xl uppercase italic shadow-lg active:scale-95 transition-all">
              {uploading ? "PAYLAŞILIR..." : "ELANI YERLƏŞDİR"}
            </button>
          </form>
        </section>

        <h2 className="text-3xl font-black uppercase italic mb-10 border-l-4 border-green-500 pl-4">Son Elanlar</h2>
        
        {loading ? (
          <div className="text-center py-20 animate-pulse text-zinc-800 font-black">YÜKLƏNİR...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elanlar.map(e => <AdCard key={e.id} {...e} />)}
          </div>
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
