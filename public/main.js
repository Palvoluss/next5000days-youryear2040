// MAIN SCREEN — stato via websocket + particelle (Canvas 2D) + transizioni GSAP
// + interludio "giorni nel futuro" tra un capitolo e l'altro.
const socket = io({ query: { role: "main" } });
const OCHRE = "#ecae31", TERRA = "#e18e74", WHITE = "rgba(255,255,255,0.82)";
const $ = (id) => document.getElementById(id);
const G = window.gsap;
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

$("qr").src = "/qr?data=" + encodeURIComponent(location.origin + "/?role=device");

// ==========================================================================
// PARTICELLE — idle: wander libero su tutto lo schermo; voto: orbita sul polo
// ==========================================================================
const canvas = $("fx"), ctx = canvas.getContext("2d");
const particles = new Map();
let poles = { facile: null, difficile: null };
// il canvas copre l'INTERO documento (scrolla coi contenuti), non il viewport
function sizeCanvas() {
  const w = document.documentElement.clientWidth;
  const h = Math.max(innerHeight, document.documentElement.scrollHeight);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
}
addEventListener("resize", sizeCanvas); sizeCanvas();

function spawn() {
  const a = Math.random() * Math.PI * 2, s = 0.4 + Math.random() * 0.5;
  return {
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    vx: Math.cos(a) * s, vy: Math.sin(a) * s, target: null, spin: Math.random() < 0.5 ? -1 : 1, color: WHITE, r: 4 + Math.random() * 2
  };
}
function ensure(cid) { if (!particles.has(cid)) particles.set(cid, spawn()); }
function reconcile(cids) {
  const set = new Set(cids);
  for (const cid of particles.keys()) if (!set.has(cid)) particles.delete(cid);
  cids.forEach(ensure);
}
// Il colore non dice quale strada è la comoda: sui capitoli pari i due colori
// si scambiano, come i box (main.html, #game.scambia).
const scambia = (s) => !!(s && s.chapter && s.chapter.n % 2 === 0);
const coloreDi = (tag) => (tag === "facile") !== scambia(latest) ? TERRA : OCHRE;
function setOrbit(p, tag) { p.target = tag; p.spin = Math.random() < 0.5 ? -1 : 1; p.color = coloreDi(tag); }
function clearOrbits() { for (const p of particles.values()) { p.target = null; p.color = WHITE; const a = Math.random() * Math.PI * 2; p.vx = Math.cos(a) * 0.5; p.vy = Math.sin(a) * 0.5; } }
function polePos() {
  const votingVisible = !$("voteArea").classList.contains("hidden") && !$("game").classList.contains("hidden");
  if (votingVisible) {
    // coordinate-documento (il canvas parte da top:0): aggiungo lo scroll
    const r = (el) => { const b = el.getBoundingClientRect(); return { x: b.left + b.width / 2 + scrollX, y: b.top + b.height / 2 + scrollY }; };
    poles.facile = r($("poleFacile")); poles.difficile = r($("poleDifficile"));
  } else { poles.facile = null; poles.difficile = null; }
}
// --- BOIDS idle: lento e un po' caotico -----------------------------------
// Reynolds (separazione + allineamento + coesione) + wander casuale. O(n²);
// ponytail: naive va bene fino a qualche centinaio di particelle.
// Velocità dei pallini, in idle e nel voto insieme. Da tarare sul ledwall vero.
const SPEED = 1.5;
const NEIGHBOR = 82, SEP_DIST = 30, MAXSPEED = 1.15 * SPEED, MAXFORCE = 0.035 * SPEED;
const W_SEP = 1.7, W_ALIGN = 0.55, W_COH = 0.5, WANDER = 0.09;
function steer(p, dx, dy) {
  const m = Math.hypot(dx, dy); if (m === 0) return [0, 0];
  let sx = dx / m * MAXSPEED - p.vx, sy = dy / m * MAXSPEED - p.vy;
  const sm = Math.hypot(sx, sy); if (sm > MAXFORCE) { sx = sx / sm * MAXFORCE; sy = sy / sm * MAXFORCE; }
  return [sx, sy];
}
function flock(p, list) {
  let alx = 0, aly = 0, cox = 0, coy = 0, sepx = 0, sepy = 0, n = 0, ns = 0;
  for (const q of list) {
    if (q === p || q.target) continue;
    const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
    if (d > 0 && d < NEIGHBOR) {
      alx += q.vx; aly += q.vy; cox += q.x; coy += q.y; n++;
      if (d < SEP_DIST) { sepx += dx / d; sepy += dy / d; ns++; }
    }
  }
  let ax = (Math.random() - 0.5) * WANDER, ay = (Math.random() - 0.5) * WANDER;   // caos
  if (ns > 0) { const [x, y] = steer(p, sepx / ns, sepy / ns); ax += x * W_SEP; ay += y * W_SEP; }
  if (n > 0) {
    const [x1, y1] = steer(p, alx / n, aly / n); ax += x1 * W_ALIGN; ay += y1 * W_ALIGN;
    const [x2, y2] = steer(p, cox / n - p.x, coy / n - p.y); ax += x2 * W_COH; ay += y2 * W_COH;
  }
  const m = 80;                          // rientro morbido dai bordi
  if (p.x < m) ax += 0.04; else if (p.x > canvas.width - m) ax -= 0.04;
  if (p.y < m) ay += 0.04; else if (p.y > canvas.height - m) ay -= 0.04;
  p.vx += ax; p.vy += ay;
  const sp = Math.hypot(p.vx, p.vy);
  if (sp > MAXSPEED) { p.vx = p.vx / sp * MAXSPEED; p.vy = p.vy / sp * MAXSPEED; }
  p.x += p.vx; p.y += p.vy;
  if (p.x < 0) { p.x = 0; p.vx *= -0.6; } else if (p.x > canvas.width) { p.x = canvas.width; p.vx *= -0.6; }
  if (p.y < 0) { p.y = 0; p.vy *= -0.6; } else if (p.y > canvas.height) { p.y = canvas.height; p.vy *= -0.6; }
}

