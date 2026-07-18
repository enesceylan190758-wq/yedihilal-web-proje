/**
 * YediHilal İstanbul Panel — ek modüller
 * P0 kalıcılık, günlük, hata denetimi, açılış/kadro/gönüllü/risk/mutat/özet, Sancaktar
 */
(function () {
  "use strict";

  const DEPO_KEY = "yh_panel_depo_v1";
  const AI_KEY = "yh_sancaktar_key";
  const AI_URL_KEY = "yh_sancaktar_url";
  const GUNLUK_MAX = 200;

  const ACILIS_ADIMLAR = [
    { no: 1, faz: "1 · Aday", ad: "İlçe dosyası açıldı" },
    { no: 2, faz: "1 · Aday", ad: "Koordinatör adayı belirlendi" },
    { no: 3, faz: "1 · Aday", ad: "İlk yüz yüze görüşme yapıldı" },
    { no: 4, faz: "2 · Heyet", ad: "İstişare / ikinci görüşme" },
    { no: 5, faz: "2 · Heyet", ad: "Kurucu heyet en az 3 kişi" },
    { no: 6, faz: "2 · Heyet", ad: "Temsilci teklifi netleşti" },
    { no: 7, faz: "3 · YK", ad: "YK çekirdeği (en az 5)" },
    { no: 8, faz: "3 · YK", ad: "Mekân araştırması başladı" },
    { no: 9, faz: "3 · YK", ad: "İlk 3 mutat program planı" },
    { no: 10, faz: "4 · Açılış", ad: "Komisyon bilgilendirildi" },
    { no: 11, faz: "4 · Açılış", ad: "Açılış tarihi sabitlendi" },
    { no: 12, faz: "4 · Açılış", ad: "Resmi açılış / duyuru" }
  ];

  const KADRO_GOREVLER = [
    "Temsilci", "YK Başkanı", "Sekreter", "Mali Sorumlu",
    "Teşkilat", "Eğitim", "Sosyal / İrfan", "Hanımlar"
  ];

  const MUTAT_SEED = [
    { kod: "MP-01", ad: "Haftalık Yatsıya Kadar", periyot: "Haftalık", kitle: "Genç / yetişkin", hedef: 9 },
    { kod: "MP-02", ad: "Sabah Namazı Programı", periyot: "Haftalık", kitle: "Erkek", hedef: 9 },
    { kod: "MP-03", ad: "YK Toplantısı", periyot: "Aylık", kitle: "YK", hedef: 9 },
    { kod: "MP-04", ad: "Meclis / İstişare", periyot: "Aylık", kitle: "Çekirdek", hedef: 9 },
    { kod: "MP-05", ad: "Ortaokul Ziyareti", periyot: "Aylık", kitle: "Öğrenci", hedef: 9 },
    { kod: "MP-06", ad: "Lise Ziyareti", periyot: "Aylık", kitle: "Öğrenci", hedef: 9 },
    { kod: "MP-07", ad: "Kurumsal Ziyaret", periyot: "Aylık", kitle: "STK / kurum", hedef: 9 },
    { kod: "MP-08", ad: "Kamp / Yaz Programı", periyot: "Yıllık", kitle: "Genç", hedef: 9 }
  ];

  function $ (s) { return document.querySelector(s); }
  function $$ (s) { return [...document.querySelectorAll(s)]; }
  function esc (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, c =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function kim () {
    return (window.oturum && oturum.ad) || (window.oturum && oturum.id) || "misafir";
  }
  function duz (sek) {
    return typeof window.duzenleyebilir === "function" &&
      (duzenleyebilir(sek) || (typeof baskanMi === "function" && baskanMi()));
  }

  function seedD () {
    if (!window.D) return;
    if (!D.acilisAdimlar) D.acilisAdimlar = JSON.parse(JSON.stringify(ACILIS_ADIMLAR));
    if (!D.acilisKayit) D.acilisKayit = {};
    if (!D.kadroGorevler) D.kadroGorevler = KADRO_GOREVLER.slice();
    if (!D.kadro) D.kadro = [];
    if (!D.gonulluler) D.gonulluler = [];
    if (!D.riskKayit) D.riskKayit = [];
    if (!D.mutat) D.mutat = JSON.parse(JSON.stringify(MUTAT_SEED));
    if (!D.gunluk) D.gunluk = [];
  }

  function depoPaket () {
    return {
      v: 1,
      ts: new Date().toISOString(),
      ilceler: D.ilceler,
      hatlar: D.hatlar,
      stk: D.stk, reis: D.reis, ekip: D.ekip, aday: D.aday,
      birimHedef: D.birimHedef, vizyon: D.vizyon,
      ziyaretler: D.ziyaretler, arsiv: D.arsiv, progKatilim: D.progKatilim,
      kararlar: D.kararlar, programlar: D.programlar,
      kullanicilar: window.kullanicilar,
      acikSekmeler: window.acikSekmeler,
      etkinlikler: window.etkinlikler,
      acilisKayit: D.acilisKayit,
      kadro: D.kadro, gonulluler: D.gonulluler,
      riskKayit: D.riskKayit, mutat: D.mutat,
      gunluk: D.gunluk
    };
  }

  function depoUygula (p) {
    if (!p || typeof p !== "object") return;
    [
      "ilceler", "hatlar", "stk", "reis", "ekip", "aday", "birimHedef", "vizyon",
      "ziyaretler", "arsiv", "progKatilim", "kararlar", "programlar",
      "acilisKayit", "kadro", "gonulluler", "riskKayit", "mutat", "gunluk"
    ].forEach(k => { if (p[k] != null) D[k] = p[k]; });
    if (Array.isArray(p.kullanicilar) && p.kullanicilar.length) {
      window.kullanicilar = JSON.parse(JSON.stringify(p.kullanicilar));
    }
    if (Array.isArray(p.acikSekmeler)) window.acikSekmeler = p.acikSekmeler.slice();
    if (Array.isArray(p.etkinlikler)) window.etkinlikler = p.etkinlikler;
  }

  let depoTimer = null;
  function depoKaydet (hemen) {
    const yaz = () => {
      try { localStorage.setItem(DEPO_KEY, JSON.stringify(depoPaket())); } catch (e) {}
    };
    if (hemen) return yaz();
    clearTimeout(depoTimer);
    depoTimer = setTimeout(yaz, 400);
  }

  function depoYukle () {
    try {
      const raw = localStorage.getItem(DEPO_KEY);
      if (!raw) return false;
      depoUygula(JSON.parse(raw));
      return true;
    } catch (e) { return false; }
  }

  function gunlukEkle (ne, detay) {
    seedD();
    D.gunluk.unshift({
      ts: new Date().toISOString(),
      kim: kim(),
      ne: String(ne || ""),
      detay: String(detay || "")
    });
    if (D.gunluk.length > GUNLUK_MAX) D.gunluk.length = GUNLUK_MAX;
    depoKaydet();
  }

  function yedekIndir () {
    const blob = new Blob([JSON.stringify(depoPaket(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "YediHilal_panel_yedek_" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    if (typeof toastGoster === "function") toastGoster("JSON yedek indirildi.");
    gunlukEkle("Yedek indirildi", a.download);
  }

  function yedekYukle (file) {
    const r = new FileReader();
    r.onload = () => {
      try {
        depoUygula(JSON.parse(r.result));
        depoKaydet(true);
        gunlukEkle("Yedek yüklendi", file.name || "");
        if (typeof ciz === "function") ciz();
        if (typeof navCiz === "function") navCiz();
        if (typeof toastGoster === "function") toastGoster("Yedek geri yüklendi.");
      } catch (e) {
        if (typeof toastGoster === "function") toastGoster("Yedek okunamadı: " + e.message, "hata");
      }
    };
    r.readAsText(file);
  }

  /* ---------- Hata denetimi ---------- */
  function hataListesi () {
    const out = [];
    const hatlar = D.hatlar || {};
    Object.values(hatlar).forEach(h => {
      if (!h.takipci || h.takipci === "BOŞ") {
        out.push({ seviye: "kritik", baslik: "Boş hat takipçisi", detay: (h.kod || "") + " " + (h.ad || "") });
      }
    });
    (D.ilceler || []).forEach(i => {
      if (i.durum === "MEVCUT") {
        if (!i.temsilci || i.temsilci === "—" || !String(i.temsilci).trim()) {
          out.push({ seviye: "yuksek", baslik: "Temsilci eksik", detay: i.ad });
        }
        if (!i.tel || i.tel === "—" || /05xx/i.test(String(i.tel))) {
          out.push({ seviye: "orta", baslik: "Telefon eksik/placeholder", detay: i.ad + " · " + (i.tel || "—") });
        }
        if (i.puan != null && i.sinif) {
          const bek =
            i.puan >= (D.esik && D.esik.A || 65) ? "A" :
            i.puan >= (D.esik && D.esik.B || 50) ? "B" :
            i.puan >= (D.esik && D.esik.C || 35) ? "C" : "D";
          if (i.sinif !== bek) {
            out.push({ seviye: "yuksek", baslik: "Skor / sınıf uyumsuz", detay: i.ad + " puan=" + i.puan + " sınıf=" + i.sinif + " beklenen=" + bek });
          }
        }
      }
      if (i.durum === "HEDEF" && (!i.aday || !String(i.aday).trim()) && i.onc === 1) {
        out.push({ seviye: "orta", baslik: "Öncelik-1 hedefte aday yok", detay: i.ad });
      }
    });
    const dolu = (D.aday || []).length;
    if (dolu < 10) {
      out.push({ seviye: "orta", baslik: "Aday havuzu ince", detay: dolu + " kişi (hedef ~30)" });
    }
    return out;
  }

  function hataDenetimiCiz () {
    const el = $("#hataListe");
    if (!el) return;
    const list = hataListesi();
    const renk = { kritik: "#A83A32", yuksek: "#B4713A", orta: "#B8962E", dusuk: "#3E8E6B" };
    $("#hataSay").textContent = list.length + " bulgu";
    if (!list.length) {
      el.innerHTML = `<p class="notk">Kritik tutarsızlık yok. Veri disiplini iyi görünüyor.</p>`;
      return;
    }
    el.innerHTML = list.map(h =>
      `<div class="krit"><span class="rz" style="background:${renk[h.seviye] || "#888"}22;color:${renk[h.seviye] || "#888"}">${esc(h.seviye)}</span>
        <span class="kad"><b>${esc(h.baslik)}</b><div style="font-size:12px;color:var(--sil)">${esc(h.detay)}</div></span></div>`
    ).join("");
  }

  /* ---------- Günlük ---------- */
  function gunlukCiz () {
    const el = $("#gunlukListe");
    if (!el) return;
    seedD();
    $("#gunlukSay").textContent = D.gunluk.length + " kayıt";
    if (!D.gunluk.length) {
      el.innerHTML = `<p class="notk">Henüz kayıt yok. Düzenleme yaptıkça buraya düşer.</p>`;
      return;
    }
    el.innerHTML = D.gunluk.slice(0, 80).map(g => {
      const t = new Date(g.ts);
      const ts = isNaN(t) ? g.ts : t.toLocaleString("tr-TR");
      return `<div class="krit"><span class="kad" style="font-family:IBM Plex Mono,monospace;font-size:12px;color:var(--sil);min-width:140px">${esc(ts)}</span>
        <span class="kad"><b>${esc(g.kim)}</b> · ${esc(g.ne)}
          <div style="font-size:12px;color:var(--sil)">${esc(g.detay)}</div></span></div>`;
    }).join("");
  }

  /* ---------- Açılış protokolü ---------- */
  function acilisCiz () {
    const box = $("#acilisIcerik");
    if (!box) return;
    seedD();
    const hedefler = (D.ilceler || []).filter(i => i.durum === "HEDEF");
    const sel = $("#acilisIlce");
    const cur = (sel && sel.value) || (hedefler[0] && hedefler[0].ad) || "";
    if (sel) {
      sel.innerHTML = hedefler.map(i =>
        `<option value="${esc(i.ad)}" ${i.ad === cur ? "selected" : ""}>${esc(i.ad)} · Öncelik ${i.onc || "—"}</option>`
      ).join("");
      sel.onchange = () => acilisCiz();
    }
    const ilce = (sel && sel.value) || cur;
    if (!ilce) {
      box.innerHTML = `<p class="notk">Hedef ilçe yok.</p>`;
      return;
    }
    if (!D.acilisKayit[ilce]) D.acilisKayit[ilce] = { adimlar: {}, tarihler: {} };
    const kay = D.acilisKayit[ilce];
    const done = D.acilisAdimlar.filter(a => kay.adimlar[a.no]).length;
    const pct = Math.round(done / D.acilisAdimlar.length * 100);
    const canEdit = duz("acilis");
    box.innerHTML = `
      <div class="notk" style="margin-bottom:12px"><b>${esc(ilce)}</b> açılış ilerlemesi: ${done}/${D.acilisAdimlar.length} (%${pct})</div>
      <div style="height:8px;background:#E6EFE9;border-radius:99px;margin-bottom:16px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:var(--altin)"></div></div>
      ${D.acilisAdimlar.map(a => {
        const on = !!kay.adimlar[a.no];
        return `<label class="krit" style="cursor:${canEdit ? "pointer" : "default"}">
          <input type="checkbox" data-ac="${a.no}" ${on ? "checked" : ""} ${canEdit ? "" : "disabled"} style="width:18px;height:18px">
          <span class="kad"><span class="rz" style="background:#E6EFE9;color:#5F5749">${esc(a.faz)}</span>
            <b style="margin-left:8px">${a.no}.</b> ${esc(a.ad)}
            ${on && kay.tarihler[a.no] ? `<div style="font-size:11px;color:var(--sil)">${esc(kay.tarihler[a.no])}</div>` : ""}</span></label>`;
      }).join("")}`;
    $$("[data-ac]").forEach(c => {
      c.onchange = () => {
        const no = +c.dataset.ac;
        kay.adimlar[no] = c.checked;
        if (c.checked) kay.tarihler[no] = new Date().toLocaleDateString("tr-TR");
        else delete kay.tarihler[no];
        gunlukEkle("Açılış adımı", ilce + " #" + no + (c.checked ? " tamam" : " geri alındı"));
        if (window.kirliDiger) kirliDiger["acilis." + ilce] = 1;
        if (typeof kaydetBar === "function") kaydetBar();
        depoKaydet();
        acilisCiz();
      };
    });
  }

  /* ---------- Kadro ---------- */
  function kadroCiz () {
    const el = $("#kadroTablo");
    if (!el) return;
    seedD();
    const canEdit = duz("kadro");
    $("#kadroEkle").classList.toggle("gizle", !canEdit);
    const mevcut = (D.ilceler || []).filter(i => i.durum === "MEVCUT");
    const satirlar = [];
    mevcut.forEach(i => {
      KADRO_GOREVLER.forEach(g => {
        const k = D.kadro.find(x => x.ilce === i.ad && x.gorev === g);
        satirlar.push({ ilce: i.ad, gorev: g, ad: (k && k.ad) || "", tel: (k && k.tel) || "", durum: (k && k.durum) || (g === "Temsilci" && i.temsilci !== "—" ? "Dolu" : "Boş") });
      });
    });
    const dolu = satirlar.filter(s => s.ad || s.durum === "Dolu").length;
    $("#kadroSay").textContent = dolu + " / " + satirlar.length + " dolu";
    el.innerHTML = `<table><thead><tr><th class="dz">Temsilcilik</th><th class="dz">Görev</th><th class="dz">Ad</th><th class="dz">Tel</th><th class="dz">Durum</th>${canEdit ? "<th></th>" : ""}</tr></thead>
      <tbody>${satirlar.map((s, ix) => {
        const c = s.ad || s.durum === "Dolu" ? "#3E8E6B" : "#A83A32";
        return `<tr>
          <td><b>${esc(s.ilce)}</b></td><td>${esc(s.gorev)}</td>
          <td>${canEdit ? `<input data-kd="${ix}|ad" value="${esc(s.ad)}" style="width:100%;padding:6px;border:1px solid var(--hat);border-radius:6px">` : esc(s.ad || "—")}</td>
          <td>${canEdit ? `<input data-kd="${ix}|tel" value="${esc(s.tel)}" style="width:100%;padding:6px;border:1px solid var(--hat);border-radius:6px">` : esc(s.tel || "—")}</td>
          <td><span class="rz" style="background:${c}22;color:${c}">${esc(s.ad ? "Dolu" : "Boş")}</span></td>
          ${canEdit ? `<td><button class="btn" data-kdsave="${ix}">Kaydet</button></td>` : ""}</tr>`;
      }).join("")}</tbody></table>`;
    window._kadroSatir = satirlar;
    $$("[data-kdsave]").forEach(b => {
      b.onclick = () => {
        const ix = +b.dataset.kdsave;
        const s = window._kadroSatir[ix];
        const adEl = $(`[data-kd="${ix}|ad"]`);
        const telEl = $(`[data-kd="${ix}|tel"]`);
        const ad = adEl ? adEl.value.trim() : "";
        const tel = telEl ? telEl.value.trim() : "";
        D.kadro = D.kadro.filter(x => !(x.ilce === s.ilce && x.gorev === s.gorev));
        if (ad) D.kadro.push({ ilce: s.ilce, gorev: s.gorev, ad, tel, durum: "Dolu" });
        gunlukEkle("Kadro", s.ilce + " · " + s.gorev + " · " + (ad || "silindi"));
        if (window.kirliDiger) kirliDiger["kadro"] = 1;
        if (typeof kaydetBar === "function") kaydetBar();
        depoKaydet();
        kadroCiz();
      };
    });
  }

  /* ---------- Gönüllü ---------- */
  function gonulluCiz () {
    const el = $("#gonulluTablo");
    if (!el) return;
    seedD();
    const canEdit = duz("gonullu");
    $("#gonulluEkle").classList.toggle("gizle", !canEdit);
    $("#gonulluSay").textContent = D.gonulluler.length + " kişi";
    if (!D.gonulluler.length) {
      el.innerHTML = `<p class="notk">Henüz gönüllü yok — Aday Havuzu'ndan ayrı isim kütüğüdür.</p>`;
      return;
    }
    el.innerHTML = `<table><thead><tr><th class="dz">Ad</th><th class="dz">İlçe</th><th class="dz">Tel</th><th class="dz">Durum</th><th class="dz">Kayıt</th>${canEdit ? "<th></th>" : ""}</tr></thead>
      <tbody>${D.gonulluler.map((g, ix) => `<tr>
        <td><b>${esc(g.ad)}</b></td><td>${esc(g.ilce)}</td><td>${esc(g.tel || "—")}</td>
        <td>${esc(g.durum || "Aktif")}</td><td>${esc(g.kayit || "—")}</td>
        ${canEdit ? `<td><button class="btn" data-gsil="${ix}">✕</button></td>` : ""}</tr>`).join("")}</tbody></table>`;
    $$("[data-gsil]").forEach(b => {
      b.onclick = () => {
        const g = D.gonulluler.splice(+b.dataset.gsil, 1)[0];
        gunlukEkle("Gönüllü silindi", g && g.ad);
        if (window.kirliDiger) kirliDiger["gonullu"] = 1;
        if (typeof kaydetBar === "function") kaydetBar();
        depoKaydet();
        gonulluCiz();
      };
    });
  }

  /* ---------- Risk ---------- */
  function riskCiz () {
    const el = $("#riskTablo");
    if (!el) return;
    seedD();
    const canEdit = duz("risk");
    $("#riskEkle").classList.toggle("gizle", !canEdit);
    $("#riskSay").textContent = D.riskKayit.length + " kayıt";
    if (!D.riskKayit.length) {
      el.innerHTML = `<p class="notk">Risk kaydı boş. İlçe/hat riskini aksiyonla buraya işleyin.</p>`;
      return;
    }
    el.innerHTML = `<table><thead><tr><th class="dz">İlçe/Hat</th><th class="dz">Risk</th><th class="dz">Aksiyon</th><th class="dz">Sorumlu</th><th class="dz">Termin</th><th class="dz">Durum</th>${canEdit ? "<th></th>" : ""}</tr></thead>
      <tbody>${D.riskKayit.map((r, ix) => {
        const c = r.risk === "KRİTİK" ? "#A83A32" : r.risk === "Yüksek" ? "#B4713A" : "#B8962E";
        return `<tr>
          <td><b>${esc(r.ilce || r.hat || "—")}</b></td>
          <td><span class="rz" style="background:${c}22;color:${c}">${esc(r.risk || "—")}</span></td>
          <td>${esc(r.aksiyon || "—")}</td><td>${esc(r.sorumlu || "—")}</td>
          <td>${esc(r.termin || "—")}</td><td>${esc(r.durum || "Açık")}</td>
          ${canEdit ? `<td><button class="btn" data-rsil="${ix}">✕</button></td>` : ""}</tr>`;
      }).join("")}</tbody></table>`;
    $$("[data-rsil]").forEach(b => {
      b.onclick = () => {
        D.riskKayit.splice(+b.dataset.rsil, 1);
        gunlukEkle("Risk silindi", "");
        if (window.kirliDiger) kirliDiger["risk"] = 1;
        if (typeof kaydetBar === "function") kaydetBar();
        depoKaydet();
        riskCiz();
      };
    });
  }

  /* ---------- Mutat program ---------- */
  function mutatCiz () {
    const el = $("#mutatTablo");
    if (!el) return;
    seedD();
    const canEdit = duz("mutat");
    $("#mutatEkle").classList.toggle("gizle", !canEdit);
    el.innerHTML = `<table><thead><tr><th class="dz">Kod</th><th class="dz">Program</th><th class="dz">Periyot</th><th class="dz">Kitle</th><th class="dz">Hedef temsilcilik</th>${canEdit ? "<th></th>" : ""}</tr></thead>
      <tbody>${D.mutat.map((m, ix) => `<tr>
        <td class="n">${esc(m.kod)}</td><td><b>${esc(m.ad)}</b></td><td>${esc(m.periyot)}</td>
        <td>${esc(m.kitle)}</td><td class="n">${esc(m.hedef)}</td>
        ${canEdit ? `<td><button class="btn" data-msil="${ix}">✕</button></td>` : ""}</tr>`).join("")}</tbody></table>
      <p class="notk" style="margin-top:12px">Bu katalog standarttır. Katılım sayıları <b>Program &amp; Kamp</b> sekmesinden işlenir.</p>`;
    $$("[data-msil]").forEach(b => {
      b.onclick = () => {
        D.mutat.splice(+b.dataset.msil, 1);
        gunlukEkle("Mutat silindi", "");
        if (window.kirliDiger) kirliDiger["mutat"] = 1;
        if (typeof kaydetBar === "function") kaydetBar();
        depoKaydet();
        mutatCiz();
      };
    });
  }

  /* ---------- Yönetici özeti ---------- */
  function ozetCiz () {
    const el = $("#ozetIcerik");
    if (!el) return;
    if (typeof hesapla === "function") hesapla();
    const m = (D.ilceler || []).filter(i => i.durum === "MEVCUT");
    const h = (D.ilceler || []).filter(i => i.durum === "HEDEF");
    const ort = m.length ? (m.reduce((a, i) => a + (i.puan || 0), 0) / m.length) : 0;
    const bosHat = Object.values(D.hatlar || {}).filter(x => !x.takipci || x.takipci === "BOŞ");
    const hatalar = hataListesi().filter(x => x.seviye === "kritik" || x.seviye === "yuksek");
    el.innerHTML = `
      <div class="kpiler" style="margin-bottom:16px">
        <div class="kpi al"><div class="v">${m.length}<em> / 39</em></div><div class="l">Mevcut temsilcilik</div></div>
        <div class="kpi"><div class="v">${h.length}</div><div class="l">Hedef ilçe</div></div>
        <div class="kpi"><div class="v">${ort.toFixed(1).replace(".", ",")}</div><div class="l">Ortalama puan</div></div>
        <div class="kpi ${bosHat.length ? "uy" : ""}"><div class="v">${bosHat.length}<em> / 4</em></div><div class="l">Boş hat takipçisi</div></div>
      </div>
      <div class="kart"><div class="kbas"><h2>YK için uyarılar</h2><span class="yan">${hatalar.length} madde</span></div>
        <div class="kgov">${hatalar.length ? hatalar.slice(0, 12).map(x =>
          `<div class="krit"><span class="kad"><b>${esc(x.baslik)}</b> — ${esc(x.detay)}</span></div>`
        ).join("") : `<p class="notk">Kritik uyarı yok.</p>`}</div></div>
      <div class="kart"><div class="kbas"><h2>Boş hatlar</h2></div>
        <div class="kgov">${bosHat.length ? bosHat.map(x =>
          `<div class="krit"><span class="kad"><b>${esc(x.kod)}</b> ${esc(x.ad)} — takipçi atanmalı</span></div>`
        ).join("") : `<p class="notk">Tüm hatların takipçisi var.</p>`}</div></div>
      <div class="motto">«Nizamsız hâk, nizamlı bâtıla mağlûb olur.»<b>Mustafa Sabri Efendi</b></div>`;
  }

  /* ---------- Sancaktar AI ---------- */
  function sancaktarCiz () {
    const keyEl = $("#scKey");
    const urlEl = $("#scUrl");
    if (keyEl) try { keyEl.value = localStorage.getItem(AI_KEY) || ""; } catch (e) {}
    if (urlEl) try { urlEl.value = localStorage.getItem(AI_URL_KEY) || "https://api.anthropic.com/v1/messages"; } catch (e) {}
  }

  async function sancaktarGonder () {
    const q = ($("#scSoru") && $("#scSoru").value.trim()) || "";
    const log = $("#scLog");
    if (!q) return typeof toastGoster === "function" && toastGoster("Soru yazın.", "hata");
    let key = "", url = "";
    try {
      key = localStorage.getItem(AI_KEY) || "";
      url = localStorage.getItem(AI_URL_KEY) || "https://api.anthropic.com/v1/messages";
    } catch (e) {}
    if ($("#scKey")) { key = $("#scKey").value.trim(); try { localStorage.setItem(AI_KEY, key); } catch (e) {} }
    if ($("#scUrl")) { url = $("#scUrl").value.trim(); try { localStorage.setItem(AI_URL_KEY, url); } catch (e) {} }
    if (!key) {
      if (log) log.innerHTML = `<div class="notk kirmizi">API anahtarı yok. Aşağıya Anthropic (veya uyumlu) anahtarını yazın — anahtar yalnızca bu tarayıcıda saklanır.</div>`;
      return;
    }
    if (log) log.innerHTML = `<p class="notk">Sancaktar düşünüyor…</p>`;
    const ozet = {
      mevcut: (D.ilceler || []).filter(i => i.durum === "MEVCUT").length,
      hedef: (D.ilceler || []).filter(i => i.durum === "HEDEF").length,
      bosHat: Object.values(D.hatlar || {}).filter(h => h.takipci === "BOŞ").map(h => h.kod),
      uyari: hataListesi().slice(0, 8)
    };
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{
            role: "user",
            content: `Sen YediHilal İstanbul teşkilat asistanı Sancaktar'sın. Kısa Türkçe cevap ver.\nPanel özeti: ${JSON.stringify(ozet)}\nSoru: ${q}`
          }]
        })
      });
      const j = await r.json();
      const text = (j.content && j.content[0] && j.content[0].text) || j.error?.message || JSON.stringify(j);
      if (log) log.innerHTML = `<div class="notk"><b>Siz:</b> ${esc(q)}</div><div class="kart" style="margin-top:10px"><div class="kgov" style="white-space:pre-wrap">${esc(text)}</div></div>`;
      gunlukEkle("Sancaktar soru", q.slice(0, 80));
    } catch (e) {
      if (log) log.innerHTML = `<div class="notk kirmizi">İstek başarısız: ${esc(e.message)}. Tarayıcıdan doğrudan API çoğu zaman CORS engeller — sunucu proxy gerekir.</div>`;
    }
  }

  /* ---------- After ciz + hooks ---------- */
  function afterCiz () {
    seedD();
    acilisCiz();
    kadroCiz();
    gonulluCiz();
    riskCiz();
    mutatCiz();
    ozetCiz();
    hataDenetimiCiz();
    gunlukCiz();
    sancaktarCiz();
    depoKaydet();
  }

  function bindUi () {
    const yInd = $("#bYedekIndir");
    if (yInd) yInd.onclick = yedekIndir;
    const yYuk = $("#bYedekYukle");
    const yFile = $("#yedekDosya");
    if (yYuk && yFile) {
      yYuk.onclick = () => yFile.click();
      yFile.onchange = e => { const f = e.target.files[0]; if (f) yedekYukle(f); e.target.value = ""; };
    }
    const gE = $("#gonulluEkle");
    if (gE) gE.onclick = () => {
      const ad = prompt("Gönüllü adı soyadı:");
      if (!ad) return;
      const ilce = prompt("İlçe:", "") || "";
      const tel = prompt("Telefon:", "") || "";
      D.gonulluler.push({ ad: ad.trim(), ilce, tel, durum: "Aktif", kayit: new Date().toLocaleDateString("tr-TR") });
      gunlukEkle("Gönüllü eklendi", ad);
      if (window.kirliDiger) kirliDiger["gonullu"] = 1;
      if (typeof kaydetBar === "function") kaydetBar();
      depoKaydet();
      gonulluCiz();
    };
    const rE = $("#riskEkle");
    if (rE) rE.onclick = () => {
      const ilce = prompt("İlçe veya hat kodu (örn. Kadıköy / B1):");
      if (!ilce) return;
      const risk = prompt("Risk (KRİTİK / Yüksek / Orta):", "Yüksek") || "Yüksek";
      const aksiyon = prompt("Aksiyon:", "") || "";
      const sorumlu = prompt("Sorumlu:", kim()) || "";
      const termin = prompt("Termin (GG.AA.YYYY):", "") || "";
      D.riskKayit.push({ ilce, risk, aksiyon, sorumlu, termin, durum: "Açık" });
      gunlukEkle("Risk eklendi", ilce + " · " + risk);
      if (window.kirliDiger) kirliDiger["risk"] = 1;
      if (typeof kaydetBar === "function") kaydetBar();
      depoKaydet();
      riskCiz();
    };
    const mE = $("#mutatEkle");
    if (mE) mE.onclick = () => {
      const ad = prompt("Program adı:");
      if (!ad) return;
      const kod = "MP-" + String(D.mutat.length + 1).padStart(2, "0");
      D.mutat.push({ kod, ad, periyot: prompt("Periyot:", "Aylık") || "Aylık", kitle: prompt("Kitle:", "") || "", hedef: 9 });
      gunlukEkle("Mutat eklendi", ad);
      if (window.kirliDiger) kirliDiger["mutat"] = 1;
      if (typeof kaydetBar === "function") kaydetBar();
      depoKaydet();
      mutatCiz();
    };
    const sc = $("#bScGonder");
    if (sc) sc.onclick = sancaktarGonder;
    const scSave = $("#bScKaydet");
    if (scSave) scSave.onclick = () => {
      try {
        if ($("#scKey")) localStorage.setItem(AI_KEY, $("#scKey").value.trim());
        if ($("#scUrl")) localStorage.setItem(AI_URL_KEY, $("#scUrl").value.trim());
        if (typeof toastGoster === "function") toastGoster("Sancaktar ayarları kaydedildi.");
      } catch (e) {}
    };
  }

  function patchDigerPayload () {
    if (typeof window.digerPayload !== "function") return;
    const eski = window.digerPayload;
    window.digerPayload = function () {
      const p = eski();
      seedD();
      p.acilisKayit = D.acilisKayit;
      p.kadro = D.kadro;
      p.gonulluler = D.gonulluler;
      p.riskKayit = D.riskKayit;
      p.mutat = D.mutat;
      p.gunluk = D.gunluk;
      return p;
    };
  }

  function patchMetaUygula () {
    if (typeof window.metaUygula !== "function") return;
    const eski = window.metaUygula;
    window.metaUygula = function (veri) {
      eski(veri);
      if (!veri) return;
      ["acilisKayit", "kadro", "gonulluler", "riskKayit", "mutat", "gunluk"].forEach(k => {
        if (veri[k] != null) D[k] = veri[k];
      });
    };
  }

  function patchCiz () {
    if (typeof window.ciz !== "function") return;
    const eski = window.ciz;
    window.ciz = function () {
      eski();
      afterCiz();
    };
  }

  function patchGiris () {
    if (typeof window.girisYap !== "function" && typeof girisYap !== "function") return;
    const base = window.girisYap || girisYap;
    const wrapped = function () {
      const id = $("#gId") && $("#gId").value.trim().toLowerCase();
      const sf = $("#gSifre") ? $("#gSifre").value.trim() : "";
      const h = $("#girisHata");
      if (!id) { h.textContent = "Kullanıcı ID zorunludur."; h.classList.add("ac"); return; }
      const u = (window.kullanicilar || []).find(x => x.id === id);
      if (!u) { h.textContent = "Bu ID tanımlı değil."; h.classList.add("ac"); return; }
      const need = String(u.sifre || "").trim();
      if (need) {
        if (!sf) { h.textContent = "Bu hesap için şifre gerekli."; h.classList.add("ac"); return; }
        if (sf !== need) { h.textContent = "Şifre hatalı."; h.classList.add("ac"); return; }
      }
      if (typeof oturumUygula === "function") oturumUygula(u);
      if (typeof oturumKaydet === "function") oturumKaydet(u.id);
      window.oturum = u;
      if ($("#gId")) $("#gId").value = "";
      if ($("#gSifre")) $("#gSifre").value = "";
      gunlukEkle("Giriş", u.id);
      depoKaydet(true);
      if (typeof modalKapat === "function") modalKapat();
      if (typeof navCiz === "function") navCiz();
      if (typeof ciz === "function") ciz();
    };
    window.girisYap = wrapped;
    const b = $("#bGirisYap");
    if (b) b.onclick = wrapped;
    const gId = $("#gId");
    if (gId) gId.onkeydown = e => { if (e.key === "Enter") wrapped(); };
    const gSf = $("#gSifre");
    if (gSf) gSf.onkeydown = e => { if (e.key === "Enter") wrapped(); };
  }

  function patchDuzBagla () {
    if (typeof window.duzBagla !== "function") return;
    const eski = window.duzBagla;
    window.duzBagla = function () {
      eski();
      $$(".duz[data-p]").forEach(e => {
        const prev = e.onchange;
        e.onchange = function (ev) {
          if (prev) prev.call(this, ev);
          gunlukEkle("Alan değişti", e.dataset.p);
          depoKaydet();
        };
      });
    };
  }

  function init () {
    seedD();
    patchDigerPayload();
    patchMetaUygula();
    patchCiz();
    patchGiris();
    patchDuzBagla();
    bindUi();
    setTimeout(() => { patchGiris(); bindUi(); afterCiz(); }, 800);
  }

  window.YH_EK = {
    init, depoKaydet, depoYukle, yedekIndir, yedekYukle,
    gunlukEkle, hataListesi, afterCiz
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 0));
  } else {
    setTimeout(init, 0);
  }
})();
