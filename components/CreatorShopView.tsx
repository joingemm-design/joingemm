"use client";
import { useState, useEffect } from "react";
import { getUserByUsername } from "@/lib/db";
import BrockFooter from "@/components/BrockFooter";
import { getUserShops } from "@/lib/shop";

export default function CreatorShopView({ username }: { username: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [quoteModal, setQuoteModal] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartAdded, setCartAdded] = useState<string|null>(null);
  const [buyingProduct, setBuyingProduct] = useState<string|null>(null);
  const [checkoutComingSoon, setCheckoutComingSoon] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find((i:any) => i.id === product.id);
      if (existing) return prev.map((i:any) => i.id === product.id ? {...i, qty: i.qty+1} : i);
      return [...prev, {...product, qty: 1}];
    });
    setCartAdded(product.id);
    setTimeout(() => setCartAdded(null), 1400);
  };

  const removeFromCart = (id: string) => setCart((prev:any[]) => prev.filter((i:any) => i.id !== id));
  const cartTotal = cart.reduce((sum:number, i:any) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum:number, i:any) => sum + i.qty, 0);

  const handlePurchase = async (product: any) => {
    setBuyingProduct(product.id);
    try {
      const res = await fetch("https://us-central1-gemm-8cda2.cloudfunctions.net/createShopCheckout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          shopId: product.shopId || "",
          creatorUid: profile.uid,
          customerEmail: "",
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setCheckoutComingSoon(true);
    } catch {
      setCheckoutComingSoon(true);
    }
    setBuyingProduct(null);
  };

  const handleCartCheckout = async () => {
    if (cart.length === 0) return;
    setBuyingProduct("cart");
    try {
      const res = await fetch("https://us-central1-gemm-8cda2.cloudfunctions.net/createShopCheckout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: cart[0].id,
          productName: cart.map((i:any) => i.name).join(", "),
          productPrice: cartTotal,
          shopId: cart[0].shopId || "",
          creatorUid: profile.uid,
          customerEmail: "",
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Checkout unavailable.");
    } catch {
      alert("Something went wrong.");
    }
    setBuyingProduct(null);
  };

  useEffect(() => {
    async function load() {
      const p = await getUserByUsername(username);
      if (!p) { setLoading(false); return; }
      setProfile(p);
      const s = await getUserShops(p.uid);
      setShops(s);
      setLoading(false);
    }
    load();
  }, [username]);

  if (loading) return (
    <div style={{minHeight:"100vh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{width:24,height:24,borderRadius:"50%",border:"2px solid #fff",borderTopColor:"transparent",animation:"spin 1s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!profile) return <div style={{minHeight:"100vh",background:"#000",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>Shop not found</div>;

  const allProducts = shops.flatMap((s:any) => s.products || []);
  const categories = ["All", ...Array.from(new Set(allProducts.map((p:any) => p.category).filter(Boolean))) as string[]];
  const filtered = filter === "All" ? allProducts : allProducts.filter((p:any) => p.category === filter);
  const bg = "#000";
  const text = "#fff";

  return (
    <div style={{minHeight:"100vh",background:bg,color:text,fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .product-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;transition:transform .2s,border-color .2s;cursor:pointer}
        .product-card:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.2)}
        .filter-btn{padding:8px 20px;border-radius:9999px;border:1.5px solid rgba(255,255,255,.2);background:transparent;color:#fff;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .2s;font-family:inherit}
        .filter-btn.active{background:#fff;color:#000;border-color:#fff}
        .filter-btn:hover{border-color:rgba(255,255,255,.5)}
      `}</style>

      {/* Header */}
      <div style={{borderBottom:"1px solid rgba(255,255,255,.08)",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"rgba(0,0,0,.9)",backdropFilter:"blur(12px)",zIndex:10}}>
        <a href={"/"+username} style={{display:"flex",alignItems:"center",gap:12,textDecoration:"none",color:"#fff"}}>
          {profile.photoURL&&<img src={profile.photoURL} referrerPolicy="no-referrer" alt="" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover"}}/>}
          <div>
            <div style={{fontWeight:900,fontSize:15,letterSpacing:"-.01em"}}>{profile.displayName}</div>
            <div style={{fontSize:11,opacity:.4,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}>Shop</div>
          </div>
        </a>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {cartCount > 0 && (
            <button onClick={()=>setCartOpen(true)} style={{padding:"8px 18px",borderRadius:9999,background:"#fff",color:"#000",border:"none",fontWeight:900,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
              🛒 <span style={{background:"#000",color:"#fff",borderRadius:9999,padding:"2px 8px",fontSize:11,fontWeight:900}}>{cartCount}</span>
            </button>
          )}
          <a href={"/"+username} style={{fontSize:11,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",color:"rgba(255,255,255,.4)",textDecoration:"none"}}>← BACK</a>
        </div>
      </div>

      {/* Hero */}
      <div style={{padding:"60px 24px 40px",textAlign:"center",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:".2em",textTransform:"uppercase",opacity:.4,marginBottom:12}}>SEALS SHOP</div>
        <h1 style={{fontSize:"clamp(32px,8vw,72px)",fontWeight:900,letterSpacing:"-.04em",lineHeight:.95,marginBottom:16}}>{profile.displayName?.toUpperCase()}</h1>
        <p style={{fontSize:14,opacity:.5,maxWidth:400,margin:"0 auto",lineHeight:1.6}}>Original art, prints, and custom sneakers</p>
      </div>

      {/* Filters */}
      {categories.length > 1 && (
        <div style={{padding:"24px",display:"flex",gap:8,flexWrap:"wrap",justifyContent:"center",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
          {categories.map((cat:string) => (
            <button key={cat} className={"filter-btn"+(filter===cat?" active":"")} onClick={()=>setFilter(cat)}>{cat}</button>
          ))}
        </div>
      )}

      {/* Products grid */}
      <div style={{padding:"32px 24px",maxWidth:1100,margin:"0 auto"}}>
        {filtered.length === 0 ? (
          <div style={{textAlign:"center",padding:"80px 0",opacity:.3,fontSize:14}}>No products found</div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20}}>
            {filtered.map((product:any) => (
              <div key={product.id} className="product-card" onClick={()=>{ setQuoteModal(product); setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : null); }}>
                <div style={{aspectRatio:"1",overflow:"hidden",background:"rgba(255,255,255,.03)"}}>
                  {product.imageURL
                    ? <img src={product.imageURL} alt={product.name} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform .4s"}} onMouseOver={e=>(e.currentTarget.style.transform="scale(1.05)")} onMouseOut={e=>(e.currentTarget.style.transform="scale(1)")}/>
                    : <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>🎨</div>}
                </div>
                <div style={{padding:"16px"}}>
                  {product.category&&<div style={{fontSize:10,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",opacity:.4,marginBottom:6}}>{product.category}</div>}
                  <div style={{fontWeight:800,fontSize:15,marginBottom:8,lineHeight:1.3}}>{product.name}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontWeight:900,fontSize:18}}>${product.price?.toFixed(2)}</div>
                    <button style={{padding:"8px 16px",borderRadius:9999,background:"#fff",color:"#000",border:"none",fontSize:11,fontWeight:800,cursor:"pointer",letterSpacing:".08em",textTransform:"uppercase"}}>Buy Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product modal */}
      {quoteModal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setQuoteModal(null)}>
          <div style={{background:"#111",borderRadius:24,maxWidth:480,width:"100%",overflow:"hidden",border:"1px solid rgba(255,255,255,.1)",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            {quoteModal.imageURL&&<img src={quoteModal.imageURL} alt={quoteModal.name} style={{width:"100%",maxHeight:280,objectFit:"cover"}}/>}
            <div style={{padding:24}}>
              {quoteModal.category&&<div style={{fontSize:10,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",opacity:.4,marginBottom:8}}>{quoteModal.category}</div>}
              <div style={{fontWeight:900,fontSize:22,marginBottom:8,lineHeight:1.2}}>{quoteModal.name}</div>
              <div style={{fontWeight:900,fontSize:28,marginBottom:12}}>${quoteModal.price?.toFixed(2)}</div>
              {quoteModal.description && <div style={{fontSize:13,lineHeight:1.7,opacity:.7,marginBottom:16,padding:"10px",borderRadius:8,border:"1px solid rgba(255,255,255,.1)"}}>{quoteModal.description}</div>}
              {quoteModal.variants && quoteModal.variants.length > 0 && (
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:10,fontWeight:800,letterSpacing:".12em",textTransform:"uppercase",opacity:.4,marginBottom:8}}>Format</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {quoteModal.variants.map((v: any) => (
                      <button key={v.label} onClick={()=>setSelectedVariant(v)}
                        style={{padding:"10px 14px",borderRadius:8,border:selectedVariant && selectedVariant.label===v.label?"2px solid #fff":"1px solid rgba(255,255,255,.2)",background:selectedVariant && selectedVariant.label===v.label?"rgba(255,255,255,.12)":"transparent",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left",fontFamily:"inherit"}}>
                        <span>{v.label}</span>
                        <span style={{opacity:.7}}>{"$"+v.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {checkoutComingSoon ? (
                <div style={{textAlign:"center",padding:"14px",borderRadius:9999,background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",fontSize:13,fontWeight:700,color:"rgba(255,255,255,.5)",letterSpacing:".06em"}}>
                  Checkout coming soon
                </div>
              ) : (
                <button
                  onClick={()=>handlePurchase(selectedVariant ? Object.assign({}, quoteModal, {price: selectedVariant.price, name: quoteModal.name+' - '+selectedVariant.label}) : quoteModal)}
                  disabled={buyingProduct===quoteModal.id}
                  style={{display:"block",width:"100%",padding:"16px",borderRadius:9999,background:"#fff",color:"#000",border:"none",fontWeight:900,fontSize:14,letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer",opacity:buyingProduct===quoteModal.id?0.6:1}}
                >
                  {buyingProduct===quoteModal.id ? "Redirecting..." : "Purchase"}
                </button>
              )}
              <button
                onClick={()=>{ addToCart(selectedVariant ? Object.assign({}, quoteModal, {price: selectedVariant.price, name: quoteModal.name+' - '+selectedVariant.label}) : quoteModal); setQuoteModal(null); }}
                style={{display:"block",width:"100%",padding:"14px",marginTop:10,borderRadius:9999,background:"transparent",color:"#fff",border:"1px solid rgba(255,255,255,.2)",fontSize:13,fontWeight:800,cursor:"pointer",letterSpacing:".06em",textTransform:"uppercase"}}
              >
                {cartAdded===quoteModal.id ? "✓ Added!" : "Add to Cart"}
              </button>
              <button onClick={()=>{ setQuoteModal(null); setCheckoutComingSoon(false); }} style={{display:"block",width:"100%",padding:"12px",marginTop:8,borderRadius:9999,background:"transparent",color:"rgba(255,255,255,.3)",border:"none",fontSize:12,fontWeight:700,cursor:"pointer"}}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&setCartOpen(false)}>
          <div style={{background:"#111",border:"1px solid rgba(255,255,255,.12)",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:520,padding:28,maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontWeight:900,fontSize:18}}>Your Cart</div>
              <button onClick={()=>setCartOpen(false)} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",opacity:.5}}>✕</button>
            </div>
            {cart.length===0?(
              <div style={{textAlign:"center",padding:"40px 0",opacity:.3,fontSize:14}}>Cart is empty</div>
            ):(
              <>
                {cart.map((item:any)=>(
                  <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 0",borderBottom:"1px solid rgba(255,255,255,.07)"}}>
                    {item.imageURL&&<img src={item.imageURL} alt={item.name} style={{width:52,height:52,borderRadius:8,objectFit:"cover"}}/>}
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,fontSize:14}}>{item.name}</div>
                      <div style={{opacity:.4,fontSize:12,marginTop:2}}>Qty: {item.qty} &middot; ${(item.price*item.qty).toFixed(2)}</div>
                    </div>
                    <button onClick={()=>removeFromCart(item.id)} style={{background:"none",border:"none",color:"rgba(255,255,255,.3)",fontSize:18,cursor:"pointer"}}>✕</button>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"18px 0 8px",fontWeight:900,fontSize:16}}>
                  <span>Total</span><span>${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCartCheckout}
                  disabled={buyingProduct==="cart"}
                  style={{display:"block",width:"100%",padding:"16px",marginTop:8,borderRadius:9999,background:"#fff",color:"#000",border:"none",fontWeight:900,fontSize:14,letterSpacing:".08em",textTransform:"uppercase",cursor:"pointer",opacity:buyingProduct==="cart"?0.6:1}}
                >
                  {buyingProduct==="cart" ? "Redirecting..." : "Checkout →"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <BrockFooter username={username} />
    </div>
  );
}
