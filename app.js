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
  const [selectedImg, setSelectedImg] = useState(null);
  
  // 👤 AUTH & LOCAL STORAGE (Daimi Giriş)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("titan_user")) || null);
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [authStep, setAuthStep] = useState(1);
  const [statusMsg, setStatusMsg] = useState("");

  const [form, setForm] = useState({ title: "", price: "", city: "Bakı", description: "", category: "Elektronika", subCat: "" });

  // Canlı Məlumat Bağlantısı
  useEffect(() => {
    const sync = db.collection("elanlar").orderBy("createdAt", "desc")
      .onSnapshot(snap => setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    return () => sync();
  }, []);

  // 📧 OTP GÖNDƏRMƏ (Formspree Stabil Versiya)
  const sendOTP = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) return setStatusMsg("❌ Düzgün Gmail yazın!");
    setLoading(true);
    setStatusMsg("⏳ Giriş kodu hazırlanır...");
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    try {
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: `ElanBazarı Giriş Kodunuz: ${code}`, _subject: "Giriş Kodu" }),
      });
      if (response.ok) {
        setStatusMsg("✅ Kod Gmail-ə uçdu!");
        setTimeout(() => setAuthStep(2), 1500);
      } else { throw new Error(); }
    } catch {
      setStatusMsg(`⚠️ Server naz edir. Test kodun: ${code}`);
      setTimeout(() => setAuthStep(2), 3000);
    }
    setLoading(false);
  };

  // ✅ KODU YOXLA VƏ DAİMİ YADDA SAXLA
  const verifyOTP = (e) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      const userData = { email, loginAt: new Date().toISOString() };
      setUser(userData);
      localStorage.setItem("titan_user", JSON.stringify(userData)); // Brauzer yaddaşına yazır
      setView("home");
      setStatusMsg("");
    } else { setStatusMsg("❌ Kod səhvdir!"); }
  };

  // 📤 ELAN YÜKLƏMƏ
  const handleUpload = async (e) => {
    e.preventDefault();
    if(!selectedImg || !form.subCat) return setStatusMsg("❌ Şəkil və alt kateqoriya mütləqdir!");
    setLoading(true);
    try {
      const fd = new FormData(); fd.append("image", selectedImg);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMG_BB_KEY}`, { method: "POST", body: fd });
      const imgData = await res.json();
      await db.collection("elanlar").add({ 
        ...form, 
        price: Number(form.price), 
        image_url: imgData.data.url, 
        ownerEmail: user.email, 
        createdAt: firebase.firestore.FieldValue.serverTimestamp() 
      });
      setView("home");
      setStatusMsg("");
    } catch { setStatusMsg("❌ Yükləmə xətası!"); }
    setLoading(false);
  };

  const filtered = items.filter(it => 
    it.title.toLowerCase().includes(query.toLowerCase()) && 
    (activeCat === "Hamısı" || it.category === activeCat)
  );

  return (
    <div className="min-h-screen pb-32 text-zinc-900">
      
      {/* 🔍 HEADER */}
      {view === "home" && (
        <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-green-500 text-2xl font-black italic tracking-tighter uppercase">ELANBAZARI</div>
            <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[8px] font-black border border-green-100 uppercase">Titan Pro</div>
          </div>
          <input type="text" placeholder="Nə axtarırsınız?" className="w-full bg-gray-50 p-4 rounded-2xl outline-none text-sm font-bold border border-transparent focus:border-green-500 transition-all" value={query} onChange={(e) => setQuery(e.target.value)} />
        </header>
      )}

      {/* 🏠 FEED */}
      {view === "home" && (
        <main className="p-4 animate__animated animate__fadeIn">
          <div className="flex gap-4 overflow-x-auto no-scrollbar mb-6">
            <button onClick={() => setActiveCat("Hamısı")} className={`min-w-[85px] p-3 rounded-[2rem] border text-[9px] font-black uppercase transition-all ${activeCat === "Hamısı" ? 'bg-green-500 text-white border-green-500' : 'text-gray-400 border-gray-100'}`}>📊 Hamısı</button>
            {Object.keys(window.MASTER_CATALOG || {}).map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)} className={`flex flex-col items-center min-w-[105px] gap-2 p-3 rounded-[2rem] border transition-all ${activeCat === cat ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-50 text-gray-400'}`}>
                <img src={window.MASTER_CATALOG[cat].img} className="w-10 h-10 rounded-xl object-cover" />
                <span className="text-[9px] font-black uppercase text-center truncate w-full">{cat}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filtered.map(item => (
              <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-50 active:scale-95 transition-all">
                <img src={item.image_url} className="w-full h-40 object-cover bg-gray-50" />
                <div className="p-4">
                  <div className="text-[#ff4f08] font-black text-xl italic">{item.price} AZN</div>
                  <h3 className="text-[10px] font-bold text-gray-700 truncate uppercase mt-1">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* 👤 AUTH / PROFILE */}
      {view === "profile" && (
        <div className="p-6">
          {!user ? (
            <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-gray-50 text-center max-w-sm mx-auto mt-10">
              <h2 className="text-xl font-black uppercase text-zinc-900 mb-2">{authStep === 1 ? "Daxil Ol" : "Təsdiqlə"}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-8">{statusMsg || "Məlumatları daxil edin"}</p>
              <form onSubmit={authStep === 1 ? sendOTP : verifyOTP} className="space-y-4">
                <input type={authStep === 1 ? "email" : "number"} required placeholder={authStep === 1 ? "nümunə@gmail.com" : "000000"} className="w-full p-5 bg-gray-50 rounded-2xl outline-none border focus:border-green-500 font-bold text-center text-lg" value={authStep === 1 ? email : otpInput} onChange={(e) => authStep === 1 ? setEmail(e.target.value) : setOtpInput(e.target.value)} />
                <button disabled={loading} className="w-full bg-green-500 text-white font-black py-5 rounded-2xl uppercase text-[10px] shadow-lg">{loading ? "Gözləyin..." : (authStep === 1 ? "Kodu Gönder" : "Daxil Ol")}</button>
              </form>
            </div>
          ) : (
            <div className="max-w-md mx-auto animate__animated animate__fadeIn">
              <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-4">
                 <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl font-black">{user.email[0].toUpperCase()}</div>
                 <div className="truncate"><h2 className="text-sm font-black uppercase text-zinc-800 truncate w-40">{user.email}</h2><p className="text-[10px] text-green-500 font-black uppercase">Titan Pro Hesab</p></div>
              </div>
              <button onClick={() => {setUser(null); localStorage.removeItem("titan_user"); setView("home");}} className="w-full py-5 bg-gray-100 text-gray-400 font-black uppercase text-[10px] rounded-2xl mt-8">Sistemdən Çıxış</button>
            </div>
          )}
        </div>
      )}

      {/* 📱 TAB BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t p-3 flex justify-around items-center z-[200] tab-shadow">
        <button onClick={() => setView("home")} className={`flex flex-col items-center gap-1 ${view === "home" ? 'text-green-500' : 'text-gray-300'}`}><span className="text-2xl">🏠</span><span className="text-[8px] font-black uppercase">Əsas</span></button>
        <div className="relative -top-6"><button onClick={() => setView("add")} className="bg-green-500 px-9 py-3.5 rounded-3xl text-white font-black text-xs shadow-2xl shadow-green-200 active:scale-90 border-4 border-white">Sat</button></div>
        <button onClick={() => setView("profile")} className={`flex flex-col items-center gap-1 ${view === "profile" ? 'text-green-500' : 'text-gray-300'}`}><span className="text-2xl">👤</span><span className="text-[8px] font-black uppercase">Profil</span></button>
      </nav>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
