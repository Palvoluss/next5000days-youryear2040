// SMARTPHONE — accoglienza, voto, epilogo.
// Il cid sta in localStorage, non in sessionStorage: una scheda chiusa o un
// telefono riavviato a metà serata ritrovano la stessa sessione, con i voti
// già dati (Patch §5, "sessione persa / telefono scarico").
const socket = io({ query: { role: "device" } });
const $ = (id) => document.getElementById(id);
let cid = localStorage.getItem("cid") || null;
let myVote = null;
let mioLink = null, storyFile = null, storyPer = null;   // condivisione dell'epilogo

function show(id, on) { $(id).classList.toggle("hidden", !on); }
const SEGNO = { NEGATIVO: "neg", POSITIVO: "pos", TERZA_VIA_PENTIMENTO: "terza", TERZA_VIA_RESA: "terza" };

// Quanto resta per cambiare idea. Il server manda i ms residui, non un istante:
// la scadenza la calcolo con l'orologio di QUESTO telefono, così non conta se è
// fuori sincrono col server.
let timer = null;
function runTimer(restaMs, durataSec) {
  clearInterval(timer); timer = null;
  const bar = $("voteFill"), row = bar.closest(".voterow");
  if (!restaMs || !durataSec) { row.style.display = "none"; return; }
  row.style.display = "";
  const fine = Date.now() + restaMs, tot = durataSec * 1000;
  const tick = () => {
    const resta = Math.max(0, fine - Date.now());
    bar.style.transform = `scaleX(${Math.min(1, resta / tot)})`;
    $("voteSec").textContent = Math.ceil(resta / 1000);
    if (resta <= 0) { clearInterval(timer); timer = null; }
  };
  tick();
  timer = setInterval(tick, 200);
}

function render(view) {
  const fine = !!view.ended;                       // epilogo rivelato, o serata finita
  const voting = view.phase === "voting" && view.options;
  const esito = !voting && !fine ? view.esito : null;
  show("onboarding", false);
  show("wait", !voting && !fine && !esito);
  show("voteBox", voting);
  show("esitoBox", !!esito);
  show("endBox", fine);
  document.body.classList.toggle("fine", fine);
  const ended = fine;
  renderEsito(esito);
  show("bCondividi", fine && !!(view.ended && view.ended.link));

  if (voting) {
    $("q").textContent = view.options.q;
    // opzioni NON etichettate facile/difficile (la comoda deve sembrare ragionevole)
    $("opts").innerHTML = view.options.opts.map(o =>
      `<button class="btn vote-opt ${myVote === o.tag ? "picked" : ""}" data-tag="${o.tag}">${o.label}`
      + `<span class="gc"><b>Cosa guadagni</b>${o.guadagno}</span>`
      + `<span class="gc"><b>Cosa paghi</b>${o.costo_nascosto}</span></button>`).join("");
    show("voteNote", !!myVote);
    runTimer(view.voteRestaMs, view.voteDurata);
  } else {
    runTimer(null);
    if (!ended) myVote = null;  // nuovo capitolo: reset del voto locale
  }

  if (ended && view.ended) {
    const e = view.ended;
    // il testo generato, quando il regista lo ha rivelato
    $("epilogo").textContent = e.epilogo || "";
    show("epilogo", !!e.epilogo);
    const link = $("epilogoLink");
    link.href = e.link || "#";
    link.style.display = e.link ? "" : "none";
    show("epilogoLink", !!e.link);
    mioLink = e.link;
    // la story si prepara subito: al tocco la condivisione deve partire senza
    // attese, o Safari la blocca perché non è più «dentro» il gesto
    if (e.epilogo && storyPer !== e.epilogo) {
      storyPer = e.epilogo;
      storyPNG(e).then(f => { storyFile = f; show("bStory", true); }).catch(() => {});
    }
    // Una colonna per capitolo, col numero in testa: la tua riga e quella della
    // sala. Le caselle dove sei andato per conto tuo sono le uniche evidenziate.
    const esc = (t) => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const lettera = (v) => v === "facile" ? "C" : v === "difficile" ? "F" : "·";
    const cella = (v, s, diverso) =>
      `<i class="${v ? "" : "saltato"}${diverso ? " diverso" : ""}" title="${esc(s.anno)} · ${esc(s.titolo)}">${lettera(v)}</i>`;

    $("scelte").style.gridTemplateColumns = `auto repeat(${e.scelte.length}, 1fr)`;
    $("scelte").innerHTML =
      `<span></span>` + e.scelte.map(s => `<span class="num">${s.capitolo}</span>`).join("")
      + `<span class="et">TU</span>` + e.scelte.map(s => cella(s.voto, s, s.minoranza)).join("")
      + `<span class="et">SALA</span>` + e.scelte.map(s => cella(s.vinse, s, s.minoranza)).join("");

    // la legenda a parole, e il dato più forte che ha addosso
    $("sceltePie").innerHTML =
      `<span class="muted">C strada comoda · F strada faticosa · · non votato · evidenziato: diverso dalla sala</span><br>`
      + (e.voti_espressi === 0
        ? "Non hai votato nessun capitolo: questo mondo ti è capitato addosso."
        : e.voti_in_minoranza
          ? `<b>${e.voti_in_minoranza}</b> volte hai scelto diverso dalla sala — e ha vinto lei.`
          : "Hai sempre scelto come la sala.");

    $("youClimax").textContent = e.climax.nome;
    $("youVerdict").textContent = e.climax.testo;
    $("youFired").innerHTML = e.esiti.map(x =>
      `<div class="fired ${SEGNO[x.stato]}"><span class="nome">${x.nome}</span>${x.testo}</div>`).join("");
  }
}

