# mariagiuliamartinelli.github.io

Personal academic site of Mariagiulia Martinelli — bioarchaeology,
palaeogenetics and conservation science, Sapienza University of Rome.

Hand-written static HTML. **No build step, no generator, no dependencies:** the
repository *is* the site.

```
index.html          home
research.html       research experience
education.html      degrees and conferences
projects.html       open source pipelines
publications.html   publications and talks
cv.html             awards, skills, certifications
404.html            served for any unknown URL

css/style.css       all of the CSS
js/main.js          all of the JS (GSAP + ScrollTrigger, from cdnjs)
js/i18n.js          Italian translation: engine and dictionary in one file
```

## Running it locally

Open a server rather than the file directly, so that root-absolute paths and
`404.html` behave the way they will in production:

```bash
python3 -m http.server 8899
```

then <http://localhost:8899/index.html?anything>. The trailing query string
skips the browser cache, which otherwise serves a stale `index.html` and, with
it, a stale stylesheet.

**After editing `css/style.css`, `js/main.js` or `js/i18n.js`, bump the `?v=`
cache-buster in every HTML file.** It is at `v=32`.

## Languages

English and Italian, from a single set of pages. The HTML holds the English —
`js/i18n.js` swaps in the Italian, and the `EN · IT` control at the top right
switches between them. The choice is remembered in `localStorage`; a first-time
visitor whose browser is set to Italian lands in Italian.

With JavaScript off the site still reads in full, in English: the script only
ever replaces text, it never reveals it. To translate new content, write the
HTML in English, tag it `data-i18n="key"`, and add the key to `js/i18n.js`. A
key with no entry stays in English on purpose — that is how project names,
tools, institutions and species are kept from being translated.

## Deployment

Live at <https://mariagiuliamartinelli.github.io/>. Every push to `main`
republishes it through `.github/workflows/deploy.yml` — there is no staging step,
so what you push is what goes online.

Two conditions live outside the repository and are worth knowing if a deploy
ever stops working: the repository has to stay **public** (Pages does not serve
a private repository on a free plan), and **Settings → Pages → Source** has to
be **GitHub Actions** rather than a branch.

The workflow itself does no building: it checks out the repository, uploads it
as-is and hands it to Pages.

## Before changing anything

Read [`CLAUDE.md`](CLAUDE.md). It records five invariants that were each a real
bug — content visibility that must never depend on JavaScript, a background
gradient anchored to the measured footer height, one text column per page,
media queries that have to match their container's `display`, and grid tracks
that have to be able to shrink. They are easy to reintroduce by accident.
