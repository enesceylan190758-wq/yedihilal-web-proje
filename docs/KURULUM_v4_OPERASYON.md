# v4 Operasyonel Kurulum (Bölüm 6)

Bu rehber [`ISTANBUL_PANEL_CALISMA_DUZENI_v4.md`](ISTANBUL_PANEL_CALISMA_DUZENI_v4.md) Bölüm 6 adımlarını uygular.

## 1. Panel yapılandırması

Dosya: [`data/panel-config.json`](../data/panel-config.json)

| Alan | Açıklama |
|------|----------|
| `csvUrl` | Birincil CSV kaynağı (statik site: `yhteskilat.org/data/ilceler.csv` veya Sheets `export?format=csv`) |
| `yazUrl` | Apps Script Web App `/exec` adresi |
| `syncToken` | Panel ↔ Apps Script ortak gizli anahtar |
| `sheetId` | Google Sheets dosya ID'si (Apps Script için) |
| `kullanicilar` | Giriş hesapları (HTML'den ayrıldı) |

Şablon: [`data/panel-config.example.json`](../data/panel-config.example.json)

Panel açılınca bu dosyayı otomatik yükler; CSV URL varsa Sheets'ten okur.

## 2. Google Sheets kurulumu

1. Panel → **Veri Kaynağı** → **Şablon CSV indir**
2. Google Sheets → **Dosya → İçe aktar** → CSV yükle
3. Sekme adını **`ilceler`** yapın (küçük harf)
4. **Dosya → Paylaş → Web'de yayınla → CSV** → URL'yi kopyalayın
5. URL'yi `panel-config.json` → `csvUrl` alanına yapıştırın

## 3. Apps Script kurulumu

1. Aynı Sheets dosyasında **Uzantılar → Apps Script**
2. [`scripts/sheets-sync.gs`](../scripts/sheets-sync.gs) içeriğini yapıştırın
3. `SHEET_ID` = Sheets URL'deki `/d/` ile `/edit` arasındaki ID
4. `SYNC_TOKEN` = `panel-config.json` içindeki `syncToken` ile **aynı** olmalı
5. **Dağıt → Yeni dağıtım → Web uygulaması**
   - Yürütme: **Ben**
   - Erişim: **Bağlantıya sahip herkes**
6. `/exec` URL'ini `panel-config.json` → `yazUrl` alanına yazın

## 4. Test

```bash
node scripts/test-csv-sync.mjs
```

Canlı test:
1. Panelde bir ilçe alanını değiştirin
2. **Kaydet** → Sheets'te satır güncellenmeli
3. Sayfayı yenileyin → CSV URL bağlıysa değişiklik geri gelmeli

## 5. Giriş (şifresiz geçici model)

Panel girişi şu an **yalnızca kullanıcı ID** ile yapılır; şifre alanı kapalıdır.

Tanımlı hesaplar `data/panel-config.json` içindedir. Yeni kullanıcı eklerken şifre opsiyoneldir (gelecekteki auth fazı için saklanabilir).

**Canlı adres:** https://www.yhteskilat.org/panel

> Uyarı: `panel-config.json` repoda — gerçek üretimde Supabase Auth veya benzeri kalıcı auth sistemi kurulana kadar bu geçici bir çözümdür.

## 6. SheetJS

Excel dışa aktarma artık yerel dosyadan yüklenir: `vendor/xlsx.full.min.js` (CDN bağımlılığı kaldırıldı).
