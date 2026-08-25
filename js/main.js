// ---------- Header scroll state ----------
// The solid white bar only makes sense over the light sections. While the violet
// hero still covers the top of the screen the header stays transparent, so no
// white strip slides in over the dish while it is pinned.
const header = document.getElementById('header');
// The header never paints a background. It only needs to flip from white ink to
// dark ink while the light middle band of a sub-page passes underneath it; the
// home page stays dark top to bottom, so there it is always white.
// The light band is defined by the body gradient, which is expressed in
// percentages of document height, so the ink has to flip against those same
// percentages. Keying it to where a section happens to end instead left the
// ink dark while the background was still deep violet.
const LIGHT_FROM = 0.24; // gradient is pale enough for dark ink from here
const LIGHT_TO = 0.74;   // and stays pale enough until here
const updateHeader = () => {
  if (!document.body.classList.contains('subpage')) return;
  const docH = document.documentElement.scrollHeight;
  const headerLine = window.scrollY + header.offsetHeight * 0.5;
  const frac = headerLine / docH;
  header.classList.toggle('is-over-light', frac > LIGHT_FROM && frac < LIGHT_TO);
};
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', updateHeader);

// ---------- Side menu ----------
const hamburger = document.getElementById('hamburger');
const sideMenu = document.getElementById('side-menu');
const sideMenuOverlay = document.getElementById('side-menu-overlay');
const sideMenuClose = document.getElementById('side-menu-close');
function openMenu() {
  sideMenu.classList.add('is-open');
  sideMenuOverlay.classList.add('is-open');
  sideMenu.setAttribute('aria-hidden', 'false');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
}
function closeMenu() {
  sideMenu.classList.remove('is-open');
  sideMenuOverlay.classList.remove('is-open');
  sideMenu.setAttribute('aria-hidden', 'true');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}
hamburger.addEventListener('click', () => {
  sideMenu.classList.contains('is-open') ? closeMenu() : openMenu();
});
sideMenuClose.addEventListener('click', closeMenu);
sideMenuOverlay.addEventListener('click', closeMenu);
sideMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

// ---------- Smooth anchor scrolling (via GSAP, so it never fights ScrollTrigger) ----------
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (window.gsap && window.ScrollToPlugin) {
  gsap.registerPlugin(ScrollToPlugin);
}
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (!REDUCED && window.gsap && window.ScrollToPlugin) {
      gsap.to(window, { duration: 0.9, ease: 'power2.inOut', scrollTo: { y: target, offsetY: 0 } });
    } else {
      target.scrollIntoView();
    }
  });
});

// ---------- Scroll reveal ----------
const revealItems = document.querySelectorAll('[data-reveal]');
if (REDUCED || !('IntersectionObserver' in window)) {
  revealItems.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
  revealItems.forEach((el) => io.observe(el));
}

// ---------- Petri dish: organic bacteria colonies grow on hover, then die back ----------
const COLONY_COLORS = ['#ffffff', '#e7d8ff', '#c9a4f7', '#8b58ee', '#A94BF7'];
// lifecycle, in milliseconds: colonies grow in, hold, then fade away so the
// dish clears itself instead of filling up permanently.
const GROW_MS = 2600;
const HOLD_MS = 3200;
const FADE_MS = 3000;
const LIFE_MS = GROW_MS + HOLD_MS + FADE_MS;

