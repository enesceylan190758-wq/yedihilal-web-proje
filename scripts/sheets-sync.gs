/**
 * YediHilal İstanbul Teşkilat Paneli — Google Sheets yazma uç noktası
 *
 * Kurulum:
 * 1. Google Sheets'te "ilceler" adlı sekme oluşturun (panelden şablon CSV indirin)
 * 2. Uzantılar → Apps Script → bu dosyayı yapıştırın
 * 3. SHEET_ID ve SYNC_TOKEN değerlerini doldurun
 * 4. Dağıt → Yeni dağıtım → Web uygulaması
 *    Yürütme: Ben | Erişim: Bağlantıya sahip herkes
 * 5. /exec URL'ini panel → Veri Kaynağı → Apps Script kutusuna yapıştırın
 * 6. Aynı token'ı data/panel-config.json → syncToken alanına yazın
 */

const SHEET_ID = '1IvpVwTdwmnyccD95zO4Hb4SqiRnzxb4VeSZ-T3HyPxw';
const SYNC_TOKEN = 'BURAYA_GUVENLI_BIR_TOKEN_YAZIN';

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

function doGet() {
  return jsonOut({ ok: true, mesaj: 'YediHilal Sheets sync aktif' });
}

function yazIlce(ilceAd, degisiklik) {
  if (String(ilceAd).trim() === '__test__') {
    return jsonOut({ ok: true, test: true });
  }

  var sh = SpreadsheetApp.openById(SHEET_ID).getSheetByName('ilceler');
  if (!sh) {
    return jsonOut({ ok: false, hata: 'ilceler sekmesi bulunamadi' });
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

function yazDiger(veri) {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sh = ss.getSheetByName('panel_meta');
  if (!sh) {
    sh = ss.insertSheet('panel_meta');
    sh.getRange(1, 1, 1, 2).setValues([['anahtar', 'json']]);
  }

  var ts = new Date().toISOString();
  sh.appendRow(['diger_' + ts, JSON.stringify(veri)]);
  return jsonOut({ ok: true, kayit: 'panel_meta' });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
