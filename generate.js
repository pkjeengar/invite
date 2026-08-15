const RUNTIME_FILES = [
  'script_main.DZXN63KL.mjs',
  'uenLp5iYacBv6Y6vgXdfNi11vFmKV-ZIPsowQDdDS5k.BxvJZ1ao.mjs',
  'Badge.BEa6bRyu.mjs',
  'bqzoPsKqs.Dy2Dwew5.mjs',
  'Countdown.CpZiydx4.mjs',
  'framer.CwDGTnho.mjs',
  'index.es.CaM4B78n.mjs',
  'iu4m76jmrCpyi6csvygKivIz7Qo3UDl8Q7s_6tDGgvs.iJM35oeW.mjs',
  'KHQgVYK_f.Cq36qMZ9.mjs',
  'LpQMHSxlP.BPUF8Ijm.mjs',
  'motion.DUyYEW4y.mjs',
  'OIjZRBmWDcIE2B6qgG1j.CoKjQ_qK.mjs',
  'qlbbgH4df.BCGtDBDq.mjs',
  'react.Cnv3hKDS.mjs',
  'rNzK92DPl.CjO5mQGx.mjs',
  'rolldown-runtime.Dh6celcD.mjs',
  'SmoothScroll_Prod.BPYRKgmf.mjs',
];

const CONTENT_CHUNK = 'uenLp5iYacBv6Y6vgXdfNi11vFmKV-ZIPsowQDdDS5k.BxvJZ1ao.mjs';
const SCRIPT_MAIN_CDN = 'https://framerusercontent.com/sites/3bR6R2YrHoycodLqL6z8ep/script_main.DZXN63KL.mjs';

const LETTER_STYLE = 'display:inline-block;opacity:0.001;filter:blur(10px);transform:translateX(0px) translateY(10px) scale(0) rotate(0deg) skewX(0deg) skewY(0deg)';

function htmlEscape(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function jsEscape(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

function unescapeHtml(s) {
  return s
    .replace(/&nbsp;/g, '\u00a0')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}

function letterBlock(word) {
  const spans = word.split('').map(c => `<span style="${LETTER_STYLE}">${c}</span>`).join('');
  return `<span style="white-space:nowrap">${spans}</span>`;
}

function extractFields(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const ps = doc.querySelectorAll('p.framer-text');
  const out = [];
  const seen = new Set();
  for (const p of ps) {
    const t = p.textContent;
    if (!t || !t.trim()) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
  }
  return out;
}

function isLetterSplit(html, text) {
  return html.includes(letterBlock(text));
}

function applyHtmlReplacements(html, overrides) {
  for (const [orig, next] of overrides) {
    if (!next || next === orig) continue;
    const oldWrap = letterBlock(orig);
    const newWrap = letterBlock(next);
    while (html.includes(oldWrap)) html = html.replace(oldWrap, newWrap);
    const patOld = '>' + htmlEscape(orig) + '<';
    const patNew = '>' + htmlEscape(next) + '<';
    while (html.includes(patOld)) html = html.replace(patOld, patNew);
  }
  return html;
}

function applyChunkReplacements(chunk, overrides) {
  const litRe = /`(?:[^`\\]|\\.)*`/g;
  for (const [orig, next] of overrides) {
    if (!next || next === orig) continue;
    const newLit = '`' + jsEscape(next) + '`';
    chunk = chunk.replace(litRe, m => {
      const content = m.slice(1, -1);
      const decoded = content.replace(/\\`/g, '`').replace(/\\\\/g, '\\');
      return decoded === orig ? newLit : m;
    });
  }
  return chunk;
}

const COUNTDOWN_DATE_LIT = 'date:`2026-03-10T00:00:00.000Z`';
const COUNTDOWN_PICKTIME_LIT = 'pickTime:0,width:`100%`';
const COUNTDOWN_LABEL_COLOR = 'rgb(68, 19, 155)';

function countdownSSRStructure(dateStr) {
  const target = new Date(dateStr);
  const ms = target.getTime() - Date.now();
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor(ms / 3600000) % 24;
  const minutes = Math.floor(ms / 60000) % 60;
  const pad = n => (n < 0 ? '00' : n < 10 ? '0' + n : String(n));
  const label = t => '<span style="color: ' + COUNTDOWN_LABEL_COLOR + ';">' + t + '</span>';
  // Matches the client's element structure: text, span, text, text, span, text, text, span, text.
  // Comment separators keep adjacent text nodes distinct after HTML parsing (React skips comments in hydration).
  return pad(days) + label('D') + '<!-- --> <!-- -->' + pad(hours) + label('H') + '<!-- --> <!-- -->' + pad(minutes) + label('M') + '<!-- --> ';
}
const AUDIO_SRC_LIT = 'https://framerusercontent.com/assets/q8x7MYVF61gOLfkcxdG7dlXjxw.mp3';
const AUDIO_SRCURL_LIT = 'srcUrl:`https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3`';

