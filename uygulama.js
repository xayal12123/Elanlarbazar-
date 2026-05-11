const { useState, useEffect } = React;

// 1. FIREBASE SETUP
const firebaseConfig = {
  apiKey: "AIzaSyDMP46oea0EhxFMrEbRClWFIt2MHT9Kccs",
  authDomain: "elan-856a5.firebaseapp.com",
  projectId: "elan-856a5",
  storageBucket: "elan-856a5.firebasestorage.app",
  messagingSenderId: "234019258715",
  appId: "1:234019258715:web:9dd195954ce65b6e5d5a7e"
};

// Initialize Firebase Compat
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. KART KOMPONENTİ
function AdCard({ title, price, city, image_url, is_vip }) {
  return (
    <div className={`relative bg-zinc-900 border ${is_vip ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-zinc-800'} rounded-2xl overflow-hidden`}>
      {is_vip && <div className="absolute top-2 right-2 bg-green-500 text-black text-[9px] font-black px-2 py-0.5 rounded-md uppercase z-10">VIP</div>}
      <div className="h-44 bg-zinc-800">
        {image_url ? <img src={image_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-700 text-[10px]">ŞƏKİL YOXDUR</div>}
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-sm truncate uppercase">{title}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-green-500 font-black text-lg">{price} AZN</span>
          <span className="text-zinc-500 text-[10px] uppercase font-bold">{city}</span>
        </div>
      </div>
    </div>
  );
}

// 3. ANA SƏHİFƏ
function App() {
  const [elanlar, setElanlar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase-dən məlumatı çəkirik
    const unsubscribe = db.collection("elanlar").onSnapshot((snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setElanlar(list);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-900 p-6 flex justify-between items-center">
        <h1 className="text-xl font-black italic">ELANBAZARI <span className="text-green-500">NOIR</span></h1>
        <button className="bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-bold uppercase">Giriş</button>
      </header>
      <main className="p-6">
        <h2 className="text-3xl font-black uppercase italic mb-6">Son Elanlar</h2>
        {loading ? (
          <div className="text-center py-20 text-zinc-700 uppercase tracking-widest animate-pulse">Yüklənir...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {elanlar.length > 0 ? elanlar.map(e => <AdCard key={e.id} {...e} />) : <div className="text-zinc-500 uppercase text-xs font-bold">[ Hələ ki, elan yoxdur ]</div>}
          </div>
        )}
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