// La card dell'intreccio appena saldato. Riscritta solo quando cambia: ogni
// sync la rifarebbe partire da capo, animazioni comprese.
let esitoChiave = null;
function renderEsito(e) {
  const k = e ? e.id + e.stato : null;
  if (k === esitoChiave) return;
  esitoChiave = k;
  if (!e) return;
  const dec = (d) => `<div class="dec"><span class="year">${d.anno} · ${d.titolo}</span>${d.label}</div>`;
  $("esitoBox").innerHTML = `<div class="year">Si è saldato un intreccio</div>`
    + dec(e.decisioni[0]) + dec(e.decisioni[1])
    + `<div class="fired ${SEGNO[e.stato]}"><span class="nome">${e.nome}</span>${e.testo}</div>`;
}

// ---- condividi -----------------------------------------------------------
$("bCondividi").onclick = async () => {
  const url = new URL(mioLink, location.origin).href;
  if (navigator.share) return navigator.share({ title: "Il mio 2040", url }).catch(() => {});   // annullato: niente da fare
  try { await navigator.clipboard.writeText(url); alert("Link copiato: incollalo dove vuoi."); }
  catch { location.href = url; }
};
$("bStory").onclick = () => {
  if (!storyFile) return;
  if (navigator.canShare && navigator.canShare({ files: [storyFile] }))
    return navigator.share({ files: [storyFile] }).catch(() => {});
  const a = document.createElement("a");   // niente condivisione di file: si scarica
  a.href = URL.createObjectURL(storyFile); a.download = storyFile.name; a.click();
};

