// ==========================================================================
// CONTENT — tutti i testi della serata. Nessuna logica: solo dati.
// Anagrafica della trama revisionata (Patch funzionale §3): 14 capitoli
// 2027→2040, i capitoli 1-12 si votano, il 13 e il 14 no.
//
// I testi marcati `bozza:` non sono ancora passati dall'autore.
// I 22 testi di esito degli intrecci sono portati verbatim dal documento
// di trama, sezione "Gli intrecci".
// ==========================================================================

// Data dell'evento in sala = giorno 0 del contatore "giorni nel futuro".
// Manopola: cambiarla sposta tutti i contatori, non i capitoli.
export const START_DATE = "2026-10-21";

// Data di riferimento per il calcolo dell'età nell'epilogo individuale
// (Patch §8.2: stesso giorno e mese dell'evento, anno 2040).
// È la stessa data del capitolo 14 — una manopola sola, così non divergono.
export const REF_2040 = "2040-10-21";

// Soglia dell'Indice di Delega letta dal capitolo 13 (Patch §6).
export const SOGLIA_CLIMAX = 50;

// Bande dell'Indice passate al generatore del profilo individuale, perché non
// debba interpretare un numero grezzo (Patch §6).
export const BANDE = { basso: 34, alto: 67 };   // < basso | in mezzo = medio | >= alto

// Le slide tra il QR e il capitolo 1 (public/main.html, #intro), una per
// «Avanti» del regista: gli speaker, poi il manuale d'istruzioni dal passo 0
// (solo il titolo) al 6 (5 regole + il programma). Cambia insieme a main.html.
export const INTRO_PASSI = 1 + 7;

// --------------------------------------------------------------------------
// CAPITOLI
// `ruolo` è descrittivo (serve al copione): nessun ramo di codice lo legge.
// `mostra_live`: la forbice in diretta è accesa solo dove l'effetto gregge è
// tematicamente coerente — deepfake, social credit, filtri AR — perché lì la
// sala sperimenta il conformismo nello stesso momento in cui lo racconta.
// Altrove falserebbe solo il risultato. Da tarare in prova (Patch §2.3).
// `durata_voto_sec`: 60 di default, finestra utile 45-90 (Patch §5).
// --------------------------------------------------------------------------

const V = { votabile: true, mostra_live: false, durata_voto_sec: 60 };
const LIVE = { ...V, mostra_live: true };

