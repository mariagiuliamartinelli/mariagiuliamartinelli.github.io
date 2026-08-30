/* ══════════════════════════════════════════════════════════════════════════
   Italian / English switch.

   The HTML on disk is the English version — the source of truth. This script
   only ever *replaces* text that is already on the page; it never reveals
   anything. With JavaScript off, or if this file fails to load, the whole site
   still reads in English and nothing goes missing (CLAUDE.md, invariant 1).

   It must run BEFORE gsap/main.js: Italian runs ~10-15% longer than English,
   so the text has to be final before ScrollTrigger measures the layout.

   Three attributes, and that is the whole vocabulary:

     data-i18n="key"                    replaces textContent
     data-i18n-html="key"               replaces innerHTML (value carries markup)
     data-i18n-attr="content:key"       replaces a named attribute
                                        (comma-separate for several)

   A key with no entry in DICT below is left in English on purpose. That is how
   project names, tools, institutions, species and dates stay put — annotate
   generously, translate selectively.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORE = 'mm-lang';

  var DICT = {
    it: {

      /* ── header, side menu, page nav, footer ─────────────────────────── */
      'nav.contactCta':  'Contattami',
      'nav.openMenu':    'Apri il menu',
      'nav.closeMenu':   'Chiudi il menu',
      'nav.research':      'Ricerca',
      'nav.education':     'Formazione',
      'nav.projects':      'Open Source',
      'nav.publications':  'Pubblicazioni',
      'nav.awards':        'Premi e competenze',
      'nav.cvPdf':         'CV (PDF)',
      'nav.contact':       'Contatti',
      'nav.backHome':      'Torna alla home',
      'nav.next':          'Successiva',
      'nav.previous':      'Precedente',
      'nav.backTo':        'Torna alla',
      'nav.startHere':     'Comincia da qui',
      'nav.orGoTo':        'Oppure vai a',
      'nav.home':          'Home',
      'footer.sub':      'Bioarcheologia · Paleogenetica<br>Scienze della conservazione<br>Sapienza Università di Roma',
      'footer.title':    'Vuoi contattarmi?',
      'footer.academic': 'Accademica:',
      'footer.personal': 'Personale:',

      /* ── page titles and descriptions ────────────────────────────────── */
      'meta.home.title': 'Mariagiulia Martinelli · Bioarcheologia, paleogenetica e scienze della conservazione',
      'meta.home.desc':  'Mariagiulia Martinelli: bioarcheologia, paleogenetica e scienze della conservazione. Tafonomia e diagenesi ossea, colonizzazione microbica della pietra e conservazione delle biomolecole antiche.',
      'meta.research.title': 'Esperienza di ricerca · Mariagiulia Martinelli',
      'meta.research.desc':  'Le esperienze di ricerca di Mariagiulia Martinelli: Centre for Palaeogenetics, Tusculum, ENEA Casaccia e i laboratori della Sapienza.',
      'meta.education.title': 'Formazione · Mariagiulia Martinelli',
      'meta.education.desc':  'La formazione di Mariagiulia Martinelli: lauree LM-11 e L-43 alla Sapienza, Erasmus+ alla Stockholm University, convegni e workshop.',
      'meta.projects.title': 'Open Source · Mariagiulia Martinelli',
      'meta.projects.desc':  'Le pipeline open source di Mariagiulia Martinelli: Etruscan-Analysis, framework per revisioni sistematiche, confronto kraken2 e altro.',
      'meta.pubs.title': 'Pubblicazioni e interventi · Mariagiulia Martinelli',
      'meta.pubs.desc':  'Pubblicazioni, manoscritti in preparazione e contributi orali di Mariagiulia Martinelli.',
      'meta.cv.title':   'Premi e competenze · Mariagiulia Martinelli',
      'meta.cv.desc':    'Premi, competenze, esperienze lavorative e certificazioni di Mariagiulia Martinelli.',
      'meta.e404.title': 'Pagina non trovata · Mariagiulia Martinelli',
      'meta.e404.desc':  'Questa pagina non esiste sul sito di Mariagiulia Martinelli.',

      /* ── home ────────────────────────────────────────────────────────── */
      'home.dishHint':   'passa sulla piastra',
      'home.scrollHint': 'Scorri per scoprire',
      'home.eyebrow':    'Sapienza Università di Roma',
      'home.h1':         'Bioarcheologia, <em>paleogenetica</em> e scienze della conservazione.',
      'home.summary':    'Seguo i processi biologici che agiscono sui resti scheletrici umani e sui materiali del patrimonio culturale: tafonomia e diagenesi ossea, colonizzazione microbica e biodeterioramento della pietra, conservazione delle biomolecole antiche.',
      'home.ctaExplore': 'Esplora la mia ricerca ↓',
      'home.ctaCv':      'Scarica il CV',
      'home.mission1':   '<strong>Paleogenetica e biomolecole antiche.</strong> Pipeline di classificazione eseguite su HPC per distinguere il segnale endogeno dalla colonizzazione microbica post-mortem, con screening dei patogeni antichi.',
      'home.mission2':   '<strong>Osteologia, tafonomia e collezioni.</strong> Inventario scheletrico, profilo biologico e paleopatologia dentaria, distinguendo il danno tafonomico da quello introdotto durante lo scavo e la conservazione museale.',
      'home.mission3':   '<strong>Biodeterioramento e metagenomica del patrimonio.</strong> Flussi di lavoro completi sul deterioramento dei substrati minerali mediato dai microrganismi, dal campionamento sul campo alla classificazione filogenetica.',
      'home.mission2Meta':   'collezione Sergi · Tusculum · crani etruschi',
      'home.exploreEyebrow': 'Esplora',
      'home.exploreTitle':   'Scegli un filamento',
      'home.exploreLead':    'Ogni piolo dell’elica apre una parte diversa del mio lavoro.',
      'home.sectionsLabel':  'Sezioni',
      'home.ctaTitle':       'Vuoi collaborare a una ricerca?',
      'home.ctaButton':      'Mettiti in contatto →',

      /* ── research ────────────────────────────────────────────────────── */
      'research.t01': 'Esperienza di ricerca',
      'research.t02': 'DNA antico, collezioni scheletriche e biodeterioramento',
      'research.t03': 'Cinque esperienze: paleogenetica a Stoccolma, osteologia a Tusculum, metagenomica del patrimonio all’ENEA Casaccia e una collezione di crani di inizio Novecento riportata in uso alla Sapienza.',
      'research.t05': 'Stockholm University / Sapienza Università di Roma',
      'research.t06': 'Tirocinio di ricerca presso il <em>Centre for Palaeogenetics</em> (CPG)',
      'research.t07': 'Analisi di 250 librerie di DNA antico da necropoli romane, visigote, islamiche e medievali di Valencia (Spagna), campionate da rocca petrosa, denti e falangi: elementi con una suscettibilità all’alterazione post-mortem molto diversa.',
      'research.t08': 'Esecuzione delle pipeline di classificazione Kraken2 (GTDB) e KrakenUniq (MicrobialNT) come job array SLURM sul cluster HPC Dardel (PDC, KTH), separando il segnale endogeno dalla comunità di origine ambientale che registra la colonizzazione post-mortem dell’osso.',
      'research.t09': 'Valutazione della concordanza fra strumenti (Procrustes, Spearman, PCoA su Bray–Curtis) e screening di tutti i campioni per <em>Yersinia pestis</em>, <em>Mycobacterium tuberculosis</em> e <em>Tannerella forsythia</em>; consegna di tabelle di conteggi, figure e relazione comparativa.',
      'research.t12': 'Laboratorio osteologico, progetto <em>Tusculum</em>',
      'research.t13': 'Catalogazione e analisi di resti umani medievali dal sito della cattedrale dell’Area G (DG-ABAP n. 245): inventario scheletrico e identificazione degli elementi, profilo biologico e registrazione macroscopica di conservazione, degrado da esposizione e alterazione tafonomica.',
      'research.t14': 'Gestione della digitalizzazione del dataset antropologico, garantendo la tracciabilità fra resti, schede e documentazione fotografica.',
      'research.t16': 'Sapienza Università di Roma',
      'research.t17': 'Tirocinio di ricerca presso il <em>Laboratorio di Paleoantropologia e Bioarcheologia</em>',
      'research.t18': 'Studio bioantropologico e rivalutazione critica di una collezione di crani umani acquisita da Giuseppe Sergi (inizio XX secolo): profilo biologico, paleopatologia dentaria, storia degli studi precedenti e valutazione sistematica dello stato di conservazione, distinguendo il danno tafonomico da quello introdotto durante lo scavo e la conservazione museale. L’obiettivo era riportare in vita una collezione scientifica trascurata e proporre nuove direzioni di ricerca.',
      'research.t19': 'Progettazione della pipeline R riproducibile usata per la collezione (<em>Etruscan-Analysis</em>, rilasciata open source).',
      'research.t22': 'Tirocinio di ricerca presso il Centro Ricerche ENEA, Casaccia (Roma)',
      'research.t23': 'Progettazione ed esecuzione in autonomia di un flusso di lavoro metagenomico completo sul deterioramento di un substrato minerale mediato dai microrganismi: campionamento sul campo e documentazione fotografica dei biofilm sulle pareti storiche del <em>Casino del Bel Respiro</em>, estrazione del DNA genomico, PCR (16S rRNA, ITS), sequenziamento degli ampliconi e classificazione filogenetica.',
      'research.t24': 'Costruzione da zero della pipeline R (phyloseq, vegan, ggplot2): diversità alfa e beta, composizione tassonomica e successione dei gruppi funzionali dopo trattamenti conservativi sostenibili. Presentata come contributo orale (UniPi, 2025) e abstract in coautoraggio.',
      'research.t26': 'Sapienza Università di Roma',
      'research.t27': 'Tirocinio di ricerca: identificazione tassonomica e analisi iconografica',
      'research.t28': 'Studio del ciclo dei <em>Quattro Elementi</em> di Jan Brueghel il Vecchio: ricerca bibliografica, classificazione tassonomica delle specie rappresentate e documentazione fotografica ad alta risoluzione nel contesto naturalistico del Seicento.',

      /* ── education ───────────────────────────────────────────────────── */
      'education.t01': 'Formazione',
      'education.t02': 'Titoli di studio, scambio e convegni',
      'education.t03': 'Gli studi alla Sapienza Università di Roma e alla Stockholm University, insieme ai convegni, ai workshop e ai webinar a cui partecipo.',
      'education.t04': '09/2024 – laurea prevista il 21/10/2026',
      'education.t05': 'Sapienza Università di Roma',
      'education.t06': 'Laurea magistrale in <em>Scienze e Tecnologie per la Conservazione dei Beni Culturali</em> (LM-11)',
      'education.t07': '<strong>Tesi:</strong> Conservazione e rivalutazione di una collezione scheletrica dimenticata: studio storico e bioarcheologico di crani umani di area etrusca acquisiti da G. Sergi all’inizio del XX secolo.',
      'education.t08': 'Relatori: Dott.ssa Ileana Micarelli, Prof.ssa Mary Anne Tafuri, Prof.ssa Laura Maria Michetti.',
      'education.t09': 'Corso erogato in italiano e in inglese; ammissione subordinata alla certificazione di inglese B2 (QCER).',
      'education.t10': 'Rappresentante degli studenti per il Dipartimento di Biologia Ambientale (triennale, magistrale e dottorato) e per la classe di laurea magistrale LM-11.',
      'education.t12': 'Stockholm University, Svezia',
      'education.t13': 'Studentessa in scambio Erasmus+',
      'education.t14': 'Corsi: <em>Palaeogenetics</em> (BL7069); <em>Modelling Tools for Environmental Scientific Studies</em> (MI4011); <em>Communicating Environmental Science</em> (MI4008).',
      'education.t16': 'Sapienza Università di Roma · Voto finale 110/110',
      'education.t17': 'Laurea triennale in <em>Tecnologie per la Conservazione e il Restauro dei Beni Culturali</em> (L-43)',
      'education.t19': 'Relatori: Prof. Enea Gino Di Domenico, Dott.ssa Chiara Alisi, Prof.ssa Viviana Fonti, Prof. Claudio Chimenti.',
      'education.t20': 'Rappresentante degli studenti della classe di laurea L-43.',
      'education.t21': 'Convegni, workshop e webinar',
      'education.t22': 'Formazione e incontri scientifici',
      'education.m02': 'Stoccolma, Svezia',
      'education.m07': 'Seminario: Nuove opportunità professionali per i biologi nel mondo dell’arte e dei beni culturali',
      'education.m12': 'Sapienza Università di Roma',
      'education.m15': 'Seminario: La meteorologia moderna e il ruolo guida dell’Italia nel suo sviluppo storico',

      /* ── open source ─────────────────────────────────────────────────── */
      'projects.t02': 'Il codice dietro le analisi',
      'projects.t03': 'Pipeline in R e shell dei miei progetti, pubblicate apertamente perché le analisi si possano rieseguire.',
      'projects.t05': 'Etruscan-Analysis: pipeline bioarcheologica',
      'projects.t06': 'Pipeline per una collezione storica di crani: standardizzazione e controllo delle schede, mappe di calore anatomiche delle patologie dentarie e dei danni tafonomici, indicatori di stress per fascia d’età e mappatura interattiva della provenienza. Include un dataset fittizio per il riuso.',
      'projects.t09': 'Framework per il data mining bibliografico e l’analisi statistica degli indicatori osteologici di stress nelle popolazioni non adulte: 28 indicatori, matrici di co-occorrenza, parsing cronologico degli intervalli dei siti e test d’ipotesi non parametrici. Ossatura analitica della revisione sistematica.',
      'projects.t12': 'Script R e shell per il confronto sul DNA antico di Valencia sul cluster HPC Dardel: job array SLURM, costruzione della matrice di abbondanza, validazione incrociata fra strumenti e screening dei patogeni.',
      'projects.t15': 'Globo 3D interattivo per la mappatura temporale e spaziale di dati ambientali. Sviluppato per <em>Communicating Environmental Science</em> (MI4008), Stockholm University.',
      'projects.t18': 'Archivio e prototipo grafico per la sezione testimonianze di <em>Storie dietro Scienze ABC</em>, il progetto di divulgazione scientifica della Sapienza.',
      'projects.t19': 'R · in uscita',
      'projects.t21': 'Pipeline R per l’analisi degli ampliconi 16S rRNA e ITS dei biofilm su superfici lapidee: analisi della diversità con phyloseq e classificazione dei gruppi funzionali.',

      /* ── publications ────────────────────────────────────────────────── */
      'pubs.t01': 'Pubblicazioni e interventi',
      'pubs.t02': 'Prodotti della ricerca',
      'pubs.t03': 'Abstract pubblicati, manoscritti in preparazione e contributi orali a convegni nazionali e internazionali.',
      'pubs.t04': 'Pubblicazioni',
      'pubs.t07': 'Abstract negli atti di <em>The Omics &amp; Heritage</em> (O&amp;H) · Roma, Italia · 14–15 maggio 2024',
      'pubs.t08': 'Manoscritti in preparazione',
      'pubs.t11': '<em>International Biodeterioration &amp; Biodegradation</em> · manoscritto in preparazione, 2026',
      'pubs.t14': '<em>International Journal of Paleopathology</em> · manoscritto in preparazione, 2026',
      'pubs.t17': 'Manoscritto in preparazione, 2026',
      'pubs.t18': 'Contributi orali',
      'pubs.t21': '<em>Orizzonti Antichi tra Ordine Perduto e Nuove Armonie</em> · Università di Pisa · 02–04/12/2025',
      'pubs.t24': 'Coautrice del contributo orale · <em>The Omics &amp; Heritage</em> (O&amp;H) · CNR, ISB · 14–15/05/2024',

      /* ── awards & skills ─────────────────────────────────────────────── */
      'cv.t02': 'Premi, competenze e percorso',
      'cv.t03': 'Borse e premi al merito, competenze di laboratorio e di analisi, esperienze lavorative e certificazioni.',
      'cv.t04': 'Assegno di tutorato (Cat. B1), corsi di laurea in <em>Scienze Applicate ai Beni Culturali</em>',
      'cv.t05': 'Dipartimento di Biologia Ambientale, Sapienza Università di Roma. Assegnato tramite selezione pubblica comparativa (bando BT-B1 18/2026, 2 posti disponibili), valutata su voti di laurea, carriera accademica e precedenti esperienze di tutorato. 75 ore di supporto alla didattica e ai laboratori per le classi di laurea L-43 e LM-11.',
      'cv.t06': 'Borsa di merito, Percorso d’Eccellenza (magistrale)',
      'cv.t07': 'Borsa di studio e programma di eccellenza altamente selettivi (<em>Percorso d’Eccellenza</em>) riservati agli studenti in cima alla graduatoria, con un curriculum integrativo di ricerca avanzata oltre i requisiti ordinari del corso. Progetto qualificante: analisi metagenomica di campioni archeologici romani e medievali presso il Centre for Palaeogenetics di Stoccolma.',
      'cv.t08': 'Borsa di merito, Percorso d’Eccellenza (triennale)',
      'cv.t09': 'Borsa di studio e programma di eccellenza altamente selettivi (<em>Percorso d’Eccellenza</em>) riservati agli studenti in cima alla graduatoria. Progetto qualificante: analisi iconografica e tassonomica del ciclo dei <em>Quattro Elementi</em> di Jan Brueghel il Vecchio.',
      'cv.t10': 'Collaborazione studentesca, Biblioteca di Scienze della Terra',
      'cv.t11': 'Sapienza Università di Roma. Collaborazione studentesca al merito assegnata tramite graduatoria di Ateneo.',
      'cv.t12': 'Competenze',
      'cv.t13': 'Al banco e in R',
      'cv.t14': 'Osteologia, tafonomia e conservazione dei resti scheletrici',
      'cv.t15': 'Inventario scheletrico e profilo biologico (età, sesso, statura) · paleopatologia dentaria · valutazione macroscopica di conservazione, degrado da esposizione e alterazione tafonomica · strategia di campionamento · gestione delle collezioni e tracciabilità fotografica',
      'cv.t16': 'Pratica di laboratorio e analitica',
      'cv.t17': '<em>Molecolare:</em> estrazione di DNA antico e genomico · PCR (16S rRNA, ITS) · sequenziamento degli ampliconi · controllo della contaminazione in contesti a basso numero di copie.<br><em>Microscopia:</em> microscopia ottica e stereomicroscopia · campionamento di biofilm',
      'cv.t18': 'Analisi dei dati, statistica e reportistica',
      'cv.t19': 'R (tidyverse, phyloseq, vegan, ggplot2, sf, leaflet) · test non parametrici · ordinamento multivariato (PCoA, Bray–Curtis, Procrustes) · pipeline riproducibili, Git/GitHub, LaTeX · figure, relazioni e manoscritti',
      'cv.t20': 'Bioinformatica e calcolo ad alte prestazioni',
      'cv.t21': 'Kraken2 · KrakenUniq · screening dei patogeni dai conteggi di read · job array SLURM su HPC (Dardel, PDC/KTH) · scripting shell su Linux',
      'cv.t22': 'Basi scientifiche',
      'cv.t23': 'Chimica generale, organica e analitica · anatomia umana e biologia scheletrica · microbiologia e biologia del deterioramento · biostatistica',
      'cv.t24': 'Comunicazione, organizzazione e autonomia',
      'cv.t25': 'Progetti condotti in autonomia dal disegno di campionamento alla relazione scritta · rappresentante degli studenti eletta a tre livelli di corso (L-43, LM-11, dottorato) · interventi a convegni e coautoraggi · scrittura accademica in italiano e in inglese',
      'cv.t26': 'Esperienze lavorative',
      'cv.t27': 'Certificazioni',
      'cv.m01': 'Assistente di biblioteca',
      'cv.m02': 'Biblioteca del Dipartimento di Scienze della Terra, Sapienza Università di Roma',
      'cv.m03': 'Ripetizioni private di materie scientifiche',
      'cv.m04': 'Libera professione',
      'cv.m05': 'Istruttrice di tennis',
      'cv.m06': 'Summer camp <em>Reschio Hotel</em>',
      'cv.m07': 'Open Badge: Rappresentanza studentesca',
      'cv.m08': 'Rilasciato da Bestr',
      'cv.m10': 'Rilasciato da Bestr',
      'cv.m11': 'Corso: formazione su salute e sicurezza, D.Lgs. 81/2008',
      'cv.m13': 'Attestato di eccellenza: Localizing the Sustainable Development Goals (MUSTER)',

      /* ── 404 ─────────────────────────────────────────────────────────── */
      'e404.t01': 'Errore 404',
      'e404.t02': 'Questa pagina non esiste',
      'e404.t03': 'Il link potrebbe non essere più valido, oppure l’indirizzo è stato digitato male. Tutto il sito è a un clic di distanza qui sotto.'
    }
  };

  /* ── snapshot ─────────────────────────────────────────────────────────
     The English is read off the page once, before anything is touched, so
     switching back to English needs no second dictionary and can never drift
     from what is actually in the HTML. */
  var slots = [];

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    slots.push({ el: el, key: el.getAttribute('data-i18n'), mode: 'text', en: el.textContent });
  });
  document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
    slots.push({ el: el, key: el.getAttribute('data-i18n-html'), mode: 'html', en: el.innerHTML });
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
    el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
      var bits = pair.split(':');
      if (bits.length !== 2) return;
      var attr = bits[0].trim(), key = bits[1].trim();
      slots.push({ el: el, key: key, mode: 'attr', attr: attr, en: el.getAttribute(attr) });
    });
  });

  function apply(lang) {
    var table = DICT[lang] || {};
    slots.forEach(function (s) {
      // no entry for this key means "keep the English": that is how project
      // names, tools, institutions, species and dates stay put
      var v = lang === 'en' ? s.en : (table[s.key] != null ? table[s.key] : s.en);
      if (s.mode === 'text')      { if (s.el.textContent !== v) s.el.textContent = v; }
      else if (s.mode === 'html') { if (s.el.innerHTML !== v)   s.el.innerHTML   = v; }
      else                        { s.el.setAttribute(s.attr, v); }
    });

    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-switch__btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
  }

  function stored() {
    try { return localStorage.getItem(STORE); } catch (e) { return null; }
  }
  function remember(lang) {
    try { localStorage.setItem(STORE, lang); } catch (e) { /* private mode */ }
  }

  // an explicit choice always wins; otherwise follow the browser
  var initial = stored();
  if (initial !== 'it' && initial !== 'en') {
    initial = /^it\b/i.test(navigator.language || '') ? 'it' : 'en';
  }
  apply(initial);

  document.querySelectorAll('.lang-switch__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang');
      remember(lang);
      apply(lang);
    });
  });
})();