// ---- story Instagram: un PNG 1080×1920 disegnato qui, niente server -------
// Le fasce in alto e in basso le copre l'interfaccia di Instagram: il
// contenuto sta tra 300 e FONDO.
function righe(x, t, maxW) {
  const out = []; let r = "";
  for (const w of String(t).split(/\s+/)) {
    const prova = r ? r + " " + w : w;
    if (r && x.measureText(prova).width > maxW) { out.push(r); r = w; } else r = prova;
  }
  if (r) out.push(r);
  return out;
}
// le prime frasi dell'epilogo, tra 110 e 240 caratteri
function estratto(testo) {
  const frasi = String(testo || "").replace(/\s+/g, " ").match(/[^.!?]+[.!?]+/g) || [];
  let q = "";
  for (const f of frasi) { if (q && (q + f).length > 240) break; q += f; if (q.length >= 110) break; }
  return q.trim();
}
async function storyPNG(e) {
  try { await Promise.all([document.fonts.load("800 80px Panchang"), document.fonts.load("400 40px Sentient")]); } catch {}
  const W = 1080, H = 1920, M = 96, FONDO = 1560;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d");
  x.fillStyle = "#233e4d"; x.fillRect(0, 0, W, H);
  const g = x.createRadialGradient(0, 0, 0, 0, 0, H);   // lo stesso fondo del sito
  g.addColorStop(0, "rgba(236,174,49,0.85)"); g.addColorStop(0.65, "rgba(35,62,77,0.85)"); g.addColorStop(1, "#233e4d");
  x.fillStyle = g; x.fillRect(0, 0, W, H);

  const DISPLAY = "Panchang, system-ui, sans-serif", SERIF = "Sentient, Georgia, serif";
  const BIANCO = "#ffffff", OCRA = "#ecae31", TENUE = "rgba(255,255,255,0.8)";
  let y = 300;
  const scrivi = (t, font, colore, lh, max = 99) => {
    x.font = font; x.fillStyle = colore;
    const rr = righe(x, t, W - 2 * M);
    rr.slice(0, max).forEach((r, i) => {
      x.fillText(i === max - 1 && rr.length > max ? r.replace(/[\s,.;:]*$/, "…") : r, M, y); y += lh;
    });
  };

  scrivi("IL MIO 2040", `700 36px ${DISPLAY}`, OCRA, 80);
  if (e.nome) scrivi(e.nome.toUpperCase(), `800 88px ${DISPLAY}`, BIANCO, 100, 2);
  if (e.eta) scrivi(`Nel 2040 avrò ${e.eta}.`, `400 42px ${SERIF}`, TENUE, 58, 2);
  y += 70;
  scrivi("IL MONDO CHE ABBIAMO COSTRUITO", `700 28px ${DISPLAY}`, OCRA, 96);
  scrivi(e.climax.nome.toUpperCase(), `800 76px ${DISPLAY}`, BIANCO, 88, 2);
  y += 50;
  if (e.indice_personale != null) {
    scrivi(`${e.indice_personale}%`, `800 120px ${DISPLAY}`, OCRA, 70);
    scrivi("il mio indice di delega", `400 40px ${SERIF}`, TENUE, 56);
  }
  y += 60;
  const q = estratto(e.epilogo);
  if (q) scrivi(`«${q}»`, `400 46px ${SERIF}`, BIANCO, 66, Math.max(0, Math.floor((FONDO - y) / 66)));
  y = 1640;
  scrivi("IL LIBRO VIVO DEL 2040 · SIIDRO 2026", `700 24px ${DISPLAY}`, TENUE, 40);

  const blob = await new Promise(r => c.toBlob(r, "image/png"));
  return new File([blob], "il-mio-2040.png", { type: "image/png" });
}

// voto
document.addEventListener("click", (ev) => {
  const b = ev.target.closest(".vote-opt");
  if (!b) return;
  myVote = b.dataset.tag;
  document.querySelectorAll(".vote-opt").forEach(x => x.classList.toggle("picked", x === b));
  show("voteNote", true);
  socket.emit("device:vote", { option: myVote });
});

// ---- accoglienza ---------------------------------------------------------
function entra(dati) {
  socket.emit("device:join", { cid, ...dati }, (res) => {
    if (res && res.cid) { cid = res.cid; localStorage.setItem("cid", cid); }
    render(res || { phase: "lobby" });
  });
}

document.getElementById("onboarding").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const nome = $("fNome").value.trim(), nascita = $("fNascita").value;
  if (!nome || !nascita) return;
  // una data futura o assurda qui è quasi sempre un dito scivolato sul picker
  if (new Date(nascita) > new Date()) {
    $("fErr").textContent = "Quella data è nel futuro — controlla l'anno.";
    return show("fErr", true);
  }
  show("fErr", false);
  localStorage.setItem("nome", nome);
  entra({ nome, data_nascita: nascita });
});

socket.on("connect", () => {
  // chi ha già un cid rientra dritto: il server ha ancora nome ed età
  if (cid) return entra(null);
  show("onboarding", true);
  show("wait", false);
});
socket.on("device:sync", render);
