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
404.html            servita da GitHub per qualsiasi URL inesistente
css/style.css       tutto il CSS
js/main.js          tutto il JS (GSAP + ScrollTrigger dalla CDN cdnjs)
Martinelli_Mariagiulia_CV.pdf

favicon.svg         elica su fondo viola, la stessa del brand in header
apple-touch-icon.png  180×180, iOS ignora le favicon SVG
icon-512.png        512×512, per Android / PWA
og-image.png        1200×630, anteprima quando il link viene condiviso
.nojekyll           impedisce a GitHub di passare i file per Jekyll
sitemap.xml         le sei pagine, per i motori di ricerca
robots.txt          consente l'indicizzazione, esclude il PDF, punta alla sitemap
site.webmanifest    nome, colori e icone (è l'unico a referenziare icon-512.png)
README.md           cosa è il sito, come si guarda, come si pubblica
.github/workflows/deploy.yml   pubblica il repo così com'è (ora disarmato)
```

`404.html` usa percorsi **root-assoluti** (`/css/style.css`): GitHub la serve
anche per URL profondi come `/a/b/c`, dove i percorsi relativi si
risolverebbero contro quella cartella inesistente e darebbero 404 a loro volta.

---

## Come guardare il sito (leggi prima di dire "non funziona")

**Chrome tiene in cache l'`index.html` stesso.** Il numero di versione (`?v=29`)
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
tutte e sette le pagine.** Ora è a `v=29`.

```bash
python3 - <<'EOF'
import io, glob
for f in sorted(glob.glob('*.html')):
    s = io.open(f, encoding='utf-8').read()
    io.open(f,'w',encoding='utf-8').write(s.replace('?v=29','?v=30'))
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
piastra. Riverificato a 1440px e a 390px: `.reveal-intro`, le tre
`.mission-item` e `.hero-inner > *` restano visibili con `gsap === undefined`.

### 2. Il gradiente delle sottopagine si aggancia a `--footer-h`, non a un numero

`body.subpage` deriva le quattro fermate finali da un unico token:

```css
--paper   calc(100% - var(--footer-h) - 280px)
#c0b6e4   calc(100% - var(--footer-h) - 160px)
#8478ac   calc(100% - var(--footer-h) - 80px)
#4a3f6e   calc(100% - var(--footer-h))
```

Le fermate sono in **pixel dal fondo del documento**, non in percentuale: le
sottopagine hanno lunghezze diverse (projects ~2200px, education ~3400px) e con
fermate in percentuale il footer cadeva su viola pallido nelle pagine corte.

Il valore era scritto a mano come 420px, **e questo era sbagliato**: il footer
non è alto 422px fissi, si re-impagina e cresce mentre il viewport si stringe.
Sotto i 1000px il bordo alto del footer finiva sulla rampa bianco→lavanda e il
suo testo bianco spariva. Altezze misurate su `projects.html`:

| larghezza | footer | `--footer-h` |
|---|---|---|
| ≥1000px | 422px | 422px |
| 760–999px | 478px | 490px |
| 500–700px | 628–635px | 648px |
| 390–460px | 684px | 696px |
| 320–380px | 740px | 752px |

I valori del token hanno ~10px di margine sopra la misura. `.page-nav` lascia
sempre ~290px di aria sopra il footer, quindi la rampa di 280px ci sta dentro a
ogni larghezza, e la sua card è comunque carta opaca.

**Se tocchi il footer, rimisura e aggiorna il token** — non le fermate:

```js
document.querySelector('footer').getBoundingClientRect().height
```

Verificato: 5 sottopagine × 8 larghezze (320→1440), contrasto minimo nel footer
**9,43:1** per il testo e **5,19:1** per i link. Nessun caso sotto 4,5:1.

### 3. Un'unica colonna di testo per pagina

Token `--measure: 880px`. Lo usano `.page-hero .wrap` (come
`calc(var(--measure) + 56px)`, perché `.wrap` aggiunge 28px di padding interno),
`.entry-list`, `.mini-list`, `.award-list`, `.output-block`.

Prima ogni blocco aveva la sua larghezza e una stessa pagina mostrava quattro
margini sinistri diversi scorrendo. Le griglie di card (`.project-grid`,
`.skill-grid`, `.two-col`) restano a 1180: è una seconda misura, voluta.

### 4. Le media query devono parlare la lingua del contenitore

`.award-row` è `display: grid`, ma la sua regola dentro `max-width: 620px` diceva
`flex-direction: column`. Su una griglia quella proprietà **non fa niente**: la
regola sembrava esserci, e per tutto il tempo non ha avuto alcun effetto. La
colonna della data da 158px sopravviveva fino al telefono, il titolo veniva
strizzato a ~52px e la riga sbordava di 16px oltre il bordo destro.

Prima di scrivere `flex-direction` o `grid-template-columns` in una media query,
**controlla il `display` della regola base.** Lo stesso vale per il verso
opposto. Le altre sono state ricontrollate e sono coerenti: `.entry`,
`.mini-row`, `.two-col`, `.footer-grid` sono griglie con regole da griglia;
`.lang-row`, `.page-nav .wrap`, `.award-list` sono flex con regole da flex.

### 5. `minmax(300px, 1fr)` non si comprime sotto i 300px

`.project-grid` e `.skill-grid` usavano `repeat(auto-fit, minmax(300px, 1fr))` e
`minmax(320px, 1fr)`. Su un telefono da 320px il box di contenuto è 280px, ma la
card restava larga 320px e faceva scorrere l'intero documento in orizzontale.

Ora è `minmax(min(300px, 100%), 1fr)`: identico su desktop, comprimibile sul
telefono. Verificato: 6 pagine × 10 larghezze (320→1024), **overflow orizzontale
massimo 0px**.

---

## Colore: i due punti che vincolano tutto

Il fondo è **un solo gradiente sul `body`**, che corre da cima a fondo del
documento; ogni sezione è trasparente, così non si vedono bordi di banda.

```
home:        #a8dcf0 0% · #b2a8f0 16% · #b2a6ee 32% · #957ac8 46%
             #7b64ae 56% · #5f5090 74% · #4a3f6e 100%

sottopagine: #a8dcf0 0% · #b2a8f0 11% · #c0b6e4 19% · bianco 27%
             poi le quattro fermate agganciate a --footer-h (invariante 2)
```

Quanto si può schiarire lo decidono i **due soli punti dove il bianco poggia sul
gradiente** invece che sulla carta:

| punto | fondo | contrasto |
|---|---|---|
| `#explore` (57–79% della home) | `#7b64ae` 56%, `#5f5090` 74% | 4,9:1 e 6,9:1 |
| footer sottopagine | `#4a3f6e` piatto | 9,4:1 bianco · 5,2:1 link `#cdb4ff` |
| footer home (fermate in %) | da `#584a85` a `#4a3f6e` | ≥7,6:1 bianco · ≥4,7:1 link |

La home usa fermate in percentuale e **va bene così**: misurata da 320px a
1440px, il footer cade sempre fra l'82% e il 93% del documento, dove il fondo è
già scuro. Non ha bisogno di `--footer-h`.

**Se il fondo va schiarito ancora**, il bianco di `#explore` scende sotto 4,5:1:
a quel punto conviene passare quella sezione a inchiostro scuro. Non schiarire a
occhio — calcola il contrasto.

### Come misurare il contrasto senza prendere una cantonata

`getComputedStyle(body).backgroundImage` restituisce le fermate **come sono
scritte**, cioè con dentro `calc(100% - 702px)`. `parseFloat` su quella stringa
dà `NaN`, e un parser ingenuo finisce per collassare tutte le fermate e
restituire sempre l'ultimo colore. È già successo: una verifica dava "tutto a
posto, peggio 5,19:1" mentre in realtà stava misurando "bianco su `#4a3f6e`"
a prescindere dalla posizione, e nascondeva difetti a 1,9:1.

Un parser corretto deve:

1. risolvere `calc(100% - Npx)` come `altezzaDocumento - N`;
2. compositare l'**alpha**: `rgba(26,15,61,0.12)` non è scuro, è il 12% di scuro
   sopra il gradiente, e va calcolato;
3. risalire gli antenati per trovare l'eventuale sfondo opaco che copre il
   gradiente (le card `.page-nav`, `.project-card`…);
4. saltare la piastra: `.dish` ha un `radial-gradient` scuro tutto suo, quindi
   il testo bianco dentro sta benissimo anche se il gradiente del body lì è
   chiaro. Ignorare questo dà falsi positivi su `.portrait-mark`.

In alternativa, la verità assoluta: screenshot e campionamento dei pixel.

### Difetti di contrasto già corretti — non tornare indietro

| elemento | era | ora | come |
|---|---|---|---|
| `.nav-cta` "Contact Me" | 1,9:1 | 9,4:1 | `--hdr-cta-ink`, una variabile a parte |
| `.cta-box h2` | 2,1:1 | 7,7:1 | bianco: `.cta-box` non ha uno sfondo suo |
| `.entry-date` `.mini-date` `.output-title` | 3,2:1 | ≥6,2:1 | `--accent-ink` invece di `--violet-1` |
| `.entry-org`, `.mini-row span` | 3,4:1 | ≥5,4:1 | `#3d3945` invece di `--muted` |
| `#explore .eyebrow-pill--on-dark` | 3,3:1 | ≥4,8:1 | inchiostro bianco + pill più scura |

Due trappole dentro questa tabella:

- **`.nav-cta` ha bisogno di due inchiostri, non di uno.** A riposo la pill è
  `rgba(26,15,61,0.12)`, che in cima alla pagina composita su azzurro chiaro; con
  `.is-over-light` diventa `#231f20` opaca. Il testo deve seguire il fondo della
  *pill*, non quello dell'header: da qui `--hdr-cta-ink`.
- **`.eyebrow-pill--on-dark` sta su fondo chiaro nelle `.page-hero`** delle
  sottopagine e del 404, dove l'inchiostro scuro è quello giusto. `#explore` è
  l'unico punto dove la classe sta davvero sul scuro: la regola è circoscritta a
  `#explore`, non applicata alla classe.

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

## Meta e icone

Ogni pagina porta, subito sotto la sua `<meta name="description">`:

- `<link rel="canonical">` verso il proprio URL su
  `https://mariagiuliamartinelli.github.io/` (la home punta alla radice, senza
  `index.html`)
- `favicon.svg` + `apple-touch-icon.png` + `theme-color`
- il blocco Open Graph / Twitter, con `og:image` che punta a `og-image.png`

`og:image` **deve restare un URL assoluto**: LinkedIn, WhatsApp e Slack non
risolvono i percorsi relativi. Se il dominio cambia, vanno riscritti anche
`canonical` e `og:url` in tutte e sei le pagine.

`og-image.png` è stato generato da una pagina HTML temporanea renderizzata a
1200×630 e non ha un sorgente nel repo: per rifarla, ricostruisci una pagina con
lo stesso gradiente e i font del sito e fanne uno screenshot a quella misura.

---

## Deploy

**Il sito non è ancora online, ed è voluto.** Il workflow è disarmato: il
trigger `push` è commentato e `deploy.yml` parte solo a mano dalla tab Actions.
Pushare non pubblica niente.

Per pubblicare davvero servono tre cose insieme:

1. riattivare le due righe `push:` in `.github/workflows/deploy.yml`
2. rendere il repo **pubblico** — Pages non serve un repo privato con un piano
   gratuito, e un repo `<utente>.github.io` privato semplicemente non risponde
3. **Settings → Pages → Source** su **GitHub Actions**, non su *Deploy from a branch*

`.github/workflows/deploy.yml` fa checkout, `upload-pages-artifact` con
`path: '.'` e `deploy-pages`: nessun build, il repo **è** il sito.

Ha sostituito il workflow Hugo Blox che stava qui prima e che girava
`hugo --minify`: dopo la rimozione del sito Hugo quel workflow sarebbe fallito a
ogni push, e con Pages impostato su "GitHub Actions" il sito nuovo non sarebbe
mai andato online. Sono stati rimossi anche `import-publications.yml` (importava
BibTeX in `content/publication/`, cartella che non esiste più) e
`updater-wip.yml` (girava solo per l'organizzazione HugoBlox).

Se il deploy non parte, controlla in **Settings → Pages** che *Source* sia
**GitHub Actions** e non *Deploy from a branch*.

---

## Stato git

```
branch di lavoro:  redesign/static-site
branch principale: main  (ha il merge, è quello buono)
remote:            git@github.com:mariagiuliamartinelli/mariagiuliamartinelli.github.io  (SSH)
```

**Non esiste nessun sito Hugo online.** Il `CLAUDE.md` precedente dava per
scontato che `mariagiuliamartinelli.github.io` fosse pubblicato con Hugo: è
falso, quell'URL risponde 404 e il repo non esisteva proprio. `origin/main`
puntava a `5879dee`, un commit che non si trova in nessun repo raggiungibile
dall'account — la cartella era stata clonata da un repo poi cancellato o
rinominato, e il remote era stato impostato in previsione di un repo mai creato.

Conseguenza pratica: il merge che rimuove i 258 file Hugo non ha tolto niente a
nessuno, perché non c'era niente di pubblicato. La storia Hugo resta comunque
fra gli antenati di `main`: l'ultimo commit in cui quei file esistevano è
**d7c61d3** (`Update scienze-abc testimonials and photos`).

```bash
git show d7c61d3 --stat          # cosa c'era
git checkout d7c61d3 -- <file>   # ripescare un singolo file
```

L'autenticazione col remote è via SSH, con una chiave dedicata
(`~/.ssh/id_ed25519_github`, voce `Host github.com` in `~/.ssh/config`, con
`IdentitiesOnly yes` per non confonderla con quella del PDC).

---

## Aperto / non ancora fatto

- **Il PDF del CV pesa 3,9 MB.** Va su ogni clone del repo e nel deploy. Se
  serve alleggerire, ricomprimerlo è la modifica singola più efficace.
- **L'header fisso passa sopra la card di `.page-nav`** quando si è in fondo a
  una sottopagina: il nome del brand e il titolo "NEXT →" si sovrappongono. Non è
  una regressione mobile, succede a tutte le larghezze ed è il comportamento
  normale di un header trasparente in `position: fixed`. Se dà fastidio, la
  soluzione è nascondere l'header quando si scorre verso il basso.
- **`#hero` e `#explore` della home restano fra 3,3:1 e 4,1:1.** Riguarda i
  bianchi semi-trasparenti (`rgba(255,255,255,0.78)` di `.helix-label span`), il
  paragrafo e l'h2 di `#explore`, e due righe di `#hero` a 320px. Sono gli unici
  gruppi ancora sotto 4,5:1 dopo la scansione di 3985 elementi su 7 pagine × 12
  larghezze. Non li ho toccati perché `#explore` è la sezione su cui è tarata
  tutta la scala di colore del sito: alzarne il contrasto significa decidere se
  scurire il fondo lì o portare quei testi a bianco pieno.
- **GSAP arriva da cdnjs.** Il fallback è verificato e la pagina resta usabile,
  ma il sito dipende da un terzo. Se vuoi toglierlo del tutto, servono ~40 righe
  di `IntersectionObserver` al posto di ScrollTrigger.
