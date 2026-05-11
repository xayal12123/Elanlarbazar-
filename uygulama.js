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

// TAP.AZ-IN TAM KATALOQ AĞACI (İkonlarla)
const CATALOG = {
  "Elektronika": { icon: "📱", subs: ["Telefonlar", "Planşetlər", "Kompüter avadanlığı", "Noutbuklar", "Oyun konsolları"] },
  "Nəqliyyat": { icon: "🚗", subs: ["Avtomobillər", "Motosikletlər", "Ehtiyat hissələri", "Aksesuarlar", "Yük maşınları"] },
  "Əmlak": { icon: "🏠", subs: ["Mənzillər", "Həyət evləri / Villalar", "Torpaq sahələri", "Ofislər", "Qarajlar"] },
  "Ev üçün": { icon: "🛋️", subs: ["Mebel", "Məişət texnikası", "Təmir və tikinti", "Qab-qacaq", "Bitkilər"] },
  "Şəxsi əşyalar": { icon: "👕", subs: ["Geyim və ayaqqabı", "Saat və zinət əşyaları", "Aksesuarlar", "Gözəllik"] },
  "Xidmətlər": { icon: "🛠️", subs: ["Təmir", "Nəqliyyat", "İT və dizayn", "Tədris", "Hüquq"] },
  "Hobbi": { icon: "🚲", subs: ["Velosipedlər", "İdman malları", "Kitablar", "Ovçuluq"] },
  "Heyvanlar": { icon: "🐾", subs: ["İtlər", "Pişiklər", "Quşlar", "Kənd təsərrüfatı heyvanları"] }
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function AdCard({ data }) {
  const { title, price, city, image_url, phone, description, mainCat, subCat, year, mileage, area, rooms } = data;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col h-full hover:border-green-500/50 transition-all shadow-xl group">
      <div className="h-44 bg-zinc-800 relative overflow-hidden">
        <img src={image_url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
            <span className="bg-black/80 backdrop-blur text-[8px] text-white px-2.5 py-1 rounded-lg uppercase font-black border border-white/5">{CATALOG[mainCat]?.icon} {mainCat}</span>
            <span className="bg-green-500 text-[8px] text-black px-2 py-0.5 rounded-lg uppercase font-black">{subCat}</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-green-500 font-black text-2xl mb-1">{price} AZN</div>
        <h3 className="text-white font-bold text-[12px] uppercase mb-2 truncate leading-tight tracking-tight">{title}</h3>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
            {year && <span className="bg-zinc-800/80 text-zinc-500 text-[8px] px-2 py-1 rounded-md font-bold uppercase italic">{year} il</span>}
            {mileage && <span className="bg-zinc-800/80 text-zinc-500 text-[8px] px-2 py-1 rounded-md font-bold uppercase italic">{mileage} km</span>}
            {area && <span className="bg-zinc-800/80 text-zinc-500 text-[8px] px-2 py-1 rounded-md font-bold uppercase italic">{area} m²</span>}
            {rooms && <span className="bg-zinc-800/80 text-zinc-500 text-[8px] px-2 py-1 rounded-md font-bold uppercase italic">{rooms} otaq</span>}
        </div>

        <p className="text-zinc-500 text-[10px] line-clamp-2 mb-6 leading-relaxed italic">{description}</p>
        
        <div className="mt-auto flex flex-col gap-3">
            <div className="text-zinc-600 text-[9px] font-black uppercase italic tracking-widest">📍 {city}</div>
            <a href={`tel:${phone}`} className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-500 transition-all text-[10px] uppercase italic">
              📞 Zəng Et
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
    if(!imageFile || !formData.subCat) return alert("Kateqoriya və şəkil vacibdir!");
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", imageFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: fd });
      const img = await res.json();
      await db.collection("elanlar").add({ ...formData, price: Number(formData.price), image_url: img.data.url, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      setFormData({title:"", price:"", city:"Bakı", phone:"", description:"", mainCat:"Elektronika", subCat:"", year:"", mileage:"", area:"", rooms:""});
      setImageFile(null);
      alert("Elan yerləşdirildi!");
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
      <header className="p-6 border-b border-zinc-900 bg-black/90 backdrop-blur-xl sticky top-0 z-50">
        <h1 className="text-xl font-black italic text-center mb-6 tracking-tighter">ELANBAZARI <span className="text-green-500">NOIR</span></h1>
        
        {/* VİZUAL KATEQORİYA MENYUSU */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar max-w-5xl mx-auto">
            <button onClick={() => setSelectedMainCat("Hamısı")} className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase transition-all border ${selectedMainCat === "Hamısı" ? 'bg-green-500 text-black border-green-500' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>🏠 Hamısı</button>
            {Object.keys(CATALOG).map(cat => (
                <button key={cat} onClick={() => setSelectedMainCat(cat)} className={`px-5 py-3 rounded-2xl text-[9px] font-black uppercase transition-all whitespace-nowrap border ${selectedMainCat === cat ? 'bg-green-500 text-black border-green-500 shadow-lg shadow-green-500/20' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                    {CATALOG[cat].icon} {cat}
                </button>
            ))}
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        {/* ELAN YERLƏŞDİRMƏ PANELİ */}
        <section className="mb-16 bg-zinc-950 border border-zinc-900 p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
          <h2 className="text-lg font-black uppercase italic mb-10 text-green-500 tracking-widest">Yeni Elan</h2>
          
          <form onSubmit={elanPaylas} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-600 uppercase ml-2">Ana Kateqoriya</label>
                    <select required value={formData.mainCat} onChange={e => setFormData({...formData, mainCat: e.target.value, subCat: ""})} className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-green-500 font-bold uppercase text-[10px] text-white">
                        {Object.keys(CATALOG).map(cat => <option key={cat} value={cat}>{CATALOG[cat].icon} {cat}</option>)}
                    </select>
                </div>

                <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-600 uppercase ml-2">Alt Bölmə</label>
                    <select required value={formData.subCat} onChange={e => setFormData({...formData, subCat: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-green-500 font-bold uppercase text-[10px] text-green-500">
                        <option value="">Alt kateqoriya seçin...</option>
                        {CATALOG[formData.mainCat].subs.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Məhsulun adı..." className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-green-500 transition-all font-bold text-sm" />
            </div>

            <div className="grid grid-cols-2 gap-6">
                {formData.mainCat === "Nəqliyyat" && (
                    <><input type="number" placeholder="İl" onChange={e => setFormData({...formData, year: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-green-500 text-sm" />
                    <input type="number" placeholder="KM" onChange={e => setFormData({...formData, mileage: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-green-500 text-sm" /></>
                )}
                {formData.mainCat === "Əmlak" && (
                    <><input type="number" placeholder="Sahə (m²)" onChange={e => setFormData({...formData, area: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-green-500 text-sm" />
                    <input type="number" placeholder="Otaq" onChange={e => setFormData({...formData, rooms: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-green-500 text-sm" /></>
                )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Qiymət" className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-green-500 font-bold text-green-500" />
              <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Nömrə" className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl outline-none focus:border-green-500 font-black italic text-sm" />
            </div>

            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Məhsul haqqında ətraflı məlumat..." className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-3xl outline-none focus:border-green-500 h-32 resize-none text-sm leading-relaxed"></textarea>

            <div className="flex items-center gap-4">
                <input type="file" accept="image/*" id="f" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                <label htmlFor="f" className="flex-1 border-2 border-dashed border-zinc-800 bg-zinc-900/10 p-12 rounded-[2.5rem] cursor-pointer hover:border-green-500 transition-all text-center">
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">{imageFile ? "✓ Hazırdır" : "📸 Qalereyadan Şəkil Seç"}</span>
                </label>
            </div>

            <button disabled={uploading} className="w-full bg-green-500 text-black font-black py-6 rounded-[2rem] uppercase italic active:scale-[0.98] transition-all shadow-2xl shadow-green-500/20 disabled:opacity-50">
              {uploading ? "BAZAYA YÜKLƏNİR..." : "ELANI DƏRHAL PAYLAŞ"}
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
