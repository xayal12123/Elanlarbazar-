const { useState, useEffect } = React;

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

// ELAN KARTI
function AdCard({ title, price, city, image_url, phone, is_vip }) {
  return (
    <div className={`bg-zinc-900 border ${is_vip ? 'border-green-500 shadow-lg shadow-green-500/10' : 'border-zinc-800'} rounded-2xl overflow-hidden flex flex-col h-full transition-transform hover:scale-[1.01]`}>
      <div className="h-44 bg-zinc-800 relative">
        <img src={image_url || 'https://via.placeholder.com/400x300'} className="w-full h-full object-cover" />
        {is_vip && <span className="absolute top-2 right-2 bg-green-500 text-black text-[10px] font-black px-2 py-0.5 rounded italic">VIP</span>}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-white font-bold text-sm uppercase mb-2 truncate">{title}</h3>
        <div className="text-green-500 font-black text-xl mb-1">{price} AZN</div>
        <div className="text-zinc-500 text-[10px] font-bold uppercase mb-4">{city}</div>
        
        {/* ZƏNG DÜYMƏSİ */}
        <a href={`tel:${phone}`} className="mt-auto w-full bg-white text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all text-[10px] uppercase italic">
          <span>📞</span> Zəng Et
        </a>
      </div>
    </div>
  );
}

function App() {
  const [elanlar, setElanlar] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("Bakı");
  const [phone, setPhone] = useState(""); 
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = db.collection("elanlar").orderBy("createdAt", "desc").onSnapshot(s => {
      setElanlar(s.docs.map(d => ({ id: d.id, ...d.data() })));
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
        phone, 
        image_url: data.data.url,
        is_vip: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      setTitle(""); setPrice(""); setPhone(""); setImageFile(null);
      alert("Elan yerləşdirildi!");
    } catch (err) { alert("Xəta: " + err.message); }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-10">
      <header className="p-6 border-b border-zinc-900 bg-black/80 sticky top-0 z-50 text-center">
        <h1 className="text-2xl font-black italic">ELANBAZARI <span className="text-green-500 font-bold">NOIR</span></h1>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <section className="mb-12 bg-zinc-950 border border-zinc-800 p-8 rounded-[2rem]">
          <h2 className="text-lg font-black uppercase italic mb-6 text-green-500">Yeni Elan</h2>
          <form onSubmit={elanPaylas} className="space-y-4">
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Model (məs: iPhone 15)" className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500 text-white" />
            <div className="grid grid-cols-2 gap-4">
              <input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Qiymət" className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500 text-white" />
              <input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Nömrə (050...)" className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500 text-green-500 font-bold" />
            </div>
            <input required value={city} onChange={e => setCity(e.target.value)} placeholder="Şəhər" className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500 text-white" />
            
            <input type="file" accept="image/*" id="f" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
            <label htmlFor="f" className="w-full block border-2 border-dashed border-zinc-800 bg-zinc-900/30 p-8 rounded-2xl cursor-pointer hover:border-green-500 text-center">
               <span className="text-xs font-bold text-zinc-500 uppercase">{imageFile ? imageFile.name : "📸 Şəkil seç"}</span>
            </label>

            <button disabled={uploading} className="w-full bg-green-500 text-black font-black py-5 rounded-2xl uppercase italic active:scale-95 transition-all">
              {uploading ? "PAYLAŞILIR..." : "ELANI CANLIYA AT"}
            </button>
          </form>
        </section>

        <h2 className="text-3xl font-black uppercase italic mb-8 border-l-4 border-green-500 pl-4">Son Elanlar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elanlar.map(e => <AdCard key={e.id} {...e} />)}
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
