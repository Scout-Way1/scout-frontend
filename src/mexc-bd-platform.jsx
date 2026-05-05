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
        max_tokens: 4000,
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
              <p className="text-white font-semibold text-lg mb-2">Find Contacts</p>
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
            🤖 Find Contacts with AI
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
  { icon: "💡", label: "profile" },
];

function ScoutAIPage({ onAddLead, onAddToHistory, contactHistory, dbLoading }) {
  const [handle,  setHandle]  = useState("");
  const [phase,   setPhase]   = useState("idle");
  const [stream,  setStream]  = useState("");
  const [result,  setResult]  = useState(null);
  const [history, setHistory] = useState([]);
  const [copied,  setCopied]  = useState(null);
  const [searchMode, setSearchMode] = useState("twitter");
  const [resultTab, setResultTab] = useState("overview");
  const [externalLink, setExternalLink] = useState(null);
  const forceRerun = useRef(false);

  const copy = function(text, key) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(function() { setCopied(null); }, 2000);
  };

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
    setPhase("loading"); setStream(""); setResult(null); setResultTab("overview");

    let log = "";
    const addLog = line => { log += line + "\n"; setStream(log); };

    try {
      addLog(isWebsite ? "🌐 Scouting " + h + "…" : "🚀 Scouting @" + h + "…");
      addLog("🔍 Searching for BD contacts…");

      const searchTarget = isWebsite ? handle.trim() : "@" + h;
      const prompt = isWebsite
        ? "You are a crypto BD researcher. Find ALL contact information for the crypto project at website " + h + ". THOROUGHLY search: 1) Visit the website directly — check /contact, /about, /team pages for any email, 2) Search '" + h + " email BD contact', 3) Check BSCScan or Etherscan for this project. Look for ANY email: contact@, hello@, bd@, info@, partnerships@, listing@. Return ONLY raw JSON: {\"projectName\":\"Full Name\",\"symbol\":\"TICKER\",\"emoji\":\"🚀\",\"tagline\":\"one line description\",\"description\":\"2-3 sentences about the project\",\"category\":\"DeFi|Layer 1|Layer 2|AI|DePIN|RWA|Infra|Other\",\"stage\":\"Pre-Launch|Post-Launch|Listed\",\"chain\":\"chain name\",\"website\":\"" + h + "\",\"twitter\":\"@handle or Unknown\",\"telegram\":\"t.me/x or Unknown\",\"bdEmail\":\"real email or Unknown\",\"bdTelegram\":\"t.me/x or Unknown\",\"bestContactPath\":\"specific actionable recommendation\",\"outreachStrategy\":\"2-3 sentence exchange listing pitch\",\"bdScore\":75,\"listingInterest\":\"High|Medium|Low\",\"dataQuality\":\"High|Medium|Low\",\"contacts\":[{\"name\":\"Full Name\",\"role\":\"exact role\",\"email\":\"email or Unknown\",\"twitter\":\"@handle or Unknown\",\"linkedin\":\"url or Unknown\",\"telegram\":\"@handle or Unknown\",\"confidence\":\"High|Medium|Low\",\"bestPath\":\"Email|Twitter DM|Telegram|LinkedIn\",\"notes\":\"specific tip on how to reach them\"}]}"
        : "You are a crypto BD researcher for an exchange listing team. Research the project @" + h + " thoroughly.\n\nSearch in this order:\n1. Find their official website — search '" + h + " crypto official website'\n2. Visit their website — check /contact, /about, /team pages for emails\n3. Search '" + h + " bd email listing contact'\n4. Check BSCScan or Etherscan for team emails\n5. Search LinkedIn for their BD or partnerships team\n6. Check their Telegram group for contact info\n\nReturn ONLY raw JSON:\n{\"projectName\":\"Full Name\",\"symbol\":\"TICKER\",\"emoji\":\"🚀\",\"tagline\":\"one line description\",\"description\":\"2-3 sentences about what they do\",\"category\":\"DeFi|Layer 1|Layer 2|AI|DePIN|RWA|Infra|Other\",\"stage\":\"Pre-Launch|Post-Launch|Listed\",\"chain\":\"chain name\",\"website\":\"domain.com\",\"twitter\":\"@handle\",\"telegram\":\"t.me/x or Unknown\",\"bdEmail\":\"real verified email or Unknown\",\"bdTelegram\":\"t.me/x or Unknown\",\"bestContactPath\":\"specific actionable recommendation\",\"outreachStrategy\":\"2-3 sentence exchange listing pitch\",\"bdScore\":75,\"listingInterest\":\"High|Medium|Low\",\"dataQuality\":\"High|Medium|Low\",\"contacts\":[{\"name\":\"Full Name\",\"role\":\"exact role\",\"email\":\"email or Unknown\",\"twitter\":\"@handle or Unknown\",\"linkedin\":\"url or Unknown\",\"telegram\":\"@handle or Unknown\",\"confidence\":\"High|Medium|Low\",\"bestPath\":\"Email|Twitter DM|Telegram|LinkedIn\",\"notes\":\"specific tip\"}]}";

      let msgs = [{ role: "user", content: prompt }];

      // Check cache first — skip if user clicked Rerun
      const hist = contactHistory || [];
      if (!forceRerun.current && hist.length > 0) {
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
      }
      forceRerun.current = false;

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
        for (const b of res.content) { if (b.type === "tool_use") addLog("🔎 " + (b.input && b.input.query)); }
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
      addLog("✅ Done — " + ei + " searches run");

      const txt = res.content.filter(b => b.type === "text").map(b => b.text).join("");
      addLog("📄 Length: " + txt.length + " — " + txt.slice(0, 80));

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
      addLog("❌ " + e.message);
      setPhase("error");
    }
  };

  const CONF = { High: { bg: "rgba(16,185,129,0.14)", c: "#10b981" }, Medium: { bg: "rgba(245,158,11,0.14)", c: "#f59e0b" }, Low: { bg: "rgba(239,68,68,0.14)", c: "#ef4444" } };
  const BD = r => r >= 80 ? "#10b981" : r >= 60 ? "#fbbf24" : "#ef4444";
  const h = cleanHandle(handle);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>

      {/* Page header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div className="ticker" style={{ color: "#4a5568", fontSize: 10 }}>SCOUT AI</div>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", animation: "pulse-dot 2s infinite" }} />
          <div className="ticker" style={{ color: "#fbbf24", fontSize: 10 }}>LIVE</div>
        </div>
        <h1 className="sans" style={{ fontSize: 28, fontWeight: 700, color: "#f0f6fc", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Analysis</h1>
        <p className="sans" style={{ color: "#4a5568", fontSize: 14, margin: 0 }}>Enter a Twitter handle or website — AI searches the web and builds a complete contact profile.</p>
      </div>

      {/* Search input */}
      <div style={{ background: "#0d1117", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 6, padding: 20, marginBottom: 24 }}>
        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
          {[["twitter","TWITTER HANDLE"],["website","WEBSITE URL"]].map(function(m) {
            var active = searchMode === m[0];
            return (
              <button key={m[0]} onClick={() => { setSearchMode(m[0]); setHandle(""); }} className="ticker"
                style={{ padding: "5px 12px", borderRadius: 3, border: "1px solid " + (active ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.06)"), background: active ? "rgba(251,191,36,0.08)" : "transparent", color: active ? "#fbbf24" : "#4a5568", cursor: "pointer", fontSize: 10, transition: "all 0.15s" }}>
                {m[1]}
              </button>
            );
          })}
        </div>

        {/* Input row */}
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#4a5568", fontSize: 13 }}>{searchMode === "twitter" ? "@" : "🌐"}</span>
            <input value={handle} onChange={function(e) {
              var val = e.target.value;
              setHandle(val);
              if (val.startsWith("http") || val.startsWith("www.")) setSearchMode("website");
              else if (val.startsWith("@")) setSearchMode("twitter");
            }} onKeyDown={function(e) { if (e.key === "Enter") runScout(); }}
              placeholder={searchMode === "twitter" ? "twitterhandle" : "https://projectsite.com"}
              style={{ width: "100%", paddingLeft: 32, paddingRight: 14, paddingTop: 11, paddingBottom: 11, background: "#080a0f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, color: "#f0f6fc", fontSize: 14, outline: "none", fontFamily: "'IBM Plex Mono', monospace" }} />
          </div>
          <button onClick={function() { runScout(); }} disabled={phase === "loading" || dbLoading} className="scout-btn ticker"
            style={{ padding: "11px 24px", borderRadius: 4, border: "1px solid rgba(251,191,36,0.4)", background: "rgba(251,191,36,0.1)", color: "#fbbf24", cursor: "pointer", fontSize: 11, fontWeight: 600, opacity: phase === "loading" || dbLoading ? 0.5 : 1, whiteSpace: "nowrap", transition: "all 0.15s" }}>
            {phase === "loading" ? "SCANNING..." : dbLoading ? "LOADING..." : "RUN SCOUT →"}
          </button>
        </div>

        {/* Quick examples */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <span className="ticker" style={{ color: "#374151", fontSize: 10 }}>TRY:</span>
          {["@monad_xyz", "@berachain", "@KaitoAI", "@virtuals_io", "@aixovia"].map(function(ex) {
            return (
              <button key={ex} onClick={function() { setHandle(ex); runScout(ex); }} className="ticker"
                style={{ fontSize: 10, padding: "3px 8px", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", color: "#4a5568", borderRadius: 2, cursor: "pointer" }}>
                {ex}
              </button>
            );
          })}
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
        <div style={{ background: "#0d1117", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 6, padding: 24 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24", animation: "pulse-dot 0.8s infinite", flexShrink: 0 }} />
            <span className="ticker" style={{ color: "#fbbf24", fontSize: 11 }}>SCANNING @{h.toUpperCase()}</span>
            <span className="ticker" style={{ marginLeft: "auto", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24", fontSize: 10, padding: "2px 10px", borderRadius: 2 }}>
              {(stream.match(/🔎/g) || []).length} SEARCHES
            </span>
          </div>

          {/* Step indicators */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16, position: "relative" }}>
            <div style={{ position: "absolute", top: 10, left: "10%", right: "10%", height: 1, background: "rgba(255,255,255,0.04)" }} />
            {SCOUT_STEPS.map(function(s, i) {
              var searchCount = (stream.match(/🔎/g) || []).length;
              var done = searchCount > i * 1.2;
              var active = !done && searchCount >= i * 1.2;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, zIndex: 1, flex: 1 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1px solid " + (done ? "#fbbf24" : active ? "rgba(251,191,36,0.4)" : "rgba(255,255,255,0.08)"), background: done ? "#fbbf24" : active ? "rgba(251,191,36,0.08)" : "#080a0f", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.4s", boxShadow: active ? "0 0 10px rgba(251,191,36,0.3)" : "none" }}>
                    {done
                      ? <span style={{ fontSize: 10, color: "#080a0f", fontWeight: 700 }}>✓</span>
                      : active
                      ? <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fbbf24", animation: "pulse-dot 0.6s infinite" }} />
                      : null}
                  </div>
                  <span className="ticker" style={{ fontSize: 8, letterSpacing: "0.04em", color: done ? "#fbbf24" : active ? "rgba(251,191,36,0.5)" : "#1e2940", textAlign: "center", maxWidth: 70, lineHeight: 1.4 }}>{s.label.toUpperCase()}</span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div style={{ height: 2, background: "rgba(255,255,255,0.04)", borderRadius: 1, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg,#fbbf24,rgba(251,191,36,0.5))", width: Math.min(((stream.match(/🔎/g) || []).length / 6) * 100, 95) + "%", transition: "width 0.8s ease", boxShadow: "0 0 8px rgba(251,191,36,0.5)" }} />
          </div>

          {/* Terminal */}
          <div style={{ background: "#080a0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              {["#ef4444","#fbbf24","#10b981"].map(function(c,i) { return <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.5 }} />; })}
              <span className="ticker" style={{ marginLeft: 8, color: "#1e2940", fontSize: 9, letterSpacing: "0.08em" }}>SCOUT TERMINAL</span>
            </div>
            {stream.split("\n").filter(Boolean).map(function(line, i) {
              return (
                <div key={i} className="ticker" style={{ fontSize: 11, lineHeight: 1.7, color: line.startsWith("🔎") ? "#60a5fa" : line.startsWith("🚀") || line.startsWith("🌐") ? "#fbbf24" : line.startsWith("✅") ? "#10b981" : line.startsWith("📄") ? "#a5b4fc" : "#374151" }}>
                  {line}
                </div>
              );
            })}
            <span style={{ display: "inline-block", width: 6, height: 13, background: "#fbbf24", animation: "blink 1s infinite", verticalAlign: "middle", opacity: 0.8 }} />
          </div>
        </div>
      )}

      {phase === "done" && result && (
        <div className="fade-in">

          {/* HEADER CARD */}
          <div style={{ background: "#0d1117", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 6, padding: 24, marginBottom: 16, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(251,191,36,0.04)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: 8, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{result.emoji || "🔍"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                  <h2 className="sans" style={{ color: "#f0f6fc", fontWeight: 700, fontSize: 22, margin: 0, letterSpacing: "-0.02em" }}>{result.projectName}</h2>
                  {result.symbol && <span className="ticker" style={{ color: "#fbbf24", fontSize: 11, background: "rgba(251,191,36,0.1)", padding: "2px 8px", borderRadius: 2 }}>{result.symbol}</span>}
                  {result.stage && <span className="ticker" style={{ color: "#10b981", fontSize: 10, background: "rgba(16,185,129,0.1)", padding: "2px 8px", borderRadius: 2, border: "1px solid rgba(16,185,129,0.2)" }}>{result.stage.toUpperCase()}</span>}
                </div>
                {result.tagline && <p style={{ color: "#fbbf24", fontSize: 13, margin: "0 0 6px", fontFamily: "IBM Plex Sans, sans-serif" }}>{result.tagline}</p>}
                {result.description && <p className="sans" style={{ color: "#6b7280", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{result.description}</p>}
              </div>
              <div style={{ flexShrink: 0, textAlign: "center", background: "#080a0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "14px 20px" }}>
                <div className="sans" style={{ fontSize: 36, fontWeight: 700, color: BD(result.bdScore || 50), lineHeight: 1 }}>{result.bdScore || "—"}</div>
                <div className="ticker" style={{ fontSize: 9, color: "#4a5568", marginTop: 4, letterSpacing: "0.1em" }}>SCORE</div>
                {result.listingInterest && <div className="ticker" style={{ fontSize: 10, color: "#fbbf24", marginTop: 6, background: "rgba(251,191,36,0.08)", padding: "2px 8px", borderRadius: 2 }}>{result.listingInterest.toUpperCase()}</div>}
              </div>
            </div>

            {/* Meta row */}
            <div style={{ display: "flex", gap: 24, marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.04)", flexWrap: "wrap" }}>
              {[["CHAIN", result.chain], ["CATEGORY", result.category], ["WEBSITE", result.website], ["TWITTER", result.twitter], ["TELEGRAM", result.telegram]].map(function(row) {
                if (!row[1] || row[1] === "Unknown" || row[1] === "—") return null;
                var urlMap = { WEBSITE: "https://" + (row[1]||"").replace(/^https?:\/\//,""), TWITTER: "https://twitter.com/" + (row[1]||"").replace("@",""), TELEGRAM: "https://t.me/" + (row[1]||"").replace("@","").replace("t.me/","") };
                var url = urlMap[row[0]];
                return (
                  <div key={row[0]}>
                    <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 3 }}>{row[0]}</div>
                    {url
                      ? <button onClick={function() { setExternalLink({ url: url, label: row[0] + ": " + row[1] }); }} className="ticker" style={{ fontSize: 11, color: "#60a5fa", background: "none", border: "none", padding: 0, cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dotted", textUnderlineOffset: 3 }}>{row[1]} ↗</button>
                      : <div className="ticker" style={{ fontSize: 11, color: "#9ca3af" }}>{row[1]}</div>}
                  </div>
                );
              })}
              <div style={{ marginLeft: "auto" }}>
                <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 3 }}>DATA QUALITY</div>
                <div className="ticker" style={{ fontSize: 11, color: "#10b981" }}>{(result.dataQuality || "—").toUpperCase()}</div>
              </div>
            </div>

            {/* Contract address */}
            {result.contractAddress && result.contractAddress !== "Unknown" && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 10 }}>
                <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", flexShrink: 0 }}>CONTRACT</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#080a0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 3, padding: "5px 12px", flex: 1 }}>
                  <span className="ticker" style={{ color: "#6b7280", fontSize: 11, flex: 1 }}>{result.contractAddress}</span>
                  <button onClick={function() { copy(result.contractAddress, "contract"); }} className="ticker" style={{ padding: "2px 8px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)", color: "#fbbf24", borderRadius: 2, cursor: "pointer", fontSize: 9, flexShrink: 0 }}>{copied === "contract" ? "✓ COPIED" : "COPY"}</button>
                  <button onClick={function() { setExternalLink({ url: "https://etherscan.io/token/" + result.contractAddress, label: "Etherscan Token" }); }} className="ticker" style={{ padding: "2px 8px", background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)", color: "#60a5fa", borderRadius: 2, cursor: "pointer", fontSize: 9, flexShrink: 0 }}>ETHERSCAN ↗</button>
                </div>
              </div>
            )}
          </div>

          {/* TABS */}
          <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
            {["overview", "contacts", "strategy", "summary"].map(function(t) {
              return (
                <button key={t} onClick={function() { setResultTab(t); }} className="ticker"
                  style={{ padding: "7px 16px", borderRadius: 3, border: "1px solid " + (resultTab === t ? "rgba(251,191,36,0.3)" : "rgba(255,255,255,0.06)"), background: resultTab === t ? "rgba(251,191,36,0.08)" : "transparent", color: resultTab === t ? "#fbbf24" : "#4a5568", cursor: "pointer", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", transition: "all 0.15s" }}>
                  {t}
                </button>
              );
            })}
          </div>

          {/* OVERVIEW TAB */}
          {resultTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: result.bdEmail && result.bdEmail !== "Unknown" ? "rgba(16,185,129,0.05)" : "#0d1117", border: "1px solid " + (result.bdEmail && result.bdEmail !== "Unknown" ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.06)"), borderRadius: 6, padding: 16 }}>
                <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 8 }}>BD EMAIL</div>
                {result.bdEmail && result.bdEmail !== "Unknown"
                  ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="ticker" style={{ color: "#10b981", fontSize: 13, fontWeight: 500 }}>{result.bdEmail}</span>
                      <button onClick={function() { copy(result.bdEmail, "email"); }} className="ticker" style={{ padding: "2px 8px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", borderRadius: 2, cursor: "pointer", fontSize: 9, flexShrink: 0 }}>{copied === "email" ? "✓ COPIED" : "COPY"}</button>
                    </div>
                  : <span className="ticker" style={{ color: "#374151", fontSize: 12 }}>NOT FOUND</span>}
              </div>
              <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: 16 }}>
                <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 8 }}>TELEGRAM</div>
                {result.bdTelegram && result.bdTelegram !== "Unknown"
                  ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="ticker" style={{ color: "#60a5fa", fontSize: 13 }}>{result.bdTelegram}</span>
                      <button onClick={function() { copy(result.bdTelegram, "tg"); }} className="ticker" style={{ padding: "2px 8px", background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", color: "#60a5fa", borderRadius: 2, cursor: "pointer", fontSize: 9, flexShrink: 0 }}>{copied === "tg" ? "✓ COPIED" : "COPY"}</button>
                    </div>
                  : <span className="ticker" style={{ color: "#374151", fontSize: 12 }}>NOT FOUND</span>}
              </div>
              <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: 16, gridColumn: "1 / -1" }}>
                <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 8 }}>BEST CONTACT PATH</div>
                <p className="sans" style={{ color: "#c9d1d9", fontSize: 13, margin: 0, lineHeight: 1.6 }}>{result.bestContactPath || "—"}</p>
              </div>
              {result._emails && result._emails.length > 0 && (
                <div style={{ background: "rgba(16,185,129,0.03)", border: "1px solid rgba(16,185,129,0.12)", borderRadius: 6, padding: 16, gridColumn: "1 / -1" }}>
                  <div className="ticker" style={{ fontSize: 9, color: "#10b981", letterSpacing: "0.1em", marginBottom: 10 }}>ALL EMAILS FOUND</div>
                  {result._emails.map(function(email, i) {
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span className="ticker" style={{ color: "#10b981", fontSize: 12 }}>{email}</span>
                        <button onClick={function() { copy(email, "e" + i); }} className="ticker" style={{ padding: "1px 6px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", color: "#10b981", borderRadius: 2, cursor: "pointer", fontSize: 9 }}>{copied === "e" + i ? "✓" : "⎘"}</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* CONTACTS TAB */}
          {resultTab === "contacts" && (
            <div>
              {result.contacts && result.contacts.length > 0
                ? <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden" }}>
                    <div className="ticker" style={{ display: "grid", gridTemplateColumns: "150px 130px 1fr 100px", padding: "8px 16px", background: "rgba(251,191,36,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#374151", fontSize: 9, letterSpacing: "0.08em" }}>
                      <span>NAME</span><span>ROLE</span><span>CONTACT</span><span>CONFIDENCE</span>
                    </div>
                    {result.contacts.map(function(c, i) {
                      var confColors = { High: { bg: "rgba(16,185,129,0.1)", c: "#10b981" }, Medium: { bg: "rgba(251,191,36,0.1)", c: "#fbbf24" }, Low: { bg: "rgba(239,68,68,0.1)", c: "#ef4444" } };
                      var conf = confColors[c.confidence] || confColors.Low;
                      return (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 130px 1fr 100px", padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}>
                          <span className="sans" style={{ color: "#f0f6fc", fontWeight: 600, fontSize: 13 }}>{c.name}</span>
                          <span className="ticker" style={{ color: "#6b7280", fontSize: 10 }}>{c.role}</span>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                            {c.email && c.email !== "Unknown" && (
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <span className="ticker" style={{ color: "#10b981", fontSize: 11 }}>{c.email}</span>
                                <button onClick={function() { copy(c.email, "ci" + i); }} className="ticker" style={{ padding: "1px 6px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", color: "#10b981", borderRadius: 2, cursor: "pointer", fontSize: 8 }}>{copied === "ci" + i ? "✓" : "⎘"}</button>
                              </div>
                            )}
                            {c.twitter && c.twitter !== "Unknown" && <button onClick={function() { setExternalLink({ url: "https://twitter.com/" + c.twitter.replace("@",""), label: "Twitter: " + c.twitter }); }} className="ticker" style={{ fontSize: 11, color: "#60a5fa", background: "none", border: "none", padding: 0, cursor: "pointer" }}>{c.twitter} ↗</button>}
                            {c.linkedin && c.linkedin !== "Unknown" && <button onClick={function() { setExternalLink({ url: "https://" + c.linkedin.replace(/^https?:\/\//,""), label: "LinkedIn" }); }} className="ticker" style={{ fontSize: 11, color: "#818cf8", background: "none", border: "none", padding: 0, cursor: "pointer" }}>💼 LinkedIn ↗</button>}
                          </div>
                          <span className="ticker" style={{ fontSize: 10, padding: "2px 7px", borderRadius: 2, background: conf.bg, color: conf.c }}>{(c.confidence||"").toUpperCase()}</span>
                        </div>
                      );
                    })}
                  </div>
                : <div style={{ textAlign: "center", padding: "40px 0", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: 6 }}>
                    <div className="ticker" style={{ color: "#374151", fontSize: 11 }}>NO CONTACTS FOUND</div>
                  </div>}
            </div>
          )}

          {/* STRATEGY TAB */}
          {resultTab === "strategy" && (
            <div>
              <div style={{ background: "#0d1117", border: "1px solid rgba(251,191,36,0.15)", borderRadius: 6, padding: 20, marginBottom: 12 }}>
                <div className="ticker" style={{ fontSize: 9, color: "#fbbf24", letterSpacing: "0.1em", marginBottom: 12 }}>OUTREACH STRATEGY</div>
                <p className="sans" style={{ color: "#c9d1d9", fontSize: 14, lineHeight: 1.8, margin: 0 }}>{result.bestApproach || result.outreachStrategy || "No strategy generated."}</p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[["LISTING INTEREST", result.listingInterest || "—", "#fbbf24"], ["SCORE", (result.bdScore || "—") + " / 100", BD(result.bdScore || 50)], ["DATA QUALITY", result.dataQuality || "—", "#10b981"]].map(function(row) {
                  return (
                    <div key={row[0]} style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: 16, textAlign: "center" }}>
                      <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 8 }}>{row[0]}</div>
                      <div className="sans" style={{ fontSize: 20, fontWeight: 700, color: row[2] }}>{row[1]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SUMMARY TAB */}
          {resultTab === "summary" && (
            <div>
              <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: 24, marginBottom: 12 }}>
                <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 16 }}>FULL PROJECT SUMMARY</div>
                {(result.description || "No summary available.").split("\n\n").map(function(para, i) {
                  return <p key={i} className="sans" style={{ color: i === 0 ? "#c9d1d9" : "#6b7280", fontSize: 14, lineHeight: 1.8, margin: "0 0 16px" }}>{para}</p>;
                })}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {[["CATEGORY", result.category], ["CHAIN", result.chain], ["STAGE", result.stage], ["WEBSITE", result.website], ["TGE", result.tge], ["FUNDING", result.fundraising]].map(function(row) {
                  if (!row[1] || row[1] === "Unknown") return null;
                  return (
                    <div key={row[0]} style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, padding: "12px 14px" }}>
                      <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 6 }}>{row[0]}</div>
                      <div className="sans" style={{ fontSize: 13, color: "#c9d1d9", fontWeight: 500 }}>{row[1]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={function() { onAddLead({ id: Date.now(), name: result.projectName, symbol: result.symbol, logo: result.emoji || "🔍", category: result.category, stage: result.stage || "Listed", chain: result.chain, description: result.description, tge: result.tge, trendScore: result.trendScore || 70, twitter: result.twitter, website: result.website, telegram: result.telegram, tags: result.tags || [] }); }} className="ticker"
              style={{ flex: 1, padding: "11px 0", borderRadius: 4, border: "1px solid rgba(251,191,36,0.4)", background: "rgba(251,191,36,0.08)", color: "#fbbf24", cursor: "pointer", fontSize: 11, letterSpacing: "0.08em" }}>
              + ADD TO PIPELINE
            </button>
            <button onClick={function() {
              var confirmed = window.confirm("Rerun Scout AI for @" + handle + "?\n\nThis will search the web again and overwrite the saved result in History.");
              if (confirmed) { forceRerun.current = true; var h = handle; setResult(null); setPhase("loading"); setStream(""); runScout(h); }
            }} className="ticker" style={{ padding: "11px 20px", borderRadius: 4, border: "1px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.06)", color: "#a5b4fc", cursor: "pointer", fontSize: 11, letterSpacing: "0.08em" }}>
              ↺ RERUN
            </button>
            <button onClick={function() { setPhase("idle"); setResult(null); setHandle(""); }} className="ticker"
              style={{ padding: "11px 20px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#4a5568", cursor: "pointer", fontSize: 11, letterSpacing: "0.08em" }}>
              NEW SEARCH
            </button>
          </div>

          {/* EXTERNAL LINK MODAL */}
          {externalLink && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }} onClick={function() { setExternalLink(null); }}>
              <div style={{ background: "#0d1117", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 6, padding: 28, maxWidth: 400, width: "100%" }} onClick={function(e) { e.stopPropagation(); }}>
                <div className="ticker" style={{ fontSize: 9, color: "#fbbf24", letterSpacing: "0.1em", marginBottom: 14 }}>EXTERNAL LINK</div>
                <p className="sans" style={{ color: "#c9d1d9", fontSize: 14, margin: "0 0 10px" }}>You are leaving Scout and visiting:</p>
                <div style={{ background: "#080a0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, padding: "10px 14px", marginBottom: 14 }}>
                  <div className="ticker" style={{ fontSize: 10, color: "#6b7280", marginBottom: 4 }}>{externalLink.label}</div>
                  <div className="ticker" style={{ fontSize: 11, color: "#60a5fa", wordBreak: "break-all" }}>{externalLink.url}</div>
                </div>
                <p className="sans" style={{ color: "#4a5568", fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>Scout is not responsible for the content of external sites. Continue?</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={function() { window.open(externalLink.url, "_blank", "noopener,noreferrer"); setExternalLink(null); }} className="ticker" style={{ flex: 1, padding: "10px 0", borderRadius: 4, border: "1px solid rgba(251,191,36,0.4)", background: "rgba(251,191,36,0.1)", color: "#fbbf24", cursor: "pointer", fontSize: 11, letterSpacing: "0.08em" }}>
                    CONTINUE ↗
                  </button>
                  <button onClick={function() { setExternalLink(null); }} className="ticker" style={{ padding: "10px 20px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#4a5568", cursor: "pointer", fontSize: 11, letterSpacing: "0.08em" }}>
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          )}

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


const fetchDexScreener = async (setDexData, setDexLoading, setDexLastUpdate) => {
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

const runAutoScout = async (list, setAutoRunning, setAutoActive, setAutoLog, setAutoDone, setDoneCount, setEmailCount, autoStop) => {
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

export default function App() {
  const [viewTab,  setViewTab]  = useState("top");
  const [catTab,   setCatTab]   = useState("all");
  const [stageFilt,setStageFilt]= useState("All");
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState("scout");
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


  // Load DexScreener when Auto Scout page is opened
  useEffect(() => {
    if (page === "autoscout") {
      loadStaticFeed(); // instant — no API call needed
    }
  }, [page]);

  const dexDisplay = dexData[dexTab] || [];

  const addLead = p => {
    if (!leads.find(l => l.id === p.id)) {
      const newLead = Object.assign({}, p, { remarks: [], addedAt: new Date(), status: "New" });
      setLeads(prev => [...prev, newLead]);
      sbAddPipeline(newLead);
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
  const [histFilter, setHistFilter] = useState("all");
  const [histSearch, setHistSearch] = useState("");
  const [pipeSelected, setPipeSelected] = useState(null);
  const [pipeFilter, setPipeFilter] = useState("all");
  const [pipeSearch, setPipeSearch] = useState("");
  const [pipeSortOrder, setPipeSortOrder] = useState("newest");
  const [pipeNoteText, setPipeNoteText] = useState("");
  const [pipeShowSummary, setPipeShowSummary] = useState(false);
  const [externalLinkPipe, setExternalLinkPipe] = useState(null);



  const stopAutoScout = () => { autoStop.current = true; setAutoRunning(false); setAutoActive(null); };

  let display = applyView(ALL_PROJECTS, viewTab);
  if (catTab !== "all" && CAT_KEYS[catTab]) display = display.filter(p => CAT_KEYS[catTab].includes(p.category));
  if (stageFilt !== "All") display = display.filter(p => p.stage === stageFilt);
  if (search) display = display.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.symbol.toLowerCase().includes(search.toLowerCase()));

  const doneCount  = Object.keys(autoDone).length;
  const emailCount = Object.values(autoDone).filter(r => r.bdEmail && r.bdEmail !== "Unknown").length;
  const colLabel   = viewTab === "trending" ? "Trend" : viewTab === "gainers" ? "Gain" : viewTab === "new" ? "Added" : "Rank";

  const NAV = [
    { id: "scout",    label: "SCOUT AI", badge: "LIVE" },
    { id: "pipeline", label: "PIPELINE", count: leads.length },
    { id: "history",  label: "HISTORY",  count: contactHistory.length },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#080a0f", fontFamily: "'IBM Plex Mono', 'Courier New', monospace", color: "#c9d1d9" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #1e2940; border-radius: 2px; }
        .scout-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .nav-item:hover { background: rgba(251,191,36,0.06) !important; color: #fbbf24 !important; }
        .card-hover:hover { border-color: rgba(251,191,36,0.2) !important; }
        input::placeholder { color: #3d4f6b; }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes scan-line { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .sans { font-family: 'IBM Plex Sans', sans-serif; }
        .ticker { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; }
        .grid-line { border-color: rgba(255,255,255,0.04); }
      `}</style>

      {/* Subtle grid background */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(251,191,36,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(251,191,36,0.015) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none", zIndex: 0 }} />

      {/* Top bar */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 40, background: "rgba(8,10,15,0.98)", borderBottom: "1px solid rgba(251,191,36,0.12)", backdropFilter: "blur(20px)" }}>
        {/* Main nav row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 52 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Logo mark */}
            <div style={{ width: 32, height: 32, position: "relative", flexShrink: 0 }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#0d1117" stroke="rgba(251,191,36,0.3)" strokeWidth="1"/>
                <circle cx="16" cy="14" r="5" stroke="#fbbf24" strokeWidth="1.5" fill="none"/>
                <circle cx="16" cy="14" r="2" fill="#fbbf24" opacity="0.6"/>
                <line x1="20" y1="19" x2="25" y2="24" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="16" cy="14" r="8" stroke="rgba(251,191,36,0.15)" strokeWidth="1" fill="none" strokeDasharray="2 3"/>
              </svg>
            </div>
            <div>
              <div className="sans" style={{ fontSize: 15, fontWeight: 700, color: "#f0f6fc", letterSpacing: "-0.01em", lineHeight: 1 }}>
                Scout<span style={{ color: "#fbbf24" }}>.</span>
              </div>
              <div className="ticker" style={{ color: "#4a5568", fontSize: 9, marginTop: 1 }}>ANALYSIS</div>
            </div>
          </div>

          {/* Nav tabs */}
          <div style={{ display: "flex", gap: 2 }}>
            {NAV.map(item => {
              var active = page === item.id;
              return (
                <button key={item.id} onClick={() => setPage(item.id)} className="nav-item ticker"
                  style={{ padding: "6px 14px", borderRadius: 4, border: "1px solid " + (active ? "rgba(251,191,36,0.3)" : "transparent"), background: active ? "rgba(251,191,36,0.08)" : "transparent", color: active ? "#fbbf24" : "#4a5568", cursor: "pointer", fontSize: 11, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s" }}>
                  {item.label}
                  {item.badge && <span style={{ background: "#fbbf24", color: "#080a0f", fontSize: 9, padding: "1px 5px", borderRadius: 2, fontWeight: 700 }}>{item.badge}</span>}
                  {item.count > 0 && <span style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", fontSize: 9, padding: "1px 5px", borderRadius: 2 }}>{item.count}</span>}
                </button>
              );
            })}
          </div>

          {/* Status indicator */}
          <div className="ticker" style={{ display: "flex", alignItems: "center", gap: 8, color: "#4a5568", fontSize: 11 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
              <span style={{ color: "#10b981" }}>ONLINE</span>
            </div>
            <span style={{ color: "#1e2940" }}>|</span>
            <span>SONNET 4.5</span>
          </div>
        </div>

        {/* Active page indicator bar */}
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(251,191,36,0.4),transparent)" }} />
      </div>

      {/* Page content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "76px 24px 40px", position: "relative", zIndex: 1 }}>

        {page === "scout" && <ScoutAIPage onAddLead={p => { addLead(p); setPage("pipeline"); }} onAddToHistory={addToHistory} contactHistory={contactHistory} dbLoading={dbLoading} />}

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
                    <button onClick={() => runAutoScout(dexDisplay, setAutoRunning, setAutoActive, setAutoLog, setAutoDone, setDoneCount, setEmailCount, autoStop)} disabled={dexDisplay.length === 0} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 disabled:opacity-40"
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
                      <span className={"text-sm font-medium " + (p.change24h === "—" ? "text-gray-700" : isPos ? "text-emerald-400" : "text-red-400")}>{p.change24h}</span>
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
                      {viewTab === "gainers"  && <span className={"text-sm font-bold " + (isPos ? "text-emerald-400" : "text-red-400")}>{p.change24h}</span>}
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
                    <span className={"text-sm font-medium " + (p.change24h === "—" ? "text-gray-700" : isPos ? "text-emerald-400" : "text-red-400")}>{p.change24h}</span>
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
            <p className="text-gray-800 text-xs text-center mt-4">Showing {display.length} of {ALL_PROJECTS.length} curated targets</p>
          </>
        )}

        {page === "history" && (
          <div className="fade-in">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(251,191,36,0.1)", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div className="ticker" style={{ fontSize: 10, color: "#4a5568", letterSpacing: "0.1em", marginBottom: 4 }}>RESEARCH HISTORY</div>
                <h2 className="sans" style={{ fontSize: 24, fontWeight: 700, color: "#f0f6fc", margin: 0, letterSpacing: "-0.02em" }}>Contact Intelligence</h2>
              </div>
              <div style={{ display: "flex", gap: 24 }}>
                {[["TOTAL", contactHistory.length, "#c9d1d9"], ["EMAILS FOUND", contactHistory.filter(function(h){return h.bdEmail && h.bdEmail!=="Unknown";}).length, "#10b981"], ["NO EMAIL", contactHistory.filter(function(h){return !h.bdEmail||h.bdEmail==="Unknown";}).length, "#ef4444"]].map(function(row) {
                  return (
                    <div key={row[0]} style={{ textAlign: "right" }}>
                      <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 2 }}>{row[0]}</div>
                      <div className="sans" style={{ fontSize: 22, fontWeight: 700, color: row[2], lineHeight: 1 }}>{row[1]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
              {[["all","ALL"],["email","EMAIL FOUND"],["noemail","NO EMAIL"]].map(function(opt) {
                var active = histFilter === opt[0];
                return (
                  <button key={opt[0]} onClick={function(){setHistFilter(opt[0]);}} className="ticker"
                    style={{ padding: "6px 14px", borderRadius: 3, border: "1px solid " + (active ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.06)"), background: active ? "rgba(251,191,36,0.08)" : "transparent", color: active ? "#fbbf24" : "#4a5568", cursor: "pointer", fontSize: 10, letterSpacing: "0.06em" }}>
                    {opt[1]}
                  </button>
                );
              })}
              <div style={{ flex: 1 }} />
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#374151", fontSize: 12 }}>⌕</span>
                <input value={histSearch} onChange={function(e){setHistSearch(e.target.value);}} placeholder="SEARCH..."
                  className="ticker" style={{ paddingLeft: 28, paddingRight: 12, paddingTop: 7, paddingBottom: 7, background: "#0d1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 3, color: "#c9d1d9", fontSize: 11, outline: "none", width: 160 }} />
              </div>
              {contactHistory.length > 0 && (
                <button onClick={function(){setContactHistory([]); sbFetch("/scout_history","DELETE");}} className="ticker"
                  style={{ padding: "6px 12px", borderRadius: 3, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", color: "#f87171", cursor: "pointer", fontSize: 10 }}>
                  CLEAR ALL
                </button>
              )}
            </div>

            {contactHistory.filter(function(h){
              var mf = histFilter==="all" || (histFilter==="email"&&h.bdEmail&&h.bdEmail!=="Unknown") || (histFilter==="noemail"&&(!h.bdEmail||h.bdEmail==="Unknown"));
              var ms = !histSearch || h.name.toLowerCase().includes(histSearch.toLowerCase()) || (h.symbol||"").toLowerCase().includes(histSearch.toLowerCase());
              return mf && ms;
            }).length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", border: "1px dashed rgba(251,191,36,0.08)", borderRadius: 6 }}>
                <div className="ticker" style={{ color: "#1e2940", fontSize: 12, marginBottom: 8 }}>NO RECORDS FOUND</div>
                <p className="sans" style={{ color: "#374151", fontSize: 13 }}>Use Scout AI to research projects — results appear here automatically</p>
              </div>
            ) : (
              <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, overflowX: "auto" }}>
                <div style={{ minWidth: 860 }}>
                  <div className="ticker" style={{ display: "grid", gridTemplateColumns: "200px 80px 100px 1fr 110px 65px 210px", padding: "9px 16px", background: "rgba(251,191,36,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#374151", fontSize: 9, letterSpacing: "0.08em" }}>
                    <span>PROJECT</span><span>SYMBOL</span><span>CHAIN</span><span>BD EMAIL</span><span>CONFIDENCE</span><span>SCORE</span><span style={{ textAlign: "right" }}>ACTIONS</span>
                  </div>
                  {contactHistory.filter(function(h){
                    var mf = histFilter==="all" || (histFilter==="email"&&h.bdEmail&&h.bdEmail!=="Unknown") || (histFilter==="noemail"&&(!h.bdEmail||h.bdEmail==="Unknown"));
                    var ms = !histSearch || h.name.toLowerCase().includes(histSearch.toLowerCase()) || (h.symbol||"").toLowerCase().includes(histSearch.toLowerCase());
                    return mf && ms;
                  }).map(function(item, i) {
                    var hasEmail = item.bdEmail && item.bdEmail !== "Unknown";
                    var score = item.fullResult && item.fullResult.bdScore;
                    var confColor = { High: "#10b981", Medium: "#fbbf24", Low: "#ef4444" }[item.confidence] || "#6b7280";
                    var scoreCol = score >= 70 ? "#10b981" : score >= 40 ? "#fbbf24" : "#ef4444";
                    return (
                      <div key={i} className="row-hover" onClick={function(){setHistoryModal(item);}}
                        style={{ display: "grid", gridTemplateColumns: "200px 80px 100px 1fr 110px 65px 210px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", background: i%2===0 ? "transparent" : "rgba(255,255,255,0.01)", cursor: "pointer" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 4, background: hasEmail ? "rgba(16,185,129,0.08)" : "rgba(251,191,36,0.05)", border: "1px solid " + (hasEmail ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.06)"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>{item.logo||"🪙"}</div>
                          <div style={{ minWidth: 0 }}>
                            <div className="sans" style={{ color: "#f0f6fc", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                            <div className="ticker" style={{ color: "#374151", fontSize: 9 }}>{item.ts ? new Date(item.ts).toLocaleDateString() : ""}</div>
                          </div>
                        </div>
                        <span className="ticker" style={{ color: "#fbbf24", fontSize: 11, whiteSpace: "nowrap" }}>{item.symbol}</span>
                        <span className="ticker" style={{ color: "#6b7280", fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.chain||"—"}</span>
                        <div style={{ paddingRight: 8 }} onClick={function(e){e.stopPropagation();}}>
                          {hasEmail
                            ? <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span className="ticker" style={{ color: "#10b981", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>{item.bdEmail}</span>
                                <button onClick={function(){navigator.clipboard.writeText(item.bdEmail);}} className="ticker" style={{ padding: "1px 6px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", color: "#10b981", borderRadius: 2, cursor: "pointer", fontSize: 8, flexShrink: 0 }}>⎘</button>
                              </div>
                            : <span className="ticker" style={{ color: "#1e2940", fontSize: 10 }}>NOT FOUND</span>}
                        </div>
                        <span className="ticker" style={{ fontSize: 10, color: confColor, whiteSpace: "nowrap" }}>{(item.confidence||"—").toUpperCase()}</span>
                        <span className="sans" style={{ fontSize: 15, fontWeight: 700, color: score ? scoreCol : "#374151" }}>{score||"—"}</span>
                        <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }} onClick={function(e){e.stopPropagation();}}>
                          <button onClick={function(){setHistoryModal(item);}} className="ticker" style={{ padding: "4px 10px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24", borderRadius: 2, cursor: "pointer", fontSize: 9, whiteSpace: "nowrap" }}>READ</button>
                          <button onClick={function(){addLead({ id: "h-" + i, name: item.name, symbol: item.symbol, logo: item.logo, twitter: item.twitter, website: item.website, chain: item.chain||"—", category: "DeFi", stage: "Listed", description: item.description||"", tags: [] }); setPage("pipeline");}} className="ticker" style={{ padding: "4px 10px", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", borderRadius: 2, cursor: "pointer", fontSize: 9, whiteSpace: "nowrap" }}>+ PIPELINE</button>
                          <button onClick={function(){setPage("scout");}} className="ticker" style={{ padding: "4px 8px", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", color: "#4a5568", borderRadius: 2, cursor: "pointer", fontSize: 9, whiteSpace: "nowrap" }}>RE-SCOUT</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {page === "pipeline" && (
          <div className="fade-in">
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid rgba(251,191,36,0.1)", flexWrap: "wrap", gap: 16 }}>
              <div>
                <div className="ticker" style={{ fontSize: 10, color: "#4a5568", letterSpacing: "0.1em", marginBottom: 4 }}>MY PIPELINE</div>
                <h2 className="sans" style={{ fontSize: 24, fontWeight: 700, color: "#f0f6fc", margin: 0, letterSpacing: "-0.02em" }}>Active Leads</h2>
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                {[["TOTAL", leads.length, "#c9d1d9"], ["HIGH INTEREST", leads.filter(function(l){return l.listingInterest==="High";}).length, "#10b981"], ["WITH EMAIL", leads.filter(function(l){return l.bdEmail&&l.bdEmail!=="Unknown";}).length, "#fbbf24"]].map(function(row) {
                  return (
                    <div key={row[0]} style={{ textAlign: "right" }}>
                      <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 2 }}>{row[0]}</div>
                      <div className="sans" style={{ fontSize: 22, fontWeight: 700, color: row[2], lineHeight: 1 }}>{row[1]}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
              {["New","Contacted","In Discussion","Listing Agreed","On Hold","Rejected"].map(function(s) {
                var colors = { "New": { bg: "rgba(96,165,250,0.1)", c: "#60a5fa", border: "rgba(96,165,250,0.2)" }, "Contacted": { bg: "rgba(251,191,36,0.1)", c: "#fbbf24", border: "rgba(251,191,36,0.2)" }, "In Discussion": { bg: "rgba(168,85,247,0.1)", c: "#a855f7", border: "rgba(168,85,247,0.2)" }, "Listing Agreed": { bg: "rgba(16,185,129,0.1)", c: "#10b981", border: "rgba(16,185,129,0.2)" }, "On Hold": { bg: "rgba(107,114,128,0.1)", c: "#6b7280", border: "rgba(107,114,128,0.2)" }, "Rejected": { bg: "rgba(239,68,68,0.1)", c: "#ef4444", border: "rgba(239,68,68,0.2)" } };
                var sc = colors[s];
                var count = leads.filter(function(l){return l.status===s;}).length;
                return (
                  <div key={s} style={{ flex: "0 0 auto", background: count > 0 ? sc.bg : "rgba(255,255,255,0.02)", border: "1px solid " + (count > 0 ? sc.border : "rgba(255,255,255,0.05)"), borderRadius: 4, padding: "10px 16px", minWidth: 110, cursor: "pointer" }}
                    onClick={function(){setPipeFilter(pipeFilter===s?"all":s);}}>
                    <div className="ticker" style={{ fontSize: 9, color: count > 0 ? sc.c : "#374151", letterSpacing: "0.06em", marginBottom: 6 }}>{s.toUpperCase()}</div>
                    <div className="sans" style={{ fontSize: 20, fontWeight: 700, color: count > 0 ? sc.c : "#1e2940", lineHeight: 1 }}>{count}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#374151", fontSize: 12 }}>⌕</span>
                <input value={pipeSearch} onChange={function(e){setPipeSearch(e.target.value);}} placeholder="SEARCH BY NAME, TWITTER OR SYMBOL..."
                  className="ticker" style={{ paddingLeft: 28, paddingRight: 12, paddingTop: 8, paddingBottom: 8, background: "#0d1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 3, color: "#c9d1d9", fontSize: 11, outline: "none", width: "100%", letterSpacing: "0.04em" }} />
              </div>
              <div style={{ display: "flex", gap: 2 }}>
                {[["newest","NEWEST FIRST"],["oldest","OLDEST FIRST"]].map(function(opt) {
                  var active = pipeSortOrder === opt[0];
                  return (
                    <button key={opt[0]} onClick={function(){setPipeSortOrder(opt[0]);}} className="ticker"
                      style={{ padding: "7px 14px", borderRadius: 3, border: "1px solid " + (active ? "rgba(251,191,36,0.35)" : "rgba(255,255,255,0.06)"), background: active ? "rgba(251,191,36,0.08)" : "transparent", color: active ? "#fbbf24" : "#4a5568", cursor: "pointer", fontSize: 10, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                      {opt[1]}
                    </button>
                  );
                })}
              </div>
            </div>

            {leads.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", border: "1px dashed rgba(251,191,36,0.08)", borderRadius: 6 }}>
                <div className="ticker" style={{ color: "#1e2940", fontSize: 12, marginBottom: 8 }}>NO RECORDS</div>
                <p className="sans" style={{ color: "#374151", fontSize: 13, marginBottom: 16 }}>Add leads from Scout AI or History</p>
                <button onClick={function(){setPage("scout");}} className="ticker" style={{ padding: "8px 20px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24", borderRadius: 4, cursor: "pointer", fontSize: 11 }}>OPEN SCOUT AI →</button>
              </div>
            ) : (
              <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, overflowX: "auto" }}>
                <div style={{ minWidth: 860 }}>
                  <div className="ticker" style={{ display: "grid", gridTemplateColumns: "120px 180px 140px 150px 1fr 130px", padding: "9px 16px", background: "rgba(251,191,36,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)", color: "#374151", fontSize: 9, letterSpacing: "0.08em" }}>
                    <span>ADDED</span><span>PROJECT</span><span>TWITTER</span><span>STATUS</span><span>EMAIL</span><span style={{ textAlign: "right" }}>ACTIONS</span>
                  </div>
                  {leads
                    .filter(function(l) {
                      var ms = pipeFilter==="all" || l.status===pipeFilter;
                      var mq = !pipeSearch || l.name.toLowerCase().includes(pipeSearch.toLowerCase()) || (l.twitter||"").toLowerCase().includes(pipeSearch.toLowerCase()) || (l.symbol||"").toLowerCase().includes(pipeSearch.toLowerCase());
                      return ms && mq;
                    })
                    .sort(function(a,b) {
                      var at = a.remarks&&a.remarks.length>0?new Date(a.remarks[a.remarks.length-1].ts):new Date(a.addedAt||Date.now());
                      var bt = b.remarks&&b.remarks.length>0?new Date(b.remarks[b.remarks.length-1].ts):new Date(b.addedAt||Date.now());
                      return pipeSortOrder==="newest"?bt-at:at-bt;
                    })
                    .map(function(p, i) {
                      var colors = { "New":"#60a5fa","Contacted":"#fbbf24","In Discussion":"#a855f7","Listing Agreed":"#10b981","On Hold":"#6b7280","Rejected":"#ef4444" };
                      var sBg = { "New":"rgba(96,165,250,0.08)","Contacted":"rgba(251,191,36,0.08)","In Discussion":"rgba(168,85,247,0.08)","Listing Agreed":"rgba(16,185,129,0.08)","On Hold":"rgba(107,114,128,0.08)","Rejected":"rgba(239,68,68,0.08)" };
                      var sBorder = { "New":"rgba(96,165,250,0.2)","Contacted":"rgba(251,191,36,0.2)","In Discussion":"rgba(168,85,247,0.2)","Listing Agreed":"rgba(16,185,129,0.2)","On Hold":"rgba(107,114,128,0.2)","Rejected":"rgba(239,68,68,0.2)" };
                      return (
                        <div key={p.id} style={{ display: "grid", gridTemplateColumns: "120px 180px 140px 150px 1fr 130px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "center", background: i%2===0?"transparent":"rgba(255,255,255,0.01)" }}>
                          <div>
                            <div className="ticker" style={{ fontSize: 10, color: "#c9d1d9", whiteSpace: "nowrap" }}>{p.addedAt ? new Date(p.addedAt).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}) : "—"}</div>
                            <div className="ticker" style={{ fontSize: 9, color: p.remarks&&p.remarks.length>0?"#fbbf24":"#374151", marginTop: 2, whiteSpace: "nowrap" }}>
                              {p.remarks&&p.remarks.length>0 ? "↻ " + new Date(p.remarks[p.remarks.length-1].ts).toLocaleDateString("en-GB",{day:"2-digit",month:"short"}) + " " + new Date(p.remarks[p.remarks.length-1].ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"}) : "no activity"}
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 4, background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{p.logo||"🪙"}</div>
                            <div style={{ minWidth: 0 }}>
                              <div className="sans" style={{ color: "#f0f6fc", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                              <div className="ticker" style={{ color: "#374151", fontSize: 9 }}>{p.category||""}</div>
                            </div>
                          </div>
                          <div>
                            {p.twitter
                              ? <button onClick={function(){setExternalLinkPipe({url:"https://twitter.com/"+p.twitter.replace("@",""),label:"Twitter: "+p.twitter});}} className="ticker" style={{ fontSize: 11, color: "#60a5fa", background: "none", border: "none", padding: 0, cursor: "pointer", whiteSpace: "nowrap" }}>{p.twitter} ↗</button>
                              : <span className="ticker" style={{ color: "#374151", fontSize: 11 }}>—</span>}
                          </div>
                          <div>
                            <select value={p.status||"New"} onChange={function(e){setLeads(function(prev){return prev.map(function(l){return l.id===p.id?Object.assign({},l,{status:e.target.value}):l;});});}} className="ticker"
                              style={{ padding: "3px 8px", background: sBg[p.status||"New"], border: "1px solid " + sBorder[p.status||"New"], color: colors[p.status||"New"], borderRadius: 3, cursor: "pointer", fontSize: 9, outline: "none", width: "100%", appearance: "none" }}>
                              {["New","Contacted","In Discussion","Listing Agreed","On Hold","Rejected"].map(function(s){return <option key={s} value={s} style={{background:"#0d1117",color:"#c9d1d9"}}>{s}</option>;})}
                            </select>
                          </div>
                          <div style={{ paddingRight: 8 }}>
                            {p.bdEmail&&p.bdEmail!=="Unknown"
                              ? <span className="ticker" style={{ color: "#10b981", fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{p.bdEmail}</span>
                              : <span className="ticker" style={{ color: "#1e2940", fontSize: 10 }}>NOT FOUND</span>}
                          </div>
                          <div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
                            <button onClick={function(){setPipeSelected(p);setPipeShowSummary(false);}} className="ticker"
                              style={{ padding: "4px 10px", background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24", borderRadius: 2, cursor: "pointer", fontSize: 9, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
                              VIEW{p.remarks&&p.remarks.length>0&&<span style={{background:"#fbbf24",color:"#080a0f",borderRadius:10,fontSize:8,padding:"0 4px",fontWeight:700}}>{p.remarks.length}</span>}
                            </button>
                            <button onClick={function(){removeLead(p.id);}} className="ticker"
                              style={{ padding: "4px 8px", background: "transparent", border: "1px solid rgba(239,68,68,0.15)", color: "#ef4444", borderRadius: 2, cursor: "pointer", fontSize: 9 }}>✕</button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {pipeSelected && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }} onClick={function(){setPipeSelected(null);}}>
                <div style={{ background: "#0d1117", border: "1px solid rgba(251,191,36,0.2)", borderRadius: 6, width: "100%", maxWidth: 520, maxHeight: "85vh", overflowY: "auto" }} onClick={function(e){e.stopPropagation();}}>
                  <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(251,191,36,0.02)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 6, background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{pipeSelected.logo||"🪙"}</div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <h3 className="sans" style={{ color: "#f0f6fc", fontWeight: 700, fontSize: 18, margin: 0 }}>{pipeSelected.name}</h3>
                            <span className="ticker" style={{ color: "#fbbf24", fontSize: 10, background: "rgba(251,191,36,0.1)", padding: "2px 6px", borderRadius: 2 }}>{pipeSelected.symbol}</span>
                          </div>
                          <div className="ticker" style={{ color: "#4a5568", fontSize: 10 }}>{pipeSelected.chain} · {pipeSelected.category}</div>
                        </div>
                      </div>
                      <button onClick={function(){setPipeSelected(null);}} style={{ background: "none", border: "none", color: "#4a5568", fontSize: 22, cursor: "pointer" }}>×</button>
                    </div>
                    {pipeSelected.description&&<p className="sans" style={{ color: "#6b7280", fontSize: 13, margin: "10px 0 0", lineHeight: 1.6 }}>{pipeSelected.description}</p>}
                  </div>
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div style={{ background: "#080a0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, padding: 14 }}>
                        <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 8 }}>STATUS</div>
                        <select value={pipeSelected.status||"New"} onChange={function(e){var ns=e.target.value;setLeads(function(prev){return prev.map(function(l){return l.id===pipeSelected.id?Object.assign({},l,{status:ns}):l;});});setPipeSelected(function(prev){return Object.assign({},prev,{status:ns});});}} className="ticker"
                          style={{ width:"100%",padding:"6px 8px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"#c9d1d9",borderRadius:3,fontSize:11,outline:"none",cursor:"pointer",appearance:"none" }}>
                          {["New","Contacted","In Discussion","Listing Agreed","On Hold","Rejected"].map(function(s){return <option key={s} value={s} style={{background:"#0d1117",color:"#c9d1d9"}}>{s}</option>;})}
                        </select>
                      </div>
                      <div style={{ background: "#080a0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, padding: 14 }}>
                        <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 8 }}>LISTING INTEREST</div>
                        <div className="sans" style={{ fontSize: 16, fontWeight: 700, color: pipeSelected.listingInterest==="High"?"#10b981":"#fbbf24" }}>{pipeSelected.listingInterest||"—"}</div>
                      </div>
                    </div>
                    <div style={{ background: pipeSelected.bdEmail&&pipeSelected.bdEmail!=="Unknown"?"rgba(16,185,129,0.05)":"#080a0f", border: "1px solid " + (pipeSelected.bdEmail&&pipeSelected.bdEmail!=="Unknown"?"rgba(16,185,129,0.2)":"rgba(255,255,255,0.06)"), borderRadius: 4, padding: 14 }}>
                      <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 8 }}>EMAIL</div>
                      {pipeSelected.bdEmail&&pipeSelected.bdEmail!=="Unknown"
                        ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span className="ticker" style={{ color: "#10b981", fontSize: 13 }}>{pipeSelected.bdEmail}</span>
                            <button onClick={function(){navigator.clipboard.writeText(pipeSelected.bdEmail);}} className="ticker" style={{ padding: "2px 8px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", borderRadius: 2, cursor: "pointer", fontSize: 9, flexShrink: 0 }}>COPY</button>
                          </div>
                        : <span className="ticker" style={{ color: "#1e2940", fontSize: 11 }}>NOT FOUND</span>}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {[["🌐 Website", pipeSelected.website?"https://"+pipeSelected.website:null],["🐦 Twitter",pipeSelected.twitter?"https://twitter.com/"+pipeSelected.twitter.replace("@",""):null]].map(function(row){
                        return row[1] ? <button key={row[0]} onClick={function(){setExternalLinkPipe({url:row[1],label:row[0]});}} className="ticker" style={{ padding:"5px 12px",background:"rgba(96,165,250,0.06)",border:"1px solid rgba(96,165,250,0.15)",color:"#60a5fa",borderRadius:3,fontSize:10,cursor:"pointer" }}>{row[0]} ↗</button> : null;
                      })}
                    </div>
                    <div style={{ background: "#080a0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                      <button onClick={function(){setPipeShowSummary(function(s){return !s;});}} className="ticker"
                        style={{ width:"100%",padding:"11px 14px",background:"transparent",border:"none",color:pipeShowSummary?"#fbbf24":"#4a5568",cursor:"pointer",fontSize:10,letterSpacing:"0.08em",textAlign:"left",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                        <span>FULL PROJECT SUMMARY</span>
                        <span style={{ fontSize:14,display:"inline-block",transform:pipeShowSummary?"rotate(90deg)":"rotate(0deg)",transition:"transform 0.2s" }}>›</span>
                      </button>
                      {pipeShowSummary && (
                        <div style={{ padding:"0 14px 14px",borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                          <p className="sans" style={{ color:"#6b7280",fontSize:13,lineHeight:1.8,margin:"12px 0 0" }}>{pipeSelected.description||"No summary available."}</p>
                          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:12 }}>
                            {[["CATEGORY",pipeSelected.category],["CHAIN",pipeSelected.chain],["STAGE",pipeSelected.stage],["TWITTER",pipeSelected.twitter],["WEBSITE",pipeSelected.website]].map(function(row){
                              return row[1]&&row[1]!=="Unknown" ? <div key={row[0]} style={{background:"#0d1117",borderRadius:3,padding:"8px 10px"}}><div className="ticker" style={{fontSize:8,color:"#374151",letterSpacing:"0.1em",marginBottom:4}}>{row[0]}</div><div className="sans" style={{fontSize:12,color:"#c9d1d9",fontWeight:500}}>{row[1]}</div></div> : null;
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ background: "#080a0f", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 4, padding: 14 }}>
                      <div className="ticker" style={{ fontSize: 9, color: "#374151", letterSpacing: "0.1em", marginBottom: 12 }}>REMARKS & ACTIVITY LOG</div>
                      <div style={{ marginBottom: 14 }}>
                        <textarea value={pipeNoteText} onChange={function(e){setPipeNoteText(e.target.value);}} placeholder="Add a remark or follow-up note..."
                          className="sans" style={{ width:"100%",minHeight:70,background:"#0d1117",border:"1px solid rgba(255,255,255,0.08)",borderRadius:3,color:"#c9d1d9",fontSize:13,outline:"none",resize:"none",lineHeight:1.6,padding:"10px 12px",boxSizing:"border-box" }} />
                        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:6 }}>
                          <span className="ticker" style={{ fontSize:9,color:"#374151" }}>⌘ + ENTER to save</span>
                          <button onClick={function(){
                            if(!pipeNoteText.trim())return;
                            var r={text:pipeNoteText.trim(),ts:new Date()};
                            setLeads(function(prev){return prev.map(function(l){return l.id===pipeSelected.id?Object.assign({},l,{remarks:[...(l.remarks||[]),r]}):l;});});
                            setPipeSelected(function(prev){return Object.assign({},prev,{remarks:[...(prev.remarks||[]),r]});});
                            setPipeNoteText("");
                          }} disabled={!pipeNoteText.trim()} className="ticker"
                            style={{ padding:"5px 14px",background:pipeNoteText.trim()?"rgba(251,191,36,0.1)":"rgba(255,255,255,0.03)",border:"1px solid "+(pipeNoteText.trim()?"rgba(251,191,36,0.3)":"rgba(255,255,255,0.06)"),color:pipeNoteText.trim()?"#fbbf24":"#374151",borderRadius:3,cursor:pipeNoteText.trim()?"pointer":"default",fontSize:10,letterSpacing:"0.06em" }}>
                            + ADD REMARK
                          </button>
                        </div>
                      </div>
                      {pipeSelected.remarks&&pipeSelected.remarks.length>0
                        ? <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                            {pipeSelected.remarks.slice().reverse().map(function(r,i){
                              return (
                                <div key={i} style={{ background:"#0d1117",border:"1px solid rgba(255,255,255,0.06)",borderRadius:3,padding:"10px 12px" }}>
                                  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:6 }}>
                                    <div style={{ width:6,height:6,borderRadius:"50%",background:"#fbbf24",flexShrink:0 }} />
                                    <span className="ticker" style={{ fontSize:9,color:"#fbbf24",letterSpacing:"0.06em" }}>
                                      {new Date(r.ts).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})} · {new Date(r.ts).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}
                                    </span>
                                    {i===0&&<span className="ticker" style={{ fontSize:8,color:"#10b981",background:"rgba(16,185,129,0.1)",padding:"1px 5px",borderRadius:2 }}>LATEST</span>}
                                  </div>
                                  <p className="sans" style={{ color:"#c9d1d9",fontSize:13,margin:0,lineHeight:1.6 }}>{r.text}</p>
                                </div>
                              );
                            })}
                          </div>
                        : <div className="ticker" style={{ fontSize:10,color:"#1e2940",textAlign:"center",padding:"16px 0" }}>NO REMARKS YET</div>}
                    </div>
                    <div style={{ display:"flex",gap:8 }}>
                      <button className="ticker" style={{ flex:1,padding:"10px 0",borderRadius:4,border:"1px solid rgba(251,191,36,0.35)",background:"rgba(251,191,36,0.08)",color:"#fbbf24",cursor:"pointer",fontSize:11,letterSpacing:"0.06em" }}>🛸 RE-SCOUT</button>
                      <button onClick={function(){removeLead(pipeSelected.id);setPipeSelected(null);}} className="ticker" style={{ padding:"10px 20px",borderRadius:4,border:"1px solid rgba(239,68,68,0.2)",background:"rgba(239,68,68,0.06)",color:"#ef4444",cursor:"pointer",fontSize:11 }}>REMOVE</button>
                      <button onClick={function(){setPipeSelected(null);}} className="ticker" style={{ padding:"10px 16px",borderRadius:4,border:"1px solid rgba(255,255,255,0.06)",background:"transparent",color:"#4a5568",cursor:"pointer",fontSize:11 }}>CLOSE</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {externalLinkPipe && (
              <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20 }} onClick={function(){setExternalLinkPipe(null);}}>
                <div style={{ background:"#0d1117",border:"1px solid rgba(251,191,36,0.3)",borderRadius:6,padding:28,maxWidth:400,width:"100%" }} onClick={function(e){e.stopPropagation();}}>
                  <div className="ticker" style={{ fontSize:9,color:"#fbbf24",letterSpacing:"0.1em",marginBottom:14 }}>EXTERNAL LINK</div>
                  <p className="sans" style={{ color:"#c9d1d9",fontSize:14,margin:"0 0 10px" }}>You are leaving Scout and visiting:</p>
                  <div style={{ background:"#080a0f",border:"1px solid rgba(255,255,255,0.06)",borderRadius:4,padding:"10px 14px",marginBottom:14 }}>
                    <div className="ticker" style={{ fontSize:10,color:"#6b7280",marginBottom:4 }}>{externalLinkPipe.label}</div>
                    <div className="ticker" style={{ fontSize:11,color:"#60a5fa",wordBreak:"break-all" }}>{externalLinkPipe.url}</div>
                  </div>
                  <p className="sans" style={{ color:"#4a5568",fontSize:12,marginBottom:20,lineHeight:1.6 }}>Scout is not responsible for the content of external sites. Continue?</p>
                  <div style={{ display:"flex",gap:8 }}>
                    <button onClick={function(){window.open(externalLinkPipe.url,"_blank","noopener,noreferrer");setExternalLinkPipe(null);}} className="ticker" style={{ flex:1,padding:"10px 0",borderRadius:4,border:"1px solid rgba(251,191,36,0.4)",background:"rgba(251,191,36,0.1)",color:"#fbbf24",cursor:"pointer",fontSize:11,letterSpacing:"0.08em" }}>CONTINUE ↗</button>
                    <button onClick={function(){setExternalLinkPipe(null);}} className="ticker" style={{ padding:"10px 20px",borderRadius:4,border:"1px solid rgba(255,255,255,0.08)",background:"transparent",color:"#4a5568",cursor:"pointer",fontSize:11 }}>CANCEL</button>
                  </div>
                </div>
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
