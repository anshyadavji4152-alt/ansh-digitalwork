import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { ArrowUpRight, Play, Menu, X, Instagram, Youtube, MessageCircle, Sparkles, Clapperboard, Palette, Megaphone, Globe, Shield, Upload, LogOut, Plus, Trash2, ExternalLink } from "lucide-react";
import "./style.css";

const env = import.meta.env;
const supabase = env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY
  ? createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY) : null;
const waNumber = (env.VITE_WHATSAPP_NUMBER || "91XXXXXXXXXX").replace(/\D/g, "");
const categories = ["All", "Business Promotional Videos", "Education Reels", "AI Videos"];
const starter = [
  { id:"demo-1", title:"Brand Film / Showreel", category:"Business Promotional Videos", description:"A sample space for your best brand promotion work.", url:"", thumbnail:"", demo:true },
  { id:"demo-2", title:"Education Reel", category:"Education Reels", description:"Showcase educational storytelling and short-form edits.", url:"", thumbnail:"", demo:true },
  { id:"demo-3", title:"AI Creative Film", category:"AI Videos", description:"Present your AI-generated visual experiments and ads.", url:"", thumbnail:"", demo:true }
];
function App() {
  const [menu,setMenu] = useState(false);
  const [items,setItems] = useState(starter);
  const [filter,setFilter] = useState("All");
  const [playing,setPlaying] = useState(null);
  const [admin,setAdmin] = useState(false);
  const [session,setSession] = useState(null);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [title,setTitle] = useState("");
  const [category,setCategory] = useState(categories[1]);
  const [description,setDescription] = useState("");
  const [video,setVideo] = useState(null);
  const [thumb,setThumb] = useState(null);
  const [busy,setBusy] = useState(false);
  const [notice,setNotice] = useState("");
  const [mobileNav,setMobileNav] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({data}) => setSession(data.session));
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_event,s) => setSession(s));
    return () => subscription.unsubscribe();
  },[]);
  useEffect(() => {
    if (!supabase) return;
    loadVideos();
  },[]);
  async function loadVideos() {
    if (!supabase) return;
    const {data,error} = await supabase.from("portfolio_videos").select("*").order("created_at",{ascending:false});
    if (!error && data) setItems(data.length ? data : starter);
  }
  const shown = useMemo(() => filter === "All" ? items : items.filter(x=>x.category===filter),[items,filter]);
  function whatsapp(text="Hello ANSH DIGITAL! I would like to discuss a project.") {
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`,"_blank","noopener,noreferrer");
  }
  async function login(e) {
    e.preventDefault(); setNotice("");
    if (!supabase) { setNotice("Admin login setup pending. Add Supabase credentials in Netlify environment variables."); return; }
    const {error} = await supabase.auth.signInWithPassword({email,password});
    setNotice(error ? error.message : "Signed in.");
  }
  async function uploadWork(e) {
    e.preventDefault(); setNotice("");
    if (!supabase) { setNotice("Connect Supabase first. See SETUP-HI.md."); return; }
    if (!video || !title.trim()) { setNotice("Please add a title and select a video."); return; }
    if (video.size > 150 * 1024 * 1024) { setNotice("Video is over 150 MB. Compress it or use a smaller file."); return; }
    setBusy(true);
    try {
      const safe = video.name.replace(/[^a-zA-Z0-9._-]/g,"-");
      const path = `${Date.now()}-${safe}`;
      const {error:ve} = await supabase.storage.from("portfolio-videos").upload(path,video,{upsert:false,contentType:video.type});
      if (ve) throw ve;
      const {data:vd} = supabase.storage.from("portfolio-videos").getPublicUrl(path);
      let thumbnailUrl = "";
      if (thumb) {
        const tp = `${Date.now()}-${thumb.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;
        const {error:te} = await supabase.storage.from("portfolio-thumbnails").upload(tp,thumb,{upsert:false});
        if (te) throw te;
        thumbnailUrl = supabase.storage.from("portfolio-thumbnails").getPublicUrl(tp).data.publicUrl;
      }
      const {error:ie} = await supabase.from("portfolio_videos").insert({title:title.trim(),category,description,video_url:vd.publicUrl,thumbnail_url:thumbnailUrl});
      if (ie) throw ie;
      setTitle(""); setDescription(""); setVideo(null); setThumb(null);
      setNotice("Video published to your portfolio."); await loadVideos();
    } catch(err) { setNotice(err.message || "Upload failed."); }
    finally { setBusy(false); }
  }
  async function removeWork(item) {
    if (!supabase || !confirm("Delete this portfolio entry?")) return;
    const {error} = await supabase.from("portfolio_videos").delete().eq("id",item.id);
    setNotice(error ? error.message : "Portfolio entry deleted."); loadVideos();
  }
  async function logout() { if (supabase) await supabase.auth.signOut(); setAdmin(false); }
  return <div className="site">
    <header className="header">
      <a className="brand" href="#home"><span className="brand-mark">A</span><span>ANSH <b>DIGITAL</b><small>CREATIVE • DIGITAL • GROWTH</small></span></a>
      <nav className={mobileNav?"nav open":"nav"}>
        <a href="#services" onClick={()=>setMobileNav(false)}>Services</a><a href="#work" onClick={()=>setMobileNav(false)}>Our Work</a><a href="#about" onClick={()=>setMobileNav(false)}>About</a><a href="#contact" onClick={()=>setMobileNav(false)}>Contact</a>
      </nav>
      <button className="gold-btn header-cta" onClick={()=>whatsapp("Hello ANSH DIGITAL! I want to start a project.")}>Let’s Talk <ArrowUpRight size={16}/></button>
      <button className="menu-btn" onClick={()=>setMobileNav(!mobileNav)} aria-label="Toggle menu">{mobileNav?<X/>:<Menu/>}</button>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-glow"></div><div className="hero-copy">
          <div className="eyebrow"><span></span> INDEPENDENT CREATIVE & DIGITAL AGENCY</div>
          <h1>We build<br/><em>digital brands.</em></h1>
          <p className="hero-text">Ideas deserve more than attention. We turn them into powerful visuals, meaningful content and digital experiences that move businesses forward.</p>
          <div className="hero-actions"><a className="gold-btn" href="#work">Explore our work <ArrowUpRight size={17}/></a><a className="text-link" href="#services">Discover what we do <span>↗</span></a></div>
          <div className="hero-meta"><span>VIDEO • SOCIAL • AI</span><span>BASED IN LUCKNOW, INDIA</span></div>
        </div>
        <div className="hero-art"><div className="art-orbit orbit-one"></div><div className="art-orbit orbit-two"></div><div className="art-core"><span>A</span><small>AD</small></div><div className="art-tag tag-top">CREATIVE THINKING</div><div className="art-tag tag-bottom">DIGITAL IMPACT / 01</div><div className="art-cross">✳</div></div>
        <div className="hero-bottom"><span>SCROLL TO EXPLORE</span><div></div><span>01 / 04</span></div>
      </section>

      <section className="intro section-pad"><div className="section-kicker">01 — WHO WE ARE</div><div className="intro-grid"><h2>Creativity with<br/><em>a clear purpose.</em></h2><div><p>ANSH DIGITAL is a creative digital studio focused on helping brands communicate better. From scroll-stopping videos to thoughtful social media content, every project starts with a simple goal: make your brand stand out.</p><a className="under-link" href="#about">More about us <ArrowUpRight size={15}/></a></div></div></section>

      <section className="services section-pad" id="services"><div className="section-head"><div><div className="section-kicker">02 — WHAT WE DO</div><h2>Services made for<br/><em>the digital world.</em></h2></div><p>Creative execution, strategic thinking and consistent quality — all under one roof.</p></div>
        <div className="service-grid">
          <article className="service-card"><div className="service-icon"><Clapperboard/></div><span>01 / CONTENT</span><h3>Video Production<br/>& Editing</h3><p>Promotional videos, reels, shorts, explainers and brand stories.</p></article>
          <article className="service-card"><div className="service-icon"><Megaphone/></div><span>02 / GROWTH</span><h3>Social Media<br/>Marketing</h3><p>Content planning, creative campaigns and social media presence.</p></article>
          <article className="service-card"><div className="service-icon"><Sparkles/></div><span>03 / INNOVATION</span><h3>AI Content<br/>Creation</h3><p>AI visuals, creative concepts, product scenes and short-form films.</p></article>
          <article className="service-card"><div className="service-icon"><Palette/></div><span>04 / IDENTITY</span><h3>Graphic Design<br/>& Branding</h3><p>Posters, thumbnails, brand assets and visual identity design.</p></article>
        </div>
      </section>

      <section className="work section-pad" id="work"><div className="section-head work-head"><div><div className="section-kicker">03 — SELECTED PROJECTS</div><h2>Work that speaks<br/><em>for itself.</em></h2></div><p>Your creative showcase. New videos and client projects can be added from the secure admin dashboard.</p></div>
        <div className="filters">{categories.map(c=><button key={c} className={filter===c?"filter active":"filter"} onClick={()=>setFilter(c)}>{c}</button>)}</div>
        <div className="video-grid">{shown.map((v,i)=><article className="video-card" key={v.id}><div className="video-thumb" onClick={()=>v.video_url||v.url ? setPlaying(v) : setNotice("This is a portfolio placeholder. Upload your first video from Admin.")} style={v.thumbnail_url||v.thumbnail?{backgroundImage:`linear-gradient(0deg,rgba(0,0,0,.45),transparent),url(${v.thumbnail_url||v.thumbnail})`}:{}}><div className="thumb-number">0{i+1}</div><button className="play-button" aria-label="Play video"><Play fill="currentColor" size={19}/></button><span className="thumb-category">{v.category}</span></div><div className="video-info"><div><h3>{v.title}</h3><p>{v.description || "A featured ANSH DIGITAL project."}</p></div><ArrowUpRight size={18}/></div></article>)}</div>
        {shown.length===0&&<p className="empty">No projects in this category yet. Check back soon.</p>}
      </section>

      <section className="manifesto" id="about"><div className="manifesto-inner"><div className="section-kicker">04 — OUR APPROACH</div><h2>Make it meaningful.<br/><em>Make it memorable.</em></h2><p>We believe good digital work is a balance of strong ideas, sharp execution and a genuine understanding of the audience. No empty promises — just thoughtful creative work.</p><div className="manifesto-stats"><div><b>01</b><span>IDEA FIRST</span></div><div><b>02</b><span>DETAIL OBSESSED</span></div><div><b>03</b><span>BUILT TO CONNECT</span></div></div></div></section>

      <section className="contact section-pad" id="contact"><div className="section-kicker">05 — START A PROJECT</div><div className="contact-grid"><div><h2>Have a good<br/><em>idea?</em></h2><p>Let’s turn it into something people remember. Tell us what you’re building.</p></div><div className="contact-panel"><span>LET’S CREATE SOMETHING GREAT</span><h3>Tell us about<br/>your next project.</h3><button className="gold-btn" onClick={()=>whatsapp()}>Start a WhatsApp chat <MessageCircle size={17}/></button><div className="contact-note">Usually the first step is just a conversation.</div></div></div></section>
    </main>
    <footer className="footer"><a className="brand" href="#home"><span className="brand-mark">A</span><span>ANSH <b>DIGITAL</b><small>CREATIVE • DIGITAL • GROWTH</small></span></a><span>© {new Date().getFullYear()} ANSH DIGITAL. ALL RIGHTS RESERVED.</span><div className="socials"><a href="#contact" aria-label="Instagram"><Instagram/></a><a href="#contact" aria-label="YouTube"><Youtube/></a><button onClick={()=>whatsapp()} aria-label="WhatsApp"><MessageCircle/></button></div></footer>

    {playing&&<div className="modal" onClick={()=>setPlaying(null)}><div className="modal-content" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setPlaying(null)}>×</button><video src={playing.video_url||playing.url} controls autoPlay playsInline poster={playing.thumbnail_url||playing.thumbnail||undefined}/><h3>{playing.title}</h3></div></div>}

    <button className="admin-trigger" onClick={()=>setAdmin(true)} title="Admin dashboard"><Shield size={15}/></button>
    {admin&&<div className="admin-overlay"><div className="admin-panel"><div className="admin-top"><div><div className="section-kicker">ANSH DIGITAL / CONTROL ROOM</div><h2>Admin dashboard</h2></div><button className="close-admin" onClick={()=>setAdmin(false)}>×</button></div>
      {!session?<form className="admin-login" onSubmit={login}><p>Sign in to manage portfolio videos. Admin access is protected by Supabase authentication.</p><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="gold-btn" type="submit">Sign in <ArrowUpRight size={16}/></button>{!supabase&&<small className="notice">Supabase is not configured yet. Follow SETUP-HI.md to activate admin uploads.</small>}{notice&&<small className="notice">{notice}</small>}</form>
      :<><div className="admin-user"><span>Signed in — portfolio manager</span><button className="outline-btn" onClick={logout}><LogOut size={14}/> Sign out</button></div><form className="upload-form" onSubmit={uploadWork}><h3><Upload size={18}/> Upload new project</h3><label>Project title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Education Campaign Reel" required/></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select></label><label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="A short description of this project."/></label><label>Video file (MP4 recommended, max 150 MB)<input type="file" accept="video/mp4,video/webm,video/quicktime" onChange={e=>setVideo(e.target.files?.[0]||null)} required/></label><label>Thumbnail image (optional)<input type="file" accept="image/*" onChange={e=>setThumb(e.target.files?.[0]||null)}/></label><button className="gold-btn" disabled={busy}>{busy?"Uploading…":"Publish project"} <Upload size={16}/></button>{notice&&<small className="notice">{notice}</small>}</form><div className="manage-list"><h3>Published projects</h3>{items.filter(x=>!x.demo).map(x=><div className="manage-row" key={x.id}><span>{x.title}<small>{x.category}</small></span><button onClick={()=>removeWork(x)} aria-label="Delete project"><Trash2 size={16}/></button></div>)}{items.every(x=>x.demo)&&<small className="notice">No uploaded projects yet.</small>}</div></>}
    </div></div>}
    {notice&&!admin&&<div className="toast" onClick={()=>setNotice("")}>{notice}<button>×</button></div>}
  </div>;
}
createRoot(document.getElementById("root")).render(<App/>);