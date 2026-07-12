# YediHilal İstanbul Teşkilatlanma Web Projesi

İstanbul il teşkilatlanma birimi için harita ve kontrol paneli araçları.

## Ana uygulama

**`panel/teskilat-paneli-v4.html`** — Teşkilat Kontrol Paneli v4 (canlı)
- 20 sekme, 7 ilke şeridi, kaydet/geri al, dışa aktarma (PDF/Word/Excel/e-posta)
- Ayarlar matrisi: görünürlük, kullanıcı, puanlama motoru
- Gerçek vektör harita (39 ilçe), zoom, bölge renkleri
- Google Sheets CSV okuma / Apps Script yazma
- Kurulum: `docs/ISTANBUL_PANEL_CALISMA_DUZENI_v4.md`

`index.html` doğrudan v4 panele yönlendirir. v3 yedek olarak `/panel/v3` adresinde kalır.

## Diğer araçlar

| Dosya | Açıklama |
|-------|----------|
| `panel/teskilat-paneli-v3.html` | Önceki panel sürümü |
| `harita/canli-teskilat-haritasi.html` | Canlı harita v1, JSON/CSV |
| `harita/istanbul-4-bolge-haritasi.html` | Şematik 4 bölge |
| `harita/harita-boyama-araci.html` | SVG boyama |
| `data/istanbul-districts.json` | GeoJSON (harita araçları) |
| `data/yedihilal_harita_eslestirme.json` | İlçe–şekil eşleştirmesi |

## Yerel çalıştırma

```bash
python3 -m http.server 8080
```

- Panel: http://localhost:8080/panel/teskilat-paneli-v4.html
- Araç listesi: http://localhost:8080/araclar.html

## Canlı adres

https://www.yhteskilat.org/panel/teskilat-paneli-v4

## Deneme hesapları (prototip — canlıda kaldırın)

| ID | Şifre |
|----|-------|
| abdulkadir | yh2026 |
| mucahit | yh2026 |
| mehmet | yh2026 |

## Vercel deploy

Statik site — root'tan deploy edin. `vercel.json` mevcut.

## Sesli asistan

Retell AI modülü: `sesli-asistan/`
