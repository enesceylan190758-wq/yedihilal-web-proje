# YediHilal İstanbul Teşkilatlanma Web Projesi

İstanbul il teşkilatlanma birimi için harita ve takip araçları.

## Araçlar

| Dosya | Açıklama |
|-------|----------|
| `index.html` | Ana giriş sayfası |
| `harita/canli-teskilat-haritasi.html` | Canlı harita, KPI, ilçe karnesi, CSV/JSON |
| `harita/istanbul-4-bolge-haritasi.html` | Şematik 4 bölge haritası (toplantı) |
| `harita/harita-boyama-araci.html` | SVG boyama aracı |
| `data/yedihilal_harita_eslestirme.json` | İlçe–harita şekli eşleştirmesi |

## Yerel çalıştırma

```bash
python3 -m http.server 8080
```

Tarayıcı: http://localhost:8080

## Vercel deploy

Statik site — `vercel.json` mevcut. Root'tan deploy edin.

## Sesli asistan (ayrı modül)

Retell AI sesli asistan dosyaları `sesli-asistan/` klasöründe.
