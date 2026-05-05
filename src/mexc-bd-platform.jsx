import { useState, useEffect, useRef } from "react";

const STAGE_COLORS = {
  "Listed":      { bg:"rgba(16,185,129,0.13)", text:"#10b981", dot:"#10b981" },
  "Post-Launch": { bg:"rgba(59,130,246,0.13)", text:"#3b82f6", dot:"#3b82f6" },
  "Pre-Launch":  { bg:"rgba(245,158,11,0.13)", text:"#f59e0b", dot:"#f59e0b" },
  "Presale":     { bg:"rgba(139,92,246,0.13)", text:"#8b5cf6", dot:"#8b5cf6" },
  "ICO":         { bg:"rgba(236,72,153,0.13)", text:"#ec4899", dot:"#ec4899" },
};

const ALL_PROJECTS = [
  { id:1,  rank:1,  name:"Bitcoin",          symbol:"BTC",     logo:"₿",  category:"Layer 1",       stage:"Listed",      chain:"Bitcoin",    trendScore:88, isNew:false, addedDaysAgo:3000, price:"$97,420",  change24h:"+1.8%",  mcapRaw:1930,  mcap:"$1.93T",  volume:"$38.0B",  tge:"Listed",   twitter:"@bitcoin",        description:"The original decentralized cryptocurrency.", tags:["Layer 1","Store of Value"] },
  { id:2,  rank:2,  name:"Ethereum",         symbol:"ETH",     logo:"⟠",  category:"Layer 1",       stage:"Listed",      chain:"Ethereum",   trendScore:92, isNew:false, addedDaysAgo:3000, price:"$3,241",   change24h:"+2.4%",  mcapRaw:389,   mcap:"$389B",   volume:"$18.4B",  tge:"Listed",   twitter:"@ethereum",       description:"Decentralized platform enabling smart contracts and dApps.", tags:["Layer 1","Smart Contract"] },
  { id:3,  rank:3,  name:"Solana",           symbol:"SOL",     logo:"◎",  category:"Layer 1",       stage:"Listed",      chain:"Solana",     trendScore:89, isNew:false, addedDaysAgo:1800, price:"$178",     change24h:"+3.1%",  mcapRaw:83,    mcap:"$83B",    volume:"$4.2B",   tge:"Listed",   twitter:"@solana",         description:"High-performance blockchain supporting fast transactions.", tags:["Layer 1","DeFi"] },
  { id:4,  rank:4,  name:"Hyperliquid",      symbol:"HYPE",    logo:"💧", category:"DeFi",          stage:"Post-Launch", chain:"Hyperliquid",trendScore:97, isNew:false, addedDaysAgo:180,  price:"$18.42",   change24h:"+3.1%",  mcapRaw:6.1,   mcap:"$6.1B",   volume:"$512M",   tge:"Nov 2024", twitter:"@HyperliquidX",   description:"High-performance perpetuals DEX with its own L1 blockchain.", tags:["DeFi","Perpetuals","DEX"] },
  { id:5,  rank:5,  name:"Berachain",        symbol:"BERA",    logo:"🐻", category:"Layer 1",       stage:"Post-Launch", chain:"Berachain",  trendScore:88, isNew:false, addedDaysAgo:90,   price:"$4.21",    change24h:"+8.3%",  mcapRaw:1.4,   mcap:"$1.4B",   volume:"$234M",   tge:"Feb 2025", twitter:"@berachain",      description:"EVM-identical L1 blockchain using Proof of Liquidity consensus.", tags:["Layer 1","PoL","DeFi"] },
  { id:6,  rank:6,  name:"Virtuals Protocol",symbol:"VIRTUAL", logo:"🤖", category:"AI",            stage:"Post-Launch", chain:"Base",       trendScore:95, isNew:false, addedDaysAgo:150,  price:"$1.24",    change24h:"+12.4%", mcapRaw:1.24,  mcap:"$1.24B",  volume:"$189M",   tge:"Nov 2024", twitter:"@virtuals_io",    description:"Platform for launching and co-owning AI agents on Base.", tags:["AI","Agents"] },
  { id:7,  rank:7,  name:"Kaito AI",         symbol:"KAITO",   logo:"🧠", category:"AI",            stage:"Post-Launch", chain:"Ethereum",   trendScore:91, isNew:true,  addedDaysAgo:11,   price:"$1.67",    change24h:"+21.3%", mcapRaw:0.334, mcap:"$334M",   volume:"$98M",    tge:"Feb 2025", twitter:"@KaitoAI",        description:"AI-powered crypto intelligence and attention analytics.", tags:["AI","Analytics"] },
  { id:8,  rank:8,  name:"Movement",         symbol:"MOVE",    logo:"🌀", category:"Layer 2",       stage:"Post-Launch", chain:"Ethereum",   trendScore:85, isNew:true,  addedDaysAgo:45,   price:"$0.44",    change24h:"+6.8%",  mcapRaw:0.44,  mcap:"$440M",   volume:"$71M",    tge:"Dec 2024", twitter:"@movementlabsxyz",description:"Move-based L2 bringing fast secure smart contracts to Ethereum.", tags:["Layer 2","Move"] },
  { id:9,  rank:9,  name:"EigenLayer",       symbol:"EIGEN",   logo:"🔷", category:"Infrastructure",stage:"Post-Launch", chain:"Ethereum",   trendScore:83, isNew:false, addedDaysAgo:310,  price:"$1.83",    change24h:"+4.1%",  mcapRaw:0.73,  mcap:"$730M",   volume:"$55M",    tge:"Apr 2024", twitter:"@eigenlayer",     description:"Restaking protocol that extends Ethereum cryptoeconomic security.", tags:["Restaking","Infrastructure"] },
  { id:10, rank:10, name:"Story Protocol",   symbol:"IP",      logo:"📖", category:"Infrastructure",stage:"Post-Launch", chain:"Story",      trendScore:71, isNew:false, addedDaysAgo:120,  price:"$3.84",    change24h:"-2.8%",  mcapRaw:0.892, mcap:"$892M",   volume:"$67M",    tge:"Jan 2025", twitter:"@StoryProtocol",  description:"Blockchain for programmable IP, making IP assets on-chain.", tags:["IP","Infrastructure"] },
  { id:11, rank:11, name:"Grass",            symbol:"GRASS",   logo:"🌿", category:"DePIN",         stage:"Post-Launch", chain:"Solana",     trendScore:79, isNew:false, addedDaysAgo:200,  price:"$1.82",    change24h:"-4.2%",  mcapRaw:0.363, mcap:"$363M",   volume:"$41M",    tge:"Oct 2024", twitter:"@getgrass_io",    description:"Decentralized AI data network powered by unused bandwidth.", tags:["DePIN","AI"] },
  { id:12, rank:12, name:"zkSync",           symbol:"ZK",      logo:"⚡", category:"Layer 2",       stage:"Post-Launch", chain:"Ethereum",   trendScore:66, isNew:false, addedDaysAgo:320,  price:"$0.156",   change24h:"+5.7%",  mcapRaw:0.62,  mcap:"$620M",   volume:"$89M",    tge:"Jun 2024", twitter:"@zksync",         description:"Zero-knowledge rollup scaling Ethereum to millions of TPS.", tags:["Layer 2","ZK Rollup"] },
  { id:13, rank:13, name:"Monad",            symbol:"MON",     logo:"🟣", category:"Layer 1",       stage:"Pre-Launch",  chain:"Monad",      trendScore:99, isNew:true,  addedDaysAgo:3,    price:"TGE Soon", change24h:"—",      mcapRaw:0,     mcap:"—",       volume:"—",       tge:"Q3 2025",  twitter:"@monad_xyz",      description:"EVM-compatible L1 with 10,000 TPS through parallel execution.", tags:["Layer 1","EVM"] },
  { id:14, rank:14, name:"Initia",           symbol:"INIT",    logo:"🌐", category:"Layer 1",       stage:"Pre-Launch",  chain:"Cosmos",     trendScore:86, isNew:true,  addedDaysAgo:5,    price:"TGE Soon", change24h:"—",      mcapRaw:0,     mcap:"—",       volume:"—",       tge:"Q2 2025",  twitter:"@initiaxyz",      description:"Interwoven L1 for interwoven rollups built on Cosmos.", tags:["Layer 1","Cosmos"] },
  { id:15, rank:15, name:"Plume Network",    symbol:"PLUME",   logo:"🪶", category:"RWA",           stage:"Pre-Launch",  chain:"Ethereum",   trendScore:81, isNew:true,  addedDaysAgo:7,    price:"TGE Soon", change24h:"—",      mcapRaw:0,     mcap:"—",       volume:"—",       tge:"Q3 2025",  twitter:"@plumenetwork",   description:"L2 blockchain purpose-built for real-world assets tokenization.", tags:["RWA","Layer 2"] },
  { id:16, rank:16, name:"Sahara AI",        symbol:"SAHARA",  logo:"🏜️",category:"AI",            stage:"Pre-Launch",  chain:"Ethereum",   trendScore:84, isNew:true,  addedDaysAgo:4,    price:"TGE Soon", change24h:"—",      mcapRaw:0,     mcap:"—",       volume:"—",       tge:"Q3 2025",  twitter:"@SaharaLabsAI",   description:"Decentralized AI network for building and monetizing AI models.", tags:["AI","DePIN"] },
  { id:17, rank:17, name:"Nillion",          symbol:"NIL",     logo:"🔐", category:"Infrastructure",stage:"Pre-Launch",  chain:"Cosmos",     trendScore:77, isNew:true,  addedDaysAgo:9,    price:"TGE Soon", change24h:"—",      mcapRaw:0,     mcap:"—",       volume:"—",       tge:"Q2 2025",  twitter:"@nillionnetwork", description:"Decentralized network for high-value data using blind computation.", tags:["Privacy","Infrastructure"] },
  { id:18, rank:18, name:"Polymarket",       symbol:"POLY",    logo:"📈", category:"DeFi",          stage:"Pre-Launch",  chain:"Polygon",    trendScore:89, isNew:true,  addedDaysAgo:2,    price:"TGE Soon", change24h:"—",      mcapRaw:0,     mcap:"—",       volume:"—",       tge:"Q2 2025",  twitter:"@Polymarket",     description:"World's largest prediction market platform powered by blockchain.", tags:["Prediction","DeFi"] },
  { id:19, rank:19, name:"Arbitrum",         symbol:"ARB",     logo:"🔵", category:"Layer 2",       stage:"Post-Launch", chain:"Ethereum",   trendScore:74, isNew:false, addedDaysAgo:700,  price:"$0.842",   change24h:"-1.2%",  mcapRaw:3.3,   mcap:"$3.3B",   volume:"$312M",   tge:"Mar 2023", twitter:"@arbitrum",       description:"Ethereum Layer 2 scaling solution using Optimistic Rollups.", tags:["Layer 2","Scaling"] },
  { id:20, rank:20, name:"Sui",              symbol:"SUI",     logo:"💧", category:"Layer 1",       stage:"Post-Launch", chain:"Sui",        trendScore:82, isNew:false, addedDaysAgo:400,  price:"$3.42",    change24h:"+5.2%",  mcapRaw:9.8,   mcap:"$9.8B",   volume:"$890M",   tge:"May 2023", twitter:"@SuiNetwork",     description:"Layer 1 blockchain built with Move language for fast finality.", tags:["Layer 1","Move"] },
];

const VIEW_TABS = [
  { id:"top",      label:"🏆 Top",         desc:"By market cap" },
  { id:"trending", label:"🔥 Trending",    desc:"Hottest right now" },
  { id:"new",      label:"✨ New",         desc:"Added last 14 days" },
  { id:"gainers",  label:"📈 Gainers",     desc:"Top 24h movers" },
];

const CAT_TABS = [
  { id:"all",    label:"All" },
  { id:"l1",     label:"⛓ L1/L2" },
  { id:"defi",   label:"💎 DeFi" },
  { id:"ai",     label:"🤖 AI" },
  { id:"depin",  label:"📡 DePIN" },
  { id:"rwa",    label:"🏦 RWA" },
  { id:"infra",  label:"🔧 Infra" },
];

const CAT_KEYS = {
  l1:   ["Layer 1","Layer 2"],
  defi: ["DeFi","Stablecoin"],
  ai:   ["AI"],
  depin:["DePIN"],
  rwa:  ["RWA"],
  infra:["Infrastructure"],
};

const STAGE_OPTIONS = ["All","Listed","Post-Launch","Pre-Launch","Presale","ICO"];

