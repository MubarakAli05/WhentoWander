import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

// Use the existing TypeScript dependency so these data tests need no extra runner.
const modules = new Map();
function loadData(name) {
  if (modules.has(name)) return modules.get(name);
  const source = readFileSync(new URL(`./${name}.ts`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  const module = { exports: {} };
  const execute = new Function('require', 'module', 'exports', outputText);
  execute(specifier => {
    assert.match(specifier, /^\.\/[a-zA-Z0-9]+$/);
    return loadData(specifier.slice(2));
  }, module, module.exports);
  modules.set(name, module.exports);
  return module.exports;
}

const { requestedCountries } = loadData('countryCatalog');
const { CONTINENTS } = loadData('types');
const additional = loadData('countriesAdditional').default;
const existing = ['countries', 'countries2', 'countries3', 'countries4', 'countries5']
  .flatMap(name => loadData(name).default);
const expectedNames = `Afghanistan|Albania|Algeria|Andorra|Angola|Antigua and Barbuda|Argentina|Armenia|Australia|Austria|Azerbaijan|Bahamas|Bahrain|Bangladesh|Barbados|Belarus|Belgium|Belize|Benin|Bhutan|Bolivia|Bosnia and Herzegovina|Botswana|Brazil|Brunei|Bulgaria|Burkina Faso|Burundi|Cabo Verde|Cambodia|Cameroon|Canada|Central African Republic|Chad|Chile|China|Colombia|Comoros|Democratic Republic of the Congo|Republic of the Congo|Costa Rica|Côte d'Ivoire|Croatia|Cuba|Cyprus|Czechia|Denmark|Djibouti|Dominica|Dominican Republic|Ecuador|Egypt|El Salvador|Equatorial Guinea|Eritrea|Estonia|Eswatini|Ethiopia|Fiji|Finland|France|Gabon|Gambia|Georgia|Germany|Ghana|Greece|Grenada|Guatemala|Guinea|Guinea-Bissau|Guyana|Haiti|Honduras|Hungary|Iceland|India|Indonesia|Iran|Iraq|Ireland|Israel|Italy|Jamaica|Japan|Jordan|Kazakhstan|Kenya|Kiribati|Kosovo|Kuwait|Kyrgyzstan|Laos|Latvia|Lebanon|Lesotho|Liberia|Libya|Liechtenstein|Lithuania|Luxembourg|Madagascar|Malawi|Malaysia|Maldives|Mali|Malta|Marshall Islands|Mauritania|Mauritius|Mexico|Micronesia|Moldova|Monaco|Mongolia|Montenegro|Morocco|Mozambique|Myanmar|Namibia|Nauru|Nepal|Netherlands|New Zealand|Nicaragua|Niger|Nigeria|North Macedonia|Norway|Pakistan|Palau|Panama|Papua New Guinea|Paraguay|Peru|Philippines|Poland|Portugal|Qatar|Romania|Russian Federation|Rwanda|Saint Kitts and Nevis|Saint Lucia|Saint Vincent and the Grenadines|Samoa|San Marino|Sao Tome and Principe|Saudi Arabia|Senegal|Serbia|Seychelles|Sierra Leone|Singapore|Slovakia|Slovenia|Solomon Islands|Somalia|South Africa|South Korea|South Sudan|Spain|Sri Lanka|Sudan|Suriname|Sweden|Switzerland|Syria|Taiwan|Tajikistan|Tanzania|Thailand|Timor-Leste|Togo|Tonga|Trinidad and Tobago|Tunisia|Turkey|Turkmenistan|Tuvalu|Uganda|Ukraine|United Arab Emirates|United Kingdom|United States of America|Uruguay|Uzbekistan|Vanuatu|Vatican City|Venezuela|Viet Nam|Yemen|Zambia|Zimbabwe`.split('|');

test('catalog covers exactly the requested list with unique stable IDs and article titles', () => {
  assert.equal(expectedNames.length, 194);
  assert.deepEqual(requestedCountries.map(country => country.name), expectedNames);
  assert.equal(new Set(requestedCountries.map(country => country.id)).size, 194);
  const aliases = {
    Turkey: ['turkiye', 'Turkey'], Czechia: ['czech-republic', 'Czech Republic'],
    'United States of America': ['usa', 'United States'], 'United Kingdom': ['uk', 'United Kingdom'],
    'United Arab Emirates': ['uae', 'United Arab Emirates'], 'Viet Nam': ['vietnam', 'Vietnam'],
    'Russian Federation': ['russia', 'Russia'], Micronesia: ['micronesia', 'Federated States of Micronesia'],
    "Côte d'Ivoire": ['cote-divoire', 'Ivory Coast'], 'Cabo Verde': ['cabo-verde', 'Cape Verde'],
  };
  for (const country of requestedCountries) {
    assert.match(country.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(country.article.trim());
    if (aliases[country.name]) assert.deepEqual([country.id, country.article], aliases[country.name]);
  }
});

test('additional countries fill every gap without replacing any existing entry', () => {
  assert.equal(existing.length, 67);
  assert.equal(additional.length, 128);
  const existingIds = new Set(existing.map(country => country.id));
  const requestedIds = new Set(requestedCountries.map(country => country.id));
  assert.deepEqual(existing.filter(country => !requestedIds.has(country.id)).map(country => country.id), ['oman']);
  const expectedMissing = requestedCountries.filter(country => !existingIds.has(country.id)).map(country => country.id);
  assert.deepEqual(additional.map(country => country.id), expectedMissing);
  assert.equal(new Set([...existing, ...additional].map(country => country.id)).size, 195);
  for (const country of additional) {
    assert.equal(country.slug, country.id);
    assert.equal(country.name, requestedCountries.find(entry => entry.id === country.id).name);
  }
});

test('every addition has metadata, distinct highlights and consistent seasonal notes', () => {
  const highlightSets = new Set();
  for (const country of additional) {
    for (const field of ['capital', 'currency', 'language', 'continent', 'description', 'bestMonthsLabel']) {
      assert.ok(country[field].trim(), `${country.id}: ${field}`);
    }
    assert.match(country.currency, /\([A-Z]{3}(?:\s*\/\s*[A-Z]{3})?\)/, country.id);
    assert.notEqual(country.currency, country.language, country.id);
    assert.ok(CONTINENTS.includes(country.continent), `${country.id}: continent filter`);
    assert.equal(Array.from(country.flag).length, 2, country.id);
    assert.ok(country.famousFor.length >= 3, country.id);
    assert.ok(country.interests.length >= 2, country.id);
    highlightSets.add(country.famousFor.join('|'));
    assert.ok(country.bestMonths.length > 0 && country.bestMonths.length < 12, country.id);
    assert.equal(new Set(country.bestMonths).size, country.bestMonths.length, country.id);
    assert.ok(country.bestMonths.every(month => Number.isInteger(month) && month >= 1 && month <= 12), country.id);
    assert.deepEqual(country.seasonalMonths.map(entry => entry.month), Array.from({ length: 12 }, (_, i) => i + 1));
    for (const entry of country.seasonalMonths) {
      assert.equal(entry.rating, country.bestMonths.includes(entry.month) ? 'best' : 'fair', country.id);
      assert.ok(entry.note.length > 50, `${country.id}: month ${entry.month}`);
    }
    assert.match(country.avoid, /Seasonal suitability is not a safety assessment/, country.id);
    for (const field of ['destinations', 'weather', 'festivals', 'foods']) {
      assert.deepEqual(country[field], [], `${country.id}: do not synthesize ${field}`);
    }
  }
  assert.equal(highlightSets.size, additional.length);
});

test('sensitive metadata and high-risk climate caveats remain explicit', () => {
  const byId = new Map(additional.map(country => [country.id, country]));
  assert.match(byId.get('bulgaria').currency, /Euro/);
  assert.equal(byId.get('equatorial-guinea').capital, 'Ciudad de la Paz');
  assert.match(byId.get('nauru').capital, /No official capital/);
  assert.match(byId.get('bolivia').capital, /Sucre.*La Paz/);
  assert.match(byId.get('seychelles').currency, /SCR/);
  for (const id of ['afghanistan', 'haiti', 'libya', 'mali', 'somalia', 'south-sudan', 'sudan', 'syria', 'ukraine', 'yemen']) {
    const country = byId.get(id);
    assert.match(country.description, /risks|hazards|War/i, id);
    assert.ok(country.seasonalMonths.every(month => /risks|hazards|War/i.test(month.note)), id);
  }
});
