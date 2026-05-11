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

// TAP.AZ KATALOQ SİYAHISI
const CATEGORIES = [
  "Hamısı", "Elektronika", "Nəqliyyat", "Ev və bağ üçün", "Ehtiyat hissələri", 
  "Daşınmaz əmlak", "Xidmətlər", "Şəxsi əşyalar", "Hobbi və asudə", 
  "Telefonlar", "Məişət texnikası", "Uşaq aləmi", "Heyvanlar", "İş elanları"
];

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function AdCard({ data }) {
  const { title, price, city, image_url, phone, description, category, year, mileage, area, rooms, brand } = data;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden flex flex-col h-full hover:border-green-500/40 transition-all">
      <div className="h-44 bg-zinc-800 relative">
        <img src={image_url} className="w-full h-full object-cover" />
        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-[8px] text-white px-2 py-1 rounded-full uppercase font-black">{category}</span>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-green-500 font-black text-xl mb-1">{price} AZN</div>
        <h3 className="text-white font-bold text-[13px] uppercase mb-2 truncate">{title}</h3>
        
        {/* DİNAMİK DETALLAR */}
        <div className="flex flex-wrap gap-1.5 mb-4">
            {year && <span className="bg-zinc-800 text-zinc-500 text-[8px] px-2 py-1 rounded-md font-bold italic">{year} il</span>}
            {mileage && <span className="bg-zinc-800 text-zinc-500 text-[8px] px-2 py-1 rounded-md font-bold italic">{mileage} km</span>}
            {area && <span className="bg-zinc-800 text-zinc-500 text-[8px] px-2 py-1 rounded-md font-bold italic">{area} m²</span>}
            {rooms && <span className="bg-zinc-800 text-zinc-500 text-[8px] px-2 py-1 rounded-md font-bold italic">{rooms} otaq</span>}
            {brand && <span className="bg-zinc-800 text-zinc-500 text-[8px] px-2 py-1 rounded-md font-bold italic">{brand}</span>}
        </div>

        <p className="text-zinc-500 text-[11px] line-clamp-2 mb-4 leading-relaxed">{description}</p>
        
        <a href={`tel:${phone}`} className="mt-auto w-full bg-white text-black font-black py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-green-500 transition-all text-[10px] uppercase italic">
          📞 Əlaqə Saxla
        </a>
      </div>
    </div>
  );
}

function App() {
  const [elanlar, setElanlar] = useState([]);
  const [selectedCat, setSelectedCat] = useState("Hamısı");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ title: "", price: "", city: "Bakı", phone: "", description: "", category: "Elektronika", year: "", mileage: "", area: "", rooms: "", brand: "" });

  useEffect(() => {
    let query = db.collection("elanlar").orderBy("createdAt", "desc");
    if (selectedCat !== "Hamısı") query = query.where("category", "==", selectedCat);
    const unsubscribe = query.onSnapshot(s => setElanlar(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsubscribe();
  }, [selectedCat]);

  const elanPaylas = async (e) => {
    e.preventDefault();
    if(!imageFile) return alert("Şəkil seçin!");
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("image", imageFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: "POST", body: fd });
      const img = await res.json();
      await db.collection("elanlar").add({ ...formData, price: Number(formData.price), image_url: img.data.url, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      setFormData({ title: "", price: "", city: "Bakı", phone: "", description: "", category: "Elektronika", year: "", mileage: "", area: "", rooms: "", brand: "" });
      setImageFile(null);
      alert("Elan kataloqa əlavə edildi!");
    } catch (err) { alert(err.message); }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 font-sans">
      <header className="p-6 border-b border-zinc-900 bg-black/80 backdrop-blur sticky top-0 z-50">
        <h1 className="text-xl font-black italic text-center mb-6">ELANBAZARI <span className="text-green-500">NOIR</span></h1>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map(c => (
                <button key={c} onClick={() => setSelectedCat(c)} className={`px-5 py-2.5 rounded-2xl text-[9px] font-black uppercase transition-all whitespace-nowrap border ${selectedCat === c ? 'bg-green-500 text-black border-green-500 shadow-lg shadow-green-500/20' : 'bg-zinc-900 text-zinc-600 border-zinc-800'}`}>{c}</button>
            ))}
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <section className="mb-16 bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem]">
          <h2 className="text-lg font-black uppercase italic mb-8 text-green-500">Məhsul Yerləşdir</h2>
          <form onSubmit={elanPaylas} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Məhsulun adı" className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500" />
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500 font-bold uppercase text-[10px] text-zinc-400">
                    {CATEGORIES.filter(c => c !== "Hamısı").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* KATEGORİYAYA GÖRƏ DİNAMİK XANALAR */}
            <div className="grid grid-cols-2 gap-4">
                {formData.category === "Nəqliyyat" && (
                    <><input type="number" placeholder="İl" onChange={e => setFormData({...formData, year: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500" />
                    <input type="number" placeholder="KM" onChange={e => setFormData({...formData, mileage: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500" /></>
                )}
                {formData.category === "Daşınmaz əmlak" && (
                    <><input type="number" placeholder="Sahə (m²)" onChange={e => setFormData({...formData, area: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500" />
                    <input type="number" placeholder="Otaq" onChange={e => setFormData({...formData, rooms: e.target.value})} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500" /></>
                )}
                {(formData.category === "Elektronika" || formData.category === "Telefonlar") && (
                    <input placeholder="Marka" onChange={e => setFormData({...formData, brand: e.target.value})} className="col-span-2 bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500" />
                )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Qiymət" className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500" />
              <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Nömrə" className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500 text-green-500 font-black" />
            </div>

            <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Təsvir..." className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:border-green-500 h-24 resize-none text-sm"></textarea>

            <label className="w-full block border-2 border-dashed border-zinc-800 bg-zinc-900/30 p-10 rounded-3xl cursor-pointer hover:border-green-500 text-center transition-all">
                <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files[0])} />
                <span className="text-[10px] font-black text-zinc-600 uppercase italic">{imageFile ? "✓ Şəkil Seçildi" : "📸 Şəkil Yüklə"}</span>
            </label>

            <button disabled={uploading} className="w-full bg-green-500 text-black font-black py-5 rounded-2xl uppercase italic active:scale-95 transition-all shadow-xl shadow-green-500/20">
              {uploading ? "PAYLAŞILIR..." : "ELANI YAYIMLA"}
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elanlar.map(e => <AdCard key={e.id} data={e} />)}
        </div>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