// --- voto: pozzo di gravità (attrazione + vortice + separazione) ----------
const GRAV = 0.34 * SPEED, SWIRL = 0.22 * SPEED, VOTE_SEP = 26, VOTE_MAX = 2.6 * SPEED, VOTE_DAMP = 0.9;
function swarm(p, c, list) {
  const dx = c.x - p.x, dy = c.y - p.y, d = Math.hypot(dx, dy) || 1;
  let ax = (dx / d) * GRAV, ay = (dy / d) * GRAV;                     // gravità verso il centro
  ax += (-dy / d) * SWIRL * p.spin; ay += (dx / d) * SWIRL * p.spin;  // vortice attorno al centro
  for (const q of list) {                                            // separazione: niente collasso in un punto
    if (q === p || !q.target) continue;
    const sx = p.x - q.x, sy = p.y - q.y, sd = Math.hypot(sx, sy);
    if (sd > 0 && sd < VOTE_SEP) { ax += sx / sd * 0.3; ay += sy / sd * 0.3; }
  }
  p.vx = (p.vx + ax) * VOTE_DAMP; p.vy = (p.vy + ay) * VOTE_DAMP;
  const sp = Math.hypot(p.vx, p.vy); if (sp > VOTE_MAX) { p.vx = p.vx / sp * VOTE_MAX; p.vy = p.vy / sp * VOTE_MAX; }
  p.x += p.vx; p.y += p.vy;
}
function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const list = [...particles.values()];
  for (const p of list) {
    const targeting = p.target && poles[p.target];
    if (targeting) swarm(p, poles[p.target], list);
    else flock(p, list);
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
    ctx.fillStyle = p.color; ctx.shadowBlur = targeting ? 18 : 9; ctx.shadowColor = p.color;
    ctx.fill(); ctx.shadowBlur = 0;
  }
  requestAnimationFrame(frame);
}
frame();

// ==========================================================================
// HELPER contenuti + interludio giorni
// ==========================================================================
function beatHTML(b) {
  if (typeof b === "string") return `<p class="beat">${b}</p>`;
  if (b.sig) return `<p class="signal">${b.sig}</p>`;
  if (b.counter) return `<div class="counter" data-to="${b.counter.to}" data-unit="${b.counter.unit || ""}">0<small>${b.counter.label}</small></div>`;
  if (b.heatgrid) { const h = b.heatgrid;
    return `<figure class="heatgrid" data-hot="${h.hot}" aria-label="${h.hot} ${h.label}">`
      + `<div class="hg-cal">${heatCells(h.from, h.days, h.hot)}</div>`
      + `<figcaption><b class="hg-count">0</b> ${h.label}</figcaption></figure>`;
  }
  return VIZ.html(b);   // i dati animati dei capitoli dal 2 in poi (viz.js)
}
// Calendario del caldo: una RIGA per mese (etichettata), una COLONNA per giorno 1–31.
// I giorni caldi sono addensati a metà stagione (fine luglio) con qualche tregua: look di ondata.
// ponytail: distribuzione illustrativa deterministica, non dati reali.
const MONTHS_IT = ["gen", "feb", "mar", "apr", "mag", "giu", "lug", "ago", "set", "ott", "nov", "dic"];
function heatCells(fromISO, days, hot) {
  const center = days * 0.52;                                                    // picco: fine luglio
  const order = [...Array(days).keys()].sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
  const hotSet = new Set();
  for (const i of order) { if (hotSet.size >= hot) break; if (i % 9 === 3) continue; hotSet.add(i); } // qualche tregua
  for (const i of order) { if (hotSet.size >= hot) break; hotSet.add(i); }                            // completa a quota
  const d = new Date(fromISO), end = new Date(fromISO); end.setDate(end.getDate() + days);
  let html = "", idx = 0;
  while (d < end) {                                                              // una riga per mese
    const m = d.getMonth(), y = d.getFullYear(), inMonth = new Date(y, m + 1, 0).getDate();
    html += `<span class="hg-mon">${MONTHS_IT[m]}</span>`;
    for (let dm = 1; dm <= 31; dm++) {                                           // 31 colonne fisse
      if (dm <= inMonth && d < end && d.getDate() === dm) {
        html += `<i class="hg-cell${hotSet.has(idx) ? " hot" : ""}"></i>`;
        idx++; d.setDate(d.getDate() + 1);
      } else html += `<i class="hg-pad"></i>`;                                   // giorno inesistente o fuori range
    }
  }
  return html;
}
function runHeatGrid(fig) {
  fig.classList.add("on");
  const cells = fig.querySelectorAll(".hg-cell"), hot = fig.querySelectorAll(".hg-cell.hot");
  const countEl = fig.querySelector(".hg-count"), target = +fig.dataset.hot;
  if (REDUCED || !G) { hot.forEach(c => c.classList.add("on")); countEl.textContent = fmtNum(target); return; }
  const dur = hot.length * 0.02 + 0.3, o = { n: 0 };
  G.timeline()
    .from(cells, { opacity: 0, scale: 0.3, transformOrigin: "50% 50%", duration: 0.25, ease: "power1.out", stagger: { each: 0.01, from: "start" } })
    .to(hot, { backgroundColor: "#e18e74", boxShadow: "0 0 8px #e18e74", duration: 0.3, ease: "power1.out", stagger: { each: 0.02, from: "start" } }) // il rosso si accende in ordine cronologico
    .to(o, { n: target, duration: dur, ease: "none", onUpdate: () => countEl.textContent = fmtNum(o.n) }, "<"); // il contatore sale in sincrono
}
// Un esito risolto. La classe dice il segno: la terza via non ne ha uno.
const SEGNO = { NEGATIVO: "neg", POSITIVO: "pos", TERZA_VIA_PENTIMENTO: "terza", TERZA_VIA_RESA: "terza" };
function esitiHTML(list) {
  return list.length ? list.map(e =>
    `<div class="fired ${SEGNO[e.stato]}"><span class="nome">${e.nome}</span>${e.testo}</div>`).join("")
    : `<div class="muted" style="font-size:0.85rem">Niente si è ancora saldato. Gli eventi si sommeranno.</div>`;
}
function runCounters() {
  document.querySelectorAll("#chBody .counter").forEach(el => {
    const to = +el.dataset.to, unit = el.dataset.unit || "";
    if (REDUCED || !G) { el.childNodes[0].nodeValue = to.toLocaleString("it-IT") + unit; return; }
    const o = { n: 0 };
    G.to(o, { n: to, duration: 1.4, ease: "power2.out", onUpdate: () => { el.childNodes[0].nodeValue = Math.round(o.n).toLocaleString("it-IT") + unit; } });
  });
  figureInAttesa = [...$("chBody").querySelectorAll(".heatgrid, [data-viz]")];
}
// Le figure partono quando sono ben dentro lo schermo: con la voce il testo
// sale piano, e una figura che parte appena affiora si anima mezza fuori.
// Via quando il suo centro supera FIGURA_VIA dell'altezza, o a fondo pagina.
const FIGURA_VIA = 0.55;   // più basso = parte più tardi
let figureInAttesa = [];
function partiFigure() {
  if (!figureInAttesa.length || $("game").classList.contains("hidden")) return;
  const inFondo = scrollY >= document.documentElement.scrollHeight - innerHeight - 2;
  figureInAttesa = figureInAttesa.filter(f => {
    const r = f.getBoundingClientRect();
    const via = r.height > 0 && ((r.top + r.bottom) / 2 <= innerHeight * FIGURA_VIA || (inFondo && r.bottom <= innerHeight));
    if (via) f.matches(".heatgrid") ? runHeatGrid(f) : VIZ.run(f);
    return !via;
  });
}
const fmtNum = (n) => Math.round(n).toLocaleString("it-IT");
const fmtDate = (iso) => new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

