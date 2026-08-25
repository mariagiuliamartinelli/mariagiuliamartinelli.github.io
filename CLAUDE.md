# Sito personale — Mariagiulia Martinelli

Sito statico scritto a mano: sei pagine HTML, un foglio di stile, uno script.
**Nessun build step**, nessun generatore. Si apre e basta.

```
index.html          home: piastra di Petri + sequenza di scroll + hub a elica
research.html       5 esperienze di ricerca
education.html      titoli di studio + conferenze
projects.html       6 progetti open source
publications.html   pubblicazioni, manoscritti, contributi orali
cv.html             premi, competenze, esperienza, certificazioni
css/style.css       tutto il CSS
js/main.js          tutto il JS (GSAP + ScrollTrigger dalla CDN cdnjs)
Martinelli_Mariagiulia_CV.pdf
```

---

## Come guardare il sito (leggi prima di dire "non funziona")

**Chrome tiene in cache l'`index.html` stesso.** Il numero di versione (`?v=26`)
sta *dentro* l'HTML, quindi se il browser serve l'HTML vecchio continua a
caricare anche il CSS vecchio, e le modifiche non si vedono. Questo ha già fatto
perdere tempo una volta.

Modo affidabile:

```bash
cd "/Users/macbookpro/Desktop/Università/website"
python3 -m http.server 8899
```

poi apri `http://localhost:8899/index.html?qualcosa` — la query finale salta la
cache in modo garantito, senza scorciatoie da tastiera.

**Dopo ogni modifica a `css/style.css` o `js/main.js`, alza il cache-buster in
tutte e sei le pagine.** Ora è a `v=26`.

```bash
python3 - <<'EOF'
import io, glob
for f in sorted(glob.glob('*.html')):
    s = io.open(f, encoding='utf-8').read()
    io.open(f,'w',encoding='utf-8').write(s.replace('?v=26','?v=27'))
EOF
```

---

## Invarianti — non reintrodurre questi schemi

Sono stati tutti bug reali, trovati e corretti. Sono facili da rifare per
distrazione.

### 1. La visibilità del contenuto non dipende mai da JavaScript

Due volte il sito è finito con sezioni **invisibili per sempre**:

- `.hero-inner > *` stava a `opacity: 0` e si riaccendeva solo quando `main.js`
  aggiungeva `motion-ready` — classe messa dentro `onComplete` di una timeline
  GSAP. In una scheda aperta in secondo piano `requestAnimationFrame` è
  rallentato, la timeline non finisce mai, il callback non parte: piastra
  invisibile.
- `.reveal-intro` e `.mission-item` stavano a `opacity: 0` nel CSS su desktop, e
  **solo ScrollTrigger** poteva riaccenderli. GSAP arriva da una CDN: se quella
  richiesta non va a buon fine, quella sezione non compare mai. Sopra i 900px non
  c'era nessun fallback, perché le regole che li rendevano visibili stavano
  dentro la media query del telefono.

**Regola:** il CSS lascia sempre tutto visibile. Se una sequenza animata deve
nascondere qualcosa, lo nasconde **lo script**, con `gsap.set()`, e solo dopo
aver verificato che può davvero pilotarla.

Come è fatto adesso in `js/main.js`:

```js
document.body.classList.add('hero-scrub');   // il layout pinnato è opt-in
gsap.set(revealIntro, { opacity: 0 });       // il nascondimento lo fa il JS
gsap.set(missionItems, { y: 26, opacity: 0 });
setTimeout(() => {                            // rete di sicurezza
  if (!ScrollTrigger.getAll().length) { /* annulla tutto */ }
}, 2500);
```

Verifica veloce del fallback: togli i tre `<script src="https://cdnjs...">` da
una copia della home e aprila. Deve essere **tutto visibile**, impilato sotto la
piastra.

### 2. Le fermate scure del gradiente delle sottopagine sono in pixel, non in percentuale

`body.subpage` usa `calc(100% - 700px)` … `calc(100% - 420px)`.

Motivo: le sottopagine hanno lunghezze diverse (projects ~2200px, education
~3400px). Con fermate in percentuale il footer cadeva su viola pallido nelle
pagine corte e il suo testo bianco spariva. Il footer è alto 422px fissi, quindi
ancorare al **fondo del documento** è corretto a qualsiasi lunghezza. La rampa
di 280px sta dietro `.page-nav`, la cui card è opaca.

### 3. Un'unica colonna di testo per pagina

Token `--measure: 880px`. Lo usano `.page-hero .wrap` (come
`calc(var(--measure) + 56px)`, perché `.wrap` aggiunge 28px di padding interno),
`.entry-list`, `.mini-list`, `.award-list`, `.output-block`.

