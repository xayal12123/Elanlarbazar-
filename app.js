const { useState, useEffect, useRef, useMemo } = React;

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
  // --- 🔄 STATES ---
  const [items, setItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [view, setView] = useState("home"); 
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Hamısı");
  const [activeSub, setActiveSub] = useState("Bütün elanlar");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("titan_favs")) || []);

  // Auth States
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

  // --- 📡 REAL-TIME SYNC ---
  useEffect(() => {
    const syncElan = db.collection("elanlar").orderBy("createdAt", "desc")
      .onSnapshot(snap => setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));
    
    const syncChat = db.collection("messages").orderBy("createdAt", "asc")
      .onSnapshot(snap => setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))));

    return () => { syncElan(); syncChat(); };
  }, []);

  useEffect(() => { if(view === "chat") chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, view]);

  // --- 🛠️ IMAGE RESIZER (Şəkil Sıxışdırıcı) ---
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const scale = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.7);
        };
      };
    });
  };

  // --- ⚡ FUNKSİYALAR ---
  const handleCatClick = (cat) => { setActiveCat(cat); setActiveSub("Bütün elanlar"); };
  
  const toggleFav = (e, id) => {
    e.stopPropagation();
    const newFavs = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem("titan_favs", JSON.stringify(newFavs));
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true); setStatusMsg("⏳ Kod hazırlanır...");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    try {
      await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: `Titan Giriş Kodunuz: ${code}`, _subject: "Giriş Kodu" }),
      });
      setStatusMsg("✅ Kod Gmail-ə uçdu!"); setAuthStep(2);
    } catch { setStatusMsg(`⚠️ Xəta! Kod: ${code}`); setAuthStep(2); }
    setLoading(false);
  };

  const verifyOTP = (e) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      const u = { email, loginAt: new Date().toISOString(), balance: 0.00 };
      setUser(u); localStorage.setItem("titan_user", JSON.stringify(u));
      setView("home"); setStatusMsg("");
    } else { setStatusMsg("❌ Kod səhvdir!"); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if(!selectedImg || !form.phone || !form.title) return setStatusMsg("❌ Məlumatlar tam deyil!");
    setLoading(true); setStatusMsg("⏳ Şəkil sıxılır və paylaşılır...");
    try {
      const compressedBlob = await compressImage(selectedImg);
      const fd = new FormData(); fd.append("image", compressedBlob, "image.jpg");
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
    <div className="min-h-screen bg-[#f6f7fa] pb-24 font-sans text-zinc-900 overflow-x-hidden">
      
      {/* 🍔 SIDEBAR */}
      <div className={`fixed inset-0 z-[400] transition-all duration-300 ${sidebarOpen ? 'visible' : 'invisible'}`}>
        <div onClick={() => setSidebarOpen(false)} className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}></div>
        <div className={`absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl transition-transform duration-300 p-6 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-8"><h2 className="text-2xl font-black text-[#22c55e]">Titan.az</h2><button onClick={() => setSidebarOpen(false)} className="text-2xl text-gray-300">✕</button></div>
          <nav className="space-y-6 font-bold text-gray-600">
             <div className="space-y-4">
               <p className="flex items-center gap-3">🏬 Mağazalar</p>
               <p className="flex items-center gap-3">❓ Yardım</p>
               <p className="flex items-center gap-3">📄 Layihə haqqında</p>
               <p className="flex items-center gap-3">🛡️ Məxfilik siyasəti</p>
             </div>
             <div className="pt-6 border-t space-y-2">
               <p className="text-[10px] text-gray-400 uppercase font-black">Bizimlə əlaqə</p>
               <p className="text-sm">📞 (012) 526-19-19</p>
               <p className="text-sm">✉️ titan@titan.az</p>
             </div>
          </nav>
        </div>
      </div>

      {/* 🔍 HEADER */}
      {view === "home" && (
        <div className="bg-white p-4 sticky top-0 z-[100] border-b shadow-sm flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-2xl text-gray-400">☰</button>
          <div className="flex-1 bg-[#f0f1f4] px-4 py-2.5 rounded-xl flex items-center gap-3 border border-transparent focus-within:border-[#22c55e] transition-all">
             <span className="text-gray-400">🔍</span>
             <input type="text" placeholder="Nə axtarırsınız?" className="bg-transparent w-full outline-none text-sm font-medium" value={query} onChange={(e)=>setQuery(e.target.value)} />
          </div>
        </div>
      )}

      {/* 🎡 14 ANA KATALOQ */}
      {view === "home" && (
        <div className="bg-white shadow-sm mb-1 overflow-x-auto no-scrollbar flex gap-6 p-5">
           <div onClick={() => handleCatClick("Hamısı")} className="flex flex-col items-center min-w-[85px] gap-2 cursor-pointer">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl transition-all ${activeCat === "Hamısı" ? 'bg-[#22c55e] text-white shadow-lg' : 'bg-[#f0f1f4] text-gray-400'}`}>🏢</div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">Hamısı</span>
           </div>
           {Object.keys(window.MASTER_CATALOG || {}).map(cat => (
             <div key={cat} onClick={() => handleCatClick(cat)} className="flex flex-col items-center min-w-[85px] gap-2 cursor-pointer group">
                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${activeCat === cat ? 'border-[#22c55e] scale-110 shadow-lg' : 'border-white'}`}>
                  <img src={window.MASTER_CATALOG[cat].img} className="w-full h-full object-cover" />
                </div>
                <div className="text-center px-1">
                  <div className={`text-[10px] font-bold ${activeCat === cat ? 'text-[#22c55e]' : 'text-gray-600'}`}>{cat}</div>
                  <div className="text-[7px] text-gray-400 font-medium leading-tight max-w-[75px] truncate mt-0.5">{window.MASTER_CATALOG[cat].desc}</div>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* 🏷️ DAXİLİ KATALOQLAR */}
      {view === "home" && activeCat !== "Hamısı" && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 bg-white border-b border-gray-100">
          {window.MASTER_CATALOG[activeCat].subs.map(sub => (
            <button key={sub} onClick={() => setActiveSub(sub)} className={`px-4 py-2 rounded-full whitespace-nowrap text-[10px] font-black uppercase transition-all ${activeSub === sub ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-gray-400'}`}>{sub}</button>
          ))}
        </div>
      )}

      {/* 📦 ELAN FEED */}
      {view === "home" && (
        <main className="p-3 grid grid-cols-2 gap-3 animate__animated animate__fadeIn">
          {filtered.map(item => (
            <div key={item.id} onClick={() => { setSelectedItem(item); setView("details"); }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 relative active:scale-95 transition-all">
              <div className="relative h-44">
                <img src={item.image_url} className="w-full h-full object-cover" />
                <button onClick={(e) => toggleFav(e, item.id)} className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md ${favorites.includes(item.id) ? 'bg-[#22c55e] text-white' : 'bg-black/20 text-white'}`}>
                  {favorites.includes(item.id) ? '❤️' : '♡'}
                </button>
              </div>
              <div className="p-3">
                <div className="text-xl font-black text-zinc-900 tracking-tighter">{item.price} AZN</div>
                <h3 className="text-[11px] text-gray-600 font-bold h-8 line-clamp-2 mt-1 leading-tight">{item.title}</h3>
                <div className="text-[9px] text-gray-400 mt-2 font-medium">{item.city}, Bugün</div>
              </div>
            </div>
          ))}
        </main>
      )}

      {/* 📄 ELAN DETALLARI */}
      {view === "details" && selectedItem && (
        <div className="bg-white min-h-screen animate__animated animate__fadeInRight">
          <div className="relative h-80 bg-black flex items-center justify-center">
            <button onClick={() => setView("home")} className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white z-50 shadow-lg">← Geri</button>
            <img src={selectedItem.image_url} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="p-6 pb-32">
            <div className="text-3xl font-black text-[#22c55e] mb-2">{selectedItem.price} AZN</div>
            <h1 className="text-xl font-bold mb-4">{selectedItem.title}</h1>
            <div className="space-y-4 text-sm text-gray-600">
              <p className="bg-gray-50 p-4 rounded-xl"><b>Şəhər:</b> {selectedItem.city}</p>
              <p className="p-2 leading-relaxed whitespace-pre-wrap">{selectedItem.description}</p>
            </div>
          </div>
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/80 backdrop-blur-md flex gap-3 z-[100] border-t">
            <a href={`tel:${selectedItem.phone}`} className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl font-black text-center uppercase shadow-lg">Zəng et</a>
            <a href={`https://wa.me/${selectedItem.phone.replace(/\s+/g, '')}`} target="_blank" className="flex-1 bg-[#25D366] text-white py-4 rounded-2xl font-black text-center uppercase shadow-lg flex items-center justify-center gap-2">WhatsApp</a>
          </div>
        </div>
      )}

      {/* 👤 KABİNET & GİRİŞ */}
      {view === "profile" && (
        <div className="animate__animated animate__fadeIn bg-[#f8fafc] min-h-screen pb-32">
          {!user ? (
            <div className="p-6 max-w-sm mx-auto">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center mt-10">
                <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter">Giriş</h2>
                <form onSubmit={authStep === 1 ? sendOTP : verifyOTP} className="space-y-3 mb-8">
                  <input type={authStep === 1 ? "email" : "number"} required placeholder={authStep === 1 ? "Gmail ünvanınız" : "Gələn kod"} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-[#22c55e] font-bold text-center transition-all" value={authStep === 1 ? email : otpInput} onChange={(e) => authStep === 1 ? setEmail(e.target.value) : setOtpInput(e.target.value)} />
                  <button className="w-full bg-[#22c55e] text-white font-black py-4 rounded-2xl shadow-xl shadow-green-100 uppercase text-xs tracking-widest">{loading ? "..." : (authStep === 1 ? "Kod Göndər" : "Daxil Ol")}</button>
                </form>
                <div className="flex items-center gap-2 mb-8"><div className="h-[1px] bg-gray-100 flex-1"></div><span className="text-[9px] text-gray-300 font-black uppercase">və ya</span><div className="h-[1px] bg-gray-100 flex-1"></div></div>
                <div className="grid grid-cols-3 gap-3">
                  <button className="bg-[#25D366]/10 p-4 rounded-2xl text-xl">💬</button>
                  <button className="bg-[#1877F2]/10 p-4 rounded-2xl text-xl">👤</button>
                  <button className="bg-pink-50 p-4 rounded-2xl text-xl">📸</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-b-[2.5rem] shadow-sm border-b flex items-center gap-4">
                <div className="w-16 h-16 bg-[#22c55e] rounded-2xl flex items-center justify-center text-white text-2xl font-black">{user.email[0].toUpperCase()}</div>
                <div className="flex-1 truncate"><h2 className="font-black text-zinc-800 truncate">{user.email.split('@')[0]}</h2><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Aktiv İstifadəçi</p></div>
                <button onClick={()=>{setUser(null); setView("home");}} className="text-gray-300">🚪</button>
              </div>
              <div className="px-4">
                <div className="bg-zinc-900 p-6 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#22c55e] rounded-full blur-[80px] opacity-20"></div>
                  <div className="relative z-10">
                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Mənim Balansım</p>
                    <div className="text-3xl font-black">0.00 <span className="text-sm opacity-50 font-normal">AZN</span></div>
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <button className="bg-[#22c55e] text-white py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-green-900/40">Artır</button>
                      <button className="bg-white/10 text-white py-3 rounded-xl font-black text-[10px] uppercase border border-white/10">Çıxarış</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 space-y-3 pt-2">
                <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Xidmətlər</p>
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                   <button className="w-full p-5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50">
                     <div className="flex items-center gap-4"><span className="text-xl">⚡</span><div className="text-left"><h4 className="text-sm font-bold text-gray-700">Elanı VİP et</h4><p className="text-[9px] text-gray-400">Cəmi 1.00 AZN-dən başlayaraq</p></div></div>
                     <span className="text-gray-300">›</span>
                   </button>
                   <button className="w-full p-5 flex items-center justify-between border-b border-gray-50 active:bg-gray-50">
                     <div className="flex items-center gap-4"><span className="text-xl">❤️</span><div className="text-left" onClick={() => setView("favs")}><h4 className="text-sm font-bold text-gray-700">Seçilmişlər</h4><p className="text-[9px] text-gray-400">Bəyəndiyiniz elanlar</p></div></div>
                     <span className="text-gray-300">›</span>
                   </button>
                </div>
              </div>
            </div>
          )}
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
               <input type="text" placeholder="Alt kateqoriya" className="w-full p-4 bg-gray-50 rounded-xl outline-none" onChange={(e)=>setForm({...form, subCat: e.target.value})} />
               <textarea placeholder="Ətraflı təsvir..." className="w-full p-4 bg-gray-50 rounded-xl outline-none h-32" onChange={(e)=>setForm({...form, description: e.target.value})}></textarea>
               <button disabled={loading} className="w-full bg-[#22c55e] text-white py-5 rounded-2xl font-black uppercase shadow-lg">{loading ? "Yüklənir..." : "Elanı Paylaş"}</button>
               <p className="text-center text-xs text-red-500 font-bold mt-2">{statusMsg}</p>
            </form>
          )}
        </div>
      )}

      {/* 💬 ÇAT */}
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
            <input type="text" placeholder="Mesaj..." className="flex-1 bg-gray-50 p-4 rounded-xl outline-none text-sm border" value={msgInput} onChange={(e)=>setMsgInput(e.target.value)} />
            <button className="bg-[#22c55e] text-white p-4 rounded-xl shadow-lg">🚀</button>
          </form>
        </div>
      )}

      {/* 📱 TAB BAR */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-[200] shadow-lg">
        <button onClick={() => setView("home")} className={`flex flex-col items-center gap-1 ${view === "home" ? 'text-[#22c55e]' : 'text-gray-300'}`}><span className="text-xl">🏠</span><span className="text-[9px] font-black uppercase">Əsas</span></button>
        <button onClick={() => setView("chat")} className={`flex flex-col items-center gap-1 ${view === "chat" ? 'text-[#22c55e]' : 'text-gray-300'}`}><span className="text-xl">💬</span><span className="text-[9px] font-black uppercase">Çat</span></button>
        <div className="relative -top-4"><button onClick={() => setView("add")} className="bg-[#22c55e] w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl shadow-xl border-4 border-white active:scale-90 transition-all">+</button></div>
        <button onClick={() => { setView("home"); setActiveCat("Seçilmişlər"); }} className={`flex flex-col items-center gap-1 ${activeCat === "Seçilmişlər" ? 'text-[#22c55e]' : 'text-gray-300'}`}><span className="text-xl">❤️</span><span className="text-[9px] font-black uppercase">Sevimlilər</span></button>
        <button onClick={() => setView("profile")} className={`flex flex-col items-center gap-1 ${view === "profile" ? 'text-[#22c55e]' : 'text-gray-300'}`}><span className="text-xl">👤</span><span className="text-[9px] font-black uppercase">Kabinet</span></button>
      </nav>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

