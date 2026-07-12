/**
 * CSV okuma/yazma mantığı testi — panel ile aynı alan eşlemesi
 * Çalıştır: node scripts/test-csv-sync.mjs
 */

const BASLIK = ["ilce","hat","durum","temsilci","tel","risk","oncelik","asama","koordinator_adayi","kurucu_heyet",
  "yk","toplanti","merkez","meclis","yeni_gonullu","yatsiya_kadar","sabah_namazi","ortaokul","lise",
  "bagisci","kurumsal","ozgun_calisma","not"];
const ALAN = {ilce:"ad",hat:"hat",durum:"durum",temsilci:"temsilci",tel:"tel",risk:"risk",oncelik:"onc",
  asama:"asama",koordinator_adayi:"aday",kurucu_heyet:"heyet",yk:"yk",toplanti:"toplanti",merkez:"merkez",
  meclis:"meclis",yeni_gonullu:"yeni",yatsiya_kadar:"yatsi",sabah_namazi:"sabah",ortaokul:"ortaokul",
  lise:"lise",bagisci:"bagisci",kurumsal:"kurumsal",ozgun_calisma:"ozgun",not:"not"};
const SAYI = ["yk","toplanti","meclis","yeni","ortaokul","lise","bagisci","kurumsal","heyet"];
const TERS = Object.fromEntries(Object.entries(ALAN).map(([a,b])=>[b,a]));
const qq = v=>`"${String(v==null?"":v).replace(/"/g,'""')}"`;

function csvYap(ilceler){
  return [BASLIK.join(",")].concat(ilceler.map(i=> BASLIK.map(b=> qq(i[ALAN[b]])).join(","))).join("\n");
}

function csvOku(t, ilceler){
  const l0 = t.split("\n")[0];
  const sep = (l0.match(/;/g)||[]).length > (l0.match(/,/g)||[]).length ? ";" : ",";
  const par = s=>{ const o=[]; let c="",q=false;
    for(let j=0;j<s.length;j++){ const ch=s[j];
      if(ch==='"'){ if(q&&s[j+1]==='"'){c+='"';j++;} else q=!q; }
      else if(ch===sep && !q){ o.push(c); c=""; } else c+=ch; }
    o.push(c); return o.map(x=>x.trim()); };
  const sat = t.trim().split(/\r?\n/);
  const bs = par(sat[0]).map(x=>x.toLocaleLowerCase("tr"));
  const ix = bs.indexOf("ilce");
  if(ix<0) throw new Error("'ilce' sütunu bulunamadı");
  let n=0;
  sat.slice(1).forEach(s=>{
    const h = par(s), ad = h[ix]; if(!ad) return;
    const o = ilceler.find(x=>x.ad.toLocaleLowerCase("tr")===ad.toLocaleLowerCase("tr"));
    if(!o) return;
    BASLIK.forEach(b=>{
      const j = bs.indexOf(b); if(j<0||b==="ilce"||b==="hat") return;
      const v = h[j]; if(v===undefined) return;
      const a = ALAN[b];
      o[a] = SAYI.includes(a) ? (+v||0) : v;
    });
    n++;
  });
  if(!n) throw new Error("Hiçbir ilçe eşleşmedi");
  return n;
}

const ornek = [
  { ad:"Fatih", hat:"B1", durum:"HEDEF", temsilci:"—", tel:"—", risk:"—", onc:1, asama:"1", aday:"",
    heyet:0, yk:0, toplanti:0, merkez:"Yok", meclis:0, yeni:0, yatsi:"Yapılmadı", sabah:"Yapılmadı",
    ortaokul:0, lise:0, bagisci:0, kurumsal:0, ozgun:"", not:"test" },
  { ad:"Kadıköy", hat:"B3", durum:"MEVCUT", temsilci:"Ali", tel:"0555", risk:"—", onc:2, asama:"2", aday:"",
    heyet:1, yk:5, toplanti:2, merkez:"Var", meclis:1, yeni:3, yatsi:"Yapıldı", sabah:"Yapılmadı",
    ortaokul:1, lise:2, bagisci:1, kurumsal:0, ozgun:"", not:"" }
];

const csv = csvYap(ornek);
const kopya = JSON.parse(JSON.stringify(ornek));
kopya[0].temsilci = "ESKI";
const n = csvOku(csv, kopya);

if (kopya[0].temsilci !== "—") throw new Error("CSV okuma başarısız: temsilci güncellenmedi");
if (n !== 2) throw new Error("Beklenen 2 ilçe, gelen: " + n);

const dg = { temsilci: "Yeni" };
const payload = { tablo:"ilceler", ilce:"Fatih", degisiklik:{ [TERS.temsilci]: dg.temsilci }, token:"test" };
if (!payload.degisiklik.temsilci) throw new Error("TERS eşlemesi hatalı");

console.log("OK — CSV export/import ve POST gövdesi doğrulandı");
console.log("  ilce sayisi:", n);
console.log("  ornek payload:", JSON.stringify(payload));
