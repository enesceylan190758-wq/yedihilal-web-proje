# Sheets Yazma Kurulumu (5 dakika)

Hedef: Panelden **Kaydet** → Google Sheets güncellensin; yenileyince ziyaret/karar/meta geri gelsin.

Sheets dosyası:  
https://docs.google.com/spreadsheets/d/1IvpVwTdwmnyccD95zO4Hb4SqiRnzxb4VeSZ-T3HyPxw/edit

## Adımlar

1. Yukarıdaki Sheets’i açın.
2. İlk kez ise panelden **Şablon CSV indir** → Sheets’e **Dosya → İçe aktar**. Sekme adı: **`ilceler`**.
3. **Uzantılar → Apps Script** → mevcut kodu silin → panelde **Kodu kopyala** (veya `scripts/sheets-sync.gs`) yapıştırın → Kaydet.
4. **Dağıt → Yeni dağıtım → Tür: Web uygulaması**
   - Yürütme: **Ben**
   - Erişim: **Bağlantıya sahip herkes**
   - Dağıt → yetki verin → **/exec** URL’sini kopyalayın.
5. https://www.yhteskilat.org/panel → giriş → **Veri Kaynağı**
   - `/exec` URL’sini yapıştırın → **Bağlantıyı test et** (yeşil olmalı).
6. Bir ilçe alanını değiştirin → **Kaydet**. Sheets’te satır güncellenmeli.
7. Ziyaret/karar da Kaydet ile `panel_meta` sekmesine yazılır; sayfa yenilenince otomatik geri yüklenir.

## Kalıcı ekip kullanımı

URL’yi yalnızca tarayıcıya değil, repoya da yazın:

`data/panel-config.json` → `"yazUrl": "https://script.google.com/macros/s/……/exec"`

Sonra `main`’e push. Böylece herkes aynı adresi yükler.

## Sürüm notu

Kod güncellenirse Apps Script’te **Dağıt → Yönet → Yeni sürüm** ile yeniden dağıtın (eski /exec aynı kalabilir).
