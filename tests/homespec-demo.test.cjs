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

const { itemsById, areas, priceEstimate } = require('../src/lib/estimator.ts');
const { homespecCategories, homespecItems, homespecAreas, homespecScenes } = require('../src/lib/demos/homespec.ts');
const { createHomeSpecPdf } = require('../src/lib/demos/homespec-pdf.ts');
const { PDFDocument } = require('pdf-lib');

test('every HomeSpec repair is priced by the shared engine', () => {
  for (const id of Object.keys(homespecItems)) assert.ok(itemsById[id], `${id} is in the shared catalog`);
  assert.deepEqual(homespecCategories.map((c) => c.id), ['waterproofing', 'crawl', 'foundation', 'concrete']);
  // Same sample prices as Daybreak's own estimator: a pump plus six slab sections.
  assert.equal(priceEstimate([{ id: 'sump-pump', qty: 1, variant: 0 }, { id: 'slab-lift', qty: 6, variant: 0 }]).low, 6700);
});

test('no siding or framing, which HomeSpec does not sell', () => {
  const ids = Object.keys(homespecItems);
  for (const gone of ['siding-repair', 'siding-replace', 'sister-joists', 'girder', 'rim-joist']) assert.ok(!ids.includes(gone));
  assert.deepEqual(homespecAreas.map((a) => a.id), ['foundation', 'basement', 'crawl', 'driveway']);
});

test('hotspots keep their photo positions and point at HomeSpec repairs', () => {
  for (const a of homespecAreas) {
    const base = areas.find((x) => x.id === a.id);
    assert.equal(a.hotspots.length, base.hotspots.length);
    a.hotspots.forEach((h, i) => {
      assert.equal(h.x, base.hotspots[i].x);
      assert.equal(h.y, base.hotspots[i].y);
      assert.ok(homespecItems[h.item], `${a.id} hotspot ${i + 1} → ${h.item}`);
    });
    assert.ok(homespecScenes[a.id].src.startsWith('/images/estimator_pics/'));
  }
});

test('the PDF builds with the logo, and without it', async () => {
  const input = {
    name: 'Alex Morgan', zip: '48197', phone: '(734) 555-0142', email: 'alex@example.com', reference: 'HS-261107-ABC123',
    low: 6700, high: 8200,
    lines: [{ fix: 'Sump pump system', size: 'Complete install', low: 1550, high: 1850 }],
  };
  const logo = require('node:fs').readFileSync(path.join(root, 'public/demo/homespec/logo.png'));
  // The server uses the built-in copy; it must be the same file as the page's.
  const { homespecLogoPng } = require('../src/lib/demos/homespec-logo.ts');
  assert.ok(Buffer.from(homespecLogoPng, 'base64').equals(logo));
  for (const extra of [{ logo: new Uint8Array(Buffer.from(homespecLogoPng, 'base64')) }, {}]) {
    const doc = await PDFDocument.load(await createHomeSpecPdf({ ...input, ...extra }));
    assert.equal(doc.getPageCount(), 1);
    assert.match(doc.getSubject() ?? '', /concept demo/);
  }
});

test('the HomeSpec email carries the range and escapes what the visitor typed', () => {
  const { homespecEmail } = require('../src/lib/server/homespec-email.ts');
  const mail = homespecEmail({
    name: 'Alex <b>Morgan</b>', zip: '48197', reference: 'HS-261107-ABC123', date: new Date('2026-11-07T12:00:00Z'),
    low: 6700, high: 8200, lines: [{ fix: 'Sump pump system', size: 'Complete install', low: 1550, high: 1850 }],
  });
  assert.equal(mail.subject, 'Your HomeSpec repair estimate: $6,700 – $8,200');
  assert.ok(!mail.html.includes('<b>Morgan'));
  assert.ok(mail.html.includes('Alex'));
  assert.ok(mail.text.includes('HS-261107-ABC123'));
  // Anything but a plain first name is greeted as "there".
  const odd = homespecEmail({ ...{ zip: '48197', reference: 'HS-1', date: new Date(), low: 1, high: 2, lines: [] }, name: 'evil.example/x Smith' });
  assert.ok(odd.text.startsWith('Hi there,'));
});