class Colony {
  constructor(x, y, born) {
    this.x = x; this.y = y;
    this.born = born;
    this.maxR = 26 + Math.random() * 38;
    this.color = COLONY_COLORS[Math.floor(Math.random() * COLONY_COLORS.length)];
    // irregular blob: cluster of offset lobes so it doesn't read as a perfect dot
    const lobeCount = 5 + Math.floor(Math.random() * 4);
    this.lobes = Array.from({ length: lobeCount }, (_, i) => ({
      angle: (i / lobeCount) * Math.PI * 2 + Math.random() * 0.6,
      dist: 0.35 + Math.random() * 0.4,
      scale: 0.5 + Math.random() * 0.5,
      speed: 0.6 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
    }));
  }
  draw(ctx, now) {
    const age = now - this.born;
    if (age >= LIFE_MS) return;

    const grow = Math.min(1, age / GROW_MS);
    const eased = 1 - Math.pow(1 - grow, 3);
    const r = this.maxR * eased;
    if (r < 0.6) return;

    // full opacity while growing and holding, then ease out
    const fadeAge = age - GROW_MS - HOLD_MS;
    const life = fadeAge <= 0 ? 1 : Math.max(0, 1 - fadeAge / FADE_MS);
    if (life <= 0) return;

    const t = now / 1000;
    ctx.save();
    ctx.shadowColor = this.color;
    ctx.shadowBlur = r * 1.1;
    ctx.globalAlpha = 0.5 * eased * life;

    // soft core glow
    const core = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
    core.addColorStop(0, this.color);
    core.addColorStop(0.55, this.color);
    core.addColorStop(1, 'transparent');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
    ctx.fill();

    // irregular lobes bleeding outward, like colony margins
    ctx.globalAlpha = 0.32 * eased * life;
    this.lobes.forEach((lobe) => {
      const wob = Math.sin(t * lobe.speed + lobe.phase) * 0.15 + 1;
      const lx = this.x + Math.cos(lobe.angle) * r * lobe.dist * wob;
      const ly = this.y + Math.sin(lobe.angle) * r * lobe.dist * wob;
      const lr = r * lobe.scale * 0.55 * wob;
      const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lx, ly, Math.max(lr, 0.5), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}
function mountDish(container) {
  const canvas = document.createElement('canvas');
  // z-index 3 sits above the agar bed (1) but below the meniscus (4) and gloss (5)
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border-radius:50%;z-index:3;';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  function resize() {
    w = container.clientWidth; h = container.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  let colonies = [];
  let last = 0;
  function seed(clientX, clientY) {
    const now = performance.now();
    if (now - last < 90) return;
    last = now;
    const rect = container.getBoundingClientRect();
    colonies.push(new Colony(clientX - rect.left, clientY - rect.top, now));
  }
  container.addEventListener('mousemove', (e) => seed(e.clientX, e.clientY));

  // touch screens never fire mousemove, so the dish would sit inert on a phone
  const onTouch = (e) => {
    const t = e.touches && e.touches[0];
    if (t) seed(t.clientX, t.clientY);
  };
  container.addEventListener('touchstart', onTouch, { passive: true });
  container.addEventListener('touchmove', onTouch, { passive: true });

  // and the "hover the dish" prompt makes no sense without a pointer
  const hint = container.querySelector('.dish-hint');
  if (hint && window.matchMedia('(hover: none)').matches) {
    hint.textContent = 'tap the dish';
  }

  if (!REDUCED) {
    (function frame(now) {
      ctx.clearRect(0, 0, w, h);
      // drop colonies that have finished their lifecycle
      if (colonies.length && now - colonies[0].born > LIFE_MS) {
        colonies = colonies.filter((c) => now - c.born < LIFE_MS);
      }
      colonies.forEach((c) => c.draw(ctx, now));
      requestAnimationFrame(frame);
    })(performance.now());
  }
}
document.querySelectorAll('[data-dish]').forEach(mountDish);

// ---------- Helix navigation hub ----------
// A slowly rotating double helix whose rungs pair up with the page links beside it.
// Hovering a link slows the rotation and lights up that rung.
function mountHelixNav() {
  const scene = document.getElementById('helixScene');
  const links = [...document.querySelectorAll('.helix-links a')];
  if (!scene || !links.length) return;

  // declared up front: the hover handlers below close over `target`, and with
  // reduced motion we return early before the spin loop is ever set up
  let angle = 0;
  let speed = 1;
  let target = 1;

  // enough rungs, closely spaced, that the two node columns read as continuous
  // strands rather than a handful of floating dashes
  const RUNGS = 26;
  const rungs = [];
  for (let i = 0; i < RUNGS; i++) {
    const rung = document.createElement('div');
    rung.className = 'helix-rung';
    rung.style.top = `${(i / (RUNGS - 1)) * 100}%`;
    rung.style.transform = `rotateY(${i * 17}deg)`;
    const a = document.createElement('span'); a.className = 'helix-node';
    const bar = document.createElement('span'); bar.className = 'helix-bar';
    const b = document.createElement('span'); b.className = 'helix-node';
    rung.append(a, bar, b);
    scene.appendChild(rung);
    rungs.push(rung);
  }

  // map each link to the rung sitting at its height
  links.forEach((link, i) => {
    const idx = Math.round((i / (links.length - 1)) * (RUNGS - 1));
    const partner = rungs[idx];
    link.addEventListener('mouseenter', () => {
      target = 0.18;                       // slow the spin right down
      partner.classList.add('is-active');
    });
    link.addEventListener('mouseleave', () => {
      target = 1;
      partner.classList.remove('is-active');
    });
  });

  if (REDUCED) {
    scene.style.transform = 'rotateY(-18deg)';
    return;
  }

  let last = performance.now();
  (function spin(now) {
    const dt = now - last;
    last = now;
    speed += (target - speed) * 0.06;      // ease toward the target speed
    angle = (angle + dt * 0.014 * speed) % 360;
    scene.style.transform = `rotateY(${angle}deg)`;
    requestAnimationFrame(spin);
  })(performance.now());
}
mountHelixNav();

// ---------- Magnetic buttons ----------
function magneticOffset(x, y, width, height) {
  const clamp = (v, size) => Math.max(-3, Math.min(3, ((v / size) - 0.5) * 6));
  return { x: clamp(x, width), y: clamp(y, height) };
}
if (!REDUCED && window.gsap) {
  document.querySelectorAll('.btn').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const { x, y } = magneticOffset(e.clientX - rect.left, e.clientY - rect.top, rect.width, rect.height);
      gsap.to(el, { x: x * 2, y: y * 2, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

// ---------- Hero entrance ----------
// Whether the hero is legible must never depend on this animation running.
// It used to: the CSS held .hero-inner > * at opacity 0 and only an onComplete
// callback turned it back on, so a tab opened in the background (where
// requestAnimationFrame is throttled and the timeline never completes) showed
// an empty hero for good. The entrance now moves the elements and nothing else
// : if the ticker never runs they sit 26px low, which nobody notices, instead
// of being invisible or stranded half way through a fade.
document.body.classList.add('motion-enabled', 'motion-ready');
if (!REDUCED && window.gsap) {
  const items = document.querySelectorAll('.hero-inner > *');
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from(items, { y: 26, duration: 0.7, stagger: 0.09 });
}

// ---------- Pinned scroll sequence ----------
// At rest: only the dish. As you scroll: it slides left while the intro text
// fades in on the right, then hands off to the three research points.
const isDesktop = window.matchMedia('(min-width: 900px)');
if (!REDUCED && window.gsap && window.ScrollTrigger && isDesktop.matches) {
  gsap.registerPlugin(ScrollTrigger);
  const dishStage = document.querySelector('.dish-stage');
  const hero = document.getElementById('hero');
  const revealIntro = document.querySelector('.reveal-intro');
  const missionList = document.getElementById('missionList');
  if (dishStage && hero) {
    const missionItems = missionList ? missionList.querySelectorAll('.mission-item') : [];
    // Switching to the pinned layout and hiding the two panes both happen here,
    // never in the stylesheet. Anything that stops this block from running --
    // GSAP not arriving from the CDN, a reduced-motion preference, a narrow
    // window -- leaves the panel in normal flow with everything on screen,
    // instead of stranding it at opacity 0 with nothing left to reveal it.
    document.body.classList.add('hero-scrub');
    gsap.set(revealIntro, { opacity: 0 });
    if (missionItems.length) gsap.set(missionItems, { y: 26, opacity: 0 });

    // Last line of defence: if ScrollTrigger never actually registers, undo the
    // hiding rather than leave the panel blank.
    setTimeout(() => {
      if (!ScrollTrigger.getAll().length) {
        document.body.classList.remove('hero-scrub');
        gsap.set([revealIntro, ...missionItems].filter(Boolean), { clearProps: 'opacity,transform' });
      }
    }, 2500);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        // Tied to viewport height, not the hero's own content height : otherwise
        // making the dish bigger silently makes the pin last much longer and
        // scrolling feels "stuck" for a long stretch after the reveal finishes.
        end: () => '+=' + Math.round(window.innerHeight * 1.7),
        scrub: 0.6,
        pin: true,
        pinSpacing: true,
      },
    });
    // Every step gets an explicit duration. Without them GSAP applies its 0.5s
    // default, which made the intro's fade-in still running while its fade-out
    // and the mission list had already started : so all three were on screen
    // at once, overlapping.
    tl.to(dishStage, { scale: 1.12, x: '-22vw', duration: 0.3, ease: 'none' }, 0);
    if (revealIntro) {
      tl.to(revealIntro, { opacity: 1, duration: 0.14, ease: 'none' }, 0.12)   // in:  0.12 → 0.26
        .to(revealIntro, { opacity: 0, duration: 0.12, ease: 'none' }, 0.46);  // out: 0.46 → 0.58
    }
    if (missionItems.length) {
      // starts only after the intro is fully gone
      tl.to(missionItems, { opacity: 1, y: 0, duration: 0.13, stagger: 0.11, ease: 'none' }, 0.62);
    }
  }

  // Re-measure once web fonts (which shift layout height) have actually loaded,
  // otherwise the pin start/end points are calculated against the wrong text height
  // and the whole sequence visibly jumps/flashes the first time you scroll.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
