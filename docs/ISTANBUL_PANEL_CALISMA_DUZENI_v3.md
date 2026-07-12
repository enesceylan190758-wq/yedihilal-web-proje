# YediHilal İstanbul — Teşkilat Kontrol Paneli
## Çalışma Düzeni, Kurulum ve Teslim Dosyası

**Sürüm:** v3 · Temmuz 2026
**Hazırlayan:** Teşkilatlanma Birimi
**Sunulacak:** İl Yönetim Kurulu
**Canlıya alacak:** Enes

---

## 1. Bu sürümde ne değişti?

Tarif ettiğiniz 5 başlığın tamamı karşılandı:

| İstediğiniz | Panelde nerede |
|---|---|
| Giriş/çıkış butonu (sarı çizginin altındaki siyah alan) | Sağ üstte. ID + şifre ile giriş. |
| Başkana özel gizli bölümler | Giriş yapınca 6 yeni sekme açılır: Birim Planı · Reis'in İstekleri · Ekip Değerlendirme · Aday Havuzu · Veri Kaynağı · Kullanıcı & Yetki |
| Şifre/ID oluşturma + esnek yetki | **Kullanıcı & Yetki** sekmesi. Her kullanıcı için sekme seçimi + 3 yetki seviyesi. |
| Ana ekranda görünecek panelleri seçme | Aynı sekmenin sağ tarafı. İşareti kaldırılan sekme, giriş yapmayan YK üyesine görünmez. |
| Gerçek İstanbul haritası + zoom | Gerçek ilçe sınırları. +/− butonları, fare tekerleği, sürükleyerek kaydırma. |
| Siyah alanın ferahlatılması | Simsiyah yerine kademeli grafit + altın çerçeveli kartlar. |
| Logonun oturtulması | Sol üstte, altın çerçeveli kutuda. |
| İlçe karnesinin üstüne künye sekmeleri | Tıklayınca 4 sekme: **Künye · Karne · Ekip · Aksiyon** |
| Bölge takipçisi isimlerine tıklama | Komisyon & Ritim sekmesinde her isim tıklanabilir → sorumluluk, yetki, iletişim, takip ettiği ilçeler |
| Gelişmiş takvim + chip filtreler | **Takvim** sekmesi. 5 tip çipi + Son 1 ay / 3 ay / Tümü + Ay/Liste görünümü |
| Çift yönlü Excel senkronizasyonu | **Veri Kaynağı** sekmesi. Okuma: Sheets CSV. Yazma: Apps Script (kod panelin içinde) |
| Excel'e girmeden panelden düzenleme | Veri Kaynağı → iki klasör: 📊 Karne Dashboard · 📁 Çalışma Dosyası |

---

## 1b. v3'te eklenenler

| Ne | Nerede |
|---|---|
| **Gerçek vektör harita** — 39 ilçe, gömülü (internet gerekmez) | Genel Durum |
| **Bölge renk modu** — 4 hattı kendi renginde göster | Harita üstü: "Bölge Renkleri" |
| **Renk seçici** — her hattın rengini değiştir | Bölge modunda 4 renk kutusu |
| **Renkleri sıfırla** | Harita araç çubuğu |
| **Bölge sınırı düzenleme** — ilçeye tıkla, hattı değiştir | "Bölge Sınırını Düzenle" (yetkili) |
| **7 İlke şeridi** — logo ile giriş butonu arası | Üst bar, ortada |
| **Ayet/hadis şeritleri** — 14 sayfanın her birinde | Sayfa başlarında, ince altın şerit |
| **Her tablo düzenlenebilir** — Reis, Ekip, STK, Aday, Birim Planı, Vizyon, Bölge, Ritim | Yetkiye göre otomatik |
| **Satır ekle/sil** | STK, Reis, Ekip, Aday, Birim Hedefleri |

### Harita hakkında — bilinmesi gereken

Yüklediğiniz `svg_hali.svg` dosyası bir **resimdir** (SVG kabuğunun içine gömülmüş PNG). İçinde tek bir vektör yol yoktur; bu yüzden ilçeleri tek tek tıklanabilir veya boyanabilir yapmak mümkün değildir.