// --- timeline scrollabile ------------------------------------------------
const PPD = 4;              // pixel per giorno (spaziatura del nastro)
const START_HOLD = 0.55;    // pausa sul punto di partenza (fa vedere lo 0)
const SCROLL_DUR = 2.4;     // durata dello scorrimento
const WHEEL_SCALE = 4.2;    // quanto la wheel è più grande del titolo a riposo (calibrabile)
const REST_SCALE = 1 / WHEEL_SCALE;   // il titolo è la wheel rimpicciolita (downscale = nitido)
const WHEEL_CY = 0.42;      // centro verticale della wheel, in frazione di viewport
let trackBuilt = false, titleShown = false;
function buildTrack(startISO, endDays) {
  if (trackBuilt) return;
  const track = $("iTrack"); const start = new Date(startISO);
  const span = isFinite(endDays) ? endDays : 4500;
  let d = new Date(start.getFullYear(), start.getMonth(), 1), html = "", guard = 0;
  while (guard++ < 4000) {                        // una tacca al mese, etichetta a gennaio
    const off = Math.round((d - start) / 86400000);
    if (off > span + 60) break;
    if (off >= -31) {
      const isYear = d.getMonth() === 0;
      html += `<div class="tick${isYear ? " year" : ""}" style="left:${off * PPD}px">${isYear ? `<span class="lab">${d.getFullYear()}</span>` : ""}</div>`;
    }
    d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  }
  track.innerHTML = html; trackBuilt = true;
}

// Un solo elemento (#iReadout) fa da titolo persistente in alto e, al cambio
// capitolo, cresce al centro come "wheel", conta i giorni, e torna titolo.
// È lo STESSO elemento che scala → titolo e wheel hanno sempre proporzioni
// coerenti, nessuno scambio, nessuno scatto di dimensioni.
function playInterstitial(fromDays, toDays, dateISO, startISO, endISO) {
  const valid = dateISO && !isNaN(new Date(dateISO)) && isFinite(fromDays) && isFinite(toDays);
  if (!valid) return Promise.resolve();
  buildTrack(startISO, daysBetween(startISO, endISO));
  const readout = $("iReadout"), track = $("iTrack"), daysEl = $("iDays"), dateEl = $("iDate");
  const startMs = new Date(startISO).getTime();
  const setAt = (day) => {
    track.style.transform = `translateX(${-day * PPD}px)`;        // scorre il nastro
    daysEl.textContent = fmtNum(day);
    dateEl.textContent = fmtDate(new Date(startMs + Math.round(day) * 86400000));
  };
  // stato TITOLO = wheel rimpicciolita in alto; stato WHEEL = scala 1 (nativa, nitida) al centro.
  const restY = (r) => r.height * REST_SCALE / 2 - r.height / 2;   // il titolo (ridotto) si ancora a top:14px
  const wheelY = (r) => innerHeight * WHEEL_CY - (r.top + r.height / 2);
  if (REDUCED || !G) {
    setAt(toDays);
    const r = readout.getBoundingClientRect();
    readout.style.transform = `translateY(${restY(r)}px) scale(${REST_SCALE})`;
    readout.style.opacity = 1; titleShown = true; return Promise.resolve();
  }
  return new Promise((resolve) => {
    const genesis = !titleShown;                                   // 1° capitolo: nessun titolo precedente, la wheel nasce
    G.set(readout, { clearProps: "transform" });                   // torna a dimensione nativa (wheel) per misurarla
    setAt(fromDays);                                               // il titolo mostra GIÀ i giorni di partenza → nessun numero che salta
    const r = readout.getBoundingClientRect();
    const tY = restY(r), wY = wheelY(r);
    const proxy = { d: fromDays };
    G.set(readout, { x: 0, y: tY, scale: REST_SCALE, opacity: genesis ? 0 : 1 });   // parte come titolo (o nasce, se genesis)
    G.timeline({ onComplete: () => { titleShown = true; resolve(); } })
      // TITOLO → WHEEL: cresce al centro (fino a scala 1 = nitida); sfondo e timeline compaiono insieme
      .to("#iBg", { opacity: 1, duration: 0.7, ease: "power2.out" }, 0)
      .to(readout, { opacity: 1, y: wY, scale: 1, duration: 0.9, ease: "power3.inOut" }, 0)
      .to("#iTimeline", { opacity: 1, duration: 0.6, ease: "power2.out" }, genesis ? 0.35 : 0.2)
      .to({}, { duration: genesis ? START_HOLD + 0.4 : START_HOLD })
      // CONTEGGIO: la timeline scorre e il numero sale da fromDays a toDays
      .to(proxy, { d: toDays, duration: SCROLL_DUR, ease: "power2.inOut", onUpdate: () => setAt(proxy.d) })
      .to({}, { duration: 0.4 })                                   // stop sul target
      // WHEEL → TITOLO: torna piccola in alto; sfondo e timeline svaniscono insieme
      .to(readout, { y: tY, scale: REST_SCALE, duration: 0.9, ease: "power3.inOut" })
      .to("#iBg", { opacity: 0, duration: 0.6, ease: "power2.in" }, "<")
      .to("#iTimeline", { opacity: 0, duration: 0.5, ease: "power2.in" }, "<");
  });
}

// ==========================================================================
// RENDER capitolo / voto / finale
// ==========================================================================
function fillChapter(s) {
  VIZ.stop();                        // i loop del capitolo precedente non girano per tutta la serata
  $("chYear").textContent = s.chapter.anno;
  $("chTitle").textContent = s.chapter.titolo;
  let html = (s.chapter.beats || []).map(beatHTML).join("");
  // capitolo 12: la variante che dipende da I5 · capitolo 13: il verdetto sull'Indice
  if (s.chapter.oracolo) html += `<p class="signal">${s.chapter.oracolo}</p>`;
  if (s.chapter.ruolo === "climax" && s.climax) html += `<p class="signal">${s.climax.testo}</p>`;
  html += scenarioHTML(s);           // solo al capitolo 14: è quello che compone
  $("chBody").innerHTML = html;
}
function animateChapterIn(s) {
  fillChapter(s);
  if (REDUCED || !G) { runCounters(); return; }
  G.set("#col", { opacity: 1 });
  G.timeline()
    .from("#chYear", { opacity: 0, y: 24, duration: 0.5, ease: "power3.out" })
    .from("#chTitle", { opacity: 0, y: 48, duration: 0.7, ease: "power4.out" }, "-=0.35")
    .from("#chBody > *", { opacity: 0, y: 28, stagger: 0.1, duration: 0.6, ease: "power2.out" }, "-=0.4")
    .add(runCounters, "-=0.2");
}
function animateVoteIn() {
  if (REDUCED || !G) return;
  G.from("#voteQ", { opacity: 0, y: 20, duration: 0.5, ease: "power3.out" });
  // box risposta STATICI: nessuna animazione d'ingresso. Solo i numeri pulsano (vedi main:tally).
}

