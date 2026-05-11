const { useState, useEffect } = React;

// ⚙️ KONFİQURASİYA
const firebaseConfig = {
  apiKey: "AIzaSyDMP46oea0EhxFMrEbRClWFIt2MHT9Kccs",
  authDomain: "elan-856a5.firebaseapp.com",
  projectId: "elan-856a5",
  storageBucket: "elan-856a5.firebasestorage.app"
};
const IMG_BB_KEY = "01012f50423d7d208a5865ebeebbc6bc";

// Əsas ID-lər
const SERVICE_ID = "service_qckm0t8";
const TEMPLATE_ID = "template_yef0hh5";
const PUBLIC_KEY = "Y88pPsNlXwvlmZaU9";

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function App() {
  const [items, setItems] = useState([]);
  const [view, setView] = useState("home"); 
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Hamısı");
  const [loading, setLoading] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("titan_user")) || null);
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [authStep, setAuthStep] = useState(1);

  const [form, setForm] = useState({ title: "", price: "", city: "Bakı", description: "", category: "Elektronika", subCat: "" });

  useEffect(() => {
    const sync = db.collection("elanlar").orderBy("createdAt", "desc")
      .onSnapshot(snap => setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    return () => sync();
  }, []);

  // 📧 OTP GÖNDƏRMƏ (Zəmanətli Metod)
  const sendOTP = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) return alert("Düzgün Gmail yazın!");
    setLoading(true);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    
    // Konsolda kodu göstəririk (Test üçün mütləqdir)
    console.log("Sizin Təsdiq Kodunuz: " + code);

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        to_email: email,
        otp_code: code
      }, PUBLIC_KEY);

      alert("Kod Gmail-ə göndərildi! ✅");
      setAuthStep(2);
    } catch (err) {
      console.error("Xəta detalı:", err);
      alert("Xəta: " + (err.text || "Hesab tapılmadı. ID-ləri yoxlayın."));
    }
    setLoading(false);
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      const u = { email: email, date: new Date() };
      setUser(u);
      localStorage.setItem("titan_user", JSON.stringify(u));
      setView("home");
    } else { alert("Kod yanlışdır! ❌"); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if(!selectedImg || !form.subCat) return alert("Şəkil və bölmə seçin!");
    setLoading(true);
    try {
      const fd = new FormData(); fd.append("image", selectedImg);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMG_BB_KEY}`, { method: "POST", body: fd });
      const imgData = await res.json();
      await db.collection("elanlar").add({ ...form, price: Number(form.price), image_url: imgData.data.url, ownerEmail: user.email, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      setView("home");
      alert("Elan paylaşıldı! 🚀");
    } catch (err) { alert(err.message); }
    setLoading(false);
  };

  const filtered = items.filter(it => it.title.toLowerCase().includes(query.toLowerCase()) && (activeCat === "Hamısı" || it.category === activeCat));

  return (
    <div className="min-h-screen pb-32">
      {/* 🔍 HEADER */}
      {view === "home" && (
        <header className="sticky top-0 z-50 bg-white p-4 shadow-sm border-b">
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="text-green-500 text-2xl font-black italic tracking-tighter uppercase">ELANBAZARI</div>
            <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[8px] font-black border border-green-200">TITAN PRO</div>
          </div>
          <div className="relative">
            <input type="text" placeholder="Nə axtarırsınız?" className="w-full bg-gray-50 p-4 pl-12 rounded-2xl outline-none text-zinc-900 border focus:border-green-500 font-bold" value={query} onChange={(e) => setQuery(e.target.value)} />
            <span className="absolute left-4 top-4 opacity-30 text-green-500">🔍</span>
          </div>
        </header>
      )}

      {/* 🏠 FEED */}
      {view === "home" && (
        <main className="p-4 animate__animated animate__fadeIn">
          <div className="flex gap-4 overflow-x-auto no-scrollbar mb-6">
            <button onClick={() => setActiveCat("Hamısı")} className={`min-w-[90px] p-3 rounded-[2rem] border text-[9px] font-black uppercase ${activeCat === "Hamısı" ? 'bg-green-500 text-white' : 'text-gray-400 border-gray-100'}`}>📊 Hamısı</button>
            {Object.keys(window.MASTER_CATALOG || {}).map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)} className={`min-w-[110px] p-2 rounded-[2rem] border flex flex-col items-center gap-1 ${activeCat === cat ? 'border-green-500 bg-green-50 text-green-600' : 'text-gray-400 border-gray-50'}`}>
                <img src={window.MASTER_CATALOG[cat].img} className="w-10 h-10 rounded-full object-cover"/>
                <span className="text-[8px] font-black uppercase truncate w-full text-center mt-1">{cat}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filtered.map(item => (
              <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-50 active:scale-95 transition-all">
                <img src={item.image_url} className="w-full h-40 object-cover bg-gray-100"/>
                <div className="p-4">
                  <div className="text-[#ff4f08] font-black text-xl italic">{item.price} AZN</div>
                  <h3 className="text-[10px] font-bold text-gray-700 truncate uppercase mt-1 leading-tight">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* 👤 PROFILE / AUTH */}
      {view === "profile" && (
        <div className="p-6 animate__animated animate__fadeIn">
          {!user ? (
            <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 text-center max-w-sm mx-auto mt-10">
              <h2 className="text-xl font-black uppercase text-zinc-900 mb-6">{authStep === 1 ? "Giriş" : "Təsdiq"}</h2>
              <form onSubmit={authStep === 1 ? sendOTP : verifyOTP} className="space-y-4">
                <input type={authStep === 1 ? "email" : "number"} required placeholder={authStep === 1 ? "nümunə@gmail.com" : "000000"} className="w-full p-5 bg-gray-50 rounded-2xl outline-none border border-gray-200 focus:border-green-500 font-bold text-zinc-900" value={authStep === 1 ? email : otpInput} onChange={(e) => authStep === 1 ? setEmail(e.target.value) : setOtpInput(e.target.value)} />
                <button disabled={loading} className="w-full bg-green-500 text-white font-black py-5 rounded-2xl uppercase text-[10px] shadow-lg active:scale-95 transition-all">{loading ? "YÜKLƏNİR..." : (authStep === 1 ? "KODU GÖNDƏR" : "DAXİL OL")}</button>
              </form>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg">{user.email[0].toUpperCase()}</div>
                 <div className="truncate"><h2 className="text-sm font-black uppercase text-zinc-800">{user.email}</h2><p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Aktiv Hesab</p></div>
              </div>
              <button onClick={() => {setUser(null); localStorage.removeItem("titan_user"); setView("home");}} className="w-full py-5 bg-gray-200 text-gray-600 font-black uppercase text-[10px] rounded-2xl mt-8">Çıxış Et</button>
            </div>
          )}
        </div>
      )}

      {/* 📱 TAB BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-around items-center z-[200] shadow-sm">
        <button onClick={() => setView("home")} className={`flex flex-col items-center gap-1 ${view === "home" ? 'text-green-500' : 'text-gray-300'}`}><span className="text-2xl">🏠</span><span className="text-[8px] font-black uppercase">Əsas</span></button>
        <div className="relative -top-6"><button onClick={() => setView("add")} className="bg-green-500 px-9 py-3.5 rounded-2xl text-white font-black text-xs shadow-xl active:scale-90 transition-all border-4 border-white">Sat</button></div>
        <button onClick={() => setView("profile")} className={`flex flex-col items-center gap-1 ${view === "profile" ? 'text-green-500' : 'text-gray-300'}`}><span className="text-2xl">👤</span><span className="text-[8px] font-black uppercase">Kabinet</span></button>
      </nav>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
