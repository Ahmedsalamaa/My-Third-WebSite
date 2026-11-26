/* ==========================================================
   Velvet Glitter Invitation — behaviour
   ========================================================== */
(function () {
  'use strict';
  const S = window.InviteStore;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const params = new URLSearchParams(location.search);
  const IS_PREVIEW = params.has('preview');
  const SKIP_INTRO = params.has('skipIntro');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let cfg = null;
  let opened = false;
  const audio = $('#music');

  /* ---------------- helpers ---------------- */
  const get = (path) => S.getPath(cfg, path);
  const hasArabic = (s) => /[֐-ࣿ]/.test(s || '');
  const rand = (a, b) => a + Math.random() * (b - a);
  function eventDate() {
    const d = new Date(get('event.datetime') || '');
    return isNaN(d) ? null : d;
  }
  function hexToRgb(hex) {
    const m = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex || '');
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [192, 18, 31];
  }

  /* Names: capital Latin letters get their own, clearly capital script font (see theme.nameCapitals). */
  const NAME_SEL = '.hero__name, .letter__sig, .until__names .script';
  function setName(el, str) {
    el.textContent = '';
    String(str).split(/([A-Z])/).forEach((part) => {
      if (!part) return;
      if (/^[A-Z]$/.test(part)) { const c = document.createElement('span'); c.className = 'cap'; c.textContent = part; el.append(c); }
      else el.append(document.createTextNode(part));
    });
  }
  const fillAll = (els) => els.forEach((el) => { if (el.matches(NAME_SEL)) setName(el, el.dataset.full || ''); else el.textContent = el.dataset.full || ''; });

  /* ---------------- apply config to the page ---------------- */
  function apply(config) {
    cfg = config;
    const root = document.documentElement;
    const t = cfg.theme || {};

    // language / direction / meta
    root.lang = get('meta.lang') || 'en';
    root.dir = get('meta.dir') || (hasArabic(get('hero.name1')) ? 'rtl' : 'ltr');
    document.title = get('meta.title') || 'Invitation';
    const md = $('meta[name="description"]'); if (md) md.content = get('meta.description') || '';
    const og = $('meta[property="og:image"]'); if (og && get('hero.stageImage') && !get('hero.stageImage').startsWith('blob:')) og.content = get('hero.stageImage');

    // theme
    const vars = { '--accent': t.accent, '--accent2': t.accent2, '--bg': t.background, '--bg2': t.background2, '--text': t.text, '--ink': t.ink, '--paper': t.paper, '--glitter': get('intro.glitterColor') };
    for (const k in vars) if (vars[k]) root.style.setProperty(k, vars[k]);
    root.style.setProperty('--script', `"${t.scriptFont}", "Cormorant Garamond", serif`);
    root.style.setProperty('--body', `"${t.bodyFont}", "Cormorant Garamond", serif`);
    root.style.setProperty('--ui', `"${t.uiFont}", "${t.bodyFont}", serif`);
    const sf = S.FONTS[t.scriptFont];
    root.style.setProperty('--script-style', sf && !sf.italic ? 'normal' : 'italic');
    root.style.setProperty('--script-scale', (sf && sf.scale) || 1);
    document.body.classList.toggle('names-pearl', (t.namesStyle || 'pearl') === 'pearl');
    document.body.classList.toggle('names-gold', t.namesStyle === 'gold');
    document.body.classList.toggle('show-caret', !!t.typingCursor);
    document.body.classList.toggle('no-seconds', !get('closing.showSeconds'));
    root.style.setProperty('--heart-tilt', (Number(get('event.heartTilt')) || 0) + 'deg');
    const furl = S.fontsUrl([t.scriptFont, t.bodyFont, t.uiFont, 'Albert Sans', t.nameCapitals]);
    root.style.setProperty('--caps-font', t.nameCapitals ? `"${t.nameCapitals}", var(--script)` : 'inherit');
    root.classList.toggle('has-name-caps', !!t.nameCapitals);
    if ($('#fontsLink').href !== furl) $('#fontsLink').href = furl;
    const tc = $('meta[name="theme-color"]'); if (tc) tc.content = t.background || '#1c0508';
    const g1 = $('#goldG .g1'), g2 = $('#goldG .g2');
    if (g1) g1.setAttribute('stop-color', t.accent || '#e9c58f');
    if (g2) g2.setAttribute('stop-color', t.accent2 || '#b8864b');

    // texts
    $$('[data-text]').forEach((el) => {
      if (el.classList.contains('is-writing')) return;   // a title is writing itself right now
      const v = get(el.dataset.text);
      if (el.matches(NAME_SEL)) setName(el, v == null ? '' : String(v));
      else el.textContent = v == null ? '' : String(v);
      el.classList.toggle('is-off', !v && !el.closest('.countdown'));
    });
    $$('[data-ph]').forEach((el) => { el.placeholder = get(el.dataset.ph) || ''; });
    $$('[data-type]').forEach((el) => {
      const v = get(el.dataset.type) || '';
      el.dataset.full = v;
      el.classList.toggle('is-off', !v);
      if (typeState === 'done') { if (el.matches(NAME_SEL)) setName(el, v); else el.textContent = v; }
    });
    // images
    $$('[data-src]').forEach((el) => {
      const v = get(el.dataset.src);
      if (v) { if (el.getAttribute('src') !== v) el.src = v; el.classList.remove('is-off'); }
      else { el.removeAttribute('src'); el.classList.add('is-off'); }
    });
    $$('[data-bg]').forEach((el) => {
      const v = get(el.dataset.bg);
      el.style.backgroundImage = v ? `url("${v}")` : 'none';
    });
    paintCurtains();

    // sections in the order chosen in the dashboard (the cover and the stage always come first)
    const ALL = ["letter", "event", "schedule", "venue", "dress", "wishes", "faq", "rsvp", "closing"];
    const order = (Array.isArray(get('order')) ? get('order') : []).filter((k) => ALL.includes(k));
    ALL.forEach((k) => { if (!order.includes(k)) order.push(k); });
    const main = $('#main'), foot = main.querySelector('.foot');
    order.forEach((k) => {
      const sec = main.querySelector(`:scope > [data-section="${k}"]`);
      if (sec) main.insertBefore(sec, foot);
    });

    // sections on/off
    $$('[data-section]').forEach((el) => {
      const on = get(el.dataset.section + '.enabled');
      el.classList.toggle('is-off', on === false);
    });

    // hero options
    $('#stageImg').style.objectPosition = get('hero.imagePosition') || '50% 70%';
    document.body.classList.toggle('no-curtains', get('hero.curtains') === false);
    root.style.setProperty('--hero-h', (Number(get('hero.height')) || 100) + 'svh');
    $('#beam').classList.toggle('on', !!get('hero.beam'));
    $('#ring').classList.toggle('on', !!get('hero.ring'));

    const tex = get('theme.paperTexture'), lace = get('theme.laceTrim'), bd = get('closing.backdrop');
    document.body.classList.toggle('has-paper-tex', !!tex);
    const abs = (u) => { try { return new URL(u, location.href).href; } catch (e) { return u; } };
    if (tex) root.style.setProperty('--paper-tex', `url("${abs(tex)}")`);
    document.body.classList.toggle('has-lace-img', !!lace);
    if (lace) root.style.setProperty('--lace-img', `url("${abs(lace)}")`);
    $('#until').classList.toggle('has-backdrop', !!bd);
    if (bd) $('#until').style.setProperty('--backdrop-url', `url("${abs(bd)}")`);
    $('#until').classList.toggle('has-curtain', !bd && get('closing.curtainBackdrop') !== false);
    const film = get('intro.video'), hf = $('#heroFilm');
    document.body.classList.toggle('has-film', !!film);
    if (film && hf.getAttribute('src') !== film) { hf.src = film; hf.load(); }
    if (!film && hf.getAttribute('src')) { hf.pause(); hf.removeAttribute('src'); }
    $('#env').classList.toggle('no-env', !get('letter.envelope'));
    updateLetter();

    // save the date: calendar pages
    buildFlip();
    tickCountdown();

    // the evening
    const tl = $('#timeline');
    tl.innerHTML = '';
    (get('schedule.items') || []).forEach((it) => {
      const li = el('li', '', el('time', '', it.time), el('div', 'tl__body', el('b', '', it.title), el('span', '', it.text)));
      tl.append(li); observe(li);
    });

    // where
    const maps = $('#mapsBtn');
    const mu = get('venue.mapsUrl');
    if (mu) { maps.href = mu; maps.classList.remove('is-off'); } else maps.classList.add('is-off');
    $('#arch').classList.toggle('is-off', !get('venue.image'));
    const mq = get('venue.mapQuery') || get('venue.address');
    const showMap = get('venue.showMap') !== false && mq;
    $('#mapBox').classList.toggle('is-off', !showMap);
    if (showMap) {
      const url = 'https://maps.google.com/maps?q=' + encodeURIComponent(mq) + '&z=15&output=embed';
      if ($('#mapFrame').getAttribute('src') !== url) $('#mapFrame').src = url;
    }

    // a few wishes
    const wl = $('#wishList');
    wl.innerHTML = '';
    (get('wishes.items') || []).forEach((it) => {
      const c = el('article', 'paper card reveal', el('b', '', it.title), el('p', '', it.text));
      wl.append(c); observe(c);
    });

    // questions
    const fl = $('#faqList');
    fl.innerHTML = '';
    (get('faq.items') || []).forEach((it) => {
      const d = el('details', 'reveal', el('summary', '', it.q), el('p', '', it.a));
      fl.append(d); observe(d);
    });

    // rsvp
    $('#guestsField').classList.toggle('is-off', !get('rsvp.askGuests'));

    // intro
    const canMic = get('intro.enableMic') && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.isSecureContext;
    $('#micBtn').hidden = !canMic || !!mic || get('intro.autoMic') !== false;
    setCoverText();

    // music
    const src = get('music.src');
    if (get('music.enabled') !== false && src) {
      if (audio.getAttribute('src') !== src) { audio.src = src; if (opened) playMusic(); }
    } else {
      audio.pause(); audio.removeAttribute('src');
    }
    audio.volume = Math.max(0, Math.min(1, Number(get('music.volume') ?? 0.6)));
    $('#musicBtn').hidden = !opened || !src || get('music.enabled') === false || get('music.showButton') === false;

    if (glitter) glitter.recolor();
  }

  /* ---------------- velvet curtain texture (drawn once) ---------------- */
  let curtainUrl = '', curtainColor = '';
  function paintCurtains() {
    const col = get('intro.curtainColor') || '#8a0a18';
    if (curtainUrl && curtainColor === col) return;
    curtainColor = col;
    const W = 360, H = 900;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    const img = ctx.createImageData(W, H), d = img.data;
    const [br, bg, bb] = hexToRgb(col);
    const ph = [Math.random() * 6, Math.random() * 6, Math.random() * 6, Math.random() * 6];
    for (let y = 0; y < H; y++) {
      const fy = y / H;
      const flare = 1 + fy * 0.35;                        // folds open up toward the floor
      const sway = Math.sin(fy * 5 + ph[3]) * 3 * fy;
      const vshade = 0.55 + 0.45 * Math.sin(Math.min(1, fy * 1.15) * Math.PI * 0.92); // darker top & hem
      for (let x = 0; x < W; x++) {
        const fx = (x + sway) / W / flare;
        let f = 0.62 * Math.sin(fx * Math.PI * 2 * 4.5 + ph[0]) + 0.24 * Math.sin(fx * Math.PI * 2 * 8.7 + ph[1]) + 0.14 * Math.sin(fx * Math.PI * 2 * 2 + ph[2]);
        f = (f + 1) / 2;
        const light = Math.pow(f, 2.1);
        const sheen = Math.pow(Math.max(0, f - 0.86) / 0.14, 2) * 0.32;
        const n = (Math.random() - 0.5) * 0.06;            // velvet grain
        const k = (0.12 + light * 0.78 + n) * vshade;
        const i = (y * W + x) * 4;
        d[i] = Math.min(255, br * k + 255 * sheen * 0.55);
        d[i + 1] = Math.min(255, bg * k + 120 * sheen * 0.35);
        d[i + 2] = Math.min(255, bb * k + 130 * sheen * 0.4);
        d[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    const g = ctx.createLinearGradient(W - 40, 0, W, 0);  // soft shadow on the inner edge
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = g; ctx.fillRect(W - 40, 0, 40, H);
    curtainUrl = c.toDataURL('image/jpeg', 0.9);
    $$('.curtain__tex').forEach((el) => { el.style.backgroundImage = `url("${curtainUrl}")`; });
    $('#until').style.setProperty('--curtain-url', `url("${curtainUrl}")`);
  }

  /* ---------------- typewriter for the names ---------------- */
  let typeState = 'idle';
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function typeHero(instant) {
    const els = $$('#hero [data-type]');
    if (instant || reduceMotion) {
      fillAll(els);
      typeState = 'done';
      document.body.classList.add('is-typed');
      return;
    }
    typeState = 'typing';
    const caret = document.createElement('span');
    caret.className = 'caret';
    // like the original: the small lines fade in, only the names are written letter by letter
    els.forEach((el) => {
      if (el.classList.contains('hero__name')) el.textContent = '';
      else {
        el.style.transition = 'none';             // start hidden, no fade-out flash
        el.classList.add('fade-wait');
        el.textContent = el.dataset.full || '';
        void el.offsetWidth;
        el.style.transition = '';
      }
    });
    const show = (sel) => $$(sel).forEach((e) => e.classList.add('fade-in'));
    show('#hero .hero__eyebrow');
    await sleep(700);
    const names = els.filter((e) => e.classList.contains('hero__name'));
    for (let n = 0; n < names.length; n++) {
      const el = names[n], full = el.dataset.full || '';
      const inner = document.createElement('span');
      el.append(inner, caret);
      const chars = Array.from(full);
      for (let i = 1; i <= chars.length; i++) { setName(inner, chars.slice(0, i).join('')); await sleep(95); }
      if (n === 0) { show('#hero .hero__amp'); await sleep(350); }
    }
    caret.remove();
    await sleep(250);
    show('#hero .hero__invite');
    await sleep(250);
    show('#hero .hero__date');
    await sleep(250);
    show('#hero .hero__place');
    await sleep(900);
    typeState = 'done';
    fillAll(els);
    const last = els.filter((e) => e.dataset.full).pop();
    if (last) { last.append(caret); setTimeout(() => caret.remove(), 2200); }
    document.body.classList.add('is-typed');
    document.body.classList.remove('is-locked');
  }

  function el(tag, cls, ...kids) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    kids.forEach((k) => n.append(k && k.nodeType ? k : document.createTextNode(k == null ? '' : String(k))));
    return n;
  }

  let micState = 'off'; // off | asking | listening
  function setCoverText() {
    const blow = micState !== 'off';
    $('#coverAction').textContent = get(blow ? 'intro.action' : 'intro.touchAction') || get('intro.action') || '';
    $('#coverAlt').textContent = micState === 'listening'
      ? (get('intro.breathHint') || get('intro.actionAlt') || '')
      : (get(blow ? 'intro.actionAlt' : 'intro.touchActionAlt') || '');
    $('#meter').hidden = micState !== 'listening';
  }

  /* ---------------- letter rises out of the envelope while scrolling ---------------- */
  function updateLetter() {
    const sec = $('#letter'), card = $('#letterCard');
    if (!sec || sec.classList.contains('is-off')) return;
    if (!get('letter.envelope')) { card.style.transform = ''; return; }
    const r = sec.getBoundingClientRect();
    const span = sec.offsetHeight - innerHeight;
    const p = Math.max(0, Math.min(1, (innerHeight * 0.5 - r.top) / Math.max(1, span + innerHeight * 0.5)));
    const e = 1 - Math.pow(1 - p, 2);
    const h = card.offsetHeight;
    // start mostly inside the pocket, end lifted out above it
    card.style.transform = `translateY(${(0.38 - e * 0.44) * h}px)`;
  }
  addEventListener('scroll', () => requestAnimationFrame(updateLetter), { passive: true });
  addEventListener('resize', updateLetter);

  /* ---------------- lace edges + embossed oval on paper sections ---------------- */
  function decoratePaper() {
    $$('.paper-sec').forEach((sec) => {
      if (sec.querySelector('.lace')) return;
      sec.prepend(el('div', 'lace lace--top'));
      sec.append(el('div', 'lace lace--bottom'));
      sec.insertAdjacentHTML('afterbegin',
        '<svg class="emboss" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
        '<defs><filter id="emb' + Math.random().toString(36).slice(2, 6) + '"></filter></defs>' +
        '<ellipse cx="200" cy="350" rx="176" ry="318" fill="none" stroke="#fffdf8" stroke-width="3" transform="translate(-1.2 -1.2)"/>' +
        '<ellipse cx="200" cy="350" rx="176" ry="318" fill="none" stroke="#cbbcaa" stroke-width="3" transform="translate(1.2 1.2)" opacity="1"/>' +
        '<ellipse cx="200" cy="350" rx="176" ry="318" fill="none" stroke="#efe6da" stroke-width="3"/>' +
        '<ellipse cx="200" cy="350" rx="164" ry="305" fill="none" stroke="#fffdf8" stroke-width="6" stroke-linecap="round" stroke-dasharray="0 11" transform="translate(-1 -1)"/>' +
        '<ellipse cx="200" cy="350" rx="164" ry="305" fill="none" stroke="#d6c9ba" stroke-width="6" stroke-linecap="round" stroke-dasharray="0 11" transform="translate(1 1)" opacity=".75"/>' +
        '<ellipse cx="200" cy="350" rx="164" ry="305" fill="none" stroke="#f1e9de" stroke-width="5" stroke-linecap="round" stroke-dasharray="0 11"/>' +
        '<ellipse cx="200" cy="350" rx="152" ry="292" fill="none" stroke="#fffdf8" stroke-width="1.6" transform="translate(-1 -1)"/>' +
        '<ellipse cx="200" cy="350" rx="152" ry="292" fill="none" stroke="#dcd0c2" stroke-width="1.6" transform="translate(1 1)" opacity=".7"/>' +
        '</svg>');
    });
  }

  /* ---------------- Save the date: pages that turn while scrolling ---------------- */
  let flipPages = [];
  function buildFlip() {
    const box = $('#pages');
    box.innerHTML = '';
    flipPages = [];
    const d = eventDate();
    if (!d) return;
    const lang = get('meta.lang') || 'en';
    const n = Math.max(1, Math.min(12, Number(get('event.monthsToFlip')) || 5));
    const monStart = get('event.weekStartsMonday') !== false;
    const ar = lang.startsWith('ar');
    let nf; try { nf = new Intl.NumberFormat(lang); } catch (e) { nf = { format: String }; }
    const fmt = (o, dt) => { try { return new Intl.DateTimeFormat(lang, o).format(dt); } catch (e) { return ''; } };
    for (let k = 0; k < n; k++) {
      const md = new Date(d.getFullYear(), d.getMonth() - (n - 1 - k), 1);
      const y = md.getFullYear(), m = md.getMonth();
      const grid = el('div', 'page__grid');
      for (let i = 0; i < 7; i++) {
        const wd = fmt({ weekday: ar ? 'narrow' : 'short' }, new Date(2024, 0, (monStart ? 1 : 7) + i));
        grid.append(el('div', 'wd', ar ? wd : wd.slice(0, 1).toUpperCase()));
      }
      const first = new Date(y, m, 1).getDay();
      const offset = monStart ? (first + 6) % 7 : first;
      const days = new Date(y, m + 1, 0).getDate();
      for (let i = 0; i < offset; i++) grid.append(el('div', ''));
      for (let i = 1; i <= days; i++) {
        const dow = new Date(y, m, i).getDay();
        const c = el('div', 'd' + (dow === 0 || dow === 6 ? ' we' : ''));
        const num = el('span', 'num', nf.format(i));
        c.append(num);
        if (k === n - 1 && i === d.getDate()) {
          // the heart is attached to the number itself, so it always sits around it
          num.insertAdjacentHTML('afterbegin', '<svg class="page__ring" viewBox="0 0 36 34" aria-hidden="true"><path pathLength="100" d="M18 31.5C11 26.5 2.5 20.5 2.5 11.8 2.5 6.4 6.5 2.5 11.2 2.5c3 0 5.4 1.6 6.8 4.2 1.4-2.6 3.8-4.2 6.8-4.2 4.7 0 8.7 3.9 8.7 9.3 0 8.7-8.5 14.7-15.5 19.7Z"/></svg>');
          num.classList.add('is-day');
        }
        grid.append(c);
      }
      const page = el('div', 'page',
        el('div', 'page__front paper',
          el('p', 'page__month', fmt({ month: 'long' }, md)),
          el('p', 'page__year', nf.format(y).replace(/[,.\s]/g, '')),
          grid),
        el('div', 'page__back'));
      page.style.zIndex = String(n - k);
      box.append(page);
      flipPages.push(page);
    }
    showFlip(flipTop);
  }

  /* The calendar turns by itself once it is on screen: one page about every second
   * until the wedding month, then the heart is drawn around the day. */
  let flipTop = 0, flipStarted = false, flipTimer = null;
  function showFlip(top) {
    const n = flipPages.length;
    if (!n) return;
    flipTop = Math.min(top, n - 1);
    flipPages.forEach((pg, k) => {
      pg.classList.toggle('is-turned', k < flipTop);
      if (k > flipTop) pg.classList.add('is-under');
      else if (k === flipTop && pg.classList.contains('is-under')) requestAnimationFrame(() => pg.classList.remove('is-under'));
    });
    if (flipTop === n - 1 && flipStarted) setTimeout(() => $('#flip').classList.add('is-done'), 450);
  }
  function runFlip() {
    if (flipStarted) return;
    flipStarted = true;
    const next = () => {
      if (flipTop >= flipPages.length - 1) { showFlip(flipTop); return; }
      showFlip(flipTop + 1);
      flipTimer = setTimeout(next, 950);
    };
    flipTimer = setTimeout(next, 700);
  }
  function watchFlip() {
    const sec = $('#flip');
    if (reduceMotion || !('IntersectionObserver' in window)) { flipStarted = true; showFlip(99); return; }
    const fio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { runFlip(); fio.disconnect(); } });
    }, { threshold: 0.55 });
    fio.observe(sec.querySelector('.pad'));
  }

  /* ---------------- countdown ---------------- */
  function tickCountdown() {
    const d = eventDate();
    let diff = d ? Math.max(0, d - Date.now()) : 0;
    const days = Math.floor(diff / 864e5); diff -= days * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const mi = Math.floor(diff / 6e4); diff -= mi * 6e4;
    const s = Math.floor(diff / 1e3);
    let nf; try { nf = new Intl.NumberFormat((cfg && get('meta.lang')) || 'en'); } catch (e) { nf = { format: String }; }
    $('#cdD').textContent = nf.format(days);
    $('#cdH').textContent = nf.format(h);
    $('#cdM').textContent = nf.format(mi);
    $('#cdS').textContent = nf.format(s);
  }
  setInterval(() => cfg && tickCountdown(), 1000);

  function downloadIcs() {
    const d = eventDate();
    if (!d) return;
    const end = new Date(d.getTime() + (Number(get('event.durationHours')) || 4) * 36e5);
    const f = (x) => x.getFullYear() + String(x.getMonth() + 1).padStart(2, '0') + String(x.getDate()).padStart(2, '0') + 'T' + String(x.getHours()).padStart(2, '0') + String(x.getMinutes()).padStart(2, '0') + '00';
    const esc = (s) => String(s || '').replace(/[\\;,]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
    const names = [get('hero.name1'), get('hero.name2')].filter(Boolean).join(' & ');
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Invitation//EN', 'BEGIN:VEVENT',
      'UID:' + Date.now() + '@invitation', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
      'DTSTART:' + f(d), 'DTEND:' + f(end),
      'SUMMARY:' + esc(get('meta.title') || names),
      'LOCATION:' + esc([get('venue.name'), get('venue.address')].filter(Boolean).join(', ')),
      'DESCRIPTION:' + esc(location.href.split('?')[0]),
      'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(names), 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = (names || 'invitation').replace(/[^\w؀-ۿ]+/g, '-') + '.ics';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  /* ---------------- music ---------------- */
  let fadeTimer = null;
  function playMusic() {
    if (!audio.getAttribute('src') || get('music.enabled') === false) return;
    const target = Math.max(0, Math.min(1, Number(get('music.volume') ?? 0.6)));
    if (audio.paused && audio.currentTime < 0.05) audio.currentTime = Number(get('music.startAt')) || 0;
    audio.volume = 0;
    const p = audio.play();
    if (p && p.catch) p.catch(() => {
      setMusicUi();
      const retry = () => { if (!userPaused) playMusic(); };
      ['pointerdown', 'touchstart', 'keydown'].forEach((ev) => addEventListener(ev, retry, { once: true, passive: true }));
    });
    clearInterval(fadeTimer);
    fadeTimer = setInterval(() => {
      audio.volume = Math.min(target, audio.volume + target / 30);
      if (audio.volume >= target) clearInterval(fadeTimer);
    }, 70);
    setMusicUi();
  }
  function setMusicUi() {
    const b = $('#musicBtn');
    b.classList.toggle('is-paused', audio.paused);
    b.setAttribute('aria-label', audio.paused ? 'Play music' : 'Pause music');
  }
  let userPaused = false;
  $('#musicBtn').addEventListener('click', () => {
    if (audio.paused) { userPaused = false; playMusic(); } else { userPaused = true; audio.pause(); }
    setMusicUi();
  });
  audio.addEventListener('play', setMusicUi);
  audio.addEventListener('pause', setMusicUi);
  document.addEventListener('visibilitychange', () => {
    if (!opened) return;
    if (document.hidden) audio.pause();
    else if (!userPaused) playMusic();
  });
  // iOS only allows sound after a gesture: unlock it on the first touch.
  function unlockAudio() {
    if (!audio.getAttribute('src')) return;
    audio.muted = true;
    const p = audio.play();
    const done = () => { audio.pause(); audio.muted = false; };
    if (p && p.then) p.then(done).catch(() => { audio.muted = false; }); else done();
  }

  /* ---------------- glitter cover ---------------- */
  let glitter = null;
  function Glitter(canvas) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, parts = [], falling = false, fallStart = 0, raf = 0, palette = [];
    function makePalette() {
      const [r, g, b] = hexToRgb(get('intro.glitterColor'));
      const mix = (k, t) => [r + (k[0] - r) * t, g + (k[1] - g) * t, b + (k[2] - b) * t].map((x) => Math.round(Math.max(0, Math.min(255, x))));
      palette = [
        mix([255, 255, 255], .2), mix([255, 255, 255], .45), mix([255, 220, 220], .75),
        mix([0, 0, 0], .35), mix([0, 0, 0], .1), [r, g, b], [255, 250, 245]
      ].map((c) => `rgb(${c[0]},${c[1]},${c[2]})`);
    }
    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * DPR); canvas.height = Math.round(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const n = Math.min(7000, Math.round((w * h) / 62));
      parts = [];
      for (let i = 0; i < n; i++) {
        const big = Math.random() < 0.07;
        const yy = h * (1 - Math.pow(Math.random(), 0.75));   // denser toward the bottom
        parts.push({
          bokeh: Math.random() < 0.035,
          x: Math.random() * w, y: yy,
          r: big ? rand(1.4, 2.6) : rand(0.5, 1.5),
          c: big ? (Math.random() < .5 ? 6 : 2) : Math.floor(Math.random() * 6),
          a: rand(.45, 1), ph: Math.random() * 6.28, sp: rand(1.2, 4.5),
          vx: 0, vy: 0, delay: 0, spin: rand(-1, 1)
        });
      }
    }
    function frame(now) {
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      const ft = falling ? (now - fallStart) / 1000 : 0;
      for (const p of parts) {
        let x = p.x, y = p.y, a;
        if (falling) {
          const lt = ft - p.delay;
          if (lt > 0) {
            x = p.x + p.vx * lt + Math.sin(lt * 6 + p.ph) * 4 * p.spin;
            y = p.y + 0.5 * p.vy * lt * lt;
            if (y > h + 10) continue;
          }
          a = p.a * (0.6 + 0.4 * Math.sin(t * p.sp * 2 + p.ph));
        } else {
          a = p.a * (0.35 + 0.65 * Math.max(0, Math.sin(t * p.sp + p.ph)));
        }
        alive++;
        ctx.globalAlpha = a;
        ctx.fillStyle = palette[p.c];
        const lt2 = falling ? ft - p.delay : 0;
        if (lt2 > 0) {                                    // motion streak while falling
          const len = Math.min(46, p.vy * lt2 * 0.018) + p.r;
          ctx.fillRect(x, y - len, Math.max(.6, p.r * .7), len);
          continue;
        }
        if (p.bokeh) {                                     // soft round sparkle
          ctx.fillStyle = 'rgba(255,245,240,.85)';
          ctx.beginPath(); ctx.arc(x, y, p.r * 1.25, 0, 6.283); ctx.fill();
          ctx.globalAlpha = a * .25;
          ctx.beginPath(); ctx.arc(x, y, p.r * 2.6, 0, 6.283); ctx.fill();
          continue;
        }
        ctx.fillRect(x, y, p.r, p.r);
        if (p.r > 1.6 && a > .85) { // tiny star glint
          ctx.globalAlpha = (a - .85) * 4;
          ctx.fillRect(x - p.r * 1.6, y + p.r / 2 - .3, p.r * 4.2, .6);
          ctx.fillRect(x + p.r / 2 - .3, y - p.r * 1.6, .6, p.r * 4.2);
        }
      }
      ctx.globalAlpha = 1;
      if (falling && alive === 0) { stop(); return; }
      raf = requestAnimationFrame(frame);
    }
    function start() { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
    function stop() { cancelAnimationFrame(raf); ctx.clearRect(0, 0, w, h); }
    function fall() {
      falling = true; fallStart = performance.now();
      for (const p of parts) {
        p.delay = Math.random() * 0.9 + (p.y / h) * 0.15;
        p.vy = rand(700, 2200);
        p.vx = rand(-30, 30);
      }
    }
    makePalette(); resize(); start();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (!falling) resize(); }, 150); });
    return { fall, stop, recolor: makePalette };
  }

  /* ---------------- blow detection ---------------- */
  let mic = null;
  /* Listening for a blow.
   * iPhone only lets a page hear the microphone after one touch, so if the audio
   * engine stays paused we show a small "Tap here, then blow" button.
   * The detector first learns how quiet the room is, then reacts to a breath:
   * either the sound level clearly above the room, or the spectrum rising above it. */
  let ac = null, micStream = null, analyser = null, listening = false;
  async function startMic(e) {
    if (e) { e.stopPropagation(); unlockAudio(); }
    const btn = $('#micBtn');
    if (listening || opened) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { micFailed(); return; }
    if (!ac) { try { ac = new AC(); } catch (err) { micFailed(); return; } }
    if (ac.state !== 'running') ac.resume().catch(() => {});
    if (!micStream) {
      micState = 'asking'; setCoverText();
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
      } catch (err) { micFailed(); return; }
      if (opened) { micStream.getTracks().forEach((t) => t.stop()); return; }
      const src = ac.createMediaStreamSource(micStream);
      analyser = ac.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.3;
      src.connect(analyser);
      mic = { stream: micStream, ac };
    }
    if (ac.state === 'running') { beginListening(); return; }
    ac.resume().then(() => { if (ac && ac.state === 'running') beginListening(); }).catch(() => {});
    // still paused (iPhone): ask for one tap on the button
    setTimeout(() => {
      if (listening || opened) return;
      btn.querySelector('span').textContent = get('intro.micTapLabel') || 'Tap here, then blow';
      btn.hidden = false;
      micState = 'asking'; setCoverText();
    }, 700);
  }

  function micFailed() {
    $('#micBtn').hidden = true;
    micState = 'off';
    setCoverText();
  }

  function beginListening() {
    if (listening || opened || !analyser) return;
    listening = true;
    const btn = $('#micBtn');
    btn.hidden = true;
    micState = 'listening';
    setCoverText();
    const fill = $('#meterFill');
    const time = new Uint8Array(analyser.fftSize);
    const freq = new Float32Array(analyser.frequencyBinCount);
    const base = new Float32Array(freq.length);
    const top = Math.min(freq.length, Math.round(4500 / (ac.sampleRate / 2) * freq.length)); // up to 4.5 kHz
    const quiet = [];
    let samples = 0, floor = 0, meter = 0, last = performance.now();
    const warmUntil = performance.now() + 500;   // microphones need a moment to wake up
    const db = (v) => Math.max(-140, isFinite(v) ? v : -140);

    const loop = (now) => {
      if (!listening || opened) return;
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      analyser.getByteTimeDomainData(time);
      let sq = 0;
      for (let i = 0; i < time.length; i++) { const v = (time[i] - 128) / 128; sq += v * v; }
      const rms = Math.sqrt(sq / time.length);
      analyser.getFloatFrequencyData(freq);

      if (now < warmUntil) { requestAnimationFrame(loop); return; }
      if (samples < 20) {                       // learn the room for a moment
        for (let k = 1; k < top; k++) base[k] = (base[k] * samples + db(freq[k])) / (samples + 1);
        quiet.push(rms);
        floor = quiet.slice().sort((x, y) => x - y)[quiet.length >> 1];
        samples++;
        requestAnimationFrame(loop);
        return;
      }
      let rise = 0;
      for (let k = 1; k < top; k++) rise += Math.max(0, db(freq[k]) - base[k]);
      rise /= Math.max(1, top - 1);
      const blowing = rise > 7 || rms > Math.max(0.012, floor * 2.2);
      if (rise < 3) for (let k = 1; k < top; k++) base[k] = base[k] * 0.97 + db(freq[k]) * 0.03; // room slowly re-learned
      meter = Math.max(0, Math.min(1, meter + (blowing ? dt / 0.15 : -dt * 0.8)));
      fill.style.width = (meter * 100) + '%';
      if (meter >= 1) { open(); return; }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  function stopMic() {
    listening = false;
    try { if (micStream) micStream.getTracks().forEach((t) => t.stop()); } catch (e) { /* ignore */ }
    try { if (ac) ac.close(); } catch (e) { /* ignore */ }
    micStream = null; ac = null; analyser = null; mic = null;
  }

  /* ---------------- opening sequence ---------------- */
  function open() {
    if (opened) return;
    opened = true;
    stopMic();
    playMusic();
    $('#musicBtn').hidden = !audio.getAttribute('src') || get('music.showButton') === false;
    const cover = $('#cover');
    const video = get('intro.video');

    if (video) {
      // The film starts on the same glitter frame as the cover, so the cover can simply fade away
      const v = $('#heroFilm'), body = document.body;
      body.classList.add('film-playing');
      cover.classList.add('is-fast');
      setTimeout(() => cover.classList.add('is-gone'), 400);
      body.classList.add('is-open', 'is-revealed');
      startDust();
      const fail = () => { body.classList.remove('film-playing'); revealHero(true); };
      v.currentTime = 0;
      const p = v.play(); if (p && p.catch) p.catch(fail);
      v.addEventListener('error', fail, { once: true });
      setTimeout(() => typeHero(false), (Number(get('intro.namesAt')) || 3) * 1000);
      setTimeout(() => body.classList.remove('is-locked'), 9000);
      return;
    }

    cover.classList.add('is-opening');
    if (glitter) glitter.fall();
    if (reduceMotion) { cover.classList.add('is-gone'); revealHero(true); return; }
    setTimeout(() => revealHero(false), 1900);
    setTimeout(() => { cover.classList.add('is-gone'); if (glitter) glitter.stop(); }, 3200);
  }

  function revealHero(instant) {
    const body = document.body;
    if (instant) {
      $$('.curtain, .hero__img').forEach((el) => { el.style.transition = 'none'; });
      body.classList.add('is-open');
      requestAnimationFrame(() => requestAnimationFrame(() => $$('.curtain, .hero__img').forEach((el) => { el.style.transition = ''; })));
    } else {
      body.classList.add('is-open');
    }
    body.classList.add('is-revealed');
    if (instant) { typeHero(true); body.classList.remove('is-locked'); }
    else {
      setTimeout(() => typeHero(false), 2300);
      setTimeout(() => body.classList.remove('is-locked'), 9000); // safety unlock
    }
    startDust();
  }

  /* ---------------- floating dust in the spotlight ---------------- */
  let dustStarted = false;
  function startDust() {
    if (dustStarted || reduceMotion) return;
    dustStarted = true;
    const c = $('#dust'), ctx = c.getContext('2d');
    let w, h, ps = [], visible = true;
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * DPR; c.height = h * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ps = Array.from({ length: Math.round(w * h / 5200) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: rand(.4, 1.6), v: rand(4, 16), ph: Math.random() * 6.3, a: rand(.2, .9) }));
    };
    resize(); addEventListener('resize', resize);
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(c);
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (visible && get('hero.dust') !== false) {
        ctx.clearRect(0, 0, w, h);
        for (const p of ps) {
          p.y -= p.v * dt; p.x += Math.sin(now / 1400 + p.ph) * 6 * dt;
          if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
          const fade = Math.min(1, p.y / (h * .25));
          ctx.globalAlpha = p.a * fade * (.6 + .4 * Math.sin(now / 500 + p.ph));
          ctx.fillStyle = '#ffd9cf';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
        }
      } else if (get('hero.dust') === false) ctx.clearRect(0, 0, w, h);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* ---------------- twinkling stars behind the content ---------------- */
  function startStars() {
    const c = $('#stars'), ctx = c.getContext('2d');
    let w, h, stars = [];
    const resize = () => {
      w = c.clientWidth; h = c.clientHeight;
      c.width = w * DPR; c.height = h * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      stars = Array.from({ length: Math.round(w * h / 4200) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() < .08 ? rand(1.4, 2.2) : rand(.4, 1.1), ph: Math.random() * 6.3, sp: rand(.6, 2.2), gold: Math.random() < .5 }));
    };
    resize(); addEventListener('resize', resize);
    const loop = (now) => {
      if (document.body.classList.contains('is-revealed')) {
        ctx.clearRect(0, 0, w, h);
        const t = now / 1000;
        for (const s of stars) {
          const a = Math.max(0, Math.sin(t * s.sp + s.ph));
          ctx.globalAlpha = a * (s.r > 1.3 ? .95 : .6);
          ctx.fillStyle = s.gold ? '#f3d6a3' : '#ffd0d0';
          if (s.r > 1.3) {
            const l = s.r * 3 * a;
            ctx.fillRect(s.x - l, s.y - .4, l * 2, .8);
            ctx.fillRect(s.x - .4, s.y - l, .8, l * 2);
          }
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r * .7, 0, 6.283); ctx.fill();
        }
      }
      requestAnimationFrame(loop);
    };
    if (!reduceMotion) requestAnimationFrame(loop);
  }

  /* ---------------- scroll reveal ---------------- */
  let io = null;
  function observe(node) {
    if (!io) { node.classList.add('in'); return; }
    io.observe(node);
  }
  /* Section titles write themselves letter by letter when they come into view (like the original),
   * then the line under them fades in. */
  function writeTitle(el) {
    if (el.dataset.written) return;
    el.dataset.written = '1';
    const full = el.textContent;
    const chars = Array.from(full);
    el.textContent = '';
    el.classList.add('is-writing');
    let i = 0;
    const step = () => {
      i++;
      el.textContent = chars.slice(0, i).join('');
      if (i < chars.length) setTimeout(step, 75);
      else { el.classList.remove('is-writing'); el.classList.add('is-written'); }
    };
    setTimeout(step, 150);
  }
  function startTitles() {
    const titles = $$('.title');
    if (!('IntersectionObserver' in window) || reduceMotion) { titles.forEach((t) => t.classList.add('is-written')); return; }
    titles.forEach((t) => t.classList.add('to-write'));
    const tio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { writeTitle(en.target); tio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    titles.forEach((t) => tio.observe(t));
  }

  function watchCue() {
    const upd = () => document.body.classList.toggle('cue-off', scrollY > innerHeight * 0.25 || document.body.classList.contains('is-locked'));
    addEventListener('scroll', upd, { passive: true });
    new MutationObserver(upd).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    upd();
  }

  function startReveal() {
    startTitles();
    watchFlip();
    watchCue();
    if (!('IntersectionObserver' in window) || reduceMotion) { $$('.reveal, .timeline li').forEach((e) => e.classList.add('in')); return; }
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal, .timeline li').forEach((e) => io.observe(e));
  }

  /* ---------------- RSVP ---------------- */
  function setupRsvp() {
    const form = $('#rsvpForm');
    const status = $('#rsvpStatus');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = (fd.get('name') || '').trim();
      const answer = fd.get('answer');
      if (!name || !answer) { status.textContent = get('rsvp.missing') || 'Please fill in your name and answer.'; return; }
      const data = {
        name,
        answer: answer === 'accept' ? get('rsvp.accept') : get('rsvp.decline'),
        attending: answer === 'accept',
        guests: get('rsvp.askGuests') ? (fd.get('guests') || '') : '',
        message: (fd.get('message') || '').trim(),
        event: get('meta.title'),
        sentAt: new Date().toISOString()
      };
      const lines = [
        `💌 ${get('rsvp.title') || 'RSVP'} — ${get('meta.title') || ''}`,
        `${get('rsvp.namePlaceholder') || 'Name'}: ${data.name}`,
        `✔ ${data.answer}`,
        data.guests ? `${get('rsvp.guestsPlaceholder') || 'Guests'}: ${data.guests}` : '',
        data.message ? `\n${data.message}` : ''
      ].filter(Boolean).join('\n');
      const method = get('rsvp.method') || 'whatsapp';
      const btn = form.querySelector('button[type="submit"]');
      try {
        if (method === 'whatsapp') {
          const num = String(get('rsvp.whatsapp') || '').replace(/[^\d]/g, '');
          window.open(`https://wa.me/${num}?text=${encodeURIComponent(lines)}`, '_blank');
        } else if (method === 'email') {
          location.href = `mailto:${encodeURIComponent(get('rsvp.email') || '')}?subject=${encodeURIComponent((get('rsvp.title') || 'RSVP') + ' — ' + data.name)}&body=${encodeURIComponent(lines)}`;
        } else if (method === 'endpoint') {
          const url = get('rsvp.endpoint');
          if (!url) throw new Error('No endpoint');
          btn.disabled = true;
          if (/script\.google\.com/.test(url)) {
            await fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data) });
          } else {
            const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
            if (!r.ok) throw new Error('HTTP ' + r.status);
          }
        }
        status.textContent = get('rsvp.thanks') || 'Thank you!';
        form.reset();
      } catch (err) {
        status.textContent = '⚠ ' + (err.message || 'Could not send');
      } finally {
        btn.disabled = false;
      }
    });
  }

  /* ---------------- boot ---------------- */
  async function boot() {
    let config = S.clone(window.INVITE_CONFIG || {});
    if (IS_PREVIEW) {
      try { config = await S.resolveMedia(await S.loadDraft()); } catch (e) { /* fall back to published */ }
    }
    startReveal();
    decoratePaper();
    apply(config);

    $('#addCal').addEventListener('click', downloadIcs);
    setupRsvp();
    startStars();

    const cover = $('#cover');
    const introOn = get('intro.enabled') !== false && !SKIP_INTRO;
    if (!introOn) {
      cover.classList.add('is-gone');
      opened = true;
      revealHero(true);
      $('#musicBtn').hidden = !audio.getAttribute('src') || get('music.showButton') === false || get('music.enabled') === false;
      setMusicUi();
      // browsers need one tap before sound can play
      const first = () => { if (!userPaused) playMusic(); };
      ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => addEventListener(ev, first, { once: true, passive: true }));
    } else {
      glitter = Glitter($('#glitter'));
      cover.addEventListener('click', open);
      cover.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      $('#micBtn').addEventListener('click', startMic);
      // start listening for a blow as soon as the page opens
      if (get('intro.enableMic') && get('intro.autoMic') !== false && !IS_PREVIEW && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.isSecureContext) {
        $('#micBtn').hidden = true;
        startMic();
      }
      setTimeout(() => cover.focus({ preventScroll: true }), 50);
    }

    // live updates from the dashboard
    addEventListener('message', (e) => {
      if (e.origin !== location.origin || !e.data || e.data.type !== 'invite:config') return;
      apply(e.data.config);
    });
    if (IS_PREVIEW && window.parent !== window) window.parent.postMessage({ type: 'invite:ready' }, location.origin);
  }

  boot();
})();
