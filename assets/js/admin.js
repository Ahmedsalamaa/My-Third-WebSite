/* ==========================================================
   Invitation Dashboard
   Every editable thing on the invitation is listed in SCHEMA.
   Add a field here + a data-text / data-src in index.html to make it editable.
   ========================================================== */
(function () {
  'use strict';
  const S = window.InviteStore;
  const $ = (sel, root = document) => root.querySelector(sel);
  const el = (tag, attrs = {}, ...kids) => {
    const n = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] === true) n.setAttribute(k, '');
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    kids.flat().forEach((c) => c != null && n.append(c.nodeType ? c : document.createTextNode(c)));
    return n;
  };

  const FONT_NAMES = Object.keys(S.FONTS);
  const LANGS = [['en', 'English'], ['ar', 'العربية (Arabic)'], ['fr', 'Français'], ['es', 'Español'], ['de', 'Deutsch'], ['it', 'Italiano'], ['tr', 'Türkçe'], ['ru', 'Русский']];

  const SCHEMA = [
    { id: 'couple', icon: '💍', title: 'Couple & stage', desc: 'The first screen after the curtains open: names, date line and the photo on stage.', fields: [
      { path: 'hero.stageImage', label: 'Stage photo', type: 'image', wide: true, help: 'Tall portrait photo of the couple works best (9:16). It appears behind the curtains.' },
      { path: 'hero.imagePosition', label: 'Photo focus point', type: 'focus', help: 'Move the focus so faces stay visible on every phone.' },
      { path: 'hero.height', label: 'Stage height', type: 'number', min: 100, step: 10, help: '100 = whole photo on one screen (original). 150 = zoomed in, the couple appears while scrolling.' },
      { path: 'hero.eyebrow', label: 'Line above names', type: 'text' },
      { path: 'hero.name1', label: 'First name', type: 'text' },
      { path: 'hero.name2', label: 'Second name', type: 'text' },
      { path: 'hero.ampersand', label: 'Between names', type: 'text', help: '“&”, “and”, “و” …' },
      { path: 'hero.invite', label: 'Line under names', type: 'text', help: 'e.g. “invite you to celebrate their wedding”' },
      { path: 'hero.dateLine', label: 'Date line', type: 'text', help: 'e.g. 30 12 2026' },
      { path: 'hero.place', label: 'Venue line', type: 'text' },
      { path: 'hero.scrollHint', label: 'Scroll hint', type: 'text' },
      { path: 'hero.curtains', label: 'Velvet curtains', type: 'toggle' },
      { path: 'hero.dust', label: 'Floating sparkles', type: 'toggle' },
      { path: 'hero.beam', label: 'Add spotlight beam', type: 'toggle', help: 'Turn on when your own photo has no light beam.' },
      { path: 'hero.ring', label: 'Add glowing stage ring', type: 'toggle' }
    ] },
    { id: 'opening', icon: '✨', title: 'Opening (glitter)', desc: 'The glitter wall guests see first. Tapping (or blowing into the microphone) makes the glitter fall and the curtains open.', fields: [
      { path: 'intro.enabled', label: 'Show the glitter opening', type: 'toggle', wide: true },
      { path: 'intro.hint', label: 'Top text', type: 'text' },
      { path: 'intro.monogram', label: 'Monogram (middle)', type: 'text' },
      { path: 'intro.action', label: 'Big call to action', type: 'text' },
      { path: 'intro.actionAlt', label: 'Small text under it', type: 'text' },
      { path: 'intro.breathHint', label: 'Text while listening', type: 'text', help: 'Shown once the microphone is on, above the little breath meter.' },
      { path: 'intro.touchAction', label: 'Call to action without microphone', type: 'text', help: 'Shown when the microphone is off or not allowed, e.g. “Touch the glitter”.' },
      { path: 'intro.touchActionAlt', label: 'Small text (without microphone)', type: 'text' },
      { path: 'intro.glitterImage', label: 'Glitter background', type: 'image', help: 'Leave the default for red glitter, or upload any texture.' },
      { path: 'intro.glitterColor', label: 'Glitter color', type: 'color' },
      { path: 'intro.curtainColor', label: 'Curtain color', type: 'color' },
      { path: 'intro.enableMic', label: '“Blow on the glitter” (microphone)', type: 'toggle', help: 'Only works on https (e.g. GitHub Pages).' },
      { path: 'intro.autoMic', label: 'Start the microphone automatically', type: 'toggle', help: 'The phone asks permission as soon as the invitation opens. Turn off to show a button instead.' },
      { path: 'intro.micLabel', label: 'Microphone button text', type: 'text' },
      { path: 'intro.video', label: 'Opening video (optional)', type: 'video', wide: true, help: 'Upload a vertical video to play instead of the built-in glitter & curtain animation (MP4, ideally under 15 MB).' }
    ] },
    { id: 'music', icon: '🎵', title: 'Music', desc: 'Background music starts when the guest opens the invitation (browsers only allow sound after a tap).', fields: [
      { path: 'music.enabled', label: 'Play background music', type: 'toggle', wide: true },
      { path: 'music.src', label: 'Song', type: 'audio', wide: true, help: 'MP3 or M4A. Keep it under ~10 MB so it loads fast on phones.' },
      { path: 'music.volume', label: 'Volume', type: 'range', min: 0, max: 1, step: 0.05 },
      { path: 'music.startAt', label: 'Start at (seconds)', type: 'number', min: 0, step: 1, help: 'Skip a slow intro of the song.' },
      { path: 'music.showButton', label: 'Show play / pause button', type: 'toggle' }
    ] },
    { id: 'letter', icon: '💌', title: 'Letter', desc: 'The paper card pinned with a pearl on red silk.', section: 'letter', fields: [
      { path: 'letter.enabled', label: 'Show this section', type: 'toggle', wide: true },
      { path: 'letter.title', label: 'Title', type: 'text' },
      { path: 'letter.signature', label: 'Signature', type: 'text' },
      { path: 'letter.text', label: 'Message', type: 'textarea', wide: true },
      { path: 'letter.background', label: 'Background', type: 'image', wide: true },
      { path: 'letter.pin', label: 'Pin decoration', type: 'image', wide: true },
      { path: 'letter.envelope', label: 'Envelope (the card rises out of it)', type: 'image', wide: true, help: 'Remove it to show the card on its own.' }
    ] },
    { id: 'date', icon: '📅', title: 'Save the date', desc: 'Desk calendar whose pages turn while scrolling, ending on your month with the day circled.', section: 'event', fields: [
      { path: 'event.enabled', label: 'Show this section', type: 'toggle', wide: true },
      { path: 'event.datetime', label: 'Date & time of the wedding', type: 'datetime', help: 'Used for the calendar, the countdown and “Add to calendar”.' },
      { path: 'event.durationHours', label: 'Duration (hours)', type: 'number', min: 1, step: 1 },
      { path: 'event.title', label: 'Title', type: 'text' },
      { path: 'event.subtitle', label: 'Subtitle', type: 'text' },
      { path: 'event.padLabel', label: 'Text on the calendar top', type: 'text' },
      { path: 'event.monthsToFlip', label: 'Months to turn', type: 'number', min: 1, step: 1, help: 'How many calendar pages turn before your month.' },
      { path: 'event.weekStartsMonday', label: 'Week starts on Monday', type: 'toggle' },
      { path: 'event.pearls', label: 'Decoration beside the calendar', type: 'image', wide: true },
      { path: 'event.dateText', label: 'Date as written', type: 'text' },
      { path: 'event.timeText', label: 'Line under the date', type: 'text' },
      { path: 'event.calendarButton', label: '“Add to calendar” button', type: 'text' }
    ] },
    { id: 'schedule', icon: '🕰️', title: 'The evening', desc: 'Timeline of the night on cream paper.', section: 'schedule', fields: [
      { path: 'schedule.enabled', label: 'Show this section', type: 'toggle', wide: true },
      { path: 'schedule.title', label: 'Title', type: 'text' },
      { path: 'schedule.subtitle', label: 'Subtitle', type: 'text' },
      { path: 'schedule.items', label: 'Moments', type: 'list', wide: true, item: [['time', 'Time'], ['title', 'Title'], ['text', 'Description']] }
    ] },
    { id: 'venue', icon: '📍', title: 'Where', desc: 'Venue photo in an arch, address, directions and a map.', section: 'venue', fields: [
      { path: 'venue.enabled', label: 'Show this section', type: 'toggle', wide: true },
      { path: 'venue.title', label: 'Title', type: 'text' },
      { path: 'venue.name', label: 'Venue name', type: 'text' },
      { path: 'venue.image', label: 'Venue photo', type: 'image', wide: true },
      { path: 'venue.address', label: 'Address', type: 'textarea', wide: true },
      { path: 'venue.mapsUrl', label: 'Google Maps link (button)', type: 'text', wide: true, help: 'In Google Maps: Share → Copy link, then paste it here.' },
      { path: 'venue.button', label: 'Button text', type: 'text' },
      { path: 'venue.showMap', label: 'Show map', type: 'toggle' },
      { path: 'venue.mapQuery', label: 'Map search (place name or address)', type: 'text', wide: true }
    ] },
    { id: 'dress', icon: '👗', title: 'Dress code', desc: 'On red silk.', section: 'dress', fields: [
      { path: 'dress.enabled', label: 'Show this section', type: 'toggle', wide: true },
      { path: 'dress.title', label: 'Title', type: 'text' },
      { path: 'dress.text', label: 'Text', type: 'textarea', wide: true },
      { path: 'dress.background', label: 'Background', type: 'image', wide: true }
    ] },
    { id: 'wishes', icon: '🎁', title: 'A few wishes', desc: 'Paper cards: gifts, children, photos, contact…', section: 'wishes', fields: [
      { path: 'wishes.enabled', label: 'Show this section', type: 'toggle', wide: true },
      { path: 'wishes.title', label: 'Title', type: 'text', wide: true },
      { path: 'wishes.items', label: 'Cards', type: 'list', wide: true, item: [['title', 'Title'], ['text', 'Text']] }
    ] },
    { id: 'faq', icon: '❓', title: 'Questions', desc: 'Questions guests can tap to open.', section: 'faq', fields: [
      { path: 'faq.enabled', label: 'Show this section', type: 'toggle', wide: true },
      { path: 'faq.title', label: 'Title', type: 'text', wide: true },
      { path: 'faq.items', label: 'Questions & answers', type: 'list', wide: true, item: [['q', 'Question'], ['a', 'Answer']] }
    ] },
    { id: 'rsvp', icon: '✉️', title: 'RSVP', desc: 'How guests answer you.', section: 'rsvp', fields: [
      { path: 'rsvp.enabled', label: 'Show this section', type: 'toggle', wide: true },
      { path: 'rsvp.method', label: 'Send answers by', type: 'select', options: [['whatsapp', 'WhatsApp message'], ['email', 'Email'], ['endpoint', 'Online form service (Formspree / Google Sheets)']], wide: true },
      { path: 'rsvp.whatsapp', label: 'Your WhatsApp number', type: 'text', show: (c) => c.rsvp.method === 'whatsapp', help: 'With country code, e.g. 201001234567' },
      { path: 'rsvp.email', label: 'Your email', type: 'text', show: (c) => c.rsvp.method === 'email' },
      { path: 'rsvp.endpoint', label: 'Form endpoint URL', type: 'text', wide: true, show: (c) => c.rsvp.method === 'endpoint', help: 'Formspree form URL (https://formspree.io/f/…) or a Google Apps Script web-app URL.' },
      { path: 'rsvp.title', label: 'Title', type: 'text' },
      { path: 'rsvp.deadline', label: 'Reply-by line (optional)', type: 'text', help: 'e.g. “Kindly reply by December 1”' },
      { path: 'rsvp.text', label: 'Message', type: 'textarea', wide: true },
      { path: 'rsvp.background', label: 'Background', type: 'image', wide: true },
      { path: 'rsvp.namePlaceholder', label: 'Name field', type: 'text' },
      { path: 'rsvp.messagePlaceholder', label: 'Message field', type: 'text' },
      { path: 'rsvp.accept', label: 'Accept button', type: 'text' },
      { path: 'rsvp.decline', label: 'Decline button', type: 'text' },
      { path: 'rsvp.askGuests', label: 'Ask number of guests', type: 'toggle' },
      { path: 'rsvp.guestsPlaceholder', label: 'Guests field', type: 'text' },
      { path: 'rsvp.button', label: 'Send button', type: 'text' },
      { path: 'rsvp.thanks', label: 'Thank-you message', type: 'text' },
      { path: 'rsvp.missing', label: 'Missing info message', type: 'text', wide: true }
    ] },
    { id: 'closing', icon: '🌹', title: 'Until we meet', desc: 'Countdown and your signature at the end.', section: 'closing', fields: [
      { path: 'closing.enabled', label: 'Show this section', type: 'toggle', wide: true },
      { path: 'closing.title', label: 'Title', type: 'text' },
      { path: 'closing.withLove', label: 'Line above names', type: 'text' },
      { path: 'closing.days', label: 'Label: days', type: 'text' },
      { path: 'closing.hours', label: 'Label: hours', type: 'text' },
      { path: 'closing.minutes', label: 'Label: minutes', type: 'text' },
      { path: 'closing.seconds', label: 'Label: seconds', type: 'text' },
      { path: 'closing.showSeconds', label: 'Show seconds', type: 'toggle' },
      { path: 'closing.curtainBackdrop', label: 'Red curtain background', type: 'toggle' },
      { path: 'closing.footer', label: 'Small footer', type: 'text', wide: true }
    ] },
    { id: 'style', icon: '🎨', title: 'Colors & fonts', desc: 'The look of the whole invitation.', presets: true, fields: [
      { path: 'theme.accent', label: 'Gold (main accent)', type: 'color' },
      { path: 'theme.accent2', label: 'Gold (shadow)', type: 'color' },
      { path: 'theme.background', label: 'Background', type: 'color' },
      { path: 'theme.background2', label: 'Background glow', type: 'color' },
      { path: 'theme.text', label: 'Text (pearl)', type: 'color' },
      { path: 'theme.ink', label: 'Ink on paper', type: 'color' },
      { path: 'theme.paper', label: 'Paper', type: 'color' },
      { path: 'theme.namesStyle', label: 'Names color', type: 'select', options: [['pearl', 'Pearl white with glow (original)'], ['gold', 'Gold']] },
      { path: 'theme.scriptFont', label: 'Names & titles font', type: 'font' },
      { path: 'theme.bodyFont', label: 'Text font', type: 'font' },
      { path: 'theme.uiFont', label: 'Date & small caps font', type: 'font' },
      { path: 'theme.typingCursor', label: 'Show typing cursor on the names', type: 'toggle' }
    ] },
    { id: 'general', icon: '⚙️', title: 'Page settings', desc: 'Browser tab title, the preview text shown when you share the link, and language.', fields: [
      { path: 'meta.title', label: 'Page title', type: 'text', wide: true },
      { path: 'meta.description', label: 'Share description', type: 'text', wide: true },
      { path: 'meta.lang', label: 'Language (dates & numbers)', type: 'select', options: LANGS },
      { path: 'meta.dir', label: 'Text direction', type: 'select', options: [['ltr', 'Left → right'], ['rtl', 'Right → left (Arabic)']] }
    ] },
    { id: 'publish', icon: '🚀', title: 'Publish & backup', desc: 'Put your changes online, or save a backup file.', custom: renderPublish }
  ];

  const PRESETS = [
    { name: 'Ruby (original)', c: { accent: '#d9b47c', accent2: '#f3dcae', background: '#1a0207', background2: '#4a0915', text: '#f7eee6', ink: '#8f1426', paper: '#f6eee5' }, glitter: '#c0121f' },
    { name: 'Burgundy', c: { accent: '#d6ad78', accent2: '#f4dcb6', background: '#1d0510', background2: '#4a0e22', text: '#f6e9df', ink: '#6e0f2a', paper: '#f5ece4' }, glitter: '#7d0f2c' },
    { name: 'Midnight', c: { accent: '#cdb88f', accent2: '#ece0c2', background: '#070b18', background2: '#152044', text: '#ecebf3', ink: '#1d2c5e', paper: '#f1efea' }, glitter: '#1f3a8a' },
    { name: 'Emerald', c: { accent: '#d4b874', accent2: '#f0e0b0', background: '#03140e', background2: '#0b3526', text: '#eef2ea', ink: '#0f4a33', paper: '#f2efe6' }, glitter: '#0f6a45' },
    { name: 'Blush', c: { accent: '#d9a98a', accent2: '#f6d9c6', background: '#2a0f16', background2: '#5c2232', text: '#fbeee8', ink: '#9a3550', paper: '#f8eeea' }, glitter: '#d2607b' }
  ];

  let config = null;
  let current = 'couple';
  const frame = $('#previewFrame');

  /* ---------------- toast & status ---------------- */
  let toastT;
  function toast(msg, isErr) {
    const t = $('#toast');
    t.textContent = msg; t.classList.toggle('err', !!isErr); t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), isErr ? 6000 : 2600);
  }
  function status(msg, ok) { const s = $('#status'); s.textContent = msg; s.classList.toggle('is-ok', !!ok); }

  /* ---------------- save + live preview ---------------- */
  let saveT;
  function changed(rerender) {
    status('Saving…');
    clearTimeout(saveT);
    saveT = setTimeout(async () => {
      try {
        await S.saveDraft(config);
        status('All changes saved in this browser · not published yet', true);
      } catch (e) { status('Could not save: ' + e.message); }
      pushPreview();
    }, 250);
    if (rerender) renderEditor();
    updateNav();
  }
  async function pushPreview() {
    const resolved = await S.resolveMedia(config);
    try { frame.contentWindow.postMessage({ type: 'invite:config', config: resolved }, location.origin); } catch (e) { /* not loaded yet */ }
  }
  addEventListener('message', (e) => { if (e.origin === location.origin && e.data && e.data.type === 'invite:ready') pushPreview(); });

  function set(path, val, rerender) { S.setPath(config, path, val); changed(rerender); }
  const get = (path) => S.getPath(config, path);

  /* ---------------- media helpers ---------------- */
  const newId = () => 'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  async function compressImage(file) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 400 * 1024) return file;
    const bmp = await createImageBitmap(file).catch(() => null);
    if (!bmp) return file;
    const max = 2000;
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
    const keepPng = file.type === 'image/png' && file.size < 1.5e6;
    if (keepPng) return file;
    const blob = await new Promise((r) => c.toBlob(r, 'image/jpeg', 0.86));
    return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file;
  }

  async function storeUpload(file, kind) {
    const limit = kind === 'image' ? 25e6 : 60e6;
    if (file.size > limit) throw new Error('File is too big (' + (file.size / 1e6).toFixed(1) + ' MB).');
    const f = kind === 'image' ? await compressImage(file) : file;
    const id = newId();
    const blob = new Blob([f], { type: f.type || file.type });
    await S.putFile(id, blob);
    await S.set('name:' + id, f.name || file.name);
    return 'idb:' + id;
  }

  async function displayUrl(v) {
    if (!v) return '';
    if (v.startsWith('idb:')) { const r = await S.resolveMedia({ v }); return r.v; }
    return v;
  }

  /* ---------------- field renderers ---------------- */
  function renderField(f) {
    const id = 'f_' + f.path.replace(/\./g, '_');
    const val = get(f.path);
    const wrap = el('div', { class: 'field' + (f.wide || ['image', 'audio', 'video', 'list'].includes(f.type) ? ' field--wide' : '') });
    const label = el('label', { for: id }, f.label);
    const help = f.help ? el('p', { class: 'help' }, f.help) : '';

    switch (f.type) {
      case 'text':
        wrap.append(label, el('input', { class: 'input', id, value: val ?? '', dir: 'auto', oninput: (e) => set(f.path, e.target.value) }), help);
        break;
      case 'textarea':
        wrap.append(label, el('textarea', { id, rows: 3, dir: 'auto', oninput: (e) => set(f.path, e.target.value) }, val ?? ''), help);
        break;
      case 'number':
        wrap.append(label, el('input', { class: 'input', id, type: 'number', min: f.min, step: f.step, value: val ?? 0, oninput: (e) => set(f.path, Number(e.target.value)) }), help);
        break;
      case 'datetime':
        wrap.append(label, el('input', { class: 'input', id, type: 'datetime-local', value: val ?? '', oninput: (e) => set(f.path, e.target.value) }), help);
        break;
      case 'toggle': {
        const inp = el('input', { type: 'checkbox', id, onchange: (e) => set(f.path, e.target.checked, true) });
        inp.checked = val !== false && !!val;
        wrap.append(el('label', { class: 'toggle', for: id }, inp, el('span', { class: 'sw' }), el('span', {}, f.label)), help);
        break;
      }
      case 'color': {
        const txt = el('input', { class: 'input', value: val || '', maxlength: 7, 'aria-label': f.label + ' hex' });
        const pick = el('input', { type: 'color', id, value: /^#[\da-f]{6}$/i.test(val) ? val : '#000000' });
        pick.addEventListener('input', () => { txt.value = pick.value; set(f.path, pick.value); });
        txt.addEventListener('input', () => { if (/^#[\da-f]{6}$/i.test(txt.value)) { pick.value = txt.value; set(f.path, txt.value); } });
        wrap.append(label, el('div', { class: 'color' }, pick, txt), help);
        break;
      }
      case 'range': {
        const out = el('output', {}, Math.round((val ?? 0) * 100) + '%');
        const r = el('input', { type: 'range', id, min: f.min, max: f.max, step: f.step, value: val ?? 0 });
        r.addEventListener('input', () => { out.textContent = Math.round(r.value * 100) + '%'; set(f.path, Number(r.value)); });
        wrap.append(label, el('div', { class: 'range' }, r, out), help);
        break;
      }
      case 'select':
      case 'font': {
        const opts = f.type === 'font' ? FONT_NAMES.map((n) => [n, n]) : f.options;
        const s = el('select', { id, onchange: (e) => set(f.path, e.target.value, true) }, opts.map(([v, l]) => el('option', { value: v }, l)));
        s.value = val;
        if (f.type === 'font') s.style.fontFamily = `"${val}", serif`;
        wrap.append(label, s, help);
        break;
      }
      case 'focus': {
        const [x, y] = String(val || '50% 50%').split(/\s+/).map((v) => parseFloat(v) || 50);
        const mk = (name, v, idx) => {
          const out = el('output', {}, Math.round(v) + '%');
          const r = el('input', { type: 'range', min: 0, max: 100, step: 1, value: v, 'aria-label': name });
          r.addEventListener('input', () => {
            out.textContent = r.value + '%';
            const cur = String(get(f.path) || '50% 50%').split(/\s+/);
            cur[idx] = r.value + '%';
            set(f.path, cur.join(' '));
          });
          return el('div', { class: 'range' }, el('span', { style: 'width:96px;flex:none;color:var(--muted);font-size:13px' }, name), r, out);
        };
        wrap.append(el('span', { class: 'label' }, f.label), mk('Left ↔ right', x, 0), mk('Top ↕ bottom', y, 1), help);
        break;
      }
      case 'image':
      case 'audio':
      case 'video':
        wrap.append(el('span', { class: 'label' }, f.label), renderMedia(f, val), help);
        break;
      case 'list':
        wrap.append(el('span', { class: 'label' }, f.label), renderList(f), help);
        break;
    }
    return wrap;
  }

  function renderMedia(f, val) {
    const kind = f.type;
    const accept = kind === 'image' ? 'image/*' : kind === 'audio' ? 'audio/*,.mp3,.m4a,.aac,.ogg,.wav' : 'video/mp4,video/webm,video/quicktime';
    const thumb = el('div', { class: 'media__thumb' }, kind === 'image' ? '🖼️' : kind === 'audio' ? '🎵' : '🎬');
    const meta = el('div', { class: 'meta' });
    const player = kind === 'audio' ? el('audio', { controls: true, preload: 'none' }) : null;
    const file = el('input', { type: 'file', accept, hidden: true });
    const urlInput = el('input', { class: 'input', placeholder: 'or paste a link (https://…)', value: val && !val.startsWith('idb:') ? val : '' });

    async function refresh(v) {
      const url = await displayUrl(v);
      thumb.style.backgroundImage = '';
      thumb.textContent = kind === 'image' ? (url ? '' : '🖼️') : kind === 'audio' ? '🎵' : '';
      if (kind === 'image' && url) thumb.style.backgroundImage = `url("${url}")`;
      if (kind === 'video') {
        thumb.textContent = url ? '' : '🎬';
        if (url) thumb.append(el('video', { src: url, muted: true, playsinline: true, preload: 'metadata' }));
      }
      if (player) { if (url) player.src = url; else player.removeAttribute('src'); player.hidden = !url; }
      if (!v) meta.textContent = 'Nothing selected';
      else if (v.startsWith('idb:')) meta.textContent = '📎 ' + ((await S.get('name:' + v.slice(4))) || 'Uploaded file') + ' · not published yet';
      else meta.textContent = v.split('/').pop();
    }

    file.addEventListener('change', async () => {
      const fl = file.files[0];
      if (!fl) return;
      meta.textContent = 'Uploading…';
      try {
        const ref = await storeUpload(fl, kind);
        set(f.path, ref);
        urlInput.value = '';
        refresh(ref);
        toast('Uploaded ✓');
      } catch (e) { toast(e.message, true); refresh(get(f.path)); }
      file.value = '';
    });
    urlInput.addEventListener('change', () => { set(f.path, urlInput.value.trim()); refresh(urlInput.value.trim()); });

    const btns = el('div', { class: 'media__btns' },
      el('button', { class: 'btn btn--sm', type: 'button', onclick: () => file.click() }, val ? 'Replace…' : 'Upload…'),
      el('button', { class: 'btn btn--sm btn--danger', type: 'button', onclick: () => { set(f.path, ''); urlInput.value = ''; refresh(''); } }, 'Remove')
    );
    const def = S.getPath(window.INVITE_CONFIG, f.path);
    if (def && def !== val) btns.append(el('button', { class: 'btn btn--sm', type: 'button', onclick: () => { set(f.path, def); urlInput.value = def; refresh(def); } }, 'Use default'));

    refresh(val);
    return el('div', { class: 'media' }, thumb, el('div', { class: 'media__body' }, btns, player, meta, urlInput, file));
  }

  function renderList(f) {
    const box = el('div', { class: 'list' });
    const items = get(f.path) || [];
    items.forEach((it, i) => {
      const row = el('div', { class: 'list__item', style: `grid-template-columns: ${f.item.length === 3 ? '90px 1fr 1.4fr' : '1fr 1.6fr'} auto` });
      f.item.forEach(([k, lbl]) => {
        row.append(el('input', { class: 'input', placeholder: lbl, 'aria-label': lbl, value: it[k] || '', dir: 'auto', oninput: (e) => { items[i][k] = e.target.value; set(f.path, items); } }));
      });
      row.append(el('button', { class: 'btn btn--danger', type: 'button', title: 'Remove', onclick: () => { items.splice(i, 1); set(f.path, items, true); } }, '✕'));
      box.append(row);
    });
    box.append(el('div', {}, el('button', { class: 'btn btn--sm', type: 'button', onclick: () => { items.push({}); set(f.path, items, true); } }, '+ Add')));
    return box;
  }

  /* ---------------- nav & editor ---------------- */
  function updateNav() {
    const nav = $('#nav');
    nav.innerHTML = '';
    SCHEMA.forEach((g) => {
      const off = g.section && get(g.section + '.enabled') === false;
      nav.append(el('button', { type: 'button', class: g.id === current ? 'is-active' : '', onclick: () => { current = g.id; renderEditor(); updateNav(); $('#editor').scrollTop = 0; scrollPreview(g); } },
        el('span', { class: 'ico' }, g.icon), g.title, off ? el('span', { class: 'off' }, 'hidden') : null));
    });
  }

  function scrollPreview(g) {
    try {
      const doc = frame.contentDocument;
      const target = g.section ? doc.querySelector(`[data-section="${g.section}"]`) : g.id === 'couple' ? doc.querySelector('#hero') : null;
      if (target && !target.classList.contains('is-off')) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (g.id === 'opening') frame.src = 'index.html?preview';
    } catch (e) { /* ignore */ }
  }

  function renderEditor() {
    const g = SCHEMA.find((x) => x.id === current);
    const ed = $('#editor');
    const scroll = ed.scrollTop;
    ed.innerHTML = '';
    ed.append(el('div', { class: 'group__head' }, el('div', {}, el('h2', {}, g.icon + ' ' + g.title), el('p', {}, g.desc))));
    if (g.custom) { g.custom(ed); return; }
    if (g.presets) {
      ed.append(el('div', { class: 'card' }, el('h3', {}, 'Ready-made palettes'),
        el('div', { class: 'presets' }, PRESETS.map((p) => el('button', { class: 'preset', type: 'button', onclick: () => {
          Object.assign(config.theme, p.c); config.intro.glitterColor = p.glitter; changed(true); toast(p.name + ' applied');
        } }, el('i', { style: `background:linear-gradient(135deg, ${p.glitter} 0 50%, ${p.c.accent} 50%)` }), p.name)))));
    }
    const fields = el('div', { class: 'fields' });
    g.fields.forEach((f) => { if (!f.show || f.show(config)) fields.append(renderField(f)); });
    ed.append(el('div', { class: 'card' }, fields));
    ed.scrollTop = scroll;
  }

  /* ---------------- backup (export / import) ---------------- */
  const blobToDataUrl = (b) => new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(b); });

  async function exportBackup() {
    const out = S.clone(config);
    const files = {};
    const ids = [];
    S.walk(out, (v) => { if (typeof v === 'string' && v.startsWith('idb:')) ids.push(v.slice(4)); });
    for (const id of new Set(ids)) {
      const b = await S.getFile(id);
      if (b) files[id] = { name: await S.get('name:' + id), data: await blobToDataUrl(b) };
    }
    const blob = new Blob([JSON.stringify({ kind: 'invitation-backup', version: 1, config: out, files }, null, 1)], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: 'invitation-backup-' + new Date().toISOString().slice(0, 10) + '.json' });
    document.body.append(a); a.click(); a.remove();
    toast('Backup downloaded');
  }

  async function importBackup(file) {
    try {
      const data = JSON.parse(await file.text());
      if (data.kind !== 'invitation-backup') throw new Error('This is not an invitation backup file.');
      for (const id in data.files || {}) {
        const blob = await (await fetch(data.files[id].data)).blob();
        await S.putFile(id, blob);
        await S.set('name:' + id, data.files[id].name || id);
      }
      config = S.merge(window.INVITE_CONFIG, data.config);
      changed(true);
      toast('Backup restored ✓');
    } catch (e) { toast('Import failed: ' + e.message, true); }
  }

  /* ---------------- GitHub publishing ---------------- */
  function ghSettings() {
    let s = {};
    try { s = JSON.parse(localStorage.getItem('invite-gh') || '{}'); } catch (e) { /* ignore */ }
    if (!s.owner || !s.repo) {
      const m = /^([\w-]+)\.github\.io$/i.exec(location.hostname);
      if (m) { s.owner = s.owner || m[1]; s.repo = s.repo || location.pathname.split('/').filter(Boolean)[0] || (m[1] + '.github.io'); }
    }
    return Object.assign({ owner: 'ahmedsalamaa', repo: 'My-Third-WebSite', branch: 'main', token: '' }, s);
  }
  function saveGh(s) { try { localStorage.setItem('invite-gh', JSON.stringify(s)); } catch (e) { /* ignore */ } }

  const b64FromBlob = async (blob) => (await blobToDataUrl(blob)).split(',')[1];
  const b64FromText = (txt) => { const bytes = new TextEncoder().encode(txt); let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); };
  const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'audio/mpeg': 'mp3', 'audio/mp3': 'mp3', 'audio/mp4': 'm4a', 'audio/x-m4a': 'm4a', 'audio/aac': 'aac', 'audio/ogg': 'ogg', 'audio/wav': 'wav', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' };

  async function ghPut(gh, path, content, message) {
    const api = `https://api.github.com/repos/${encodeURIComponent(gh.owner)}/${encodeURIComponent(gh.repo)}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
    const headers = { Authorization: 'Bearer ' + gh.token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
    let sha;
    const g = await fetch(api + '?ref=' + encodeURIComponent(gh.branch), { headers, cache: 'no-store' });
    if (g.ok) sha = (await g.json()).sha;
    else if (g.status === 401) throw new Error('GitHub rejected the token (401). Check that it is correct and not expired.');
    else if (g.status === 404 && !(await fetch(`https://api.github.com/repos/${gh.owner}/${gh.repo}`, { headers })).ok) throw new Error(`Repository ${gh.owner}/${gh.repo} not found, or the token cannot access it.`);
    const r = await fetch(api, { method: 'PUT', headers, body: JSON.stringify({ message, content, branch: gh.branch, sha }) });
    if (!r.ok) {
      let msg = 'HTTP ' + r.status; try { msg = (await r.json()).message || msg; } catch (e) { /* ignore */ }
      throw new Error(path + ': ' + msg);
    }
  }

  async function publish(log, btn) {
    const gh = ghSettings();
    if (!gh.owner || !gh.repo || !gh.token) { toast('Fill in the GitHub settings below first.', true); current = 'publish'; renderEditor(); updateNav(); return; }
    btn.disabled = true;
    const say = (m) => { log.textContent += m + '\n'; log.scrollTop = log.scrollHeight; };
    log.textContent = '';
    try {
      const out = S.clone(config);
      const refs = {};
      S.walk(out, (v, path) => { if (typeof v === 'string' && v.startsWith('idb:')) (refs[v] = refs[v] || []).push(path); });
      const keys = Object.keys(refs);
      if (keys.length) say(`Uploading ${keys.length} file(s)…`);
      for (const ref of keys) {
        const id = ref.slice(4);
        const blob = await S.getFile(id);
        if (!blob) { say('⚠ missing upload ' + id + ', skipped'); refs[ref].forEach((p) => S.setPath(out, p, '')); continue; }
        const name = (await S.get('name:' + id)) || id;
        const ext = EXT[blob.type] || (name.split('.').pop() || 'bin').toLowerCase();
        const path = `assets/uploads/${id}.${ext}`;
        say(`  ↑ ${name} (${(blob.size / 1e6).toFixed(1)} MB)`);
        await ghPut(gh, path, await b64FromBlob(blob), 'Upload ' + name + ' from invitation dashboard');
        refs[ref].forEach((p) => { S.setPath(out, p, path); S.setPath(config, p, path); });
      }
      say('Saving texts & settings (config.js)…');
      const js = '/* Invitation content.\n * This file is written by the dashboard (admin.html → Publish).\n * You can also edit it by hand: every text, photo and setting of the invitation lives here.\n */\nwindow.INVITE_CONFIG = ' + JSON.stringify(out, null, 2) + ';\n';
      await ghPut(gh, 'config.js', b64FromText(js), 'Update invitation from dashboard');
      await S.saveDraft(config);
      say('✓ Published! GitHub Pages usually updates within 1–2 minutes.');
      status('Published ✓', true);
      toast('Published ✓');
    } catch (e) {
      say('✗ ' + e.message);
      toast('Publish failed: ' + e.message, true);
    } finally { btn.disabled = false; }
  }

  function renderPublish(ed) {
    const gh = ghSettings();
    const log = el('div', { class: 'log' });
    const inp = (k, lbl, attrs = {}) => {
      const i = el('input', Object.assign({ class: 'input', value: gh[k] || '', id: 'gh_' + k }, attrs));
      i.addEventListener('input', () => { gh[k] = i.value.trim(); saveGh(gh); });
      return el('div', { class: 'field' }, el('label', { for: 'gh_' + k }, lbl), i);
    };
    const pubBtn = el('button', { class: 'btn btn--primary', type: 'button' }, '🚀 Publish to GitHub');
    pubBtn.addEventListener('click', () => publish(log, pubBtn));

    ed.append(
      el('div', { class: 'card' },
        el('h3', {}, 'Publish online (GitHub Pages)'),
        el('ol', { class: 'steps' },
          el('li', {}, 'On GitHub open ', el('b', {}, 'Settings → Developer settings → Personal access tokens → Fine-grained tokens'), ' and create a token for this repository with ', el('b', {}, 'Contents: Read and write'), '.'),
          el('li', {}, 'Paste it below together with your user name, repository and branch.'),
          el('li', {}, 'Press ', el('b', {}, 'Publish'), '. Your photos, music and texts are committed to the repository and the live invitation updates.')),
        el('div', { class: 'fields', style: 'margin-top:14px' },
          inp('owner', 'GitHub user / organization', { placeholder: 'e.g. ahmedsalamaa' }),
          inp('repo', 'Repository', { placeholder: 'e.g. My-Third-WebSite' }),
          inp('branch', 'Branch', { placeholder: 'main' }),
          inp('token', 'Access token', { type: 'password', placeholder: 'github_pat_…', autocomplete: 'off' })),
        el('p', { class: 'help', style: 'margin:10px 0 14px' }, 'The token is stored only in this browser and is sent only to api.github.com. Guests visiting the invitation never see it.'),
        el('div', { class: 'row' }, pubBtn),
        log),
      el('div', { class: 'card' },
        el('h3', {}, 'Backup'),
        el('p', { class: 'help', style: 'margin:0 0 12px' }, 'Download everything (texts + uploaded photos & music) as one file, to move to another computer or keep safe.'),
        el('div', { class: 'row' },
          el('button', { class: 'btn', type: 'button', onclick: exportBackup }, '⬇ Download backup'),
          (() => { const f = el('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: (e) => e.target.files[0] && importBackup(e.target.files[0]) }); return el('button', { class: 'btn', type: 'button', onclick: () => f.click() }, '⬆ Restore backup', f); })())),
      el('div', { class: 'card' },
        el('h3', {}, 'Start over'),
        el('p', { class: 'help', style: 'margin:0 0 12px' }, 'Throw away the unpublished changes in this browser and go back to the published invitation.'),
        el('button', { class: 'btn btn--danger', type: 'button', onclick: async () => {
          if (!confirm('Discard all unpublished changes?')) return;
          await S.del('draft');
          config = S.clone(window.INVITE_CONFIG);
          changed(true);
          frame.src = 'index.html?preview&skipIntro';
          toast('Draft discarded');
        } }, 'Discard draft'))
    );
  }

  /* ---------------- boot ---------------- */
  async function boot() {
    try { config = await S.loadDraft(); } catch (e) { config = S.clone(window.INVITE_CONFIG); toast('Browser storage unavailable — changes will not be kept.', true); }
    const hasDraft = !!(await S.get('draft').catch(() => null));
    status(hasDraft ? 'Draft loaded · not published yet' : 'Showing the published invitation', !hasDraft);
    updateNav();
    renderEditor();
    frame.addEventListener('load', pushPreview);

    $('#replayIntro').addEventListener('click', () => { frame.src = 'index.html?preview&t=' + Date.now(); });
    $('#publishTop').addEventListener('click', () => { current = 'publish'; updateNav(); renderEditor(); });
    $('#togglePreview').addEventListener('click', () => $('#previewPane').classList.toggle('is-shown'));
    $('#previewPane').addEventListener('click', (e) => { if (e.target.id === 'previewPane') e.currentTarget.classList.remove('is-shown'); });
  }
  boot();
})();