// SCENARIO GLOBALE — sei esiti raggruppati per cosa hanno fatto al mondo, più
// l'Indice e il climax. Un solo renderer: lo usa il capitolo 14, che compone, e
// la schermata finale, così resta consultabile dopo (§7).
function scenarioHTML(s) {
  if (!s.scenario) return "";
  return `<div class="scenario">
    <div class="year">Il mondo che avete costruito</div>
    <div class="chiusura ${s.climax.esito === "PERSA" ? "neg" : "pos"}">
      <span class="nome">${s.climax.nome}</span>${s.climax.testo}
    </div>
    <div class="indice"><b>${s.indice == null ? "—" : s.indice + "%"}</b> di delega${s.banda ? ` · banda ${s.banda}` : ""}</div>
    ${s.scenario.map(g => `<section class="gruppo ${g.chiave}">
      <h3>${g.titolo}<span class="conta">${g.esiti.length}</span></h3>
      ${esitiHTML(g.esiti)}
    </section>`).join("")}
  </div>`;
}

// Timer del voto. Il server manda i ms che restano, non un istante assoluto:
// il countdown parte da quando arriva il messaggio, così l'orologio del browser
// fuori sincrono non sposta niente.
let voteTl = null, secTimer = null;
function runVoteTimer(restaMs, durataSec) {
  if (voteTl) { voteTl.kill(); voteTl = null; }
  clearInterval(secTimer); secTimer = null;
  const bar = $("voteFill"), row = bar.closest(".voterow");
  if (!restaMs || !durataSec) { row.style.display = "none"; return; }
  row.style.display = "";
  const fine = Date.now() + restaMs;
  const conta = () => {
    const resta = Math.max(0, fine - Date.now());
    $("voteSec").textContent = Math.ceil(resta / 1000);
    if (!resta) clearInterval(secTimer);
  };
  conta(); secTimer = setInterval(conta, 250);
  const frazione = Math.min(1, restaMs / (durataSec * 1000));   // chi entra a metà vede la barra già scesa
  if (REDUCED || !G) { bar.style.transform = `scaleX(${frazione})`; return; }
  G.set(bar, { scaleX: frazione });
  voteTl = G.to(bar, { scaleX: 0, duration: restaMs / 1000, ease: "none" });
}

// La mezza figura: identica sempre, e non riceve nemmeno il dato per essere
// diversa. Vedi il commento in main.html.
const PARZIALE_HTML = `<div class="parziale">
  <div class="redacted">${[7, 4, 9, 5, 6].map(w => `<i style="width:${w * 0.7}em"></i>`).join("")}</div>
  <div class="half"><i></i></div>
  <p>Qualcosa ha cominciato a formarsi. Si vedrà più avanti.</p>
</div>`;

// L'intreccio appena saldato: le due scelte della sala che l'hanno prodotto,
// due fili che le annodano, e l'esito che si apre dal nodo.
function intreccioHTML(e) {
  const dec = (d, lato) => `<div class="dec ${lato}"><span class="year">${d.anno} · ${d.titolo}</span>${d.label}</div>`;
  return `<div class="intreccio">
    <div class="decisioni">${dec(e.decisioni[0], "sx")}${dec(e.decisioni[1], "dx")}</div>
    <svg class="fili" viewBox="0 0 100 6" aria-hidden="true">
      <path pathLength="1" d="M25 0 C25 4 50 2 50 6"/><path pathLength="1" d="M75 0 C75 4 50 2 50 6"/>
    </svg>
    ${esitiHTML([e])}
  </div>`;
}

