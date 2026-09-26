// ==========================================================================
// VIZ — il dato di ogni capitolo reso visibile. Condiviso tra main screen e
// laboratorio (lab.html): le proposte nascono nel lab, la scelta entra qui.
// Un beat di content.js con una chiave registrata in VIZ.tipi diventa una
// figura (VIZ.html); VIZ.run la anima quando il capitolo è in scena; VIZ.stop
// ferma timeline e loop prima che il capitolo venga sostituito.
// ==========================================================================
(() => {
  const G = window.gsap;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fmt = (n) => Math.round(n).toLocaleString("it-IT");
  const f1 = (n) => n.toFixed(1);
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

  window.VIZ = {
    tipi, lib: { rng, shuffle, fmt, f1, figura, conta, vivo },
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