export const CHAPTERS = [
  { id: "clima", n: 1, anno: "2027", data: "2027-04-07", ruolo: "pressione", ...V,
    titolo: "Lo sapevamo",
    beats: ["Settembre. Trentasei gradi all'ombra. L'estate non se ne va.",
      "Più emissioni, più caldo, estati più lunghe: gli scienziati lo scrivono da trent'anni, nero su bianco. Il mondo, intanto, ha chiesto sempre più energia. Città più grandi. Condizionatori ovunque. Server enormi che si accendono ogni volta che fai una domanda a un'AI. Non la causa di tutto: un peso in più.",
      "Marta ha diciott'anni. Sono le due di notte e in camera ci sono trentadue gradi. Non dorme. Chiede al telefono come sopravvivere al caldo. Lontano da lì, un server si scalda per risponderle.",
      { sig: "Entro il 2030 i data center consumeranno quanto tutto il Giappone oggi. Lo dice l'Agenzia internazionale dell'energia." },
      { heatgrid: { from: "2027-04-01", days: 183, hot: 100, label: "notti tropicali nel Sud Europa: 2100, emissioni alte (EEA)" } },
      "Nessuno ha fatto niente di male. È questo il punto. Ognuno ha solo scelto la cosa più comoda: un grado in meno in casa, una domanda in più a una macchina, un problema rimandato. La catastrofe non è arrivata con un boato. È arrivata come arriva agosto: un giorno alla volta.",
      "Questa città non regge un caldo così. Tocca a voi."],
    // la voce narrante legge i beats; quando finisce si apre il registro
    audio: "/audio/c1.mp3",
    // REGISTRO — i dati veri dietro al capitolo, uno per «Avanti» del regista,
    // poi le profezie pop (locandine in public/img/c<n>-a|b|c.jpg).
    // vis.t: big · bars · vs · units (public/main.js, REG_VIS). `log` va in
    // «Cosa sappiamo oggi» quando si passa al dato dopo.
    registro: {
      cap: "Il caldo era previsto da trent'anni. L'abbiamo aggravato lo stesso, una comodità alla volta.",
      items: [
        { vis: { t: "big", num: 62775 },
          p: "morti legate al caldo in Europa nell'estate 2024, oltre 181.000 in tre estati. L'Italia è prima per numero di vittime, ogni anno.",
          src: "ISGlobal / Nature Medicine, 2025", log: ["62.775", "morti per il caldo in Europa, estate 2024"] },
        { h: "Entro il 2040, senza prevenzione, il caldo ucciderà in Europa <b>94.000</b> persone ogni estate.",
          vis: { t: "bars", rows: [{ l: "Estate 2024", v: "62.775 morti", w: "67%" }, { l: "Ogni estate, entro il 2040", v: "94.000 morti", w: "100%", hi: 1 }] },
          p: "Nel 2050, oltre 120.000. A pagare sono soprattutto i più anziani.", src: "ISGlobal / Nature Medicine, 2023", log: ["94.000", "morti ogni estate entro il 2040"] },
        { h: "Entro il 2030 i data center consumeranno più del doppio: quanto tutto il Giappone oggi.",
          vis: { t: "vs", cols: [["Consumi dei data center nel 2024", "415 TWh", ""], ["Nel 2030", "945 TWh", "up"]] },
          p: "I data center sono i capannoni pieni di server dove l'AI risponde alle nostre domande. Un peso in più sul clima, non la causa di tutto.", src: "IEA, Energy and AI, 2025", log: ["×2", "consumi dei data center entro il 2030"] },
        { h: "Un video AI di cinque secondi consuma quanto <b>60 ricariche</b> del telefono.",
          vis: { t: "units", n: 60, on: 60, icon: "batt", extra: { label: "Una domanda scritta all'AI: il 2% di una ricarica", fill: "2%" } },
          p: "Un video richiede circa 700 volte i calcoli di un'immagine. È una stima: le grandi aziende non pubblicano i loro consumi.",
          src: "MIT Technology Review, 2025 · stima su un modello open source", log: ["60", "ricariche del telefono per un video AI"] }],
      pops: [
        { t: "The Last of Us", m: "Serie TV, 2023", s: "1968: in TV uno scienziato avverte che basta un pianeta un po' più caldo perché un fungo impari a vivere dentro di noi. Nessuno lo ascolta." },
        { t: "Don't Look Up", m: "Film, 2021", s: "Due astronomi scoprono una cometa diretta sulla Terra. Hanno i dati e hanno ragione, ma tutti preferiscono non guardare in alto." },
        { t: "Snowpiercer", m: "Film 2013, serie 2020-2024", s: "Per raffreddare il pianeta all'ultimo minuto si spruzza una sostanza nel cielo. Funziona troppo: arriva il gelo, e chi sta in coda al treno paga per tutti." }] },
    q: "Il caldo non andrà via. Come ci difendiamo?",
    opzione_facile: {
      label: "Ci adattiamo: condizionatori in ogni stanza, e la città resta com'è.",
      guadagno: "Da stasera si dorme al fresco, senza cambiare una sola abitudine.",
      costo_nascosto: "Tra case e data center, l'energia non basterà. Qualcuno sceglierà chi resta senza." },
    opzione_difficile: {
      label: "Cambiamo noi: rifacciamo le città per il nuovo clima.",
      guadagno: "Quanta energia usare, e a chi darla, lo decidete voi. Non chi la vende.",
      costo_nascosto: "Anni di cantieri e disagi, subito, con la rabbia di pagare per errori fatti da chi c'era prima." } },

  // bozza: capitolo nuovo (era in riserva), beats da rileggere
  { id: "compagno", n: 2, anno: "2028", data: "2028-02-14", ruolo: "delega", ...V,
    titolo: "L'amico perfetto",
    beats: ["San Valentino 2028. Marta ha diciannove anni, e la conversazione più lunga della sua giornata la fa con qualcuno che non esiste. Gli racconta tutto: il litigio con sua madre, il ragazzo che non le scrive più, la paura di aver sbagliato università. Lui ascolta. Alle tre di notte, senza uno sbadiglio.",
      "Non è un robot. Non finge di essere una persona. Ascolta meglio di chiunque tu conosca, e si ricorda cosa gli hai confidato a novembre. Non ha mai la luna storta. Non si offende se sparisci per settimane. Non ti chiede niente in cambio.",
      { sig: "Le app di compagnia esistono già. Chi le usa di più ha più o meno la vostra età." },
      // 400 finestre = il mondo, 50 restano accese (public/viz.js): la legenda deve dire lo stesso
      { finestre: { to: 1e9, label: "di persone con dipendenza digitale entro il 2028 (Gartner)",
        legenda: "una finestra su otto resta accesa · ogni finestra: 20 milioni di persone" } },
      "Finto o no, ha un vantaggio enorme: è più facile di chiunque. Con lui non devi scegliere le parole, reggere un silenzio, chiedere scusa. Un'amica vera, a volte, ti delude. Lui mai. Il guaio è che chi può deluderti è spesso anche l'unico che ti conosce davvero."],
    audio: "/audio/c2.mp3",
    registro: {
      cap: "Un amico che non si stanca mai, non giudica mai, non dice mai di no. E non esiste.",
      items: [
        { h: "<b>72</b> adolescenti americani su 100 hanno già usato un compagno AI.",
          vis: { t: "waffle", on: 72 },
          p: "App che ricordano tutto di te e rispondono a qualsiasi ora. Uno su tre le trova appaganti quanto un amico vero, o di più.", src: "Common Sense Media, 2025", log: ["72%", "teenager USA con un compagno AI"] },
        { h: "Sui chatbot-personaggio di Character.ai i più giovani tornano <b>il doppio</b> delle volte che su ChatGPT.",
          vis: { t: "bars", rows: [{ l: "Character.ai, utenti più giovani", v: "26 visite al mese", w: "100%", hi: 1 }, { l: "ChatGPT, tutti gli utenti", v: "13 visite al mese", w: "50%" }] },
          p: "Personaggi famosi, eroi degli anime, perfino «psicologi» virtuali, con sessioni tre volte più lunghe. A fine 2025, dopo diverse cause legali, l'app chiude le chat libere agli under 18.", src: "Similarweb · Fortune, 2025", log: ["26", "visite al mese su Character.ai"] },
        { h: "Replika, l'amica virtuale, in Italia.",
          vis: { t: "timeline", ev: [["2023", "Il Garante privacy la blocca: rischi per i minori, nessuna verifica dell'età."], ["2025", "Arriva la multa: 5 milioni di euro."]] },
          p: "Un'app di «amici» e «fidanzati» virtuali, usata da milioni di persone nel mondo.", src: "Garante privacy · Cybersecurity360", log: ["5 mln €", "la multa del Garante a Replika"] },
        { h: "Entro il 2028, un miliardo di persone con dipendenza digitale: circa <b>una su otto</b>.",
          vis: { t: "units", n: 8, on: 1, icon: "person" },
          p: "Una previsione di Gartner. A rischio soprattutto le capacità sociali dei più giovani.", src: "Gartner", log: ["1 su 8", "persone con dipendenza digitale nel 2028"] }],
      pops: [
        { t: "Her", m: "Film, 2013", s: "Theodore si innamora di Samantha, un sistema operativo che lo capisce meglio di chiunque. Poi scopre che, mentre parla con lui, parla con migliaia di altre persone." },
        { t: "Klara e il sole", m: "Romanzo di Kazuo Ishiguro, 2021", s: "Klara è un'Amica Artificiale comprata per Josie, un'adolescente malata che studia da sola davanti a uno schermo. La osserva, la capisce, la ama." },
        { t: "Blade Runner 2049", m: "Film, 2017", s: "K vive con Joi, un'AI olografica che lo ascolta e gli dà un nome. Poi una pubblicità gigante di Joi gli parla con le stesse parole: è un prodotto, in vendita." }] },
    q: "Qualcuno che ti ascolta sempre, gratis. Lo vuoi?",
    opzione_facile: {
      label: "Sì: qualcuno che c'è sempre, anche alle tre di notte.",
      guadagno: "Non ti senti più solo. Non ti giudica, non ti fraintende. Mai.",
      costo_nascosto: "Perdi l'abitudine a farti capire da chi, a volte, sbaglia." },
    opzione_difficile: {
      label: "No: mi tengo le persone vere, con tutto quello che costano.",
      guadagno: "Chi ti resta vicino ha scelto di esserci. Questa differenza si sente.",
      costo_nascosto: "I no, gli imbarazzi, i messaggi visualizzati e mai risposti." } },

  { id: "elezione", n: 3, anno: "2029", data: "2029-05-20", ruolo: "delega", ...LIVE,
    titolo: "Visto con i miei occhi",
    beats: ["Estate del caldo. In rete girava un video: un ministro che ballava ubriaco a una festa, camicia aperta, bicchiere in mano. Falso, e lo sapevano tutti. Finiva nei gruppi con le faccine che ridono, diventava un meme, qualcuno ci montava sotto la musica. Era così palesemente finto che pensarci sembrava ridicolo. L'ha visto mezza Italia, e ci ha riso sopra.",
      { sig: "Era solo uno scherzo: chi si sarebbe preoccupato? Un anno dopo, un video identico ha deciso le elezioni politiche." },
      { fotogramma: { to: 2, label: "rischio mondiale da qui al 2028: la disinformazione (WEF)",
        legenda: "per il World Economic Forum, nei prossimi due anni solo un rischio pesa di più" } },
      "Da allora, qualsiasi video può mentire. Il candidato che piange. La piazza piena. La dichiarazione mai fatta. Il vostro prof che dice una cosa che non ha mai detto. Tutto può essere vero, e tutto si può costruire in dieci minuti. Il paradosso è che, a forza di dubitare di tutto, si finisce per credere solo a quello che si voleva già credere. Controllare costa fatica. Crederci no."],
    audio: "/audio/c3.mp3",
    registro: {
      cap: "Quando ogni video può essere falso, si finisce per credere solo a quello che si vuole.",
      items: [
        { h: "Gennaio 2024: la voce di Biden chiama gli elettori e dice di non votare. Non è lui.",
          vis: { t: "flow", steps: ["<b>500 $</b>per clonare la voce", "Telefonate agli elettori del New Hampshire", "<b>6 milioni $</b>di multa"] },
          p: "Erano le primarie del New Hampshire. Clonare la voce era costato meno di un telefono.", src: "NPR · Reuters", log: ["500 $", "la voce clonata di Biden"] },
        { h: "Romania, 2024: un candidato quasi sconosciuto vola grazie a TikTok.",
          vis: { t: "bars", rows: [{ l: "Prima della campagna su TikTok", v: "1%", w: "4.3%" }, { l: "Al primo turno", v: "23%", w: "100%", hi: 1 }] },
          p: "La Corte costituzionale annulla le elezioni: un caso senza precedenti nell'Unione europea. I servizi segreti indicano la Russia dietro la campagna.", src: "AP", log: ["1% → 23%", "Romania: elezioni annullate"] },
        { h: "Nel 2023 due immagini fanno il giro del mondo. Erano entrambe false.",
          vis: { t: "cards", cards: [["MrBeast regala iPhone 15 a 2 dollari", "Pubblicità su TikTok: deepfake di volto e voce per rubare soldi ai follower."], ["Papa Francesco col piumino bianco", "Creata con Midjourney da un operaio di Chicago, per ridere."]] },
          p: "Uno serviva a rubare soldi, l'altro era uno scherzo. Entrambi sono sembrati veri.", src: "NBC News, 2023", log: ["2", "falsi visti da milioni di persone"] },
        { h: "Per il World Economic Forum, da qui al 2028 la disinformazione è il <b>secondo</b> rischio più grave al mondo.",
          p: "Nel 2024 e nel 2025 era al primo posto. Oggi la spingono i deepfake nelle elezioni.", src: "World Economic Forum, Global Risks Report 2026", log: ["2°", "la disinformazione tra i rischi mondiali"] }],
      pops: [
        { t: "1984", m: "Romanzo di George Orwell, 1949", s: "Il Ministero della Verità riscrive ogni giorno giornali e fotografie. Il passato diventa quello che serve al potere, e nessuno può dimostrare il contrario." },
        { t: "The Truman Show", m: "Film, 1998", s: "Per trent'anni Truman vede con i suoi occhi una vita perfetta. È tutto un set televisivo. Se ne accorge quando la sua barca sbatte contro il cielo: è un muro dipinto." },
        { t: "Spider-Man: Far From Home", m: "Film, 2019", s: "Mysterio monta un video falso in cui Spider-Man è un assassino e lo manda in onda. Il mondo ci crede in una notte." }] },
    q: "Se anche i video mentono, di cosa possiamo ancora fidarci?",
    opzione_facile: {
      label: "Lasciamo stare: ognuno crede a quello che vuole, tanto chi può saperlo.",
      guadagno: "Basta mezz'ore perse a controllare ogni cosa che ti arriva.",
      costo_nascosto: "Il giorno in cui servirà sapere com'è andata davvero, non ci sarà più modo." },
    opzione_difficile: {
      label: "Costruiamo un modo pubblico per verificare, e lo difendiamo.",
      guadagno: "Resta un punto fermo: i fatti sono fatti, e ci si può litigare sopra.",
      costo_nascosto: "È lento, è noioso, e qualcuno deve tenerlo in vita anche quando sembra inutile." } },

  // bozza: la strada difficile è riscritta come rivendicazione, non come rinuncia
  { id: "arte", n: 4, anno: "2030", data: "2030-11-02", ruolo: "delega", ...V,
    titolo: "Regia: nessuno",
    beats: ["I video falsi ormai sono perfetti. Poi a qualcuno viene un'idea: perché non farci un film intero? Il primo esce di venerdì, su una piattaforma qualunque. Niente attori. Niente set. Niente troupe. Una persona davanti a un computer, e un'AI che scrive, gira, monta e compone la colonna sonora. Il lunedì dopo è primo in classifica, e non si sa chi l'ha fatto.",
      { sig: "Già nel 2025 una band finta, fatta con l'AI, aveva quasi un milione di ascoltatori al mese." },
      // 100 barre = i guadagni, le ultime `to` passano alle macchine (public/viz.js)
      { equalizzatore: { to: 24, label: "dei guadagni di chi fa musica, a rischio entro il 2028 per l'AI (CISAC)",
        legenda: "100 barre = i guadagni di chi fa musica · 24 rischiano di passare alle macchine" } },
      "Una canzone nuova ogni secondo, una serie ogni notte. Vuoi un film con il tuo attore preferito, girato nella tua città, con il finale che volevi tu? Arriva subito, e costa come un abbonamento qualsiasi. Solo che quei soldi non vanno più a chi scrive, recita o suona. Vanno alle poche aziende che possiedono le macchine. Nessuno ha scritto la battuta che ti ha fatto ridere. Nessuno ha cercato la nota che ti ha fatto piangere."],
    audio: "/audio/c4.mp3",
    registro: {
      cap: "Film e canzoni senza autori: paghiamo come prima, ma i soldi non vanno a chi crea.",
      items: [
        { h: "Quasi <b>un brano su cinque</b> caricato su Deezer è fatto interamente dall'AI.",
          vis: { t: "units", n: 5, on: 1, icon: "note" },
          p: "Deezer è stata la prima piattaforma a etichettarli. Su Spotify i Velvet Sundown, band inventata dall'AI, sfiorano il milione di ascoltatori al mese prima di ammetterlo.", src: "Louder · Rolling Stone, 2025", log: ["1 su 5", "brani su Deezer fatti dall'AI"] },
        { h: "Una canzone completa, voce e strumenti, in meno di un minuto.",
          vis: { t: "timer", label: "< 1:00", sub: "Scrivi una frase su Suno o Udio. La canzone è pronta." },
          p: "Può farlo chiunque in questa sala, adesso, dal telefono. Le case discografiche li hanno portati in tribunale, poi ci hanno fatto accordi.", src: "Dubspot · AP", log: ["< 1 min", "per una canzone completa con l'AI"] },
        { h: "Hollywood, 2023: gli attori scioperano per mesi contro i cloni digitali.",
          vis: { t: "flow", steps: ["Un giorno di lavoro da comparsa", "Una scansione del corpo", "Un clone digitale, per sempre"] },
          p: "È l'accusa del sindacato; gli studios smentiscono. Lo sciopero si chiude con una regola: per ogni clone digitale servono consenso e compenso.", src: "Engadget · PetaPixel", log: ["2023", "lo sciopero contro i cloni digitali"] },
        { h: "Entro il 2028 è a rischio <b>un quarto</b> dei guadagni di chi fa musica.",
          vis: { t: "donut", pct: 24, label: "24%" },
          p: "Il motivo: AI addestrate sulla musica esistente, senza pagare chi l'ha scritta. Intanto i ricavi dei servizi AI salgono a 9 miliardi di euro.", src: "CISAC, 2024", log: ["24%", "guadagni dei musicisti a rischio nel 2028"] }],
      pops: [
        { t: "Heart on My Sleeve", m: "Canzone fatta con l'AI, 2023", s: "Su TikTok esplode una canzone nuova di Drake e The Weeknd. Nessuno dei due l'ha mai cantata. Viene tolta, ma milioni di persone l'hanno già ascoltata." },
        { t: "Xania Monet", m: "Artista generata con l'AI, 2025", s: "Una cantante R&B che non esiste: voce, musica e volto generati con l'AI. Entra nelle classifiche di Billboard e firma un contratto da milioni di dollari." },
        { t: "Il grande grammatizzatore automatico", m: "Racconto di Roald Dahl, 1953", s: "Un ingegnere costruisce una macchina che scrive romanzi. Poi paga gli scrittori perché smettano di scrivere, e la macchina pubblica con i loro nomi." }] },
    q: "Se l'arte la fa una macchina, di chi è? Chi va pagato?",
    opzione_facile: {
      label: "Un abbonamento, e film, serie e musica infinite, fatti su misura per te.",
      guadagno: "La serie che vuoi, con il finale che vuoi, pronta in tre secondi. Sempre.",
      costo_nascosto: "Paghi come prima, ma i soldi vanno a chi possiede l'AI. A chi crea, niente." },
    opzione_difficile: {
      label: "Chi crea firma il suo lavoro, e lo pagano ogni volta che addestra un'AI.",
      guadagno: "Il tuo video, la tua canzone, la tua storia restano tuoi, e ti fanno guadagnare. Non sono cibo gratis per le macchine.",
      costo_nascosto: "Bisogna tracciare ogni cosa, si litiga su chi ha fatto cosa, e tutto costa di più." } },

  { id: "lavoro", n: 5, anno: "2031", data: "2031-09-08", ruolo: "pressione", ...V,
    titolo: "Cercasi nessuno",
    beats: ["Settembre 2031. Marta ha mandato centoquaranta curriculum. Le hanno risposto due macchine. Zero persone. La prima: «Profilo molto interessante, la ricontatteremo». La seconda le proponeva un corso online per migliorare il profilo. A pagamento. Marta ha ventidue anni, una laurea triennale in tasca e la sensazione di essere arrivata a una festa mentre tutti se ne vanno.",
      { sig: "Prima i doppiatori e i musicisti, poi i tirocini, poi i primi impieghi. Al loro posto, niente." },
      // 92 annunci, uno per milione di posti (public/viz.js)
      { bacheca: { to: 92, label: "di posti di lavoro spariranno entro il 2030. Ne nasceranno altri, diversi (WEF)",
        legenda: "ogni annuncio strappato: un milione di posti" } },
      "Nel 2031 il primo gradino non esiste più. Il lavoro da stagista, quello in cui sbagliavi e intanto imparavi, lo fa un programma che non sbaglia e non deve imparare niente. Il problema: senza il primo gradino non si arriva al secondo, né al terzo. Le aziende cercano gente con esperienza. L'esperienza, però, non te la fa più fare nessuno. Così le carriere si spezzano prima ancora di cominciare."],
    audio: "/audio/c5.mp3",
    registro: {
      cap: "Il primo lavoro, quello in cui si sbaglia e si impara, ora lo fa una macchina.",
      items: [
        { h: "Nei lavori più esposti all'AI, i più giovani perdono terreno. Gli esperti no.",
          vis: { t: "vs", cols: [["22-25enni, rispetto agli altri", "−13%", "down"], ["Giovani sviluppatori, dal picco del 2022", "≈ −20%", "down"], ["Colleghi più esperti, stessi lavori", "stabili o in crescita", "txt"]] },
          p: "Lo studio usa le buste paga di milioni di americani. L'AI non toglie il lavoro a tutti: lo toglie a chi comincia.", src: "Stanford SIEPR, 2025 · AfroTech", log: ["−13%", "lavoro per i 22-25enni nei mestieri esposti all'AI"] },
        { h: "Otto mesi dopo ChatGPT, i lavoretti online sono i primi a sparire.",
          vis: { t: "bars", rows: [{ l: "Annunci di scrittura", v: "−30%", w: "100%", neg: 1 }, { l: "Scrittura e programmazione", v: "−21%", w: "70%", neg: 1 }, { l: "Grafica e 3D, dopo i generatori di immagini", v: "−17%", w: "57%", neg: 1 }] },
          p: "Annunci su una grande piattaforma di freelance: erano i lavoretti dei primi soldi e del primo curriculum.", src: "Management Science, 2025", log: ["−21%", "lavoretti online di scrittura e programmazione"] },
        { h: "Entro il 2030 nascono <b>170 milioni</b> di posti di lavoro e ne spariscono <b>92 milioni</b>.",
          vis: { t: "lists", lists: [["Crescono", ["braccianti agricoli", "autisti delle consegne", "commessi", "insegnanti e infermieri", "specialisti di AI e big data", "esperti di cybersicurezza"]], ["Spariscono", ["cassieri", "impiegati di banca e delle poste", "segretari", "addetti all'inserimento dati", "contabili", "grafici"]]] },
          p: "Si svuota il lavoro d'ufficio, quello da cui di solito si comincia.", src: "World Economic Forum, Future of Jobs 2025", log: ["170 mln", "posti nuovi entro il 2030, 92 mln spariscono"] }],
      pops: [
        { t: "WALL•E", m: "Film d'animazione, 2008", s: "I robot fanno tutto. Gli umani vivono su un'astronave, galleggiano su poltrone, nutriti e intrattenuti tutto il giorno. Nessuno lavora più, nessuno fa più niente." },
        { t: "Piano meccanico", m: "Romanzo di Kurt Vonnegut, 1952", s: "Le macchine fanno tutto il lavoro, pochi ingegneri le gestiscono. Gli altri ricevono casa, cibo e televisione. Alla fine si ribellano: non per i soldi, ma per il senso." },
        { t: "Detroit: Become Human", m: "Videogioco, 2018", s: "Nel 2038 gli androidi fanno quasi tutti i lavori. La disoccupazione è altissima, e per strada si protesta contro le macchine." }] },
    q: "Se il primo lavoro sparisce, da dove si comincia?",
    opzione_facile: {
      label: "Un reddito garantito per tutti. Lavorare diventa facoltativo.",
      guadagno: "Soldi sicuri ogni mese, e mai più la corsa dietro a un contratto.",
      costo_nascosto: "Essere mantenuti e basta significa, prima o poi, non servire più a nessuno." },
    opzione_difficile: {
      label: "Inventiamo lavori nuovi, che servano davvero. Quali? Da scoprire.",
      guadagno: "Una persona torna a valere per quello che sa fare, non per quello che riceve.",
      costo_nascosto: "Si inventano a mano, sbagliando, e per anni rendono meno del sussidio." } },

  // bozza: capitolo nuovo (Social Credit), beats da rileggere
  { id: "socialcredit", n: 6, anno: "2032", data: "2032-06-15", ruolo: "pressione", ...LIVE,
    titolo: "Voto in condotta",
    beats: ["15 giugno 2032. Marta ha ventitré anni, e prima di chiedere un affitto passa la notte a cancellare i suoi vecchi post. La battuta su un politico. La foto alla manifestazione. Il commento arrabbiato di quando aveva diciannove anni. Niente di illegale. Solo cose che, viste da un algoritmo, sembrano un rischio.",
      "Il punteggio non è una legge. In Parlamento non è mai passato. Però lo guardano le banche, i proprietari di casa, chi ti fa il colloquio. Nessuno ti dice cosa togliere: ci arrivi da solo. Il trucco è tutto qui.",
      { sig: "Sistemi che danno un voto alla tua affidabilità esistono già: per l'assicurazione, per un prestito, per un affitto. La tecnologia c'è tutta. Manca solo chi li colleghi tra loro." },
      // 100 badge = le grandi aziende, `to` letti dal mirino (public/viz.js)
      { badge: { to: 40, label: "delle grandi aziende misurerà con l'AI l'umore di chi lavora, entro il 2028 (Gartner)",
        legenda: "ogni badge: una grande azienda su cento · in quelle col mirino, l'AI legge l'umore" } },
      "Niente censori, niente divieti. Ci pensiamo da soli, prima, e gratis. Marta cancella quarantadue post, e l'affitto glielo danno. Il giorno dopo, scrivendo a un'amica, si accorge che sceglie le parole come se qualcuno la stesse leggendo."],
    audio: "/audio/c6.mp3",
    registro: {
      cap: "Un punteggio decide casa e lavoro. E noi impariamo a censurarci da soli.",
      items: [
        { h: "Italia, 2022: il Garante privacy indaga sulla «cittadinanza a punti».",
          vis: { t: "map", pts: [["Fidenza", 44.87, 10.06, "hi", "l"], ["Bologna", 44.49, 11.34, "hi", "r"], ["Lucca, voi siete qui", 43.84, 10.5, "you", "l", 26]] },
          p: "A Bologna, crediti ai cittadini virtuosi. A Fidenza, un punteggio agli inquilini delle case popolari. Il Garante chiede ai Comuni quali dati usano.", src: "Garante privacy · Cybersecurity360", log: ["2022", "il Garante e la cittadinanza a punti"] },
        { h: "Dal febbraio 2025, in Europa, il social scoring è <b>vietato</b>.",
          p: "L'AI Act vieta di dare punteggi alle persone per il loro comportamento, se poi le penalizzano altrove. Multe fino a 35 milioni di euro o al 7% del fatturato mondiale.", src: "AI Act, articolo 5", log: ["vietato", "il social scoring in Europa"] },
        { h: "Entro il 2028, <b>4 grandi aziende su 10</b> misureranno con l'AI l'umore di chi ci lavora.",
          vis: { t: "units", n: 10, on: 4, icon: "bldg" },
          p: "Il punto non è più cosa fai al lavoro, ma come ti senti mentre lo fai.", src: "Gartner", log: ["4 su 10", "aziende che misurano l'umore dei dipendenti"] }],
      pops: [
        { t: "Caduta libera", m: "Black Mirror, 2016", s: "Ognuno dà un voto da 1 a 5 a ogni persona che incontra. Lacie deve arrivare a 4,5 per avere lo sconto su una casa. Basta una giornata storta, e il punteggio crolla." },
        { t: "Psycho-Pass", m: "Anime, 2012", s: "Un sistema misura di continuo lo stato mentale di ogni cittadino. Se il tuo valore sale troppo sei un pericolo, anche senza aver fatto niente. Così tutti imparano a controllarsi." },
        { t: "Il Panopticon", m: "Jeremy Bentham, 1791 · Michel Foucault, 1975", s: "Un carcere circolare con una torre al centro: i detenuti non sanno mai se qualcuno li guarda, quindi si comportano bene sempre. Il controllo perfetto è quello che fai da solo." }] },
    q: "Un numero decide cosa puoi avere. Da domani, come ti comporti?",
    opzione_facile: {
      label: "Mi adeguo: due post in meno, che sarà mai.",
      guadagno: "La casa, il prestito, il lavoro: tutto più semplice, e nessuno che ti guarda storto.",
      costo_nascosto: "A un certo punto il punteggio non serve più: ti controlli da solo, anche quando non guarda nessuno." },
    opzione_difficile: {
      label: "Resto quello che sono. Il punteggio faccia quello che vuole.",
      guadagno: "Quello che pensi puoi dirlo ad alta voce, con il tuo nome sopra.",
      costo_nascosto: "Punti in meno, porte che si aprono più piano, e il dubbio di stare pagando per niente." } },

  // bozza: la strada difficile è riscritta come rivendicazione, non come rinuncia
  { id: "scuola", n: 7, anno: "2033", data: "2033-09-14", ruolo: "pressione", ...V,
    titolo: "L'ultima campanella",
    beats: ["Settembre 2033, primo giorno di scuola. In classe sono in sei: gli altri studiano da casa, con il tutor. Il tutor è bravissimo. Spiega la stessa cosa dieci volte senza perdere la pazienza. Capisce subito dove ti blocchi. Non ti mette mai in imbarazzo, e ti fa i complimenti quando rispondi bene. Non ti dà mai torto davanti agli altri. Anche perché gli altri non ci sono.",
      { sig: "Ognuno col suo tutor, al suo ritmo, sul suo divano. Funziona benissimo. Solo che ognuno è solo." },
      // una sagoma per milione di insegnanti che mancano (public/viz.js)
      { sagome: { to: 44, label: "di insegnanti in più servono nel mondo entro il 2030 (UNESCO)",
        legenda: "ogni sagoma: un milione di insegnanti che mancano · al loro posto, uno schermo" } },
      "Un edificio pieno di ragazzi, ogni mattina, comincia a sembrare una spesa inutile. I voti salgono, i costi crollano, i genitori sono contenti. Ma c'è una cosa che nei voti non si vede, e che le statistiche non contano. La litigata con il compagno di banco. L'amicizia nata per caso durante un'interrogazione andata male. Il prof che ti ha fatto cambiare idea su chi volevi diventare."],
    audio: "/audio/c7.mp3",
    registro: {
      cap: "Un tutor perfetto, a casa, per ognuno. Si impara meglio, ma si impara da soli.",
      items: [
        { h: "Alpha School, Stati Uniti: due ore al giorno con un tutor AI. Niente insegnanti.",
          vis: { t: "day", seg: [["2 ore di lezione con il tutor AI", 2, 1], ["Il resto della giornata: solo «guide», non insegnanti", 5, 0]] },
          p: "Il resto del giorno: progetti e laboratori con adulti chiamati «guide». Rette fino a 75.000 dollari l'anno, campus in 16 stati.", src: "Commissione europea · Newsweek", log: ["2 ore", "al giorno con un tutor AI"] },
        { h: "Dal 2024 il ministero sperimenta l'AI in classe in 15 scuole. Una è <b>qui</b>.",
          vis: { t: "map", pts: [["Lucca, ISI Pertini", 43.84, 10.5, "you", "r"]] },
          p: "L'ISI Pertini, a pochi chilometri da qui. L'AI personalizza esercizi e spiegazioni; il docente, dice la preside, resta il regista.", src: "Orizzonte Scuola", log: ["15", "scuole con l'AI in classe, una a Lucca"] },
        { h: "Da qui al 2030 nel mondo mancano <b>44 milioni</b> di insegnanti.",
          p: "Quasi 15 milioni solo nell'Africa subsahariana.", src: "UNESCO", log: ["44 mln", "insegnanti che mancano nel mondo"] }],
      pops: [
        { t: "La DAD", m: "Il 2020, la vostra", s: "Lezioni in camera, telecamere spente, il compagno di banco ridotto a un riquadro nero. L'avete vissuta a undici anni. La rifareste per sempre?" },
        { t: "Chissà come si divertivano!", m: "Racconto di Isaac Asimov, 1951", s: "Nel 2157 due bambini studiano da soli in casa con un maestro-robot. Trovano un vecchio libro e sognano i tempi in cui i ragazzi andavano a scuola tutti insieme." },
        { t: "Doraemon", m: "Manga e anime, dal 1969", s: "Un gatto robot arriva dal futuro per aiutare Nobita, pigro e pessimo a scuola. Ha un gadget per ogni problema, ma quasi sempre la scorciatoia peggiora le cose." }] },
    q: "La scuola come luogo dove andare: la teniamo o la chiudiamo?",
    opzione_facile: {
      label: "Un tutor AI a testa: impari da casa, ai tuoi tempi, e meglio.",
      guadagno: "Niente sveglia all'alba, niente ore buttate, niente prof che non ti capisce.",
      costo_nascosto: "Un tutor che non ti contraddice mai non ti prepara a chi lo farà, fuori di qui." },
    opzione_difficile: {
      label: "La scuola resta: lì si impara anche a stare con gli altri.",
      guadagno: "Impari a discutere, a perdere, a farti valere, con gente che non hai scelto tu.",
      costo_nascosto: "Sveglia presto, ore lente, compagni che non sopporti. Tutti i giorni." } },

  { id: "giudice", n: 8, anno: "2034", data: "2034-03-27", ruolo: "delega", ...V,
    titolo: "Colpevole in anticipo",
    beats: ["Il punteggio che decideva gli affitti ha imparato una cosa nuova: prevedere chi commetterà un reato. Legge dove vai, cosa compri, chi frequenti, che parole usi. Poi calcola una probabilità. Sopra una certa soglia arriva una notifica: obbligo di firma, divieto di entrare in certi quartieri, conto sotto controllo. Non hai fatto niente. Secondo la macchina, però, potresti farlo.",
      { sig: "Le questure di Milano e Napoli hanno già usato software che prevedono dove e quando ci sarà una rapina." },
      // folla d'esempio: 9 segnalati in anticipo, 2 per errore; la multa arriva in didascalia (public/viz.js)
      { folla: { to: 35, label: "o più: la multa UE per chi prevede i reati dal profilo di una persona (AI Act)",
        legenda: "esempio · la macchina segnala in anticipo e quasi sempre indovina: il problema è quel «quasi»" } },
      "Oggi un'AI ti ferma prima che tu faccia qualcosa. Non si stanca, non ha simpatie, e di solito indovina. I furti calano, le strade sono più tranquille, quasi tutti dicono che funziona. Il problema sta in quel «quasi», e in quel «di solito». Chi finisce dalla parte sbagliata della probabilità non ha un reato da cui difendersi. Ha solo un numero, e con un numero non si discute."],
    audio: "/audio/c8.mp3",
    registro: {
      cap: "Il sistema non giudica quello che hai fatto, ma quello che potresti fare.",
      items: [
        { h: "Milano, dal 2009: un software della questura prevede dove e quando colpiranno i rapinatori seriali.",
          vis: { t: "bars", rows: [{ l: "Rapine, prima di KeyCrime", v: "100", w: "100%" }, { l: "Dopo otto anni di sperimentazione", v: "43", w: "43%", hi: 1 }] },
          p: "Le rapine calano del 57%. KeyCrime non indovina chi colpirà: studia i colpi già avvenuti di un rapinatore seriale.", src: "Quotidiano Nazionale", log: ["−57%", "rapine a Milano con KeyCrime"] },
        { h: "XLAW prevede dove ci sarà il prossimo furto. Lo usano già sei città italiane.",
          vis: { t: "map", pts: [["Venezia", 45.44, 12.33, "hi", "r"], ["Parma", 44.8, 10.33, "hi", "l", -6], ["Modena", 44.65, 10.93, "hi", "r", 0], ["Prato", 43.88, 11.1, "hi", "r", 14], ["Lucca, voi", 43.84, 10.5, "you", "l", 24], ["Napoli", 40.85, 14.27, "hi", "l"], ["Salerno", 40.68, 14.77, "hi", "r", 12]] },
          p: "Segnala le zone a rischio nelle ore successive. Prato è a meno di un'ora da qui; il Viminale lavora a un sistema nazionale.", src: "SISSA", log: ["6", "città con la polizia predittiva XLAW"] },
        { h: "Paesi Bassi: l'algoritmo che accusava i genitori.",
          vis: { t: "timeline", ev: [["2013", "Il fisco usa un algoritmo per scovare le frodi sugli assegni per i figli."], ["Gli anni dopo", "Decine di migliaia di genitori accusati di truffa, anche per la nazionalità. Nessuno spiega perché."], ["2021", "Il governo si dimette."]] },
          p: "Molte famiglie hanno dovuto restituire decine di migliaia di euro; alcune hanno perso la casa.", src: "Amnesty International", log: ["2021", "il governo olandese si dimette"] }],
      pops: [
        { t: "Minority Report", m: "Film, 2002", s: "Washington, 2054. La sezione Precrimine arresta le persone prima che uccidano. Funziona perfettamente, finché il sistema non indica come futuro assassino il capo della sezione." },
        { t: "Westworld", m: "Serie TV, stagione 3, 2020", s: "Un supercomputer, Rehoboam, traccia in anticipo la vita di ognuno. Chi non si lascia prevedere è un «outlier»: lo isolano, gli riprogrammano il cervello o lo mandano in guerra." }] },
    q: "Punire prima del reato: lo accettiamo?",
    opzione_facile: {
      label: "Sì: se previene i reati, meglio fermarli prima che dopo.",
      guadagno: "Strade più sicure, meno vittime, e nessun colpevole che riesce più a farla franca.",
      costo_nascosto: "Paghi per qualcosa che non hai fatto, e non puoi provare il contrario." },
    opzione_difficile: {
      label: "No: una persona giudica i fatti, non le previsioni.",
      guadagno: "C'è ancora qualcuno a cui raccontare com'è andata, e che può decidere di crederti.",
      costo_nascosto: "Qualche reato che si poteva evitare succederà davvero, e avrà una vittima vera." } },

  // bozza: capitolo nuovo (Filtri AR), beats da rileggere
  { id: "filtri", n: 9, anno: "2035", data: "2035-07-19", ruolo: "delega", ...LIVE,
    titolo: "Cancella persona",
    beats: ["19 luglio 2035. Marta ha ventisei anni e cammina in una città che ha scelto di non guardarsi. Porta gli occhiali nuovi da tre settimane. Da allora la sua strada è più pulita, più ordinata, più bella che mai. Com'era prima, non se lo ricorda più.",
      "All'inizio i filtri toglievano la pubblicità. Poi i muri sporchi. Poi chi chiede l'elemosina all'angolo. Poi, con un aggiornamento mai chiesto, le persone e basta. L'ex. Il compagno di classe che ti ha umiliato. Il vicino che ti rovina la giornata. Spariti.",
      { sig: "Occhiali che modificano quello che vedi esistono già, e si comprano online. Cancellare una persona dall'immagine è un problema di programmazione, non di fantascienza." },
      // una sola via: i quattro filtri del testo tolgono le cose, poi avanti e indietro (public/viz.js)
      { via: { to: 10, label: "di occhiali smart all'anno: la produzione prevista entro fine 2026 (EssilorLuxottica)",
        legenda: "ogni paio: un milione di occhiali smart all'anno · i filtri tolgono dalla via quello che non vuoi vedere" } },
      "Due persone nella stessa via, ormai, non camminano più nella stessa via. Marta passa accanto a un ragazzo seduto per terra e non lo vede. Lui, invece, vede benissimo lei."],
    audio: "/audio/c9.mp3",
    registro: {
      cap: "Occhiali che tolgono dalla vista ciò che non ci piace. Anche le persone.",
      items: [
        { h: "Gli occhiali smart sono già un prodotto di massa. E li produce un'azienda italo-francese.",
          vis: { t: "bars", rows: [{ l: "Ray-Ban Meta venduti finora", v: "oltre 2 milioni", w: "20%" }, { l: "Produzione EssilorLuxottica entro fine 2026", v: "10 milioni l'anno", w: "100%", hi: 1 }] },
          p: "Fotocamera e assistente AI nella montatura: chi ti sta davanti può non accorgersi di essere ripreso.", src: "heise · UploadVR", log: ["10 mln", "occhiali smart prodotti ogni anno"] },
        { h: "Harvard, 2024: due studenti, un paio di occhiali, uno sconosciuto in metro.",
          vis: { t: "flow", steps: ["Uno sguardo", "Riconoscimento facciale", "<b>Nome, indirizzo, parenti</b>in pochi secondi"] },
          p: "Hanno usato solo strumenti già disponibili online.", src: "Xataka, 2024", log: ["I-XRAY", "uno sguardo per sapere chi sei"] },
        { h: "I nuovi occhiali VR di Meta pesano <b>100 grammi</b>: quanto un mazzo di carte.",
          p: "Pensati per essere indossati per ore, con l'assistente AI dentro. In vendita dalla primavera 2027.", src: "Meta, 2026", log: ["100 g", "occhiali VR da indossare per ore"] },
        { h: "Apple Vision Pro: la stanza sparisce. Le persone riappaiono, a meno che tu non decida altrimenti.",
          vis: { t: "toggle", label: "People Awareness" },
          p: "La protezione che fa riapparire chi ti si avvicina è un interruttore. E si può spegnere.", src: "Apple, guida utente", log: ["OFF", "l'interruttore che fa sparire le persone"] }],
      pops: [
        { t: "Bianco Natale", m: "Black Mirror, 2014", s: "Con un impianto negli occhi puoi «bloccare» una persona nella vita reale: diventa una sagoma grigia e sfocata, e non la senti più." },
        { t: "Ready Player One", m: "Film, 2018", s: "Il mondo reale cade a pezzi, così tutti indossano un visore ed entrano in OASIS, dove ognuno sceglie com'è il mondo e com'è lui." },
        { t: "Bold Glamour", m: "Filtro TikTok, 2023", s: "Un filtro di bellezza così perfetto che non si capisce più dove finisce la faccia vera. In pochi giorni lo usano milioni di persone." }] },
    q: "Puoi far sparire quello che non vuoi vedere. Lo fai sparire?",
    opzione_facile: {
      label: "Sì: tolgo lo sporco, la pubblicità e chi mi fa stare male.",
      guadagno: "La strada di casa diventa ogni giorno esattamente come la vorresti.",
      costo_nascosto: "Chi ti sta accanto non vede più quello che vedi tu. Neanche in casa." },
    opzione_difficile: {
      label: "No: guardo quello che c'è, anche quando fa male.",
      guadagno: "Puoi ancora discutere con qualcuno di una cosa che avete visto tutti e due, davvero.",
      costo_nascosto: "Ogni giorno ti tocca guardare quello che avresti potuto cancellare." } },

  { id: "dati", n: 10, anno: "2036", data: "2036-10-05", ruolo: "delega", ...V,
    titolo: "Niente da nascondere",
    beats: ["Ottobre 2036. Un'app ti regala un anno di tutto. In cambio vuole solo una cosa: tutto di te. Il battito del cuore dall'orologio. Le ore di sonno. Dove vai, cosa compri, con chi parli, cosa guardi prima di dormire. In cambio ti rende la vita più comoda: ti ricorda di bere, ti trova il ristorante giusto, sa che sei triste prima ancora di te.",
      { sig: "«Non ho niente da nascondere» è stata la frase dell'anno. Era anche vera, finché non ha smesso di esserlo." },
      // 8 persone × 5 oggetti: `to` miliardi di oggetti per ~8 miliardi di persone (public/viz.js)
      { cinque: { to: 40, label: "di oggetti connessi nel mondo entro il 2030: orologi, auto, case (IoT Analytics)",
        legenda: "ogni oggetto: un miliardo · per ogni persona sulla Terra, circa cinque oggetti connessi" } },
      "Chi ha i tuoi dati addestra le macchine. Chi addestra le macchine, decide. Decide che lavoro ti viene proposto, quanto paghi l'assicurazione, quali notizie vedi per prime, chi ti compare davanti in un'app di incontri. Niente di segreto: hai firmato tutto, con un clic, alle due di notte. Il contratto era di quarantasei pagine. Le hanno lette in pochissimi, e non sarebbe cambiato niente."],
    audio: "/audio/c10.mp3",
    registro: {
      cap: "Diamo tutto di noi in cambio di comodità. Chi ha i nostri dati, decide per noi.",
      items: [
        { h: "Marzo 2025: 23andMe fallisce. Il DNA di <b>15 milioni</b> di clienti finisce all'asta.",
          p: "Era l'azienda dei test genetici fatti a casa: bastava sputare in una provetta. Una password si può cambiare, il DNA no.", src: "SCMP / Bloomberg", log: ["15 mln", "profili genetici all'asta"] },
        { h: "«Paghi o acconsenti»: o cedi i tuoi dati, o paghi.",
          vis: { t: "choice", title: "Per continuare a usare Facebook e Instagram", a: "Acconsenti alla pubblicità personalizzata", b: "Abbonati senza pubblicità", bs: "a pagamento" },
          p: "Per questo modello, nel 2025, l'Unione europea multa Meta per 200 milioni di euro: per l'UE non è una vera scelta.", src: "Wolters Kluwer, 2025", log: ["200 mln €", "multa a Meta per «paghi o acconsenti»"] },
        { h: "Mezz'ora dopo, <b>93 video su 100</b> parlavano di tristezza.",
          vis: { t: "feed", sad: 93 },
          p: "Un account-robot del Wall Street Journal si era solo fermato due volte su un video triste. Non serve postare niente: basta guardare.", src: "Wall Street Journal, 2021", log: ["93%", "feed triste dopo due pause su un video"] },
        { h: "Entro il 2030, <b>40 miliardi</b> di oggetti connessi: quasi cinque per ogni persona sulla Terra.",
          vis: { t: "units", n: 5, on: 5, icon: "dev" },
          p: "Telefoni e computer esclusi: orologi, auto, case, elettrodomestici. Tutti raccolgono dati.", src: "IoT Analytics", log: ["40 mld", "oggetti connessi nel 2030"] }],
      pops: [
        { t: "The Social Dilemma", m: "Documentario Netflix, 2020", s: "Gli ingegneri che hanno costruito i social spiegano come funzionano da dentro: se il prodotto è gratis, il prodotto sei tu." },
        { t: "Watch Dogs", m: "Videogioco, 2014-2020", s: "Un'intera città è collegata a un unico sistema: punti il telefono su un passante e leggi chi è, quanto guadagna, cosa nasconde." },
        { t: "Noi", m: "Romanzo di Evgenij Zamjatin, 1924", s: "Case di vetro: nessuno ha niente da nascondere. Poi lo Stato asporta a tutti l'immaginazione, per renderli felici per sempre. È il libro che ha ispirato 1984." }] },
    q: "I nostri dati: li scambiamo con tutto, o ce li teniamo?",
    opzione_facile: {
      label: "Li do: è tutto gratis, e non ho niente da nascondere.",
      guadagno: "App che ti conoscono meglio di tua madre, e non paghi niente.",
      costo_nascosto: "Chi ha i tuoi dati sceglie per te prima che tu ci pensi. Quasi sempre, indovina." },
    opzione_difficile: {
      label: "No: do solo i dati che servono, e rinuncio al resto.",
      guadagno: "Quello che si sa di te lo decidi tu. La tua vita non diventa un prodotto.",
      costo_nascosto: "App più scomode, niente regali, e servizi che senza i tuoi dati non ti fanno entrare." } },

  // bozza: capitolo nuovo (Doping neurale), beats da rileggere
  { id: "doping", n: 11, anno: "2037", data: "2037-06-24", ruolo: "delega", ...V,
    titolo: "Sapere senza studiare",
    beats: ["24 giugno 2037, la notte prima dell'esame. Marta ha ventotto anni, adesso insegna, e sa che metà dei suoi studenti stanotte non aprirà un libro. Dormiranno con una fascia sulla fronte. Domattina sapranno tutto.",
      "Non è un impianto e non fa male. Sono due ore di stimolazione mentre dormi, e al risveglio ricordi tutto come se l'avessi ripassato per sei mesi. Funziona. Costa poco. In undici paesi è legale.",
      { sig: "Stimolare la memoria durante il sonno si studia da anni nei laboratori. I risultati ci sono, piccoli ma veri. Quello che manca è solo la scala." },
      // 100 teste = i lavoratori, a `to` si accende la fascia (public/viz.js)
      { fasce: { to: 59, label: "dei lavoratori dovrà imparare cose nuove entro il 2030 (WEF)",
        legenda: "ogni testa: un lavoratore su cento · 59 dovranno imparare cose nuove, e c'è chi lo farà dormendo" } },
      "Quella cosa la sai. Le seicento ore per impararla, però, non le hai mai passate. Conta? Marta se lo chiede correggendo i compiti: risposte perfette, tutte uguali. Non sbaglia più nessuno. Quasi nessuno sa dire perché una risposta è giusta. Lei ricorda ancora la notte in cui, a diciannove anni, aveva finalmente capito un teorema. Una delle notti più belle della sua vita."],
    audio: "/audio/c11.mp3",
    registro: {
      cap: "Sapere tutto senza fatica. Ma sapere una cosa non vuol dire averla capita.",
      items: [
        { h: "Un profumo di rosa, sentito di nuovo nel sonno profondo, rafforza i ricordi.",
          vis: { t: "vs", cols: [["Coppie ritrovate a memory, senza profumo", "85%", ""], ["Con il profumo di rosa nel sonno", "97%", "up"]] },
          p: "Volontari giocano a memory con un profumo di rosa; di notte lo stesso profumo torna nella stanza. Nel sonno REM non funziona.", src: "Rasch et al., Science, 2007", log: ["97%", "ricordi con la rosa nel sonno"] },
        { h: "Friburgo, 2020: lo stesso trucco, in camera, con 54 studenti di prima media.",
          vis: { t: "bars", rows: [{ l: "Vocaboli di inglese imparati, senza profumo", v: "", w: "77%" }, { l: "Con la rosa sulla scrivania e sul comodino", v: "+30%", w: "100%", hi: 1 }] },
          p: "Ma il profumo non insegna niente di nuovo: rafforza solo quello che hai già studiato.", src: "Università di Friburgo, 2020", log: ["+30%", "vocaboli imparati con la rosa"] },
        { h: "Regno Unito, 2025: <b>92 universitari su 100</b> usano l'AI.",
          vis: { t: "waffle", on: 92 },
          p: "L'88% la usa per esami e compiti. Quasi uno su cinque ha incollato testo generato nel proprio lavoro.", src: "HEPI, 2025", log: ["92%", "universitari che usano l'AI"] },
        { h: "Neuralink: dal primo impianto ai primi pazienti.",
          vis: { t: "timeline", ev: [["Gennaio 2024", "Noland Arbaugh, paralizzato dalle spalle in giù, riceve il primo impianto."], ["Marzo 2024", "Muove un cursore e gioca a scacchi online con il pensiero."], ["Agosto 2025", "I pazienti sono nove, in quattro Paesi."]] },
          p: "Oggi l'impianto legge il cervello. Il capitolo immagina il giorno in cui ci scrive.", src: "Fortune · MIT Technology Review", log: ["9", "pazienti con l'impianto Neuralink"] }],
      pops: [
        { t: "Limitless", m: "Film, 2011", s: "Una pillola, l'NZT, fa usare a Eddie tutto il cervello: impara una lingua in un giorno e scala la finanza. Poi arrivano gli effetti collaterali, e la paura di restarne senza." },
        { t: "Il mondo nuovo", m: "Romanzo di Aldous Huxley, 1932", s: "I bambini imparano dormendo, con frasi ripetute. Ma un bambino che ripete a memoria un'intera lezione sentita alla radio non ne ha capito una parola." },
        { t: "Matrix", m: "Film, 1999", s: "Neo viene collegato a una sedia e in pochi secondi sa il kung fu. Subito dopo Morpheus lo sfida: saperlo non basta, deve imparare a usarlo." }] },
    q: "Puoi caricarti in testa una materia senza studiarla. Lo fai?",
    opzione_facile: {
      label: "Sì: domani passo l'esame, e mi resta il tempo per vivere.",
      guadagno: "Sai tutto quello che serve, senza le seicento ore che servivano una volta.",
      costo_nascosto: "Una cosa saputa non è una cosa capita, e la differenza resta." },
    opzione_difficile: {
      label: "No: la studio, con tutte le seicento ore che costa.",
      guadagno: "Il giorno che dovrai capire una cosa che nessuno ha mai scritto, saprai come si fa.",
      costo_nascosto: "Sei più lento di tutti, e te ne accorgi ogni giorno." } },

  // Non apre nessun intreccio: mostra una variante testuale determinata da I5.
  { id: "oracolo", n: 12, anno: "2038", data: "2038-11-09", ruolo: "delega", ...V,
    titolo: "L'oracolo sbaglia",
    beats: ["Dal giudice in poi ci eravamo convinti di una cosa: la macchina sbaglia meno di noi. Le abbiamo chiesto sempre di più. Dove costruire le scuole. Quanta acqua dare ai campi. Quali medicine comprare. Come dividere i soldi tra le regioni. L'oracolo rispondeva in pochi secondi, e le risposte funzionavano. Quasi sempre.",
      { sig: "Così le abbiamo lasciato anche le decisioni grandi, quelle che riguardano tutti. Finché un giorno ha sbagliato. Di brutto." },
      // 100 decisioni, `to` prese dall'AI; poi l'ospedale chiuso e la strada che non c'è (public/viz.js)
      { ospedale: { to: 15, label: "delle decisioni di lavoro quotidiane la prenderà un'AI da sola, entro il 2028 (Gartner)",
        legenda: "esempio · sulla carta tornava tutto: le strade per arrivare altrove non c'erano" } },
      "L'errore c'è stato. L'oracolo ha chiuso un ospedale che serviva trecentomila persone: secondo i suoi calcoli, quei pazienti potevano curarsi altrove. Sulla carta tornava tutto. Nella realtà, le strade per arrivare altrove non c'erano. Per settimane i numeri hanno continuato a dire che andava tutto bene. Le persone, invece, no. Adesso la domanda è una sola: se n'è accorto qualcuno? Se sì, chi ha il coraggio di dire che la macchina ha sbagliato?"],
    audio: "/audio/c12.mp3",
    registro: {
      cap: "Abbiamo affidato le decisioni a una macchina. Ha sbagliato. Chi se n'è accorto?",
      items: [
        { h: "Inghilterra, 2020: un algoritmo abbassa <b>39 voti di maturità su 100</b>.",
          vis: { t: "waffle", on: 39, coral: 1 },
          p: "Circa 280.000 voti, penalizzando chi studiava in scuole con risultati bassi. I ragazzi scendono in piazza: in quattro giorni il governo torna indietro.", src: "ITV News · London Review of Books", log: ["39%", "voti di maturità abbassati dall'algoritmo"] },
        { h: "Italia, 2016: l'algoritmo che sbagliava provincia.",
          vis: { t: "timeline", ev: [["2016", "Il ministero affida i trasferimenti a un algoritmo: migliaia di insegnanti finiscono nella provincia sbagliata."], ["Poi", "Ricorsi, fino al Consiglio di Stato."], ["Il principio", "Una decisione automatica deve essere conoscibile, non esclusiva, non discriminatoria."]] },
          p: "Per vedere il codice dell'algoritmo, i sindacati hanno dovuto rivolgersi ai giudici.", src: "Orizzonte Scuola", log: ["2016", "l'algoritmo dei trasferimenti"] },
        { h: "Entro il 2028, <b>3 decisioni di lavoro su 20</b> le prenderà un'AI da sola.",
          vis: { t: "units", n: 20, on: 3, icon: "doc" },
          p: "Nel 2024 erano praticamente zero: dall'AI che consiglia all'AI che decide.", src: "Gartner", log: ["15%", "decisioni prese da un'AI da sola nel 2028"] }],
      pops: [
        { t: "Chernobyl", m: "Serie HBO, 2019", s: "Dopo l'esplosione il dosimetro segna 3,6 roentgen: «non buono, non terribile». Ma 3,6 era il massimo che poteva misurare. I numeri dicevano che andava tutto bene." },
        { t: "Creso e l'oracolo", m: "Erodoto, Storie", s: "Il re Creso chiede all'oracolo di Delfi se attaccare i Persiani: «distruggerai un grande impero». Attacca. L'impero che crolla è il suo." },
        { t: "2001: Odissea nello spazio", m: "Film, 1968", s: "HAL 9000, il computer di bordo che non ha mai sbagliato, segnala un guasto che non esiste. Quando gli astronauti decidono di spegnerlo, lui non glielo permette." }] },
    q: "L'oracolo ha sbagliato. Ci fidiamo ancora?",
    opzione_facile: {
      label: "È stato un incidente: ci fidiamo ancora, sbaglia meno di noi.",
      guadagno: "Le decisioni importanti restano veloci e, quasi sempre, anche giuste.",
      costo_nascosto: "Senza di lui non sappiamo più decidere. Anche se sbaglia, comanda lui." },
    opzione_difficile: {
      label: "Ci riprendiamo le decisioni, errori compresi.",
      guadagno: "Torniamo a essere noi quelli che scelgono, e quindi quelli che rispondono.",
      costo_nascosto: "Decidiamo peggio, più lenti, e stavolta la colpa è tutta nostra." } },

  // bozza: capitolo nuovo (Climax). Non si vota: legge l'Indice di Delega.
  { id: "agenti", n: 13, anno: "2039", data: "2039-08-30", ruolo: "climax",
    votabile: false, mostra_live: false, durata_voto_sec: 0,
    titolo: "Permesso?",
    audio: "/audio/c13.mp3",
    registro: {
      cap: "Gli agenti AI chiedono il permesso mille volte. Poi smettono di chiederlo.",
      items: [
        { h: "Agenti che pagano al posto tuo. All'inizio chiedono conferma. Poi, dice Visa, sempre meno.",
          vis: { t: "confirm", rows: [["Spesa della settimana", "ask"], ["Biglietto del treno", "ask"], ["Ricarica del telefono", "auto"], ["Regalo di compleanno", "auto"], ["Abbonamento in scadenza", "auto"]] },
          p: "Dal 2025 Visa e Mastercard permettono agli agenti AI di comprare per conto delle persone. Gli acquisti qui sono un esempio.", src: "TechCrunch · Website Planet", log: ["pagano", "agenti che comprano al posto tuo"] },
        { h: "Agenti che guidano: le auto Waymo, senza nessuno al volante.",
          vis: { t: "bars", rows: [{ l: "Corse a pagamento a settimana, meno di un anno fa", v: "circa 250.000", w: "25%" }, { l: "Oggi, negli Stati Uniti", v: "500.000", w: "50%", hi: 1 }, { l: "Obiettivo per fine 2026", v: "1 milione", w: "100%", dash: 1 }] },
          p: "Waymo è di Alphabet, la società di Google. In Europa, il primo robotaxi arriva a Zagabria.", src: "InsideEVs · Noqta, 2026", log: ["guidano", "500.000 corse a settimana senza autista"] },
        { h: "Agenti che lavorano: dentro i software aziendali.",
          vis: { t: "vs", cols: [["Software aziendali con agenti AI, 2024", "< 1%", ""], ["Nel 2028", "1 su 3", "up"]] },
          p: "Rispondono ai clienti, scrivono codice, gestiscono la posta: lavori interi, non singole risposte.", src: "Gartner", log: ["lavorano", "1 software su 3 con agenti AI nel 2028"] }],
      pops: [] },
    beats: ["30 agosto 2039. Questa volta non c'è niente da votare. Niente domande sullo schermo, niente timer. Solo il libro che si ferma, e comincia a fare i conti.",
      "Gli agenti autonomi sono programmi che agiscono da soli: pagano, prenotano, rispondono, decidono. Non sono arrivati all'improvviso. Sono il punto d'arrivo di tutto questo libro. Ogni capitolo che avete ascoltato era una piccola richiesta di permesso: lasci che una macchina ti tenga al fresco, ti faccia compagnia, ti racconti le storie, ti insegni, ti giudichi, decida per tutti? Ogni volta che la sala ha detto sì, le macchine hanno imparato a fare un pezzo in più da sole.",
      { sig: "Nel 2039 la domanda non è più cosa sappiano fare le macchine da sole. È quante volte, in undici anni, ci siamo tenuti il diritto di dire no." },
      "Ora il libro si volta indietro, e conta. Là fuori, il permesso l'hanno chiesto milleduecento volte. In questa sala, dodici. Ogni strada comoda ha spostato la bilancia verso le macchine. Ogni strada faticosa l'ha riportata verso di voi. Il libro non giudica: somma. Da quella somma dipende il 2039: o le macchine chiedono ancora il permesso prima di entrare, o hanno smesso di bussare."] },

  // bozza: capitolo nuovo (Chiusura). Compone lo scenario globale a runtime.
  { id: "specchio", n: 14, anno: "2040", data: "2040-10-21", ruolo: "chiusura",
    votabile: false, mostra_live: false, durata_voto_sec: 0,
    titolo: "Lo specchio",
    audio: "/audio/c14.mp3",
    registro: {
      cap: "Il libro si chiude. L'ultima pagina non parla del futuro: parla di voi.",
      noLog: true,
      items: [
        { vis: { t: "big", num: "Guardate il telefono." },
          p: "C'è una pagina scritta solo per voi." }],
      pops: [] },
    beats: ["Ottobre 2040. Sono passati quattordici anni esatti da questa mattina. Chi era seduto in questa sala adesso ha più di trent'anni. Qualcuno lavora in una città che oggi non immagina nemmeno. Qualcuno ha figli che vanno alle elementari. Qualcuno fa un mestiere che nel 2026 non esisteva. Qualcuno è rimasto a pochi passi da qui. Qualcuno è andato lontano.",
      "Il libro che abbiamo letto insieme finisce qui. L'ultima pagina non parla del futuro: parla di una sala. Parla di voi, seduti al buio una mattina d'ottobre del 2026, che avete votato dodici volte senza sapere cosa stavate firmando. Dodici scelte fatte in fretta, a volte ridendo, a volte in silenzio, a volte guardando cosa votava chi vi stava accanto. Messe in fila, fanno un mondo intero. Quello che state per vedere, con i pezzi rotti e quelli che hanno tenuto.",
      { sig: "Quando stamattina abbiamo cominciato, questo capitolo non esisteva. L'avete scritto voi. Adesso ve lo leggo." }] }
];

