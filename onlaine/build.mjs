import { gallery, showcaseDemo } from './showcase.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
import { services, demos, faq } from './content.mjs';

const origin = 'https://onlaine.cloud';
const title = 'Onlaine | Desarrollo web y automatización en Bogotá';
const description = 'Diseñamos páginas web, soluciones de inteligencia artificial y automatizaciones que ayudan a tu negocio a crecer, conseguir más clientes y operar de manera inteligente.';
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const navigation = [['Inicio','inicio'],['Servicios','servicios'],['Demostraciones','demostraciones'],['Nuestro proceso','proceso'],['Preguntas frecuentes','preguntas'],['Contacto','contacto']];
const demoFonts = {
  odontologia: 'Instrument+Sans:wght@400;600;700&family=Instrument+Serif',
  restaurante: 'Barlow+Condensed:wght@600;700&family=Source+Sans+3:wght@400;600;700',
  veterinaria: 'Bricolage+Grotesque:wght@600;700&family=DM+Sans:wght@400;600;700',
  estetica: 'Cormorant+Garamond:wght@500;600;700&family=Hedvig+Letters+Sans',
  inmobiliaria: 'Instrument+Sans:wght@400;600;700&family=Montagu+Slab:wght@600;700',
  limpieza: 'Archivo+Black&family=Public+Sans:wght@400;600;700',
  automotriz: 'Barlow+Semi+Condensed:wght@600;700&family=IBM+Plex+Sans:wght@400;600;700',
};
const layout = (name, path, body, demo = '') => `<!doctype html><html lang="es-CO"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(name)}</title><meta name="description" content="${description}">${demo ? '<meta name="robots" content="noindex,nofollow">' : `<link rel="canonical" href="${origin}${path}"><meta property="og:title" content="${escape(name)}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:url" content="${origin}${path}">`}<link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/showcase.css">${demo ? `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${demoFonts[demo].replaceAll('&','&amp;')}&amp;display=swap">` : ''}${demo ? '<link rel="stylesheet" href="/demo-story.css"><script src="/demo-story.js" defer></script><link rel="stylesheet" href="/brand-pages.css"><script src="/brand-pages.js" defer></script><link rel="stylesheet" href="/demo-depth.css"><script src="/demo-depth.js" defer></script><link rel="stylesheet" href="/signature-scenes.css"><script src="/signature-scenes.js" defer></script>' : ''}<script src="/site.js" defer></script><script src="/showcase.js" defer></script></head><body><a class="skip" href="#contenido">Saltar al contenido</a><header class="nav wrap"><a class="logo" href="${demo ? origin : '/'}">onlaine<span>.</span></a>${demo ? '<a href="/#demostraciones">Ver todas las demostraciones</a>' : `<nav aria-label="Principal">${navigation.map(([label,id]) => `<a href="/#${id}">${label}</a>`).join('')}</nav><a class="button" href="/#contacto">Solicitar demo gratis</a>`}</header><main id="contenido">${body}</main><footer class="wrap"><a class="logo" href="/">onlaine<span>.</span></a><a href="${demo ? origin : ''}/privacidad">Privacidad</a></footer></body></html>`;
const field = (label, name, type, attributes = '') => `<label>${label}<input name="${name}" type="${type}" ${attributes}></label>`;
const options = (values) => values.map((value) => `<option>${escape(value)}</option>`).join('');
const home = `<section id="inicio" class="hero wrap"><div><p class="eyebrow">Desarrollo web · Automatización · IA</p><h1>Transformamos tu negocio con tecnología.</h1><p class="intro">${description}</p><div class="actions"><a class="button" href="#contacto">Solicita tu demo gratuita</a><a class="secondary" href="#servicios">Explora nuestros servicios →</a></div></div><div class="visual" aria-hidden="true"><span>01 / CAPTACIÓN DIGITAL</span><div>Tu cliente <b>↗</b></div><div>Tu sitio <b>↘</b></div><div>Tu operación <b>✓</b></div></div></section>
<section id="servicios" class="wrap section"><p class="eyebrow">Servicios</p><h2>Tecnología que resuelve trabajo real.</h2><dl class="services">${services.map(([label, detail]) => `<div><dt>${label}</dt><dd>${detail}</dd></div>`).join('')}</dl></section>
<section id="demostraciones" class="wrap section"><p class="eyebrow">Proyectos demostrativos</p><h2>Explora un sitio para tu sector.</h2><p>Ejemplos interactivos con negocios ficticios.</p><ul class="demo-gallery">${gallery(demos)}</ul></section>
<section id="proceso" class="wrap section"><h2>Nuestro proceso</h2><ol class="process"><li>Conocemos tu negocio.</li><li>Diseñamos una demostración gratuita.</li><li>Personalizamos la solución.</li><li>Desarrollamos y publicamos.</li><li>Acompañamos el crecimiento de tu negocio.</li></ol><p>Mejora tu presencia digital, abre vías de contacto por WhatsApp, presenta tu negocio las 24 horas y automatiza tareas con una solución que pueda crecer contigo.</p></section>
<section id="preguntas" class="wrap section"><h2>Preguntas frecuentes</h2>${faq.map(([q,a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</section>
<section id="contacto" class="wrap section contact"><div><p class="eyebrow">Bogotá · Colombia</p><h2>Hablemos de tu negocio.</h2><p>Cuéntanos qué necesitas para preparar tu demostración gratuita.</p></div><form id="lead" action="/api/leads" method="post">
<p id="form-status" role="status"></p><fieldset disabled><legend>Solicitar una demostración</legend><div class="fields">
${field('Nombre','name','text','required maxlength="100" autocomplete="name"')}
${field('Nombre del negocio','business','text','required maxlength="150" autocomplete="organization"')}
${field('Correo electrónico','email','email','required maxlength="254" autocomplete="email"')}
${field('WhatsApp','whatsapp','tel','required maxlength="24" autocomplete="tel"')}
<label>Sector comercial<select required name="sector"><option value="">Selecciona</option>${options([...demos.map(d => d.name), 'Otro'])}</select></label>
${field('Página web actual (opcional)','website','url','maxlength="300" autocomplete="url"')}
<label>Servicio de interés<select required name="service"><option value="">Selecciona</option>${options(services.map(([name]) => name))}</select></label>
<label>Descripción de la necesidad<textarea name="description" required maxlength="2000" rows="4"></textarea></label></div>
<label class="consent"><input type="checkbox" name="consent" value="1" required><span>Autorizo el tratamiento de mis datos para gestionar esta solicitud según la <a href="/privacidad">política de privacidad</a>.</span></label><button class="button">Solicitar demostración</button></fieldset><noscript>Activa JavaScript para comprobar si está disponible el formulario.</noscript></form></section>
<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'Onlaine',url:origin,areaServed:'Colombia',description})}</script>`;
await mkdir('dist/demostraciones', {recursive:true});
await Promise.all([
  writeFile('dist/index.html', layout(title, '/', home)),
  writeFile('dist/privacidad.html', layout('Privacidad | Onlaine','/privacidad',`<article class="wrap section"><h1>Privacidad</h1><p>El formulario solicita nombre, negocio, correo, WhatsApp, sector, sitio web si lo indicas y descripción del proyecto. Si el canal está habilitado, Onlaine remite esos datos al proveedor de captación configurado para evaluar la solicitud y responderte.</p><p>Si recibes una respuesta de Onlaine, puedes usar ese canal para consultar, corregir o pedir la eliminación de tus datos. Nunca incluyas contraseñas ni información sensible en la descripción.</p></article>`)),
  writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`),
  writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url><url><loc>${origin}/privacidad</loc></url></urlset>`),
  ...['styles.css','site.js','showcase.css','showcase.js','demo-story.css','demo-story.js','brand-pages.css','brand-pages.js','demo-depth.css','demo-depth.js','signature-scenes.css','signature-scenes.js'].map(async (name) => {const {copyFile} = await import('node:fs/promises'); await copyFile(name, `dist/${name}`);}),
  ...demos.map(demo => writeFile(`dist/demostraciones/${demo.slug}.html`, layout(`${demo.name} | Demostración Onlaine`, '', showcaseDemo(demo), demo.slug))),
]);
