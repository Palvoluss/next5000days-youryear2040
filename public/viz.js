// ==========================================================================
// VIZ — il dato di ogni capitolo reso visibile, uno per capitolo dal 2 al 12
// (il capitolo 1 ha la heatgrid in main.js). Un beat di content.js con una
// chiave registrata in VIZ.tipi diventa una figura (VIZ.html); VIZ.run la anima
// quando il capitolo è in scena; VIZ.stop ferma timeline e loop prima che il
// capitolo venga sostituito. Le proposte sono nate in un laboratorio
// (public/lab.html, nella storia git): VIZ.lib sono gli helper che usava.
// ==========================================================================
(() => {
  const G = window.gsap;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n) => Math.round(n).toLocaleString("it-IT");
  const f1 = (n) => n.toFixed(1);
  const milioni = (k) => k === 1 ? "1 milione" : `${k} milioni`;
  // PRNG con seme: la stessa figura a ogni proiezione
  const rng = (a) => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const shuffle = (arr, r) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  const GLOW = `<defs><filter id="viz-glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
  // didascalia come la heatgrid: numero grande nel colore del capitolo + etichetta
  const figura = (tipo, vb, svg, d) => `<figure class="viz v-${tipo}" data-viz="${tipo}" data-to="${d.to}">
    <svg viewBox="${vb}" role="img" aria-label="${d.label}">${GLOW}${svg}</svg>
    <figcaption><b class="v-count">0</b> ${d.label}${d.legenda ? `<span class="v-leg"><i></i>${d.legenda}</span>` : ""}</figcaption></figure>`;
  // Il numero si ricava dal tempo della timeline (k = elementi già accesi):
  // resta giusto anche quando la timeline salta alla fine (reduced motion).
  const conta = (tl, fig, tempi, mostra) => {
    const el = fig.querySelector(".v-count");
    tl.eventCallback("onUpdate", () => { const t = tl.time(); el.textContent = mostra(tempi.filter(ti => ti <= t).length); });
  };
  const attive = [];
  // loop ambientali (sfarfallii, orbite…): con reduced motion non partono
  const vivo = (tw) => { if (REDUCED) tw.kill(); else attive.push(tw); return tw; };
  const tipi = {};

  // --------------------------------------------------------------------------
  // cap. 2 · LE FINESTRE DELLE TRE — 400 finestre sono il mondo. La città va a
  // dormire e una su otto (50) resta accesa della luce fredda di uno schermo.
  // --------------------------------------------------------------------------
  const PALAZZI = [[4,10],[3,14],[5,8],[4,15],[3,9],[5,12],[4,11],[3,16],[3,13]];   // colonne × righe = 400
  const ACCESE = 50;
  tipi.finestre = {
    html(d) {
      const r = rng(7), W = 8, H = 10, GX = 6, GY = 8, PAD = 8, GAP = 10, BASE = 332, TOT = 400;
      const turno = new Map(shuffle([...Array(TOT).keys()], r).slice(0, ACCESE).map((k, i) => [k, i]));
      const lampade = new Set(shuffle([...Array(TOT).keys()], r).slice(0, 64));
      const larg = PALAZZI.map(([c]) => PAD * 2 + c * W + (c - 1) * GX);
      let x = (720 - larg.reduce((a, b) => a + b) - GAP * (PALAZZI.length - 1)) / 2, k = 0, svg = "";
      for (let fx = 16; fx < 690;) {            // skyline lontano: solo sagome, per la profondità
        const w = 34 + r() * 50, h = 110 + r() * 150;
        svg += `<rect class="fondo" x="${f1(fx)}" y="${f1(BASE - h)}" width="${f1(w)}" height="${f1(h)}"/>`;
        fx += w + 4 + r() * 14;
      }
      PALAZZI.forEach(([c, n], i) => {
        const h = 12 + n * (H + GY), y0 = BASE - h;
        svg += `<g class="pal"><rect class="muro" x="${x}" y="${y0}" width="${larg[i]}" height="${h}"/>`;
        for (let rI = 0; rI < n; rI++) for (let cI = 0; cI < c; cI++, k++) {
          const q = `x="${x + PAD + cI * (W + GX)}" y="${y0 + 12 + rI * (H + GY)}" width="${W}" height="${H}"`;
          svg += `<rect class="fin" ${q}/>`;
          if (lampade.has(k)) svg += `<rect class="lampada" ${q}/>`;
          if (turno.has(k)) svg += `<rect class="schermo" data-t="${turno.get(k)}" filter="url(#viz-glow)" ${q}/>`;
        }
        svg += `</g>`; x += larg[i] + GAP;
      });
      svg += `<line class="suolo" x1="12" x2="708" y1="${BASE}" y2="${BASE}"/>
        <text class="ora" x="708" y="20" text-anchor="end">03<tspan class="due">:</tspan>00</text>`;
      return figura("finestre", "0 0 720 340", svg, d);
    },
    run(fig) {
      const q = (s) => [...fig.querySelectorAll(s)];
      const schermi = q(".schermo").sort((a, b) => a.dataset.t - b.dataset.t);
      const T0 = 2, PASSO = 0.055, per = fig.dataset.to / ACCESE, tl = G.timeline();
      tl.from(q(".fondo"), { opacity: 0, duration: 0.8, stagger: { each: 0.03, from: "random" } }, 0)
        .from(q(".pal"), { scaleY: 0, transformOrigin: "50% 100%", duration: 0.9, ease: "power4.out", stagger: { each: 0.06, from: "center" } }, 0.1)
        .from(q(".ora"), { opacity: 0, y: -6, duration: 0.5, ease: "power2.out" }, 0.7)
        // dopo mezzanotte le lampade di casa si spengono, a scatti…
        .to(shuffle(q(".lampada"), rng(8)), { opacity: 0, duration: 0.1, ease: "steps(2)", stagger: 0.012 }, 1.2)
        // …e una finestra su otto si accende: lo schermo sfarfalla, poi resta
        .to(schermi, { keyframes: { opacity: [0, 1, 0.3, 1], easeEach: "none" }, duration: 0.28, stagger: PASSO }, T0);
      conta(tl, fig, schermi.map((_, i) => T0 + i * PASSO), (k) => fmt(k * per));
      tl.eventCallback("onComplete", () => {
        schermi.forEach(el => vivo(G.to(el, { opacity: 0.55 + Math.random() * 0.4, duration: 0.6 + Math.random() * 1.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: Math.random() })));
        vivo(G.to(q(".due"), { opacity: 0.15, duration: 0.5, ease: "steps(1)", repeat: -1, yoyo: true }));
      });
      return tl;
    }
  };

  // --------------------------------------------------------------------------
  // cap. 3 · IL FOTOGRAMMA — un volto esce dal rumore, pixel per pixel, come lo
  // genera un'AI. Poi la verifica lo attraversa, il quadro si strappa, cade il
  // timbro FALSO e il rango si decifra sul valore vero.
  // --------------------------------------------------------------------------
  tipi.fotogramma = {
    html(d) {
      const r = rng(3), C = 48, R = 27, S = 12, X0 = 72, Y0 = 18, W = C * S, H = R * S;   // 48×27 pixel da 12: un fotogramma 16:9
      const dentro = (x, y) => ((x - 288) / 64) ** 2 + ((y - 124) / 80) ** 2 <= 1        // testa
        || (x > 264 && x < 312 && y > 186 && y < 234)                                  // collo
        || ((x - 288) / 196) ** 2 + ((y - 338) / 112) ** 2 <= 1;                        // spalle
      let px = "";
      for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) {
        const lum = dentro(i * S + S / 2, j * S + S / 2) ? 0.45 + 0.4 * (1 - i / C) + r() * 0.1 : 0.05 + 0.08 * (j / R) + r() * 0.04;   // luce da sinistra
        px += `<rect class="px" data-j="${j}" data-l="${lum.toFixed(2)}" x="${X0 + i * S}" y="${Y0 + j * S}" width="${S - 1}" height="${S - 1}" opacity="${r().toFixed(2)}"/>`;
      }
      return figura("fotogramma", "0 0 720 360", `
        <rect class="cornice" x="${X0 - 2}" y="${Y0 - 2}" width="${W + 3}" height="${H + 3}" rx="4"/>
        <g class="quadro">${px}</g>
        <rect class="scan" x="${X0}" y="${Y0}" width="${W}" height="3"/>
        <g class="hud"><circle class="rec" cx="${X0 + 20}" cy="${Y0 + 20}" r="5"/><text x="${X0 + 32}" y="${Y0 + 24}">REC</text>
          <text class="tc" x="${X0 + W - 16}" y="${Y0 + 24}" text-anchor="end">00:00:00:00</text>
          <text x="${X0 + 16}" y="${Y0 + H - 14}">ministro_festa.mp4</text></g>
        <g class="timbro" transform="translate(360 180) rotate(-12)"><rect x="-118" y="-38" width="236" height="76" rx="6"/><text y="17" text-anchor="middle">FALSO</text></g>`, d);
    },
    run(fig) {
      const q = (s) => [...fig.querySelectorAll(s)], px = q(".px"), r = rng(4);
      const tc = fig.querySelector(".tc"), el = fig.querySelector(".v-count"), lei = fig.dataset.to;
      const T1 = 2.6, T2 = 3.7, tl = G.timeline();
      // rumore che frigge, poi il volto si compone dal centro
      tl.to(px, { opacity: () => Math.random(), duration: 0.09, repeat: 4, repeatRefresh: true, ease: "steps(1)" }, 0)
        .to(px, { opacity: (i, e) => +e.dataset.l, duration: 0.5, ease: "power2.out", stagger: { grid: [27, 48], from: "center", amount: 1.5 } }, 0.45)
        // la verifica: una riga che scende, e il quadro che si strappa dove passa
        .fromTo(q(".scan"), { attr: { y: 18 }, opacity: 1 }, { attr: { y: 18 + 27 * 12 - 3 }, duration: 1, ease: "none", immediateRender: false }, T1)
        .to(q(".scan"), { opacity: 0, duration: 0.15 }, T1 + 1);
      for (const j of shuffle([...Array(27).keys()], r).slice(0, 7)) {
        const riga = px.filter(e => +e.dataset.j === j), t = T1 + j / 27;
        tl.set(riga, { x: (r() < 0.5 ? -1 : 1) * 12 * (1 + Math.floor(r() * 3)) }, t).set(riga, { x: 0 }, t + 0.14);
      }
      tl.from(q(".timbro"), { scale: 2.2, opacity: 0, transformOrigin: "50% 50%", duration: 0.3, ease: "power4.in" }, T2)
        .fromTo(q(".quadro"), { x: 0 }, { x: 6, duration: 0.05, repeat: 5, yoyo: true, ease: "none", immediateRender: false }, T2 + 0.3);   // l'urto
      // il rango si decifra durante la verifica e si ferma sul valore vero
      tl.eventCallback("onUpdate", () => { const t = tl.time(); el.textContent = t < T1 ? "" : t < T2 ? `${1 + Math.floor(Math.random() * 9)}°` : `${lei}°`; });
      // REC e timecode vanno sempre, come una registrazione vera
      vivo(G.to(q(".rec"), { opacity: 0.15, duration: 0.5, ease: "steps(1)", repeat: -1, yoyo: true }));
      const o = { f: 0 }, p2 = (n) => String(n).padStart(2, "0");
      vivo(G.to(o, { f: 25 * 3600, duration: 3600, ease: "none", onUpdate: () => { const f = o.f | 0; tc.textContent = `00:${p2((f / 1500 | 0) % 60)}:${p2((f / 25 | 0) % 60)}:${p2(f % 25)}`; } }));
      return tl;
    }
  };

  // --------------------------------------------------------------------------
  // cap. 4 · L'EQUALIZZATORE — 100 barre sono i guadagni di chi fa musica, e
  // ballano ognuna a modo suo. Le ultime 24 passano alle macchine: si fermano,
  // fredde, e poi si muovono tutte uguali.
  // --------------------------------------------------------------------------
  tipi.equalizzatore = {
    html(d) {
      const N = 100, BW = 5, GAP = 2, P = BW + GAP, X0 = (720 - (N * P - GAP)) / 2, BASE = 252;
      let svg = "";
      for (let i = 0; i < N; i++) svg += `<rect class="barra" x="${f1(X0 + i * P)}" y="${BASE - 210}" width="${BW}" height="210" rx="1.5"/>`;
      svg += `<line class="base" x1="${f1(X0 - 6)}" x2="${f1(720 - X0 + 6)}" y1="${BASE + 2}" y2="${BASE + 2}"/>
        <text class="tag" x="${f1(X0 + (N - d.to) * P / 2)}" y="${BASE + 22}" text-anchor="middle">A CHI CREA</text>
        <text class="tag" x="${f1(X0 + (N - d.to / 2) * P)}" y="${BASE + 22}" text-anchor="middle">ALLE MACCHINE</text>`;
      return figura("equalizzatore", "0 0 720 280", svg, d);
    },
    run(fig) {
      const barre = [...fig.querySelectorAll(".barra")], pct = +fig.dataset.to, loro = barre.slice(barre.length - pct);
      const balla = new Map(), tl = G.timeline(), T0 = 1.6, PASSO = 0.07, tempi = [], B = { transformOrigin: "50% 100%" };
      // ognuna balla a modo suo, più alte sui bassi: è musica suonata da qualcuno
      barre.forEach((b, i) => {
        const env = 1 - 0.55 * i / barre.length;
        balla.set(b, vivo(G.fromTo(b, { scaleY: env * 0.3, ...B }, { scaleY: () => env * (0.25 + Math.random() * 0.75), duration: () => 0.18 + Math.random() * 0.35, ease: "sine.inOut", repeat: -1, yoyo: true, repeatRefresh: true, ...B })));
      });
      loro.forEach((b, k) => {                          // una alla volta passano alle macchine: si fermano, fredde
        const t = T0 + k * PASSO;
        tl.call(() => balla.get(b).kill(), null, t)
          .set(b, { attr: { class: "barra macchina" } }, t)
          .to(b, { scaleY: 0.3, duration: 0.12, ease: "power2.out", ...B }, t);
        tempi.push(t);
      });
      tl.from(fig.querySelectorAll(".tag"), { opacity: 0, duration: 0.5 }, T0 + pct * PASSO + 0.2);
      conta(tl, fig, tempi, (k) => `${k}%`);
      // …e poi si muovono all'unisono: nessuno ha cercato quella nota
      tl.eventCallback("onComplete", () => vivo(G.to(loro, { scaleY: 0.75, duration: 0.32, ease: "power1.inOut", repeat: -1, yoyo: true, ...B })));
      return tl;
    }
  };

  // --------------------------------------------------------------------------
  // cap. 5 · LA BACHECA — 92 annunci «CERCASI», un milione di posti l'uno. Si
  // staccano uno alla volta e resta la puntina. Poi ne arrivano altri, diversi.
  // --------------------------------------------------------------------------
  tipi.bacheca = {
    html(d) {
      const r = rng(33), C = 16, R = 6, W = 26, H = 30;
      const vuoti = new Set(shuffle([...Array(C * R).keys()], r).slice(0, C * R - d.to));   // 96 posti, 92 annunci
      let svg = `<rect class="sughero" x="30" y="10" width="660" height="300" rx="8"/>`;
      for (let k = 0; k < C * R; k++) {
        if (vuoti.has(k)) continue;
        const x = 58 + (k % C) * 38 + (r() - 0.5) * 8, y = 26 + Math.floor(k / C) * 44 + (r() - 0.5) * 6;
        svg += `<g class="annuncio" transform="translate(${f1(x)} ${f1(y)}) rotate(${f1((r() - 0.5) * 10)})">
          <g class="carta"><rect width="${W}" height="${H}" rx="1.5"/><rect class="riga" x="4" y="7" width="18" height="2.5"/><rect class="riga" x="4" y="13" width="14" height="2"/><rect class="riga" x="4" y="18" width="16" height="2"/><rect class="riga" x="4" y="23" width="10" height="2"/></g>
          <circle class="puntina" cx="${W / 2}" cy="3" r="2.6"/></g>`;
      }
      // gli annunci nuovi: pochi, grandi, con la trappola dentro
      svg += [[120, 90, -4], [300, 150, 3], [470, 70, -2], [560, 190, 5]].map(([x, y, a]) => `<g class="nuovo" transform="translate(${x} ${y}) rotate(${a})">
        <rect width="118" height="78" rx="3"/><text class="h" x="59" y="28" text-anchor="middle">CERCASI</text>
        <text x="59" y="47" text-anchor="middle">junior con</text><text x="59" y="63" text-anchor="middle">5 anni di esperienza</text>
        <circle class="puntina" cx="59" cy="7" r="3.5"/></g>`).join("");
      return figura("bacheca", "0 0 720 320", svg, d);
    },
    run(fig) {
      const q = (s) => [...fig.querySelectorAll(s)], r = rng(34);
      const carte = shuffle(q(".annuncio .carta"), r), tl = G.timeline(), T0 = 1.2, PASSO = 0.034, tempi = [];
      tl.from(q(".annuncio"), { scale: 0.6, opacity: 0, transformOrigin: "50% 0%", duration: 0.3, ease: "back.out(2)", stagger: { each: 0.006, from: "random" } }, 0);
      carte.forEach((c, i) => {                        // l'annuncio si strappa e cade: resta la puntina
        const t = T0 + i * PASSO;
        tl.to(c, { y: 70 + r() * 30, rotation: (r() < 0.5 ? -1 : 1) * (25 + r() * 35), opacity: 0, transformOrigin: "50% 0%", duration: 0.55, ease: "power2.in" }, t);
        tempi.push(t);
      });
      tl.from(q(".nuovo"), { scale: 0.5, opacity: 0, rotation: "+=12", transformOrigin: "50% 0%", duration: 0.5, ease: "back.out(2)", stagger: 0.25 }, T0 + carte.length * PASSO + 0.5);
      conta(tl, fig, tempi, milioni);
      tl.eventCallback("onComplete", () => q(".nuovo").forEach((n, i) => vivo(G.to(n, { rotation: `+=${i % 2 ? 1.5 : -1.5}`, duration: 1.4 + i * 0.2, ease: "sine.inOut", repeat: -1, yoyo: true }))));
      return tl;
    }
  };

  // --------------------------------------------------------------------------
  // cap. 6 · IL RICONOSCIMENTO — cento badge: le grandi aziende. Il mirino
  // dell'AI salta dall'uno all'altro e ne legge `to`: compare la barra
  // dell'umore, la bocca si raddrizza.
  // --------------------------------------------------------------------------
  const angoli = (w, h, a = 3.5) => `M${-w},${-h + a} V${-h} H${-w + a} M${w - a},${-h} H${w} V${-h + a} M${w},${h - a} V${h} H${w - a} M${-w + a},${h} H${-w} V${h - a}`;
  tipi.badge = {
    html(d) {
      const r = rng(71), C = 20, R = 5, letti = new Set(shuffle([...Array(C * R).keys()], r).slice(0, d.to));
      let svg = "";
      for (let k = 0; k < C * R; k++) {
        const x = 18 + (k % C) * 36, y = 38 + Math.floor(k / C) * 58, curva = f1(-1.6 + (r() - 0.5) * 4);   // chi sorride, chi no
        svg += `<g class="badge${letti.has(k) ? " letto" : ""}" data-x="${x}" data-y="${y}" transform="translate(${x} ${y})">
          <rect class="carta" x="-13" y="-20" width="26" height="40" rx="3"/><rect class="foro" x="-4" y="-17" width="8" height="2.4" rx="1.2"/>
          <circle class="viso" cy="-4" r="6.5"/><circle class="tratto" cx="-2.3" cy="-5.5" r="0.9"/><circle class="tratto" cx="2.3" cy="-5.5" r="0.9"/>
          <path class="bocca" d="M-2.8,-1.6 Q0,${curva} 2.8,-1.6"/>
          <rect class="riga" x="-8" y="7" width="16" height="2" rx="1"/><rect class="riga" x="-6" y="11" width="12" height="2" rx="1"/>`
          + (letti.has(k) ? `<path class="mira" d="${angoli(9.5, 11)}" transform="translate(0 -4)"/><rect class="umore" x="-8" y="15.5" width="${f1(4 + r() * 12)}" height="2.2" rx="1"/>` : "")
          + `</g>`;
      }
      return figura("badge", "0 0 720 320", svg + `<path class="cursore" d="${angoli(18, 24, 6)}"/>`, d);
    },
    run(fig) {
      const q = (s) => [...fig.querySelectorAll(s)], r = rng(72), cur = fig.querySelector(".cursore");
      const letti = shuffle(q(".badge.letto"), r), tl = G.timeline(), T0 = 1, PASSO = 0.085, tempi = [];
      tl.from(q(".badge"), { opacity: 0, duration: 0.4, stagger: { each: 0.005, from: "random" } }, 0)
        .fromTo(cur, { opacity: 0, x: 360, y: 160 }, { opacity: 1, duration: 0.3 }, T0 - 0.3);
      letti.forEach((b, i) => {                        // il mirino arriva, legge, passa oltre
        const t = T0 + i * PASSO, arriva = t + PASSO * 0.7;
        tl.to(cur, { x: +b.dataset.x, y: +b.dataset.y - 4, duration: PASSO * 0.7, ease: "power2.inOut" }, t)
          .from(b.querySelector(".mira"), { opacity: 0, scale: 1.8, transformOrigin: "50% 50%", duration: 0.15 }, arriva)
          .to(b.querySelector(".bocca"), { attr: { d: "M-2.8,-1.6 Q0,-1.6 2.8,-1.6" }, duration: 0.2 }, arriva)   // letto: la bocca si raddrizza
          .from(b.querySelector(".umore"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.2 }, arriva);
        tempi.push(arriva);
      });
      tl.to(cur, { opacity: 0, duration: 0.3 }, T0 + letti.length * PASSO + 0.3);
      conta(tl, fig, tempi, (k) => `${k}%`);
      tl.eventCallback("onComplete", () => vivo(G.to(q(".mira"), { opacity: 0.35, duration: 0.9, ease: "sine.inOut", stagger: { each: 0.03, from: "random", repeat: -1, yoyo: true } })));
      return tl;
    }
  };

  // --------------------------------------------------------------------------
  // cap. 7 · LE SAGOME — sagome tratteggiate: gli insegnanti che mancano, un
  // milione l'una. Al posto di ognuna si accende uno schermo.
  // --------------------------------------------------------------------------
  tipi.sagome = {
    html(d) {
      const sagoma = `<circle cx="0" cy="-22" r="7"/><path d="M-12,18 V-4 Q-12,-11 -5,-11 H5 Q12,-11 12,-4 V18"/>`;
      let svg = "";
      for (let k = 0; k < d.to; k++) svg += `<g class="prof" transform="translate(${60 + (k % 11) * 60} ${50 + Math.floor(k / 11) * 72})">
        <g class="assente">${sagoma}</g><rect class="tablet" x="-8" y="-5" width="16" height="12" rx="2"/></g>`;
      return figura("sagome", "0 0 720 310", svg, d);
    },
    run(fig) {
      const q = (s) => [...fig.querySelectorAll(s)], prof = shuffle(q(".prof"), rng(92));
      const tl = G.timeline(), T0 = 0.4, PASSO = 0.06, tempi = [];
      prof.forEach((p, i) => {                         // compare il vuoto dove dovrebbe esserci qualcuno
        const t = T0 + i * PASSO;
        tl.from(p.querySelector(".assente"), { opacity: 0, scale: 0.7, transformOrigin: "50% 100%", duration: 0.3, ease: "back.out(2)" }, t);
        tempi.push(t);
      });
      tl.from(q(".tablet"), { opacity: 0, scale: 0, transformOrigin: "50% 50%", duration: 0.25, ease: "back.out(2)", stagger: { each: 0.03, from: "random" } }, T0 + prof.length * PASSO + 0.6);
      conta(tl, fig, tempi, milioni);
      tl.eventCallback("onComplete", () => q(".tablet").forEach(el => vivo(G.to(el, { opacity: 0.55 + Math.random() * 0.4, duration: 0.6 + Math.random() * 1.4, ease: "sine.inOut", repeat: -1, yoyo: true, delay: Math.random() }))));
      return tl;
    }
  };

  // --------------------------------------------------------------------------
  // cap. 8 · LA FOLLA — la macchina passa in rassegna sessanta persone e ne
  // segna in anticipo nove, con la sua percentuale. Sei mesi dopo: quasi sempre
  // aveva ragione. Quasi: due non avevano fatto niente. La multa (`to` milioni)
  // arriva alla fine, solo come numero della didascalia.
  // --------------------------------------------------------------------------
  tipi.folla = {
    html(d) {
      const r = rng(121), C = 15, N = 60, segnati = shuffle([...Array(N).keys()], r).slice(0, 9), sbagliati = new Set(segnati.slice(0, 2));
      let svg = `<defs><linearGradient id="viz-banda" class="banda" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-opacity="0"/><stop offset="0.5" stop-opacity="0.45"/><stop offset="1" stop-opacity="0"/></linearGradient></defs>`;
      for (let k = 0; k < N; k++) {
        const x = 44 + (k % C) * 45 + (r() - 0.5) * 10, y = 70 + Math.floor(k / C) * 70 + (r() - 0.5) * 8, seg = segnati.includes(k), err = sbagliati.has(k);
        svg += `<g class="pers${seg ? " segnato" : ""}${err ? " errore" : ""}" data-x="${f1(x)}" transform="translate(${f1(x)} ${f1(y)})">
          <circle cy="-16" r="6"/><path class="corpo" d="M-9,14 V-2 Q-9,-8 -3,-8 H3 Q9,-8 9,-2 V14 Z"/>`
          + (seg ? `<path class="mira" d="${angoli(15, 25)}" transform="translate(0 -3)"/><text class="pct" y="-32" text-anchor="middle">${76 + Math.floor(r() * 20)}%</text>
            <text class="esito" y="36" text-anchor="middle">${err ? "nessun reato" : "✓"}</text>` : "")
          + `</g>`;
      }
      return figura("folla", "0 0 720 330", `${svg}<rect class="banda-r" x="0" y="30" width="60" height="290" fill="url(#viz-banda)" opacity="0"/>
        <text class="dopo" x="360" y="18" text-anchor="middle">SEI MESI DOPO</text>`, d);
    },
    run(fig) {
      const q = (s) => [...fig.querySelectorAll(s)], banda = fig.querySelector(".banda-r"), el = fig.querySelector(".v-count"), stato = { m: 0 };
      const tl = G.timeline(), T0 = 0.8, DUR = 2.4;
      tl.from(q(".pers"), { opacity: 0, y: "+=10", duration: 0.4, stagger: { each: 0.01, from: "random" } }, 0)
        .fromTo(banda, { x: -60, opacity: 1 }, { x: 720, duration: DUR, ease: "none", immediateRender: false }, T0)
        .to(banda, { opacity: 0, duration: 0.2 }, T0 + DUR);
      q(".segnato").forEach(p => {                     // dove passa il fascio, la macchina segna chi secondo lei lo farà
        const t = T0 + (+p.dataset.x + 30) / 780 * DUR;
        tl.from([p.querySelector(".mira"), p.querySelector(".pct")], { opacity: 0, scale: 1.6, transformOrigin: "50% 50%", duration: 0.2 }, t)
          .set(p, { attr: { class: p.getAttribute("class") + " acceso" } }, t);
      });
      // sei mesi dopo: chi ha commesso davvero un reato, e chi no
      const T1 = T0 + DUR + 0.6;
      tl.from(fig.querySelector(".dopo"), { opacity: 0, y: -6, duration: 0.4 }, T1)
        .from(q(".esito"), { opacity: 0, duration: 0.3, stagger: 0.12 }, T1 + 0.6)
        .set(q(".errore"), { attr: { class: "pers segnato errore acceso rivelato" } }, T1 + 1.8)
        .to(stato, { m: +fig.dataset.to, duration: 1.1, ease: "power2.out" }, T1 + 2.4);
      tl.eventCallback("onUpdate", () => { el.textContent = `${milioni(Math.round(stato.m))} €`; });
      tl.eventCallback("onComplete", () => vivo(G.to(q(".errore .mira"), { opacity: 0.3, duration: 0.7, ease: "sine.inOut", repeat: -1, yoyo: true })));
      return tl;
    }
  };

  // --------------------------------------------------------------------------
  // cap. 9 · LA STESSA VIA — una via con la gente, i manifesti, le scritte sui
  // muri, un ragazzo seduto per terra. I filtri degli occhiali si accendono
  // come nel testo e ogni volta qualcosa sparisce; intanto escono di fabbrica
  // `to` paia di occhiali, un milione l'uno. Poi avanti e indietro: i filtri si
  // spengono (torna tutto) e si riaccendono (sparisce tutto).
  // --------------------------------------------------------------------------
  const STRADA = {
    palazzi: [[40, 110, 120], [150, 90, 150], [240, 130, 110], [370, 100, 140], [470, 120, 125], [590, 90, 150]],   // x, larghezza, altezza
    manifesti: [[62, 150, 40, 54, "o"], [262, 162, 44, 58, "t"], [398, 140, 36, 50, "s"], [612, 150, 40, 54, "t"]],
    scritte: ["M178,196 q10,-14 20,0 t20,0 t20,-4", "M496,186 q8,12 16,0 t16,2 t18,-6", "M318,206 q6,-10 12,0 t12,0"],
    persone: [[112, 272, 1], [196, 274, 0.95], [300, 273, 1.05], [352, 275, 0.9], [566, 272, 1.1], [646, 274, 1]],
    ragazzo: [455, 262]
  };
  const FILTRI = [["PUBBLICITÀ", ".manifesto"], ["MURI SPORCHI", ".scritta"], ["ELEMOSINA", ".ragazzo"], ["PERSONE", ".pers"]];
  const strada = () => {
    const { palazzi, manifesti, scritte, persone, ragazzo: [rx, ry] } = STRADA;
    let s = `<rect class="cielo" x="40" y="10" width="640" height="280" rx="6"/>`;
    for (const [x, w, h] of palazzi) {
      s += `<rect class="muro" x="${x}" y="${230 - h}" width="${w}" height="${h}"/>`;
      for (let yy = 240 - h; yy < 220; yy += 22) for (let xx = x + 10; xx < x + w - 14; xx += 20) s += `<rect class="fin" x="${xx}" y="${yy}" width="10" height="12"/>`;
    }
    s += `<rect class="marciapiede" x="40" y="230" width="640" height="60"/><line class="cordolo" x1="40" x2="680" y1="232" y2="232"/>`;
    s += manifesti.map(([x, y, w, h, c]) => `<g class="manifesto ${c}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/><rect class="scr" x="${x + 6}" y="${y + 8}" width="${w - 12}" height="5"/><rect class="scr" x="${x + 6}" y="${y + 18}" width="${w - 18}" height="4"/></g>`).join("");
    s += scritte.map(p => `<path class="scritta" d="${p}"/>`).join("");
    s += `<g class="ragazzo" transform="translate(${rx} ${ry})"><circle cy="-22" r="6.5"/><path d="M-9,0 Q-10,-15 0,-15 Q10,-15 9,0 Z"/><rect class="tazza" x="14" y="-6" width="7" height="7" rx="1"/></g>`;
    return s + persone.map(([x, y, sc]) => `<g class="pers" transform="translate(${x} ${y}) scale(${sc})"><circle cy="-38" r="6.5"/><path d="M-8,0 L-7,-18 Q-8,-30 0,-30 Q8,-30 7,-18 L8,0 Z"/></g>`).join("");
  };
  tipi.via = {
    html(d) {
      let paia = "";
      for (let k = 0; k < d.to; k++) paia += `<g class="paio" transform="translate(${126 + k * 52} 312)"><rect x="-19" y="-7" width="16" height="13" rx="4"/><rect x="3" y="-7" width="16" height="13" rx="4"/><path d="M-3,-3 H3"/></g>`;
      return figura("via", "0 0 720 330", `<defs><clipPath id="viz-via"><rect x="40" y="10" width="640" height="280" rx="6"/></clipPath></defs>
        <g clip-path="url(#viz-via)">${strada()}</g>
        <g class="hud"><rect class="fondo-hud" x="52" y="20" width="176" height="84" rx="6"/><text class="h" x="64" y="38">FILTRI DEGLI OCCHIALI</text>
          ${FILTRI.map(([f], i) => `<g class="filtro" data-i="${i}" transform="translate(64 ${56 + i * 14})"><rect class="box" x="0" y="-8" width="9" height="9" rx="2"/><path class="spunta" d="M1.5,-3.5 l2.5,2.5 l4,-5"/><text x="16">${f}</text></g>`).join("")}</g>
        ${paia}`, d);
    },
    run(fig) {
      const q = (s) => fig.querySelector(s), qa = (s) => [...fig.querySelectorAll(s)], tl = G.timeline(), tempi = [];
      // un filtro si accende (o si spegne): spunta, e le cose della sua classe spariscono (o tornano) a scatti
      const passo = (x, t0, i, acceso) => x
        .set(q(`.filtro[data-i="${i}"]`), { attr: { class: acceso ? "filtro on" : "filtro" } }, t0)
        .fromTo(qa(FILTRI[i][1]), { opacity: acceso ? 1 : 0 }, { opacity: acceso ? 0 : 1, duration: 0.4, ease: "steps(4)", stagger: 0.04, immediateRender: false }, t0 + 0.1);
      tl.from(qa(".hud, .paio"), { opacity: 0, duration: 0.5 }, 0);
      FILTRI.forEach((_, i) => passo(tl, 1 + i * 1.2, i, true));
      qa(".paio").forEach((p, k) => {                  // intanto escono di fabbrica: un milione per paio
        const t = 1 + k * 0.48;
        tl.set(p, { attr: { class: "paio on" } }, t);
        tempi.push(t);
      });
      conta(tl, fig, tempi, milioni);
      // poi avanti e indietro, per capire cosa sta succedendo
      tl.eventCallback("onComplete", () => {
        const giro = G.timeline({ repeat: -1, delay: 1.4 });
        [3, 2, 1, 0].forEach((i, k) => passo(giro, k * 0.8, i, false));
        [0, 1, 2, 3].forEach((i, k) => passo(giro, 4.6 + k * 0.8, i, true));
        vivo(giro.to({}, { duration: 1.6 }));          // una pausa sulla via vuota, poi ricomincia
      });
      return tl;
    }
  };

  // --------------------------------------------------------------------------
  // cap. 10 · CINQUE A TESTA — otto persone, un miliardo l'una: intorno a
  // ognuna si accendono cinque oggetti connessi, e da ognuno parte un filo
  // verso la nuvola. `to` miliardi di oggetti per 8 miliardi di persone.
  // --------------------------------------------------------------------------
  const miliardi = (k) => k === 1 ? "1 miliardo" : `${k} miliardi`;
  const ICONE = {   // oggetti di tutti i giorni, a tratto: centrati in 0,0, circa 20 px
    orologio: `<circle r="6"/><path d="M-3,-6 V-10 H3 V-6 M-3,6 V10 H3 V6 M0,-3 V0 L2,2"/>`,
    telefono: `<rect x="-5" y="-9" width="10" height="18" rx="2"/><path d="M-1.5,6 H1.5"/>`,
    auto: `<path d="M-10,3 V-1 L-7,-6 H7 L10,-1 V3 Z"/><circle cx="-6" cy="4" r="2.2"/><circle cx="6" cy="4" r="2.2"/>`,
    tv: `<rect x="-10" y="-7" width="20" height="13" rx="1.5"/><path d="M-4,9 H4"/>`,
    cassa: `<rect x="-6" y="-9" width="12" height="18" rx="3"/><circle cy="3" r="3"/><circle cy="-4" r="1.3"/>`
  };
  tipi.cinque = {
    html(d) {
      let fili = "", svg = `<g class="nuvola"><circle cx="340" cy="40" r="14"/><circle cx="362" cy="31" r="18"/><circle cx="384" cy="41" r="13"/><rect x="326" y="40" width="72" height="15" rx="7"/>
        <text x="362" y="72" text-anchor="middle">CHI HA I TUOI DATI</text></g>`;
      for (let p = 0; p < d.to / 5; p++) {
        const x = 72 + p * 82, y = 262;
        svg += `<g class="uomo" transform="translate(${x} ${y})"><circle cy="-42" r="7"/><path d="M-9,0 L-8,-20 Q-9,-33 0,-33 Q9,-33 8,-20 L9,0 Z"/></g>`;
        Object.keys(ICONE).forEach((t, j) => {       // ad arco sopra la testa
          const a = Math.PI * (1.1 + j * 0.2), ox = f1(x + 34 * Math.cos(a)), oy = f1(y - 30 + 34 * Math.sin(a));
          fili += `<line class="filo" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" x1="${ox}" y1="${oy}" x2="362" y2="52"/>`;
          svg += `<g class="ogg" transform="translate(${ox} ${oy}) scale(0.7)">${ICONE[t]}</g>`;
        });
      }
      return figura("cinque", "0 0 720 290", `<g>${fili}</g>${svg}`, d);
    },
    run(fig) {
      const q = (s) => [...fig.querySelectorAll(s)], ogg = q(".ogg"), fili = q(".filo"), tl = G.timeline(), T0 = 1, PASSO = 0.09, tempi = [];
      tl.from(q(".uomo"), { opacity: 0, y: "+=10", duration: 0.5, stagger: 0.06 }, 0)
        .from(fig.querySelector(".nuvola"), { opacity: 0, y: -10, duration: 0.5 }, 0.3);
      ogg.forEach((o, k) => {                          // persona dopo persona, si accendono i suoi cinque oggetti
        const t = T0 + k * PASSO;
        tl.from(o, { opacity: 0, scale: 0.2, transformOrigin: "50% 50%", duration: 0.25, ease: "back.out(2)" }, t)
          .set(o, { attr: { class: "ogg on" } }, t)
          .to(fili[k], { strokeDashoffset: 0, duration: 0.4, ease: "power1.in" }, t + 0.1);
        tempi.push(t);
      });
      conta(tl, fig, tempi, miliardi);
      tl.eventCallback("onComplete", () => vivo(G.to(fili, { opacity: 0.25, duration: 0.6, ease: "sine.inOut", stagger: { each: 0.05, from: "random", repeat: -1, yoyo: true } })));
      return tl;
    }
  };

  // --------------------------------------------------------------------------
  // cap. 11 · LE FASCE — cento teste che dormono sul cuscino: i lavoratori.
  // A `to` si accende la fascia sulla fronte e sotto si carica il sapere, in
  // mezzo secondo: domattina sapranno tutto.
  // --------------------------------------------------------------------------
  tipi.fasce = {
    html(d) {
      const sue = new Set(shuffle([...Array(100).keys()], rng(171)).slice(0, d.to));
      let svg = "";
      for (let k = 0; k < 100; k++) {                  // 20 × 5
        const sua = sue.has(k);
        svg += `<g class="testa${sua ? " sua" : ""}" transform="translate(${18 + (k % 20) * 36} ${40 + Math.floor(k / 20) * 58})"><rect class="cuscino" x="-15" y="-2" width="30" height="14" rx="7"/>
          <circle class="viso" cy="-4" r="10"/><path class="occhi" d="M-6,-3 q2.5,2.5 5,0 M1,-3 q2.5,2.5 5,0"/>`
          + (sua ? `<path class="fascia" d="M-10,-9 Q0,-17 10,-9"/><rect class="binario" x="-12" y="16" width="24" height="3" rx="1.5"/><rect class="carica" x="-12" y="16" width="24" height="3" rx="1.5"/>` : "")
          + `</g>`;
      }
      return figura("fasce", "0 0 720 320", svg, d);
    },
    run(fig) {
      const q = (s) => [...fig.querySelectorAll(s)], sue = shuffle(q(".testa.sua"), rng(172)), tl = G.timeline(), T0 = 1, PASSO = 0.05, tempi = [];
      tl.from(q(".testa"), { opacity: 0, duration: 0.5, stagger: { each: 0.005, from: "random" } }, 0);
      sue.forEach((h, i) => {                          // si accende la fascia, e il sapere si carica in mezzo secondo
        const t = T0 + i * PASSO;
        tl.from(h.querySelector(".fascia"), { opacity: 0, scale: 0.6, transformOrigin: "50% 100%", duration: 0.2 }, t)
          .from(h.querySelectorAll(".binario, .carica"), { opacity: 0, duration: 0.1 }, t)
          .from(h.querySelector(".carica"), { scaleX: 0, transformOrigin: "0% 50%", duration: 0.5, ease: "power1.inOut" }, t + 0.1);
        tempi.push(t);
      });
      conta(tl, fig, tempi, (k) => `${k}%`);
      tl.eventCallback("onComplete", () => vivo(G.to(q(".fascia"), { opacity: 0.45, duration: 0.8, ease: "sine.inOut", stagger: { each: 0.03, from: "random", repeat: -1, yoyo: true } })));
      return tl;
    }
  };

  // --------------------------------------------------------------------------
  // cap. 12 · L'OSPEDALE — in alto cento decisioni, `to` prese dall'AI. Sotto
  // la mappa: l'oracolo chiude l'ospedale e calcola «sulla carta» in linea
  // d'aria. Ma in mezzo c'è il fiume, e il ponte non c'è: la strada vera è
  // lunghissima, e la gente ci arranca sopra. I km sono un esempio.
  // --------------------------------------------------------------------------
  tipi.ospedale = {
    html(d) {
      let tacche = "";
      for (let k = 0; k < 100; k++) tacche += `<rect class="tacca${k < d.to ? " ai" : ""}" x="${60 + k * 6}" y="10" width="4.5" height="10" rx="1"/>`;
      const H = (x, y) => `<g class="h" transform="translate(${x} ${y})"><rect x="-13" y="-13" width="26" height="26" rx="4"/><path d="M-5,-6 V6 M5,-6 V6 M-5,0 H5"/></g>`;
      const paesi = [[170, 224], [196, 246], [214, 214], [232, 240], [186, 268]].map(([x, y]) => `<circle class="paese" cx="${x}" cy="${y}" r="7"/>`).join("");
      return figura("ospedale", "0 0 720 330", `
        <text class="lab" x="60" y="36">${d.to} DECISIONI SU 100 LE PRENDE DA SOLO</text>${tacche}
        <rect class="suolo" x="40" y="46" width="640" height="278" rx="6"/>
        <path class="fiume" d="M440,46 C420,110 460,170 430,230 S420,300 436,324"/>
        <rect class="ponte" x="416" y="72" width="48" height="10" rx="2"/>
        ${paesi}<text class="lab-p" x="200" y="298" text-anchor="middle">300.000 PERSONE</text>
        ${H(270, 150)}${H(580, 232)}
        <g class="x"><path d="M258,138 L282,162 M282,138 L258,162"/><text x="270" y="124" text-anchor="middle">CHIUSO</text></g>
        <path class="carta-r" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M232,240 L566,232"/>
        <text class="lab-c" x="330" y="226" text-anchor="middle">SULLA CARTA: 18 KM</text>
        <g class="noponte"><circle cx="436" cy="236" r="12"/><text x="436" y="264" text-anchor="middle">NESSUN PONTE</text></g>
        <path class="vera" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M214,208 C240,150 330,92 416,78 L464,78 C540,92 602,150 586,216"/>
        <text class="lab-v" x="556" y="112">DAVVERO: 62 KM</text>
        <g class="gente">${'<circle r="3"/>'.repeat(6)}</g>`, d);
    },
    run(fig) {
      const q = (s) => fig.querySelector(s), qa = (s) => [...fig.querySelectorAll(s)], vera = q(".vera"), tl = G.timeline(), tempi = [];
      tl.from(qa(".lab, .tacca"), { opacity: 0, duration: 0.3, stagger: 0.004 }, 0);
      qa(".tacca.ai").forEach((el, i) => { const t = 0.5 + i * 0.1; tl.set(el, { attr: { class: "tacca ai on" } }, t); tempi.push(t); });
      tl.from(qa(".suolo, .fiume, .ponte, .paese, .lab-p, .h"), { opacity: 0, duration: 0.5, stagger: 0.05 }, 1.2)
        // l'oracolo decide: l'ospedale si chiude
        .from(q(".x"), { opacity: 0, scale: 1.8, transformOrigin: "50% 50%", duration: 0.3, ease: "power4.in" }, 2.6)
        // e calcola: sulla carta, in linea d'aria
        .to(q(".carta-r"), { strokeDashoffset: 0, duration: 0.8, ease: "power1.inOut" }, 3.2)
        .from(q(".lab-c"), { opacity: 0, duration: 0.3 }, 3.6)
        // ma in mezzo c'è il fiume, e il ponte non c'è
        .from(q(".noponte"), { opacity: 0, scale: 0.5, transformOrigin: "50% 50%", duration: 0.3, ease: "back.out(2)" }, 4.4)
        .set(q(".carta-r"), { attr: { class: "carta-r rotta" } }, 4.4)
        // la strada vera
        .to(vera, { strokeDashoffset: 0, duration: 1.4, ease: "power1.inOut" }, 5)
        .from(q(".lab-v"), { opacity: 0, duration: 0.3 }, 5.8);
      conta(tl, fig, tempi, (k) => `${k}%`);
      // e la gente ci arranca sopra
      tl.eventCallback("onComplete", () => {
        const L = vera.getTotalLength();
        G.set(q(".gente"), { opacity: 1 });
        qa(".gente circle").forEach((c, i) => {
          const o = { t: i / 6 };
          vivo(G.to(o, { t: "+=1", duration: 14, ease: "none", repeat: -1, onUpdate: () => { const p = vera.getPointAtLength((o.t % 1) * L); c.setAttribute("cx", f1(p.x)); c.setAttribute("cy", f1(p.y)); } }));
        });
      });
      return tl;
    }
  };

  window.VIZ = {
    tipi, lib: { rng, shuffle, fmt, f1, milioni, angoli, figura, conta, vivo },
    // markup del beat, o "" se il beat non è una figura registrata
    html(b) { const k = Object.keys(b).find(k => tipi[k]); return k ? tipi[k].html(b[k]) : ""; },
    // anima le figure dentro root; restituisce le loro timeline
    run(root) {
      return [...root.querySelectorAll("[data-viz]")].map(fig => {
        fig.classList.add("on");
        if (!G) return null;
        const tl = tipi[fig.dataset.viz].run(fig);
        attive.push(tl);
        if (REDUCED) tl.progress(1);
        return tl;
      });
    },
    stop() { attive.splice(0).forEach(t => t.kill()); }
  };
})();
