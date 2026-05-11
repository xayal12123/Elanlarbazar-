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
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("titan_user")) || null);
  const [authStep, setAuthStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  // Firebase Real-time Sync
  useEffect(() => {
    const sync = db.collection("elanlar").orderBy("createdAt", "desc")
      .onSnapshot(snap => setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    return () => sync();
  }, []);

  // 📧 FORM SPREE OTP SYSTEM
  const sendOTP = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) return setStatusMsg("❌ Düzgün Gmail yazın!");
    setLoading(true); setStatusMsg("⏳ OTP hazırlanır...");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: `Giriş kodu: ${code}`, _subject: "OTP" }),
      });
      if (res.ok) { setStatusMsg("✅ Kod göndərildi!"); setTimeout(() => setAuthStep(2), 1500); }
    } catch { setStatusMsg(`⚠️ Xəta! Test kod: ${code}`); setTimeout(() => setAuthStep(2), 2000); }
    setLoading(false);
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      const u = { email, date: new Date().toISOString() };
      setUser(u); localStorage.setItem("titan_user", JSON.stringify(u));
      setView("home");
    } else { setStatusMsg("❌ Kod səhvdir!"); }
  };

  const filtered = items.filter(it => 
    it.title.toLowerCase().includes(query.toLowerCase()) && 
    (activeCat === "Hamısı" || it.category === activeCat)
  );

  return (
    <div className="min-h-screen bg-[#f6f7fa] pb-24 font-sans">
      
      {/* 🔍 SEARCH HEADER (Tap.az Original Style) */}
      {view === "home" && (
        <div className="bg-white p-4 sticky top-0 z-[100] border-b border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 bg-[#f0f1f4] px-4 py-2.5 rounded-xl border border-transparent focus-within:border-[#ff4f08] transition-all">
             <span className="text-gray-400">🔍</span>
             <input type="text" placeholder="Əşya və ya xidmət axtarışı" className="bg-transparent w-full outline-none text-sm font-medium" value={query} onChange={(e)=>setQuery(e.target.value)} />
          </div>
        </div>
      )}

      {/* 🎡 CIRCLE CATEGORIES (Tap.az Circles) */}
      {view === "home" && (
        <div className="bg-white mb-2 shadow-sm">
          <div className="flex gap-5 overflow-x-auto no-scrollbar p-5">
             <div onClick={() => setActiveCat("Hamısı")} className="flex flex-col items-center min-w-[70px] gap-2 cursor-pointer">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all ${activeCat === "Hamısı" ? 'bg-[#ff4f08] text-white' : 'bg-[#f0f1f4] text-gray-400'}`}>🏢</div>
                <span className="text-[10px] font-bold text-gray-600">Kataloq</span>
             </div>
             {Object.keys(window.MASTER_CATALOG || {}).map(cat => (
               <div key={cat} onClick={() => setActiveCat(cat)} className="flex flex-col items-center min-w-[70px] gap-2 cursor-pointer group">
                  <div className={`w-14 h-14 rounded-full overflow-hidden border-2 bg-gray-50 flex items-center justify-center transition-all ${activeCat === cat ? 'border-[#ff4f08] scale-110 shadow-md' : 'border-transparent'}`}>
                    <img src={window.MASTER_CATALOG[cat].img} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
                  </div>
                  <span className={`text-[10px] font-bold whitespace-nowrap ${activeCat === cat ? 'text-[#ff4f08]' : 'text-gray-600'}`}>{cat}</span>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* 📦 ELAN GRID */}
      {view === "home" && (
        <main className="p-4 grid grid-cols-2 gap-3 animate__animated animate__fadeIn">
          {filtered.map(item => (
            <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm active:scale-95 transition-all border border-gray-100">
              <div className="relative h-40">
                 <img src={item.image_url} className="w-full h-full object-cover" />
                 <button className="absolute top-2 right-2 text-white text-xl drop-shadow-lg">♡</button>
                 {item.price > 500 && <div className="absolute bottom-2 left-2 bg-[#4b76ff] text-white text-[9px] px-1.5 py-0.5 rounded font-black">Mağaza</div>}
              </div>
              <div className="p-3">
                <div className="text-lg font-black text-zinc-900 tracking-tighter">{item.price} AZN</div>
                <h3 className="text-[11px] text-gray-600 font-medium h-8 line-clamp-2 mt-1 leading-tight">{item.title}</h3>
                <div className="text-[9px] text-gray-400 mt-2">Bakı, Bugün</div>
              </div>
            </div>
          ))}
        </main>
      )}

      {/* 👤 AUTH VIEW */}
      {view === "profile" && (
        <div className="p-6">
          {!user ? (
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 text-center max-w-sm mx-auto mt-10 animate__animated animate__zoomIn">
              <h2 className="text-2xl font-black mb-2 uppercase">{authStep === 1 ? "Giriş" : "Kod"}</h2>
              <p className="text-xs text-gray-400 font-bold mb-8 uppercase">{statusMsg || "Gmail ilə davam edin"}</p>
              <form onSubmit={authStep === 1 ? sendOTP : verifyOTP} className="space-y-4">
                <input type={authStep === 1 ? "email" : "number"} required placeholder={authStep === 1 ? "nümunə@gmail.com" : "000000"} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border focus:border-[#ff4f08] font-bold text-center text-lg" value={authStep === 1 ? email : otpInput} onChange={(e) => authStep === 1 ? setEmail(e.target.value) : setOtpInput(e.target.value)} />
                <button className="w-full bg-[#ff4f08] text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-100 active:scale-95 transition-all uppercase text-xs">{loading ? "Gözləyin..." : (authStep === 1 ? "Kodu Göndər" : "Daxil Ol")}</button>
              </form>
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-sm flex items-center gap-4 animate__animated animate__slideInUp">
               <div className="w-16 h-16 bg-[#ff4f08] rounded-full flex items-center justify-center text-white text-3xl font-black">{user.email[0].toUpperCase()}</div>
               <div className="flex-1 truncate">
                 <h2 className="font-black text-zinc-800 truncate">{user.email}</h2>
                 <p className="text-[10px] text-green-500 font-black uppercase">Titan Pro Hesab</p>
               </div>
               <button onClick={()=>{setUser(null); localStorage.removeItem("titan_user");}} className="text-xs font-bold text-red-500 bg-red-50 p-2 rounded-xl">Çıxış</button>
            </div>
          )}
        </div>
      )}

      {/* 📱 TAB BAR (Tap.az Layout) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-[200] shadow-inner">
        <button onClick={() => setView("home")} className={`flex flex-col items-center gap-1 ${view === "home" ? 'text-[#ff4f08]' : 'text-gray-300'}`}>
          <span className="text-xl">🏠</span><span className="text-[9px] font-bold uppercase">Əsas</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-300">
          <span className="text-xl">❤️</span><span className="text-[9px] font-bold uppercase">Seçilmişlər</span>
        </button>
        <div className="relative -top-4">
          <button onClick={() => setView("add")} className="bg-[#ff4f08] w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl shadow-lg border-4 border-white active:scale-90 transition-transform font-light">+</button>
        </div>
        <button className="flex flex-col items-center gap-1 text-gray-300">
          <span className="text-xl">💬</span><span className="text-[9px] font-bold uppercase">Mesajlar</span>
        </button>
        <button onClick={() => setView("profile")} className={`flex flex-col items-center gap-1 ${view === "profile" ? 'text-[#ff4f08]' : 'text-gray-300'}`}>
          <span className="text-xl">👤</span><span className="text-[9px] font-bold uppercase">Kabinet</span>
        </button>
      </nav>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
