const { useState, useEffect, useRef } = React;

// ⚙️ KONFİQURASİYA (Firebase & API)
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
  // --- STATES ---
  const [items, setItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [view, setView] = useState("home"); 
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Hamısı");
  const [activeSub, setActiveSub] = useState("Bütün elanlar");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [selectedItem, setSelectedItem] = useState(null); // Elan detalları üçün

  // Auth & User States
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("titan_user")) || null);
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [authStep, setAuthStep] = useState(1);

  // Elan Form States
  const [form, setForm] = useState({ title: "", price: "", phone: "", city: "Bakı", description: "", category: "Elektronika", subCat: "Bütün elanlar" });
  const [selectedImg, setSelectedImg] = useState(null);
  
  const chatEndRef = useRef(null);
  const [msgInput, setMsgInput] = useState("");

  // --- EFFEKTLƏR (Firebase Real-time Sync) ---
  useEffect(() => {
    // Elanları dinlə
    const syncElan = db.collection("elanlar").orderBy("createdAt", "desc")
      .onSnapshot(snap => setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    
    // Mesajları dinlə
    const syncChat = db.collection("messages").orderBy("createdAt", "asc")
      .onSnapshot(snap => setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    return () => { syncElan(); syncChat(); };
  }, []);

  useEffect(() => { if(view === "chat") chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, view]);

  // --- FUNKSİYALAR ---
  const handleCatClick = (cat) => { setActiveCat(cat); setActiveSub("Bütün elanlar"); };

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true); setStatusMsg("⏳ Kod hazırlanır...");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    try {
      await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: `ElanBazarı Giriş Kodunuz: ${code}`, _subject: "Giriş Kodu" }),
      });
      setStatusMsg("✅ Kod Gmail-ə uçdu!"); setAuthStep(2);
    } catch { setStatusMsg(`⚠️ Xəta! Kod: ${code}`); setAuthStep(2); }
    setLoading(false);
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      const u = { email, loginAt: new Date().toISOString() };
      setUser(u); localStorage.setItem("titan_user", JSON.stringify(u));
      setView("home"); setStatusMsg("");
    } else { setStatusMsg("❌ Kod səhvdir!"); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if(!selectedImg || !form.phone || !form.title) return setStatusMsg("❌ Məlumatlar tam deyil!");
    setLoading(true); setStatusMsg("⏳ Elan paylaşılır...");
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
      setView("home"); setStatusMsg("");
    } catch { setStatusMsg("❌ Yükləmə xətası!"); }
    setLoading(false);
  };

  const sendMsg = async (e) => {
    e.preventDefault();
    if (!msgInput.trim() || !user) return;
    const m = msgInput; setMsgInput("");
    await db.collection("messages").add({ text: m, user: user.email, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
  };

  const filtered = items.filter(it => 
    it.title.toLowerCase().includes(query.toLowerCase()) && 
    (activeCat === "Hamısı" || it.category === activeCat) &&
    (activeSub === "Bütün elanlar" || it.subCat === activeSub)
  );

  return (
    <div className="min-h-screen bg-[#f6f7fa] pb-24 font-sans text-zinc-900">
      
      {/* 🔍 HEADER & SEARCH */}
      {view === "home" && (
        <div className="bg-white p-4 sticky top-0 z-[100] border-b shadow-sm">
          <div className="flex items-center gap-3 bg-[#f0f1f4] px-4 py-2.5 rounded-xl border border-transparent focus-within:border-[#22c55e] transition-all">
             <span className="text-gray-400">🔍</span>
             <input type="text" placeholder="Nə axtarırsınız?" className="bg-transparent w-full outline-none text-sm font-medium" value={query} onChange={(e)=>setQuery(e.target.value)} />
          </div>
        </div>
      )}

      {/* 🎡 14 ANA KATALOQ (AI FOTOLAR) */}
      {view === "home" && (
        <div className="bg-white shadow-sm mb-1 overflow-x-auto no-scrollbar flex gap-6 p-5">
           <div onClick={() => handleCatClick("Hamısı")} className="flex flex-col items-center min-w-[75px] gap-2 cursor-pointer">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all ${activeCat === "Hamısı" ? 'bg-[#22c55e] text-white shadow-lg' : 'bg-[#f0f1f4] text-gray-400'}`}>🏢</div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Hamısı</span>
           </div>
           {Object.keys(window.MASTER_CATALOG || {}).map(cat => (
             <div key={cat} onClick={() => handleCatClick(cat)} className="flex flex-col items-center min-w-[75px] gap-2 cursor-pointer group">
                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${activeCat === cat ? 'border-[#22c55e] scale-110 shadow-lg shadow-green-100' : 'border-white'}`}>
                  <img src={window.MASTER_CATALOG[cat].img} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <span className={`text-[10px] font-bold text-center leading-tight ${activeCat === cat ? 'text-[#22c55e]' : 'text-gray-500'}`}>{cat}</span>
             </div>
           ))}
        </div>
      )}

      {/* 🏷️ DAXİLİ KATALOQLAR */}
      {view === "home" && activeCat !== "Hamısı" && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 bg-white border-b border-gray-100 animate__animated animate__fadeIn">
          {window.MASTER_CATALOG[activeCat].subs.map(sub => (
            <button key={sub} onClick={() => setActiveSub(sub)} className={`px-4 py-2 rounded-full whitespace-nowrap text-[10px] font-black uppercase transition-all ${activeSub === sub ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-gray-400'}`}>{sub}</button>
          ))}
        </div>
      )}

      {/* 📦 ELAN FEED */}
      {view === "home" && (
        <main className="p-3 grid grid-cols-2 gap-3 animate__animated animate__fadeIn">
          {filtered.map(item => (
            <div key={item.id} onClick={() => { setSelectedItem(item); setView("details"); }} className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-all border border-gray-50">
              <div className="relative h-44"><img src={item.image_url} className="w-full h-full object-cover" /></div>
              <div className="p-3">
                <div className="text-xl font-black text-zinc-900 tracking-tighter">{item.price} AZN</div>
                <h3 className="text-[11px] text-gray-600 font-bold h-8 line-clamp-2 mt-1 leading-tight">{item.title}</h3>
                <div className="text-[9px] text-gray-400 mt-2 font-medium">{item.city}, Bugün</div>
              </div>
            </div>
          ))}
        </main>
      )}

      {/* 📄 ELAN DETALLARI (WhatsApp & Call) */}
      {view === "details" && selectedItem && (
        <div className="bg-white min-h-screen animate__animated animate__fadeInRight">
          <div className="relative h-80 bg-black flex items-center justify-center">
            <button onClick={() => setView("home")} className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white z-50 shadow-lg">← Geri</button>
            <img src={selectedItem.image_url} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="p-6">
            <div className="text-3xl font-black text-[#22c55e] mb-2">{selectedItem.price} AZN</div>
            <h1 className="text-xl font-bold mb-4">{selectedItem.title}</h1>
            <div className="space-y-4 text-sm text-gray-600 mb-24">
              <p className="bg-gray-50 p-4 rounded-xl"><b>Şəhər:</b> {selectedItem.city}</p>
              <p className="bg-gray-50 p-4 rounded-xl"><b>Kateqoriya:</b> {selectedItem.category} - {selectedItem.subCat}</p>
              <p className="p-2 leading-relaxed whitespace-pre-wrap">{selectedItem.description}</p>
            </div>
            <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/80 backdrop-blur-md flex gap-3 z-[100]">
              <a href={`tel:${selectedItem.phone}`} className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl font-black text-center uppercase shadow-lg">Zəng et</a>
              <a href={`https://wa.me/${selectedItem.phone.replace(/\s+/g, '')}?text=Salam, ${selectedItem.title} elanı üçün yazıram.`} target="_blank" className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl font-black text-center uppercase shadow-lg flex items-center justify-center gap-2">WhatsApp</a>
            </div>
          </div>
        </div>
      )}

      {/* ➕ ELAN VER (Sat) */}
      {view === "add" && (
        <div className="p-6 max-w-lg mx-auto animate__animated animate__fadeInUp">
          <h2 className="text-2xl font-black mb-6 uppercase text-[#22c55e]">Yeni Elan Paylaş</h2>
          {!user ? <div className="text-center p-10 bg-white rounded-3xl"><p className="mb-4 font-bold">Giriş etməlisiniz.</p><button onClick={()=>setView("profile")} className="bg-[#22c55e] text-white px-8 py-3 rounded-xl font-bold">Giriş Səhifəsi</button></div> : (
            <form onSubmit={handleUpload} className="space-y-4 bg-white p-6 rounded-3xl shadow-sm">
               <input type="file" accept="image/*" required onChange={(e)=>setSelectedImg(e.target.files[0])} />
               <input type="text" placeholder="Məhsulun adı" className="w-full p-4 bg-gray-50 rounded-xl outline-none" onChange={(e)=>setForm({...form, title: e.target.value})} />
               <div className="flex gap-2">
                 <input type="number" placeholder="Qiymət" className="w-1/2 p-4 bg-gray-50 rounded-xl outline-none" onChange={(e)=>setForm({...form, price: e.target.value})} />
                 <input type="tel" placeholder="0501234567" className="w-1/2 p-4 bg-gray-50 rounded-xl outline-none border-2 border-green-50 font-bold" onChange={(e)=>setForm({...form, phone: e.target.value})} />
               </div>
               <select className="w-full p-4 bg-gray-50 rounded-xl outline-none font-bold" onChange={(e)=>setForm({...form, category: e.target.value})}>
                 {Object.keys(window.MASTER_CATALOG).map(c=><option key={c}>{c}</option>)}
               </select>
               <input type="text" placeholder="Alt kateqoriya (məs: iPhone 13)" className="w-full p-4 bg-gray-50 rounded-xl outline-none" onChange={(e)=>setForm({...form, subCat: e.target.value})} />
               <textarea placeholder="Ətraflı təsvir..." className="w-full p-4 bg-gray-50 rounded-xl outline-none h-32" onChange={(e)=>setForm({...form, description: e.target.value})}></textarea>
               <button disabled={loading} className="w-full bg-[#22c55e] text-white py-5 rounded-2xl font-black uppercase shadow-lg">{loading ? "Yüklənir..." : "Elanı Paylaş"}</button>
               <p className="text-center text-xs text-red-500 font-bold mt-2">{statusMsg}</p>
            </form>
          )}
        </div>
      )}

      {/* 💬 CANLI ÇAT */}
      {view === "chat" && (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-white">
          <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-50">
            <h2 className="font-black text-[#22c55e] uppercase">İcma Çatı</h2>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-[10px] font-bold text-gray-400 uppercase">Canlı</span></div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50">
            {messages.map(m => (
              <div key={m.id} className={`flex flex-col ${m.user === user?.email ? 'items-end' : 'items-start'}`}>
                <span className="text-[9px] text-gray-400 font-bold mb-1 px-2">{m.user === user?.email ? 'Sən' : m.user.split('@')[0]}</span>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium ${m.user === user?.email ? 'bg-[#22c55e] text-white rounded-tr-none' : 'bg-white text-zinc-700 shadow-sm rounded-tl-none'}`}>{m.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={sendMsg} className="p-4 border-t bg-white flex gap-2">
            <input type="text" placeholder="Mesaj yaz..." className="flex-1 bg-gray-50 p-4 rounded-xl outline-none text-sm border focus:border-[#22c55e]" value={msgInput} onChange={(e)=>setMsgInput(e.target.value)} />
            <button className="bg-[#22c55e] text-white p-4 rounded-xl shadow-lg">🚀</button>
          </form>
        </div>
      )}

      {/* 👤 PROFİL */}
      {view === "profile" && (
        <div className="p-6 max-w-sm mx-auto">
          {!user ? (
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center mt-10 animate__animated animate__zoomIn">
              <h2 className="text-2xl font-black mb-2 uppercase">{authStep === 1 ? "Giriş" : "Kod"}</h2>
              <p className="text-xs text-gray-400 font-bold mb-8 uppercase">{statusMsg || "Titan Pro Hesab"}</p>
              <form onSubmit={authStep === 1 ? sendOTP : verifyOTP} className="space-y-4">
                <input type={authStep === 1 ? "email" : "number"} required placeholder="Gmail ünvanınız" className="w-full p-4 bg-gray-50 rounded-xl outline-none border focus:border-[#22c55e] font-bold text-center" value={authStep === 1 ? email : otpInput} onChange={(e) => authStep === 1 ? setEmail(e.target.value) : setOtpInput(e.target.value)} />
                <button className="w-full bg-[#22c55e] text-white font-black py-4 rounded-xl shadow-xl">{loading ? "..." : (authStep === 1 ? "Kodu Gönder" : "Daxil Ol")}</button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
               <div className="w-14 h-14 bg-[#22c55e] rounded-full flex items-center justify-center text-white text-2xl font-bold">{user.email[0].toUpperCase()}</div>
               <div className="truncate flex-1"><h2 className="font-bold text-sm truncate">{user.email}</h2><p className="text-[10px] text-green-500 font-black uppercase tracking-widest">Aktiv</p></div>
               <button onClick={()=>{setUser(null); localStorage.removeItem("titan_user"); setView("home");}} className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg">Çıxış</button>
            </div>
          )}
        </div>
      )}

      {/* 📱 TAB BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-[200] shadow-lg">
        <button onClick={() => setView("home")} className={`flex flex-col items-center gap-1 ${view === "home" ? 'text-[#22c55e]' : 'text-gray-300'}`}><span className="text-xl">🏠</span><span className="text-[9px] font-black uppercase">Əsas</span></button>
        <button onClick={() => setView("chat")} className={`flex flex-col items-center gap-1 ${view === "chat" ? 'text-[#22c55e]' : 'text-gray-300'}`}><span className="text-xl">💬</span><span className="text-[9px] font-black uppercase">Çat</span></button>
        <div className="relative -top-4"><button onClick={() => setView("add")} className="bg-[#22c55e] w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl shadow-xl border-4 border-white active:scale-90 transition-all">+</button></div>
        <button className="flex flex-col items-center gap-1 text-gray-300"><span className="text-xl">❤️</span><span className="text-[9px] font-black uppercase">Sevimlilər</span></button>
        <button onClick={() => setView("profile")} className={`flex flex-col items-center gap-1 ${view === "profile" ? 'text-[#22c55e]' : 'text-gray-300'}`}><span className="text-xl">👤</span><span className="text-[9px] font-black uppercase">Kabinet</span></button>
      </nav>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
