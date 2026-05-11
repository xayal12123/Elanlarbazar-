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

// ŞƏKİLLƏRDƏN ANALİZ EDİLMİŞ TAM KATALOQ VƏ REAL ŞƏKİLLƏR
const MASTER_CATALOG = {
  "Elektronika": { 
    img: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=300&auto=format&fit=crop", 
    subs: ["Telefonlar", "Apple iPhone", "Planşetlər", "Noutbuklar", "Kompüter avadanlığı", "Audio və video", "Oyun konsolları", "Televizorlar", "Foto-aparatlar"] 
  },
  "Nəqliyyat": { 
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=300&auto=format&fit=crop", 
    subs: ["Avtomobillər", "Ehtiyat hissələri", "Aksesuarlar", "Motosikletlər və mopedlər", "Avtobuslar", "Yük maşınları", "Tikinti texnikası", "Aqrotexnika", "Su nəqliyyatı"] 
  },
  "Daşınmaz əmlak": { 
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=300&auto=format&fit=crop", 
    subs: ["Mənzillər", "Həyət evləri, bağ evləri", "Torpaq sahələri", "Obyektlər və ofislər", "Qarajlar", "Xaricdə əmlak"] 
  },
  "Məişət texnikası": { 
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop", 
    subs: ["Soyuducular", "Paltaryuyanlar", "Tozsoranlar", "Mətbəx kombaynları", "Mikrodalğalı sobalar", "Kondisionerlər", "Tikiş maşınları", "Süd separatorları", "Tərəzilər", "Su dispenserləri", "Termometrlər"] 
  },
  "Uşaq aləmi": { 
    img: "https://images.unsplash.com/photo-1515488764276-38520b212896?q=80&w=300&auto=format&fit=crop", 
    subs: ["Oyuncaqlar", "Uşaq geyimi", "Uşaq arabaları", "Uşaq mebeli", "Avtomobil oturacaqları", "Yürütəclər", "Manejlər", "Çarpayılar və beşiklər", "Uşaq qidası", "Hammam və gigiyena"] 
  },
  "Məktəblilər üçün": { 
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300&auto=format&fit=crop", 
    subs: ["Dəftərxana ləvazimatları", "Dərsliklər", "Məktəbli çantaları", "Məktəbli forması", "Yaradıcılıq ləvazimatları"] 
  },
  "Heyvanlar": { 
    img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=300&auto=format&fit=crop", 
    subs: ["İtlər", "Pişiklər", "Quşlar", "Akvariumlar", "Atlar", "Dovşanlar", "Gəmiricilər", "K/t heyvanları", "Heyvanlar üçün məhsullar"] 
  },
  "Şəxsi əşyalar": { 
    img: "https://images.unsplash.com/photo-1445205170230-053b830c6050?q=80&w=300&auto=format&fit=crop", 
    subs: ["Geyim və ayaqqabı", "Saatlar", "Zinət əşyaları", "Aksesuarlar", "Sağlamlıq və gözəllik"] 
  },
  "Ev və bağ üçün": { 
    img: "https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?q=80&w=300&auto=format&fit=crop", 
    subs: ["Mebellər", "Təmir materialları", "Qab-qacaq", "Bitkilər", "Xalçalar", "İşıqlandırma", "Dekor", "Ərzaq"] 
  },
  "Xidmətlər": { 
    img: "https://images.unsplash.com/photo-1454165833767-1390e44a17d5?q=80&w=300&auto=format&fit=crop", 
    subs: ["Təmir", "Nəqliyyat", "Tədris", "İT və dizayn", "Tibb", "Hüquq", "Təmizlik"] 
  },
  "İş elanları": { 
    img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=300&auto=format&fit=crop", 
    subs: ["Vakansiyalar", "İş axtarıram"] 
  }
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// PROFESSİONAL AD CARD
function AdCard({ data }) {
  const { title, price, city, image_url, phone, description, mainCat, subCat, year, mileage, area, rooms } = data;
  return (
    <div className="bg-[#111] border border-zinc-800 rounded-[3rem] overflow-hidden flex flex-col h-full hover:border-green-500 transition-all duration-500 shadow-2xl group">
      <div className="h-64 bg-zinc-800 relative overflow-hidden">
        <img src={image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute top-5 left-5 flex flex-col gap-2">
            <div className="bg-black/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                <img src={MASTER_CATALOG[mainCat]?.img} className="w-6 h-6 rounded-full object-cover border border-green-500" />
                <span className="text-[9px] text-white uppercase font-black tracking-widest">{mainCat}</span>
            </div>
            <span className="bg-green-500 text-black text-[8px] px-3 py-1 rounded-full font-black uppercase self-start shadow-lg shadow-green-500/20">{subCat}</span>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <div className="text-green-500 font-black text-3xl mb-2 italic">{price} AZN</div>
        <h3 className="text-white font-bold text-sm uppercase mb-4 truncate">{title}</h3>
        
        {/* SPESİFİK PARAMETRLƏR */}
        <div className="flex flex-wrap gap-2 mb-6">
            {year && <span className="bg-zinc-800 text-zinc-400 text-[9px] px-3 py-1 rounded-xl font-black uppercase tracking-tighter">📅 {year} il</span>}
            {mileage && <span className="bg-zinc-800 text-zinc-400 text-[9px] px-3 py-1 rounded-xl font-black uppercase tracking-tighter">🛣️ {mileage} km</span>}
            {area && <span className="bg-zinc-800 text-zinc-400 text-[9px] px-3 py-1 rounded-xl font-black uppercase tracking-tighter">📐 {area} m²</span>}
        </div>

        <p className="text-zinc-500 text-[11px] line-clamp-2 mb-8 leading-relaxed italic border-l-2 border-zinc-800 pl-4">{description}</p>
        
        <div className="mt-auto flex flex-col gap-4">
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">📍 {city}</span>
            <a href={`tel:${phone}`} className="w-full bg-white text-black font-black py-5 rounded-[1.5rem] flex items-center justify-center hover:bg-green-500 transition-all text-xs uppercase italic tracking-widest shadow-2xl">
               ƏLAQƏ SAXLA
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
    if(!imageFile || !formData.subCat) return alert("Kateqoriya və şəkil vacibdir!");
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", imageFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: fd });
      const img = await res.json();
      await db.collection("elanlar").add({ ...formData, price: Number(formData.price), image_url: img.data.url, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      setFormData({...formData, title:"", price:"", phone:"", description:"", subCat:"", year:"", mileage:"", area:"", rooms:""});
      setImageFile(null);
      alert("Elan peşəkar şəkildə yayımlandı!");
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-40 selection:bg-green-500">
      <header className="p-10 border-b border-zinc-900 bg-black/95 backdrop-blur-3xl sticky top-0 z-50">
        <h1 className="text-3xl font-black italic text-center mb-10 tracking-tighter uppercase underline decoration-green-500/50 decoration-8 underline-offset-[14px]">ELANBAZARI <span className="text-green-500">NOIR</span></h1>
        
        {/* ŞƏKİLLİ ANA MENYU (GIGA) */}
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar max-w-7xl mx-auto px-4">
            <button onClick={() => setSelectedMainCat("Hamısı")} className={`flex flex-col items-center gap-4 p-5 min-w-[140px] rounded-[3rem] transition-all border ${selectedMainCat === "Hamısı" ? 'bg-green-500 border-green-500 shadow-2xl' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                <div className="w-16 h-16 bg-zinc-800 rounded-[1.5rem] flex items-center justify-center text-[10px] font-black uppercase text-white tracking-widest">ALL</div>
                <span className={`text-[10px] font-black uppercase ${selectedMainCat === "Hamısı" ? 'text-black' : 'text-zinc-500'}`}>HAMISI</span>
            </button>
            {Object.keys(MASTER_CATALOG).map(cat => (
                <button key={cat} onClick={() => setSelectedMainCat(cat)} className={`flex flex-col items-center gap-4 p-5 min-w-[140px] rounded-[3rem] transition-all border ${selectedMainCat === cat ? 'bg-green-500 border-green-500 shadow-2xl shadow-green-500/30' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-zinc-900">
                        <img src={MASTER_CATALOG[cat].img} className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-[10px] font-black uppercase whitespace-nowrap tracking-tighter ${selectedMainCat === cat ? 'text-black' : 'text-zinc-500'}`}>{cat}</span>
                </button>
            ))}
        </div>
      </header>

      <main className="p-10 max-w-7xl mx-auto">
        <section className="mb-24 bg-[#080808] border border-zinc-800 p-16 rounded-[5rem] shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-[120px] rounded-full group-hover:bg-green-500/10 transition-all duration-1000"></div>
          <h2 className="text-3xl font-black uppercase italic mb-16 text-green-500 tracking-[0.4em] border-l-8 border-green-500 pl-8">MASTER PANEL</h2>
          
          <form onSubmit={elanPaylas} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.2em] ml-6">Əsas Kataloq</label>
                    <select required value={formData.mainCat} onChange={e => setFormData({...formData, mainCat: e.target.value, subCat: ""})} className="w-full bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 font-black uppercase text-xs appearance-none cursor-pointer">
                        {Object.keys(MASTER_CATALOG).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.2em] ml-6 italic">Alt Bölmə</label>
                    <select required value={formData.subCat} onChange={e => setFormData({...formData, subCat: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 font-black uppercase text-xs text-green-500 appearance-none cursor-pointer">
                        <option value="">Seçim edin...</option>
                        {MASTER_CATALOG[formData.mainCat].subs.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.2em] ml-6">Elanın Başlığı</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Məsələn: Toyota Prius 2012 / Yeni Mebel" className="w-full bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 font-bold text-xl text-white shadow-inner" />
            </div>

            {/* SPESİFİK PARAMETRLƏR FORMA HİSSƏSİ */}
            {(formData.mainCat === "Nəqliyyat" || formData.mainCat === "Daşınmaz əmlak") && (
                <div className="grid grid-cols-2 gap-12 animate-in fade-in duration-700">
                    {formData.mainCat === "Nəqliyyat" ? (
                        <><input type="number" placeholder="İl (Məs: 2024)" onChange={e => setFormData({...formData, year: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 text-white font-bold" />
                        <input type="number" placeholder="KM (Yürüş)" onChange={e => setFormData({...formData, mileage: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 text-white font-bold" /></>
                    ) : (
                        <><input type="number" placeholder="m² (Sahə)" onChange={e => setFormData({...formData, area: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 text-white font-bold" />
                        <input type="number" placeholder="Otaq sayı" onChange={e => setFormData({...formData, rooms: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 text-white font-bold" /></>
                    )}
                </div>
            )}

            <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.2em] ml-6">Qiymət (AZN)</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 font-black text-green-500 text-4xl shadow-inner" />
                </div>
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.2em] ml-6">Əlaqə Nömrəsi</label>
                    <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+994" className="w-full bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 font-black text-xl italic text-white" />
                </div>
            </div>

            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Məhsul haqqında tam geniş və professional təsvir yazın..." className="w-full bg-zinc-900 border border-zinc-800 p-10 rounded-[4.5rem] outline-none focus:border-green-500 h-64 resize-none text-lg text-white leading-relaxed"></textarea>

            <label className="w-full block border-4 border-dashed border-zinc-800 bg-zinc-900/10 p-28 rounded-[5.5rem] cursor-pointer hover:border-green-500 transition-all text-center group active:scale-[0.98] shadow-2xl">
                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                <span className="text-sm font-black text-zinc-700 uppercase tracking-[1em] group-hover:text-green-500 transition-all duration-700">{imageFile ? "✓ FOTO YÜKLƏNİLDİ" : "📸 PROFESSIONAL FOTO SEÇ"}</span>
            </label>

            <button disabled={uploading} className="w-full bg-green-500 text-black font-black py-10 rounded-[5.5rem] uppercase italic shadow-[0_40px_100px_-20px_rgba(34,197,94,0.6)] tracking-[0.6em] text-2xl active:scale-95 transition-all">
              {uploading ? "PROSES GEDİR..." : "YENİ ELANI CANLIYA AT"}
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
          {elanlar.map(e => <AdCard key={e.id} data={e} />)}
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