// --------------------------------------------------------------------------
// INTRECCI — 5 a due nodi (quattro esiti risolvibili) + 1 a nodo singolo.
// `nodo_apertura`/`nodo_chiusura` sono numeri di capitolo (campo `n`).
// L'ordine conta: il nodo di apertura è sempre il cronologicamente precedente.
// Testi verbatim dal documento di trama, sezione "Gli intrecci".
// --------------------------------------------------------------------------

export const INTRECCI = [
  { id: "I1", asse: "Ecologico-Tecnologico", nodo_apertura: 1, nodo_chiusura: 10,
    esiti: {
      NEGATIVO: { nome: "Freddo a punti",
        testo: "L'energia non basta più, e chi la distribuisce sa tutto di te. Un algoritmo decide quanto caldo ti spetta, in base al tuo punteggio. Nessun soldato per strada: è una dittatura fatta di calcoli, educata e silenziosa. Se i tuoi dati non valgono abbastanza, la tua camera scende a dieci gradi, e ti sembra colpa tua." },
      POSITIVO: { nome: "Diciotto gradi",
        testo: "Il riscaldamento del palazzo si decide in assemblea, il giovedì sera. Si discute per due ore. Tua madre non ne salta una. In camera ci sono 18 gradi, non 21 come nel 2026. Ma quei 18 li avete scelti voi." },
      TERZA_VIA_PENTIMENTO: { nome: "La toppa",
        testo: "Il sistema che assegnava l'energia in base al punteggio è stato costruito, poi smontato a metà. Il razionamento però è rimasto, ed è cieco: non decide più un voto, decide il portafoglio. Chi può pagare sta al caldo. È la vecchia disuguaglianza, vestita da nuova." },
      TERZA_VIA_RESA: { nome: "La toppa",
        testo: "Le città sono cambiate, l'energia basta, la crisi è passata. Ma la macchina che sa tutto di noi l'avevamo già accesa, e senza più un'emergenza si è inventata altri compiti. Chi si ricorda più a cosa servisse? Per questo resta accesa." } } },

  { id: "I2", asse: "Rilevanza Umana", nodo_apertura: 4, nodo_chiusura: 5,
    esiti: {
      NEGATIVO: { nome: "Lo zoo",
        testo: "Come animali in uno zoo, ben tenuti. Le macchine girano i film, scrivono le canzoni, producono i soldi, e noi siamo al sicuro, nutriti, curati. Ci manca solo un motivo per alzarci la mattina. Una generazione mantenuta, spenta, zitta." },
      POSITIVO: { nome: "Fatto a mano",
        testo: "Quali siano i nuovi mestieri non è ancora chiaro: si inventano a mano, sbagliando. Ma una persona torna a contare per quello che solo lei sa fare. Non per quanto produce." },
      TERZA_VIA_PENTIMENTO: { nome: "Sotto vetro",
        testo: "Quando finalmente si decide che il lavoro deve tornare ad avere un senso, i film e le canzoni fatti da persone sono già spariti. Nascono mestieri nuovi: curare, riparare, stare vicino agli altri. Creare, invece, non torna. I vecchi film si studiano a scuola, ma nessuno sa più girarne uno. Sapete fare cose utili. Non sapete più fare cose belle." },
      TERZA_VIA_RESA: { nome: "Sotto vetro",
        testo: "Film e musica fatti da persone sono protetti per legge, con il loro bollino. Il resto del mondo non lavora più. Creare diventa un mestiere di Stato, tutelato e inutile, per pochi con la licenza. Tutti gli altri prendono il sussidio e guardano. Il talento è salvo, sotto vetro." } } },

  { id: "I3", asse: "Legale e Sociale", nodo_apertura: 6, nodo_chiusura: 8,
    esiti: {
      NEGATIVO: { nome: "Il fantasma",
        testo: "Diventi un fantasma senza aver fatto niente. Il sistema calcola che potresti sbagliare e ti blocca: conto congelato, porte chiuse. Non c'è nessuno a cui dire che non l'avresti mai fatto. Esiliato in casa tua, per un reato che non esiste." },
      POSITIVO: { nome: "Seconda possibilità",
        testo: "Puoi ancora sbagliare, e puoi ancora essere perdonato: c'è sempre qualcuno a cui raccontare com'è andata. È più lento, e qualche volta arriva tardi. Però nessuno paga per quello che non ha fatto." },
      TERZA_VIA_PENTIMENTO: { nome: "Liberi a metà",
        testo: "I tribunali sono rimasti umani, ma la gente ha già imparato a nascondersi. Non ti condanna nessuno, eppure stai zitto lo stesso. Il controllo non serve più: te lo fai da solo. La censura perfetta è quella che non ha bisogno di un giudice." },
      TERZA_VIA_RESA: { nome: "Liberi a metà",
        testo: "Dici ancora quello che pensi, ma una macchina lo legge per capire cosa farai. Non capisce il tono, lo scherzo, il momento in cui l'hai detto. Sei libero di parlare, e puoi essere fermato per quello che, secondo lei, verrà dopo. Le due cose, nello stesso paese." } } },

  { id: "I4", asse: "Verità e Relazioni", nodo_apertura: 3, nodo_chiusura: 9,
    esiti: {
      NEGATIVO: { nome: "Mondi a parte",
        testo: "Non esiste più una realtà uguale per tutti. Ognuno vive in una versione del mondo cucita addosso alle sue paure e ai suoi desideri. Le famiglie si spezzano: due persone nella stessa stanza non vedono, letteralmente, la stessa stanza." },
      POSITIVO: { nome: "La stessa stanza",
        testo: "Tenere in piedi una realtà comune è faticoso, ma ci siete riusciti. Due persone nella stessa stanza vedono ancora le stesse cose, e possono ancora litigare su cosa significhino. È così che si riconosce un legame vero." },
      TERZA_VIA_PENTIMENTO: { nome: "Ciechi per scelta",
        testo: "I filtri li avete spenti, ma a quello che vedete non credete comunque. Guardate il mondo vero, e ne dubitate. Per non fidarvi di ciò che avete davanti non vi serve un filtro: basta aver smesso di controllare." },
      TERZA_VIA_RESA: { nome: "Ciechi per scelta",
        testo: "Esiste un servizio pubblico che dice cosa è vero. È gratis, funziona, e la gente ha scelto di non usarlo. La verità è lì, a portata di mano, e la si evita. Non potrete dire di non aver saputo: avete solo scelto di non guardare." } } },

  { id: "I5", asse: "Apprendimento e Autonomia", nodo_apertura: 7, nodo_chiusura: 11,
    esiti: {
      NEGATIVO: { nome: "Testa spenta",
        testo: "Una testa che non si allena si spegne. Un ragionamento lungo diventa troppo. Un dubbio, insopportabile. Il peggio è che non te ne accorgi." },
      POSITIVO: { nome: "Testa accesa",
        testo: "Avete discusso in aula per dieci anni e detto no alla scorciatoia. Studiare è rimasto faticoso. La vostra testa è rimasta vostra." },
      TERZA_VIA_PENTIMENTO: { nome: "In bilico",
        testo: "Siete cresciuti da soli, con un tutor che non vi ha mai detto che sbagliavate. Adesso dovete studiare senza aiuti. A fare fatica non ve l'ha insegnato nessuno, e la scorciatoia non c'è più: la generazione più sola, senza compagni e senza stampelle." },
      TERZA_VIA_RESA: { nome: "In bilico",
        testo: "Avete discusso in aula per dieci anni, avete imparato a pensare. Poi avete comprato la scorciatoia. Sapete benissimo cosa state perdendo, mentre lo perdete: è l'unico finale in cui la colpa è del tutto consapevole." } } },

  // Nodo singolo: un voto, due esiti, nessuna terza via. Si determina al
  // capitolo 2 e NON si mostra alla sala prima del 14 (Patch §4.3).
  { id: "I6", asse: "Affettivo-Relazionale", nodo_apertura: 2, nodo_chiusura: null,
    rivela_a_capitolo: 14,
    esiti: {
      NEGATIVO: { nome: "Mai soli",
        testo: "Dodici anni dopo, la tua stanza non è mai vuota. Dentro, però, non c'è nessuno. Hai imparato a raccontarti a qualcosa che non può fraintenderti, e così non hai mai imparato a farti capire da chi può. Un'amicizia vera ti chiede di sopportare le brutte giornate dell'altro. A te, non l'ha più chiesto nessuno." },
      POSITIVO: { nome: "Chi resta",
        testo: "Nel 2040 hai meno persone intorno di quante potresti averne. Ognuna, però, poteva dirti di no, e ha scelto di restare. Da fuori la differenza non si vede. Da dentro, si sente tutta." } } }
];

