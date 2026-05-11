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

// ŞƏKİLLƏRƏ ƏSASƏN TAM ANALİZ EDİLMİŞ TAP.AZ KATALOQU
const FULL_CATALOG = {
  "Elektronika": { 
    subs: ["Audio və video", "Kompüter aksesuarları", "Telefonlar", "Noutbuklar", "Televizorlar"],
    brands: ["Apple iPhone", "Samsung", "Honor", "Xiaomi", "Google", "Honor", "Nokia", "Motorola", "Huawei"] 
  },
  "Nəqliyyat": { 
    subs: ["Avtomobillər", "Ehtiyat hissələri", "Motosikletlər", "Yük maşınları", "Avtobuslar", "Qeydiyyat nişanları"],
    params: ["year", "mileage"]
  },
  "Daşınmaz əmlak": { 
    subs: ["Mənzillər", "Həyət evləri / Villalar", "Torpaq sahələri", "Ofislər", "Qarajlar", "Xaricdə əmlak"],
    params: ["area", "rooms"]
  },
  "Ev və bağ üçün": { 
    subs: ["Mebel", "Məişət texnikası", "Təmir və tikinti", "Qab-qacaq", "Bitkilər", "Ev tekstili", "Dekor və interyer"] 
  },
  "Xidmətlər": { 
    subs: ["Təmir", "Nəqliyyat", "Tədris", "Tibbi xidmətlər", "Hüquq xidmətləri"] 
  },
  "Şəxsi əşyalar": { 
    subs: ["Geyim", "Ayaqqabı", "Saatlar", "Zinət əşyaları", "Gözəllik"] 
  },
  "Hobbi və asudə": { 
    subs: ["Velosipedlər", "İdman malları", "Kitablar", "Musiqi alətləri", "Kolleksiya", "Tanışlıq"] 
  }
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function AdCard({ data }) {
  const { title, price, city, image_url, phone, description, mainCat, subCat, year, mileage, area, rooms, brand } = data;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:border-green-500/50 transition-all shadow-2xl group">
      <div className="h-48 bg-zinc-800 relative">
        <img src={image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            <span className="bg-black/80 backdrop-blur-md text-[7px] text-white px-3 py-1.5 rounded-full uppercase font-black border border-white/5">{mainCat}</span>
            <span className="bg-green-500 text-[7px] text-black px-2.5 py-1 rounded-full uppercase font-black">{subCat}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-green-500 font-black text-2xl mb-1">{price} AZN</div>
        <h3 className="text-white font-bold text-xs uppercase mb-3 truncate leading-tight tracking-tight">{title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
            {brand && <span className="bg-zinc-800 text-zinc-400 text-[8px] px-2 py-1 rounded-md font-bold uppercase">🏷️ {brand}</span>}
            {year && <span className="bg-zinc-800 text-zinc-400 text-[8px] px-2 py-1 rounded-md font-bold uppercase">📅 {year} il</span>}
            {mileage && <span className="bg-zinc-800 text-zinc-400 text-[8px] px-2 py-1 rounded-md font-bold uppercase">🛣️ {mileage} km</span>}
            {area && <span className="bg-zinc-800 text-zinc-400 text-[8px] px-2 py-1 rounded-md font-bold uppercase">📐 {area} m²</span>}
            {rooms && <span className="bg-zinc-800 text-zinc-400 text-[8px] px-2 py-1 rounded-md font-bold uppercase">🚪 {rooms} otaq</span>}
        </div>

        <p className="text-zinc-500 text-[10px] line-clamp-2 mb-6 leading-relaxed italic border-l-2 border-zinc-800 pl-3">{description}</p>
        
        <div className="mt-auto flex flex-col gap-3">
            <div className="text-zinc-600 text-[9px] font-black uppercase italic tracking-widest">📍 {city}</div>
            <a href={`tel:${phone}`} className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-500 transition-all text-[10px] uppercase italic tracking-widest shadow-xl">
              📞 ƏLAQƏ SAXLA
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
  const [formData, setFormData] = useState({ 
    title: "", price: "", city: "Bakı", phone: "", description: "", 
    mainCat: "Elektronika", subCat: "", brand: "", year: "", mileage: "", area: "", rooms: "" 
  });

  useEffect(() => {
    let query = db.collection("elanlar").orderBy("createdAt", "desc");
    if (selectedMainCat !== "Hamısı") query = query.where("mainCat", "==", selectedMainCat);
    const unsubscribe = query.onSnapshot(s => setElanlar(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsubscribe();
  }, [selectedMainCat]);

  const elanPaylas = async (e) => {
    e.preventDefault();
    if(!imageFile || !formData.subCat) return alert("Kateqoriya və şəkil vacibdir!");
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", imageFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: fd });
      const img = await res.json();
      await db.collection("elanlar").add({ ...formData, price: Number(formData.price), image_url: img.data.url, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      setFormData({...formData, title:"", price:"", phone:"", description:""});
      setImageFile(null);
      alert("Elan peşəkar Tap.az kataloq sisteminə yerləşdirildi!");
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20 selection:bg-green-500 selection:text-black">
      <header className="p-6 border-b border-zinc-900 bg-black/95 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
        <h1 className="text-xl font-black italic text-center mb-6 tracking-tighter">ELANBAZARI <span className="text-green-500 font-bold tracking-normal">NOIR</span></h1>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar max-w-5xl mx-auto px-2">
            <button onClick={() => setSelectedMainCat("Hamısı")} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase transition-all border ${selectedMainCat === "Hamısı" ? 'bg-green-500 text-black border-green-500' : 'bg-zinc-900 text-zinc-600 border-zinc-800'}`}>Hamısı</button>
            {Object.keys(FULL_CATALOG).map(cat => (
                <button key={cat} onClick={() => setSelectedMainCat(cat)} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase transition-all whitespace-nowrap border ${selectedMainCat === cat ? 'bg-green-500 text-black border-green-500' : 'bg-zinc-900 text-zinc-600 border-zinc-800'}`}>{cat}</button>
            ))}
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        <section className="mb-16 bg-zinc-950 border border-zinc-900 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
          <h2 className="text-lg font-black uppercase italic mb-10 text-green-500 tracking-widest border-l-4 border-green-500 pl-4">PEŞƏKAR ELAN FORMASI</h2>
          
          <form onSubmit={elanPaylas} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-700 uppercase ml-4 tracking-widest">Kataloq</label>
                    <select required value={formData.mainCat} onChange={e => setFormData({...formData, mainCat: e.target.value, subCat: "", brand: ""})} className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-3xl outline-none focus:border-green-500 font-bold uppercase text-[10px] shadow-inner transition-all appearance-none cursor-pointer">
                        {Object.keys(FULL_CATALOG).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-700 uppercase ml-4 tracking-widest">Alt Bölmə</label>
                    <select required value={formData.subCat} onChange={e => setFormData({...formData, subCat: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-3xl outline-none focus:border-green-500 font-bold uppercase text-[10px] text-green-500 shadow-inner appearance-none cursor-pointer">
                        <option value="">Seçim edin...</option>
                        {FULL_CATALOG[formData.mainCat].subs.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>
            </div>

            {/* DİNAMİK BREND SEÇİMİ (Telefonlar üçün) */}
            {formData.subCat === "Telefonlar" && (
                <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-700 uppercase ml-4 tracking-widest">Marka (Apple, Honor, və s.)</label>
                    <select required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-3xl outline-none focus:border-green-500 font-bold uppercase text-[10px] text-white appearance-none cursor-pointer">
                        <option value="">Brendi seçin...</option>
                        {FULL_CATALOG["Elektronika"].brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                </div>
            )}

            {/* SPESİFİK PARAMETRLƏR (İl, KM, m²) */}
            <div className="grid grid-cols-2 gap-8">
                {FULL_CATALOG[formData.mainCat].params?.includes("year") && (
                    <><input type="number" placeholder="İl" onChange={e => setFormData({...formData, year: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl outline-none focus:border-green-500 text-sm" />
                    <input type="number" placeholder="KM" onChange={e => setFormData({...formData, mileage: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl outline-none focus:border-green-500 text-sm" /></>
                )}
                {FULL_CATALOG[formData.mainCat].params?.includes("area") && (
                    <><input type="number" placeholder="Sahə (m²)" onChange={e => setFormData({...formData, area: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl outline-none focus:border-green-500 text-sm" />
                    <input type="number" placeholder="Otaq" onChange={e => setFormData({...formData, rooms: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl outline-none focus:border-green-500 text-sm" /></>
                )}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Qiymət" className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl outline-none focus:border-green-500 font-black text-green-500 text-lg shadow-inner" />
              <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="050XXXXXXX" className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl outline-none focus:border-green-500 font-black text-sm shadow-inner italic" />
            </div>

            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Məhsul haqqında ətraflı məlumat..." className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] outline-none focus:border-green-500 h-32 resize-none text-sm shadow-inner transition-all"></textarea>

            <label className="w-full block border-2 border-dashed border-zinc-800 bg-zinc-900/10 p-14 rounded-[3.5rem] cursor-pointer hover:border-green-500 transition-all text-center group active:scale-95 shadow-2xl shadow-black/50">
                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] group-hover:text-green-500 transition-all">{imageFile ? "✓ Şəkil Hazırdır" : "📸 Şəkil yüklə"}</span>
            </label>

            <button disabled={uploading} className="w-full bg-green-500 text-black font-black py-7 rounded-[3.5rem] uppercase italic active:scale-[0.98] transition-all shadow-[0_20px_40px_-15px_rgba(34,197,94,0.4)] disabled:opacity-50 tracking-widest">
              {uploading ? "PROSES GEDİR..." : "ELANI DƏRHAL YAYIMLA"}
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {elanlar.map(e => <AdCard key={e.id} data={e} />)}
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
