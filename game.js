/* Without Any Action — interface. */
(function () {
  "use strict";
  const E = window.Engine, D = window.WA;
  const SAVE = "waa_save";
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const cv = $("cv"), ctx = cv.getContext("2d");
  const IMG = { ama: new Image() }; IMG.ama.src = "assets/board-amagansett.jpg";
  let S = null;              // { mode, campaign, seed, log, A, P, C, K, out: {} }
  let picks = [];

  /* ------------------------------------------------------------ save and log */
  function save() { try { localStorage.setItem(SAVE, JSON.stringify(S)); } catch (e) { /* storage blocked */ } }
  function load() { try { return JSON.parse(localStorage.getItem(SAVE) || "null"); } catch (e) { return null; } }
  function log(html, k, when) { S.log.unshift({ html, k: k || "", when: when || whenNow() }); drawLog(); }
  function drawLog() { $("log").innerHTML = S.log.slice(0, 250).map(e => `<div class="e"><span class="h">${esc(e.when)}</span> <div class="card ${e.k}">${e.html}</div></div>`).join(""); }
  const KL = { beach: "On the beach", file: "The record", press: "The press", game: "Game", you: "Your decision" };
  const card = c => `<span class="k">${esc(KL[c.k] || c.k)}</span>${esc(c.t1)}${c.src ? `<span class="src">${esc(c.src)}</span>` : ""}`;
  const gameLine = t => log(esc(t), "game");
  function whenNow() {
    if (!S) return "";
    if (S.mode === "ama") return "12/13 June 1942, " + E.hhmm(S.A.t);
    if (S.mode === "pv") return "16/17 June 1942, " + E.pvClock(S.P);
    if (S.mode === "call") return E.dateOf(D.DAY0, S.C.t);
    if (S.mode === "credit") return D.CREDIT_STAGES[S.K.s].when;
    return "";
  }
  const bar = (l, v) => `<div class="meter"><span>${esc(l)}</span><i style="width:${v}%"></i><b>${v}</b></div>`;

  /* ------------------------------------------------------------ start */
  function start(mode) {
    const seed = Math.floor(Math.random() * 4e9);
    S = { mode, seed, log: [], campaign: mode === "ama", single: mode, out: {} };
    if (mode === "ama") beginAma();
    if (mode === "call") beginCall();
    if (mode === "credit") beginCredit();
    closeModal(); render(); save(); decisions();
  }
  function startDialog() {
    modal(`<p class="tag">Without Any Action · Operation Pastorius, June 1942</p><h2>Eight men from two submarines</h2>
      <p>In June 1942 two German U-boats put four men each ashore: on Long Island at Amagansett, in the night of 12/13 June, and at Ponte Vedra Beach south of Jacksonville, Florida, in the night of 16/17 June. They carried explosives and American money. Within two weeks all eight were in custody, and the FBI told the country how it had caught them.</p>
      <p>You are on the American side: a Coast Guard station on Long Island, a naval section base in Florida, the FBI in New York and Washington. Nobody fights in this game. You watch, report, follow, decide what to tell – and at the end four versions stand side by side.</p>
      <div class="opts">
        <button type="button" data-start="ama"><b>The whole story</b> – I. The Beach (two nights), II. The Call (14–27 June), III. The Credit (27 June – 8 August)</button>
        <button type="button" data-start="call"><b>II. The Call</b> – the FBI, 14 to 27 June 1942, day by day</button>
        <button type="button" data-start="credit"><b>III. The Credit</b> – what the country is told, 27 June to 8 August 1942</button></div>
      <p class="fine">Dates, times and quotations come from the record named on every card – mostly the transcript of the military commission, the FBI's New York file and the naval war diaries, read at the page images. Everything else is a game value. The title is from the FBI's file: the call of 14 June was initialled 'for the file without any action'.</p>`,
      box => { for (const b of box.querySelectorAll("[data-start]")) b.onclick = () => start(b.dataset.start); });
  }

  /* ------------------------------------------------------------ I A: Amagansett */
  function beginAma() { S.mode = "ama"; S.A = E.newAma(S.seed); S.amaShown = 0; log(card(Object.assign({ k: "beach" }, D.AMA_INTRO)), "beach", "12 June 1942, 23:50"); }
  function amaCards() { for (const c of D.AMA) if (c.at <= S.A.t && c.at > (S.amaShown ?? -1)) { log(card(c), c.k, "13 June 1942, " + E.hhmm(c.at)); S.amaShown = c.at; } }
  function amaPanel() {
    const A = S.A;
    $("status").innerHTML = `<h4>Amagansett Coast Guard station</h4>${bar("What you know of the men", A.desc)}${bar("The evidence, untouched", A.evidence)}${bar("The Coast Guard's standing", A.cg)}
      <p class="fine">The FBI knows: ${A.fbiAt ? E.hhmm(A.fbiAt) : "not yet"}. All bars are game values.</p>`;
    $("actions").innerHTML = A.over ? `<p class="fine">The night on Long Island is over. Next: Florida, four nights later.</p>` : `<p class="fine">The night runs by your decisions; the record's times appear in the chronicle.</p>`;
    $("endBtn").textContent = A.over ? "On to Florida" : "Continue"; $("endBtn").disabled = !A.over && !!E.amaDecision(A);
  }
  function amaEnd() {
    if (!S.A.over) { decisions(); return; }
    for (const c of D.AMA_AFTER) log(card(c), c.k, "13 June 1942");
    S.out.ama = E.amaOut(S.A); beginPv(); render(); save(); decisions();
  }

  /* ------------------------------------------------------------ I B: Ponte Vedra */
  function beginPv() { S.mode = "pv"; S.P = E.newPv(S.seed); log(card(Object.assign({ k: "file" }, D.PV_INTRO)), "file", "16 June 1942, 20:00"); }
  function pvPanel() {
    const P = S.P;
    $("status").innerHTML = `<h4>Section Base Mayport · ${E.pvClock(P)}</h4><div class="kv">
      <span>YP-31</span><span>${esc(zoneName(P.boats.yp31.at))} <span class="fine">(${P.boats.yp31.sea} h at sea)</span></span>
      <span>YP-32</span><span>${esc(zoneName(P.boats.yp32.at))} <span class="fine">(${P.boats.yp32.sea} h at sea)</span></span>
      <span>HP-7</span><span>guard ship at the river mouth</span>
      <span>Army</span><span>${P.army === "south" ? "motor patrol, part of it south of Ponte Vedra" : "motor patrol along the inhabited beach road"}</span>
      <span>Volunteers</span><span>${P.aux ? "two on the beach at Ponte Vedra" : "none"}</span>
      <span>Reports</span><span>${P.seen ? esc(P.seen.what) : "none"}</span></div>
      <p class="fine">A boat may stay out eight hours, then its crew must rest (game rule). Moonless; a thunderstorm early in the night.</p>`;
    $("actions").innerHTML = P.over ? "" : ["yp31", "yp32"].map(b => `<h4>${b === "yp31" ? "YP-31" : "YP-32"} – the next hour</h4><select id="o_${b}">${E.pvOrders(P, b).map(([v, l]) => `<option value="${v}"${v === P.boats[b].at ? " selected" : ""}>${esc(l)}</option>`).join("")}</select>`).join("");
    $("endBtn").textContent = P.over ? (S.campaign ? "On to the FBI" : "The reckoning") : "Next hour"; $("endBtn").disabled = !P.over && !!E.pvDecision(P);
  }
  const zoneName = id => (D.ZONES.find(z => z.id === id) || { name: id }).name;
  function pvEnd() {
    const P = S.P;
    if (P.over) { S.out.pv = E.pvOut(P); for (const c of D.PV_RECORD) log(card(c), c.k, "17 June 1942"); if (S.campaign) beginCall(); else { S.mode = "end"; showReckoning(); } render(); save(); decisions(); return; }
    if (E.pvDecision(P)) { decisions(); return; }
    const o = {}; for (const b of ["yp31", "yp32"]) { const sel = $("o_" + b); if (sel) o[b] = sel.value; }
    const was = E.pvClock(P);
    for (const n of E.pvEnd(P, o)) log(esc(n), "game", "16/17 June 1942, " + was);
    render(); save();
  }

  /* ------------------------------------------------------------ II: The Call */
  function beginCall() {
    S.mode = "call"; S.C = E.newCall(S.seed, S.out.ama, S.out.pv);
    for (const n of S.C.notes) gameLine(n);
    callCards();
  }
  function callCards() {
    const C = S.C;
    for (const c of D.CALL_EVENTS.filter(c => c.t === C.t)) log(card(c), c.k);
    for (const [m, d] of Object.entries(C.held)) if (d === C.t && !(C.shown || {})[m]) { (C.shown = C.shown || {})[m] = 1; gameLine(`In your game ${D.MEN[m].name} is in custody today.`); }
    if (C.boxesDay === C.t) gameLine(C.dec.boxes === "search" ? "Soldiers and Coast Guardsmen with probes find the boxes in the dunes south of Ponte Vedra. (game event)" : C.dec.boxes ? "The four boxes come out of the sand south of Ponte Vedra. (game event)" : "After the report from the beach, the Navy and the Army search at first light and find the boxes. (game event)");
  }
  function callPanel() {
    const C = S.C;
    const men = Object.entries(D.MEN).map(([m, x]) => `<span>${esc(x.name)}</span><span>${C.held[m] != null && C.held[m] <= C.t ? "in custody" : C.held[m] != null ? "watched" : x.group === "ny" ? (C.t < C.daschDay ? "somewhere in New York" : "named") : "unknown"}</span>`).join("");
    $("status").innerHTML = `<h4>FBI · ${esc(E.dateOf(D.DAY0, C.t))}</h4>${bar("What the Bureau knows", C.know)}${bar("Secrecy", C.secrecy)}${bar("Navy and Coast Guard trust", C.trust)}${C.dec.dasch ? bar("Dasch's trust in you", C.dtrust) : ""}
      <div class="kv">${men}</div><p class="fine">Bars and the men's status in your game are game values; the record runs in the chronicle.</p>`;
    $("actions").innerHTML = C.over ? "" : `<h4>Today – choose two</h4>` + D.CALL_ACTIONS.map(a => `<label class="act"><input type="checkbox" data-a="${a.id}"${picks.includes(a.id) ? " checked" : ""}${a.id === "south" && !C.flLead ? " disabled" : ""}> ${esc(a.label)} <span class="fine">${esc(a.note)}</span></label>`).join("");
    for (const b of document.querySelectorAll("[data-a]")) b.onchange = () => { if (document.querySelectorAll("[data-a]:checked").length > 2) b.checked = false; picks = [...document.querySelectorAll("[data-a]:checked")].map(x => x.dataset.a); };
    $("endBtn").textContent = C.over ? (S.campaign ? "On to the announcement" : "The reckoning") : "End the day"; $("endBtn").disabled = !C.over && !!E.callDecision(C);
  }
  function callEnd() {
    const C = S.C;
    if (C.over) { S.out.call = E.callSummary(C); if (S.campaign) beginCredit(); else { S.mode = "end"; showReckoning(); } render(); save(); decisions(); return; }
    if (E.callDecision(C)) { decisions(); return; }
    const was = E.dateOf(D.DAY0, C.t), chosen = picks.map(id => D.CALL_ACTIONS.find(a => a.id === id).label);
    const notes = E.callDay(C, picks); picks = [];
    log(esc(chosen.length ? "Today: " + chosen.join("; ") + "." : "A day of routine."), "game", was);
    for (const n of notes) log(esc(n), "game", was);
    if (C.over) gameLine(`The Call is over: ${E.callSummary(C).held.length} of the eight in custody in your game.`); else callCards();
    render(); save(); decisions();
  }

  /* ------------------------------------------------------------ III: The Credit */
  function beginCredit() { S.mode = "credit"; S.K = E.newCredit(S.seed, S.out.call, S.out.ama); creditCards(); }
  function creditCards() { const st = D.CREDIT_STAGES[S.K.s]; for (const c of D.PRESS.filter(c => c.s === st.id)) log(card(c), c.k); }
  function creditPanel() {
    const K = S.K;
    $("status").innerHTML = `<h4>${esc(D.CREDIT_STAGES[K.s].when)}</h4>${bar("The Bureau's credit with the public", K.bureau)}${bar("How close the public story is to the record", K.truth)}${bar("Credit given to the Coast Guard", K.cg)}${bar("Dasch's case", K.dasch)}
      <p class="fine">All bars are game values. The commission, its verdicts and the deaths of 8 August are the fixed record.</p>`;
    $("actions").innerHTML = "";
    $("endBtn").textContent = K.over ? "The reckoning" : "Next"; $("endBtn").disabled = !K.over && !!E.creditDecision(K);
  }
  function creditEnd() {
    const K = S.K;
    if (K.over) { S.mode = "end"; showReckoning(); return; }
    if (E.creditDecision(K)) { decisions(); return; }
    E.creditNext(K);
    if (K.over) { for (const t of D.END_RECORD) log(`<span class="k">The record</span>${esc(t)}<span class="src">${esc(D.END_SRC)}</span>`, "file", "8 Aug. 1942 · 1948"); }
    else creditCards();
    render(); save(); decisions();
  }

  /* ------------------------------------------------------------ boards */
  function drawAma() {
    const im = IMG.ama; if (!im.complete || !im.width) { im.onload = render; return; }
    cv.width = im.width; cv.height = im.height; ctx.drawImage(im, 0, 0);
    const A = S.A, pin = (x, y, label, col, dx = 14, dy = -12) => { ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.lineWidth = 4; ctx.strokeStyle = col; ctx.stroke(); ctx.font = "bold 22px Georgia"; ctx.fillStyle = col; ctx.textAlign = dx < 0 ? "right" : "left"; ctx.fillText(label, x + dx, y + dy); };
    pin(1642, 382, "Coast Guard station", "#1d3b5a", -16, 40);
    ctx.font = "bold 20px Georgia"; ctx.fillStyle = "#7a2a2a"; ctx.textAlign = "right";
    if (A.t >= 25) { ctx.fillText("the four men, under half a mile east →", 1790, 470); }
    ctx.fillStyle = "#1d3b5a"; ctx.textAlign = "left"; ctx.fillText("Montauk Division railway: the village station", 860, 110);
    ctx.fillText("← the Army post, about five miles", 20, 790);
    if (A.dec.search === "road") pin(1090, 250, A.seenTrain ? "seen at the station" : "your men at the road and station", "#7a2a2a", 16, -14);
    ctx.font = "15px sans-serif"; ctx.fillStyle = "#333"; ctx.fillText("U.S. Geological Survey, East Hampton, N.Y., 1:24,000 (1947), public domain. Marks set for play.", 20, cv.height - 10);
  }
  // the schematic coast, north at the top (drawn for play, not to scale)
  const PVY = { fern: 50, stmarys: 30, mouth: 230, ab: 290, jb: 360, pv: 450, land: 520, aug: 660 };
  function drawPv() {
    const W = cv.width = 1120, H = cv.height = 720, P = S.P, X = 420;
    ctx.fillStyle = "#cfe0ea"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#e8e2cf"; ctx.fillRect(0, 0, X, H);
    ctx.strokeStyle = "#6b6450"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, H); ctx.stroke();
    ctx.fillStyle = "#cfe0ea"; ctx.fillRect(160, PVY.mouth - 9, X - 160, 18);   // the St. Johns
    ctx.font = "italic 16px Georgia"; ctx.fillStyle = "#3b3a30"; ctx.textAlign = "right";
    const place = (k, t) => { ctx.fillText(t, X - 40, PVY[k] + 5); ctx.beginPath(); ctx.arc(X - 4, PVY[k], 4, 0, 7); ctx.fill(); };
    place("fern", "Fernandina"); place("ab", "Atlantic Beach"); place("jb", "Jacksonville Beach"); place("pv", "Ponte Vedra"); place("aug", "toward St. Augustine");
    ctx.fillText("Mayport · St. Johns River", X - 40, PVY.mouth - 16); ctx.fillText("St. Marys entrance (Georgia line)", X - 40, PVY.stmarys + 5);
    // zones
    const Z = { north: [PVY.stmarys, PVY.mouth - 30], light: [PVY.mouth - 30, PVY.mouth + 30], beaches: [PVY.mouth + 30, PVY.pv], south: [PVY.pv, H - 10] };
    ctx.textAlign = "left"; ctx.font = "13px sans-serif";
    for (const [z, [y0, y1]] of Object.entries(Z)) { ctx.strokeStyle = "rgba(29,59,90,.35)"; ctx.setLineDash([5, 5]); ctx.strokeRect(X + 20, y0 + 4, 620, y1 - y0 - 8); ctx.setLineDash([]); ctx.fillStyle = "#1d3b5a"; ctx.fillText(zoneName(z), X + 30, y0 + 22); }
    ctx.fillStyle = "#7a2a2a"; ctx.beginPath(); ctx.arc(X + 330, PVY.mouth, 7, 0, 7); ctx.fill(); ctx.font = "12px sans-serif"; ctx.fillText("St. Johns Lightship", X + 342, PVY.mouth + 4);
    // army patrol
    const ay1 = P.army === "south" ? PVY.land + 30 : PVY.pv;
    ctx.strokeStyle = "#3f6b3a"; ctx.lineWidth = 5; ctx.setLineDash([12, 8]); ctx.beginPath(); ctx.moveTo(X - 30, PVY.ab); ctx.lineTo(X - 30, ay1); ctx.stroke(); ctx.setLineDash([]);
    ctx.save(); ctx.translate(X - 15, (PVY.ab + ay1) / 2); ctx.rotate(-Math.PI / 2); ctx.fillStyle = "#3f6b3a"; ctx.font = "bold 12px sans-serif"; ctx.textAlign = "center"; ctx.fillText("Army motor patrol", 0, 4); ctx.restore();
    if (P.aux) { ctx.fillStyle = "#8a6d2f"; ctx.beginPath(); ctx.arc(X + 8, PVY.pv, 8, 0, 7); ctx.fill(); }
    // boats
    for (const [b, dx] of [["yp31", 0], ["yp32", 90]]) {
      const at = P.boats[b].at; const [y0, y1] = at === "port" ? [PVY.mouth, PVY.mouth] : Z[at]; const y = (y0 + y1) / 2 + (at === "light" ? 0 : 10), x = at === "port" ? X - 90 + dx / 3 : X + 260 + dx;
      ctx.beginPath(); ctx.moveTo(x, y - 12); ctx.lineTo(x + 10, y + 10); ctx.lineTo(x - 10, y + 10); ctx.closePath(); ctx.fillStyle = "#d9a520"; ctx.fill(); ctx.strokeStyle = "#5a4310"; ctx.lineWidth = 2; ctx.stroke();
      ctx.font = "bold 13px sans-serif"; ctx.fillStyle = "#1d1d1d"; ctx.textAlign = "center"; ctx.fillText(b === "yp31" ? "YP-31" : "YP-32", x, y + 26);
    }
    if (P.seen) { ctx.fillStyle = "#7a2a2a"; ctx.font = "bold 15px Georgia"; ctx.textAlign = "left"; ctx.fillText("Reported: " + P.seen.what, X + 30, H - 40); }
    if (P.over) { // what the record says
      ctx.strokeStyle = "#7a2a2a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X - 10, PVY.land, 12, 0, 7); ctx.stroke();
      ctx.font = "bold 14px Georgia"; ctx.fillStyle = "#7a2a2a"; ctx.textAlign = "right"; ctx.fillText("the landing, about 4 miles south of Ponte Vedra", X - 40, PVY.land + 5);
      ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(X - 10, PVY.land - 14); ctx.lineTo(X - 10, PVY.jb); ctx.stroke(); ctx.setLineDash([]); ctx.fillText("their walk north before dawn", X - 40, PVY.jb + 30);
    }
    ctx.textAlign = "left"; ctx.font = "12px sans-serif"; ctx.fillStyle = "#555";
    ctx.fillText("Schematic coast drawn for play, after USGS Mickler Landing (1952) and the Mayport war diary of June 1942; not to scale.", 12, H - 8);
  }
  const CITY = { ny: [880, 170, "New York"], ama: [1030, 150, "Amagansett"], wash: [800, 310, "Washington"], cin: [520, 300, "Cincinnati"], chi: [380, 170, "Chicago"], jax: [720, 620, "Jacksonville"], pv: [770, 660, "Ponte Vedra"] };
  function drawRoutes() {
    const W = cv.width = 1120, H = cv.height = 720;
    ctx.fillStyle = "#efe9da"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#cfe0ea"; ctx.beginPath(); ctx.moveTo(960, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H); ctx.lineTo(760, H); ctx.bezierCurveTo(800, 560, 840, 420, 860, 330); ctx.bezierCurveTo(900, 250, 960, 190, 1000, 175); ctx.bezierCurveTo(990, 120, 960, 60, 960, 0); ctx.fill();
    const line = (a, b, col, dash) => { ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.setLineDash(dash || []); ctx.beginPath(); ctx.moveTo(CITY[a][0], CITY[a][1]); ctx.lineTo(CITY[b][0], CITY[b][1]); ctx.stroke(); ctx.setLineDash([]); };
    line("ama", "ny", "#9b3b2e", [6, 6]); line("ny", "wash", "#9b3b2e", [6, 6]); line("pv", "jax", "#9b3b2e", [6, 6]); line("jax", "cin", "#9b3b2e", [6, 6]); line("cin", "chi", "#9b3b2e", [6, 6]); line("cin", "ny", "#9b3b2e", [6, 6]);
    for (const [k, [x, y, n]] of Object.entries(CITY)) { ctx.fillStyle = "#1d3b5a"; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill(); ctx.font = "bold 17px Georgia"; ctx.textAlign = k === "ama" ? "right" : "left"; ctx.fillText(n, k === "ama" ? x + 10 : x + 12, k === "ama" ? y - 14 : y - 8); }
    const C = S.C; if (C) {
      const at = { dasch: "wash", burger: "ny", heinck: "ny", quirin: "ny", kerling: "ny", thiel: "ny", haupt: "chi", neubauer: "chi" }; const n = {};
      for (const m of Object.keys(D.MEN)) { const held = C.held[m] != null && C.held[m] <= C.t; if (!held) continue; const c = at[m]; n[c] = (n[c] || 0) + 1; const [x, y] = CITY[c]; ctx.fillStyle = "#1d3b5a"; ctx.fillRect(x - 40 + n[c] * 16, y + 14, 12, 12); }
    }
    ctx.font = "13px sans-serif"; ctx.fillStyle = "#555"; ctx.textAlign = "left";
    ctx.fillText("Dashed: the men's routes as the record gives them (bus and train). Squares: men in custody in your game. Drawn for play, not to scale.", 12, H - 8);
    if (S.mode === "credit" || S.mode === "end") { ctx.font = "bold 28px Georgia"; ctx.fillStyle = "#1d3b5a"; ctx.fillText("27 June – 8 August 1942: what the country is told", 40, 60); }
  }

  /* ------------------------------------------------------------ shared */
  function decisions() {
    if (!S) return;
    let d = null, dec = null;
    if (S.mode === "ama") { d = E.amaDecision(S.A); dec = (id, ch) => { const o = E.amaDecide(S.A, id, ch); amaCards(); return o; }; }
    if (S.mode === "pv") { d = E.pvDecision(S.P); dec = (id, ch) => E.pvDecide(S.P, id, ch); }
    if (S.mode === "call") { d = E.callDecision(S.C); dec = (id, ch) => E.callDecide(S.C, id, ch); }
    if (S.mode === "credit") { d = E.creditDecision(S.K); dec = (id, ch) => E.creditDecide(S.K, id, ch); }
    if (!d) return;
    modal(`<p class="tag">${esc(whenNow())}</p><h2>${esc(d.title)}</h2><p>${esc(d.text)}</p><p class="fine">${esc(d.note)}</p><div class="opts">${d.opts.map(([id, t]) => `<button type="button" data-o="${id}">${esc(t)}</button>`).join("")}</div>`,
      box => { for (const b of box.querySelectorAll("[data-o]")) b.onclick = () => {
        const when = whenNow(); log(`<span class="k">Your decision</span>${esc(d.title)}: ${esc(d.opts.find(o => o[0] === b.dataset.o)[1])}`, "you", when);
        for (const n of dec(d.id, b.dataset.o) || []) log(esc(n), "game", when);
        closeModal(); render(); save(); decisions(); }; });
  }
  function render() {
    if (!S) return;
    if (S.mode === "ama") { drawAma(); amaPanel(); }
    else if (S.mode === "pv") { drawPv(); pvPanel(); }
    else { drawRoutes(); if (S.mode === "call") callPanel(); if (S.mode === "credit") creditPanel(); if (S.mode === "end") { $("status").innerHTML = "<h4>The reckoning</h4>"; $("actions").innerHTML = ""; $("endBtn").textContent = "The reckoning"; $("endBtn").disabled = false; } }
    $("when").textContent = whenNow();
    const f = { ama: "ama", pv: "pv", call: "call", credit: "credit", end: "credit" }[S.mode];
    $("fixed").innerHTML = `<b>The fixed record</b><br>${esc(D.FIXED[f])}${D.FIXED_SRC[f] ? ` <span class="fine">${esc(D.FIXED_SRC[f])}</span>` : ""}`;
  }
  function showReckoning() { S.mode = "end"; save(); modal(window.Reckoning(S, E, D) + `<div class="btnrow"><button type="button" id="ok">Close</button></div>`, b => b.querySelector("#ok").onclick = closeModal, true); render(); }
  function modal(html, wire, wide) { const m = $("modal"), b = $("modalBox"); b.innerHTML = html; b.classList.toggle("wide", !!wide); m.hidden = false; if (wire) wire(b); b.scrollTop = 0; }
  function closeModal() { $("modal").hidden = true; }

  $("endBtn").onclick = () => { if (!S) return; ({ ama: amaEnd, pv: pvEnd, call: callEnd, credit: creditEnd, end: showReckoning }[S.mode] || showReckoning)(); };
  $("newBtn").onclick = () => { if (!S || confirm("Start a new game? The current one is lost.")) { try { localStorage.removeItem(SAVE); } catch (e) { } S = null; $("log").innerHTML = ""; startDialog(); } };

  // demo hook for screenshots: #demo=ama|pv|call|credit|reck
  const h = location.hash;
  if (h.startsWith("#demo")) {
    const m = h.split("=")[1] || "ama"; S = { mode: "ama", seed: 4242, log: [], campaign: true, single: "ama", out: {} }; beginAma();
    const auto = (getD, doD) => { let d; while ((d = getD())) { log(`<span class="k">Your decision</span>${esc(d.title)}: ${esc(d.opts[0][1])}`, "you"); for (const n of doD(d.id, d.opts[0][0]) || []) gameLine(n); } };
    if (m !== "ama") {
      auto(() => E.amaDecision(S.A), (id, ch) => { const o = E.amaDecide(S.A, id, ch); amaCards(); return o; });
      S.out.ama = E.amaOut(S.A); for (const c of D.AMA_AFTER) log(card(c), c.k, "13 June 1942"); beginPv();
      E.pvDecide(S.P, "army", "south"); E.pvDecide(S.P, "aux", "post");
      const hours = m === "pv" ? 5 : 10; for (let i = 0; i < hours; i++) for (const n of E.pvEnd(S.P, { yp31: "south", yp32: i ? "beaches" : "port" })) gameLine(n);
      if (m !== "pv") {
        S.out.pv = E.pvOut(S.P); for (const c of D.PV_RECORD) log(card(c), c.k, "17 June 1942"); beginCall();
        const until = m === "call" ? 9 : 99;
        while (!S.C.over && S.C.t < until) { auto(() => E.callDecision(S.C), (id, ch) => E.callDecide(S.C, id, ch)); for (const n of E.callDay(S.C, ["lab", "liaise"])) gameLine(n); if (!S.C.over) callCards(); }
        if (m !== "call") { S.out.call = E.callSummary(S.C); beginCredit(); while (!S.K.over) { auto(() => E.creditDecision(S.K), (id, ch) => E.creditDecide(S.K, id, ch)); E.creditNext(S.K); if (!S.K.over) creditCards(); } S.mode = m === "reck" ? "end" : "credit"; if (m === "credit") { S.K.over = false; S.K.s = 3; } }
      }
    }
    drawLog(); render(); if (m === "reck") showReckoning(); else if (m === "ama") decisions();
  } else {
    const s = load(); if (s && s.mode) { S = s; drawLog(); render(); if (S.mode === "end") showReckoning(); else decisions(); } else startDialog();
  }
})();