Bunun yerine, daha önce yüklediğiniz **`Istanbul_districts_map_updated.svg`** dosyasındaki gerçek vektör şekilleri çözümledim. O dosya eski taksimatı içeriyordu (Eminönü ayrı, Sultangazi/Başakşehir/Esenyurt/Ataşehir gibi 10 yeni ilçe yok). Yaptığım işlem:

1. 43 bölge şeklini dönüşümleriyle birlikte çözdüm.
2. Eminönü'yü Fatih'e birleştirdim (2008 idari değişikliği).
3. 2008'de kurulan 10 yeni ilçeyi, ana ilçelerinin içinden **coğrafi konumlarına göre** ayırdım (Voronoi + tarayıcı kırpması).
4. Sonucu doğruladım: 39 ilçe, hiçbiri boş değil, doğu-batı sıralama uyumu **0,993**.

**Not:** Yeni ilçelerin (Sultangazi, Başakşehir, Esenyurt, Beylikdüzü, Ataşehir, Çekmeköy, Sancaktepe, Bayrampaşa, Arnavutköy) iç sınırları **yaklaşıktır** — dış sınırlar (deniz, il sınırı, ana ilçe sınırları) gerçektir. Teşkilat haritası için fazlasıyla yeterli. Milimetrik sınır isterseniz Enes güncel bir GeoJSON bağlayabilir.

### 7 İlke — SİZDEN İSTENİYOR

Üst bardaki 7 hilal şeridinde şu an sadece **"Hareket"** yazılı — YediHilal'in kamuya açık metinlerinde doğrulayabildiğim tek ilke bu. Kalan 6'sını **uydurmadım.**

**İki seçenek:**
1. Bana 7 ilkeyi yazın, koda gömeyim (kalıcı olur).
2. `abdulkadir` ile giriş yapın → şeritteki hilallere tek tek tıklayın → yazın. Değişiklik Sheets'e kaydedilir.

### Google Drive klasörü

Paylaştığınız Drive klasörüne erişemiyorum — Google oturum açma istiyor, ben tarayıcı gibi giriş yapamam. İçindeki dosyalardan panele girmesi gerekenler varsa buraya yükleyin, işlerim.

---

## 2. Deneme hesapları

**Canlıya almadan önce deneyin. Enes bunları silecek.**

| ID | Şifre | Kim | Yetki | Gördüğü |
|---|---|---|---|---|
| `abdulkadir` | `yh2026` | Abdülkadir Yaşar — Teşkilat Başkanı | Tam yetki | 14 sekmenin hepsi + kullanıcı yönetimi |
| `mucahit` | `yh2026` | Mücahit Tiryaki — Sekreterya | Görür + veri girer | Genel, Karne, Takvim, Komisyon, STK |
| `oguzhan` | `yh2026` | Oğuzhan Koçalak — Yeni Teşkilat | Görür + veri girer | Genel, Hat, Aday Havuzu, Takvim, STK |
| `mehmet` | `yh2026` | Mehmet Menteş — B4 Takipçisi | Görür + veri girer | Genel, Karne, Bölge, Komisyon, Takvim |
| `nusret` | `yh2026` | Nusret Onur Anlı — B3 Takipçisi | **Sadece görür** | Aynı sekmeler, ama hiçbir hücreyi değiştiremez |

**Denemenizi öneririm:**
1. Giriş yapmadan paneli açın → YK üyesinin gördüğü ekran budur (8 sekme).
2. `nusret` ile girin → Karne tablosunda hücreler **değiştirilemez**.
3. `mehmet` ile girin → Aynı tabloda hücreler **input olur**, değiştirebilirsiniz.
4. `abdulkadir` ile girin → **Kullanıcı & Yetki** sekmesi açılır. Yeni kullanıcı oluşturun, sekme ve yetki seçin.

---

## 3. Yetki modeli

Her kullanıcı iki şeyle tanımlanır:

**A. Hangi sekmeleri görecek?** (14 sekmeden seçim)
**B. Ne yapabilecek?**
- **Sadece görsün** — okur, hiçbir şeyi değiştiremez
- **Sadece veri girsin** — veri girer
- **Hem görsün hem veri girsin** — tam kullanım

Yetki, seçilen sekmelerin **hepsinde** geçerlidir. Bir kişinin bir sekmede yazıp diğerinde yazamaması gerekiyorsa, o kişiye ikinci bir hesap açılır (veya Enes bunu sekme bazlı yetkiye çevirir — 20 satırlık iş).

