/* Without Any Action — the reckoning: four versions of June 1942. */
window.Reckoning = function (S, E, D) {
  "use strict";
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const V = D.VERSIONS, o = S.out || {}, A = S.A, P = S.P, C = S.C, K = S.K;
  const ver = v => `<h3>${esc(v.title)}</h3><p>${esc(v.text)}</p><p class="fine">${esc(v.src)}</p>`;
  let h = `<div class="reck"><p class="tag">Without Any Action · the reckoning</p><h2>Four versions of June 1942</h2>`;

  // your game
  h += `<h3>Your game</h3><ul>`;
  if (A) h += `<li>Amagansett: the FBI knew by ${E.hhmm(o.ama ? o.ama.fbiAt : A.fbiAt || 150)}${A.dec.search === "road" ? (A.seenTrain ? "; your men saw the four board the train" : "; your men watched the road and the station, and saw nothing") : ""}${A.dec.finds === "keep" ? "; the Coast Guard kept some pieces for itself" : ""}. Historically the FBI heard after 02:30, from the Army [S].</li>`;
  if (P) h += `<li>Ponte Vedra: ${P.seen ? `${esc(P.seen.who)} reported ${esc(P.seen.what)} (game event)` : "nobody saw anything"}. Historically nobody did.</li>`;
  if (C) { const s = o.call || E.callSummary(C); h += `<li>The call of 14 June: ${esc({ file: "recorded for the file", wire: "recorded and wired to Washington", come: "you asked him to come in" }[s.call])}. In custody by the end of your Call: ${s.held.length} of 8${s.boxesDay != null ? `; the Florida boxes found on ${esc(E.dateOf(D.DAY0, s.boxesDay))}` : ""}. Historically all eight by 27 June, the boxes on 25 June [S].</li>`; }
  if (K) h += `<li>The announcement: ${esc({ cover: "the agreed story – 'we picked up Dasch'", forward: "one of them came forward, unnamed", full: "the whole story, the call included" }[K.dec.announce] || "–")}; the Coast Guard: ${esc({ precaution: "'intensified precautions'", cullen: "the patrolman named", nothing: "not mentioned" }[K.dec.coast] || "–")}; for the two: ${esc({ both: "you asked mercy for both", dasch: "you asked mercy for Dasch", none: "you left it to the commission" }[K.dec.lenient] || "–")}. The public story stood ${K.truth >= 60 ? "close to" : K.truth >= 35 ? "some way from" : "far from"} the record (game value).</li>`;
  h += `</ul>`;

  // the four versions
  h += ver(V.fbi) + ver(V.record) + ver(V.coast) + ver(V.beach);

  // the record that is never a move
  h += `<h3>The fixed record</h3><p>${D.END_RECORD.map(esc).join(" ")}</p><p class="fine">${esc(D.END_SRC)}</p>`;
  h += `<h3>After</h3><ul>${D.AFTER.map(a => `<li>${esc(a.t1)} <span class="fine">(${esc(a.src)})</span></li>`).join("")}</ul>`;
  h += `<p class="fine">Marks: [S] read at the page image, [O] only in a text layer, [L] later literature. The FBI's headquarters file on the case (with Jacksonville and Chicago) was not read for this game; how the Florida men were found, the transcript does not say. Everything not marked is a game value.</p></div>`;
  return h;
};
