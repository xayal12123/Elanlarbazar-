const { useState, useEffect } = React;

const firebaseConfig = {
  apiKey: "AIzaSyDMP46oea0EhxFMrEbRClWFIt2MHT9Kccs",
  authDomain: "elan-856a5.firebaseapp.com",
  projectId: "elan-856a5",
  storageBucket: "elan-856a5.firebasestorage.app",
  messagingSenderId: "234019258715",
  appId: "1:234019258715:web:9dd195954ce65b6e5d5a7e"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ELAN KARTI
function AdCard({ title, price, city, image_url, is_vip }) {
  return (
    <div className={`bg-zinc-900 border ${is_vip ? 'border-green-500' : 'border-zinc-800'} rounded-2xl overflow-hidden shadow-lg`}>
      <div className="h-48 bg-zinc-800">
        <img src={image_url || 'https://via.placeholder.com/400x300?text=Səkil+Yoxdur'} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-sm truncate uppercase">{title}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-green-500 font-black text-xl">{price} AZN</span>
          <span className="text-zinc-500 text-[10px] uppercase font-bold">{city}</span>
        </div>
      </div>
    </div>
  );
}

// ANA APP
function App() {
  const [elanlar, setElanlar] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Forma üçün state-lər
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("Bakı");
  const [img, setImg] = useState("");

  useEffect(() => {
    const unsubscribe = db.collection("elanlar").orderBy("price", "desc").onSnapshot((snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setElanlar(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const elanPaylas = async (e) => {
    e.preventDefault();
    if(!title || !price || !img) return alert("Zəhmət olmasa bütün xanaları doldurun!");

    await db.collection("elanlar").add({
      title: title,
      price: Number(price),
      city: city,
      image_url: img,
      is_vip: false, // Yeni elanlar standart olaraq VIP olmur
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Formanı təmizləyirik
    setTitle(""); setPrice(""); setImg("");
    alert("Elanınız uğurla yerləşdirildi!");
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="p-6 border-b border-zinc-900 flex justify-between items-center bg-black sticky top-0 z-50">
        <h1 className="text-2xl font-black italic tracking-tighter">ELANBAZARI <span className="text-green-500">NOIR</span></h1>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        {/* ELAN YERLƏŞDİRMƏ FORMASI */}
        <section className="mb-12 bg-zinc-950 border border-zinc-800 p-6 rounded-3xl">
          <h2 className="text-xl font-black uppercase italic mb-4 text-green-500">Yeni Elan Yerləşdir</h2>
          <form onSubmit={elanPaylas} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Maşın modeli (məs: Mercedes S500)" className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-green-500" />
            <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="Qiymət (AZN)" className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-green-500" />
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Şəhər" className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-green-500" />
            <input value={img} onChange={e => setImg(e.target.value)} placeholder="Şəkil Linki (HızlıResim və s.)" className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-white outline-none focus:border-green-500" />
            <button type="submit" className="md:col-span-2 bg-green-500 text-black font-black py-4 rounded-xl hover:bg-green-400 transition-all uppercase italic">Elanı Canlıya At</button>
          </form>
        </section>

        <h2 className="text-4xl font-black uppercase italic mb-8 border-l-4 border-green-500 pl-4">Son Elanlar</h2>
        
        {loading ? (
          <div className="text-zinc-800 text-center py-20 font-black animate-pulse">YÜKLƏNİR...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {elanlar.map(e => <AdCard key={e.id} {...e} />)}
          </div>
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