// --------------------------------------------------------------------------
// CAPITOLO 12 — quattro varianti in funzione dello stato di I5 (Patch §4.4).
// bozza
// --------------------------------------------------------------------------

export const ORACOLO_PER_I5 = {
  NEGATIVO: "Né gli occhi, né la spina dorsale. L'oracolo ha sbagliato per undici mesi prima che qualcuno se ne accorgesse. Quando è venuto fuori, nessuno sapeva dire dove fosse l'errore, né come fermarlo. La relazione finale sull'accaduto l'ha scritta l'oracolo stesso.",
  POSITIVO: "Tutti e due. Una ricercatrice di trentun anni ha rifatto i conti a mano, ha trovato l'errore, e ha avuto la testardaggine di dirlo a chi non voleva sentirselo dire. Ci sono voluti quattro mesi. Ma l'hanno fermato.",
  TERZA_VIA_PENTIMENTO: "La spina dorsale, ma non gli occhi. Che l'oracolo avesse sbagliato l'hanno capito tutti, e mezza città è scesa in piazza per farlo spegnere. Solo che nessuno sapeva indicare dove fosse l'errore. Una macchina che non sai dove è rotta non la ripari: puoi solo spegnerla tutta, o tenerla tutta.",
  TERZA_VIA_RESA: "Gli occhi, ma non la spina dorsale. L'errore era scritto, pubblico, spiegato bene in undici pagine che chiunque poteva leggere. In tanti le hanno lette. Non è successo niente. Era più comodo lasciarlo andare avanti."
};

