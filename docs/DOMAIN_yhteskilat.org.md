# yhteskilat.org — Domain Kurulumu

## 1. Vercel'de domain ekle

1. https://vercel.com/enesceylan190758-5709s-projects/yedihilal-web-proje/settings/domains
2. **Add Domain** → `yhteskilat.org` yaz → Add
3. Aynı şekilde **`www.yhteskilat.org`** ekle (önerilir)

## 2. Domain sağlayıcında DNS kayıtları

Vercel ekranında gösterilen kayıtları gir. Standart ayar:

### Ana domain (`yhteskilat.org`)

| Tip | Ad | Değer |
|-----|-----|-------|
| **A** | `@` | `76.76.21.21` |

### www (`www.yhteskilat.org`)

| Tip | Ad | Değer |
|-----|-----|-------|
| **CNAME** | `www` | `cname.vercel-dns.com` |

> Bazı sağlayıcılarda apex için **ALIAS/ANAME** veya Vercel nameserver kullanılır. Vercel panelindeki talimatı esas al.

## 3. Bekleme süresi

DNS yayılımı **5 dakika – 48 saat** sürebilir. Vercel'de domain yanında yeşil tik görününce hazır.

## 4. Canlı adresler (domain bağlandıktan sonra)

- https://yhteskilat.org/
- https://www.yhteskilat.org/panel/
- https://yhteskilat.org/panel/ (v4 — birincil panel adresi)

## 5. SSL

Vercel otomatik Let's Encrypt sertifikası verir — ekstra işlem gerekmez.

## Not

Production deploy: `main` branch → `yedihilal-web-proje` projesi.
