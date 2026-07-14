/**
 * Panel v4 gömülü veriden data/ilceler.csv üretir.
 * Çalıştır: node scripts/export-ilceler-csv.mjs
 */
import fs from 'fs';

const html = fs.readFileSync('panel/index.html', 'utf8');
const i = html.indexOf('const D = ') + 9;
const j = html.lastIndexOf('};', html.indexOf('const KR ='));
if (j < i) throw new Error('D nesnesi bulunamadi');
const D = JSON.parse(html.slice(i, j + 1));

const BASLIK = ['ilce','hat','durum','temsilci','tel','risk','oncelik','asama','koordinator_adayi','kurucu_heyet',
  'yk','toplanti','merkez','meclis','yeni_gonullu','yatsiya_kadar','sabah_namazi','ortaokul','lise',
  'bagisci','kurumsal','ozgun_calisma','not'];
const ALAN = {ilce:'ad',hat:'hat',durum:'durum',temsilci:'temsilci',tel:'tel',risk:'risk',oncelik:'onc',
  asama:'asama',koordinator_adayi:'aday',kurucu_heyet:'heyet',yk:'yk',toplanti:'toplanti',merkez:'merkez',
  meclis:'meclis',yeni_gonullu:'yeni',yatsiya_kadar:'yatsi',sabah_namazi:'sabah',ortaokul:'ortaokul',
  lise:'lise',bagisci:'bagisci',kurumsal:'kurumsal',ozgun_calisma:'ozgun',not:'not'};
const qq = v => `"${String(v ?? '').replace(/"/g, '""')}"`;

const csv = '\ufeff' + [BASLIK.join(',')].concat(
  D.ilceler.map(i => BASLIK.map(b => qq(i[ALAN[b]])).join(','))
).join('\n');

fs.writeFileSync('data/ilceler.csv', csv);
console.log(`OK — ${D.ilceler.length} ilce → data/ilceler.csv (${csv.length} byte)`);
