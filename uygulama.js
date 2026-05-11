const { useState, useEffect } = React;

const firebaseConfig = {
  apiKey: "AIzaSyDMP46oea0EhxFMrEbRClWFIt2MHT9Kccs",
  authDomain: "elan-856a5.firebaseapp.com",
  projectId: "elan-856a5",
  storageBucket: "elan-856a5.firebasestorage.app",
  messagingSenderId: "234019258715",
  appId: "1:234019258715:web:9dd195954ce65b6e5d5a7e"
};

const IMAGE_HOSTING_KEY = "01012f50423d7d208a5865ebeebbc6bc"; 

const GLOBAL_MARKET_MAP = {
  "Elektronika": { img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200", subs: ["Telefonlar", "Noutbuklar"] },
  "Nəqliyyat": { img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200", subs: ["Avtomobillər", "Ehtiyat hissələri"] },
  "Ev və bağ": { img: "https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?w=200", subs: ["Mebellər", "Məişət texnikası"] },
  "Əmlak": { img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200", subs: ["Mənzillər", "Həyət evləri"] },
  "Uşaq": { img: "https://images.unsplash.com/photo-1515488764276-38520b212896?w=200", subs: ["Oyuncaqlar", "Geyim"] },
  "Xidmətlər": { img: "https://images.unsplash.com/photo-1454165833767-1390e44a17d5?w=200", subs: ["Təmir", "Tədris"] }
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const firestoreDB = firebase.firestore();

function PortalEngine() {
  const [listingData, setListingData] = useState([]);
  const [view, setView] = useState("home"); 
  const [queryTerm, setQueryTerm] = useState("");
  const [activeMainCat, setActiveMainCat] = useState("Hamısı");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [inputState, setInputState] = useState({ 
    title: "", price: "", city: "Bakı", phone: "", description: "", 
    category: "Elektronika"
  });

  useEffect(() => {
    const sync = firestoreDB.collection("elanlar").orderBy("createdAt", "desc")
      .onSnapshot(snap => setListingData(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    return () => sync();
  }, []);

  const filteredItems = listingData.filter(item => 
    item.title.toLowerCase().includes(queryTerm.toLowerCase()) && 
    (activeMainCat === "Hamısı" || item.category === activeMainCat)
  );

  const submitListing = async (e) => {
    e.preventDefault();
    if(!selectedFile) return alert("Şəkil seçin!");
    setIsProcessing(true);
    try {
      const fd = new FormData(); fd.append("image", selectedFile);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMAGE_HOSTING_KEY}`, { method: "POST", body: fd });
      const img = await res.json();
      await firestoreDB.collection("elanlar").add({ 
        ...inputState, 
        price: Number(inputState.price), 
        image_url: img.data.url, 
        createdAt: firebase.firestore.FieldValue.serverTimestamp() 
      });
      setView("home");
      setSelectedFile(null);
    } catch (err) { alert(err.message); }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-24 selection:bg-green-500/30">
      {/* 🟢 HEADER & SEARCH (YAŞIL STİL) */}
      <header className="bg-[#111] p-4 sticky top-0 z-[100] border-b border-white/5">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="text-green-500 text-2xl font-black italic tracking-tighter">tap.az</div>
          <div className="flex gap-4 items-center">
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Noir Green</span>
             <button onClick={() => setView("add")} className="bg-green-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg shadow-green-500/20">+</button>
          </div>
        </div>
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Nə axtarırsınız?" 
            className="w-full bg-[#1a1a1a] p-3 pl-10 rounded-xl outline-none text-sm border border-white/5 focus:border-green-500/50 transition-all text-white placeholder:text-zinc-600"
            value={queryTerm}
            onChange={(e) => setQueryTerm(e.target.value)}
          />
          <span className="absolute left-3 top-3.5 opacity-40 text-green-500">🔍</span>
        </div>
      </header>

      {view === "home" && (
        <main className="animate-in fade-in duration-500">
          {/* 🎢 KATALOG (YAŞIL HAŞİYƏLƏR) */}
          <div className="flex gap-4 overflow-x-auto p-5 no-scrollbar bg-[#0d0d0d] mb-4">
            <button onClick={() => setActiveMainCat("Hamısı")} className="flex flex-col items-center min-w-[75px] gap-2">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl bg-[#1a1a1a] border-2 transition-all ${activeMainCat === "Hamısı" ? 'border-green-500 bg-green-500/10' : 'border-white/5'}`}>🏠</div>
                <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400">Kataloq</span>
            </button>
            {Object.keys(GLOBAL_MARKET_MAP).map(cat => (
              <button key={cat} onClick={() => setActiveMainCat(cat)} className="flex flex-col items-center min-w-[75px] gap-2">
                <div className={`w-14 h-14 rounded-2xl overflow-hidden bg-[#1a1a1a] border-2 transition-all ${activeMainCat === cat ? 'border-green-500 scale-105' : 'border-white/5'}`}>
                  <img src={GLOBAL_MARKET_MAP[cat].img} className="w-full h-full object-cover" />
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-tighter ${activeMainCat === cat ? 'text-green-500' : 'text-zinc-500'}`}>{cat}</span>
              </button>
            ))}
          </div>

          {/* 💎 ELANLAR QRİDİ */}
          <div className="px-4 mb-4 flex justify-between items-center">
             <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Premium Elanlar</h2>
             <div className="h-[1px] flex-grow mx-4 bg-white/5"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 px-4">
            {filteredItems.map(item => (
              <div key={item.id} className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 relative group active:scale-95 transition-all shadow-xl">
                <div className="h-36 bg-zinc-800">
                  <img src={item.image_url} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full border border-white/10">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-black text-lg text-green-500 tracking-tighter">{item.price} AZN</div>
                  <div className="text-[11px] text-zinc-300 truncate font-bold mt-1 uppercase">{item.title}</div>
                  <div className="text-[8px] text-zinc-600 mt-3 flex justify-between items-center font-black uppercase italic">
                    <span>{item.city}</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {view === "add" && (
        <div className="p-6 bg-[#0a0a0a] min-h-screen animate-in slide-in-from-bottom duration-500">
            <h2 className="text-2xl font-black italic mb-8 text-green-500">YENİ ELAN</h2>
            <form onSubmit={submitListing} className="space-y-6">
                <select onChange={e => setInputState({...inputState, category: e.target.value})} className="w-full p-4 bg-[#111] border border-white/5 rounded-xl outline-none font-bold text-sm text-white focus:border-green-500">
                    {Object.keys(GLOBAL_MARKET_MAP).map(c => <option key={c}>{c}</option>)}
                </select>
                <input required placeholder="Məhsulun adı" className="w-full p-4 bg-[#111] border border-white/5 rounded-xl outline-none text-white focus:border-green-500" onChange={e => setInputState({...inputState, title: e.target.value})} />
                <input required type="number" placeholder="Qiymət (AZN)" className="w-full p-4 bg-[#111] border border-white/5 rounded-xl outline-none font-black text-green-500 text-xl" onChange={e => setInputState({...inputState, price: e.target.value})} />
                <textarea placeholder="Ətraflı məlumat..." className="w-full p-4 bg-[#111] border border-white/5 rounded-xl h-32 outline-none text-white focus:border-green-500" onChange={e => setInputState({...inputState, description: e.target.value})}></textarea>
                
                <label className="block w-full p-10 border-2 border-dashed border-white/10 rounded-2xl text-center cursor-pointer hover:border-green-500 transition-all bg-[#111]">
                    <input type="file" className="hidden" onChange={e => setSelectedFile(e.target.files[0])} />
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{selectedFile ? "✅ ŞƏKİL HAZIRDIR" : "📸 ŞƏKİL YÜKLƏ"}</span>
                </label>

                <div className="flex gap-4">
                   <button type="button" onClick={() => setView("home")} className="flex-1 bg-zinc-800 text-white font-black py-4 rounded-xl uppercase text-xs">Ləğv et</button>
                   <button disabled={isProcessing} className="flex-2 bg-green-500 text-black font-black py-4 px-10 rounded-xl shadow-lg shadow-green-500/20 active:scale-95 transition-all uppercase text-xs">PAYLAŞ</button>
                </div>
            </form>
        </div>
      )}

      {/* 📱 YAŞIL TAB BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#111]/80 backdrop-blur-xl border-t border-white/5 p-3 flex justify-around items-end z-[200]">
        <button onClick={() => setView("home")} className={`flex flex-col items-center gap-1 ${view === "home" ? 'text-green-500' : 'text-zinc-600'}`}>
          <span className="text-xl">🏠</span>
          <span className="text-[9px] font-black uppercase italic">Əsas</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-zinc-600 opacity-40">
          <span className="text-xl">❤</span>
          <span className="text-[9px] font-black uppercase italic">Sevimlilər</span>
        </button>
        <button onClick={() => setView("add")} className="flex flex-col items-center -mb-4 translate-y-[-12px] group">
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-black text-3xl shadow-[0_0_20px_rgba(34,197,94,0.4)] border-4 border-[#0a0a0a] group-active:scale-90 transition-all">+</div>
          <span className="text-[9px] font-black text-green-500 mt-1 uppercase italic">Yeni Elan</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-zinc-600 opacity-40">
          <span className="text-xl">💬</span>
          <span className="text-[9px] font-black uppercase italic">Mesajlar</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-zinc-600 opacity-40">
          <span className="text-xl">👤</span>
          <span className="text-[9px] font-black uppercase italic">Profil</span>
        </button>
      </nav>
    </div>
  );
}

const entryPoint = ReactDOM.createRoot(document.getElementById('root'));
entryPoint.render(<PortalEngine />);