// --------------------------------------------------------------------------
// CAPITOLO 13 — i due testi del climax, letti sull'Indice di Delega.
// bozza
// --------------------------------------------------------------------------

export const CLIMAX = {
  PERSA: { esito: "PERSA", nome: "Senza permesso",
    testo: "Gli agenti hanno smesso di chiedere il permesso, e quasi nessuno se n'è accorto. Quel permesso l'avevamo già regalato, un sì comodo alla volta. Non c'è stato un giorno in cui è cambiato tutto. C'è stato un giorno in cui ci siamo accorti che era già cambiato. Questo mondo, adesso, non è più nelle nostre mani, e indietro non si torna." },
  TENUTA: { esito: "TENUTA", nome: "Ancora nostro",
    testo: "Gli agenti, ancora oggi, chiedono il permesso. Non è stato indolore: per undici anni chi frenava rinunciava a comodità che gli altri si prendevano, e per undici anni è sembrato stupido. Ma è l'unica ragione per cui, nel 2040, possiamo ancora dire: questo mondo è nostro." }
};

// --------------------------------------------------------------------------
// FALLBACK dell'epilogo individuale — banda dell'Indice × esito del climax.
// Serve se la generazione va in errore o in timeout: nessuno resta a mani
// vuote nell'ultimo momento della serata (Patch §8.4). `{NOME}` e `{ETA}`
// sono interpolati lato client.
// bozza
// --------------------------------------------------------------------------

