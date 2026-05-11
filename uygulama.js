const { useState, useEffect } = React;

// FIREBASE VE KONFİQURASİYA
const firebaseConfig = {
  apiKey: "AIzaSyDMP46oea0EhxFMrEbRClWFIt2MHT9Kccs",
  authDomain: "elan-856a5.firebaseapp.com",
  projectId: "elan-856a5",
  storageBucket: "elan-856a5.firebasestorage.app",
  messagingSenderId: "234019258715",
  appId: "1:234019258715:web:9dd195954ce65b6e5d5a7e"
};

const IMGBB_API_KEY = "01012f50423d7d208a5865ebeebbc6bc"; 

// MASTER KATALOQ: TAM ANALİZ EDİLMİŞ VƏ ŞƏKİLLİ SİYAHI
const TITAN_CATALOG = {
  "Elektronika": { 
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400", 
    subs: ["Telefonlar", "Apple iPhone", "Planşetlər", "Noutbuklar", "Kompüter avadanlığı", "Audio və video", "Oyun konsolları", "Televizorlar", "Foto-aparatlar"] 
  },
  "Nəqliyyat": { 
    img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400", 
    subs: ["Avtomobillər", "Ehtiyat hissələri", "Aksesuarlar", "Motosikletlər və mopedlər", "Avtobuslar", "Yük maşınları", "Tikinti texnikası", "Aqrotexnika", "Qeydiyyat nişanları"] 
  },
  "Ev və bağ üçün": { 
    img: "https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?w=400", 
    subs: ["Mebellər", "Təmir və tikinti", "Ev tekstili", "Xalçalar", "Bitkilər", "Dekor və interyer", "İşıqlandırma", "Ərzaq", "Bağ və bostan"] 
  },
  "Daşınmaz əmlak": { 
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400", 
    subs: ["Mənzillər", "Həyət evləri, bağ evləri", "Torpaq", "Obyektlər və ofislər", "Qarajlar", "Xaricdə əmlak"] 
  },
  "Ehtiyat hissələri və aksesuarlar": { 
    img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400", 
    subs: ["Aksesuarlar", "Avto kosmetika", "Avto alətlər", "Şinlər və disklər", "Siqnalizasiyalar", "Videoqeydiyyatçılar"] 
  },
  "Xidmətlər və biznes": { 
    img: "https://images.unsplash.com/photo-1454165833767-1390e44a17d5?w=400", 
    subs: ["Təmir və tikinti", "Nəqliyyat xidmətləri", "Tədris və kurslar", "İT və dizayn", "Tibbi xidmətlər", "Maliyyə və hüquq", "Təmizlik"] 
  },
  "Şəxsi əşyalar": { 
    img: "https://images.unsplash.com/photo-1445205170230-053b830c6050?w=400", 
    subs: ["Geyim və ayaqqabı", "Saatlar", "Zinət əşyaları", "Aksesuarlar", "Sağlamlıq və gözəllik"] 
  },
  "Hobbi və asudə": { 
    img: "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=400", 
    subs: ["Velosipedlər", "İdman və asudə", "Kitab və jurnallar", "Musiqi alətləri", "Kolleksiyalar", "Kempinq və balıqçılıq", "Biletlər və səyahət", "Tanışlıq"] 
  },
  "Telefonlar": { 
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", 
    subs: ["Apple iPhone", "Samsung", "Xiaomi", "Honor", "Nokia", "Motorola", "Digər", "Nömrələr", "Aksesuarlar"] 
  },
  "Məişət texnikası": { 
    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400", 
    subs: ["Soyuducular", "Paltaryuyanlar", "Tozsoranlar", "Mətbəx kombaynları", "Mikrodalğalı sobalar", "Kondisionerlər", "Tikiş maşınları", "Ütülər", "Süd separatorları", "Tərəzilər", "Su dispenserləri"] 
  },
  "Uşaq aləmi": { 
    img: "https://images.unsplash.com/photo-1515488764276-38520b212896?w=400", 
    subs: ["Oyuncaqlar", "Uşaq geyimi", "Uşaq arabaları", "Uşaq mebeli", "Yürütəclər", "Manejlər", "Çarpayılar və beşiklər", "Uşaq qidası", "Hammam və gigiyena"] 
  },
  "Heyvanlar": { 
    img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400", 
    subs: ["İtlər", "Pişiklər", "Quşlar", "Akvariumlar və balıqlar", "K/t heyvanları", "Atlar", "Gəmiricilər", "Arılar", "Heyvanlar üçün məhsullar"] 
  },
  "İş elanları": { 
    img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400", 
    subs: ["Vakansiyalar", "İş axtarıram"] 
  },
  "Məktəblilər üçün": { 
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400", 
    subs: ["Dəftərxana ləvazimatları", "Dərsliklər", "Məktəbli çantaları", "Məktəbli forması", "Yaradıcılıq ləvazimatları"] 
  },
  "Mağazalar": { 
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400", 
    subs: ["Bütün mağazalar"] 
  }
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ELAN KARTI KOMPONENTİ
function AdCard({ data }) {
  const { title, price, city, image_url, phone, description, mainCat, subCat, year, mileage, area, rooms } = data;
  return (
    <div className="bg-[#111] border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:border-green-500/50 transition-all duration-300 shadow-2xl group">
      <div className="h-56 bg-zinc-800 relative">
        <img src={image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
            <img src={TITAN_CATALOG[mainCat]?.img} className="w-5 h-5 rounded-lg object-cover border border-green-500" />
            <span className="text-[8px] text-white uppercase font-black">{mainCat}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-green-500 font-black text-2xl mb-1 italic">{price} AZN</div>
        <h3 className="text-white font-bold text-xs uppercase mb-3 truncate tracking-tight">{title}</h3>
        
        {(year || mileage || area || rooms) && (
            <div className="flex flex-wrap gap-1.5 mb-4 font-black">
                {year && <span className="bg-zinc-800/80 text-zinc-500 text-[8px] px-2 py-1 rounded-md uppercase italic">{year} il</span>}
                {mileage && <span className="bg-zinc-800/80 text-zinc-500 text-[8px] px-2 py-1 rounded-md uppercase italic">{mileage} km</span>}
                {area && <span className="bg-zinc-800/80 text-zinc-500 text-[8px] px-2 py-1 rounded-md uppercase italic">{area} m²</span>}
                {rooms && <span className="bg-zinc-800/80 text-zinc-500 text-[8px] px-2 py-1 rounded-md uppercase italic">{rooms} otaq</span>}
            </div>
        )}

        <p className="text-zinc-500 text-[10px] line-clamp-2 mb-6 border-l-2 border-zinc-800 pl-3 leading-relaxed">{description}</p>
        
        <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-zinc-800/50">
            <span className="text-zinc-600 text-[9px] font-black uppercase italic">📍 {city}</span>
            <a href={`tel:${phone}`} className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center hover:bg-green-500 transition-all text-[10px] uppercase italic tracking-widest shadow-lg">📞 ƏLAQƏ SAXLA</a>
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
  
  // DƏYİŞƏNLƏRİN HAMISI BU STATE-DƏDİR
  const [formData, setFormData] = useState({ 
    title: "", price: "", city: "Bakı", phone: "", description: "", 
    mainCat: "Elektronika", subCat: "", year: "", mileage: "", area: "", rooms: "" 
  });

  useEffect(() => {
    let query = db.collection("elanlar").orderBy("createdAt", "desc");
    if (selectedMainCat !== "Hamısı") query = query.where("mainCat", "==", selectedMainCat);
    const unsubscribe = query.onSnapshot(s => setElanlar(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsubscribe();
  }, [selectedMainCat]);

  const elanPaylas = async (e) => {
    e.preventDefault();
    if(!imageFile || !formData.subCat) return alert("Zəhmət olmasa kateqoriya və şəkil seçin!");
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", imageFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: fd });
      const img = await res.json();
      
      await db.collection("elanlar").add({ 
        ...formData, 
        price: Number(formData.price), 
        image_url: img.data.url, 
        createdAt: firebase.firestore.FieldValue.serverTimestamp() 
      });

      setFormData({title:"", price:"", city:"Bakı", phone:"", description:"", mainCat:"Elektronika", subCat:"", year:"", mileage:"", area:"", rooms:""});
      setImageFile(null);
      alert("Elan titan kataloqa əlavə edildi!");
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20 selection:bg-green-500">
      <header className="p-8 border-b border-zinc-900 bg-black/95 backdrop-blur-2xl sticky top-0 z-50">
        <h1 className="text-2xl font-black italic text-center mb-8 uppercase tracking-tighter text-white">ELANBAZARI <span className="text-green-500">NOIR</span></h1>
        
        {/* ŞƏKİLLİ KATALOQ MENYU */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar max-w-7xl mx-auto px-4">
            <button onClick={() => setSelectedMainCat("Hamısı")} className={`flex flex-col items-center gap-2 p-3 min-w-[110px] rounded-3xl border transition-all ${selectedMainCat === "Hamısı" ? 'bg-green-500 border-green-500 shadow-lg' : 'bg-zinc-950 border-zinc-800'}`}>
                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-[10px] font-black uppercase text-white tracking-widest italic">All</div>
                <span className={`text-[8px] font-black uppercase ${selectedMainCat === "Hamısı" ? 'text-black' : 'text-zinc-500'}`}>HAMISI</span>
            </button>
            {Object.keys(TITAN_CATALOG).map(cat => (
                <button key={cat} onClick={() => setSelectedMainCat(cat)} className={`flex flex-col items-center gap-2 p-3 min-w-[110px] rounded-3xl border transition-all ${selectedMainCat === cat ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20' : 'bg-zinc-950 border-zinc-800'}`}>
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-zinc-900 shadow-inner">
                        <img src={TITAN_CATALOG[cat].img} className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-[8px] font-black uppercase whitespace-nowrap tracking-tighter ${selectedMainCat === cat ? 'text-black' : 'text-zinc-500'}`}>{cat}</span>
                </button>
            ))}
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        <section className="mb-20 bg-[#0a0a0a] border border-zinc-800 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
          <h2 className="text-xl font-black uppercase italic mb-12 text-green-500 tracking-[0.2em] border-l-4 border-green-500 pl-6">MASTER PANEL</h2>
          
          <form onSubmit={elanPaylas} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-4 italic">Ana Bölmə Seç</label>
                    <select required value={formData.mainCat} onChange={e => setFormData({...formData, mainCat: e.target.value, subCat: ""})} className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-black uppercase text-xs appearance-none cursor-pointer">
                        {Object.keys(TITAN_CATALOG).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-widest ml-4 italic">Alt Bölmə Seç</label>
                    <select required value={formData.subCat} onChange={e => setFormData({...formData, subCat: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-black uppercase text-xs text-green-500 appearance-none cursor-pointer">
                        <option value="">Seçim edin...</option>
                        {TITAN_CATALOG[formData.mainCat].subs.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>
            </div>

            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Elanın başlığı (məs: Toyota Prius / Samsung Soyuducu)" className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-bold text-lg shadow-inner text-white" />

            <div className="grid grid-cols-2 gap-10">
                {/* DİNAMİK XANALAR */}
                {(formData.mainCat === "Nəqliyyat" || formData.mainCat === "Daşınmaz əmlak") && (
                    <>
                        {formData.mainCat === "Nəqliyyat" ? (
                            <><input type="number" placeholder="İl" onChange={e => setFormData({...formData, year: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500" />
                            <input type="number" placeholder="KM" onChange={e => setFormData({...formData, mileage: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500" /></>
                        ) : (
                            <><input type="number" placeholder="m²" onChange={e => setFormData({...formData, area: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500" />
                            <input type="number" placeholder="Otaq" onChange={e => setFormData({...formData, rooms: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500" /></>
                        )}
                    </>
                )}
            </div>

            <div className="grid grid-cols-2 gap-10">
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Qiymət (AZN)" className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-black text-green-500 text-2xl shadow-inner" />
              <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Əlaqə nömrəsi" className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] outline-none focus:border-green-500 font-black text-sm italic shadow-inner text-white" />
            </div>

            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ətraflı məlumat yazın..." className="w-full bg-zinc-900 border border-zinc-800 p-10 rounded-[3.5rem] outline-none focus:border-green-500 h-48 resize-none text-white text-base leading-relaxed"></textarea>

            <label className="w-full block border-4 border-dashed border-zinc-800 bg-zinc-900/10 p-24 rounded-[4rem] cursor-pointer hover:border-green-500 transition-all text-center group active:scale-95 shadow-2xl">
                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                <span className="text-xs font-black text-zinc-700 uppercase tracking-[0.5em] group-hover:text-green-500">{imageFile ? "✓ FOTO HAZIRDIR" : "📸 PROFESSIONAL FOTO SEÇ"}</span>
            </label>

            <button disabled={uploading} className="w-full bg-green-500 text-black font-black py-8 rounded-[4rem] uppercase italic tracking-[0.4em] text-lg active:scale-95 transition-all shadow-[0_20px_50px_rgba(34,197,94,0.3)]">
              {uploading ? "BAZAYA YAZILIR..." : "ELANI DƏRHAL PAYLAŞ"}
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 px-4">
          {elanlar.map(e => <AdCard key={e.id} data={e} />)}
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