const MAP_PIN_LIT = 'Q8mzaMJPJ:`missingpiecedesign.com`';
const INSTA_LIT = 'hah7YEktd:`missingpiecedesign.com`';
const WHATSAPP_LIT = 'Sgtzk03RS:`https://wa.me/91XXXXXXXXXX`';
const BUY_LIT = 'oYsZVBOnc:`https://rzp.io/rzp/mountain`';

const MAP_TEXT_LINK_HTML = '<a class="framer-text framer-styles-preset-thf6wm" data-styles-preset="Yt_9XCLfK">See the route</a>';
const MAP_TEXT_LINK_CHUNK = 'u(m.a,{className:`framer-styles-preset-thf6wm`,"data-styles-preset":`Yt_9XCLfK`,children:`See the route`})';

const MAP_PIN_ANCHOR = '<a as="a" class="framer-okxxtm framer-111vxxt" data-framer-name="ChatGPT Image Aug 20, 2025 at 01_02_57 PM 1" href="https://missingpiecedesign.com">';
const INSTA_ANCHOR = '<a as="a" class="framer-1yqo92c framer-1hwqsad" data-framer-name="ChatGPT Image Aug 20, 2025 at 01_02_57 PM 1" href="https://missingpiecedesign.com">';

const PHOTOS = {
  'gRww6exoGDvAz61zxbMcONGtfY': { label: 'Hero — Wedding shoot 1', ext: 'jpeg' },
  'kIF0ETtgRuNBoRKEFRcc3j8TKc': { label: 'Hero — Wedding shoot 2', ext: 'jpeg' },
  'cxldxuk5ae7V1ezs4LEAeu06bQ': { label: 'Hero — Wedding shoot 3', ext: 'jpeg' },
  '97fFKjBlB41svOUd0yNGLWv4': { label: 'Hero — Wedding shoot 4', ext: 'jpeg' },
  'bsMApjuWNtSH6ZoQiKsathtFI': { label: 'Couple portrait 1', ext: 'png' },
  'uHJCRyTJO5bFnINnfmo5GFo0sQ': { label: 'Couple portrait 2', ext: 'png' },
};

function assetReplacements(html, chunk, assets) {
  let out = { html, chunk };

  if (assets.countdownDate) {
    const lit = 'date:`' + jsEscape(assets.countdownDate) + '`';
    const utcHour = new Date(assets.countdownDate).getUTCHours();
    out.chunk = out.chunk
      .split(COUNTDOWN_DATE_LIT).join(lit)
      .split(COUNTDOWN_PICKTIME_LIT).join('pickTime:' + utcHour + ',width:`100%`');
    // Only swap the SSR placeholder for the element structure when the target is still in the
    // future (client renders elements); a past target renders the same text placeholder as SSR.
    if (new Date(assets.countdownDate).getTime() > Date.now()) {
      out.html = out.html.split('>00:00:00:00</p>').join('>' + countdownSSRStructure(assets.countdownDate) + '</p>');
    }
  }

  if (assets.audioUrl) {
    const u = assets.audioUrl;
    out.html = out.html.split(AUDIO_SRC_LIT).join(htmlEscape(u));
    out.chunk = out.chunk
      .split('srcFile:`' + AUDIO_SRC_LIT + '`').join('srcFile:`' + jsEscape(u) + '`')
      .split(AUDIO_SRCURL_LIT).join('srcUrl:`' + jsEscape(u) + '`');
  }

  if (assets.photos) {
    for (const [id, url] of Object.entries(assets.photos)) {
      if (!url || !PHOTOS[id]) continue;
      const base = 'https://framerusercontent.com/images/' + id + '.' + PHOTOS[id].ext;
      out.html = out.html.split(base).join(url);
      out.chunk = out.chunk.split(base).join(url);
    }
  }

  if (assets.mapUrl) {
    const u = assets.mapUrl;
    out.chunk = out.chunk
      .split(MAP_PIN_LIT).join('Q8mzaMJPJ:`' + jsEscape(u) + '`')
      .split(MAP_TEXT_LINK_CHUNK).join('u(m.a,{className:`framer-styles-preset-thf6wm`,"data-styles-preset":`Yt_9XCLfK`,href:`' + jsEscape(u) + '`,children:`See the route`})');
    out.html = out.html
      .split(MAP_TEXT_LINK_HTML).join('<a class="framer-text framer-styles-preset-thf6wm" data-styles-preset="Yt_9XCLfK" href="' + htmlEscape(u) + '">See the route</a>')
      .split(MAP_PIN_ANCHOR).join('<a as="a" class="framer-okxxtm framer-111vxxt" data-framer-name="ChatGPT Image Aug 20, 2025 at 01_02_57 PM 1" href="' + htmlEscape(u) + '">');
  }

  if (assets.instagramUrl) {
    const u = assets.instagramUrl;
    out.chunk = out.chunk.split(INSTA_LIT).join('hah7YEktd:`' + jsEscape(u) + '`');
    out.html = out.html.split(INSTA_ANCHOR).join('<a as="a" class="framer-1yqo92c framer-1hwqsad" data-framer-name="ChatGPT Image Aug 20, 2025 at 01_02_57 PM 1" href="' + htmlEscape(u) + '">');
  }

  if (assets.whatsappUrl) {
    const u = assets.whatsappUrl;
    out.chunk = out.chunk.split(WHATSAPP_LIT).join('Sgtzk03RS:`' + jsEscape(u) + '`');
    out.html = out.html.split('href="https://wa.me/91XXXXXXXXXX"').join('href="' + htmlEscape(u) + '"');
  }

  if (assets.buyUrl) {
    const u = assets.buyUrl;
    out.chunk = out.chunk.split(BUY_LIT).join('oYsZVBOnc:`' + jsEscape(u) + '`');
    out.html = out.html.split('href="https://rzp.io/rzp/mountain"').join('href="' + htmlEscape(u) + '"');
  }

  return out;
}

