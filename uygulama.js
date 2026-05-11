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

// TAP.AZ-IN BÜTÜN ANA KATEQORİYALARI (TAM SİYAHI)
const TITAN_CATALOG = {
  "Elektronika": ["Telefonlar", "Apple iPhone", "Planşetlər", "Noutbuklar", "Kompüter avadanlığı", "Audio və video", "Oyun konsolları", "Televizorlar", "Foto-aparatlar"],
  "Nəqliyyat": ["Avtomobillər", "Ehtiyat hissələri", "Aksesuarlar", "Motosikletlər və mopedlər", "Avtobuslar", "Yük maşınları", "Tikinti texnikası", "Aqrotexnika", "Qeydiyyat nişanları"],
  "Ev və bağ üçün": ["Mebellər", "Təmir və tikinti", "Ev tekstili", "Xalçalar", "Bitkilər", "Dekor və interyer", "İşıqlandırma", "Ərzaq", "Bağ və bostan"],
  "Daşınmaz əmlak": ["Mənzillər", "Həyət evləri, bağ evləri", "Torpaq", "Obyektlər və ofislər", "Qarajlar", "Xaricdə əmlak"],
  "Ehtiyat hissələri və aksesuarlar": ["Aksesuarlar", "Avto kosmetika", "Avto alətlər", "Şinlər və disklər", "Siqnalizasiyalar", "Videoqeydiyyatçılar"],
  "Xidmətlər və biznes": ["Təmir və tikinti", "Nəqliyyat xidmətləri", "Tədris və kurslar", "İT və dizayn", "Tibbi xidmətlər", "Maliyyə və hüquq", "Təmizlik"],
  "Şəxsi əşyalar": ["Geyim və ayaqqabı", "Saatlar", "Zinət əşyaları", "Aksesuarlar", "Sağlamlıq və gözəllik"],
  "Hobbi və asudə": ["Velosipedlər", "İdman və asudə", "Kitab və jurnallar", "Musiqi alətləri", "Kolleksiyalar", "Kempinq və balıqçılıq", "Biletlər və səyahət", "Tanışlıq"],
  "Telefonlar": ["Apple iPhone", "Samsung", "Xiaomi", "Honor", "Nokia", "Motorola", "Digər", "Nömrələr", "Aksesuarlar"],
  "Məişət texnikası": ["Soyuducular", "Paltaryuyanlar", "Tozsoranlar", "Mətbəx kombaynları", "Mikrodalğalı sobalar", "Kondisionerlər", "Tikiş maşınları", "Ütülər", "Süd separatorları", "Tərəzilər", "Su dispenserləri"],
  "Uşaq aləmi": ["Oyuncaqlar", "Uşaq geyimi", "Uşaq arabaları", "Uşaq mebeli", "Yürütəclər", "Manejlər", "Çarpayılar və beşiklər", "Uşaq qidası", "Hammam və gigiyena"],
  "Heyvanlar": ["İtlər", "Pişiklər", "Quşlar", "Akvariumlar və balıqlar", "K/t heyvanları", "Atlar", "Dovşanlar", "Gəmiricilər", "Arılar", "Heyvanlar üçün məhsullar"],
  "İş elanları": ["Vakansiyalar", "İş axtarıram"],
  "Məktəblilər üçün": ["Dəftərxana ləvazimatları", "Dərsliklər", "Məktəbli çantaları", "Məktəbli forması", "Yaradıcılıq ləvazimatları"],
  "Mağazalar": ["Bütün mağazalar"]
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function AdCard({ data }) {
  const { title, price, city, image_url, phone, description, mainCat, subCat, year, mileage, area, rooms } = data;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:border-green-500/50 transition-all shadow-2xl group">
      <div className="h-48 bg-zinc-800 relative overflow-hidden">
        <img src={image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-3 left-3 flex flex-col gap-1 max-w-[90%]">
            <span className="bg-black/90 backdrop-blur-md text-[7px] text-white px-3 py-1 rounded-lg uppercase font-black border border-white/5">{mainCat}</span>
            <span className="bg-green-500 text-[7px] text-black px-2.5 py-1 rounded-lg uppercase font-black">{subCat}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-green-500 font-black text-2xl mb-1">{price} AZN</div>
        <h3 className="text-white font-bold text-xs uppercase mb-3 truncate tracking-tight">{title}</h3>
        
        {(year || mileage || area || rooms) && (
            <div className="flex flex-wrap gap-1.5 mb-4 font-black">
                {year && <span className="bg-zinc-800/80 text-zinc-500 text-[8px] px-2 py-1 rounded-md uppercase italic">{year} il</span>}
                {mileage && <span className="bg-zinc-800/80 text-zinc-500 text-[8px] px-2 py-1 rounded-md uppercase italic">{mileage} km</span>}
                {area && <span className="bg-zinc-800/80 text-zinc-500 text-[8px] px-2 py-1 rounded-md uppercase italic">{area} m²</span>}
                {rooms && <span className="bg-zinc-800/80 text-zinc-500 text-[8px] px-2 py-1 rounded-md uppercase italic">{rooms} otaq</span>}
            </div>
        )}

        <p className="text-zinc-500 text-[10px] line-clamp-2 mb-6 leading-relaxed italic border-l border-zinc-800 pl-3">{description}</p>
        
        <div className="mt-auto flex flex-col gap-3">
            <div className="text-zinc-600 text-[9px] font-black uppercase italic tracking-widest">📍 {city}</div>
            <a href={`tel:${phone}`} className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-500 transition-all text-[10px] uppercase italic">
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
      alert("Elan yerləşdirildi!");
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-20">
      <header className="p-6 border-b border-zinc-900 bg-black/95 backdrop-blur-xl sticky top-0 z-50">
        <h1 className="text-xl font-black italic text-center mb-6 tracking-tighter uppercase underline decoration-green-500/40 decoration-4 underline-offset-8">ELANBAZARI <span className="text-green-500 font-bold tracking-normal">NOIR</span></h1>
        
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar max-w-5xl mx-auto px-2">
            <button onClick={() => setSelectedMainCat("Hamısı")} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase transition-all border ${selectedMainCat === "Hamısı" ? 'bg-green-500 text-black border-green-500' : 'bg-zinc-900 text-zinc-600 border-zinc-800 hover:border-zinc-700'}`}>Tüm Elanlar</button>
            {Object.keys(TITAN_CATALOG).map(cat => (
                <button key={cat} onClick={() => setSelectedMainCat(cat)} className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase transition-all whitespace-nowrap border ${selectedMainCat === cat ? 'bg-green-500 text-black border-green-500 shadow-lg shadow-green-500/30' : 'bg-zinc-900 text-zinc-600 border-zinc-800'}`}>{cat}</button>
            ))}
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        <section className="mb-16 bg-zinc-950 border border-zinc-900 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
          <h2 className="text-lg font-black uppercase italic mb-10 text-green-500 tracking-widest border-l-4 border-green-500 pl-4">Yeni Elan Yerləşdir</h2>
          
          <form onSubmit={elanPaylas} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-700 uppercase ml-4 tracking-widest italic">Ana Kateqoriya</label>
                    <select required value={formData.mainCat} onChange={e => setFormData({...formData, mainCat: e.target.value, subCat: ""})} className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] outline-none focus:border-green-500 font-bold uppercase text-[10px] appearance-none cursor-pointer">
                        {Object.keys(TITAN_CATALOG).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="space-y-3">
                    <label className="text-[9px] font-black text-zinc-700 uppercase ml-4 tracking-widest italic">Alt Bölmə</label>
                    <select required value={formData.subCat} onChange={e => setFormData({...formData, subCat: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] outline-none focus:border-green-500 font-bold uppercase text-[10px] text-green-500 appearance-none cursor-pointer">
                        <option value="">Seçim edin...</option>
                        {TITAN_CATALOG[formData.mainCat].map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[9px] font-black text-zinc-700 uppercase ml-4 tracking-widest italic">Başlıq</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Məs: iPhone 15 Pro Max (Təzə)" className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-[2.5rem] outline-none focus:border-green-500 font-bold text-sm tracking-tight" />
            </div>
            
            <div className="grid grid-cols-2 gap-8">
                {(formData.mainCat === "Nəqliyyat" || formData.mainCat === "Daşınmaz əmlak") && (
                    <>
                        {formData.mainCat === "Nəqliyyat" ? (
                            <><input type="number" placeholder="İl" onChange={e => setFormData({...formData, year: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] outline-none focus:border-green-500" />
                            <input type="number" placeholder="KM" onChange={e => setFormData({...formData, mileage: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] outline-none focus:border-green-500" /></>
                        ) : (
                            <><input type="number" placeholder="m²" onChange={e => setFormData({...formData, area: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] outline-none focus:border-green-500" />
                            <input type="number" placeholder="Otaq" onChange={e => setFormData({...formData, rooms: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] outline-none focus:border-green-500" /></>
                        )}
                    </>
                )}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Qiymət" className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] outline-none focus:border-green-500 font-black text-green-500 text-lg shadow-inner" />
              <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="050...X" className="bg-zinc-900 border border-zinc-800 p-5 rounded-[2rem] outline-none focus:border-green-500 font-black text-sm italic shadow-inner" />
            </div>

            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Məhsul haqqında məlumat..." className="w-full bg-zinc-900 border border-zinc-800 p-8 rounded-[3rem] outline-none focus:border-green-500 h-32 resize-none text-sm leading-relaxed shadow-inner"></textarea>

            <label className="w-full block border-2 border-dashed border-zinc-800 bg-zinc-900/10 p-16 rounded-[3.5rem] cursor-pointer hover:border-green-500 transition-all text-center group active:scale-95 shadow-2xl shadow-black/50">
                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.4em] group-hover:text-green-500 transition-all">{imageFile ? "✓ Şəkil Hazırdır" : "📸 Şəkil yüklə"}</span>
            </label>

            <button disabled={uploading} className="w-full bg-green-500 text-black font-black py-7 rounded-[3.5rem] uppercase italic active:scale-[0.98] transition-all shadow-[0_20px_40px_-15px_rgba(34,197,94,0.4)] disabled:opacity-50 tracking-widest">
              {uploading ? "BAZAYA YAZILIR..." : "ELANI DƏRHAL YAYIMLA"}
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
