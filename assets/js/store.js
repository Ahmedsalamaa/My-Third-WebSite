/* Shared storage helpers for the invitation and the dashboard.
 * - Draft config + uploaded files live in IndexedDB (only in the browser that edits them).
 * - Uploaded files are referenced in the config as "idb:<id>" until they are published.
 */
(function () {
  const DB_NAME = 'invite-dashboard';
  const DB_VERSION = 1;
  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) return reject(new Error('IndexedDB not available'));
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
        if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromise;
  }

  async function tx(store, mode, fn) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const t = db.transaction(store, mode);
      const s = t.objectStore(store);
      let result;
      const r = fn(s);
      if (r) r.onsuccess = () => { result = r.result; };
      t.oncomplete = () => resolve(result);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
  }

  const Store = {
    get: (key) => tx('kv', 'readonly', (s) => s.get(key)).catch(() => undefined),
    set: (key, val) => tx('kv', 'readwrite', (s) => s.put(val, key)),
    del: (key) => tx('kv', 'readwrite', (s) => s.delete(key)),
    getFile: (id) => tx('files', 'readonly', (s) => s.get(id)).catch(() => undefined),
    putFile: (id, blob) => tx('files', 'readwrite', (s) => s.put(blob, id)),
    delFile: (id) => tx('files', 'readwrite', (s) => s.delete(id)),
    listFiles: () => tx('files', 'readonly', (s) => s.getAllKeys()).catch(() => []),

    clone(o) { return JSON.parse(JSON.stringify(o)); },

    isObj(v) { return v && typeof v === 'object' && !Array.isArray(v); },

    /* Deep-merge: values from `over` win, but keys missing from `over` keep defaults. */
    merge(base, over) {
      if (!Store.isObj(base) || !Store.isObj(over)) return over === undefined ? base : over;
      const out = Store.clone(base);
      for (const k of Object.keys(over)) {
        out[k] = Store.isObj(base[k]) && Store.isObj(over[k]) ? Store.merge(base[k], over[k]) : over[k];
      }
      return out;
    },

    getPath(obj, path) {
      return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
    },
    setPath(obj, path, val) {
      const parts = path.split('.');
      let o = obj;
      for (let i = 0; i < parts.length - 1; i++) {
        if (o[parts[i]] == null) o[parts[i]] = {};
        o = o[parts[i]];
      }
      o[parts[parts.length - 1]] = val;
    },

    /* Walk every string value of the config. */
    walk(obj, fn, prefix = '') {
      if (Array.isArray(obj)) obj.forEach((v, i) => Store.walk(v, fn, prefix + i + '.'));
      else if (Store.isObj(obj)) Object.keys(obj).forEach((k) => Store.walk(obj[k], fn, prefix + k + '.'));
      else fn(obj, prefix.slice(0, -1));
    },

    /* Turn idb:<id> references into blob: URLs so the page can display them. */
    _urlCache: {},
    async resolveMedia(config) {
      const out = Store.clone(config);
      const jobs = [];
      Store.walk(out, (v, path) => {
        if (typeof v === 'string' && v.startsWith('idb:')) {
          const id = v.slice(4);
          jobs.push((async () => {
            if (!Store._urlCache[id]) {
              const blob = await Store.getFile(id);
              Store._urlCache[id] = blob ? URL.createObjectURL(blob) : '';
            }
            Store.setPath(out, path, Store._urlCache[id]);
          })());
        }
      });
      await Promise.all(jobs);
      return out;
    },

    /* Only the values that differ from `base` (arrays are compared and kept whole). */
    diff(base, cur) {
      if (Store.isObj(base) && Store.isObj(cur)) {
        const out = {};
        for (const k of Object.keys(cur)) {
          if (!(k in base)) { out[k] = Store.clone(cur[k]); continue; }
          const d = Store.diff(base[k], cur[k]);
          if (d !== undefined) out[k] = d;
        }
        return Object.keys(out).length ? out : undefined;
      }
      return JSON.stringify(base) === JSON.stringify(cur) ? undefined : Store.clone(cur);
    },

    /* The draft keeps ONLY the owner's changes, so design updates in config.js always come through.
     * Old drafts (a full copy of every setting) are ignored: they would undo newer designs. */
    async loadDraft() {
      const base = window.INVITE_CONFIG || {};
      const draft = await Store.get('draft');
      if (draft && draft.v === 2) return Store.merge(base, draft.changes || {});
      if (draft) await Store.del('draft').catch(() => {});
      return Store.clone(base);
    },
    async draftChanges() {
      const draft = await Store.get('draft');
      return draft && draft.v === 2 ? (draft.changes || {}) : {};
    },
    saveDraft(config) {
      return Store.set('draft', { v: 2, changes: Store.diff(window.INVITE_CONFIG || {}, config) || {} });
    }
  };

  /* Google Fonts offered in the dashboard. `italic: false` = the font has no italic style. */
  Store.FONTS = {
    'Corinthia': { spec: 'wght@400;700', italic: false, scale: 1.35 },
    'Cormorant Garamond': { spec: 'ital,wght@0,400;0,500;0,600;1,400;1,500;1,600', italic: true },
    'Gilda Display': { spec: '', italic: false },
    'Cormorant SC': { spec: 'wght@400;500', italic: false },
    'Playfair Display': { spec: 'ital,wght@0,400;0,500;1,400;1,500', italic: true },
    'Bodoni Moda': { spec: 'ital,wght@0,400;0,500;1,400;1,500', italic: true },
    'EB Garamond': { spec: 'ital,wght@0,400;0,500;1,400;1,500', italic: true },
    'Pinyon Script': { spec: '', italic: false, scale: 1.05 },
    'Great Vibes': { spec: '', italic: false, scale: 1.12 },
    'Parisienne': { spec: '', italic: false, scale: 1.08 },
    'Italiana': { spec: '', italic: false },
    'Jost': { spec: 'wght@300;400;500', italic: false },
    'Amiri': { spec: 'ital,wght@0,400;0,700;1,400', italic: true },
    'Aref Ruqaa': { spec: 'wght@400;700', italic: false },
    'El Messiri': { spec: 'wght@400;500;600', italic: false },
    'Reem Kufi': { spec: 'wght@400;500', italic: false },
    'Cairo': { spec: 'wght@300;400;600', italic: false },
    'Tajawal': { spec: 'wght@300;400;500', italic: false },
    'Lateef': { spec: 'wght@400;500', italic: false }
  };
  Store.fontsUrl = function (names) {
    const fams = [...new Set(names.filter(Boolean))].map((n) => {
      const f = Store.FONTS[n] || { spec: '' };
      return 'family=' + encodeURIComponent(n).replace(/%20/g, '+') + (f.spec ? ':' + f.spec : '');
    });
    return 'https://fonts.googleapis.com/css2?' + fams.join('&') + '&display=swap';
  };

  window.InviteStore = Store;
})();