async function buildClientFiles(overrides, assets = {}) {
  const indexHtmlRes = await fetch('./index.html');
  const indexHtml = await indexHtmlRes.text();
  const chunkRes = await fetch('./runtime/' + CONTENT_CHUNK);
  const chunk = await chunkRes.text();

  let html = applyHtmlReplacements(indexHtml, overrides);
  let newChunk = applyChunkReplacements(chunk, overrides);
  const replaced = assetReplacements(html, newChunk, assets);
  html = replaced.html;
  newChunk = replaced.chunk;
  const htmlFinal = html.replace(SCRIPT_MAIN_CDN, './script_main.DZXN63KL.mjs');

  const files = [];
  files.push({ name: 'index.html', data: new TextEncoder().encode(htmlFinal) });
  for (const name of RUNTIME_FILES) {
    const data = name === CONTENT_CHUNK ? newChunk : await (await fetch('./runtime/' + name)).text();
    files.push({ name, data: new TextEncoder().encode(data) });
  }
  return files;
}

// ---- minimal ZIP writer (STORE, no compression) ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function makeZip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;
  const enc = new TextEncoder();
  const now = new Date();
  const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
  const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;

  for (const f of files) {
    const nameBytes = enc.encode(f.name);
    const data = f.data;
    const crc = crc32(data);
    const size = data.length;
    const header = new Uint8Array(30 + nameBytes.length);
    const dv = new DataView(header.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true);      // version needed
    dv.setUint16(6, 0x0800, true);  // flags (UTF-8 names)
    dv.setUint16(8, 0, true);       // method: store
    dv.setUint16(10, dosTime, true);
    dv.setUint16(12, dosDate, true);
    dv.setUint32(14, crc, true);
    dv.setUint32(18, size, true);
    dv.setUint32(22, size, true);
    dv.setUint16(26, nameBytes.length, true);
    dv.setUint16(28, 0, true);
    header.set(nameBytes, 30);
    chunks.push(header, data);

    const cd = new Uint8Array(46 + nameBytes.length);
    const cvd = new DataView(cd.buffer);
    cvd.setUint32(0, 0x02014b50, true);
    cvd.setUint16(4, 20, true);
    cvd.setUint16(6, 20, true);
    cvd.setUint16(8, 0x0800, true);
    cvd.setUint16(10, 0, true);
    cvd.setUint16(12, dosTime, true);
    cvd.setUint16(14, dosDate, true);
    cvd.setUint32(16, crc, true);
    cvd.setUint32(20, size, true);
    cvd.setUint32(24, size, true);
    cvd.setUint16(28, nameBytes.length, true);
    cvd.setUint32(42, offset, true);
    cd.set(nameBytes, 46);
    central.push(cd);
    offset += header.length + data.length;
  }

  const centralSize = central.reduce((a, c) => a + c.length, 0);
  const eocd = new Uint8Array(22);
  const edv = new DataView(eocd.buffer);
  edv.setUint32(0, 0x06054b50, true);
  edv.setUint16(8, files.length, true);
  edv.setUint16(10, files.length, true);
  edv.setUint32(12, centralSize, true);
  edv.setUint32(16, offset, true);

  const total = offset + centralSize + 22;
  const out = new Uint8Array(total);
  let pos = 0;
  for (const c of chunks) { out.set(c, pos); pos += c.length; }
  for (const c of central) { out.set(c, pos); pos += c.length; }
  out.set(eocd, pos);
  return out;
}

function downloadZip(zipBytes, slug) {
  const blob = new Blob([zipBytes], { type: 'application/zip' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `invite-${slug}.zip`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

export { extractFields, isLetterSplit, buildClientFiles, makeZip, downloadZip, RUNTIME_FILES, CONTENT_CHUNK, PHOTOS };
