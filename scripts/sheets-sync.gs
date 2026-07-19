/**
 * YediHilal İstanbul Teşkilat Paneli — Google Sheets senkron uç noktası
 *
 * KURULUM (bir kez):
 * 1. Bu Sheets dosyasında: Uzantılar → Apps Script
 * 2. Bu dosyanın tamamını yapıştırın (SHEET_ID ve SYNC_TOKEN zaten dolu)
 * 3. Dağıt → Yeni dağıtım → Web uygulaması
 *    - Yürütme: Ben
 *    - Erişim: Bağlantıya sahip herkes
 * 4. Çıkan /exec URL'ini panede Veri Kaynağı → Apps Script kutusuna yapıştırıp
 *    "Bağlantıyı test et" deyin (tarayıcıya da kaydedilir)
 *
 * CAPABILITIES:
 * - POST tablo=ilceler → ilçe satırı güncelle
 * - POST tablo=diger  → panel_meta (ziyaret, arşiv, karar…) kaydet (upsert)
 * - GET  ?aksiyon=meta&token=… → son panel_meta JSON'unu oku
 * - GET  ?aksiyon=ping          → sağlık kontrolü
 */

const SHEET_ID = '1IvpVwTdwmnyccD95zO4Hb4SqiRnzxb4VeSZ-T3HyPxw';
const SYNC_TOKEN = 'qjxX2O3nqEm_fVuHdL_sHDecHux6_wi1';
const META_KEY = 'panel_state';

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);

    if (!body.token || body.token !== SYNC_TOKEN) {
      return jsonOut({ ok: false, hata: 'Yetkisiz istek — token hatali veya eksik' });
    }

    if (body.tablo === 'ilceler') {
      return yazIlce(body.ilce, body.degisiklik || {});
    }

    if (body.tablo === 'diger') {
      return yazDiger(body.veri || {});
    }

    return jsonOut({ ok: false, hata: 'Bilinmeyen tablo: ' + body.tablo });
  } catch (err) {
    return jsonOut({ ok: false, hata: String(err) });
  }
}

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    var aksiyon = String(p.aksiyon || '');

    if (!aksiyon) {
      return HtmlService.createHtmlOutput(
        '<div style="font-family:sans-serif;padding:24px;max-width:520px">' +
        '<h2>YediHilal Sheets Sync</h2>' +
        '<p>Bu adres panelin yazma uç noktasıdır. Tarayıcıda açmak veri göstermez.</p>' +
        '<p>Verileri görmek için Google Sheets dosyasını açın.</p>' +
        '<p><a href="https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit" target="_blank">Sheets dosyasını aç</a></p>' +
        '<p style="color:#666;font-size:13px">Sağlık kontrolü: <code>?aksiyon=ping</code></p></div>'
      );
    }

    if (aksiyon === 'ping') {
      return jsonOut({ ok: true, mesaj: 'YediHilal Sheets sync aktif', sheetId: SHEET_ID });
    }

    if (aksiyon === 'meta') {
      if (!p.token || p.token !== SYNC_TOKEN) {
        return jsonOut({ ok: false, hata: 'Yetkisiz istek — token hatali veya eksik' });
      }
      return okuDiger();
    }

    return jsonOut({ ok: false, hata: 'Bilinmeyen aksiyon: ' + aksiyon });
  } catch (err) {
    return jsonOut({ ok: false, hata: String(err) });
  }
}

function yazIlce(ilceAd, degisiklik) {
  if (String(ilceAd).trim() === '__test__') {
    return jsonOut({ ok: true, test: true });
  }

  var sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName('ilceler');
  if (!sh) {
    return jsonOut({ ok: false, hata: 'ilceler sekmesi bulunamadi — once sablon CSV yukleyin' });
  }

  var v = sh.getDataRange().getValues();
  var bas = v[0].map(function (h) { return String(h).trim().toLowerCase('tr'); });
  var cIlce = bas.indexOf('ilce');
  if (cIlce < 0) {
    return jsonOut({ ok: false, hata: 'ilce sutunu bulunamadi' });
  }

  for (var i = 1; i < v.length; i++) {
    if (String(v[i][cIlce]).trim().toLocaleLowerCase('tr') === String(ilceAd).trim().toLocaleLowerCase('tr')) {
      for (var k in degisiklik) {
        var c = bas.indexOf(String(k).toLowerCase('tr'));
        if (c >= 0) {
          sh.getRange(i + 1, c + 1).setValue(degisiklik[k]);
        }
      }
      return jsonOut({ ok: true, satir: i + 1, ilce: ilceAd });
    }
  }

  return jsonOut({ ok: false, hata: 'ilce bulunamadi: ' + ilceAd });
}

function metaSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName('panel_meta');
  if (!sh) {
    sh = ss.insertSheet('panel_meta');
    sh.getRange(1, 1, 1, 3).setValues([['anahtar', 'json', 'guncelleme']]);
  }
  return sh;
}

function yazDiger(veri) {
  var sh = metaSheet();
  var v = sh.getDataRange().getValues();
  var json = JSON.stringify(veri);
  var ts = new Date().toISOString();

  for (var i = 1; i < v.length; i++) {
    if (String(v[i][0]).trim() === META_KEY) {
      sh.getRange(i + 1, 2, i + 1, 3).setValues([[json, ts]]);
      return jsonOut({ ok: true, kayit: 'panel_meta', tip: 'guncelle', satir: i + 1 });
    }
  }

  sh.appendRow([META_KEY, json, ts]);
  return jsonOut({ ok: true, kayit: 'panel_meta', tip: 'yeni' });
}

function okuDiger() {
  var sh = metaSheet();
  var v = sh.getDataRange().getValues();
  for (var i = 1; i < v.length; i++) {
    if (String(v[i][0]).trim() === META_KEY) {
      var raw = String(v[i][1] || '');
      if (!raw) return jsonOut({ ok: true, veri: {}, bos: true });
      try {
        return jsonOut({ ok: true, veri: JSON.parse(raw), guncelleme: String(v[i][2] || '') });
      } catch (err) {
        return jsonOut({ ok: false, hata: 'panel_meta JSON bozuk: ' + String(err) });
      }
    }
  }
  return jsonOut({ ok: true, veri: {}, bos: true });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