function applyView(arr, v) {
  if (v==="top")      return [...arr].sort((a,b)=>b.mcapRaw-a.mcapRaw);
  if (v==="trending") return [...arr].sort((a,b)=>b.trendScore-a.trendScore);
  if (v==="new")      return arr.filter(p=>p.addedDaysAgo<=14).sort((a,b)=>a.addedDaysAgo-b.addedDaysAgo);
  if (v==="gainers")  return [...arr].filter(p=>p.change24h!=="—").sort((a,b)=>{
    const pa = parseFloat(a.change24h)||0, pb = parseFloat(b.change24h)||0;
    return pb - pa;
  });
  return arr;
}

function StagePill({ stage }) {
  const s = STAGE_COLORS[stage] || STAGE_COLORS["Listed"];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ background: s.bg, color: s.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {stage}
    </span>
  );
}

function ScoreBar({ score, color = "#ff6a00" }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-1.5 h-3 rounded-sm"
            style={{ background: i < Math.round(score / 10) ? color : "rgba(255,255,255,0.07)" }} />
        ))}
      </div>
      <span className="text-xs font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

const SAFE_API = async (messages) => {
  try {
    const res = await fetch("https://scout-backend-8tru.onrender.com/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages,
      }),
    });
    const d = await res.json().catch(() => null);
    if (!res.ok) return Object.assign({ _err: true, stop_reason: "end_turn", content: [] }, d);
    return d || { _err: true, stop_reason: "end_turn", content: [] };
  } catch (e) {
    return { _err: true, stop_reason: "end_turn", content: [] };
  }
};

const SAFE_JSON = (text) => {
  try {
    const m = (text || "").match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : null;
  } catch {
    return null;
  }
};

const SB_URL = "https://omxeljgktkghgrjbzxpf.supabase.co";
const SB_KEY = "sb_publishable_yZOkLpux3c6_TUSv0Ym15A_zhWk752_";

const sbFetch = async (path, method, body) => {
  try {
    const opts = {
      method: method || "GET",
      headers: {
        "Content-Type": "application/json",
        "apikey": SB_KEY,
        "Authorization": "Bearer " + SB_KEY,
        "Prefer": method === "POST" ? "return=representation" : "",
      },
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(SB_URL + "/rest/v1" + path, opts);
    if (!res.ok) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  } catch(e) { return null; }
};

const sbGetHistory = () => sbFetch("/scout_history?order=created_at.desc&limit=200");
const sbAddHistory = (entry) => sbFetch("/scout_history", "POST", {
  name: entry.name || "", symbol: entry.symbol || "", logo: entry.logo || "🛸",
  source: entry.source || "Scout AI", twitter: entry.twitter || "",
  website: entry.website || "", chain: entry.chain || "",
  bd_email: entry.bdEmail || "", bd_telegram: entry.bdTelegram || "",
  best_contact_path: entry.bestContactPath || "", confidence: entry.confidence || "",
  description: entry.description || "", full_result: entry.fullResult || null,
});
const sbGetPipeline = () => sbFetch("/scout_pipeline?order=created_at.desc");
const sbAddPipeline = (p) => sbFetch("/scout_pipeline", "POST", {
  project_id: String(p.id), name: p.name || "", symbol: p.symbol || "",
  logo: p.logo || "", twitter: p.twitter || "", website: p.website || "",
  chain: p.chain || "", category: p.category || "", stage: p.stage || "",
  description: p.description || "",
});
const sbRemovePipeline = (project_id) => sbFetch("/scout_pipeline?project_id=eq." + project_id, "DELETE");



function AIContactModal({ project, onClose }) {
  const [phase,    setPhase]    = useState("idle");
  const [contacts, setContacts] = useState(null);
  const [stream,   setStream]   = useState("");
  const [copied,   setCopied]   = useState(null);

  const fallback = (msg) => ({
    summary: msg,
    contacts: [{ name: "Team", role: "Official Contact", twitter: project.twitter, confidence: "Low", source: "Fallback", bestPath: "Twitter DM", notes: "Reach via Twitter DM or official website." }],
    bdEmail: "Unknown", bdTelegram: "Unknown",
    bestContactPath: `Twitter DM: ${project.twitter}`,
    bestApproach: `Reach out to ${project.twitter} on Twitter for exchange listing discussion.`,
    listingInterest: "Medium",
  });

  const run = async () => {
    setPhase("searching"); setStream(""); setContacts(null);
    const prompt = `Find BD contacts for crypto project "${project.name}" (${project.symbol}), Twitter: ${project.twitter}.
Search website, Linktree, CoinGecko, LinkedIn. NEVER invent emails.
Return ONLY raw JSON: {"summary":"string","contacts":[{"name":"string","role":"string","email":"omit if not found","twitter":"@handle","linkedin":"url","telegram":"@handle","confidence":"High|Medium|Low","source":"url","bestPath":"Email|Twitter DM|LinkedIn|Telegram","notes":"string"}],"bdEmail":"verified or Unknown","bdTelegram":"string","bestContactPath":"specific path","bestApproach":"3 sentence Scout pitch","listingInterest":"High|Medium|Low"}`;
    try {
      const res = await fetch("https://scout-backend-8tru.onrender.com/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 1024, stream: true,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: prompt }] }),
      });
      if (!res.ok || !res.body) { setContacts(fallback("AI unavailable. Research manually.")); setPhase("done"); return; }
      let full = "";
      try {
        const reader = res.body.getReader(); const dec = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          for (const line of dec.decode(value).split("\n")) {
            if (line.startsWith("data: ")) {
              try { const d = JSON.parse(line.slice(6)); if (d.delta && d.delta.text) { full += d.delta.text; setStream(full); } } catch {}
            }
          }
        }
      } catch {}
      setContacts(SAFE_JSON(full.replace(/```json|```/g, "")) || fallback("Could not parse response."));
      setPhase("done");
    } catch (e) {
      setContacts(fallback(`Error: ${e.message}`));
      setPhase("done");
    }
  };

  const copy = (t, k) => { navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 2000); };
  const CONF = { High: { bg: "rgba(16,185,129,0.14)", c: "#10b981" }, Medium: { bg: "rgba(245,158,11,0.14)", c: "#f59e0b" }, Low: { bg: "rgba(239,68,68,0.14)", c: "#ef4444" } };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)" }}>
      <div className="w-full max-w-2xl rounded-2xl flex flex-col overflow-hidden" style={{ background: "linear-gradient(160deg,#0c1018,#111827)", border: "1px solid rgba(255,106,0,0.2)", maxHeight: "90vh" }}>
        <div className="flex items-center gap-3 p-5 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: "rgba(255,106,0,0.1)" }}>{project.logo}</div>
          <div className="flex-1"><p className="text-white font-bold">{project.name} <span className="text-gray-500 font-normal text-sm">{project.symbol}</span></p><p className="text-gray-600 text-xs">BD Contact Intelligence</p></div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-xl leading-none">✕</button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {phase === "idle" && (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5" style={{ background: "linear-gradient(135deg,rgba(255,106,0,0.12),rgba(238,9,121,0.08))", border: "1px solid rgba(255,106,0,0.2)" }}>🔍</div>
              <p className="text-white font-semibold text-lg mb-2">Find BD Contacts</p>
              <p className="text-gray-500 text-sm mb-6">AI will search for verified contacts for <span className="text-white">{project.name}</span>.</p>
              <button onClick={run} className="px-7 py-3 rounded-xl font-semibold text-sm hover:scale-105 transition-all" style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)", color: "white" }}>🤖 Find Contacts</button>
            </div>
          )}
          {phase === "searching" && (
            <div className="py-4">
              <div className="flex items-center gap-2 mb-4"><span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" /><span className="text-orange-400 text-sm">Searching…</span></div>
              <div className="rounded-xl p-4 font-mono text-xs text-gray-400 min-h-24 overflow-auto" style={{ background: "rgba(0,0,0,0.4)" }}>
                {stream || "Initializing…"}<span className="inline-block w-1 h-3 bg-orange-400 ml-1 animate-pulse align-middle" />
              </div>
            </div>
          )}
          {phase === "done" && contacts && (
            <div className="space-y-4">
              <div className="rounded-xl p-4" style={{ background: "rgba(255,106,0,0.06)", border: "1px solid rgba(255,106,0,0.13)" }}><p className="text-gray-300 text-sm">{contacts.summary}</p></div>
              {contacts.bestContactPath && (
                <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <span className="text-lg">💡</span>
                  <div><p className="text-emerald-400 text-xs font-bold uppercase mb-0.5">Best Contact Path</p><p className="text-white text-sm font-medium">{contacts.bestContactPath}</p></div>
                </div>
              )}
              {contacts.bdEmail && contacts.bdEmail !== "Unknown" && (
                <div className="flex items-center justify-between rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div><p className="text-gray-600 text-xs mb-1">BD Email</p><p className="text-orange-400 font-medium">{contacts.bdEmail}</p></div>
                  <button onClick={() => copy(contacts.bdEmail, "bd")} className="text-xs px-2 py-1 rounded" style={{ background: copied === "bd" ? "rgba(16,185,129,0.15)" : "rgba(255,106,0,0.12)", color: copied === "bd" ? "#10b981" : "#ff6a00" }}>{copied === "bd" ? "✓" : "Copy"}</button>
                </div>
              )}
              <div className="space-y-2">
                {contacts.contacts && contacts.contacts.map((c, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-start justify-between mb-2">
                      <div><p className="text-white font-semibold text-sm">{c.name}</p><p className="text-gray-500 text-xs">{c.role}</p></div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: CONF[c.confidence] && CONF[c.confidence].bg, color: CONF[c.confidence] && CONF[c.confidence].c }}>{c.confidence}</span>
                        {c.bestPath && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>via {c.bestPath}</span>}
                      </div>
                    </div>
                    <div className="space-y-1 text-xs">
                      {c.email && <div className="flex items-center justify-between"><span className="text-gray-300">📧 {c.email}</span><button onClick={() => copy(c.email, "e" + i)} className="px-1.5 py-0.5 rounded" style={{ background: copied === "e" + i ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.07)", color: copied === "e" + i ? "#10b981" : "#6b7280" }}>{copied === "e" + i ? "✓" : "⎘"}</button></div>}
                      {c.twitter && c.twitter !== "Unknown" && <p className="text-blue-400">🐦 {c.twitter}</p>}
                      {c.telegram && c.telegram !== "Unknown" && <p className="text-sky-400">💬 {c.telegram}</p>}
                      {c.linkedin && c.linkedin !== "Unknown" && <p className="text-blue-300 truncate">💼 {c.linkedin}</p>}
                      {c.source && <p className="text-gray-700">📌 {c.source}</p>}
                    </div>
                  </div>
                ))}
              </div>
              {contacts.bestApproach && (
                <div className="rounded-xl p-4" style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.17)" }}>
                  <p className="text-indigo-400 text-xs font-bold mb-1.5 uppercase">💡 Outreach Strategy</p>
                  <p className="text-gray-300 text-sm">{contacts.bestApproach}</p>
                </div>
              )}
              <button onClick={run} className="w-full py-2 rounded-xl text-sm text-gray-600 hover:text-gray-400" style={{ background: "rgba(255,255,255,0.03)" }}>🔄 Re-run</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose, onFindContacts }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-xl rounded-2xl flex flex-col overflow-hidden" style={{ background: "linear-gradient(160deg,#0c1018,#111827)", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "90vh" }}>
        <div className="flex items-center gap-3 p-5 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-3xl" style={{ background: "rgba(255,255,255,0.05)" }}>{project.logo}</div>
          <div className="flex-1">
            <p className="text-white font-bold text-xl">{project.name} <span className="text-gray-500 font-normal text-sm">{project.symbol}</span></p>
            <div className="flex items-center gap-2 mt-1"><StagePill stage={project.stage} /><span className="text-gray-600 text-xs">{project.category}</span></div>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white text-xl">✕</button>
        </div>
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
          <div className="grid grid-cols-3 gap-3">
            {[["Price", project.price], ["Market Cap", project.mcap], ["24h Vol", project.volume], ["TGE", project.tge], ["Chain", project.chain], ["Rank", "#" + project.rank]].map(([l, v]) => (
              <div key={l} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-gray-600 text-xs mb-1">{l}</p><p className="text-white font-semibold text-sm">{v}</p>
              </div>
            ))}
          </div>
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map(t => <span key={t} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>{t}</span>)}
            </div>
          )}
          <button onClick={() => { onClose(); onFindContacts(project); }} className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-all" style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)", color: "white" }}>
            🤖 Find BD Contacts with AI
          </button>
        </div>
      </div>
    </div>
  );
}

