const { useState, useEffect } = React;

// ⚙️ KONFİQURASİYA
const firebaseConfig = {
  apiKey: "AIzaSyDMP46oea0EhxFMrEbRClWFIt2MHT9Kccs",
  authDomain: "elan-856a5.firebaseapp.com",
  projectId: "elan-856a5",
  storageBucket: "elan-856a5.firebasestorage.app"
};
const IMG_BB_KEY = "01012f50423d7d208a5865ebeebbc6bc";
const FORMSPREE_ID = "mqenwvyq";

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function App() {
  const [items, setItems] = useState([]);
  const [view, setView] = useState("home"); 
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Hamısı");
  const [activeSub, setActiveSub] = useState("Bütün elanlar");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("titan_user")) || null);

  useEffect(() => {
    const sync = db.collection("elanlar").orderBy("createdAt", "desc")
      .onSnapshot(snap => setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    return () => sync();
  }, []);

  const handleCatClick = (cat) => {
    setActiveCat(cat);
    setActiveSub("Bütün elanlar");
  };

  const filtered = items.filter(it => 
    it.title.toLowerCase().includes(query.toLowerCase()) && 
    (activeCat === "Hamısı" || it.category === activeCat) &&
    (activeSub === "Bütün elanlar" || it.subCat === activeSub)
  );

  return (
    <div className="min-h-screen bg-[#f6f7fa] pb-24 font-sans">
      
      {/* 🔍 SEARCH HEADER (Focus Rəngi: Yaşıl) */}
      {view === "home" && (
        <div className="bg-white p-4 sticky top-0 z-[100] border-b shadow-sm">
          <div className="flex items-center gap-3 bg-[#f0f1f4] px-4 py-2.5 rounded-xl border border-transparent focus-within:border-[#22c55e] transition-all">
             <span className="text-gray-400">🔍</span>
             <input type="text" placeholder="Əşya və ya xidmət axtarışı" className="bg-transparent w-full outline-none text-sm font-medium" value={query} onChange={(e)=>setQuery(e.target.value)} />
          </div>
        </div>
      )}

      {/* 🎡 CIRCLE CATEGORIES (Yaşıl Vurğulu) */}
      {view === "home" && (
        <div className="bg-white shadow-sm mb-1">
          <div className="flex gap-6 overflow-x-auto no-scrollbar p-5">
             <div onClick={() => handleCatClick("Hamısı")} className="flex flex-col items-center min-w-[75px] gap-2 cursor-pointer">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all ${activeCat === "Hamısı" ? 'bg-[#22c55e] text-white shadow-lg' : 'bg-[#f0f1f4] text-gray-400'}`}>🏢</div>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Kataloq</span>
             </div>
             {Object.keys(window.MASTER_CATALOG).map(cat => (
               <div key={cat} onClick={() => handleCatClick(cat)} className="flex flex-col items-center min-w-[75px] gap-2 cursor-pointer group">
                  <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${activeCat === cat ? 'border-[#22c55e] scale-110 shadow-lg shadow-green-100' : 'border-white'}`}>
                    <img src={window.MASTER_CATALOG[cat].img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <span className={`text-[10px] font-bold text-center leading-tight ${activeCat === cat ? 'text-[#22c55e]' : 'text-gray-500'}`}>{cat}</span>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* 🏷️ SUB-CATEGORIES */}
      {view === "home" && activeCat !== "Hamısı" && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 bg-white border-b border-gray-100">
          {window.MASTER_CATALOG[activeCat].subs.map(sub => (
            <button 
              key={sub}
              onClick={() => setActiveSub(sub)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-[10px] font-black uppercase transition-all ${
                activeSub === sub 
                ? 'bg-zinc-800 text-white shadow-md' 
                : 'bg-gray-100 text-gray-400 border border-transparent'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* 📦 ELAN GRID */}
      {view === "home" && (
        <main className="p-3 grid grid-cols-2 gap-3 animate__animated animate__fadeIn">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-all border border-gray-50">
              <div className="relative h-44">
                 <img src={item.image_url} className="w-full h-full object-cover" />
                 <button className="absolute top-2 right-2 text-white text-xl drop-shadow-md">♡</button>
              </div>
              <div className="p-3">
                <div className="text-xl font-black text-zinc-900 tracking-tighter">{item.price} AZN</div>
                <h3 className="text-[11px] text-gray-600 font-bold h-8 line-clamp-2 mt-1 leading-tight">{item.title}</h3>
                <div className="text-[9px] text-gray-400 mt-2 font-medium">Bakı, Bugün</div>
              </div>
            </div>
          ))}
        </main>
      )}

      {/* 📱 TAB BAR (Yaşıl Vurğu) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-[200] shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
        <button onClick={() => setView("home")} className={`flex flex-col items-center gap-1 ${view === "home" ? 'text-[#22c55e]' : 'text-gray-300'}`}>
          <span className="text-2xl">🏠</span><span className="text-[9px] font-black uppercase">Əsas</span>
        </button>
        <div className="relative -top-4">
          <button onClick={() => setView("add")} className="bg-[#22c55e] w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl shadow-xl shadow-green-200 border-4 border-white active:scale-90 transition-all">+</button>
        </div>
        <button onClick={() => setView("profile")} className={`flex flex-col items-center gap-1 ${view === "profile" ? 'text-[#22c55e]' : 'text-gray-300'}`}>
          <span className="text-2xl">👤</span><span className="text-[9px] font-black uppercase">Kabinet</span>
        </button>
      </nav>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
