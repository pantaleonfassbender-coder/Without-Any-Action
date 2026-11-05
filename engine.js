/* Without Any Action — engine (no DOM). Every number here is a game value unless the data file marks it. */
(function (root) {
  "use strict";
  const D = typeof module !== "undefined" ? require("./data-wa.js") : root.WA;
  const E = {};
  const clamp = v => Math.max(0, Math.min(100, Math.round(v)));
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const R = S => { S.r = (S.r * 1103515245 + 12345) >>> 0; return rng(S.r)(); };
  E.dateOf = (d0, t) => { const d = new Date(d0[0], d0[1], d0[2] + t); return `${d.getDate()} ${D.MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
  E.hhmm = m => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };

  /* ================================================================ I A: Amagansett */
  E.newAma = seed => ({ r: seed >>> 0, step: 0, t: 0, desc: 30, evidence: 50, cg: 50, fbiAt: null, seenTrain: false, dec: {}, over: false });
  const AMA_DEC = [
    { id: "watch", title: "Setting the watch", text: "Cullen is due out at 00:10. The order of 11 April says two men to a watch, both ways; the station is short of men and the fog is thick.",
      note: "Historically Cullen went alone, eastward, unarmed [S]. Every patrol is unarmed in this game.",
      opts: [["solo", "One man east, as usual"], ["pair", "Two men east, as ordered"], ["both", "Two pairs, east and west – the station nearly empty"]] },
    { id: "report", title: "Cullen is back", text: "He has met four men at the water's edge – fishermen, they said – and has been paid to forget it. He is shaken; the money is in his pocket.",
      note: "Historically the duty man took three men with rifles to the beach and the chief, Barnes, was called; the Navy and the Army were told from the station [S].",
      opts: [["chief", "Call the chief, send men to the beach, tell the Navy"], ["army", "Call the Army post first – it is five miles off"], ["fbi", "Telephone the FBI in New York yourself"]] },
    { id: "search", title: "On the beach", text: "Fog, low tide, no moon. Footprints run up into the dunes. The men are gone – inland, to the road, the village, the railway.",
      note: "Historically the beach and dunes were searched; the boxes were found at first light [S]. The four took a train to New York [L].",
      opts: [["dunes", "Search the dunes and the beach"], ["road", "Send men to the road and the railway station in the village"], ["wait", "Hold the beach, touch nothing until daylight"]] },
    { id: "finds", title: "First light", text: "Four boxes, a bag of clothes, two shovels, a cap. The Navy's intelligence officers are on the way; the FBI is on the telephone.",
      note: "Historically the FBI took the lead at an 11:00 conference; the Coast Guard kept a vest for its own inquiry until 17 June [S].",
      opts: [["hand", "Hand everything to the FBI as it lies"], ["keep", "Keep some pieces for the Coast Guard's own inquiry"], ["navy", "Report through the Navy and let them decide"]] },
    { id: "silence", title: "The men talk", text: "By noon Amagansett knows that something has happened on the beach. Your men are asked in the village.",
      note: "The Coast Guard's own story came out through the Office of War Information on 15 July [S]; an 'unofficial report' of 'a lone unarmed Coast Guardsman' was in print on 29 June [O].",
      opts: [["order", "Order silence – not a word, to anyone"], ["navy", "Leave it to the Navy to say what is said"]] }
  ];
  E.amaDecision = A => A.over ? null : AMA_DEC[A.step] || null;
  E.amaDecide = (A, id, ch) => {
    A.dec[id] = ch; const out = [];
    if (id === "watch") {
      A.desc += ch === "solo" ? 0 : 15; A.lag = ch === "both" ? 15 : ch === "pair" ? -10 : 0; A.t = 25;
      if (ch !== "solo") out.push("Two men see the four together; one goes back at a run while the other keeps them in sight until the fog takes them. (game event)");
    }
    if (id === "report") {
      const base = { chief: 150, army: 120, fbi: 70 }[ch]; A.fbiAt = base + (A.lag || 0); A.t = 75;
      if (ch === "army") { A.cg -= 5; A.army = true; out.push("The Army post sends a truck of men; they are on the beach before 01:30. (game value)"); }
      if (ch === "fbi") { A.cg -= 10; A.evidence += 5; out.push(`The New York night desk takes the call at ${E.hhmm(A.fbiAt)} and writes it down. (game event)`); }
      out.push(`The FBI knows by ${E.hhmm(A.fbiAt)} (historically after 02:30 – from the Army [S]).`);
    }
    if (id === "search") {
      A.t = 330;
      if (ch === "dunes") { A.evidence += 15; out.push("In the dunes the men find where the sand has been dug. At first light the boxes come out. (as in the record)"); }
      if (ch === "wait") { A.evidence += 20; A.desc -= 5; out.push("Nothing is touched until daylight; the dug sand and the tracks are as they were left. (game event)"); }
      if (ch === "road") {
        A.evidence -= 5; const p = 0.22 + (A.army ? 0.12 : 0) + (A.dec.watch === "both" ? -0.08 : 0);
        if (R(A) < p) { A.seenTrain = true; A.desc += 30; out.push("At the village station a man of yours sees four strangers board the early train to New York, one with wet trouser legs. He has no orders to stop anyone; he takes their faces with him. (game event)"); }
        else out.push("The road and the station stay quiet as far as your men can see. (game event)");
      }
    }
    if (id === "finds") {
      A.t = 360;
      if (ch === "hand") { A.evidence += 15; A.cg -= 5; }
      if (ch === "keep") { A.evidence -= 10; A.cg += 10; out.push("The FBI later asks, sharply, for the rest. (game event)"); }
      if (ch === "navy") { A.evidence += 5; }
    }
    if (id === "silence") { A.leak = ch === "navy"; A.over = true; }
    A.step++; A.desc = clamp(A.desc); A.evidence = clamp(A.evidence); A.cg = clamp(A.cg);
    return out;
  };
  E.amaOut = A => ({ fbiAt: A.fbiAt || 150, desc: A.desc, evidence: A.evidence, cg: A.cg, seenTrain: A.seenTrain, leak: !!A.leak });

  /* ================================================================ I B: Ponte Vedra */
  // landing timeline (game values built on the record): hours since 20:00
  const PV_P = {   // probability per hour of a sighting, by watcher and hour (3 = 23:00 … 9 = 05:00)
    boat_south: { 3: .04, 4: .07, 5: .05 }, boat_beaches: { 4: .02, 5: .02 },
    army_south: { 4: .05, 5: .06 }, army_town: { 6: .012, 7: .012, 8: .012, 9: .012 },
    aux: { 4: .02, 5: .02, 6: .05, 7: .02 }
  };
  const PV_WHAT = { 3: "a low dark shape offshore, south of Ponte Vedra, no lights", 4: "a rubber boat at the water's edge and men carrying something up the beach", 5: "men digging above the high-water mark, south of Ponte Vedra",
    6: "four men walking north on the beach in the dark, past the houses", 7: "four men walking north on the beach in the dark, past the houses", 8: "four men on the beach near Jacksonville Beach before dawn", 9: "four men resting behind the sea wall at Jacksonville Beach" };
  E.newPv = seed => ({ r: (seed ^ 0x5bd1e995) >>> 0, h: 0, boats: { yp31: { at: "port", sea: 0 }, yp32: { at: "port", sea: 0 } }, army: null, aux: null, seen: null, northGap: 0, dec: {}, over: false });
  const PV_DEC = [
    { id: "army", title: "The Army's motor patrol", text: "The 104th Infantry's order of 3 June puts its motor patrol 'along the inhabited area of the beach road'. South of Ponte Vedra the road runs through empty dunes.",
      note: "Historically the patrol kept to its order [S]; how many trucks and men it had, the record does not say.",
      opts: [["town", "Leave the Army to its order"], ["south", "Ask the Army to run part of the patrol south of Ponte Vedra"]] },
    { id: "aux", title: "Volunteers", text: "The Coast Guard Auxiliary is to 'provide volunteer beach patrols and lookouts' – on paper. Nobody has yet been posted on this beach.",
      note: "Rescue Order 1-42, June 1942 [S]. The organized beach patrol was ordered only on 25 July 1942 [S].",
      opts: [["none", "No volunteers tonight"], ["post", "Post two volunteers on the beach at Ponte Vedra"]] }
  ];
  E.pvDecision = P => P.over ? null : (P.h === 0 && PV_DEC.find(d => !(d.id in P.dec))) || null;
  E.pvDecide = (P, id, ch) => { P.dec[id] = ch; if (id === "army") P.army = ch; if (id === "aux") P.aux = ch === "post"; return []; };
  E.pvClock = P => E.hhmm(20 * 60 + P.h * 60);
  E.pvOrders = (P, b) => { if (b === "yp32" && P.h < 1) return [["port", "In port (crew ashore until 20:30)"]]; return D.ZONES.map(z => [z.id, z.name]); };
  E.pvEnd = (P, orders) => {
    const out = [];
    for (const b of ["yp31", "yp32"]) { const B = P.boats[b]; const o = orders[b] || B.at; B.at = o; if (o === "port") B.sea = Math.max(0, B.sea - 2); else B.sea++; }
    for (const b of ["yp31", "yp32"]) if (P.boats[b].sea > 8) { P.boats[b].at = "port"; P.boats[b].sea = 0; out.push(`${b === "yp31" ? "YP-31" : "YP-32"} must come in: the crew has been out too long. (game rule)`); }
    if (P.h >= 1 && P.boats.yp31.at !== "north" && P.boats.yp32.at !== "north") P.northGap++;
    if (!P.seen) {
      const w = [];
      for (const b of ["yp31", "yp32"]) { const at = P.boats[b].at; if (at === "south") w.push(["boat_south", b]); if (at === "beaches") w.push(["boat_beaches", b]); }
      if (P.army === "south") w.push(["army_south", "the Army truck"]); w.push(["army_town", "the Army patrol"]);
      if (P.aux) w.push(["aux", "the volunteers"]);
      for (const [k, who] of w) {
        let p = (PV_P[k] || {})[P.h] || 0; if (k === "army_town" && P.army === "south") p /= 2;
        if (p && R(P) < p) { P.seen = { h: P.h, what: PV_WHAT[P.h], who: who === "yp31" ? "YP-31" : who === "yp32" ? "YP-32" : who }; break; }
      }
      if (P.seen) out.push(`${E.pvClock(P)}: ${P.seen.who} reports ${P.seen.what}. The report goes to Mayport and on to the Sixth Naval District; at first light the beach is searched. (game event)`);
    }
    P.h++;
    if (P.h >= 10) { P.over = true; out.push(P.seen ? "06:00: the night is over – and this time somebody saw something." : "06:00: the night is over. Nobody has reported anything. (as in the record)"); }
    if (P.over && P.northGap >= 4) out.push(`North of the river no boat patrolled for ${P.northGap} hours of the night; the Sea Frontier wants to know why. (game value)`);
    return out;
  };
  E.pvOut = P => ({ seen: !!P.seen, h: P.seen ? P.seen.h : null, early: P.seen && P.seen.h <= 5, northGap: P.northGap });

  /* ================================================================ II: The Call */
  const FL_WHERE = t => t <= 3 ? "Jacksonville" : t <= 5 ? "on a train to Cincinnati" : null;
  E.newCall = (seed, ama, pv) => {
    ama = ama || { fbiAt: 150, desc: 30, evidence: 65, cg: 45, seenTrain: false };
    pv = pv || { seen: false };
    const C = { r: (seed ^ 0x27d4eb2d) >>> 0, t: 0, know: clamp(8 + ama.desc / 4 + ama.evidence / 5), secrecy: 70, trust: clamp(ama.cg), dtrust: 50,
      held: {}, daschDay: 5, dec: {}, flLead: pv.seen, flTrail: false, boxesDay: null, kerlingDay: null, chicagoDay: null, over: false, ama, pv, notes: [] };
    if (pv.seen) { C.know += 10; C.notes.push("From the Navy in Jacksonville: something seen on the beach at Ponte Vedra in the night of 16/17 June. (game event)"); if (pv.early) C.boxesDay = 3; }
    if (ama.seenTrain) C.know += 8;
    C.know = clamp(C.know); return C;
  };
  const CALL_DEC = {
    call: { title: "The call, 19:51", text: "A man who calls himself Frank Daniel Pastorius says he came from Germany two days ago, will go to Washington on Thursday or Friday to see Mr. Hoover, and asks you to record his call and tell Washington.",
      note: "Historically he 'refused to come to this office'; the agent wrote a memo 'only for the purpose of recording the call', and it was not sent on [S].",
      opts: [["file", "Record it for the file"], ["wire", "Record it and wire Washington tonight"], ["come", "Ask him to come in to the office now"]] },
    dasch: { title: "Washington: the man comes in", text: "The leader of 'a group of eight men' sits in a room at headquarters with a great deal of money and a long story.",
      note: "Historically Traynor took his statement over days and thought him 'sincere and truthful' [O]; Dasch named the meeting place in Cincinnati only after a handshake promise [O].",
      opts: [["listen", "Hear him out, for as long as it takes"], ["lock", "Lock him up and demand names now"], ["promise", "Promise him consideration – shake on it"]] },
    ny: { title: "New York: Burger, Heinck, Quirin", text: "Agents have Burger under watch at the Governor Clinton; this afternoon he is to meet the other two.",
      note: "Historically all three were taken that afternoon, 17:00–17:30 [S].",
      opts: [["now", "Take them as soon as they meet"], ["follow", "Follow them for another day"]] },
    hanky: { title: "The handkerchief", text: "Developed with ammonia, the handkerchief gives names: Helmut Leiner, a friend of Kerling's in Astoria, and Walter Froehling in Chicago.",
      note: "Historically agents watched the contacts; Kerling was taken on his way to meet his wife, a meeting he had arranged through Leiner [S]/[O].",
      opts: [["watch", "Watch Leiner and Kerling's wife"], ["pick", "Pick up Leiner now"]] },
    boxes: { title: "The boxes in Florida", text: "Kerling is in custody. Somewhere on a beach south of Jacksonville lie four boxes.",
      note: "Historically agents took Kerling south on the Silver Meteor; he showed them the place on 25 June [S]. No Coast Guard or Army man was there [S].",
      opts: [["take", "Take Kerling to Jacksonville"], ["search", "Ask the Army and Coast Guard to search the beach"], ["wait", "Wait until he names the place"]] },
    navy: { title: "Telling the Navy", text: "The Navy and the Coast Guard in Jacksonville do not know that Germans landed on their beach.",
      note: "Historically naval intelligence learned of it 'by accident' on 26 June [S].",
      opts: [["keep", "Keep it within the Bureau for now"], ["tell", "Tell the Navy in Jacksonville at once"]] },
    chicago: { title: "Chicago: Haupt and Neubauer", text: "Haupt is staying with his family; Neubauer in a hotel. Agents watch both.",
      note: "Historically both were taken on 27 June [S].",
      opts: [["now", "Take them"], ["watch", "Watch one more day for contacts"]] }
  };
  E.callDecision = C => {
    if (C.over) return null;
    const due = id => !(id in C.dec);
    let id = null;
    if (C.t === 0 && due("call")) id = "call";
    else if (C.t === C.daschDay && due("dasch")) id = "dasch";
    else if (C.t === C.daschDay + 1 && due("ny")) id = "ny";
    else if (C.t === C.hankyDay && due("hanky")) id = "hanky";
    else if (C.kerlingDay != null && C.t === C.kerlingDay + 1 && due("boxes") && C.boxesDay == null) id = "boxes";
    else if (C.boxesDay != null && C.t === C.boxesDay && due("navy")) id = "navy";
    else if (C.t === C.chicagoDue && due("chicago")) id = "chicago";
    return id ? Object.assign({ id }, CALL_DEC[id]) : null;
  };
  E.callDecide = (C, id, ch) => {
    C.dec[id] = ch; const out = [];
    if (id === "call") {
      if (ch === "wire") { C.expected = true; out.push("A teletype goes to Washington: a man calling himself Pastorius may come in this week. (game event)"); }
      if (ch === "come") { if (R(C) < 0.25) { C.daschDay = 1; out.push("He hesitates, then says he will come to Foley Square tomorrow. (game event)"); } else { C.expected = true; out.push("He will not come; he wants Hoover. The call goes to Washington. (game event)"); } }
    }
    if (id === "dasch") {
      if (!C.expected) out.push("Headquarters has not been told that anyone is coming. (as in the record)");
      if (ch === "listen") { C.know += 40; C.dtrust = 75; C.hankyDay = C.daschDay + 3; }
      if (ch === "lock") { C.know += 22; C.dtrust = 20; C.hankyDay = C.daschDay + 5; out.push("He talks, but less, and slowly. (game event)"); }
      if (ch === "promise") { C.know += 45; C.dtrust = 95; C.promise = true; C.hankyDay = C.daschDay + 3; }
      C.held.dasch = C.daschDay;
    }
    if (id === "ny") {
      if (ch === "now") for (const m of ["burger", "heinck", "quirin"]) C.held[m] = C.t;
      else { C.secrecy -= 10; if (R(C) < 0.25) { out.push("Quirin slips the watch in the subway and is found only two days later. (game event)"); C.held.burger = C.held.heinck = C.t + 1; C.held.quirin = C.t + 2; } else { C.know += 8; for (const m of ["burger", "heinck", "quirin"]) C.held[m] = C.t + 1; out.push("A day's watching shows two more addresses. (game event)"); } }
    }
    if (id === "hanky") {
      let k;
      if (ch === "watch") k = C.t + (R(C) < 0.85 ? 1 : 2);
      else { C.secrecy -= 10; if (R(C) < 0.4) { k = C.t + 4; out.push("Kerling hears that Leiner has been taken and stays away from his wife for days. (game event)"); } else k = C.t + 1; }
      C.kerlingDay = C.kerlingDay != null ? Math.min(C.kerlingDay, k) : k;
      C.held.kerling = C.held.thiel = C.kerlingDay; C.chicagoDue = C.chicagoDue != null ? Math.min(C.chicagoDue, C.t + 5) : C.t + 5;
    }
    if (id === "boxes") {
      if (ch === "take") C.boxesDay = C.t + 1;
      if (ch === "search") { C.trust += 15; C.secrecy -= 10; C.boxesDay = C.t + (R(C) < 0.5 ? 2 : 4); }
      if (ch === "wait") C.boxesDay = C.t + 3;
    }
    if (id === "navy") { if (ch === "tell") { C.trust += 15; C.secrecy -= 5; } else C.trust -= 5; }
    if (id === "chicago") {
      if (ch === "now") C.held.haupt = C.held.neubauer = C.t;
      else { C.know += 6; C.secrecy -= 5; C.held.haupt = C.held.neubauer = C.t + 1; out.push("A day's watching in Chicago shows who comes and goes at the Haupt flat. (game event)"); }
    }
    for (const k of ["know", "secrecy", "trust"]) C[k] = clamp(C[k]);
    return out;
  };
  E.callDay = (C, picks) => {
    const out = [];
    for (const a of picks) {
      if (a === "canvass") { C.know += C.t < 5 ? 3 : 1; }
      if (a === "lab") { C.know += C.t < 3 ? 4 : 1; }
      if (a === "contacts") { C.know += 3; C.secrecy -= 4; }
      if (a === "liaise") { C.trust += 6; C.secrecy -= 3; }
      if (a === "quiet") { C.secrecy += 6; }
      if (a === "south") {
        if (!C.flLead) out.push("Without a lead from Florida there is nothing to search for. (game rule)");
        else if (!C.flTrail && FL_WHERE(C.t) && R(C) < 0.3) { C.flTrail = true; C.know += 15; out.push(`A hotel clerk in Jacksonville remembers four men with new suitcases who left for the trains – one ticket was for Cincinnati. (game event)`); }
      }
    }
    if (C.flTrail && C.dec.dasch && C.kerlingDay == null) { C.kerlingDay = C.t + 1; C.held.kerling = C.held.thiel = C.kerlingDay; C.chicagoDue = C.t + 3; out.push("With the Jacksonville trail and Dasch's story together, agents expect Kerling in New York. (game event)"); }
    for (const k of ["know", "secrecy", "trust"]) C[k] = clamp(C[k]);
    C.t++;
    if (C.t > 13 && C.dec.chicago && !E.callDecision(C)) C.over = true;
    if (C.t > 20) C.over = true;   // failsafe
    return out;
  };
  E.callSummary = C => {
    const held = Object.keys(D.MEN).filter(m => C.held[m] != null && C.held[m] <= Math.max(C.t, 13));
    return { held, all: held.length === 8, boxesDay: C.boxesDay, know: C.know, secrecy: C.secrecy, trust: C.trust, dtrust: C.dtrust, promise: !!C.promise, expected: !!C.expected, call: C.dec.call || "file", navy: C.dec.navy || "keep" };
  };

  /* ================================================================ III: The Credit */
  E.newCredit = (seed, call, ama) => {
    call = call || { all: true, held: Object.keys(D.MEN), promise: false, trust: 45, dtrust: 75, secrecy: 70 };
    return { r: (seed ^ 0x9e3779b9) >>> 0, s: 0, bureau: clamp(50 + (call.all ? 15 : 0)), truth: 20, cg: clamp((call.trust || 45) - 10), dasch: call.dtrust || 50, dec: {}, call, ama: ama || { leak: false }, over: false };
  };
  const CR_DEC = {
    announce: { title: "The announcement", text: "Tonight the Director will tell the press that all eight are in custody. What will he say about how they were found?",
      note: "Historically the story agreed on 23 June was used: agents had been led to the hotel by a tip 'where we picked up DASCH and BURGER' [S]; Hoover would not say 'where or when' [S].",
      opts: [["cover", "The agreed story: a tip, a hotel – 'we picked up Dasch'"], ["forward", "Say that one of them came forward, without naming him"], ["full", "Tell it as it happened, the call of 14 June included"]] },
    coast: { title: "The Coast Guard", text: "The papers want to know who first met the Germans on the beach.",
      note: "Historically the FBI's account said only that the Coast Guard had 'intensified precautions' [S].",
      opts: [["precaution", "'Intensified precautions' – no more"], ["cullen", "Name the patrolman and what he did"], ["nothing", "Say nothing about the Coast Guard"]] },
    rumour: { title: "'A lone unarmed Coast Guardsman'", text: "An unofficial report is in the papers: a single unarmed Coast Guardsman met the first group.",
      note: "Historically 'The FBI did not reveal how the dynamiters were caught' [O].",
      opts: [["silent", "No comment"], ["confirm", "Confirm it"], ["deny", "Deny it"]] },
    commission: { title: "Before the commission", text: "Defence counsel want to know what happened to a telephone call to the New York office on 14 June.",
      note: "Historically McWhorter and Connelley testified, called by the defence: the memo was not sent on [S].",
      opts: [["straight", "Let the agents answer straight"], ["narrow", "Keep their answers as narrow as the questions"]] },
    lenient: { title: "Two of the eight", text: "Dasch came in of his own accord; Burger told everything from the first hour. The commission will sentence all eight; the President will decide.",
      note: "Historically Biddle and Hoover asked the President to spare both [O]; two were spared 'because they helped the Government' [S].",
      opts: [["both", "Ask the President to spare both"], ["dasch", "Ask for Dasch alone"], ["none", "Leave it to the commission"]] }
  };
  E.creditDecision = K => { if (K.over) return null; const st = D.CREDIT_STAGES[K.s]; return st && CR_DEC[st.id] && !(st.id in K.dec) ? Object.assign({ id: st.id }, CR_DEC[st.id]) : null; };
  E.creditDecide = (K, id, ch) => {
    K.dec[id] = ch; const out = [];
    if (id === "announce") {
      if (ch === "cover") { K.bureau += 30; K.truth = 10; }
      if (ch === "forward") { K.bureau += 15; K.truth = 45; K.dasch += 5; }
      if (ch === "full") { K.bureau -= 5; K.truth = 85; K.dasch -= 25; out.push("Berlin learns from the newspapers that one of its men gave the others up; Dasch fears for his family in Germany. (game event)"); }
      if (K.call.promise && ch === "cover") out.push("Dasch was promised consideration; the story says he was 'picked up'. (game value)");
    }
    if (id === "coast") { if (ch === "cullen") { K.cg += 25; K.bureau -= 5; K.truth += 5; } if (ch === "nothing") K.cg -= 10; if (ch === "precaution") K.cg += 3; }
    if (id === "rumour") { if (ch === "confirm") { K.cg += 15; K.truth += 5; } if (ch === "deny") { K.truth -= 10; K.cg -= 10; } }
    if (id === "commission") { if (ch === "straight") K.truth += 10; else K.truth -= 5; }
    if (id === "lenient") { if (ch === "both") K.dasch += 20; if (ch === "dasch") K.dasch += 10; if (ch === "none") K.dasch -= 20; }
    for (const k of ["bureau", "truth", "cg", "dasch"]) K[k] = clamp(K[k]);
    return out;
  };
  E.creditNext = K => { K.s++; if (K.s >= D.CREDIT_STAGES.length - 1) { K.s = D.CREDIT_STAGES.length - 1; K.over = true; } };

  if (typeof module !== "undefined") module.exports = E; else root.Engine = E;
})(typeof window !== "undefined" ? window : globalThis);
