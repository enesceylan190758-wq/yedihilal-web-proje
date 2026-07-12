# YediHilal İstanbul — Teşkilat Kontrol Paneli
## Çalışma Düzeni, Kurulum ve Teslim Dosyası

**Sürüm:** v4 (canlıya hazır) · Temmuz 2026
**Hazırlayan:** Teşkilatlanma Birimi
**Sunulacak:** İl Yönetim Kurulu
**Canlıya alacak:** Enes

> **İMAN · İLİM · İSTİŞARE · İRFAN · HİKMET · AHLAK · HAREKET**
> *«Nizamsız hâk, nizamlı bâtıla mağlûb olur.»* — Mustafa Sabri Efendi

---

## 1. SORUNUZUN CEVABI: 26 Excel sekmesi → 20 panel sekmesi

İki dosyanızda toplam **26 sekme** var (18+9 değil):
- **Çalışma Dosyası:** 20 sekme (0–19)
- **Karne Dashboard:** 6 sekme (0–5)

Panelde **20 sekme** var. **Hiçbir içerik kaybolmadı.** Fark şuradan geliyor:

### 1:1 taşınanlar (13 sekme)

| Excel | Panel |
|---|---|
| ÇD-7 Bölge Yapısı | Bölge Yapısı |
| ÇD-14 Yıllık Takvim | Takvim |
| ÇD-15 Program Katılım | **Program & Kamp** ★ |
| ÇD-16 STK İlişkileri | STK İlişkileri |
| ÇD-2 Vizyon 3 Yıl | 3 Yıllık Vizyon |
| ÇD-3 Birim Planı | Birim Planı |
| ÇD-4 Reisin İstekleri | Reis'in İstekleri |
| ÇD-5 Ekip Değerlendirme | Ekip Değerlendirme |
| ÇD-11 Aday Havuzu | Aday Havuzu |
| ÇD-12 Ziyaret Formu | **Ziyaret Formu** ★ |
| ÇD-17 Faaliyet Raporu | **Faaliyet Raporu** ★ |
| ÇD-18 Toplantı Tutanağı | **Toplantı Tutanağı** ★ |
| KD-4 Aylık Arşiv | **Aylık Arşiv** ★ |

★ = v4'te yeni eklendi. Önceki sürümlerde bunlar eksikti — haklıydınız.

### Birleştirilenler (10 Excel sekmesi → 5 panel sekmesi)

| Excel sekmeleri | Panel | Neden birleştirildi |
|---|---|---|
| ÇD-1 Panel + KD-5 Dashboard + ÇD-8 İlçe Haritası | **Genel Durum** | Üçü de aynı özeti gösteriyordu. Excel'de ayrıydı çünkü Excel'de canlı harita+dashboard aynı sayfada olamaz. Panelde olur. |
| KD-3 Veri Girişi + ÇD-9 İlçe Envanteri (9 mevcut) | **Karne** | Aynı 9 temsilcilik, aynı 12 kriter. Excel'de iki dosyada tekrar ediyordu. |
| ÇD-10 Yeni Teşkilat Hattı + ÇD-9 İlçe Envanteri (30 hedef) | **Yeni Teşkilat Hattı** | Aynı 30 ilçe. |
| ÇD-6 Komisyon Birimleri + ÇD-13 Haftalık Ritim | **Komisyon & Ritim** | "Kim ne yapar" + "ne zaman yapar" — aynı konu. |
| ÇD-0 OKU BENİ + KD-0 Kullanım + KD-2 Arama Kılavuzu | **Kılavuz** | Üç kullanım kılavuzu. |

### Taşınan (1)
**KD-1 AYAR** (12 kriterin katsayı/tavanları) → **Ayarlar** sekmesinin 3. bölümü.

### Alınmayan (1)
**ÇD-19 BOŞ ŞABLON** — Excel'de yeni satır eklemek için boş şablon gerekiyordu. Panelde her tabloda **+ Ekle** butonu var; boş şablona gerek kalmadı.

> **Özet:** 13 (1:1) + 10 (birleşme) + 1 (taşıma) + 1 (gereksiz) + 1 (İlçe Envanteri iki yere bölündü, iki kez sayıldı) = **26 Excel sekmesi tamamen karşılandı.**

---

## 2. v4'te eklenenler

