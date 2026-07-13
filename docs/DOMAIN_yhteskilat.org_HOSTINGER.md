# yhteskilat.org — Hostinger DNS Kurulumu (ACİL)

Domain **Hostinger**'da kayıtlı. Nameserver'lar:
- `orbit.dns-parking.com`
- `horizon.dns-parking.com`

## Sorun

A ve CNAME kayıtlarını girdin ama **Hostinger sunucularında henüz görünmüyor** — bu yüzden site açılmıyor.

Kontrol: Authoritative DNS'te `76.76.21.21` yok → kayıtlar ya kaydedilmedi ya da yanlış yere girildi.

---

## Hostinger'da yap (5 dk)

1. **https://hpanel.hostinger.com** → giriş yap
2. **Domains** → **yhteskilat.org**
3. **DNS / DNS Zone / DNS kayıtları** (Manage DNS)
4. **Eski A kaydını sil** (`2.57.91.91` varsa)
5. **Yeni kayıtlar ekle:**

| Tip | Ad | Değer | TTL |
|-----|-----|-------|-----|
| A | @ | 76.76.21.21 | 300 |
| CNAME | www | cname.vercel-dns.com | 300 |

6. **Kaydet / Save** — mutlaka kaydet butonuna bas

---

## Vercel'de yap (2 dk)

1. https://vercel.com/enesceylan190758-5709s-projects/yedihilal-web-proje/settings/domains
2. **Add** → `yhteskilat.org`
3. **Add** → `www.yhteskilat.org`
4. Yeşil tik bekle (SSL otomatik)

---

## Doğrulama

15–30 dk sonra tarayıcıda: **https://www.yhteskilat.org/panel/**

Geçici link (şimdi çalışıyor):
**https://yedihilal-web-proje.vercel.app/panel/**

---

## Not

Domain yeni alındı (`add period`) — ilk 24 saatte DNS bazen gecikir. Kayıtlar Hostinger'da kayıtlıysa en geç birkaç saat içinde açılır.
