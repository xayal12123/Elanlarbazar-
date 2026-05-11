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

// GİGA KATALOQ: BÜTÜN ANA KATEQORİYALAR VƏ REAL ŞƏKİLLƏR
const GIGA_CATALOG = {
  "Elektronika": { 
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80", 
    subs: ["Telefonlar", "Planşetlər", "Noutbuklar", "Kompüter avadanlığı", "Audio və video", "Televizorlar", "Oyun konsolları", "Foto-aparatlar"] 
  },
  "Nəqliyyat": { 
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80", 
    subs: ["Avtomobillər", "Ehtiyat hissələri", "Aksesuarlar", "Motosikletlər", "Yük maşınları", "Avtobuslar", "Tikinti texnikası", "Qeydiyyat nişanları"] 
  },
  "Daşınmaz əmlak": { 
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80", 
    subs: ["Mənzillər", "Həyət evləri, bağ evləri", "Torpaq sahələri", "Obyektlər və ofislər", "Qarajlar", "Xaricdə əmlak"] 
  },
  "Məişət texnikası": { 
    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=80", 
    subs: ["Soyuducular", "Paltaryuyanlar", "Tozsoranlar", "Mətbəx kombaynları", "Mikrodalğalı sobalar", "Kondisionerlər", "Tikiş maşınları", "Süd separatorları"] 
  },
  "Ev və bağ üçün": { 
    img: "https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?auto=format&fit=crop&w=300&q=80", 
    subs: ["Mebellər", "Təmir və tikinti", "Qab-qacaq", "Bitkilər", "Xalçalar", "İşıqlandırma", "Dekor və interyer", "Ərzaq"] 
  },
  "Şəxsi əşyalar": { 
    img: "https://images.unsplash.com/photo-1445205170230-053b830c6050?auto=format&fit=crop&w=300&q=80", 
    subs: ["Geyim və ayaqqabı", "Saatlar", "Zinət əşyaları", "Aksesuarlar", "Sağlamlıq və gözəllik"] 
  },
  "Uşaq aləmi": { 
    img: "https://images.unsplash.com/photo-1533221300843-085e79155288?auto=format&fit=crop&w=300&q=80", 
    subs: ["Oyuncaqlar", "Uşaq geyimi", "Uşaq arabaları", "Uşaq mebeli", "Məktəblilər üçün", "Hammam və gigiyena"] 
  },
  "Heyvanlar": { 
    img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80", 
    subs: ["İtlər", "Pişiklər", "Quşlar", "Akvariumlar", "Atlar", "K/t heyvanları", "Heyvanlar üçün məhsullar"] 
  },
  "Hobbi və asudə": { 
    img: "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=300&q=80", 
    subs: ["Velosipedlər", "İdman malları", "Kitablar", "Musiqi alətləri", "Kolleksiyalar", "Kempinq və balıqçılıq", "Tanışlıq"] 
  },
  "Xidmətlər": { 
    img: "https://images.unsplash.com/photo-1454165833767-1390e44a17d5?auto=format&fit=crop&w=300&q=80", 
    subs: ["Təmir və tikinti", "Nəqliyyat xidmətləri", "Tədris və kurslar", "İT və dizayn", "Tibbi xidmətlər", "Hüquq xidmətləri"] 
  },
  "İş elanları": { 
    img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=300&q=80", 
    subs: ["Vakansiyalar", "İş axtarıram"] 
  }
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function AdCard({ data }) {
  const { title, price, city, image_url, phone, description, mainCat, subCat } = data;
  return (
    <div className="bg-[#0f0f0f] border border-zinc-800 rounded-[3rem] overflow-hidden flex flex-col h-full hover:border-green-500/50 transition-all duration-500 shadow-2xl group">
      <div className="h-60 bg-zinc-800 relative overflow-hidden">
        <img src={image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute top-5 left-5">
            <div className="bg-black/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-3">
                <img src={GIGA_CATALOG[mainCat]?.img} className="w-5 h-5 rounded-full object-cover border border-green-500" />
                <span className="text-[8px] text-white uppercase font-black tracking-widest">{mainCat}</span>
            </div>
        </div>
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <div className="text-green-500 font-black text-3xl mb-2">{price} AZN</div>
        <h3 className="text-white font-bold text-sm uppercase mb-4 truncate tracking-tight">{title}</h3>
        <p className="text-zinc-500 text-[11px] line-clamp-2 mb-8 leading-relaxed italic border-l-2 border-green-500/20 pl-4">{description}</p>
        <div className="mt-auto pt-6 border-t border-zinc-800 flex flex-col gap-4">
            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">📍 {city}</span>
            <a href={`tel:${phone}`} className="w-full bg-white text-black font-black py-5 rounded-[1.5rem] flex items-center justify-center hover:bg-green-500 transition-all text-xs uppercase italic shadow-xl">
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
  const [formData, setFormData] = useState({ title: "", price: "", city: "Bakı", phone: "", description: "", mainCat: "Elektronika", subCat: "" });

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
      setFormData({...formData, title:"", price:"", phone:"", description:"", subCat:""});
      setImageFile(null);
      alert("Elan peşəkar şəkildə yayımlandı!");
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-32">
      <header className="p-10 border-b border-zinc-900 bg-black/95 backdrop-blur-3xl sticky top-0 z-50">
        <h1 className="text-3xl font-black italic text-center mb-10 tracking-tighter uppercase">ELANBAZARI <span className="text-green-500">NOIR</span></h1>
        
        {/* ŞƏKİLLİ BÖYÜK ANA MENYU */}
        <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar max-w-7xl mx-auto px-4">
            <button onClick={() => setSelectedMainCat("Hamısı")} className={`flex flex-col items-center gap-4 p-5 min-w-[130px] rounded-[2.5rem] transition-all border ${selectedMainCat === "Hamısı" ? 'bg-green-500 border-green-500 shadow-2xl' : 'bg-zinc-950 border-zinc-800'}`}>
                <div className="w-16 h-16 bg-zinc-800 rounded-[1.5rem] flex items-center justify-center text-xs font-black">ALL</div>
                <span className={`text-[10px] font-black uppercase ${selectedMainCat === "Hamısı" ? 'text-black' : 'text-zinc-500'}`}>HAMISI</span>
            </button>
            {Object.keys(GIGA_CATALOG).map(cat => (
                <button key={cat} onClick={() => setSelectedMainCat(cat)} className={`flex flex-col items-center gap-4 p-5 min-w-[130px] rounded-[2.5rem] transition-all border ${selectedMainCat === cat ? 'bg-green-500 border-green-500 shadow-2xl shadow-green-500/30' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-zinc-900 shadow-inner">
                        <img src={GIGA_CATALOG[cat].img} className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-[10px] font-black uppercase whitespace-nowrap ${selectedMainCat === cat ? 'text-black' : 'text-zinc-500'}`}>{cat}</span>
                </button>
            ))}
        </div>
      </header>

      <main className="p-10 max-w-7xl mx-auto">
        <section className="mb-24 bg-[#080808] border border-zinc-800 p-16 rounded-[4.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
          <h2 className="text-3xl font-black uppercase italic mb-16 text-green-500 tracking-[0.3em] border-l-8 border-green-500 pl-8">GIGA PANEL</h2>
          
          <form onSubmit={elanPaylas} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-700 uppercase tracking-widest ml-6">Kataloq Seçimi</label>
                    <select required value={formData.mainCat} onChange={e => setFormData({...formData, mainCat: e.target.value, subCat: ""})} className="w-full bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 font-black uppercase text-xs appearance-none cursor-pointer">
                        {Object.keys(GIGA_CATALOG).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="space-y-4">
                    <label className="text-[11px] font-black text-zinc-700 uppercase tracking-widest ml-6">Alt Bölmə</label>
                    <select required value={formData.subCat} onChange={e => setFormData({...formData, subCat: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 font-black uppercase text-xs text-green-500 appearance-none cursor-pointer">
                        <option value="">Detallı bölməni seçin...</option>
                        {GIGA_CATALOG[formData.mainCat].subs.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>
            </div>

            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Məhsulun Başlığı" className="w-full bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 font-bold text-xl" />

            <div className="grid grid-cols-2 gap-12">
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Qiymət (AZN)" className="w-full bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 font-black text-green-500 text-3xl" />
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Telefon (+994)" className="w-full bg-zinc-900 border border-zinc-800 p-7 rounded-[2.5rem] outline-none focus:border-green-500 font-black text-xl italic" />
            </div>

            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Məhsul haqqında geniş məlumat..." className="w-full bg-zinc-900 border border-zinc-800 p-10 rounded-[4rem] outline-none focus:border-green-500 h-56 resize-none text-lg leading-relaxed shadow-inner"></textarea>

            <label className="w-full block border-4 border-dashed border-zinc-800 bg-zinc-900/10 p-28 rounded-[5rem] cursor-pointer hover:border-green-500 transition-all text-center group active:scale-[0.98]">
                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                <span className="text-sm font-black text-zinc-700 uppercase tracking-[0.8em] group-hover:text-green-500 transition-all duration-700">{imageFile ? "✓ FOTOLAR HAZIRDIR" : "📸 PRO FOTO SEÇİMİ"}</span>
            </label>

            <button disabled={uploading} className="w-full bg-green-500 text-black font-black py-9 rounded-[5rem] uppercase italic shadow-[0_40px_80px_-20px_rgba(34,197,94,0.6)] tracking-[0.5em] text-xl active:scale-95 transition-all">
              {uploading ? "SİSTEMƏ YAZILIR..." : "YENİ ELANI CANLIYA AT"}
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 px-4">
          {elanlar.map(e => <AdCard key={e.id} data={e} />)}
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

