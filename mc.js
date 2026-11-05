// Bench: node mc.js — how often the Ponte Vedra landing is seen, and whether the Call runs through with every choice.
const D = require("./data-wa.js"), E = require("./engine.js");
function pv(seed, setup) {
  const P = E.newPv(seed); E.pvDecide(P, "army", setup.army); E.pvDecide(P, "aux", setup.aux);
  while (!P.over) E.pvEnd(P, setup.plan(P.h));
  return E.pvOut(P);
}
const SETUPS = {
  historical: { army: "town", aux: "none", plan: h => ({ yp31: h >= 1 ? "north" : "port", yp32: "port" }) },
  "one boat south": { army: "town", aux: "none", plan: h => ({ yp31: "south", yp32: h >= 1 ? "north" : "port" }) },
  everything: { army: "south", aux: "post", plan: h => ({ yp31: "south", yp32: h >= 1 ? "beaches" : "port" }) }
};
const n = 4000;
for (const [name, s] of Object.entries(SETUPS)) {
  let seen = 0, early = 0, gap = 0;
  for (let i = 1; i <= n; i++) { const o = pv(i * 7919, s); seen += o.seen; early += !!o.early; gap += o.northGap; }
  console.log(`Ponte Vedra, ${name}: seen ${(seen / n * 100).toFixed(1)}% (at the landing ${(early / n * 100).toFixed(1)}%) · north unwatched ${(gap / n).toFixed(1)} h`);
}
// the Call with every combination of the main choices
let runs = 0, all8 = 0, maxT = 0;
for (const call of ["file", "wire", "come"]) for (const dasch of ["listen", "lock", "promise"]) for (const ny of ["now", "follow"]) for (const hanky of ["watch", "pick"]) for (const boxes of ["take", "search", "wait"]) for (let s = 1; s <= 20; s++) {
  const C = E.newCall(s * 31, null, { seen: s % 4 === 0, early: s % 8 === 0 }); const pick = { call, dasch, ny, hanky, boxes, navy: "keep", chicago: "now" };
  let guard = 0;
  while (!C.over && guard++ < 60) { let d; while ((d = E.callDecision(C))) E.callDecide(C, d.id, pick[d.id]); E.callDay(C, ["lab", "south"]); }
  if (!C.over) throw new Error("call did not end");
  runs++; const S = E.callSummary(C); all8 += S.all; maxT = Math.max(maxT, C.t);
}
console.log(`Call: ${runs} runs, all eight held in ${(all8 / runs * 100).toFixed(0)}%, last day t=${maxT}`);
const K = E.newCredit(1); let g = 0; while (!K.over && g++ < 20) { const d = E.creditDecision(K); if (d) E.creditDecide(K, d.id, d.opts[0][0]); E.creditNext(K); }
console.log("Credit ends:", K.over, "bureau", K.bureau, "truth", K.truth, "coast guard", K.cg, "dasch", K.dasch);
