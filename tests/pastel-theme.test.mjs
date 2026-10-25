import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { createServer } from 'vite';
import config from '../tailwind.config.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const source = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
const colors = config.theme.extend.colors;
const themeSource = readFileSync(new URL('../src/data/theme.ts', import.meta.url), 'utf8');
const compiled = await postcss([tailwindcss({ ...config, content: [{ raw: `${themeSource} text-white text-white/60 bg-stone-950 bg-stone-900 bg-amber-400 hover:bg-amber-300 photo-surface pastel-panel`, extension: 'html' }] })]).process(source, { from: undefined });
const server = await createServer({ root, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
let renderPage;
let getRatingColor;
let allCountries;
let getRegionColor;
let getMonthColor;
let getSeasonColor;
try {
  ({ renderPage } = await server.ssrLoadModule('/src/entry-server.tsx'));
  ({ getRatingColor, allCountries } = await server.ssrLoadModule('/src/data/index.ts'));
  ({ getRegionColor, getMonthColor, getSeasonColor } = await server.ssrLoadModule('/src/data/theme.ts'));
} finally {
  await server.close();
}

function declaration(selector, property) {
  let result;
  compiled.root.walkRules(rule => {
    if (rule.selectors.includes(selector)) rule.walkDecls(property, decl => { result = decl.value; });
  });
  return result;
}

function luminance(hex) {
  const rgb = hex.match(/[a-f\d]{2}/gi).map(value => parseInt(value, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test('compiled utilities use ivory surfaces and context-aware foregrounds', () => {
  assert.equal(declaration('.bg-stone-950', 'background-color'), 'rgb(var(--theme-canvas))');
  assert.equal(declaration('.bg-stone-900', 'background-color'), 'rgb(var(--theme-card))');
  assert.equal(declaration('.text-white', 'color'), 'rgb(var(--theme-ink))');
  assert.equal(declaration('.photo-surface', '--theme-ink'), '253 250 245');
  assert.equal(declaration(':root', '--theme-ink'), '45 38 27');
  assert.equal(declaration('.bg-amber-400', 'background-color'), colors['dusty-rose']);
});

test('normal text and pastel-panel secondary text retain readable contrast', () => {
  for (const background of Object.entries(colors).filter(([name]) => name !== 'cocoa' && !name.endsWith('-accent')).map(([, color]) => color)) {
    assert.ok(contrast(colors.cocoa, background) >= 4.5, background);
    assert.ok(contrast('#524433', background) >= 4.5, `Secondary text on ${background}`);
  }
  assert.ok(contrast('#6B5E4E', colors.ivory) >= 4.5);
  assert.ok(contrast('#894840', colors.ivory) >= 4.5);
  assert.ok(contrast(colors.cocoa, colors['dusty-rose']) >= 4.5);
});

test('all five pastel and accent pairs match the exact reference', () => {
  const pairs = {
    'dusty-rose': ['#E9C8C2', '#BA7C74'],
    sage: ['#BED0BF', '#617E63'],
    periwinkle: ['#C5CEDF', '#5872A0'],
    gold: ['#D8C08A', '#9A7A32'],
    mauve: ['#CBBED6', '#7A60A0'],
  };
  for (const [name, [pastel, accent]] of Object.entries(pairs)) {
    assert.equal(colors[name], pastel);
    assert.equal(colors[`${name}-accent`], accent);
    assert.ok(declaration(`.bg-${name}`, 'background-color'), name);
    assert.ok(declaration(`.border-${name}-accent`, 'border-color'), `${name} accent`);
  }
});

test('region mappings are shared and neutral for unassigned regions', () => {
  for (const [region, color] of Object.entries({ Europe: 'dusty-rose', Asia: 'sage', 'The Americas': 'periwinkle', 'North America': 'periwinkle', Africa: 'gold', 'Middle East': 'mauve', 'Oceania & Pacific': 'sand', Unknown: 'sand' })) {
    assert.ok(getRegionColor(region).includes(`bg-${color}`), region);
    assert.ok(getRegionColor(region).includes('text-cocoa'), region);
  }
  assert.equal(getRegionColor(' europe '), getRegionColor('Europe'));
});

test('calendar colours follow seasons without changing local weather semantics', () => {
  const monthColors = ['periwinkle', 'periwinkle', 'sage', 'sage', 'sage', 'gold', 'gold', 'gold', 'dusty-rose', 'dusty-rose', 'dusty-rose', 'periwinkle'];
  monthColors.forEach((color, index) => assert.ok(getMonthColor(index + 1).includes(`bg-${color}`)));
  for (const invalid of [0, 13, 1.5, NaN]) assert.ok(getMonthColor(invalid).includes('bg-sand'));
  for (const [season, color] of Object.entries({ Spring: 'sage', Summer: 'gold', Autumn: 'dusty-rose', Winter: 'periwinkle', Aurora: 'periwinkle', 'Northern lights': 'periwinkle', 'Year-round': 'mauve', 'All year': 'mauve', 'Spring & Autumn': 'sand', 'Wet season': 'sand' })) {
    assert.ok(getSeasonColor(season).includes(`bg-${color}`), season);
  }
});

test('rendered guides use regional and seasonal surface colours', () => {
  for (const [slug, region] of Object.entries({ japan: 'Asia', france: 'Europe', kenya: 'Africa', usa: 'The Americas', jordan: 'Middle East' })) {
    assert.ok(renderPage(`/country/${slug}`).includes(getRegionColor(region)), slug);
  }
  assert.ok(renderPage('/month/january').includes(getMonthColor(1)));
  assert.ok(renderPage('/month/april').includes(getMonthColor(4)));
  assert.match(renderPage('/phenomena/northern-lights'), /bg-periwinkle/);
});

test('Japan cover features the credited Itsukushima shrine instead of turbines', () => {
  const japan = allCountries.find(country => country.id === 'japan');
  assert.equal(japan.heroImage, '/images/countries/japan-6.jpg');
  assert.match(japan.gallery[0].alt, /Itsukushima/);
  assert.equal(japan.gallery[0].photographer, 'JordyMeow');
  assert.equal(japan.gallery[0].license, 'CC BY-SA 3.0');
  assert.equal(new Set(japan.gallery.map(image => image.url)).size, 6);
  const html = renderPage('/country/japan');
  assert.match(html, /Itsukushima_Gate\.jpg/);
  assert.match(html, /commons\.wikimedia\.org\/wiki\/File:Itsukushima_Gate\.jpg/);
  assert.ok(html.indexOf('/images/countries/japan-6.jpg') < html.indexOf('/images/countries/japan-1.jpg'));
});

test('seasonal ratings stay distinct and use the reference palette', () => {
  assert.deepEqual(['best', 'good', 'fair', 'off'].map(getRatingColor), [
    'bg-sage', 'bg-gold', 'bg-dusty-rose', 'bg-sand',
  ]);
});

test('homepage renders themed photographs with genuine subjects and credit links', () => {
  const html = renderPage('/');
  assert.match(html, /Travel inspiration in seasonal colours/);
  assert.match(html, /bg-dusty-rose/);
  assert.match(html, /bg-gold/);
  assert.match(html, /bg-periwinkle/);
  assert.match(html, /india-3\.jpg/);
  assert.match(html, /Qutb Minar/);
  assert.match(html, /iceland-1\.jpg/);
  assert.match(html, /commons\.wikimedia\.org\/wiki\/File:Close_view_and_art_work_of_Qutb_Minar\.jpg/);
  assert.match(html, /photo-surface bg-cocoa/);
  assert.match(html, /href="\/country\/japan"/);
  assert.match(html, /href="\/country\/india"/);
  assert.match(html, /href="\/country\/iceland"/);
});
