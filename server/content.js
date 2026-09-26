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
    beats: ["30 agosto 2039. Questa volta non c'è niente da votare. Niente domande sullo schermo, niente timer. Solo il libro che si ferma, e comincia a fare i conti.",
      "Gli agenti autonomi sono programmi che agiscono da soli: pagano, prenotano, rispondono, decidono. Non sono arrivati all'improvviso. Sono il punto d'arrivo di tutto questo libro. Ogni capitolo che avete ascoltato era una piccola richiesta di permesso: lasci che una macchina ti tenga al fresco, ti faccia compagnia, ti racconti le storie, ti insegni, ti giudichi, decida per tutti? Ogni volta che la sala ha detto sì, le macchine hanno imparato a fare un pezzo in più da sole.",
      { sig: "Nel 2039 la domanda non è più cosa sappiano fare le macchine da sole. È quante volte, in undici anni, ci siamo tenuti il diritto di dire no." },
      "Ora il libro si volta indietro, e conta. Là fuori, il permesso l'hanno chiesto milleduecento volte. In questa sala, dodici. Ogni strada comoda ha spostato la bilancia verso le macchine. Ogni strada faticosa l'ha riportata verso di voi. Il libro non giudica: somma. Da quella somma dipende il 2039: o le macchine chiedono ancora il permesso prima di entrare, o hanno smesso di bussare."] },

  // bozza: capitolo nuovo (Chiusura). Compone lo scenario globale a runtime.
  { id: "specchio", n: 14, anno: "2040", data: "2040-10-21", ruolo: "chiusura",
    votabile: false, mostra_live: false, durata_voto_sec: 0,
    titolo: "Lo specchio",
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