const SCOUT_STEPS = [
  { icon: "🌐", label: "Find domain" },
  { icon: "🏦", label: "Block explorers" },
  { icon: "📧", label: "Extract emails" },
  { icon: "🤖", label: "AI enrichment" },
  { icon: "💡", label: "BD profile" },
];

function ScoutAIPage({ onAddLead, onAddToHistory, contactHistory }) {
  const [handle,  setHandle]  = useState("");
  const [phase,   setPhase]   = useState("idle");
  const [stream,  setStream]  = useState("");
  const [result,  setResult]  = useState(null);
  const [history, setHistory] = useState([]);
  const [copied,  setCopied]  = useState(null);
  const [searchMode, setSearchMode] = useState("twitter");

  const cleanHandle = raw => {
    if (!raw) return "";
    return raw.trim().replace(/^@/, "").toLowerCase()
      .replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//, "")
      .replace(/\/.*$/, "").replace(/\?.*$/, "").replace(/[^a-z0-9_]/g, "");
  };

  // Multi-proxy fetch — tries 3 different CORS proxies in sequence
  const fetchPage = async (url) => {
    const proxies = [
      // Proxy 1: allorigins (most reliable, wraps in {contents})
      async () => {
        const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(9000) });
        if (!r.ok) throw new Error("allorigins failed");
        const d = await r.json();
        return d.contents || "";
      },
      // Proxy 2: corsproxy.io (direct passthrough)
      async () => {
        const r = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(9000) });
        if (!r.ok) throw new Error("corsproxy failed");
        return r.text();
      },
      // Proxy 3: htmlpreview / thingproxy
      async () => {
        const r = await fetch(`https://thingproxy.freeboard.io/fetch/${url}`, { signal: AbortSignal.timeout(9000) });
        if (!r.ok) throw new Error("thingproxy failed");
        return r.text();
      },
    ];

    for (const proxy of proxies) {
      try {
        const html = await proxy();
        if (!html || html.length < 100) continue;

        // Clean HTML → plain text
        const text = html
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          // Decode HTML entities that may obfuscate emails
          .replace(/&#64;/g, "@").replace(/&amp;/g, "&").replace(/&#46;/g, ".")
          .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
          // Handle mailto: links — extract email from href="mailto:user@domain.com"
          .replace(/href=["']mailto:([^"']+)["']/gi, " $1 ")
          // Strip remaining tags
          .replace(/<[^>]+>/g, " ")
          .replace(/\s{3,}/g, "\n")
          .trim()
          .slice(0, 8000);

        if (text.length > 100) return text;
      } catch { continue; }
    }
    return null;
  };

  const extractEmails = (text) => {
    if (!text) return [];
    // Standard email pattern
    const standard = text.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g) || [];
    // Also catch obfuscated patterns like "user [at] domain [dot] com"
    const obfuscated = [];
    const atDot = text.match(/([a-zA-Z0-9._%+\-]+)\s*[\[\(]?(?:at|@)[\]\)]?\s*([a-zA-Z0-9.\-]+)\s*[\[\(]?(?:dot|\.)[\]\)]?\s*([a-zA-Z]{2,})/gi) || [];
    for (const m of atDot) {
      const clean = m.replace(/\s*[\[\(]?(?:at|@)[\]\)]?\s*/i, "@").replace(/\s*[\[\(]?(?:dot|\.)[\]\)]?\s*/gi, ".").replace(/\s/g, "");
      if (clean.includes("@") && clean.includes(".")) obfuscated.push(clean);
    }
    return [...new Set([...standard, ...obfuscated])].filter(e =>
      !e.match(/\.(png|jpg|gif|svg|css|js|woff|ttf)/i) &&
      !e.startsWith("//") && e.includes(".")
    );
  };

  const runScout = async (rawHandle) => {
    const isWebsite = searchMode === "website";
    const h = isWebsite ? handle.trim() : cleanHandle(rawHandle || handle);
    if (!h) return;
    setPhase("loading"); setStream(""); setResult(null);

    let log = "";
    const addLog = line => { log += line + "\n"; setStream(log); };

    try {
      addLog(isWebsite ? `🌐 Scouting ${h}…` : `🚀 Scouting @${h}…`);
      addLog(`🔍 Searching for BD contacts…`);

      const searchTarget = isWebsite ? handle.trim() : "@" + h;
      const prompt = isWebsite
        ? "You are a crypto BD researcher. Find ALL contact information for the crypto project at website " + h + ". THOROUGHLY search: 1) Visit the website directly — check /contact, /about, /team pages for any email, 2) Search '" + h + " email BD contact', 3) Check BSCScan or Etherscan for this project. Look for ANY email: contact@, hello@, bd@, info@, partnerships@, listing@. Return ONLY raw JSON: {\"projectName\":\"Full Name\",\"symbol\":\"TICKER\",\"emoji\":\"🚀\",\"tagline\":\"one line description\",\"description\":\"2-3 sentences about the project\",\"category\":\"DeFi|Layer 1|Layer 2|AI|DePIN|RWA|Infra|Other\",\"stage\":\"Pre-Launch|Post-Launch|Listed\",\"chain\":\"chain name\",\"website\":\"" + h + "\",\"twitter\":\"@handle or Unknown\",\"telegram\":\"t.me/x or Unknown\",\"bdEmail\":\"real email or Unknown\",\"bdTelegram\":\"t.me/x or Unknown\",\"bestContactPath\":\"specific actionable recommendation\",\"outreachStrategy\":\"2-3 sentence exchange listing pitch\",\"bdScore\":75,\"listingInterest\":\"High|Medium|Low\",\"dataQuality\":\"High|Medium|Low\",\"contacts\":[{\"name\":\"Full Name\",\"role\":\"exact role\",\"email\":\"email or Unknown\",\"twitter\":\"@handle or Unknown\",\"linkedin\":\"url or Unknown\",\"telegram\":\"@handle or Unknown\",\"confidence\":\"High|Medium|Low\",\"bestPath\":\"Email|Twitter DM|Telegram|LinkedIn\",\"notes\":\"specific tip on how to reach them\"}]}"
        : "You are a crypto BD researcher for an exchange listing team. Research the project @" + h + " thoroughly.\n\nSearch in this order:\n1. Find their official website — search '" + h + " crypto official website'\n2. Visit their website — check /contact, /about, /team pages for emails\n3. Search '" + h + " bd email listing contact'\n4. Check BSCScan or Etherscan for team emails\n5. Search LinkedIn for their BD or partnerships team\n6. Check their Telegram group for contact info\n\nReturn ONLY raw JSON:\n{\"projectName\":\"Full Name\",\"symbol\":\"TICKER\",\"emoji\":\"🚀\",\"tagline\":\"one line description\",\"description\":\"2-3 sentences about what they do\",\"category\":\"DeFi|Layer 1|Layer 2|AI|DePIN|RWA|Infra|Other\",\"stage\":\"Pre-Launch|Post-Launch|Listed\",\"chain\":\"chain name\",\"website\":\"domain.com\",\"twitter\":\"@handle\",\"telegram\":\"t.me/x or Unknown\",\"bdEmail\":\"real verified email or Unknown\",\"bdTelegram\":\"t.me/x or Unknown\",\"bestContactPath\":\"specific actionable recommendation\",\"outreachStrategy\":\"2-3 sentence exchange listing pitch\",\"bdScore\":75,\"listingInterest\":\"High|Medium|Low\",\"dataQuality\":\"High|Medium|Low\",\"contacts\":[{\"name\":\"Full Name\",\"role\":\"exact role\",\"email\":\"email or Unknown\",\"twitter\":\"@handle or Unknown\",\"linkedin\":\"url or Unknown\",\"telegram\":\"@handle or Unknown\",\"confidence\":\"High|Medium|Low\",\"bestPath\":\"Email|Twitter DM|Telegram|LinkedIn\",\"notes\":\"specific tip\"}]}";

      let msgs = [{ role: "user", content: prompt }];

      // Check cache first — if already in history, use that instantly
      const hist = contactHistory || [];
      const cached = hist.find(item => {
        const itemTwitter = (item.twitter || "").toLowerCase().replace("@", "");
        const itemName = (item.name || "").toLowerCase();
        const searchH = h.toLowerCase();
        return itemTwitter === searchH || itemName === searchH;
      });
      if (cached && cached.fullResult) {
        addLog("⚡ Found in history — loading saved result instantly!");
        setResult(cached.fullResult);
        setPhase("done");
        return;
      }

      let res = await SAFE_API(msgs);

      // If rate limited, fail immediately — no retries
      if (res.error && res.error.type === "rate_limit_error") {
        addLog("❌ Rate limit hit — please wait 1 minute and try again");
        setPhase("error");
        return;
      }

      let ei = 0;
      while (res.stop_reason === "tool_use" && ei < 6 && !res._err) {
        ei++;
        for (const b of res.content) { if (b.type === "tool_use") addLog(`🔎 ${b.input && b.input.query}`); }
        const toolResults = res.content
          .filter(b => b.type === "tool_use")
          .map(b => ({ type: "tool_result", tool_use_id: b.id, content: "Search completed." }));
        msgs = [
          { role: "user", content: prompt },
          { role: "assistant", content: res.content },
          { role: "user", content: toolResults }
        ];
        res = await SAFE_API(msgs);
        // Stop immediately if rate limited mid-search
        if (res.error && res.error.type === "rate_limit_error") {
          addLog("❌ Rate limit hit — please wait 1 minute and try again");
          setPhase("error");
          return;
        }
      }
      addLog(`✅ Done — ${ei} searches run`);

      const txt = res.content.filter(b => b.type === "text").map(b => b.text).join("");
      let parsed = SAFE_JSON(txt);
      if (!parsed) {
        parsed = { projectName: h, symbol: h.toUpperCase().slice(0,6), emoji: "🛸", tagline: "Crypto project @" + h, description: "Visit their website for more details.", category: "Crypto", stage: "Unknown", chain: "Unknown", website: "", twitter: "@" + h, telegram: "Unknown", bdEmail: "Unknown", bdTelegram: "Unknown", bestContactPath: "Twitter DM: @" + h, outreachStrategy: "", bdScore: 50, dataQuality: "Low", contacts: [], tags: [] };
      }
      const emails = (parsed.bdEmail && parsed.bdEmail !== "Unknown") ? [parsed.bdEmail] : [];

      setResult(parsed);
      setHistory(prev => [{ handle: h, result: parsed, ts: new Date() }, ...prev].slice(0, 10));
      if (onAddToHistory) onAddToHistory({
        name: parsed.projectName || h,
        symbol: parsed.symbol || "",
        logo: parsed.emoji || "🛸",
        source: "Scout AI",
        twitter: parsed.twitter || "@" + h,
        bdEmail: parsed.bdEmail,
        bdTelegram: parsed.bdTelegram || parsed.telegram,
        bestContactPath: parsed.bestContactPath,
        confidence: parsed.dataQuality,
        website: parsed.website,
        chain: parsed.chain,
        description: parsed.tagline || parsed.description,
        fullResult: parsed,
      });
      setPhase("done");
    } catch (e) {
      addLog(`❌ ${e.message}`);
      setPhase("error");
    }
  };

  const copy = (t, k) => { navigator.clipboard.writeText(t); setCopied(k); setTimeout(() => setCopied(null), 2000); };
  const CONF = { High: { bg: "rgba(16,185,129,0.14)", c: "#10b981" }, Medium: { bg: "rgba(245,158,11,0.14)", c: "#f59e0b" }, Low: { bg: "rgba(239,68,68,0.14)", c: "#ef4444" } };
  const BD = r => r >= 80 ? "#10b981" : r >= 60 ? "#f59e0b" : "#ef4444";
  const h = cleanHandle(handle);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="rounded-2xl p-8 mb-6 text-center relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(255,106,0,0.08),rgba(238,9,121,0.05))", border: "1px solid rgba(255,106,0,0.2)" }}>
        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🛸</span>
            <h2 className="text-white font-bold text-2xl" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Scout AI</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)", color: "white" }}>LIVE</span>
          </div>
          <p className="text-gray-400 text-sm mb-4 max-w-md mx-auto">AI researches any crypto project and builds a full BD profile with emails, contacts and outreach strategy.</p>
          <div className="flex gap-2 justify-center mb-4">
            <button onClick={() => { setSearchMode("twitter"); setHandle(""); }} className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{ background: searchMode === "twitter" ? "linear-gradient(135deg,#ff6a00,#ee0979)" : "rgba(255,255,255,0.07)", color: searchMode === "twitter" ? "white" : "#6b7280" }}>
              🐦 Twitter Handle
            </button>
            <button onClick={() => { setSearchMode("website"); setHandle(""); }} className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{ background: searchMode === "website" ? "linear-gradient(135deg,#ff6a00,#ee0979)" : "rgba(255,255,255,0.07)", color: searchMode === "website" ? "white" : "#6b7280" }}>
              🌐 Website URL
            </button>
          </div>
          <div className="flex gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{searchMode === "twitter" ? "🐦" : "🌐"}</span>
              <input value={handle} onChange={e => {
                const val = e.target.value;
                setHandle(val);
                if (val.startsWith("http") || val.startsWith("www.")) setSearchMode("website");
                else if (val.startsWith("@")) setSearchMode("twitter");
              }} onKeyDown={e => e.key === "Enter" && runScout()}
                placeholder={searchMode === "twitter" ? "@projecthandle or paste Twitter URL…" : "https://projectwebsite.com"}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)" }} />
            </div>
            <button onClick={() => runScout()} disabled={phase === "loading"} className="px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 disabled:opacity-60 whitespace-nowrap"
              style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)", color: "white" }}>
              {phase === "loading" ? "Scouting…" : "🔍 Scout"}
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-gray-600 text-xs">Try:</span>
            {["@monad_xyz", "@berachain", "@KaitoAI", "@virtuals_io", "@aixovia"].map(ex => (
              <button key={ex} onClick={() => { setHandle(ex); runScout(ex); }} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.08)" }}>{ex}</button>
            ))}
          </div>
        </div>
      </div>

      {phase === "idle" && !result && (
        <>
          <div className="grid grid-cols-5 gap-3 mb-6">
            {SCOUT_STEPS.map((s, i) => (
              <div key={i} className="rounded-xl p-4 text-center relative" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {i < 4 && <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 text-gray-700 text-xs">›</div>}
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-white text-xs font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
          {history.length > 0 && (
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}><span className="text-white font-semibold text-sm">🕓 Recent Scouts</span></div>
              {history.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 border-b cursor-pointer hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.04)" }} onClick={() => { setResult(item.result); setPhase("done"); }}>
                  <span className="text-2xl">{item.result.emoji || "🔍"}</span>
                  <div className="flex-1"><p className="text-white text-sm font-semibold">{item.result.projectName}</p><p className="text-gray-600 text-xs">@{item.handle}</p></div>
                  <StagePill stage={item.result.stage || "Listed"} />
                  <p className="text-xs font-bold" style={{ color: BD(item.result.bdScore || 50) }}>BD {item.result.bdScore || "—"}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {phase === "loading" && (
        <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,106,0,0.15)" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex gap-1">{[0, 1, 2].map(i => <span key={i} className="w-2 h-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: (i * 0.15) + "s" }} />)}</div>
            <span className="text-orange-400 font-medium text-sm">Scouting <span className="text-white">@{h}</span></span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa" }}>{(stream.match(/🔍/g) || []).length} searches</span>
          </div>
          <div className="rounded-xl p-4 mb-4 font-mono text-xs min-h-28 max-h-48 overflow-y-auto" style={{ background: "#0a0d14", border: "1px solid rgba(255,106,0,0.12)" }}>
            {stream.split("\n").filter(Boolean).map((line, i) => (
              <div key={i} className="leading-6" style={{ color: line.startsWith("🔍") ? "#60a5fa" : line.startsWith("   ✅") ? "#34d399" : line.startsWith("✅") ? "#34d399" : line.startsWith("📧") ? "#f59e0b" : line.startsWith("🚀") ? "#ff6a00" : "#4b5563" }}>{line}</div>
            ))}
            <span className="inline-block w-1.5 h-3.5 bg-orange-400 animate-pulse align-middle" />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {SCOUT_STEPS.map((s, i) => {
              const n = (stream.match(/🔍/g) || []).length; const done = n > i * 1.4;
              return <div key={i} className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl" style={{ background: done ? "rgba(255,106,0,0.1)" : "rgba(255,255,255,0.02)", border: "1px solid " + (done ? "rgba(255,106,0,0.28)" : "rgba(255,255,255,0.06)") }}><span className="text-lg">{done ? "✅" : s.icon}</span><p className="text-xs text-center" style={{ color: done ? "#ff6a00" : "#374151" }}>{s.label}</p></div>;
            })}
          </div>
        </div>
      )}

      {phase === "done" && result && (
        <div className="space-y-5">
          <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>{result.emoji || "🔍"}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h3 className="text-white font-bold text-2xl" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{result.projectName}</h3>
                  <span className="text-gray-500 font-mono text-sm">{result.symbol}</span>
                  <StagePill stage={result.stage || "Listed"} />
                  {result._searches > 0 && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(96,165,250,0.12)", color: "#60a5fa" }}>🔍 {result._searches} searches</span>}
                </div>
                <p className="text-orange-400 font-medium text-sm mb-1">{result.tagline}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{result.description}</p>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center" style={{ background: "rgba(" + ((result.bdScore || 50) >= 80 ? "16,185,129" : (result.bdScore || 50) >= 60 ? "245,158,11" : "239,68,68") + ",0.12)" }}>
                  <p className="font-bold text-xl leading-none" style={{ color: BD(result.bdScore || 50), fontFamily: "'Space Grotesk',sans-serif" }}>{result.bdScore || "—"}</p>
                  <p className="text-xs mt-0.5" style={{ color: BD(result.bdScore || 50) }}>BD</p>
                </div>
              </div>
            </div>
            {result.tags && result.tags.length > 0 && <div className="flex flex-wrap gap-2 mt-4">{result.tags.map(t => <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>{t}</span>)}</div>}
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-white font-semibold text-sm mb-4">📊 Project Details</p>
              {[["Category", result.category], ["Chain", result.chain], ["TGE", result.tge], ["Funding", result.fundraising]].map(([l, v]) => (
                <div key={l} className="flex items-start justify-between gap-4 mb-2.5"><span className="text-gray-600 text-xs">{l}</span><span className="text-gray-200 text-xs text-right">{v || "—"}</span></div>
              ))}
            </div>
            <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-white font-semibold text-sm mb-4">🔗 Links</p>
              {[["🌐", "Website", result.website], ["🐦", "Twitter", result.twitter], ["💬", "Telegram", result.telegram], ["💻", "GitHub", result.github]].map(([icon, l, v]) => (
                <div key={l} className="flex items-center justify-between gap-4 mb-2.5">
                  <span className="text-gray-600 text-xs">{icon} {l}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 text-xs truncate max-w-[160px]">{v && v !== "Unknown" ? v : "—"}</span>
                    {v && v !== "Unknown" && <button onClick={() => copy(v, l)} className="text-xs px-1.5 py-0.5 rounded" style={{ background: copied === l ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.07)", color: copied === l ? "#10b981" : "#6b7280" }}>{copied === l ? "✓" : "⎘"}</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <p className="text-white font-semibold text-sm">📬 Contact Intelligence</p>
              {result.dataQuality && <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: CONF[result.dataQuality] && CONF[result.dataQuality].bg, color: CONF[result.dataQuality] && CONF[result.dataQuality].c }}>{result.dataQuality === "High" ? "✅" : "⚠️"} {result.dataQuality} Quality</span>}
            </div>
            <div className="rounded-xl p-4 mb-4 flex items-start gap-3" style={{ background: result._emails && result._emails.length > 0 ? "rgba(16,185,129,0.07)" : "rgba(245,158,11,0.07)", border: "1px solid " + (result._emails && result._emails.length > 0 ? "rgba(16,185,129,0.22)" : "rgba(245,158,11,0.22)") }}>
              <span className="text-2xl mt-0.5">{result._emails && result._emails.length > 0 ? "✅" : "💡"}</span>
              <div className="flex-1"><p className="font-bold text-sm mb-1" style={{ color: result._emails && result._emails.length > 0 ? "#10b981" : "#f59e0b" }}>Best Contact Path</p><p className="text-white text-sm font-medium">{result.bestContactPath}</p></div>
            </div>
            {result._emails && result._emails.length > 0 && (
              <div className="rounded-xl p-3 mb-4" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <p className="text-emerald-400 text-xs font-bold mb-2 uppercase">📧 Emails scraped from website</p>
                <div className="flex flex-wrap gap-2">
                  {result._emails.map((email, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
                      <span className="text-emerald-300 font-mono text-sm font-bold">{email}</span>
                      <button onClick={() => copy(email, "de" + i)} className="text-xs px-2 py-0.5 rounded" style={{ background: copied === "de" + i ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.1)", color: copied === "de" + i ? "#10b981" : "#9ca3af" }}>{copied === "de" + i ? "✓" : "Copy"}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {result.bdEmail && result.bdEmail !== "Unknown" && (
              <div className="flex items-center justify-between rounded-xl p-3 mb-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div><p className="text-gray-600 text-xs mb-1">BD Email</p><p className="text-orange-400 font-medium">{result.bdEmail}</p></div>
                <button onClick={() => copy(result.bdEmail, "bdE")} className="text-xs px-2 py-1 rounded" style={{ background: copied === "bdE" ? "rgba(16,185,129,0.15)" : "rgba(255,106,0,0.12)", color: copied === "bdE" ? "#10b981" : "#ff6a00" }}>{copied === "bdE" ? "✓" : "Copy"}</button>
              </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {result.contacts && result.contacts.map((c, i) => (
                <div key={i} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-start justify-between mb-3">
                    <div><p className="text-white font-semibold text-sm">{c.name}</p><p className="text-gray-500 text-xs">{c.role}</p></div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: CONF[c.confidence] && CONF[c.confidence].bg, color: CONF[c.confidence] && CONF[c.confidence].c }}>{c.confidence}</span>
                      {c.bestPath && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>via {c.bestPath}</span>}
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {c.email && c.email !== "Unknown" && <div className="flex items-center justify-between gap-1"><span className="text-gray-300 truncate">📧 {c.email}</span><button onClick={() => copy(c.email, "ce" + i)} className="px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: copied === "ce" + i ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.08)", color: copied === "ce" + i ? "#10b981" : "#6b7280" }}>{copied === "ce" + i ? "✓" : "⎘"}</button></div>}
                    {!c.email && <p className="text-amber-700 italic">No email — use path above</p>}
                    {c.twitter && c.twitter !== "Unknown" && <div className="flex items-center justify-between gap-1"><span className="text-blue-400">🐦 {c.twitter}</span><button onClick={() => copy(c.twitter, "ct" + i)} className="px-1.5 py-0.5 rounded" style={{ background: copied === "ct" + i ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.08)", color: copied === "ct" + i ? "#10b981" : "#6b7280" }}>{copied === "ct" + i ? "✓" : "⎘"}</button></div>}
                    {c.telegram && c.telegram !== "Unknown" && <p className="text-sky-400">💬 {c.telegram}</p>}
                    {c.linkedin && c.linkedin !== "Unknown" && <p className="text-blue-300 truncate">💼 {c.linkedin}</p>}
                    {c.source && <p className="text-gray-700">📌 {c.source}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.07),rgba(139,92,246,0.04))", border: "1px solid rgba(99,102,241,0.18)" }}>
              <p className="text-indigo-400 font-bold text-xs uppercase mb-3">💡 Outreach Strategy</p>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{result.outreachStrategy}</p>
              <div className="rounded-xl p-3" style={{ background: "rgba(255,106,0,0.08)", border: "1px solid rgba(255,106,0,0.2)" }}>
                <p className="text-orange-400 text-xs font-semibold mb-1">🎯 Opening Hook</p>
                <p className="text-gray-200 text-sm italic">"{result.pitchAngle}"</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-white font-semibold text-sm mb-3">📈 Listing Assessment</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500 text-xs">Interest:</span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: CONF[result.listingInterest] && CONF[result.listingInterest].bg, color: CONF[result.listingInterest] && CONF[result.listingInterest].c }}>{result.listingInterest}</span>
                </div>
                <p className="text-gray-400 text-xs">{result.listingInterestReason}</p>
              </div>
              {result.redFlags && result.redFlags !== "None" && (
                <div className="rounded-2xl p-4" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}>
                  <p className="text-red-400 font-semibold text-xs mb-1.5">⚠️ Red Flags</p>
                  <p className="text-gray-400 text-xs">{result.redFlags}</p>
                </div>
              )}
            </div>
          </div>

          {result._log && (
            <details className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <summary className="px-5 py-3 text-xs cursor-pointer" style={{ background: "rgba(255,255,255,0.02)", color: "#6b7280", listStyle: "none" }}>🔍 {result._searches} searches run · click to view log</summary>
              <div className="px-5 pb-4 pt-2 font-mono text-xs" style={{ background: "#0a0d14" }}>
                {result._log.split("\n").filter(Boolean).map((line, i) => (
                  <div key={i} style={{ color: line.startsWith("🔍") ? "#60a5fa" : line.startsWith("✅") ? "#34d399" : "#4b5563", lineHeight: "1.6" }}>{line}</div>
                ))}
              </div>
            </details>
          )}

          <div className="flex gap-3">
            <button onClick={() => {
              onAddLead({ id: Date.now(), name: result.projectName, symbol: result.symbol, logo: result.emoji || "🔍", category: result.category, stage: result.stage || "Listed", chain: result.chain, description: result.description, tge: result.tge, trendScore: result.trendScore || 70, twitter: result.twitter, website: result.website, telegram: result.telegram, tags: result.tags || [] });
            }} className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)", color: "white" }}>
              ➕ Add to BD Pipeline
            </button>
            <button onClick={() => { setPhase("idle"); setResult(null); setHandle(""); }} className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }}>
              🔍 Scout Another
            </button>
          </div>
        </div>
      )}
      {phase === "error" && (
        <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <p className="text-red-400 font-semibold mb-2">Scout failed</p>
          {stream && <pre className="text-gray-500 text-xs mb-4 text-left bg-black rounded-lg p-3 max-h-40 overflow-y-auto">{stream}</pre>}
          <p className="text-gray-500 text-sm mb-4">Check the handle and try again.</p>
          <button onClick={() => { setPhase("idle"); setResult(null); }} className="px-5 py-2 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.12)", color: "#f87171" }}>← Try Again</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [viewTab,  setViewTab]  = useState("top");
  const [catTab,   setCatTab]   = useState("all");
  const [stageFilt,setStageFilt]= useState("All");
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState("home");
  const [leads,    setLeads]    = useState([]);
  const [selected, setSelected] = useState(null);
  const [contact,  setContact]  = useState(null);
  const [animKey,  setAnimKey]  = useState(0);
  const [autoRunning, setAutoRunning] = useState(false);
  const [autoDone,    setAutoDone]    = useState({});
  const [autoActive,  setAutoActive]  = useState(null);
  const [autoLog,     setAutoLog]     = useState([]);
  const autoStop = useRef(false);

  // ── DEXSCREENER LIVE DATA ─────────────────────────────────────────────────
  const [dexData,       setDexData]       = useState({ trending: [], new: [], gainers: [] });
  const [dexLoading,    setDexLoading]    = useState(false);
  const [dexTab,        setDexTab]        = useState("trending");
  const [dexLastUpdate, setDexLastUpdate] = useState(null);

  // Static curated fallback — loads instantly, always works
  const STATIC_FEED = [
    {id:"f1", rank:1,  name:"ai16z",            symbol:"AI16Z",    logo:"🤖", chain:"solana",   twitter:"@ai16zdao",       telegram:"t.me/ai16z",     website:"ai16z.vc",       price:"$1.24",   change24h:"+8.9%",   change24hRaw:8.9,   volume:"$89M",  mcap:"$1.24B", source:"trending"},
    {id:"f2", rank:2,  name:"Virtuals Protocol", symbol:"VIRTUAL",  logo:"🤖", chain:"base",     twitter:"@virtuals_io",    telegram:"t.me/virtuals",  website:"virtuals.io",    price:"$1.24",   change24h:"+12.4%",  change24hRaw:12.4,  volume:"$189M", mcap:"$1.24B", source:"trending"},
    {id:"f3", rank:3,  name:"Zerebro",           symbol:"ZEREBRO",  logo:"🧠", chain:"solana",   twitter:"@zerebro_agent",  telegram:"t.me/zerebro",   website:"zerebro.ai",     price:"$0.093",  change24h:"+29.4%",  change24hRaw:29.4,  volume:"$19M",  mcap:"$93M",   source:"trending"},
    {id:"f4", rank:4,  name:"Clanker",           symbol:"CLANKER",  logo:"⚙️", chain:"base",     twitter:"@clanker_erc",    telegram:"—",              website:"clank.fun",      price:"$24.50",  change24h:"+156.2%", change24hRaw:156.2, volume:"$12M",  mcap:"$245M",  source:"gainers" },
    {id:"f5", rank:5,  name:"Turbo",             symbol:"TURBO",    logo:"🔥", chain:"ethereum", twitter:"@TurboToadToken", telegram:"t.me/turbo",     website:"turbotoken.io",  price:"$0.0082", change24h:"+22.1%",  change24hRaw:22.1,  volume:"$15M",  mcap:"$82M",   source:"trending"},
    {id:"f6", rank:6,  name:"Fartcoin",          symbol:"FARTCOIN", logo:"💨", chain:"solana",   twitter:"@fartcoin_sol",   telegram:"t.me/fartcoin",  website:"fartcoin.lol",   price:"$0.842",  change24h:"+34.2%",  change24hRaw:34.2,  volume:"$48M",  mcap:"$840M",  source:"trending"},
    {id:"f7", rank:7,  name:"GRIFFAIN",          symbol:"GRIFFAIN", logo:"🦅", chain:"solana",   twitter:"@griffain_sol",   telegram:"t.me/griffain",  website:"griffain.io",    price:"$0.184",  change24h:"+45.1%",  change24hRaw:45.1,  volume:"$23M",  mcap:"$184M",  source:"gainers" },
    {id:"f8", rank:8,  name:"Moo Deng",          symbol:"MOODENG",  logo:"🦛", chain:"solana",   twitter:"@moodengcoin",    telegram:"—",              website:"moodeng.vip",    price:"$0.056",  change24h:"+67.3%",  change24hRaw:67.3,  volume:"$41M",  mcap:"$56M",   source:"gainers" },
    {id:"f9", rank:9,  name:"Goatseus Maximus",  symbol:"GOAT",     logo:"🐐", chain:"solana",   twitter:"@GOAT_token",     telegram:"t.me/goattoken", website:"goattoken.io",   price:"$0.283",  change24h:"+12.4%",  change24hRaw:12.4,  volume:"$28M",  mcap:"$283M",  source:"trending"},
    {id:"f10",rank:10, name:"Popcat",            symbol:"POPCAT",   logo:"🐱", chain:"solana",   twitter:"@popcatsolana",   telegram:"t.me/popcat",    website:"popcat.gg",      price:"$0.542",  change24h:"+18.7%",  change24hRaw:18.7,  volume:"$32M",  mcap:"$540M",  source:"trending"},
    {id:"f11",rank:11, name:"Kaito AI",          symbol:"KAITO",    logo:"🧠", chain:"ethereum", twitter:"@KaitoAI",        telegram:"—",              website:"kaito.ai",       price:"$1.67",   change24h:"+21.3%",  change24hRaw:21.3,  volume:"$98M",  mcap:"$334M",  source:"trending"},
    {id:"f12",rank:12, name:"Berachain",         symbol:"BERA",     logo:"🐻", chain:"berachain",twitter:"@berachain",      telegram:"t.me/BeraHome",  website:"berachain.com",  price:"$4.21",   change24h:"+8.3%",   change24hRaw:8.3,   volume:"$234M", mcap:"$1.4B",  source:"trending"},
    {id:"n1", rank:1,  name:"Spore",             symbol:"SPORE",    logo:"🍄", chain:"base",     twitter:"@spore_base",     telegram:"t.me/sporebase", website:"spore.gg",       price:"$0.0021", change24h:"+89.7%",  change24hRaw:89.7,  volume:"$8M",   mcap:"$21M",   source:"new", isNew:true},
    {id:"n2", rank:2,  name:"Sigma",             symbol:"SIGMA",    logo:"Σ",  chain:"base",     twitter:"@sigmabase",      telegram:"t.me/sigmabase", website:"sigma.wtf",      price:"$0.0014", change24h:"+78.4%",  change24hRaw:78.4,  volume:"$1.8M", mcap:"$14M",   source:"new", isNew:true},
    {id:"n3", rank:3,  name:"Bongo Cat",         symbol:"BONGO",    logo:"🐱", chain:"solana",   twitter:"@bongocat_sol",   telegram:"t.me/bongocat",  website:"bongocat.meme",  price:"$0.0089", change24h:"+234.1%", change24hRaw:234.1, volume:"$3.2M", mcap:"$8.9M",  source:"new", isNew:true},
    {id:"n4", rank:4,  name:"Plume",             symbol:"PLUME",    logo:"🪶", chain:"ethereum", twitter:"@plumenetwork",   telegram:"t.me/plume",     website:"plumenetwork.xyz",price:"$0.052", change24h:"+14.2%",  change24hRaw:14.2,  volume:"$8.2M", mcap:"$52M",   source:"new", isNew:true},
    {id:"n5", rank:5,  name:"Nillion",           symbol:"NIL",      logo:"🔐", chain:"ethereum", twitter:"@nillionnetwork", telegram:"t.me/nillion",   website:"nillion.com",    price:"$0.38",   change24h:"+8.7%",   change24hRaw:8.7,   volume:"$12M",  mcap:"$76M",   source:"new", isNew:true},
  ].map((p, i) => ({
    ...p, isNew: p.isNew || false, addedDaysAgo: p.isNew ? 0 : 1,
    mcapRaw: 0, liquidity: "—", contract: "",
    dexUrl: `https://dexscreener.com/search?q=${p.symbol}`,
    isImg: false, category: "DeFi", stage: "Listed",
    description: `${p.name} (${p.symbol}) — on DexScreener`,
    tags: [p.chain, p.source === "new" ? "🆕 New" : "🔥 Trending"],
    trendScore: Math.min(99, 97 - i * 3),
  }));

  const loadStaticFeed = () => {
    setDexData({
      trending: STATIC_FEED.filter(p => p.source === "trending"),
      new:      STATIC_FEED.filter(p => p.source === "new"),
      gainers:  [...STATIC_FEED].sort((a, b) => b.change24hRaw - a.change24hRaw).slice(0, 12),
    });
    setDexLastUpdate(new Date());
  };

  const fetchDexScreener = async () => {
    setDexLoading(true);

    // First: immediately show static data so the UI is never empty
    loadStaticFeed();

    // Then: try to enrich with live AI web search
    try {
      const res = await fetch("https://scout-backend-8tru.onrender.com/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1024,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: `Search "dexscreener trending tokens today" and "dexscreener new listings". List the top 8 trending and 5 new tokens found. For each return name, symbol, chain, twitter, price, 24h% change. Return ONLY JSON: {"trending":[{"name":"x","symbol":"X","chain":"solana","twitter":"@x","price":"$0.1","change24h":"+50","volume":"$5M","dexUrl":"https://dexscreener.com/..."}],"new":[...]}` }],
        }),
      });

      if (res.ok) {
        let data = await res.json();
        let itr = 0;
        while (data.stop_reason === "tool_use" && itr < 5) {
          itr++;
          data = await fetch("https://scout-backend-8tru.onrender.com/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", "anthropic-version": "2023-06-01" },
            body: JSON.stringify({
              model: "claude-sonnet-4-5", max_tokens: 1024,
              tools: [{ type: "web_search_20250305", name: "web_search" }],
              messages: [
                { role: "user", content: `Search dexscreener trending tokens today and new listings. Return JSON with trending[] and new[] arrays.` },
                { role: "assistant", content: data.content },
                { role: "user", content: data.content.filter(b => b.type==="tool_use").map(b => ({ type:"tool_result", tool_use_id:b.id, content:"done" })) },
              ],
            }),
          }).then(r => r.json());
        }

        const txt = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
        const parsed = SAFE_JSON(txt);
        if (parsed && parsed.trending && parsed.trending.length > 0 || parsed && parsed.new && parsed.new.length > 0) {
          const toP = (item, i, source) => ({
            id: `live-${source}-${i}`, rank: i+1,
            name: item.name||"Unknown", symbol: (item.symbol||"?").toUpperCase(),
            logo: "🪙", isImg: false, chain: item.chain||"—", contract: "",
            dexUrl: item.dexUrl||`https://dexscreener.com/search?q=${item.symbol}`,
            twitter: item.twitter||"—", telegram: item.telegram||"—", website: item.website||"—",
            price: item.price||"—",
            change24h: item.change24h?(String(item.change24h).match(/^[+-]/)?item.change24h+"%":"+"+item.change24h+"%"):"—",
            change24hRaw: parseFloat(item.change24h)||0,
            volume: item.volume||"—", mcap: item.mcap||"—", mcapRaw: 0,
            source, isNew: source==="new", addedDaysAgo: source==="new"?0:1,
            category: "DeFi", stage: "Listed", isImg: false,
            description: item.description||`${item.name} on DexScreener`,
            tags: [item.chain||"Chain", source==="new"?"🆕 New":"🔥 Trending"],
            trendScore: Math.min(99, 95-i*3),
          });
          const trending = (parsed.trending||[]).map((x,i)=>toP(x,i,"trending"));
          const newest   = (parsed.new||[]).map((x,i)=>toP(x,i,"new"));
          const gainers  = [...trending,...newest].filter(p=>p.change24hRaw>0).sort((a,b)=>b.change24hRaw-a.change24hRaw).slice(0,12);
          setDexData({ trending, new: newest, gainers: gainers.length>0?gainers:trending });
          setDexLastUpdate(new Date());
        }
      }
    } catch(e) { console.warn("Live feed:", e.message); }

    setDexLoading(false);
  };

  // Load DexScreener when Auto Scout page is opened
  useEffect(() => {
    if (page === "autoscout") {
      loadStaticFeed(); // instant — no API call needed
    }
  }, [page]);

  const dexDisplay = dexData[dexTab] || [];

  const addLead = p => {
    if (!leads.find(l => l.id === p.id)) {
      setLeads(prev => [...prev, p]);
      sbAddPipeline(p);
    }
  };

  const removeLead = id => {
    setLeads(prev => prev.filter(l => l.id !== id));
    sbRemovePipeline(String(id));
  };

  const [contactHistory, setContactHistory] = useState([]);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    Promise.all([sbGetHistory(), sbGetPipeline()]).then(([hist, pipe]) => {
      if (hist) setContactHistory(hist.map(r => ({
        name: r.name, symbol: r.symbol, logo: r.logo, source: r.source,
        twitter: r.twitter, website: r.website, chain: r.chain,
        bdEmail: r.bd_email, bdTelegram: r.bd_telegram,
        bestContactPath: r.best_contact_path, confidence: r.confidence,
        description: r.description, fullResult: r.full_result, ts: r.created_at,
      })));
      if (pipe) setLeads(pipe.map(r => ({
        id: r.project_id, name: r.name, symbol: r.symbol, logo: r.logo,
        twitter: r.twitter, website: r.website, chain: r.chain,
        category: r.category, stage: r.stage, description: r.description,
      })));
      setDbLoading(false);
    });
  }, []);
  const addToHistory = entry => {
    setContactHistory(prev => {
      const key = (entry.name || "") + (entry.symbol || "");
      const filtered = prev.filter(h => (h.name || "") + (h.symbol || "") !== key);
      return [{ ...entry, ts: new Date() }, ...filtered].slice(0, 200);
    });
    sbAddHistory(entry);
  };
  const [historyModal, setHistoryModal] = useState(null);

  const quickScout = async (project) => {
    const twitterHint = project.twitter && project.twitter !== "—" ? ` Twitter: ${project.twitter}.` : "";
    const websiteHint = project.website && project.website !== "—" ? ` Website: ${project.website}.` : "";
    const prompt = `Find BD contacts for crypto project "${project.name}" (${project.symbol}) on ${project.chain}.${twitterHint}${websiteHint} Contract: ${project.contract || "unknown"}.
DexScreener: ${project.dexUrl || ""}
Search: "${project.symbol} ${project.chain} bscscan" OR "${project.symbol} etherscan", "${project.name} official email", "${project.name} twitter telegram", "${project.symbol} coingecko"
DO NOT invent emails. Return ONLY JSON: {"website":"domain","bdEmail":"email or Unknown","bdTelegram":"t.me/x or Unknown","twitterHandle":"@handle or Unknown","bestContactPath":"specific path","confidence":"High|Medium|Low","source":"where found"}`;
    let msgs = [{ role: "user", content: prompt }];
    let res = await SAFE_API(msgs);
    let i = 0;
    while (res.stop_reason === "tool_use" && i < 4 && !res._err) {
      i++;
      msgs.push({ role: "assistant", content: res.content });
      msgs.push({ role: "user", content: res.content.filter(b => b.type === "tool_use").map(b => ({ type: "tool_result", tool_use_id: b.id, content: "Search completed." })) });
      res = await SAFE_API(msgs);
    }
    const text = res.content.filter(b => b.type === "text").map(b => b.text).join("");
    return SAFE_JSON(text) || { website: project.website || "Unknown", bdEmail: "Unknown", bdTelegram: project.telegram || "Unknown", twitterHandle: project.twitter || "Unknown", bestContactPath: project.twitter !== "—" ? `Twitter DM: ${project.twitter}` : "Manual research needed", confidence: "Low", source: "API unavailable" };
  };

  const runAutoScout = async (list) => {
    autoStop.current = false; setAutoRunning(true); setAutoLog([]);
    const queue = list.slice(0, 15);
    for (const p of queue) {
      if (autoStop.current) break;
      setAutoActive(p.id);
      setAutoLog(prev => [{ id: p.id, name: p.name, symbol: p.symbol, logo: p.logo, isImg: p.isImg, chain: p.chain, status: "scanning", ts: new Date() }, ...prev].slice(0, 50));
      try {
        const r = await quickScout(p);
        setAutoDone(prev => ({ ...prev, [p.id]: r }));
        setAutoLog(prev => prev.map(l => l.id === p.id ? { ...l, status: "done", bdEmail: r.bdEmail, confidence: r.confidence } : l));
      } catch {
        setAutoLog(prev => prev.map(l => l.id === p.id ? { ...l, status: "error" } : l));
      }
      if (!autoStop.current) await new Promise(r => setTimeout(r, 2500));
    }
    setAutoActive(null); setAutoRunning(false);
  };

  const stopAutoScout = () => { autoStop.current = true; setAutoRunning(false); setAutoActive(null); };

  let display = applyView(ALL_PROJECTS, viewTab);
  if (catTab !== "all" && CAT_KEYS[catTab]) display = display.filter(p => CAT_KEYS[catTab].includes(p.category));
  if (stageFilt !== "All") display = display.filter(p => p.stage === stageFilt);
  if (search) display = display.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.symbol.toLowerCase().includes(search.toLowerCase()));

  const doneCount  = Object.keys(autoDone).length;
  const emailCount = Object.values(autoDone).filter(r => r.bdEmail && r.bdEmail !== "Unknown").length;
  const colLabel   = viewTab === "trending" ? "Trend" : viewTab === "gainers" ? "Gain" : viewTab === "new" ? "Added" : "Rank";

  const NAV = [
    { id: "home",      label: "📊 Projects" },
    { id: "scout",     label: "🛸 Scout AI", badge: "LIVE" },
    { id: "autoscout", label: "⚡ Auto Scout", badge: autoRunning ? "LIVE" : doneCount > 0 ? String(doneCount) : "NEW" },
    { id: "pipeline",  label: `📋 Pipeline (${leads.length})` },
    { id: "history",   label: "🕓 History", badge: contactHistory.length > 0 ? String(contactHistory.length) : undefined },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#06080f", fontFamily: "'DM Sans',sans-serif", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0a0d14}::-webkit-scrollbar-thumb{background:#252d3d;border-radius:3px}
        .row-hover:hover{background:rgba(255,255,255,0.04)!important;cursor:pointer}
        input::placeholder{color:#2d3748}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .fade-up{animation:fadeUp 0.22s ease forwards}
        select option{background:#0a0d14}
      `}</style>

      <nav className="sticky top-0 z-30" style={{ background: "rgba(6,8,15,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)" }}>S</div>
            <span className="font-bold text-white" style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1rem" }}>Scout <span style={{ color: "#ff6a00" }}>BD</span></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs flex-shrink-0" style={{ background: "rgba(255,106,0,0.1)", border: "1px solid rgba(255,106,0,0.2)", color: "#ff6a00" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />Live
          </div>
        </div>
        <div className="flex gap-1 px-3 pb-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all"
              style={{ background: page === item.id ? "rgba(255,106,0,0.12)" : "transparent", color: page === item.id ? "#ff6a00" : "#6b7280", border: page === item.id ? "1px solid rgba(255,106,0,0.25)" : "1px solid transparent" }}>
              {item.label}
              {item.badge && <span className="px-1 py-0.5 rounded font-bold" style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)", color: "white", fontSize: "9px" }}>{item.badge}</span>}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Curated Projects", value: ALL_PROJECTS.length, sub: "Manual BD targets", icon: "📊" },
            { label: "Live on DexScreener", value: dexData.trending.length + dexData.new.length > 0 ? dexData.trending.length + dexData.new.length : "—", sub: "New & trending tokens", icon: "📡" },
            { label: "Auto Scout", value: doneCount > 0 ? `${emailCount}/${doneCount}` : "Ready", sub: "Emails found/scanned", icon: "🤖" },
            { label: "BD Pipeline", value: leads.length, sub: "Saved leads", icon: "📋" },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center justify-between mb-2"><span className="text-gray-600 text-xs">{s.label}</span><span className="text-lg">{s.icon}</span></div>
              <p className="text-white font-bold text-2xl" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{s.value}</p>
              <p className="text-gray-700 text-xs mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {page === "scout" && <ScoutAIPage onAddLead={p => { addLead(p); setPage("pipeline"); }} onAddToHistory={addToHistory} contactHistory={contactHistory} />}

        {page === "autoscout" && (
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="rounded-2xl p-6 mb-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.06))", border: "1px solid rgba(99,102,241,0.25)" }}>
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-2xl">⚡</span>
                    <h2 className="text-white font-bold text-2xl" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>Auto Scout</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}>Live DexScreener</span>
                    {autoRunning && <span className="text-xs px-2 py-0.5 rounded-full font-bold animate-pulse" style={{ background: "rgba(16,185,129,0.2)", color: "#10b981" }}>● SCANNING</span>}
                  </div>
                  <p className="text-gray-400 text-sm mb-4 max-w-xl">Curated hot tokens ready to scout. Hit <span className="text-indigo-300 font-semibold">Refresh Feed</span> to search DexScreener live via AI for the latest trending tokens.</p>
                  <div className="flex items-center gap-6">
                    {[["Live tokens", dexDisplay.length, "#a5b4fc"], ["Scanned", doneCount, "#fff"], ["Emails found", emailCount, "#10b981"]].map(([l, v, c]) => (
                      <div key={l}><p className="text-xl font-bold" style={{ color: c, fontFamily: "'Space Grotesk',sans-serif" }}>{v}</p><p className="text-gray-600 text-xs">{l}</p></div>
                    ))}
                    {dexLastUpdate && <p className="text-gray-700 text-xs ml-auto">Updated {dexLastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={fetchDexScreener} disabled={dexLoading} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50" style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)" }}>
                    {dexLoading ? "⏳ Loading…" : "🔄 Refresh Feed"}
                  </button>
                  {!autoRunning ? (
                    <button onClick={() => runAutoScout(dexDisplay)} disabled={dexDisplay.length === 0} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-40"
                      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white" }}>
                      ⚡ Auto Scout ({Math.min(15, dexDisplay.length)})
                    </button>
                  ) : (
                    <button onClick={stopAutoScout} className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>⏹ Stop</button>
                  )}
                  {emailCount > 0 && (
                    <button onClick={() => { Object.entries(autoDone).filter(([, r]) => r.bdEmail && r.bdEmail !== "Unknown").forEach(([id]) => { const p = [...dexDisplay, ...ALL_PROJECTS].find(p => p.id === id); if (p) addLead(p); }); setPage("pipeline"); }}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)", color: "white" }}>
                      ➕ Add {emailCount} to Pipeline
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Source tabs */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {[
                { id: "trending", label: "🔥 Trending", desc: "Top boosted tokens" },
                { id: "new",      label: "🆕 New Listings", desc: "Just launched" },
                { id: "gainers",  label: "📈 Gainers", desc: "Top 24h movers" },
              ].map(t => (
                <button key={t.id} onClick={() => setDexTab(t.id)} className="flex flex-col px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: dexTab === t.id ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.03)", color: dexTab === t.id ? "#a5b4fc" : "#6b7280", border: "1px solid " + (dexTab === t.id ? "rgba(99,102,241,0.35)" : "rgba(255,255,255,0.08)") }}>
                  <span>{t.label}</span>
                  <span className="text-xs font-normal mt-0.5" style={{ color: dexTab === t.id ? "rgba(165,180,252,0.7)" : "#374151" }}>{t.desc}</span>
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc" }}>
                  📡 {dexData.trending[0] && dexData.trending[0].tags && dexData.trending[0].tags.includes("GeckoTerminal") ? "GeckoTerminal" : "DexScreener"} API
                </span>
                <a href="https://dexscreener.com" target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 rounded-lg hover:opacity-80" style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280" }}>Open DexScreener ↗</a>
              </div>
            </div>

            {/* Active scan indicator */}
            {autoRunning && autoActive && (() => {
              const p = dexDisplay.find(p => p.id === autoActive) || ALL_PROJECTS.find(p => p.id === autoActive);
              return p ? (
                <div className="rounded-xl p-4 mb-4 flex items-center gap-4" style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)" }}>
                  <div className="flex gap-1">{[0,1,2].map(i => <span key={i} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: (i * 0.15) + "s" }} />)}</div>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-lg" style={{ background: "rgba(255,255,255,0.06)" }}>{p.isImg ? <img src={p.logo} style={{ width: 24, height: 24, borderRadius: 6 }} /> : p.logo}</div>
                  <div><p className="text-white text-sm font-semibold">Scanning {p.name} ({p.symbol})</p><p className="text-gray-500 text-xs">Searching BSCScan, Etherscan, website, socials…</p></div>
                  <span className="ml-auto text-indigo-400 text-xs">{autoLog.filter(l => l.status === "scanning" || l.status === "queued").length} remaining</span>
                </div>
              ) : null;
            })()}

            {/* Empty state */}
            {!dexLoading && dexDisplay.length === 0 && (
              <div className="rounded-2xl p-12 text-center" style={{ border: "1px dashed rgba(99,102,241,0.2)" }}>
                <span className="text-5xl block mb-4">📡</span>
                <p className="text-white font-semibold text-lg mb-2">No live data yet</p>
                <p className="text-gray-500 text-sm mb-5">Click "Refresh Feed" to load live tokens from DexScreener</p>
                <button onClick={fetchDexScreener} className="px-6 py-3 rounded-xl font-semibold text-sm" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "white" }}>📡 Load Live Feed</button>
              </div>
            )}

            {dexLoading && (
              <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.15)" }}>
                <div className="flex gap-1 justify-center mb-3">{[0,1,2].map(i => <span key={i} className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: (i * 0.15) + "s" }} />)}</div>
                <p className="text-indigo-400 text-sm font-medium">Loading live data from DexScreener…</p>
              </div>
            )}

            {/* Live tokens table */}
            {!dexLoading && dexDisplay.length > 0 && (
              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="grid px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b" style={{ gridTemplateColumns: "44px 2fr 90px 1fr 1fr 1fr 1fr 180px", color: "#374151", borderColor: "rgba(255,255,255,0.06)" }}>
                  <span>#</span><span>Token</span><span>Chain</span><span>Price</span><span>24h</span><span>Volume</span><span>Mcap</span><span className="text-right">Actions</span>
                </div>
                {dexDisplay.slice(0, 30).map((p, idx) => {
                  const isPos = String(p.change24h).startsWith("+");
                  const res   = autoDone[p.id];
                  const isAct = autoActive === p.id;
                  const saved = !!leads.find(l => l.id === p.id);
                  return (
                    <div key={p.id} className="row-hover grid items-center px-5 py-3 border-b" style={{ gridTemplateColumns: "44px 2fr 90px 1fr 1fr 1fr 1fr 180px", borderColor: "rgba(255,255,255,0.04)" }}>
                      <span className="text-gray-600 text-sm">{idx + 1}</span>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                          {p.isImg && p.logo ? <img src={p.logo} style={{ width: 28, height: 28, objectFit: "contain" }} onError={e => e.target.style.display="none"} /> : <span className="text-base">{p.logo || "🪙"}</span>}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-white font-semibold text-sm truncate">{p.name}</p>
                            {p.source === "new" && <span className="text-xs px-1.5 py-0.5 rounded font-bold flex-shrink-0" style={{ background: "rgba(16,185,129,0.14)", color: "#10b981", fontSize: "9px" }}>NEW</span>}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-gray-600 text-xs">{p.symbol}</p>
                            {p.twitter && p.twitter !== "—" && <p className="text-blue-500 text-xs truncate max-w-[80px]">{p.twitter}</p>}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>{p.chain}</span>
                      <span className="text-white text-sm font-medium">{p.price}</span>
                      <span className={`text-sm font-medium ${p.change24h === "—" ? "text-gray-700" : isPos ? "text-emerald-400" : "text-red-400"}`}>{p.change24h}</span>
                      <span className="text-gray-300 text-sm">{p.volume}</span>
                      <span className="text-gray-300 text-sm">{p.mcap}</span>
                      <div className="flex items-center gap-1.5 justify-end flex-wrap" onClick={e => e.stopPropagation()}>
                        {isAct && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />}
                        {!isAct && res && (
                          <span title={res.bdEmail !== "Unknown" ? res.bdEmail : "No email found"} className="text-sm flex-shrink-0">
                            {res.bdEmail !== "Unknown" ? "📧" : "⚡"}
                          </span>
                        )}
                        {p.dexUrl && (
                          <a href={p.dexUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-1.5 rounded-lg text-xs font-medium flex-shrink-0" style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc" }}>📊</a>
                        )}
                        <button onClick={() => setContact(p)} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0" style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)", color: "white" }}>🤖</button>
                        <button onClick={() => addLead(p)} className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex-shrink-0" style={{ background: saved ? "rgba(16,185,129,0.14)" : "rgba(255,255,255,0.05)", color: saved ? "#10b981" : "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }}>{saved ? "✓" : "+"}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Scan results */}
            {autoLog.length > 0 && (
              <div className="mt-5 rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="text-white font-semibold text-sm">📋 Scan Results</span>
                  <span className="text-gray-600 text-xs">{doneCount} scanned · {emailCount} emails</span>
                </div>
                <div className="grid px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b" style={{ gridTemplateColumns: "2fr 80px 1.5fr 1fr 140px", color: "#374151", borderColor: "rgba(255,255,255,0.06)" }}>
                  <span>Token</span><span>Status</span><span>Email</span><span>Confidence</span><span className="text-right">Action</span>
                </div>
                {autoLog.map(log => {
                  const r   = autoDone[log.id];
                  const isAct = autoActive === log.id;
                  return (
                    <div key={log.id} className="grid items-center px-5 py-3 border-b" style={{ gridTemplateColumns: "2fr 80px 1.5fr 1fr 140px", borderColor: "rgba(255,255,255,0.04)", background: isAct ? "rgba(99,102,241,0.05)" : "transparent" }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                          {log.isImg && log.logo ? <img src={log.logo} style={{ width: 24, height: 24, objectFit: "contain" }} /> : <span>{log.logo || "🪙"}</span>}
                        </div>
                        <div><p className="text-white text-sm font-semibold">{log.name}</p><p className="text-gray-600 text-xs">{log.symbol} · {log.chain}</p></div>
                      </div>
                      <div>
                        {isAct && <span className="flex items-center gap-1 text-indigo-400 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />Scanning</span>}
                        {log.status === "done"    && <span className="text-emerald-400 text-xs font-medium">✅ Done</span>}
                        {log.status === "error"   && <span className="text-red-400 text-xs">❌ Error</span>}
                        {log.status === "scanning"&& !isAct && <span className="text-gray-600 text-xs">Queued</span>}
                      </div>
                      <div>{r && r.bdEmail && r.bdEmail !== "Unknown"
                        ? <div className="flex items-center gap-1.5"><span className="text-emerald-300 text-xs font-mono truncate max-w-[150px]">{r.bdEmail}</span><button onClick={() => navigator.clipboard.writeText(r.bdEmail)} className="text-xs px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>⎘</button></div>
                        : <span className="text-gray-700 text-xs">{r ? "Not found" : "—"}</span>}
                      </div>
                      <div>{r && r.confidence && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: r.confidence === "High" ? "rgba(16,185,129,0.12)" : r.confidence === "Medium" ? "rgba(245,158,11,0.12)" : "rgba(239,68,68,0.12)", color: r.confidence === "High" ? "#10b981" : r.confidence === "Medium" ? "#f59e0b" : "#ef4444" }}>{r.confidence}</span>}</div>
                      <div className="flex gap-1.5 justify-end">
                        {r && r.bestContactPath && <span className="text-gray-600 text-xs truncate max-w-[80px]">{r.bestContactPath.split(":")[0]}</span>}
                        <button onClick={() => { const p = [...dexDisplay, ...ALL_PROJECTS].find(x => x.id === log.id); if (p) setContact(p); }} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex-shrink-0" style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)", color: "white" }}>🤖</button>
                        <button onClick={() => { const p = [...dexDisplay, ...ALL_PROJECTS].find(x => x.id === log.id); if (p) addLead({ ...p, ...(r || {}) }); }} className="px-2.5 py-1.5 rounded-lg text-xs flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {page === "home" && (
          <>
            <div className="flex items-end justify-between border-b mb-5" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="flex">
                {VIEW_TABS.map(t => (
                  <button key={t.id} onClick={() => { setViewTab(t.id); setAnimKey(k => k + 1); }} className="flex flex-col items-start px-5 pb-3 pt-2.5 border-b-2 transition-all"
                    style={{ borderBottomColor: viewTab === t.id ? "#ff6a00" : "transparent", color: viewTab === t.id ? "#ff6a00" : "#6b7280" }}>
                    <span className="text-sm font-semibold">{t.label}</span>
                    <span className="text-xs mt-0.5 hidden md:block" style={{ color: viewTab === t.id ? "rgba(255,106,0,0.6)" : "#374151" }}>{t.desc}</span>
                  </button>
                ))}
              </div>
              <div className="pb-3">
                <select value={stageFilt} onChange={e => setStageFilt(e.target.value)} className="text-xs px-3 py-1.5 rounded-lg text-white outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-5">
              {CAT_TABS.map(c => (
                <button key={c.id} onClick={() => { setCatTab(c.id); setAnimKey(k => k + 1); }} className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border"
                  style={{ background: catTab === c.id ? "rgba(255,106,0,0.14)" : "rgba(255,255,255,0.03)", color: catTab === c.id ? "#ff6a00" : "#6b7280", borderColor: catTab === c.id ? "rgba(255,106,0,0.32)" : "rgba(255,255,255,0.08)" }}>
                  {c.label}
                </button>
              ))}
              <div className="ml-auto relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600 text-xs">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="pl-7 pr-3 py-1.5 rounded-lg text-xs text-white outline-none w-36" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }} />
              </div>
            </div>

            <div key={animKey} className="rounded-2xl overflow-hidden fade-up" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.012)" }}>
              <div className="grid px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b" style={{ gridTemplateColumns: "70px 2.2fr 1fr 130px 1fr 1fr 1fr 190px", color: "#374151", borderColor: "rgba(255,255,255,0.06)" }}>
                <span>{colLabel}</span><span>Project</span><span>Category</span><span>Stage</span><span>Price</span><span>Mkt Cap</span><span>24h</span><span className="text-right">Actions</span>
              </div>

              {display.length === 0 && <div className="text-center py-16 text-gray-700 text-sm">No projects match.</div>}

              {display.map(p => {
                const isPos  = p.change24h.startsWith("+");
                const saved  = !!leads.find(l => l.id === p.id);
                const asDone = autoDone[p.id];
                const isActive = autoActive === p.id;
                return (
                  <div key={p.id} className="row-hover grid items-center px-5 py-3.5 border-b transition-all" style={{ gridTemplateColumns: "70px 2.2fr 1fr 130px 1fr 1fr 1fr 190px", borderColor: "rgba(255,255,255,0.04)" }} onClick={() => setSelected(p)}>
                    <div className="pr-2">
                      {viewTab === "top"      && <span className="text-gray-600 text-sm font-medium">#{p.rank}</span>}
                      {viewTab === "trending" && <ScoreBar score={p.trendScore} color="#ff6a00" />}
                      {viewTab === "gainers"  && <span className={`text-sm font-bold ${isPos ? "text-emerald-400" : "text-red-400"}`}>{p.change24h}</span>}
                      {viewTab === "new"      && <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>{p.addedDaysAgo <= 1 ? "Today" : p.addedDaysAgo + "d"}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>{p.logo}</div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-white font-semibold text-sm">{p.name}</p>
                          {p.isNew && <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(16,185,129,0.14)", color: "#10b981", fontSize: "9px" }}>NEW</span>}
                        </div>
                        <p className="text-gray-600 text-xs">{p.symbol}</p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">{p.category}</span>
                    <StagePill stage={p.stage} />
                    <span className="text-white text-sm font-medium">{p.price}</span>
                    <span className="text-white text-sm">{p.mcap}</span>
                    <span className={`text-sm font-medium ${p.change24h === "—" ? "text-gray-700" : isPos ? "text-emerald-400" : "text-red-400"}`}>{p.change24h}</span>
                    <div className="flex gap-1.5 justify-end items-center" onClick={e => e.stopPropagation()}>
                      {isActive && <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />}
                      {!isActive && asDone && <span title={asDone.bdEmail !== "Unknown" ? asDone.bdEmail : "No email"} style={{ cursor: "help" }}>{asDone.bdEmail !== "Unknown" ? "📧" : "⚡"}</span>}
                      <button onClick={() => setContact(p)} className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:scale-105 transition-all" style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)", color: "white" }}>🤖 BD</button>
                      <button onClick={() => addLead(p)} className="px-2.5 py-1.5 rounded-lg text-xs font-medium" style={{ background: saved ? "rgba(16,185,129,0.14)" : "rgba(255,255,255,0.05)", color: saved ? "#10b981" : "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }}>{saved ? "✓" : "+"}</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-gray-800 text-xs text-center mt-4">Showing {display.length} of {ALL_PROJECTS.length} curated BD targets</p>
          </>
        )}

        {page === "history" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-xl">🕓 Contact History</h2>
                <p className="text-gray-600 text-sm mt-1">All AI-scraped contacts — never research the same project twice</p>
              </div>
              {contactHistory.length > 0 && (
                <button onClick={() => { setContactHistory([]); sbFetch("/scout_history", "DELETE"); }} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                  Clear all
                </button>
              )}
            </div>
            {contactHistory.length === 0 ? (
              <div className="text-center py-20 rounded-2xl" style={{ border: "1px dashed rgba(255,255,255,0.08)" }}>
                <p className="text-4xl mb-3">🕓</p>
                <p className="text-white font-semibold mb-1">No history yet</p>
                <p className="text-gray-600 text-sm">Use Scout AI or the 🤖 BD button on any project — results appear here automatically</p>
              </div>
            ) : (
              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="grid px-5 py-3 text-xs font-semibold uppercase tracking-wider border-b" style={{ gridTemplateColumns: "2fr 90px 2fr 100px 100px 110px", color: "#374151", borderColor: "rgba(255,255,255,0.06)" }}>
                  <span>Project</span><span>Source</span><span>Best Contact</span><span>Email</span><span>Confidence</span><span className="text-right">Actions</span>
                </div>
                {contactHistory.map((item, i) => {
                  const hasEmail = item.bdEmail && item.bdEmail !== "Unknown";
                  const srcColor = item.source === "Scout AI" ? "#ff6a00" : "#a5b4fc";
                  const confColor = item.confidence === "High" ? "#10b981" : item.confidence === "Medium" ? "#f59e0b" : "#6b7280";
                  return (
                    <div key={i} className="grid items-center px-5 py-3 border-b row-hover" style={{ gridTemplateColumns: "2fr 90px 2fr 100px 100px 110px", borderColor: "rgba(255,255,255,0.04)" }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>{item.logo || "🪙"}</div>
                        <div>
                          <p className="text-white font-semibold text-sm">{item.name}</p>
                          <p className="text-gray-600 text-xs">{item.symbol}{item.chain && item.chain !== "—" ? " · " + item.chain : ""}</p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold w-fit" style={{ background: srcColor + "18", color: srcColor }}>{item.source}</span>
                      <span className="text-gray-400 text-xs truncate pr-3">{item.bestContactPath || "—"}</span>
                      <div>
                        {hasEmail
                          ? <div className="flex items-center gap-1">
                              <span className="text-emerald-400 text-xs font-mono truncate max-w-[80px]">{item.bdEmail}</span>
                              <button onClick={() => navigator.clipboard.writeText(item.bdEmail)} className="text-xs px-1 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>⎘</button>
                            </div>
                          : <span className="text-gray-700 text-xs">—</span>}
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full w-fit" style={{ background: confColor + "18", color: confColor }}>{item.confidence || "—"}</span>
                      <div className="flex gap-1.5 justify-end">
                        {item.fullResult && (
                          <button onClick={() => setHistoryModal(item)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)" }}>
                            Read
                          </button>
                        )}
                        <button onClick={() => { setPage("scout"); }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)", color: "white" }}>
                          🛸
                        </button>
                        <button onClick={() => addLead({ id: "h" + i, name: item.name, symbol: item.symbol, logo: item.logo, twitter: item.twitter, website: item.website, chain: item.chain || "—", category: "DeFi", stage: "Listed", description: item.description || "", tags: [] })}
                          className="px-2.5 py-1.5 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.05)", color: "#6b7280", border: "1px solid rgba(255,255,255,0.08)" }}>
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {page === "pipeline" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-xl" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>BD Pipeline</h2>
              <span className="text-gray-600 text-sm">{leads.length} projects</span>
            </div>
            {leads.length === 0 ? (
              <div className="text-center py-20 rounded-2xl" style={{ border: "1px dashed rgba(255,255,255,0.08)" }}>
                <p className="text-4xl mb-3">📋</p>
                <p className="text-gray-600 text-sm">No leads yet. Browse <button onClick={() => setPage("home")} className="text-orange-400">Projects</button> or use <button onClick={() => setPage("scout")} className="text-orange-400">Scout AI</button>.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leads.map(p => (
                  <div key={p.id} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: "rgba(255,255,255,0.06)" }}>{p.logo}</div>
                      <div className="flex-1"><p className="text-white font-semibold">{p.name}</p><p className="text-gray-600 text-xs">{p.symbol} · {p.category}</p></div>
                      <StagePill stage={p.stage} />
                    </div>
                    <p className="text-gray-600 text-xs mb-4 leading-relaxed line-clamp-2">{p.description}</p>
                    <button onClick={() => setContact(p)} className="w-full py-2.5 rounded-xl text-xs font-semibold hover:scale-[1.02] transition-all" style={{ background: "linear-gradient(135deg,#ff6a00,#ee0979)", color: "white" }}>🤖 Find BD Contacts</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} onFindContacts={p => { setSelected(null); setContact(p); }} />}
      {contact  && <AIContactModal project={contact} onClose={() => setContact(null)} />}

      {historyModal && <HistoryDetailModal item={historyModal} onClose={() => setHistoryModal(null)} />}

      {autoRunning && page !== "autoscout" && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer shadow-2xl" style={{ background: "linear-gradient(135deg,#1a1f2e,#111827)", border: "1px solid rgba(99,102,241,0.35)", minWidth: 280 }} onClick={() => setPage("autoscout")}>
          <div className="flex gap-1">{[0, 1, 2].map(i => <span key={i} className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: (i * 0.15) + "s" }} />)}</div>
          <div className="flex-1"><p className="text-white text-sm font-semibold">Auto Scout running</p><p className="text-gray-500 text-xs">{doneCount} scanned · {emailCount} emails found</p></div>
          <span className="text-indigo-400 text-xs">View →</span>
        </div>
      )}
    </div>
  );
}

function HistoryDetailModal({ item, onClose }) {
  const r = item.fullResult || {};
  const CONF = { High: { bg: "rgba(16,185,129,0.14)", c: "#10b981" }, Medium: { bg: "rgba(245,158,11,0.14)", c: "#f59e0b" }, Low: { bg: "rgba(239,68,68,0.14)", c: "#ef4444" } };
  const conf = CONF[r.dataQuality] || CONF.Low;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }} onClick={onClose}>
      <div className="rounded-2xl overflow-y-auto max-h-screen w-full max-w-2xl" style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.1)" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)", background: "linear-gradient(135deg,rgba(255,106,0,0.08),rgba(238,9,121,0.05))" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)" }}>{item.logo || "🛸"}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white font-bold text-xl">{item.name}</h2>
                  {r.symbol && <span className="text-gray-500 text-sm">{r.symbol}</span>}
                  {r.bdScore && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(255,106,0,0.2)", color: "#ff6a00" }}>Score {r.bdScore}</span>}
                </div>
                {r.tagline && <p className="text-orange-400 text-sm">{r.tagline}</p>}
                <div className="flex gap-3 mt-1 text-xs text-gray-600 flex-wrap">
                  {r.chain && <span>{r.chain}</span>}
                  {r.stage && <span>{r.stage}</span>}
                  {r.website && <span>{r.website}</span>}
                  {item.ts && <span>Scouted {new Date(item.ts).toLocaleDateString()}</span>}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-600 hover:text-white text-2xl leading-none flex-shrink-0" style={{ background: "none", border: "none", cursor: "pointer" }}>×</button>
          </div>
          {r.description && <p className="text-gray-400 text-sm mt-3 leading-relaxed">{r.description}</p>}
        </div>

        <div className="p-6 flex flex-col gap-5">

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4" style={{ background: item.bdEmail && item.bdEmail !== "Unknown" ? "rgba(16,185,129,0.07)" : "rgba(255,255,255,0.03)", border: "1px solid " + (item.bdEmail && item.bdEmail !== "Unknown" ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.07)") }}>
              <p className="text-xs font-bold uppercase mb-2" style={{ color: "#6b7280" }}>📧 BD Email</p>
              {item.bdEmail && item.bdEmail !== "Unknown"
                ? <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-mono text-sm font-bold break-all">{item.bdEmail}</span>
                    <button onClick={() => navigator.clipboard.writeText(item.bdEmail)} className="text-xs px-2 py-0.5 rounded flex-shrink-0" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "none", cursor: "pointer" }}>⎘</button>
                  </div>
                : <span className="text-gray-600 text-sm">Not found</span>}
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs font-bold uppercase mb-2" style={{ color: "#6b7280" }}>💬 Telegram</p>
              {item.bdTelegram && item.bdTelegram !== "Unknown"
                ? <span className="text-blue-400 text-sm">{item.bdTelegram}</span>
                : <span className="text-gray-600 text-sm">Not found</span>}
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs font-bold uppercase mb-2" style={{ color: "#6b7280" }}>🎯 Best Contact Path</p>
              <span className="text-white text-sm">{item.bestContactPath || "—"}</span>
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs font-bold uppercase mb-2" style={{ color: "#6b7280" }}>📊 Data Quality</p>
              <span className="text-xs px-2 py-1 rounded-lg font-bold" style={{ background: conf.bg, color: conf.c }}>{r.dataQuality || item.confidence || "—"}</span>
            </div>
          </div>

          {/* BD Contacts list */}
          {r.contacts && r.contacts.length > 0 && (
            <div>
              <p className="text-white font-semibold text-sm mb-3">👥 Team Contacts</p>
              <div className="flex flex-col gap-2">
                {r.contacts.map((c, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-white font-semibold text-sm">{c.name}</span>
                        <span className="text-orange-400 text-xs ml-2">{c.role}</span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: CONF[c.confidence] ? CONF[c.confidence].bg : CONF.Low.bg, color: CONF[c.confidence] ? CONF[c.confidence].c : CONF.Low.c }}>{c.confidence}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs">
                      {c.email && c.email !== "Unknown" && <span className="text-emerald-400 font-mono">📧 {c.email}</span>}
                      {c.twitter && c.twitter !== "Unknown" && <span className="text-blue-400">🐦 {c.twitter}</span>}
                      {c.telegram && c.telegram !== "Unknown" && <span className="text-blue-400">💬 {c.telegram}</span>}
                      {c.linkedin && c.linkedin !== "Unknown" && <span className="text-indigo-400">💼 {c.linkedin}</span>}
                    </div>
                    {c.notes && <p className="text-gray-600 text-xs mt-2">{c.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BD Score + Listing interest */}
          {(r.bdScore || r.listingInterest || r.tge) && (
            <div className="grid grid-cols-3 gap-3">
              {r.bdScore && <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,106,0,0.07)", border: "1px solid rgba(255,106,0,0.2)" }}><p className="text-gray-600 text-xs mb-1">BD Score</p><p className="text-orange-400 font-bold text-2xl">{r.bdScore}</p></div>}
              {r.listingInterest && <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}><p className="text-gray-600 text-xs mb-1">Listing Interest</p><p className="text-white font-bold text-sm mt-1">{r.listingInterest}</p></div>}
              {r.tge && <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}><p className="text-gray-600 text-xs mb-1">TGE</p><p className="text-white font-bold text-sm mt-1">{r.tge}</p></div>}
            </div>
          )}

          {/* Outreach strategy */}
          {r.bestApproach && (
            <div className="rounded-xl p-4" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
              <p className="text-indigo-400 font-semibold text-sm mb-2">🎯 Outreach Strategy</p>
              <p className="text-gray-300 text-sm leading-relaxed">{r.bestApproach}</p>
            </div>
          )}

          {/* Description / tagline */}
          {r.tagline && r.description && (
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-white font-semibold text-sm mb-2">📋 About</p>
              <p className="text-gray-400 text-sm leading-relaxed">{r.description}</p>
            </div>
          )}

          {/* Search stats */}
          {r._searches > 0 && (
            <p className="text-gray-700 text-xs text-center">{r._searches} searches · {(r._emails || []).length} emails found · {new Date(item.ts).toLocaleString()}</p>
          )}

        </div>
      </div>
    </div>
  );
}