**Başkan rolü** özeldir: kullanıcı oluşturur, ana sayfa görünürlüğünü belirler, gizli sekmeleri görür.

---

## 4. ⚠ Enes'e — canlıya almadan önce mutlaka okunacak

### 4.1 Bu paneldeki giriş sistemi GERÇEK GÜVENLİK DEĞİLDİR

Şifreler HTML dosyasının içinde açık duruyor. Sayfa kaynağını açan herkes görür.
Bu bir **prototiptir** — tarifin doğru anlaşıldığını ve akışın çalıştığını göstermek içindir.

**Canlıya alırken üç seçenekten biri:**

| Seçenek | Süre | Maliyet | Ne zaman |
|---|---|---|---|
| **A. Netlify Identity** | 1 saat | 0 ₺ | Sadece giriş lazımsa. Rolleri Netlify panelinden yönetir. |
| **B. Google Apps Script + oturum** | 3-4 saat | 0 ₺ | Sheets zaten kullanılıyorsa en tutarlı yol. |
| **C. Supabase Auth + RLS** | 1-2 gün | 0 ₺ (ücretsiz kademe) | Gerçek çözüm. Satır bazlı yetki, denetim izi, şifre sıfırlama. |

**Tavsiyem C**, ama **A ile başlayın.** Panel bugün yayına girsin, güvenliği 2. haftada sıkılaştırın.
Şifre koruması olmayan bir panel, hiç panel olmamasından iyidir — çünkü veri disiplini ancak kullanılırsa oturur.

### 4.2 Harita verisi dışarıdan çekiliyor

Panel açılırken İstanbul ilçe sınırlarını şu adresten indiriyor:

```
https://raw.githubusercontent.com/ozanyerli/istanbul-districts-geojson/main/istanbul-districts.json
```

3,5 MB, OpenStreetMap kaynaklı, açık lisanslı. **Ama başkasının deposunda.**

**Yapılacak:** Dosyayı indir, kendi sunucunuza koy (`/harita/istanbul.json`), panelin içindeki `D.geojson` değerini değiştir. Harita yüklenmezse panel zaten bir kutu açıp yeni adres soruyor — oradan da değiştirilebilir.

### 4.3 Çift yönlü senkron — Apps Script

Panelden yapılan değişikliğin Sheets'e yazılması için bu kod gerekir. Panel içinde de var (Veri Kaynağı → "Apps Script kodunu göster"):

