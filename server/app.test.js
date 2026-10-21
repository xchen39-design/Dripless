const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createApp, safeUrl } = require('./index');
const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9S8AAAAASUVORK5CYII=';
async function request(t, options, body) {
  const server = createApp(options).listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/outfit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  return { status: response.status, data: await response.json() };
}
function client({ bad = false, imageFails = false } = {}) {
  let calls = 0;
  return { chat: { completions: { create: async () => ({ choices: [{ message: { content: bad ? '{}' : JSON.stringify(calls++ === 0 ? { brand: 'Unknown', itemType: 'Shirt', color: 'White', style: 'Casual' } : { suggestions: Array.from({ length: 3 }, () => ({ item: 'Trousers', color: 'Navy', style: 'Casual' })) }) } }] }) } }, images: { generate: async () => { if (imageFails) throw new Error('quota'); return { data: [{ b64_json: 'aGVsbG8=' }] }; } } };
}
test('demo is explicit and has no fabricated products', async t => {
  const result = await request(t, { env: { DEMO_MODE: 'true' }, fetchImpl: () => { throw new Error('Must not call network'); } }, { image });
  assert.equal(result.status, 200); assert.equal(result.data.demo, true); assert.equal(result.data.suggestions.length, 3); assert.equal(result.data.outfitImage, null); assert.ok(result.data.suggestions.every(s => s.products.length === 0));
});
test('rejects invalid input and missing credentials', async t => {
  assert.equal((await request(t, { env: {} }, { image: 'https://example.com/image.png' })).status, 400);
  assert.equal((await request(t, { env: {} }, { image })).status, 503);
});
test('rejects malformed model output', async t => assert.equal((await request(t, { env: {}, client: client({ bad: true }) }, { image })).status, 502));
test('live pipeline preserves products and base64 image; rejects unsafe URLs', async t => {
  const result = await request(t, { env: { SEARCHAPI_KEY: 'test' }, client: client(), fetchImpl: async url => { assert.match(url, /secondhand/); return { ok: true, json: async () => ({ shopping_results: [{ title: 'Pre-owned trousers', price: '$20', link: 'https://example.com/item' }, { title: 'Unsafe', link: 'javascript:alert(1)' }] }) }; } }, { image, gender: 'women', season: 'winter' });
  assert.equal(result.status, 200); assert.equal(result.data.suggestions[0].products.length, 1); assert.match(result.data.outfitImage, /^data:image\/png;base64,/); assert.equal(result.data.demo, false);
});
test('provider failures retain suggestions and visible warnings', async t => {
  const result = await request(t, { env: { SEARCHAPI_KEY: 'test' }, client: client({ imageFails: true }), fetchImpl: async () => ({ ok: false }) }, { image });
  assert.equal(result.status, 200); assert.equal(result.data.suggestions.length, 3); assert.equal(result.data.warnings.length, 4); assert.equal(result.data.outfitImage, null);
});
test('missing search key is explicitly reported', async t => {
  const result = await request(t, { env: {}, client: client() }, { image });
  assert.match(result.data.warnings[0], /SEARCHAPI_KEY/);
});
test('safe links allow only http and https', () => { assert.equal(safeUrl('javascript:alert(1)'), null); assert.equal(safeUrl('data:text/html,x'), null); assert.equal(safeUrl('https://example.com'), 'https://example.com/'); });
