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

// HƏR KATEQORİYA ÜÇÜN ÖZƏL ŞƏKİLLİ İKONLAR (PROFESSIONAL)
const TITAN_PRO_CATALOG = {
  "Elektronika": { 
    img: "https://cdn-icons-png.flaticon.com/512/3659/3659899.png", 
    subs: ["Telefonlar", "Apple iPhone", "Planşetlər", "Noutbuklar", "Audio və video"] 
  },
  "Nəqliyyat": { 
    img: "https://cdn-icons-png.flaticon.com/512/741/741407.png", 
    subs: ["Avtomobillər", "Ehtiyat hissələri", "Motosikletlər", "Yük maşınları"] 
  },
  "Daşınmaz əmlak": { 
    img: "https://cdn-icons-png.flaticon.com/512/602/602277.png", 
    subs: ["Mənzillər", "Həyət evləri", "Torpaq", "Ofislər", "Qarajlar"] 
  },
  "Məişət texnikası": { 
    img: "https://cdn-icons-png.flaticon.com/512/2800/2800412.png", 
    subs: ["Soyuducular", "Paltaryuyanlar", "Tozsoranlar", "Kondisionerlər"] 
  },
  "Ev və bağ üçün": { 
    img: "https://cdn-icons-png.flaticon.com/512/2722/2722100.png", 
    subs: ["Mebellər", "Təmir materialları", "Bitkilər", "Dekor"] 
  },
  "Şəxsi əşyalar": { 
    img: "https://cdn-icons-png.flaticon.com/512/3050/3050239.png", 
    subs: ["Geyim", "Saatlar", "Zinət əşyaları", "Ayaqqabılar"] 
  },
  "Uşaq aləmi": { 
    img: "https://cdn-icons-png.flaticon.com/512/3082/3082060.png", 
    subs: ["Oyuncaqlar", "Uşaq geyimi", "Uşaq arabaları", "Məktəblilər üçün"] 
  },
  "Heyvanlar": { 
    img: "https://cdn-icons-png.flaticon.com/512/616/616408.png", 
    subs: ["İtlər", "Pişiklər", "Quşlar", "Atlar", "K/t heyvanları"] 
  },
  "Xidmətlər": { 
    img: "https://cdn-icons-png.flaticon.com/512/1066/1066371.png", 
    subs: ["Təmir", "Nəqliyyat xidməti", "Tədris", "İT xidmətləri"] 
  },
  "İş elanları": { 
    img: "https://cdn-icons-png.flaticon.com/512/3281/3281289.png", 
    subs: ["Vakansiyalar", "İş axtarıram"] 
  }
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function AdCard({ data }) {
  const { title, price, city, image_url, phone, description, mainCat, subCat, year, mileage, area, rooms } = data;
  return (
    <div className="bg-[#111] border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:border-green-500/50 transition-all shadow-2xl group">
      <div className="h-52 bg-zinc-800 relative">
        <img src={image_url} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <img src={TITAN_PRO_CATALOG[mainCat]?.img} className="w-4 h-4 object-contain" />
                <span className="text-[7px] text-white uppercase font-black">{mainCat}</span>
            </div>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-green-500 font-black text-3xl mb-1">{price} AZN</div>
        <h3 className="text-white font-bold text-sm uppercase mb-3 truncate tracking-tighter">{title}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
            {year && <span className="bg-zinc-800/50 text-zinc-400 text-[8px] px-2 py-1 rounded font-bold uppercase tracking-widest">📅 {year}</span>}
            {mileage && <span className="bg-zinc-800/50 text-zinc-400 text-[8px] px-2 py-1 rounded font-bold uppercase tracking-widest">🛣️ {mileage} km</span>}
            {area && <span className="bg-zinc-800/50 text-zinc-400 text-[8px] px-2 py-1 rounded font-bold uppercase tracking-widest">📐 {area} m²</span>}
        </div>

        <p className="text-zinc-500 text-[11px] line-clamp-2 mb-6 leading-relaxed italic border-l-2 border-zinc-800 pl-4">{description}</p>
        
        <div className="mt-auto pt-4 border-t border-zinc-800/50 flex flex-col gap-3">
            <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em] italic">📍 {city}</span>
            <a href={`tel:${phone}`} className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-500 transition-all text-xs uppercase italic tracking-wider">
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
  const [formData, setFormData] = useState({ title: "", price: "", city: "Bakı", phone: "", description: "", mainCat: "Elektronika", subCat: "", year: "", mileage: "", area: "", rooms: "" });

  useEffect(() => {
    let query = db.collection("elanlar").orderBy("createdAt", "desc");
    if (selectedMainCat !== "Hamısı") query = query.where("mainCat", "==", selectedMainCat);
    const unsubscribe = query.onSnapshot(s => setElanlar(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsubscribe();
  }, [selectedMainCat]);

  const elanPaylas = async (e) => {
    e.preventDefault();
    if(!imageFile || !formData.subCat) return alert("Bütün sahələri doldurun!");
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", imageFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: fd });
      const img = await res.json();
      await db.collection("elanlar").add({ ...formData, price: Number(formData.price), image_url: img.data.url, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      setFormData({...formData, title:"", price:"", phone:"", description:"", subCat:"", year:"", mileage:"", area:"", rooms:""});
      setImageFile(null);
      alert("Elan peşəkar şəkildə bazaya əlavə edildi!");
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20 selection:bg-green-500">
      <header className="p-8 border-b border-zinc-900 bg-black/95 backdrop-blur-2xl sticky top-0 z-50">
        <h1 className="text-2xl font-black italic text-center mb-8 tracking-tighter uppercase underline decoration-green-500/50 decoration-8 underline-offset-[12px]">ELANBAZARI <span className="text-green-500 font-bold tracking-normal">NOIR</span></h1>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar max-w-6xl mx-auto px-4">
            <button onClick={() => setSelectedMainCat("Hamısı")} className={`flex flex-col items-center gap-3 p-4 min-w-[100px] rounded-3xl transition-all border ${selectedMainCat === "Hamısı" ? 'bg-green-500 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-zinc-950 border-zinc-800'}`}>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl font-black">ALL</div>
                <span className={`text-[10px] font-black uppercase ${selectedMainCat === "Hamısı" ? 'text-black' : 'text-zinc-500'}`}>HƏR ŞEY</span>
            </button>
            {Object.keys(TITAN_PRO_CATALOG).map(cat => (
                <button key={cat} onClick={() => setSelectedMainCat(cat)} className={`flex flex-col items-center gap-3 p-4 min-w-[100px] rounded-3xl transition-all border ${selectedMainCat === cat ? 'bg-green-500 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                    <img src={TITAN_PRO_CATALOG[cat].img} className={`w-12 h-12 object-contain ${selectedMainCat === cat ? 'brightness-0' : 'brightness-100'}`} />
                    <span className={`text-[10px] font-black uppercase whitespace-nowrap ${selectedMainCat === cat ? 'text-black' : 'text-zinc-500'}`}>{cat}</span>
                </button>
            ))}
        </div>
      </header>

      <main className="p-8 max-w-6xl mx-auto">
        <section className="mb-20 bg-[#0a0a0a] border border-zinc-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/10 blur-[120px] rounded-full group-hover:bg-green-500/20 transition-all duration-1000"></div>
          <h2 className="text-2xl font-black uppercase italic mb-12 text-green-500 tracking-[0.2em] border-l-8 border-green-500 pl-6">Professional İdarə Paneli</h2>
          
          <form onSubmit={elanPaylas} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-600 uppercase tracking-widest ml-4">Əsas Kataloq</label>
                    <select required value={formData.mainCat} onChange={e => setFormData({...formData, mainCat: e.target.value, subCat: ""})} className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-black uppercase text-xs appearance-none cursor-pointer">
                        {Object.keys(TITAN_PRO_CATALOG).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-600 uppercase tracking-widest ml-4">Alt Bölmə</label>
                    <select required value={formData.subCat} onChange={e => setFormData({...formData, subCat: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-black uppercase text-xs text-green-500 appearance-none cursor-pointer">
                        <option value="">Seçim edin...</option>
                        {TITAN_PRO_CATALOG[formData.mainCat].subs.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-600 uppercase tracking-widest ml-4">Qiymət (AZN)</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-black text-green-500 text-2xl shadow-inner" />
                </div>
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-600 uppercase tracking-widest ml-4">Əlaqə Nömrəsi</label>
                    <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+994" className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-black text-xl italic text-white" />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[11px] font-black text-zinc-600 uppercase tracking-widest ml-4">Elanın Başlığı</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Məsələn: Mercedes S-Class 2024" className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-bold text-lg" />
            </div>

            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Məhsul haqqında tam professional təsvir yazın..." className="w-full bg-zinc-900 border border-zinc-800 p-10 rounded-[3.5rem] outline-none focus:border-green-500 h-48 resize-none text-base leading-relaxed"></textarea>

            <label className="w-full block border-4 border-dashed border-zinc-800 bg-zinc-900/10 p-24 rounded-[4rem] cursor-pointer hover:border-green-500 transition-all text-center group active:scale-95 shadow-2xl">
                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                <span className="text-xs font-black text-zinc-700 uppercase tracking-[0.6em] group-hover:text-green-500 transition-all duration-500">{imageFile ? "✓ SİSTEMƏ YÜKLƏNİLDİ" : "📸 PROFESSIONAL FOTO SEÇ"}</span>
            </label>

            <button disabled={uploading} className="w-full bg-green-500 text-black font-black py-8 rounded-[4rem] uppercase italic active:scale-[0.98] transition-all shadow-[0_30px_60px_-15px_rgba(34,197,94,0.5)] disabled:opacity-50 tracking-[0.4em] text-lg">
              {uploading ? "BAZAYA YAZILIR..." : "YENİ ELANI CANLIYA AT"}
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
