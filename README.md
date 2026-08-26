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

**After editing `css/style.css` or `js/main.js`, bump the `?v=` cache-buster in
every HTML file.** It is at `v=29`.

## Deployment

Not published yet, and deliberately so: the `push` trigger in
`.github/workflows/deploy.yml` is commented out, so the workflow only runs when
started by hand from the Actions tab.

To go live, three things have to happen together:

1. uncomment the `push:` lines in `.github/workflows/deploy.yml`
2. make this repository **public** — GitHub Pages does not serve a private
   repository on a free plan
3. set **Settings → Pages → Source** to **GitHub Actions**

The workflow itself does no building: it checks out the repository, uploads it
as-is and hands it to Pages.

## Before changing anything

Read [`CLAUDE.md`](CLAUDE.md). It records five invariants that were each a real
bug — content visibility that must never depend on JavaScript, a background
gradient anchored to the measured footer height, one text column per page,
media queries that have to match their container's `display`, and grid tracks
that have to be able to shrink. They are easy to reintroduce by accident.
