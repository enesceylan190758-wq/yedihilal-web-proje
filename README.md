# YediHilal İstanbul Teşkilatlanma Web Projesi

İstanbul il teşkilatlanma birimi için harita ve kontrol paneli araçları.

## Ana uygulama

**`panel/teskilat-paneli-v3.html`** — Teşkilat Kontrol Paneli v3
- Gerçek vektör harita (39 ilçe), zoom, bölge renkleri
- İlçe karnesi, takvim, komisyon, yetki sistemi
- Google Sheets CSV okuma / Apps Script yazma
- Kurulum: `docs/ISTANBUL_PANEL_CALISMA_DUZENI_v3.md`

`index.html` doğrudan panele yönlendirir.

## Diğer araçlar

| Dosya | Açıklama |
|-------|----------|
| `harita/canli-teskilat-haritasi.html` | Canlı harita v1, JSON/CSV |
| `harita/istanbul-4-bolge-haritasi.html` | Şematik 4 bölge |
| `harita/harita-boyama-araci.html` | SVG boyama |
| `data/istanbul-districts.json` | Panel harita verisi (GeoJSON) |
| `data/yedihilal_harita_eslestirme.json` | İlçe–şekil eşleştirmesi |

## Yerel çalıştırma

```bash
python3 -m http.server 8080
```

- Panel: http://localhost:8080/panel/teskilat-paneli-v3.html
- Araç listesi: http://localhost:8080/araclar.html

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