// La rivelazione: la sala vede cosa ha scelto e, se il capitolo chiudeva un
// intreccio, l'esito col nome che il narratore annuncia.
let revealShown = false;
function renderReveal(r) {
  $("revLabel").textContent = r.winner === "facile" ? "La sala ha scelto la comodità" : "La sala ha scelto la fatica";
  $("revChoice").textContent = r.label;
  $("revF").textContent = r.facile;
  $("revD").textContent = r.difficile;
  $("revCosto").textContent = r.costo;
  // riscritto solo al primo giro: un sync a metà animazione la spezzerebbe
  if (!revealShown) $("revEsito").innerHTML = r.esito ? intreccioHTML(r.esito) : r.parziale ? PARZIALE_HTML : "";
  if (revealShown || REDUCED || !G) return;
  revealShown = true;
  const tl = G.timeline()
    .from("#revLabel, #revChoice, .revtally, #revCosto", { opacity: 0, y: 20, stagger: 0.12, duration: 0.5, ease: "power3.out" });
  // l'esito arriva dopo una pausa piena: è il momento in cui il narratore parla
  if (r.esito) tl.addLabel("nodo", "+=0.8")
    .from("#revEsito .dec.sx", { opacity: 0, x: -160, duration: 0.8, ease: "power3.out" }, "nodo")
    .from("#revEsito .dec.dx", { opacity: 0, x: 160, duration: 0.8, ease: "power3.out" }, "nodo")
    .fromTo("#revEsito .fili path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, "-=0.2")
    .from("#revEsito .fired", { opacity: 0, scale: 0.85, y: -20, transformOrigin: "50% 0%", duration: 0.9, ease: "back.out(1.4)" }, "-=0.15");
  // la mezza figura entra piano e la barra si ferma a metà: sta arrivando, non è arrivata
  if (r.parziale) tl.from("#revEsito .parziale", { opacity: 0, duration: 1.1, ease: "power2.out" }, "+=0.5")
    .from("#revEsito .parziale .half > i", { scaleX: 0, transformOrigin: "left center", duration: 1.2, ease: "power2.inOut" }, "-=0.5");
}

let bodyIndex = -1, voteShown = false;
function renderBody(s) {
  $("game").classList.toggle("scambia", scambia(s));
  if (bodyIndex !== s.index) { window.scrollTo({ top: 0 }); animateChapterIn(s); bodyIndex = s.index; voteShown = false; revealShown = false; }  // nuovo capitolo → torna in cima
  narra(s);
  if (s.registro != null) return renderRegistro(s);   // #game è nascosto: c'è il registro
  const voting = s.phase === "voting" && s.options;
  const revealing = s.phase === "revealing" && s.reveal;
  $("revealArea").classList.toggle("hidden", !revealing);
  if (revealing) {
    renderReveal(s.reveal);
    clearOrbits();                       // il voto è chiuso: le particelle si sciolgono
    runVoteTimer(null);
    $("voteArea").classList.add("hidden");
    $("revealArea").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  $("voteArea").classList.toggle("hidden", !voting);
  revealShown = false;                   // se il regista riapre il voto, l'esito si rigioca
  if (voting) {
    $("voteQ").textContent = s.options.q;
    const fill = (id, o) => {
      const el = $(id);
      el.querySelector(".opt").textContent = o ? o.label : "";
      el.querySelector(".gain").innerHTML = o ? `<b>Cosa guadagni</b>${o.guadagno}` : "";
      el.querySelector(".cost").innerHTML = o ? `<b>Cosa paghi</b>${o.costo_nascosto}` : "";
    };
    fill("poleFacile", s.options.opts.find(o => o.tag === "facile"));
    fill("poleDifficile", s.options.opts.find(o => o.tag === "difficile"));
    showTally(s.tally, false);
    $("poleFacile").classList.remove("win"); $("poleDifficile").classList.remove("win");
    if (!voteShown) {
      voteShown = true; clearOrbits();
      runVoteTimer(s.voteRestaMs, s.voteDurata);
      setTimeout(() => { polePos(); animateVoteIn(); $("voteArea").scrollIntoView({ behavior: "smooth", block: "center" }); }, 30);
    }
  } else { voteShown = false; clearOrbits(); runVoteTimer(null); }
  polePos();
}
// La schermata finale è lo STESSO scenario del capitolo 14: resta lì, e resta
// consultabile. Non è una seconda composizione, è la stessa che non se ne va.
function renderEnded(s) {
  $("endedScenario").innerHTML = scenarioHTML(s);
  if (s.consensus) $("consensus").textContent = `${s.consensus.same} in linea con la sala · ${s.consensus.diverge} su un'altra strada`;
  $("aggregates").innerHTML = (s.aggregates || []).map(a => `<div class="agg"><span>${a.anno} · ${a.titolo}</span><b>${a.winner}</b></div>`).join("");
  if (G && !REDUCED) G.timeline()
    .from("#endedScenario .chiusura", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" })
    .from("#endedScenario .gruppo", { opacity: 0, y: 24, stagger: 0.18, duration: 0.6, ease: "power3.out" }, "+=0.3")
    .from("#aggregates .agg", { opacity: 0, x: 20, stagger: 0.05, duration: 0.4 }, "-=0.4");
}

// ==========================================================================
// SLIDE — intro e registro. Palco 1920×1080 scalato a schermo, centrato.
// ==========================================================================
function fitStages() {
  const k = Math.min(innerWidth / 1920, innerHeight / 1080);
  const t = `translate(${(innerWidth - 1920 * k) / 2}px,${(innerHeight - 1080 * k) / 2}px) scale(${k})`;
  document.querySelectorAll(".stage").forEach(el => el.style.transform = t);
}
addEventListener("resize", fitStages); fitStages();
// Panchang è larga: un titolo lungo si stringe finché non entra in riga.
// Misura solo quello che è visibile; si rifà quando arrivano i font.
function fitText() {
  document.querySelectorAll(".slide:not(.hidden) .fit").forEach(el => {
    el.style.fontSize = "";
    let px = parseFloat(getComputedStyle(el).fontSize);
    while (el.scrollWidth > el.clientWidth + 1 && px > 22) el.style.fontSize = (px -= 2) + "px";
  });
}
document.fonts?.ready.then(fitText);
// le regole e il programma: tutto ciò che ha data-step ≤ passo è acceso
const accendi = (root, passo) => root.querySelectorAll("[data-step]").forEach(el => el.classList.toggle("on", +el.dataset.step <= passo));

const TELEFONO = `<svg width="20" height="30" viewBox="0 0 20 30"><rect x="1.5" y="1.5" width="17" height="27" rx="3.5"/><line x1="8" y1="24.5" x2="12" y2="24.5"/></svg>`;
document.querySelectorAll(".phones[data-n]").forEach(el => el.innerHTML = TELEFONO.repeat(+el.dataset.n));

// intro: 0 = speaker, 1..7 = manuale al passo 0..6 (6 = programma)
function renderIntro(i) {
  $("sSpeaker").classList.toggle("hidden", i !== 0);
  $("sRegole").classList.toggle("hidden", i === 0);
  accendi($("sRegole"), i - 1);
  $("sRegole").classList.toggle("prog", i - 1 >= 6);
  fitText();
}

// --- registro: le grafiche, una per tipo di dato (server/content.js) ------
// Testi e dati vengono da content.js, cioè da noi: entrano come HTML.
const ritardo = (ms) => `style="transition-delay:${ms}ms"`;
const ICONA = {
  person: `<svg width="44" height="66" viewBox="0 0 24 36"><circle cx="12" cy="7" r="6.5"/><path d="M1 36c0-11 4.5-16 11-16s11 5 11 16z"/></svg>`,
  note: `<svg width="96" height="96" viewBox="0 0 24 24"><path d="M9 3v11.6A4 4 0 1 0 11 18V8h8V3z"/></svg>`,
  bldg: `<svg width="58" height="72" viewBox="0 0 24 30" fill-rule="evenodd"><path d="M2 30V3h13v7h7v20zM5 6h3v3H5zm5 0h3v3h-3zM5 12h3v3H5zm5 0h3v3h-3zm7 1h3v3h-3zM5 18h3v3H5zm5 0h3v3h-3zm7 1h3v3h-3zM9 24h5v6H9z"/></svg>`,
  doc: `<svg width="40" height="52" viewBox="0 0 20 26" fill-rule="evenodd"><path d="M0 0h13l7 7v19H0zM4 11h12v2H4zm0 5h12v2H4zm0 5h8v2H4z"/></svg>`,
  dev: `<svg width="80" height="80" viewBox="0 0 24 24" fill-rule="evenodd"><path d="M4 4h16v16H4zM8 8h8v8H8zM1 7h3v2H1zm0 4h3v2H1zm0 4h3v2H1zm19-8h3v2h-3zm0 4h3v2h-3zm0 4h3v2h-3zM7 1h2v3H7zm4 0h2v3h-2zm4 0h2v3h-2zM7 20h2v3H7zm4 0h2v3h-2zm4 0h2v3h-2z"/></svg>`,
  batt: `<i class="bt"></i>`
};
// Italia, contorno semplificato (lat, lon), e la proiezione delle slide d'esempio
const ITALIA = [
  [[43.79,7.53],[44.41,8.93],[44.10,9.82],[43.55,10.31],[42.93,10.50],[42.09,11.80],[41.45,12.62],[41.21,13.57],[40.84,14.25],[40.68,14.77],[40.07,15.63],[38.68,15.90],[38.11,15.65],[37.92,16.06],[39.08,17.13],[39.75,16.45],[40.47,17.24],[40.06,17.98],[39.80,18.36],[40.15,18.49],[40.63,17.94],[41.12,16.87],[41.63,15.92],[41.88,16.18],[42.00,14.99],[42.46,14.21],[43.62,13.52],[44.06,12.57],[44.42,12.20],[45.22,12.28],[45.44,12.33],[45.65,13.78],[46.50,13.58],[47.00,11.50],[46.83,10.50],[46.47,10.37],[45.83,9.03],[45.93,7.87],[45.83,6.86],[45.25,6.90],[44.42,6.89]],
  [[38.19,15.55],[37.50,15.09],[37.07,15.29],[36.69,15.13],[37.07,14.25],[37.80,12.44],[38.02,12.51],[38.12,13.36],[38.04,14.02],[38.22,15.24]],
  [[41.24,9.19],[40.92,9.50],[39.94,9.70],[39.14,9.52],[39.22,9.11],[38.87,8.64],[39.90,8.53],[40.56,8.31],[40.94,8.23],[40.91,8.71]]
];
const proj = (lat, lon) => [((lon - 6.5) * 0.743 * 44 + 120).toFixed(1), ((47.2 - lat) * 44).toFixed(1)];
// i dati che stanno meglio con il testo a sinistra e la grafica a destra
const AFFIANCATI = new Set(["waffle", "map", "toggle", "donut", "timer", "confirm", "choice", "feed"]);
const REG_VIS = {
  big: v => `<div class="num fit">${typeof v.num === "number" ? `<span data-count="${v.num}">0</span>` : v.num}</div>`,
  bars: v => `<div class="bars">${v.rows.map(r =>
    `<div class="bar${r.hi ? " hi" : ""}${r.neg ? " neg" : ""}${r.dash ? " dash" : ""}"><span>${r.l}${r.v ? ` · <b>${r.v}</b>` : ""}</span>`
    + `<div class="tr"><i data-w="${r.w}"></i></div></div>`).join("")}</div>`,
  vs: v => `<div class="vs${v.cols.length > 2 ? " tre" : ""}">${v.cols.map((c, i) =>
    `<div class="vc" ${ritardo(200 + i * 700)}><div class="vl">${c[0]}</div>`
    + `<div class="vv ${c[2]}">${c[2] === "up" ? "<em>↑</em>" : c[2] === "down" ? "<em>↓</em>" : ""}${c[1]}</div></div>`).join("")}</div>`,
  units: v => {
    const passo = v.n > 20 ? 28 : 160;
    let h = `<div class="units${v.n > 10 && v.n <= 30 ? " tight" : ""}">`;
    for (let i = 0; i < v.n; i++) h += `<span class="u${i < v.on ? " lit" : ""}" ${i < v.on ? ritardo(300 + i * passo) : ""}>${ICONA[v.icon]}</span>`;
    if (v.extra) h += `<div class="extra"><i class="bt"><em style="width:${v.extra.fill}"></em></i><span>${v.extra.label}</span></div>`;
    return h + `</div>`;
  },
  waffle: v => `<div class="waf${v.coral ? " coral" : ""}">${Array.from({ length: 100 }, (_, i) =>
    i < v.on ? `<i class="lit" ${ritardo(250 + i * 14)}></i>` : `<i></i>`).join("")}</div>`,
  timeline: v => `<div class="tl">${v.ev.map((e, i) =>
    `<div class="ev${i === v.ev.length - 1 ? " last" : ""}" style="width:${(100 / v.ev.length).toFixed(2)}%;transition-delay:${250 + i * 800}ms">`
    + `<div class="dot"></div><div class="when">${e[0]}</div><div class="what">${e[1]}</div></div>`).join("")}</div>`,
  flow: v => `<div class="flow">${v.steps.map((s, i) =>
    (i ? `<div class="ar" ${ritardo(i * 800)}>→</div>` : "")
    + `<div class="st${i === v.steps.length - 1 ? " last" : ""}" ${ritardo(200 + i * 800)}>${s}</div>`).join("")}</div>`,
  cards: v => `<div class="cards">${v.cards.map((c, i) =>
    `<div class="cd"><h6>${c[0]}</h6><p>${c[1]}</p><div class="stamp" ${ritardo(700 + i * 700)}>FALSO</div></div>`).join("")}</div>`,
  donut: v => {
    const C = (2 * Math.PI * 150).toFixed(1), off = (C * (1 - v.pct / 100)).toFixed(1);
    return `<svg class="donut" width="380" height="380" viewBox="0 0 380 380">`
      + `<circle cx="190" cy="190" r="150" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="46"/>`
      + `<circle class="arc" cx="190" cy="190" r="150" fill="none" stroke-width="46" stroke-dasharray="${C}" stroke-dashoffset="${C}" data-off="${off}" transform="rotate(-90 190 190)"/>`
      + `<text x="190" y="212" text-anchor="middle" font-size="64">${v.label}</text></svg>`;
  },
  timer: v => `<div class="timer"><div class="tt">${v.label}</div><div class="tr"><i data-w="100%"></i></div><div class="ts">${v.sub}</div></div>`,
  map: v => {
    const w = Math.round(12.1 * 0.743 * 44) + 230, h = Math.round(10.7 * 44);
    return `<svg class="map" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`
      + ITALIA.map(poly => `<polygon class="land" points="${poly.map(p => proj(p[0], p[1]).join(",")).join(" ")}"/>`).join("")
      + v.pts.map((p, i) => {
        const [x, y] = proj(p[1], p[2]).map(Number), voi = p[3] === "you", sx = p[4] === "l";
        return `<g class="pt${voi ? " you" : ""}" ${ritardo(300 + i * 260)}>`
          + (voi ? `<circle cx="${x}" cy="${y}" r="18" class="alone"/>` : "")
          + `<circle cx="${x}" cy="${y}" r="8"/>`
          + `<text x="${sx ? x - 26 : x + 26}" y="${y + 7 + (p[5] || 0)}" text-anchor="${sx ? "end" : "start"}">${p[0]}</text></g>`;
      }).join("") + `</svg>`;
  },
  toggle: v => {
    const p = ICONA.person.replace('width="44" height="66"', 'width="64" height="96"');
    return `<div class="tg"><div class="room">${[70, 230, 390].map(x => `<span class="pp" style="left:${x}px">${p}</span>`).join("")}</div>`
      + `<div class="sw"><span>${v.label}</span><span class="sw-r"><span class="state">OFF</span><span class="knobw"><i></i></span></span></div></div>`;
  },
  choice: v => `<div class="dlg"><div class="dt">${v.title}</div><div class="op a">${v.a}</div><div class="op b">${v.b}<small>${v.bs}</small></div></div>`,
  feed: v => {
    // gli stessi 93 riquadri tristi a ogni proiezione: sorteggio con seme fisso
    let seme = 3;
    const rnd = () => (seme = (seme * 9301 + 49297) % 233280) / 233280;
    const tristi = Array.from({ length: 100 }, (_, i) => i);
    for (let i = 0; i < 100 - v.sad; i++) tristi.splice(Math.floor(rnd() * tristi.length), 1);
    const set = new Set(tristi);
    return `<div class="feed">${Array.from({ length: 100 }, (_, i) =>
      `<i class="f${i % 5}${set.has(i) ? " sad" : ""}" ${set.has(i) ? ritardo(300 + i * 16) : ""}></i>`).join("")}</div>`;
  },
  confirm: v => `<div class="cf">${v.rows.map((r, i) =>
    `<div class="row ${r[1]}" ${ritardo(200 + i * 650)}><span>${r[0]}</span><em>${r[1] === "ask" ? "Confermato da te" : "Pagato in automatico"}</em></div>`).join("")}</div>`,
  day: v => {
    const tot = v.seg.reduce((a, s) => a + s[1], 0);
    return `<div class="giorno">${v.seg.map(s =>
      `<div class="sg${s[2] ? " hi" : ""}" style="width:${(s[1] / tot * 100).toFixed(1)}%"><div class="blk"></div><span>${s[0]}</span></div>`).join("")}</div>`;
  },
  lists: v => `<div class="lists">${v.lists.map((l, j) =>
    `<div class="${j ? "no" : "si"}"><h5>${l[0]}</h5><ul>${l[1].map(x => `<li>${x}</li>`).join("")}</ul></div>`).join("")}</div>`
};
function itemHTML(it, k) {
  const t = it.vis && it.vis.t, side = AFFIANCATI.has(t);
  const cls = `fitem${side ? " side" : ""}${t === "lists" ? " dense" : ""}${t ? "" : " stmt"}`;
  const src = it.src ? `<div class="src">${it.src}</div>` : "";
  const vis = t ? `<div class="vis">${REG_VIS[t](it.vis)}</div>` : "";
  const h = it.h ? `<p class="h">${it.h}</p>` : "", p = it.p ? `<p class="cp">${it.p}</p>` : "";
  const corpo = t === "big" ? REG_VIS.big(it.vis) + (it.p ? `<p class="bigp">${it.p}</p>` : "") + src
    : side ? `<div class="ct">${h}${p}${src}</div>${vis}`
    : h + vis + p + src;
  return `<div class="${cls}" data-item="${k + 1}">${corpo}</div>`;
}
function registroHTML(ch) {
  const r = ch.registro, primo = r.items.length + 1, due = r.pops.length === 2;
  // la locandina che manca lascia il titolo nel riquadro
  const pop = (p, k) => `<div class="f-pop" data-step="${primo + k}" style="left:${k * (due ? 620 : 415)}px${due ? ";width:560px" : ""}">`
    + `<div class="poster"><span>${p.t}</span><img src="/img/c${ch.n}-${"abc"[k]}.jpg" alt="" onerror="this.remove()"></div>`
    + `<div class="meta">${p.m}</div><h3>${p.t}</h3><p class="sum">${p.s}</p></div>`;
  return `<div class="stage">
    <div class="shead"><div class="year">${ch.anno}</div><h1 class="fit">${ch.titolo}</h1><p class="cap fit">${r.cap}</p></div>
    <div class="f-stage${r.noLog ? " full" : ""}">${r.items.map(itemHTML).join("")}
      ${r.pops.length ? `<div class="f-pops"><div class="ph">Il futuro immaginato</div>${r.pops.map(pop).join("")}</div>` : ""}
    </div>
    ${r.noLog ? "" : `<aside class="f-log"><h4>Cosa sappiamo oggi</h4>${r.items.map((it, k) => it.log
      ? `<div class="litem" data-log="${k + 1}"><b>${it.log[0]}</b><span>${it.log[1]}</span></div>` : "").join("")}</aside>`}
  </div>`;
}
// Il dato che diventa corrente parte: numero che sale, barre e cerchio che si
// riempiono (il resto si accende da CSS, sotto .cur).
function rivelaDato(el) {
  el.querySelectorAll("[data-count]").forEach(n => {
    const to = +n.dataset.count;
    if (REDUCED || !G) { n.textContent = fmtNum(to); return; }
    const o = { v: 0 };
    G.to(o, { v: to, duration: to > 1000 ? 1.6 : 1.1, ease: "power3.out", onUpdate: () => n.textContent = fmtNum(o.v) });
  });
  setTimeout(() => {
    el.querySelectorAll(".tr i").forEach(i => i.style.width = i.dataset.w);
    el.querySelectorAll(".donut .arc").forEach(a => a.style.strokeDashoffset = a.dataset.off);
  }, 60);
}
// passo 0 = solo la testata · 1..N = un dato alla volta · poi le locandine
let regIndex = -1;
function renderRegistro(s) {
  const box = $("registro"), r = s.chapter.registro, passo = s.registro;
  if (regIndex !== s.index) { box.innerHTML = registroHTML(s.chapter); regIndex = s.index; fitStages(); }
  fitText();
  box.querySelectorAll(".fitem").forEach(el => {
    const cur = +el.dataset.item === passo;
    if (cur && !el.classList.contains("cur")) rivelaDato(el);
    el.classList.toggle("cur", cur);
  });
  box.querySelectorAll("[data-log]").forEach(el => el.classList.toggle("on", passo > +el.dataset.log));
  accendi(box, passo);
  box.querySelector(".stage").classList.toggle("pop-phase", r.pops.length > 0 && passo > r.items.length);
}

// --- voce narrante: parte da sola col capitolo, e quando finisce il server
// apre il registro. La regia la mette in pausa o la fa ripartire, e vede se
// il browser l'ha bloccata. Il regista può aprire il registro prima: si ferma.
const voce = new Audio();
let voceN = null, voceBloccata = false;   // il capitolo che la voce ha già cominciato
const statoVoce = (stato) => socket.emit("main:voce", { n: voceN, stato });
voce.onplaying = () => { voceBloccata = false; yVoce = scrollY; statoVoce("in lettura"); };
voce.onpause = () => { if (!voce.ended) statoVoce("in pausa"); };
voce.onended = () => socket.emit("main:narrazioneFinita", { n: voceN });
// Chrome blocca l'audio finché nessuno ha cliccato la pagina: la regia lo sa,
// e il primo clic sullo schermo la fa partire.
const suona = () => voce.play().catch(() => { voceBloccata = true; statoVoce("bloccata"); });
addEventListener("pointerdown", () => { if (voceBloccata) suona(); });
function narra(s) {
  const leggi = s.phase === "narrating" && s.registro == null && s.chapter && s.chapter.audio;
  if (!leggi) { voce.pause(); voceBloccata = false; return; }
  if (voceN === s.chapter.n) return;
  voceN = s.chapter.n;
  voce.src = s.chapter.audio;
  suona();
}
// La voce scorre il capitolo: la pagina segue il punto dell'audio, dal titolo
// in giù, così le figure arrivano a schermo mentre la voce va avanti. Legata a
// currentTime: la pausa della regia ferma anche lo scorrimento.
// ponytail: lineare sul tempo; se la voce si stacca troppo dal testo, si tarano qui.
const SCROLL_ATTESA = 4, SCROLL_CODA = 4;   // secondi fermi in cima (titolo) e in fondo
let yVoce = 0;
(function scorriConVoce() {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (!voce.paused && voce.duration && max > 0 && !$("game").classList.contains("hidden")) {
    const p = (voce.currentTime - SCROLL_ATTESA) / (voce.duration - SCROLL_ATTESA - SCROLL_CODA);
    yVoce += (max * Math.min(1, Math.max(0, p)) - yVoce) * 0.06;   // insegue il punto: niente scatti
    scrollTo(0, yVoce);
  }
  partiFigure();
  requestAnimationFrame(scorriConVoce);
})();
socket.on("main:voce", ({ play }) => {
  const leggi = latest && latest.phase === "narrating" && latest.registro == null && voceN === latest.chapter.n;
  if (!leggi) return;
  if (play) suona(); else voce.pause();
});

// ==========================================================================
// SYNC — con serializzazione dell'interludio
// ==========================================================================
let lastIndex = -1, lastFired = 0, transitioning = false, latest = null;

socket.on("main:participant", ({ cid, action, connected }) => {
  if (action === "join") ensure(cid); else particles.delete(cid);
  $("lobbyCount").textContent = connected;
});
socket.on("main:particle", ({ cid, tag }) => { ensure(cid); setOrbit(particles.get(cid), tag); });
// A live spento facile/difficile arrivano nulli: la sala vede quanti hanno
// votato, non da che parte (§2.3). I due contatori spariscono del tutto invece
// di mostrare un segnaposto: due caselle vuote dove prima c'erano i numeri
// sembrano un guasto, e dal fondo della sala nessuno può chiedere.
function showTally(t, pulse) {
  const nascosti = t.facile == null;
  const set = (id, v) => {
    const el = $(id).querySelector(".n");
    el.classList.toggle("hidden", nascosti);
    if (nascosti) return;
    el.textContent = v;
    if (pulse && G && !REDUCED) G.fromTo(el, { scale: 1.25 }, { scale: 1, duration: 0.35, ease: "back.out(2)" });
  };
  set("poleFacile", t.facile); set("poleDifficile", t.difficile);
  $("voteCount").innerHTML = t.live ? "" : `<b>${t.total}</b> hanno votato`;
}
socket.on("main:tally", (t) => showTally(t, true));

function startTransition(s, reveal) {
  transitioning = true;
  if (G && !REDUCED) G.set("#col", { opacity: 0 });
  const from = daysBetween(s.startDate, s.prevDate), to = daysBetween(s.startDate, s.chapter.data);
  playInterstitial(from, to, s.chapter.data, s.startDate, s.endDate).then(() => { transitioning = false; reveal(latest); });
}

socket.on("main:sync", (s) => {
  latest = s;
  reconcile(s.participants || []);
  const inGame = s.phase === "narrating" || s.phase === "voting" || s.phase === "revealing";
  // il registro prende il posto del capitolo finché non si apre il voto
  const registro = s.registro != null;
  $("lobby").classList.toggle("hidden", s.phase !== "lobby");
  $("intro").classList.toggle("hidden", s.phase !== "intro");
  $("registro").classList.toggle("hidden", !registro);
  $("game").classList.toggle("hidden", !inGame || registro);
  $("ended").classList.toggle("hidden", s.phase !== "ended");
  $("lobbyCount").textContent = s.connected;
  if (!inGame) narra(s);                           // fuori dal libro la voce tace
  if (s.phase === "intro") renderIntro(s.intro);
  if (s.phase === "lobby") {
    bodyIndex = -1; lastIndex = -1; titleShown = false;   // reset: la lobby non mostra nulla, la prossima wheel "nasce"
    regIndex = -1; voceN = null;                          // nuova serata: registro e voce ripartono
    // NESSUN interludio in lobby: l'animazione dei giorni parte al 1° capitolo (lobby → inizio, 0 → N giorni).
    if (G && !REDUCED) G.set(["#iReadout", "#iBg", "#iTimeline"], { opacity: 0, clearProps: "transform" });
    else $("iReadout").style.opacity = 0;
  }

  // pannello di stato (sotto l'overlay): sempre aggiornato
  if (inGame) {
    $("delegaFill").style.width = (s.indice ?? 50) + "%";
    $("worldName").textContent = s.indice == null ? "—" : `Delega ${s.indice}`;
    $("worldSub").textContent = s.banda ? `banda ${s.banda}` : "";
    $("progress").textContent = `Capitolo ${s.chapter.n} di 14`;
    $("firedList").innerHTML = esitiHTML(s.esiti);
    if (s.esiti.length > lastFired && G && !REDUCED) G.from("#firedList .fired", { opacity: 0, x: 20, stagger: 0.1, duration: 0.5, ease: "power2.out" });
    lastFired = s.esiti.length;
  }

  const newChapter = inGame && s.index !== lastIndex;
  if (inGame) lastIndex = s.index;                 // NON in lobby, o il 1° capitolo non scatta

  // l'interludio può finire quando il regista è già andato oltre: al termine
  // si mostra lo stato più recente, qualunque sia
  const reveal = (x) => (x.phase === "ended" ? renderEnded(x) : x.chapter ? renderBody(x) : null);

  if (transitioning) return;
  if (newChapter) startTransition(s, reveal);
  else if (inGame) renderBody(s);
  else if (s.phase === "ended") renderEnded(s);
});
setInterval(() => { polePos(); sizeCanvas(); }, 500);