test('photos: only JPEGs, only for picked repairs, within the limits', () => {
  const { readPhotos } = require('../src/lib/server/lead-photos.ts');
  const { PHOTO_MAX_BYTES, PHOTO_BODY_BYTES } = require('../src/lib/lead-photos.ts');
  const jpeg = (n = 200) => Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(n)]).toString('base64');
  const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47]), Buffer.alloc(200)]).toString('base64');
  const picked = ['sump-pump', 'slab-lift'];

  assert.deepEqual(readPhotos(undefined, picked), []);
  const ok = readPhotos([{ item: 'sump-pump', data: jpeg() }, { item: 'slab-lift', data: jpeg() }], picked);
  assert.equal(ok.length, 2);
  assert.equal(ok[0].item, 'sump-pump');
  assert.equal(ok[0].bytes[0], 0xff);

  assert.equal(readPhotos([{ item: 'sump-pump', data: png }], picked), null, 'not a JPEG');
  assert.equal(readPhotos([{ item: 'wall-anchors', data: jpeg() }], picked), null, 'a repair that was not picked');
  assert.equal(readPhotos([{ item: 'sump-pump', data: 'not base64!' + jpeg() }], picked), null);
  assert.equal(readPhotos([{ item: 'sump-pump', data: jpeg(PHOTO_MAX_BYTES) }], picked), null, 'too large');
  assert.equal(readPhotos(Array(4).fill({ item: 'sump-pump', data: jpeg() }), picked), null, 'four on one repair');
  assert.equal(readPhotos([...Array(3).fill({ item: 'sump-pump', data: jpeg() }), ...Array(4).fill({ item: 'slab-lift', data: jpeg() })], picked), null, 'seven in all');
  assert.equal(readPhotos({ item: 'sump-pump' }, picked), null);
  // Six photos at the largest still fit under Netlify's 6 MB function payload.
  assert.ok(PHOTO_BODY_BYTES < 6_000_000);
});

test('the PDF puts their photos on a second page, and skips one it cannot read', async () => {
  const photo = require('node:fs').readFileSync(path.join(__dirname, 'fixture-photo.jpg'));
  const base = {
    name: 'Alex Morgan', zip: '48197', phone: '(734) 555-0142', email: 'alex@example.com', reference: 'HS-261117-ABC123',
    low: 1600, high: 1900, lines: [{ fix: 'Sump pump system', size: 'Complete install', low: 1550, high: 1850 }],
  };
  const two = await PDFDocument.load(await createHomeSpecPdf({ ...base, photos: [{ fix: 'Sump pump system', bytes: photo }] }));
  assert.equal(two.getPageCount(), 2);
  // A "JPEG" that only has the right first bytes is left out, not fatal.
  const junk = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(300)]);
  const mixed = await PDFDocument.load(await createHomeSpecPdf({ ...base, photos: [{ fix: 'A', bytes: junk }, { fix: 'B', bytes: photo }] }));
  assert.equal(mixed.getPageCount(), 2);
});

test('booking tokens: only the server can make one, and it names its own row', () => {
  const { issueBookingToken, readBookingToken } = require('../src/lib/server/form-token.ts');
  const t = issueBookingToken('recAbc123', 'HS-261117-ABC123');
  assert.deepEqual(readBookingToken(t), { recordId: 'recAbc123', reference: 'HS-261117-ABC123' });
  assert.deepEqual(readBookingToken(issueBookingToken(null, 'HS-1')), { recordId: null, reference: 'HS-1' });
  // Another row with the same signature, or a tampered one, is refused.
  const [, ref, at, sig] = t.split('.');
  assert.equal(readBookingToken(['recOther999', ref, at, sig].join('.')), null);
  assert.equal(readBookingToken(t.slice(0, -2) + 'xx'), null);
  assert.equal(readBookingToken('nope'), null);
  // A form token is not a booking token.
  const { issueFormToken } = require('../src/lib/server/form-token.ts');
  assert.equal(readBookingToken(issueFormToken()), null);
});
