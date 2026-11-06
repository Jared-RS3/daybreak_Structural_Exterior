/* eslint-disable @typescript-eslint/no-require-imports -- Node test loader transpiles local TypeScript without another dependency. */
const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...rest) {
  return resolve.call(this, request.startsWith('@/') ? path.join(root, 'src', request.slice(2)) : request, parent, ...rest);
};
require.extensions['.ts'] = (module, filename) => {
  const source = require('node:fs').readFileSync(filename, 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  module._compile(code, filename);
};

const { categories, areas, priceEstimate } = require('../src/lib/estimator.ts');
const { daybreakEstimatorConfig, homespecEstimatorConfig: home, getDemoContractor } = require('../src/lib/contractors/config.ts');
const { assessDemo, validateAnswers, visibleQuestions } = require('../src/lib/contractors/assessment.ts');
const { createDemoPdf } = require('../src/lib/contractors/demo-pdf.ts');
const { PDFDocument } = require('pdf-lib');
const pick = (id, qty = 1) => ({ id, qty, variant: 0 });

// The Daybreak production engine keeps its original catalog and prices.
test('default catalog and pricing remain unchanged', () => {
  assert.equal(daybreakEstimatorConfig.mode, 'production');
  assert.equal(daybreakEstimatorConfig.categories, categories);
  assert.equal(daybreakEstimatorConfig.areas, areas);
  assert.deepEqual(priceEstimate([pick('slab-lift', 3)]).low, 2600);
});

test('allowlist resolves only configured demos and isolates supported services', () => {
  assert.equal(getDemoContractor('homespec'), home);
  assert.equal(getDemoContractor('constructor'), null);
  assert.equal(getDemoContractor('daybreak'), null);
  assert.equal(getDemoContractor('../homespec'), null);
  assert.deepEqual(home.categories.map((c) => c.id), ['waterproofing', 'foundation', 'crawl', 'concrete', 'concrete-repair']);
  const ids = new Set(home.categories.flatMap((c) => c.items.map((i) => i.id)));
  assert(ids.has('support-posts'));
  assert(!ids.has('sister-joists'));
  assert(!ids.has('siding-repair'));
  assert(home.areas.every((a) => a.hotspots.every((h) => ids.has(h.item))));
  assert(!home.areas.some((a) => a.id === 'siding' || a.id === 'framing'));
  assert(categories.some((c) => c.id === 'siding'));
});

test('questions respond to answers and validate approximate measurements', () => {
  const questions = home.questions['interior-drain'];
  assert(!visibleQuestions(questions, {}).some((q) => q.id === 'depth'));
  assert(visibleQuestions(questions, { standing: 'yes' }).some((q) => q.id === 'depth'));
  const answers = { 'interior-drain': { when: 'rain', standing: 'yes', depth: 2 } };
  assert.equal(validateAnswers(home, [pick('interior-drain', 30)], answers), null);
  assert.match(validateAnswers(home, [pick('interior-drain', 30)], {}), /When does water appear/i);
  assert.match(validateAnswers(home, [pick('interior-drain', 30)], { 'interior-drain': { when: 'unlisted', standing: 'no' } }), /When does water appear/i);
  assert.match(validateAnswers(home, [pick('interior-drain', 30)], { 'interior-drain': { ...answers['interior-drain'], depth: 100 } }), /deepest water/i);
  assert.match(validateAnswers(home, [pick('interior-drain', 0)], answers), /size/i);
  assert.match(validateAnswers(home, [pick('slab-lift', 19)], { 'slab-lift': { surface: 'driveway', trip: 'no' } }), /size/i);
  assert.match(validateAnswers(home, [pick('siding-repair')], {}), /size|concern/i);
});

test('illustrative concrete range uses original sample engine, not contractor rates', () => {
  const answers = { 'slab-lift': { surface: 'driveway', trip: 'yes' } };
  const result = assessDemo(home, [pick('slab-lift', 3)], answers);
  assert.equal(result.status, 'range');
  assert.equal(result.low, priceEstimate([pick('slab-lift', 3)]).low);
  assert.equal(result.high, priceEstimate([pick('slab-lift', 3)]).high);
  assert.match(home.pricing.disclaimer, /not an official HomeSpec quotation/);
});

test('structural and uncertain concrete concerns require inspection', () => {
  const structural = assessDemo(home, [pick('wall-anchors', 3)], { 'wall-anchors': { bowing: 'yes' } });
  assert.equal(structural.status, 'inspection');
  assert.equal(structural.urgency, 'prompt inspection');
  assert.equal(structural.low, 0);
  const mixed = assessDemo(home, [pick('slab-lift', 3), pick('wall-anchors', 3)], {
    'slab-lift': { surface: 'driveway', trip: 'yes' }, 'wall-anchors': { bowing: 'yes' },
  });
  assert.equal(mixed.status, 'partial');
  assert(mixed.low > 0);
  const settled = assessDemo(home, [pick('joint-seal', 20)], { 'joint-seal': { surface: 'walk', settled: 'yes' } });
  assert.equal(settled.status, 'inspection');
});

test('demo configuration cannot enable operational side effects', () => {
  assert.equal(home.mode, 'demo');
  assert.equal(home.lead.sampleOnly, true);
  assert.equal(home.features.analytics, false);
  assert.equal(home.features.photos, false);
  assert.deepEqual(home.notifications, { email: false, sms: false, crm: false, webhooks: false, booking: false });
});

test('sample PDF carries its concept marker and can be read', async () => {
  const assessment = assessDemo(home, [pick('slab-lift', 3)], { 'slab-lift': { surface: 'driveway', trip: 'yes' } });
  const bytes = await createDemoPdf(home, assessment, { name: 'Alex Morgan', email: 'alex@example.com', phone: '(555) 010-0142', city: 'Ypsilanti, MI', zip: '48197' });
  const pdf = await PDFDocument.load(bytes);
  assert.equal(pdf.getTitle(), home.pdf.watermark);
  assert(pdf.getPageCount() >= 1);
});
