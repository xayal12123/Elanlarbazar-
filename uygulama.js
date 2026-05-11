const { useState, useEffect } = React;

const firebaseConfig = {
  apiKey: "AIzaSyDMP46oea0EhxFMrEbRClWFIt2MHT9Kccs",
  authDomain: "elan-856a5.firebaseapp.com",
  projectId: "elan-856a5",
  storageBucket: "elan-856a5.firebasestorage.app",
  messagingSenderId: "234019258715",
  appId: "1:234019258715:web:9dd195954ce65b6e5d5a7e"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// SƏNİN IMGBB AÇARIN
const IMGBB_API_KEY = "01012f50423d7d208a5865ebeebbc6bc"; 

function AdCard({ title, price, city, image_url, is_vip }) {
  return (
    <div className={`bg-zinc-900 border ${is_vip ? 'border-green-500' : 'border-zinc-800'} rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-[1.02]`}>
      <div className="h-48 bg-zinc-800">
        <img src={image_url || 'https://via.placeholder.com/400x300?text=Yuklenir...'} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-sm truncate uppercase">{title}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-green-500 font-black text-xl">{price} AZN</span>
          <span className="text-zinc-500 text-[10px] uppercase font-bold">{city}</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [elanlar, setElanlar] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("Bakı");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Elanları qiymətə görə yox, yaradılma vaxtına görə düzürük (ən yeni yuxarıda)
    const unsubscribe = db.collection("elanlar").orderBy("createdAt", "desc").onSnapshot(s => {
      setElanlar(s.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const elanPaylas = async (e) => {
    e.preventDefault();
    if(!imageFile) return alert("Zəhmət olmasa bir şəkil seçin!");
    setUploading(true);

    try {
      // 1. Şəkli ImgBB-yə yükləyirik
      const formData = new FormData();
      formData.append("image", imageFile);
      
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      
      if(!data.success) throw new Error("Şəkil yüklənə bilmədi.");
      const finalImageUrl = data.data.url;

      // 2. Məlumatları Firebase-ə yazırıq
      await db.collection("elanlar").add({
        title,
        price: Number(price),
        city,
        image_url: finalImageUrl,
        is_vip: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Formanı təmizləyirik
      setTitle(""); setPrice(""); setImageFile(null);
      alert("Təbriklər! Elanınız dərhal yayımlandı.");
    } catch (err) {
      alert("Xəta: " + err.message);
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <header className="p-6 border-b border-zinc-900 bg-black/50 backdrop-blur sticky top-0 z-50">
        <h1 className="text-2xl font-black italic tracking-tighter">ELANBAZARI <span className="text-green-500 font-bold">NOIR</span></h1>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        {/* YENİ ELAN FORMASI */}
        <section className="mb-16 bg-zinc-950 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-xl font-black uppercase italic mb-6 text-green-500">Sürətli Elan Paylaş</h2>
          <form onSubmit={elanPaylas} className="space-y-4">
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Maşın Modeli (məs: Mercedes E200)" className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-green-500 transition-all text-white" />
            <div className="grid grid-cols-2 gap-4">
              <input required type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Qiymət (AZN)" className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-green-500 text-white" />
              <input required value={city} onChange={e => setCity(e.target.value)} placeholder="Şəhər" className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl outline-none focus:border-green-500 text-white" />
            </div>

            {/* QALEREYADAN SEÇİM HİSSƏSİ */}
            <div className="relative">
              <input required type="file" accept="image/*" id="filePicker" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
              <label htmlFor="filePicker" className="w-full flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 bg-zinc-900/50 p-10 rounded-3xl cursor-pointer hover:border-green-500 hover:bg-zinc-900 transition-all">
                <span className="text-3xl mb-2">📸</span>
                <span className="text-xs font-bold text-zinc-500 uppercase">
                  {imageFile ? `SEÇİLDİ: ${imageFile.name.substring(0, 15)}...` : "Qalereyadan Şəkil Seç"}
                </span>
              </label>
            </div>

            <button disabled={uploading} type="submit" className="w-full bg-green-500 text-black font-black py-5 rounded-2xl hover:bg-green-400 transition-all uppercase italic shadow-[0_10px_30px_-10px_rgba(34,197,94,0.6)] disabled:opacity-50">
              {uploading ? "SİSTEMƏ YÜKLƏNİR..." : "ELANI CANLIYA AT"}
            </button>
          </form>
        </section>

        <h2 className="text-3xl font-black uppercase italic mb-8 border-l-4 border-green-500 pl-4">Son Elanlar</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {elanlar.length > 0 ? elanlar.map(e => <AdCard key={e.id} {...e} />) : <div className="text-zinc-800 font-black py-10 uppercase tracking-[0.2em]">Hələ ki, elan yoxdur...</div>}
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