```javascript
function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var sh = SpreadsheetApp.openById("SHEET_ID_BURAYA").getSheetByName("ilceler");
  var v  = sh.getDataRange().getValues();
  var bas = v[0];
  var cIlce = bas.indexOf("ilce");
  for (var i = 1; i < v.length; i++) {
    if (String(v[i][cIlce]).trim() === String(d.ilce).trim()) {
      for (var k in d.degisiklik) {
        var c = bas.indexOf(k);
        if (c >= 0) sh.getRange(i + 1, c + 1).setValue(d.degisiklik[k]);
      }
      return ContentService.createTextOutput(JSON.stringify({ok:true, satir:i+1}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ok:false, hata:"ilce bulunamadi"}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

**Kurulum:** Sheets → Uzantılar → Apps Script → kodu yapıştır → `SHEET_ID` yaz → Dağıt → Yeni dağıtım → **Web uygulaması** → Yürütme: *Ben* · Erişim: *Bağlantıya sahip herkes* → çıkan `/exec` adresini panele yapıştır.

**Güvenlik notu:** Bu URL'yi bilen herkes yazabilir. Canlıda basit bir `token` kontrolü ekleyin:
```javascript
if (d.token !== "GIZLI_ANAHTAR") return ContentService.createTextOutput('{"ok":false}');
```

---

## 5. Kurulum — sırayla

1. **Şablonu indirin** — Panel → Veri Kaynağı → "Şablon CSV indir" (39 ilçe, mevcut veriyle)
2. **Google Sheets'e yükleyin** — Dosya → İçe aktar. Sayfa adını `ilceler` yapın. **Sütun başlıklarını değiştirmeyin.**
3. **Yayınlayın** — Dosya → Paylaş → Web'de yayınla → `.csv` → Yayınla
4. **Panele bağlayın** — Çıkan linki Veri Kaynağı'na yapıştırın → "Bağla". Nokta yeşile döner.
5. **Yazma tarafını kurun** — Yukarıdaki Apps Script'i kurun, `/exec` adresini panele yapıştırın, "Bağlantıyı test et".
6. **Siteye koyun** — `netlify.com/drop` adresine HTML dosyasını sürükleyin. 30 saniye. Sonra `istanbul.yedihilal.org` bağlanır.
7. **Şifreleri oluşturun** — `abdulkadir` ile girin → Kullanıcı & Yetki → her koordinatör için ID, şifre, sekme, yetki.
8. **Deneme hesaplarını silin** — Enes, koddaki 5 demo hesabı temizler.

---

## 6. Aylık çalışma düzeni

| Kim | Ne yapar | Ne zaman | Nerede |
|---|---|---|---|
| **İlçe temsilcisi** | 12 kriteri Google Form'dan doldurur | Ayın 1–3'ü | Telefon |
| **Bölge takipçisi** | Kendi hattını arar, doldurmayanı kovalar, **rakamı doğrular** | Ayın 4–5'i | Panel (Karne sekmesi) |
| **Sekreterya (Mücahit)** | Eksikleri tamamlar, ayı arşivler | Ayın 6'sı | Panel + Sheets |
| **Yeni Teşkilat (Oğuzhan)** | 30 hedef ilçenin huni aşamalarını günceller | Ayın 6'sı | Panel (Yeni Teşkilat Hattı) |
| **Başkan** | Karneyi okur, Pazartesi toplantısında **3 karar** alır | Ayın 7'si | Panel (Genel Durum) |

**Kural:** Bölge takipçisinin işi rakamı *toplamak* değil, **doğrulamaktır.** Karnede 20 kişilik Meclis yazan ilçeye gidildiğinde 6 kişi çıkıyorsa, sorun ilçede değil takipçidedir.

---

## 7. Sheets sütun adları

```
ilce · hat · durum · temsilci · tel · risk · oncelik · asama · koordinator_adayi · kurucu_heyet
yk · toplanti · merkez · meclis · yeni_gonullu · yatsiya_kadar · sabah_namazi
ortaokul · lise · bagisci · kurumsal · ozgun_calisma · not
```

**Değer kuralları**
- `durum`: MEVCUT / HEDEF
- `risk`: KRİTİK / Yüksek / Orta / Düşük
- `merkez`: Var / Yok
- `yatsiya_kadar`, `sabah_namazi`: Yapıldı / Yapılmadı
- `asama`: 1 – Koordinatör arayışı · 2 – İlk toplantı · 3 – Kurucu heyet · 4 – Mekân · 5 – Açılış
- `ozgun_calisma`: 3 harften uzun anlamlı açıklama = 5 puan, boş = 0

**Puan ve sınıf tabloya yazılmaz.** Panel, sizin 12 kriterli motorunuzla hesaplar (A≥65 · B≥50 · C≥35 · D<35). Kimse elle puan yazamaz.

---

## 8. Yönetim Kurulu sunumunda söylenecek üç şey

**1. Kapsama: 9/39.** İstanbul'un %77'sinde yokuz. Bu bir suçlama değil, bir haritadır.

**2. En ucuz kazanç yerde duruyor.** «Yatsıya Kadar» programı 9 temsilciliğin **hiçbirinde** yapılmadı. 10 puanlık kriter × 9 ilçe = **90 puan.** Para gerekmez, kadro gerekmez — sadece karar gerekir. Tek bir toplantı kararıyla İstanbul ortalaması **42 → 52**, yani C'den B'ye çıkar.

**3. Sistem değil, insan eksik.** Panel her açılışta şunu kırmızıyla yazıyor: **Haliç ve Trakya hatlarının takipçisi yok.** 25 ilçe — İstanbul'un %64'ü — bugün hiç kimsenin sorumluluğunda değil. Bu iki isim bulunmadan panel, güzel bir rapor ekranından ibaret kalır.

> Sunumu bu üçüncü maddeyle bitirin. Yönetim Kurulu'ndan istenen şey bir onay değil, **iki isimdir.**
