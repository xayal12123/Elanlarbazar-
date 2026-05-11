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

// HƏR KATEQORİYA ÜÇÜN REAL PEŞƏKAR ŞƏKİLLƏR
const TITAN_PRO_CATALOG = {
  "Elektronika": { 
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=150&q=80", 
    subs: ["Telefonlar", "Apple iPhone", "Planşetlər", "Noutbuklar", "Audio və video"] 
  },
  "Nəqliyyat": { 
    img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=150&q=80", 
    subs: ["Avtomobillər", "Ehtiyat hissələri", "Motosikletlər", "Yük maşınları"] 
  },
  "Daşınmaz əmlak": { 
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=150&q=80", 
    subs: ["Mənzillər", "Həyət evləri", "Torpaq", "Ofislər", "Qarajlar"] 
  },
  "Məişət texnikası": { 
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=150&q=80", 
    subs: ["Soyuducular", "Paltaryuyanlar", "Tozsoranlar", "Kondisionerlər"] 
  },
  "Ev və bağ üçün": { 
    img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=150&q=80", 
    subs: ["Mebellər", "Təmir materialları", "Bitkilər", "Dekor"] 
  },
  "Şəxsi əşyalar": { 
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80", 
    subs: ["Geyim", "Saatlar", "Zinət əşyaları", "Ayaqqabılar"] 
  },
  "Uşaq aləmi": { 
    img: "https://images.unsplash.com/photo-1515488764276-38520b212896?auto=format&fit=crop&w=150&q=80", 
    subs: ["Oyuncaqlar", "Uşaq geyimi", "Uşaq arabaları", "Məktəblilər üçün"] 
  },
  "Heyvanlar": { 
    img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80", 
    subs: ["İtlər", "Pişiklər", "Quşlar", "Atlar", "K/t heyvanları"] 
  },
  "Xidmətlər": { 
    img: "https://images.unsplash.com/photo-1454165833767-1390e44a17d5?auto=format&fit=crop&w=150&q=80", 
    subs: ["Təmir", "Nəqliyyat xidməti", "Tədris", "İT xidmətləri"] 
  },
  "İş elanları": { 
    img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=150&q=80", 
    subs: ["Vakansiyalar", "İş axtarıram"] 
  }
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function AdCard({ data }) {
  const { title, price, city, image_url, phone, description, mainCat, subCat } = data;
  return (
    <div className="bg-[#111] border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:border-green-500/50 transition-all shadow-2xl group">
      <div className="h-52 bg-zinc-800 relative">
        <img src={image_url} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full overflow-hidden border border-green-500">
                    <img src={TITAN_PRO_CATALOG[mainCat]?.img} className="w-full h-full object-cover" />
                </div>
                <span className="text-[7px] text-white uppercase font-black">{mainCat}</span>
            </div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-green-500 font-black text-2xl mb-1">{price} AZN</div>
        <h3 className="text-white font-bold text-sm uppercase mb-3 truncate tracking-tighter">{title}</h3>
        <p className="text-zinc-500 text-[10px] line-clamp-2 mb-6 leading-relaxed border-l-2 border-zinc-800 pl-4">{description}</p>
        <div className="mt-auto pt-4 border-t border-zinc-800/50 flex flex-col gap-3">
            <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] italic">📍 {city}</span>
            <a href={`tel:${phone}`} className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center hover:bg-green-500 transition-all text-xs uppercase italic">
               ZƏNG ET
            </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [elanlar, setElanlar] = useState([]);
  const [selectedMainCat, setSelectedMainCat] = useState("Hamısı");
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({ title: "", price: "", city: "Bakı", phone: "", description: "", mainCat: "Elektronika", subCat: "" });

  useEffect(() => {
    let query = db.collection("elanlar").orderBy("createdAt", "desc");
    if (selectedMainCat !== "Hamısı") query = query.where("mainCat", "==", selectedMainCat);
    const unsubscribe = query.onSnapshot(s => setElanlar(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsubscribe();
  }, [selectedMainCat]);

  const elanPaylas = async (e) => {
    e.preventDefault();
    if(!imageFile || !formData.subCat) return alert("Kateqoriya seçin!");
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", imageFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: fd });
      const img = await res.json();
      await db.collection("elanlar").add({ ...formData, price: Number(formData.price), image_url: img.data.url, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      setFormData({...formData, title:"", price:"", phone:"", description:"", subCat:""});
      setImageFile(null);
      alert("Elan paylaşıldı!");
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20 selection:bg-green-500">
      <header className="p-8 border-b border-zinc-900 bg-black/95 backdrop-blur-2xl sticky top-0 z-50">
        <h1 className="text-2xl font-black italic text-center mb-8 tracking-tighter uppercase text-white">ELANBAZARI <span className="text-green-500">NOIR</span></h1>
        
        {/* ŞƏKİLLİ ANA MENYU */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar max-w-6xl mx-auto px-4">
            <button onClick={() => setSelectedMainCat("Hamısı")} className={`flex flex-col items-center gap-3 p-4 min-w-[110px] rounded-3xl transition-all border ${selectedMainCat === "Hamısı" ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20' : 'bg-zinc-950 border-zinc-800'}`}>
                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-xs font-black text-white">ALL</div>
                <span className={`text-[9px] font-black uppercase ${selectedMainCat === "Hamısı" ? 'text-black' : 'text-zinc-500'}`}>HAMISI</span>
            </button>
            {Object.keys(TITAN_PRO_CATALOG).map(cat => (
                <button key={cat} onClick={() => setSelectedMainCat(cat)} className={`flex flex-col items-center gap-3 p-4 min-w-[110px] rounded-3xl transition-all border ${selectedMainCat === cat ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-800">
                        <img src={TITAN_PRO_CATALOG[cat].img} className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-[9px] font-black uppercase whitespace-nowrap ${selectedMainCat === cat ? 'text-black' : 'text-zinc-500'}`}>{cat}</span>
                </button>
            ))}
        </div>
      </header>

      <main className="p-8 max-w-6xl mx-auto">
        <section className="mb-20 bg-[#0a0a0a] border border-zinc-800 p-12 rounded-[4rem] shadow-2xl">
          <h2 className="text-2xl font-black uppercase italic mb-12 text-green-500 tracking-widest border-l-8 border-green-500 pl-6">PROFESSIONAL PANEL</h2>
          
          <form onSubmit={elanPaylas} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <select required value={formData.mainCat} onChange={e => setFormData({...formData, mainCat: e.target.value, subCat: ""})} className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-black uppercase text-xs text-white">
                    {Object.keys(TITAN_PRO_CATALOG).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select required value={formData.subCat} onChange={e => setFormData({...formData, subCat: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-black uppercase text-xs text-green-500">
                    <option value="">Alt bölməni seçin...</option>
                    {TITAN_PRO_CATALOG[formData.mainCat].subs.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                </select>
            </div>

            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Məhsulun adı" className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-bold text-lg text-white" />

            <div className="grid grid-cols-2 gap-10">
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Qiymət (AZN)" className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-black text-green-500 text-2xl" />
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Nömrə (+994)" className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-black text-xl italic text-white" />
            </div>

            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Təsvir yazın..." className="w-full bg-zinc-900 border border-zinc-800 p-10 rounded-[3.5rem] outline-none focus:border-green-500 h-48 resize-none text-white leading-relaxed"></textarea>

            <label className="w-full block border-4 border-dashed border-zinc-800 bg-zinc-900/10 p-24 rounded-[4rem] cursor-pointer hover:border-green-500 transition-all text-center group active:scale-95">
                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                <span className="text-xs font-black text-zinc-700 uppercase tracking-[0.6em] group-hover:text-green-500">{imageFile ? "✓ FOTO HAZIRDIR" : "📸 FOTO SEÇ"}</span>
            </label>

            <button disabled={uploading} className="w-full bg-green-500 text-black font-black py-8 rounded-[4rem] uppercase italic shadow-2xl tracking-[0.4em] text-lg active:scale-95 transition-all">
              {uploading ? "PROSES GEDİR..." : "ELANI YAYIMLA"}
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {elanlar.map(e => <AdCard key={e.id} data={e} />)}
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