| İstediğiniz | Yapıldı |
|---|---|
| **7 İlke** ana ekranda | Üst barda 7 hilal: İMAN · İLİM · İSTİŞARE · İRFAN · HİKMET · AHLAK · HAREKET (Excel'inizin OKU BENİ sekmesinden aldım) |
| Yazılar bir punto büyük, koyu | Tüm punto +1, gri tonlar koyulaştırıldı |
| **Kaydet butonu** | Sağ altta, değişiklik yapınca beliriyor: kaç değişiklik var + **Kaydet** + **Geri Al** |
| **Eksik sekmeler** | Program & Kamp · Ziyaret Formu · Faaliyet Raporu · Toplantı Tutanağı · Aylık Arşiv · Kılavuz eklendi |
| **Dışa aktarma çipi** | Her sayfanın sağ üstünde: **PDF · Word (.doc) · Excel (.xlsx) · E-posta** |
| **Grafik gösterim butonu** | KPI şeridi, Hat Karnesi, Sıralama, Kriter Analizi, Program, Arşiv — her birinde **Sayı ↔ Grafik** geçişi |
| **Ayarlar paneli** | Son sekme. Kim hangi sekmeyi görecek matrisi + kullanıcı ekle/çıkar + ID/şifre + puanlama motoru |

### Yeni sekmelerin işlevi (sadece tablo değil, çalışıyor)

- **Faaliyet Raporu:** 12 soruyu doldurun → puan **anında hesaplanır** → "Karneye İşle" ile o temsilciliğin karnesi ve aylık arşivi güncellenir.
- **Ziyaret Formu:** 19 maddelik kontrol listesi. Kaydedilen ziyaretler listeye düşer.
- **Aylık Arşiv:** 12 aylık puan tarihçesi + trend okları (▲▼) + **çizgi grafik** (A sınıfı eşiği kesikli altın çizgi).
- **Program & Kamp:** Her temsilcilik için HEDEF/KATILAN. Hedefi tutturan yeşil, tutturamayan kırmızı.
- **Toplantı Tutanağı:** 9 maddelik sabit gündem + karar tablosu (NE + KİM + NE ZAMAN).
- **Kılavuz:** Telefonda birebir okunacak 12 cümle + 7 adımlı arama akışı + bu Excel↔panel eşleşme tablosu.

---

## 3. Ayarlar paneli — nasıl çalışır?

`abdulkadir` ile girin → **Ayarlar** sekmesi açılır.

**1. bölüm — Görünürlük matrisi.** Satır = sekme, sütun = kullanıcı.
- **HERKES** sütunu: giriş yapmamış YK üyesinin göreceği sekmeler. Gizli sekmeler (Reis, Ekip, Birim Planı…) buraya açılamaz — sistem izin vermiyor.
- Diğer sütunlar: o kişi giriş yaptığında ne görecek. Kutucuğu işaretleyin/kaldırın, menü **anında** değişir.

**2. bölüm — Kullanıcılar.** + Şifre ve ID Oluştur → ad, görev, ID, şifre, telefon, yetki (Sadece görsün / Sadece veri girsin / Hem görsün hem veri girsin), sekme seçimi. Mevcut kullanıcıya tıklayıp düzenleyin veya silin.

**3. bölüm — Puanlama motoru.** 12 kriterin adı, katsayısı ve tavan puanı. Sınıf eşikleri (A≥65, B≥50, C≥35). Değiştirdiğinizde **bütün karneler anında yeniden hesaplanır.**

---

## 4. Dışa aktarma — nasıl çalışıyor?

Her sayfanın sağ üstündeki **Dışa Aktar** çipi:

| Format | Nasıl çalışır |
|---|---|
| **PDF** | Yeni pencerede yazdırma önizlemesi açılır → "Hedef: PDF olarak kaydet" seçin |
| **Word** | `.doc` dosyası iner, Word'de biçimli açılır |
| **Excel** | `.xlsx` dosyası iner (SheetJS ile) |
| **E-posta** | Mail programınız açılır, sayfa özeti gövdeye yazılır |

**E-posta hakkında dürüst not:** Tarayıcı güvenliği nedeniyle mailto ile **dosya eki eklenemez**. Panel maile özet metni yazıyor; dosyayı ayrıca indirip elle ekleyeceksiniz. Otomatik ekli mail isterseniz Enes'in Apps Script'e `MailApp.sendEmail()` eklemesi gerekir (20 satır).

---

## 5. Deneme hesapları

> **Güncelleme:** Şifreler artık `data/panel-config.json` dosyasında. Demo `yh2026` kaldırıldı.

| ID | Kim | Yetki | Sekme |
|---|---|---|---|
| `abdulkadir` | Abdülkadir Yaşar — Teşkilat Başkanı | Tam yetki | **20** (hepsi + Ayarlar) |
| `mucahit` | Mücahit Tiryaki — Sekreterya | Görür + veri girer | 9 |
| `oguzhan` | Oğuzhan Koçalak — Yeni Teşkilat | Görür + veri girer | 8 |
| `mehmet` | Mehmet Menteş — B4 Takipçisi | Görür + veri girer | 9 |
| `nusret` | Nusret Onur Anlı — B3 Takipçisi | **Sadece görür** | 7 |

Giriş yapmadan: **10 sekme** (YK üyesinin göreceği).

Şifreler için: [`docs/KURULUM_v4_OPERASYON.md`](KURULUM_v4_OPERASYON.md)

---

## 6. ⚠ Enes'e — canlıya almadan önce

### 6.1 Giriş sistemi gerçek güvenlik DEĞİL
Şifreler HTML kaynağında açık. Bu bir prototip — akışın doğruluğunu gösterir.
**Canlıda:** Netlify Identity (1 saat) veya Supabase Auth + RLS (1-2 gün). **Ama önce yayına alın** — kullanılmayan panelde veri disiplini oturmaz.

### 6.2 Değişiklikler bellekte, kaydet butonu Sheets'e yazar
Panel yenilenince yapılan değişiklikler kaybolur (tarayıcı depolaması bilinçli olarak kullanılmadı). **Kaydet** butonu Apps Script üzerinden Sheets'e yazar. Kalıcılık Sheets'tedir.

### 6.3 Apps Script (çift yönlü senkron)
Kod panelin içinde: **Veri Kaynağı → "Apps Script kodunu göster"**.
`SHEET_ID`'yi yazın, "Bağlantıya sahip herkes" olarak dağıtın, `/exec` adresini panele yapıştırın.
**Mutlaka bir `token` kontrolü ekleyin** — yoksa linki bilen herkes tablonuza yazar.

### 6.4 Harita
39 ilçe **dosyanın içine gömülü** — internet gerekmiyor.
Kaynak: sizin `Istanbul_districts_map_updated.svg` dosyanız. Eski taksimattaki 10 yeni ilçe (Sultangazi, Başakşehir, Esenyurt, Beylikdüzü, Ataşehir, Çekmeköy, Sancaktepe, Bayrampaşa, Arnavutköy) ana ilçelerinin içinden coğrafi konumlarına göre ayrıldı. Dış sınırlar gerçek, bu 9 ilçenin **iç sınırları yaklaşıktır**.
*(`svg_hali.svg` kullanılamadı — o bir PNG resmi, vektör değil.)*

### 6.5 Excel dışa aktarma CDN'e bağlı
SheetJS `cdnjs.cloudflare.com`'dan yükleniyor. İnternetsiz ortamda Excel indirme çalışmaz (PDF ve Word çalışır). İsterseniz Enes kütüphaneyi yanına indirsin.

---

## 7. Aylık çalışma düzeni

| Kim | Ne yapar | Ne zaman | Nerede |
|---|---|---|---|
| **Arayan görevli** | Kılavuz'daki 12 cümleyi telefonda birebir okur | Ayın son haftası | Kılavuz sekmesi |
| **Arayan görevli** | Cevapları anında girer, puan otomatik çıkar | Arama sırasında | Faaliyet Raporu |
| **Bölge takipçisi** | Rakamı **doğrular** (toplamaz — doğrular) | Ayın 4–5'i | Karne |
| **Sekreterya** | Puanları arşive işler | Ay bitince | Aylık Arşiv → "Arşive İşle" |
| **Başkan** | Karneyi okur, Pazartesi 3 karar alır | Ayın 7'si | Genel Durum + Toplantı Tutanağı |

---

## 8. Yönetim Kurulu sunumunda söylenecek üç şey

**1. Kapsama: 9/39.** İstanbul'un %77'sinde yokuz. Bu bir suçlama değil, bir haritadır.

**2. En ucuz kazanç yerde duruyor.** «Yatsıya Kadar» 9 temsilciliğin **hiçbirinde** yapılmadı. 10 puan × 9 ilçe = **90 puan.** Para gerekmez, kadro gerekmez — karar gerekir. Bir toplantı kararıyla İstanbul ortalaması **42 → 52**, C'den B'ye çıkar.

**3. Sistem değil, insan eksik.** Panel her açılışta kırmızıyla yazıyor: **Haliç ve Trakya hatlarının takipçisi yok.** 25 ilçe — İstanbul'un %64'ü — bugün hiç kimsenin sorumluluğunda değil.

> Sunumu üçüncü maddeyle bitirin. Kuruldan istenen bir onay değil, **iki isimdir.**