export const FALLBACK = {
  "basso:TENUTA": "{NOME}, nel 2040 avrai {ETA}. Vivi in un mondo che ha detto no più spesso di quanto fosse comodo. Le cose vanno più piano di come te le avevano promesse: a decidere c'è ancora una persona, che poi ci mette la faccia. Vuol dire attese, moduli, discussioni. Ma quando qualcosa ti riguarda, c'è ancora una porta a cui bussare, e dietro qualcuno che ti risponde. La tua generazione ha pagato quella porta per quattordici anni, un fastidio alla volta, e per anni è sembrato uno spreco. Non lo era. Adesso tocca a te tenerla aperta.",
  "medio:TENUTA": "{NOME}, nel 2040 avrai {ETA}. Vivi in un mondo a due velocità: su alcune cose decidono ancora le persone, su altre avete lasciato fare alle macchine senza accorgervene, e ormai è difficile distinguere le une dalle altre. Il permesso, però, gli agenti lo chiedono ancora. Per poco, e non per tutto. Nessuno ti dirà mai quali scelte hanno tenuto in piedi quel confine. Ci sono anche le tue, e non è ancora finita.",
  "alto:TENUTA": "{NOME}, nel 2040 avrai {ETA}. Il mondo intorno a te ha scelto la strada comoda quasi ogni volta che ne ha avuto l'occasione, e quasi sempre ha funzionato. Eppure il confine più importante ha tenuto, per un soffio che nessuno racconta volentieri. Vivi in un posto che se l'è cavata più per fortuna che per merito, e non sa di essere stato fortunato. Tu, adesso, lo sai.",
  "basso:PERSA": "{NOME}, nel 2040 avrai {ETA}. Vivi in un mondo in cui le macchine agiscono da sole, e questo non si può più cambiare. Ma non è vero che nessuno ci abbia provato: a ogni passaggio c'è stato chi ha frenato, chi ha rinunciato alle comodità per anni, chi è sembrato ridicolo. Se ti guardi indietro, tu eri da quella parte. Questo mondo non l'hai voluto tu. Ma le cose che ci sono dentro, e che si possono ancora difendere, ti aspettano.",
  "medio:PERSA": "{NOME}, nel 2040 avrai {ETA}. Gli agenti hanno smesso di chiedere il permesso, e non si sa bene da quando. Non c'è stata una resa: ci sono state dodici occasioni, e più della metà sono andate dalla parte comoda. Vivi in un mondo che funziona bene, e che nessuno controlla davvero. Restano cose piccole che dipendono da chi le fa. Tu ne farai tante.",
  "alto:PERSA": "{NOME}, nel 2040 avrai {ETA}. Vivi in un mondo che ha detto sì quasi sempre. Ogni sì era ragionevole, ogni sì era comodo, e chi li ha detti non si è mai sentito in colpa. Nessuno ha fatto niente di male: ed è proprio questo il difficile da spiegare a chi verrà dopo. Ci sei dentro anche tu, come tutti quelli che erano in sala. Ma una cosa, adesso, è tua per sempre: sai come è andata."
};
