import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validate } from '../api/leads.js';
import { demos, services } from '../content.mjs';

test('lead validation requires consent and rejects unexpected services and protocols', () => {
  const body = {name:'Prueba',business:'Prueba',email:'prueba@example.com',whatsapp:'+57 300 000 0000',sector:demos[0].name,service:services[0][0],description:'Prueba',consent:'1'};
  assert.equal(validate(body).consentVersion, '1');
  assert.equal(validate({...body, consent:''}), null);
  assert.equal(validate({...body, website:'javascript:alert(1)'}), null);
  assert.equal(validate({...body, service:'desconocido'}), null);
});

test('all seven demos are built and excluded from indexing', async () => {
  await import('../build.mjs');
  assert.equal(demos.length, 7);
  const sitemap = await readFile('dist/sitemap.xml','utf8');
  for (const demo of demos) {
    const html = await readFile('dist/demostraciones/' + demo.slug + '.html','utf8');
    assert.match(html, /noindex,nofollow/);
    assert.match(html, /data-choice/);
    assert.equal((html.match(/class="show-slide"/g) ?? []).length, ['odontologia','automotriz'].includes(demo.slug) ? 4 : 3);
    assert.match(html, /brand-copy/);
    assert.match(html, /id="visita"/);
    assert.match(html, /data-prev/);
    assert.match(html, /data-next/);
    assert.match(html, /class="show-content show-faq"/);
    assert.ok(!sitemap.includes(demo.slug));
  }
});

test('each published photograph has a distinct source across the index and seven demos', async () => {
  await import('../build.mjs');
  const names = ['index', ...demos.map(({slug}) => 'demostraciones/' + slug)];
  const seen = new Set();
  for (const name of names) {
    const html = await readFile('dist/' + name + '.html', 'utf8');
    for (const [,photo] of html.matchAll(/<img\b[^>]*\bsrc="https:\/\/images\.unsplash\.com\/(photo-[\w-]+)/g)) {
      assert.ok(!seen.has(photo), 'Repeated photograph ' + photo + ' in ' + name);
      seen.add(photo);
    }
  }
  assert.ok(seen.size >= 40);
});
