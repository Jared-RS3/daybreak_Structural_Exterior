/* eslint-disable @typescript-eslint/no-require-imports -- Node test loader transpiles local TypeScript without another dependency. */
const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  // server-only exists only inside Next's build; here it's a no-op stub (cached below).
  if (request === 'server-only') return 'server-only-stub';
  return resolve.call(this, request.startsWith('@/') ? path.join(root, 'src', request.slice(2)) : request, parent, ...rest);
};
require.extensions['.ts'] = (module, filename) => {
  const source = require('node:fs').readFileSync(filename, 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  module._compile(code, filename);
};

require.cache['server-only-stub'] = { id: 'server-only-stub', filename: 'server-only-stub', loaded: true, exports: {} };

const { itemsById, areas, categories, priceEstimate, readPicks } = require('../src/lib/estimator.ts');
const { southeastCategories, southeastItems, southeastAreas, southeastScenes } = require('../src/lib/demos/southeast.ts');
const { createSoutheastPdf } = require('../src/lib/demos/southeast-pdf.ts');
const { PDFDocument } = require('pdf-lib');

test('every SECC repair is priced by the shared engine', () => {
  for (const id of Object.keys(southeastItems)) assert.ok(itemsById[id], `${id} is in the shared catalog`);
  assert.deepEqual(southeastCategories.map((c) => c.id), ['crawl', 'drainage', 'floor', 'foundation', 'basement']);
  // Sample prices: a 1,200 sq ft vapor barrier ($2–3) plus 80 ft of French drain ($45–65).
  const { low, high } = priceEstimate([{ id: 'vapor-barrier', qty: 1200, variant: 0 }, { id: 'french-drain', qty: 80, variant: 0 }]);
  assert.deepEqual([low, high], [6000, 8800]);
});

test("the client-only extras never show on Daybreak's own estimator", () => {
  const listed = new Set(categories.flatMap((c) => c.items.map((i) => i.id)));
  for (const id of ['crawl-cleanout', 'vapor-barrier', 'french-drain']) {
    assert.ok(!listed.has(id), `${id} stays out of the /estimator catalog`);
    assert.equal(itemsById[id].category, 'extra');
  }
  assert.ok(readPicks([{ id: 'french-drain', qty: 40, variant: 0 }]), 'the server can still price them');
});

test('no siding or concrete leveling, which SECC does not sell', () => {
  const ids = Object.keys(southeastItems);
  for (const gone of ['siding-repair', 'siding-replace', 'trim-soffit', 'flashing', 'slab-lift', 'joint-seal']) assert.ok(!ids.includes(gone));
  assert.deepEqual(southeastAreas.map((a) => a.id), ['crawl', 'framing', 'foundation', 'basement']);
});

test('hotspots keep their photo positions and point at SECC repairs', () => {
  for (const a of southeastAreas) {
    const base = areas.find((x) => x.id === a.id);
    assert.equal(a.hotspots.length, base.hotspots.length);
    a.hotspots.forEach((h, i) => {
      assert.equal(h.x, base.hotspots[i].x);
      assert.equal(h.y, base.hotspots[i].y);
      assert.ok(southeastItems[h.item], `${a.id} hotspot ${i + 1} → ${h.item}`);
    });
    assert.ok(southeastScenes[a.id].src.startsWith('/images/estimator_pics/'));
  }
});

test('the PDF builds with the logo, and without it', async () => {
  const input = {
    name: 'Alex Morgan', zip: '30084', phone: '(678) 555-0142', email: 'alex@example.com', reference: 'SE-261107-ABC123',
    low: 6000, high: 8800,
    lines: [{ fix: 'Vapor barrier', size: '1,200 sq ft', low: 2400, high: 3600 }],
  };
  const logo = require('node:fs').readFileSync(path.join(root, 'public/demo/southeast/logo.png'));
  // The server uses the built-in copy; it must be the same file as the page's.
  const { southeastLogoPng } = require('../src/lib/demos/southeast-logo.ts');
  assert.ok(Buffer.from(southeastLogoPng, 'base64').equals(logo));
  for (const extra of [{ logo: new Uint8Array(Buffer.from(southeastLogoPng, 'base64')) }, {}]) {
    const doc = await PDFDocument.load(await createSoutheastPdf({ ...input, ...extra }));
    assert.equal(doc.getPageCount(), 1);
    assert.match(doc.getSubject() ?? '', /concept demo/);
  }
});

test('the SECC email carries the range and escapes what the visitor typed', () => {
  const { southeastEmail } = require('../src/lib/server/southeast-email.ts');
  const mail = southeastEmail({
    name: 'Alex <b>Morgan</b>', zip: '30084', reference: 'SE-261107-ABC123', date: new Date('2026-11-07T12:00:00Z'),
    low: 6000, high: 8800, lines: [{ fix: 'Vapor barrier', size: '1,200 sq ft', low: 2400, high: 3600 }],
  });
  assert.equal(mail.subject, 'Your crawl space repair estimate: $6,000 – $8,800');
  assert.ok(!mail.html.includes('<b>Morgan'));
  assert.ok(mail.html.includes('Alex'));
  assert.ok(mail.text.includes('SE-261107-ABC123'));
  assert.ok(!/homespec/i.test(mail.html + mail.text));
  const odd = southeastEmail({ zip: '30084', reference: 'SE-1', date: new Date(), low: 1, high: 2, lines: [], name: 'evil.example/x Smith' });
  assert.ok(odd.text.startsWith('Hi there,'));
});