Prima ogni blocco aveva la sua larghezza e una stessa pagina mostrava quattro
margini sinistri diversi scorrendo. Le griglie di card (`.project-grid`,
`.skill-grid`, `.two-col`) restano a 1180: è una seconda misura, voluta.

---

## Colore: i due punti che vincolano tutto

Il fondo è **un solo gradiente sul `body`**, che corre da cima a fondo del
documento; ogni sezione è trasparente, così non si vedono bordi di banda.

```
home:        #a8dcf0 0% · #b2a8f0 16% · #b2a6ee 32% · #957ac8 46%
             #7b64ae 56% · #5f5090 74% · #4a3f6e 100%

sottopagine: #a8dcf0 0% · #b2a8f0 11% · #c0b6e4 19% · bianco 27%
             bianco calc(100%-700px) · #c0b6e4 calc(100%-580px)
             #8478ac calc(100%-500px) · #4a3f6e calc(100%-420px)
```

Quanto si può schiarire lo decidono i **due soli punti dove il bianco poggia sul
gradiente** invece che sulla carta:

| punto | fondo | contrasto |
|---|---|---|
| `#explore` (57–79% della home) | `#7b64ae` 56%, `#5f5090` 74% | 4,9:1 e 6,9:1 |
| footer (tutte le pagine) | `#4a3f6e` | 9,4:1 bianco · 5,2:1 link `#cdb4ff` |

**Se il fondo va schiarito ancora**, il bianco di `#explore` scende sotto 4,5:1:
a quel punto conviene passare quella sezione a inchiostro scuro. Non schiarire a
occhio — calcola il contrasto.

Altri colori con una ragione dietro:

- `--accent-ink: #421479` — l'accent `#A94BF7` su viola pallido dà ~1,4:1. Usato
  per `.reveal-intro h1 em` e `.mission-text strong`.
- `footer a { color: #cdb4ff }` — il colore link globale `--violet-1` sul footer
  scuro dà ~2,2:1.
- `.portrait-mark` (le iniziali MM) è inchiostro **chiaro**: sta sull'agar scuro
  dentro la piastra.
- `--muted: #5f5a68` — il grigio precedente spariva nel passaggio viola→bianco,
  dove cade la prima voce di ogni elenco.

---

## La sequenza di scroll della home

Su desktop (≥900px, con GSAP disponibile), `#hero` viene pinnato per
`1.7 × altezza viewport` e la timeline scrubba:

| momento | cosa succede |
|---|---|
| 0 riposo | solo la piastra, centrata |
| 0 → 0.3 | la piastra scivola a sinistra e cresce |
| 0.12 → 0.26 | l'intro compare a destra |
| 0.46 → 0.58 | l'intro sfuma via |
| 0.62 → | le tre voci mission compaiono in sequenza |

Ogni step ha una durata esplicita: senza, GSAP applica il suo default di 0.5s e i
tre stati finiscono sovrapposti sullo schermo insieme.

Sotto i 900px, o senza GSAP: tutto in flusso normale sotto la piastra.

---

## Stato git

```
branch corrente:  redesign/static-site
main:             d7c61d3 — il VECCHIO sito Hugo, intatto
remote:           github.com/mariagiuliamartinelli/mariagiuliamartinelli.github.io
```

`main` è il branch di pubblicazione di GitHub Pages: **il sito online è ancora
quello Hugo**. Il sito nuovo vive solo sul branch, e non è mai stato pushato.

```
1ed35ea  Soften both gradients a second step, sub-pages most of all
0c207ff  Make the scroll panel independent of the CDN, and lift the background
d9f3a18  Give each page one column, and fix type that fell below contrast
a347080  Fix blank hero and unreadable type on the violet ground
8aef08e  Replace Hugo site with hand-written static site
```

Il primo commit cancella 258 file del vecchio sito Hugo. Per pubblicare:

```bash
git checkout main && git merge redesign/static-site && git push
```

**Da decidere prima di pubblicare:** se sostituire davvero il sito Hugo o tenerlo
da qualche parte. Il merge lo rimuove.

---

## Aperto / non ancora fatto

- **Mobile non verificato.** Tutti i controlli sono stati fatti a 1440×900,
  1280×700 e 1503×812. La media query `max-width: 620px` non è stata riprovata
  dopo le modifiche a `--measure`, al gradiente e al layout del pannello.
- **Il footer del footer su mobile**: gli offset in `calc(100% - Npx)` presumono
  un footer di 422px, vero su desktop. Su mobile `.footer-grid` va a una colonna
  e il footer è più alto, quindi quegli offset andrebbero rialzati dentro la
  media query.
- `assets/images/` è una cartella vuota; `assets/docs/resume.pdf` è un residuo
  del sito Hugo e nessuna pagina lo linka.
