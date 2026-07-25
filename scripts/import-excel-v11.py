#!/usr/bin/env python3
"""Excel v11 çalışma dosyasından panel/index.html gömülü D verisini günceller."""
from __future__ import annotations

import json
import re
import unicodedata
from datetime import date, datetime
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
XLSX = Path(
    "/home/ubuntu/.cursor/projects/workspace/uploads/"
    "son_YediHilal_Istanbul_Teskilat_Calisma_Dosyasi_v11__2__94f5.xlsx"
)
HTML = ROOT / "panel" / "index.html"
CONFIG = ROOT / "data" / "panel-config.json"

MEVCUT_ILCELER = {
    "Kağıthane",
    "Bağcılar",
    "Bahçelievler",
    "Esenler",
    "Üsküdar (Kirazlıtepe)",
    "Ümraniye",
    "Kadıköy",
    "Kartal",
    "Pendik",
}

HUNI_ASAMA = {
    1: "1 — Hedef ilçe seçimi",
    2: "2 — İsim bulma / tarama",
    3: "3 — İlk temas / tanışma",
    4: "4 — Değerlendirme",
    5: "5 — Kurucu heyet",
    6: "6 — Deneme dönemi (3 ay)",
    7: "7 — Temsilcilik ilanı",
}


def norm(s: str | None) -> str:
    if s is None:
        return ""
    t = str(s).strip()
    t = unicodedata.normalize("NFKD", t)
    t = "".join(c for c in t if not unicodedata.combining(c))
    return re.sub(r"\s+", " ", t).casefold()


def fmt_tel(raw) -> str:
    if raw is None:
        return "—"
    s = re.sub(r"\D", "", str(raw))
    if len(s) == 11 and s.startswith("0"):
        return f"{s[:4]} {s[4:7]} {s[7:9]} {s[9:]}"
    if len(s) == 10:
        return f"0{s[0:3]} {s[3:6]} {s[6:8]} {s[8:]}"
    return str(raw).strip()


def fmt_date(v) -> str:
    if v is None:
        return "—"
    if isinstance(v, datetime):
        return v.strftime("%d.%m.%Y")
    if isinstance(v, date):
        return v.strftime("%d.%m.%Y")
    s = str(v).strip()
    return s if s else "—"


def deger_map(v: str | None) -> str:
    m = {
        "MAKUL": "Gerçekçi",
        "İNŞALLAH": "İnşallah",
        "GERÇEKÇİ": "Gerçekçi",
    }
    return m.get(str(v or "").strip().upper(), str(v or "").strip() or "Gerçekçi")


def ilce_key(ad: str) -> str:
    return norm(ad.replace("✓", "").split("(")[0])


def load_d() -> tuple[dict, str, int, int]:
    html = HTML.read_text(encoding="utf-8")
    start = html.index("const D = ")
    end = html.index("/* ============ DURUM ============ */")
    blob = html[start + 9 : end].strip().rstrip(";")
    return json.loads(blob), html, start, end


def save_d(D: dict, html: str, start: int, end: int) -> None:
    blob = json.dumps(D, ensure_ascii=False, separators=(",", ":"))
    new_html = html[:start] + "const D = " + blob + ";\n" + html[end:]
    HTML.write_text(new_html, encoding="utf-8")


def parse_hatlar(ws) -> dict:
    hatlar = {}
    for row in (7, 8):
        kod = ws.cell(row, 1).value
        if not kod:
            continue
        hatlar[str(kod)] = {
            "kod": str(kod),
            "ad": f"{'AVRUPA' if kod == 'AVR' else 'ANADOLU'} HATTI",
            "yaka": "AVRUPA" if kod == "AVR" else "ANADOLU",
            "takipci": str(ws.cell(row, 4).value or ""),
            "ilce": int(ws.cell(row, 5).value or 0),
            "mevcut": int(ws.cell(row, 6).value or 0),
            "not": str(ws.cell(row, 8).value or ""),
        }
    return hatlar


def parse_kunye(ws) -> dict[str, dict]:
    out = {}
    for r in range(39, 50):
        ad = ws.cell(r, 2).value
        if not ad or str(ad).startswith("İstanbul"):
            continue
        out[str(ad).strip()] = {
            "temsilci": str(ws.cell(r, 5).value or "—"),
            "risk": str(ws.cell(r, 6).value or "—"),
            "takipci": str(ws.cell(r, 4).value or ""),
            "yaka": str(ws.cell(r, 3).value or ""),
        }
    return out


def parse_hedef_ilceler(ws) -> dict[str, dict]:
    out = {}
    for r in range(58, 88):
        ad = ws.cell(r, 2).value
        if not ad or not isinstance(ad, str) or ad.startswith("SARI"):
            continue
        asama_raw = ws.cell(r, 8).value
        asama = HUNI_ASAMA.get(int(asama_raw), HUNI_ASAMA[1]) if asama_raw else HUNI_ASAMA[1]
        out[ilce_key(ad)] = {
            "onc": int(ws.cell(r, 4).value or 3),
            "not": str(ws.cell(r, 3).value or ""),
            "asama": asama,
            "takipci": str(ws.cell(r, 6).value or ""),
            "yaka": str(ws.cell(r, 5).value or ""),
            "donem": str(ws.cell(r, 9).value or ""),
            "aday_say": ws.cell(r, 7).value,
        }
    return out


def parse_ekip(ws) -> list:
    rows = []
    for r in range(6, 16):
        ad = ws.cell(r, 2).value
        if not ad:
            continue
        rows.append(
            [
                str(ad),
                str(ws.cell(r, 3).value or ""),
                str(ws.cell(r, 6).value or ""),
                str(ws.cell(r, 4).value or ""),
                str(ws.cell(r, 5).value or ""),
                str(ws.cell(r, 8).value or ""),
                fmt_tel(ws.cell(r, 7).value),
            ]
        )
    return rows


def parse_reis(ws) -> list:
    rows = []
    for r in range(6, 20):
        no = ws.cell(r, 1).value
        talep = ws.cell(r, 2).value
        if not isinstance(no, int) or not talep:
            continue
        rows.append(
            [
                no,
                str(talep),
                deger_map(ws.cell(r, 3).value),
                str(ws.cell(r, 7).value or "Başlamadı"),
                str(ws.cell(r, 4).value or ""),
                str(ws.cell(r, 5).value or ""),
                fmt_date(ws.cell(r, 6).value),
                str(ws.cell(r, 8).value or ""),
            ]
        )
    return rows


def parse_birim_hedef(ws) -> list:
    rows = []
    for r in range(11, 30):
        no = ws.cell(r, 1).value
        hedef = ws.cell(r, 2).value
        if not isinstance(no, int) or not hedef:
            continue
        rows.append(
            [
                no,
                str(hedef),
                str(ws.cell(r, 3).value or ""),
                fmt_date(ws.cell(r, 4).value),
                str(ws.cell(r, 5).value or ""),
                str(ws.cell(r, 6).value or "Başlamadı"),
            ]
        )
    return rows


def parse_kriter(ws) -> list:
    alan_map = {
        1: "yk",
        2: "toplanti",
        3: "merkez",
        4: "meclis",
        5: "yeni",
        6: "yatsi",
        7: "sabah",
        8: "ortaokul",
        9: "lise",
        10: "bagisci",
        11: "kurumsal",
        12: "ozgun",
    }
    tip_map = {"Sayı": "sayi", "Var/Yok": "var", "Evet/Hayır": "var", "Var/Yok (metin)": "metin"}
    rows = []
    for r in range(19, 31):
        no = ws.cell(r, 1).value
        ad = ws.cell(r, 2).value
        if not isinstance(no, int) or not ad:
            continue
        kat = ws.cell(r, 4).value
        if kat == "—":
            kat = 1
        rows.append(
            {
                "no": no,
                "ad": str(ad),
                "alan": alan_map.get(no, f"k{no}"),
                "tip": tip_map.get(str(ws.cell(r, 3).value or ""), "sayi"),
                "kat": float(kat) if isinstance(kat, (int, float)) else 1,
                "max": int(ws.cell(r, 5).value or 0),
            }
        )
    return rows


def parse_huni(ws) -> list:
    rows = []
    for r in range(8, 15):
        no = ws.cell(r, 1).value
        ad = ws.cell(r, 2).value
        if not isinstance(no, int) or not ad:
            continue
        rows.append(
            [
                f"{no} — {ad}",
                str(ws.cell(r, 5).value or ""),
                str(ws.cell(r, 3).value or ""),
            ]
        )
    return rows


def parse_aday(ws, ilce_names: list[str]) -> list:
    rows = []
    durum_map = {
        "TANIŞILACAK": "İzleniyor",
        "GÖRÜŞME YAPILACAK": "İzleniyor",
        "HAZIR": "Hazır",
        "YETİŞİYOR": "Yetişiyor",
    }
    by_key = {norm(n): n for n in ilce_names}

    def resolve_ilce(raw: str) -> str:
        key = norm(raw)
        if key in by_key:
            return by_key[key]
        for k, name in by_key.items():
            if key in k or k in key:
                return name
        return raw.strip().title()

    for r in range(103, 133):
        ad = ws.cell(r, 2).value
        ilce = ws.cell(r, 3).value
        if not ad:
            continue
        kim = str(ws.cell(r, 4).value or "")
        durum_raw = str(ws.cell(r, 8).value or ws.cell(r, 7).value or "İzleniyor")
        durum = durum_map.get(durum_raw.split(",")[0].strip().upper(), "İzleniyor")
        ilce_ad = resolve_ilce(str(ilce))
        rows.append(
            [
                str(ad).title(),
                ilce_ad,
                0,
                str(ws.cell(r, 7).value or "—"),
                kim,
                kim.split()[0] if kim else "—",
                durum,
            ]
        )
    return rows


def parse_prog_katilim(ws) -> dict:
    out = {}
    for r in range(6, 16):
        ad = ws.cell(r, 2).value
        if not ad:
            continue
        out[str(ad)] = [[0, 0], [0, 0], [0, 0]]
    return out


def parse_ziyaret_kontrol(ws) -> list:
    items = []
    for r in range(15, 34):
        txt = ws.cell(r, 2).value
        if txt and not str(txt).startswith("ZİYARET"):
            items.append(str(txt))
    return items


def parse_arama(ws) -> list:
    items = []
    for r in range(15, 27):
        txt = ws.cell(r, 2).value
        if txt:
            items.append(f"«{txt}»")
    return items


def parse_programlar(ws) -> list:
    progs = []
    for r in range(23, 37):
        ad = ws.cell(r, 2).value
        if not ad:
            continue
        tarih = ws.cell(r, 6).value or ws.cell(r, 7).value
        progs.append({"ad": str(ad), "tarih": str(tarih) if tarih else "—"})
    return progs[:3]  # panel uses 3 big programs


def parse_ritim(ws_veri, ws_takvim) -> list:
    rows = []
    for r in range(20, 24):
        baslik = ws_veri.cell(r, 3).value
        if not baslik:
            continue
        rows.append(
            [
                str(ws_veri.cell(r, 7).value or "—"),
                "—",
                str(baslik),
                str(ws_veri.cell(r, 7).value or "—"),
                str(ws_veri.cell(r, 4).value or "—"),
            ]
        )
    extra = [
        ["Salı–Çarşamba", "—", "Bölge turu — Her takipçi kendi yakasındaki temsilcilikleri arar.", "—", "Bölge takipçileri"],
        ["Perşembe 14–18", "—", "Saha yarım günü — Temsilcilik ziyareti veya aday görüşmesi.", "—", "Başkan + Ziyaret Birimi"],
        ["Cuma", "—", "REİS'E HAFTALIK ÖZET — 5 madde", "Yazılı", "Birim Başkanı"],
    ]
    return rows + extra


def parse_birim(ekip_rows: list) -> list:
    def find(gorev_part: str, default: str) -> str:
        for e in ekip_rows:
            if gorev_part.upper() in e[1].upper():
                return e[0]
        return default

    return [
        ["Birim Başkanlığı", "VAR", find("BİRİM BAŞKANI", "Abdülkadir Yaşar"), "Bütün birimden Reis'e karşı sorumlu.", "—", "—"],
        ["Sekreterya", "VAR", find("SEKRETERYA", "Mücahit Tiryaki"), "Duyuru, tutanak, rapor toplama, arşiv.", "—", "—"],
        ["Bölge Takip (2 yaka)", "VAR", f"{find('AVRUPA', 'Eyüp Yazıcı')} + {find('ANADOLU', 'Serdar Alkurt')}", "Her yaka bir kişiye. Arar, ziyaret eder, raporlar.", "—", "—"],
        ["Arama Birimi", "VAR", f"{find('AVRUPA YAKASI', 'Oğuzhan Koçalak')} + {find('ANADOLU YAKASI', 'Mehmet Menteş')}", "Aylık karne araması. 12 soru, 9 temsilcilik.", "—", "—"],
        ["Yeni Teşkilat", "VAR", f"{find('AVRUPA', 'Eyüp Yazıcı')} + {find('ANADOLU', 'Serdar Alkurt')}", "30 hedef ilçede koordinatör arayışı.", "—", "—"],
        ["Ziyaret ve Denetim", "VAR", f"{find('ZİYARET', 'Burak İncecik')} / {find('ZİYARET', 'Hakan Ayva')}", "Standart formla temsilcilik ziyareti.", "—", "—"],
        ["Kamp Organizasyonu", "VAR", f"{find('KAMP', 'Ömer Faruk Balta')} / {find('KAMP', 'Nusret')}", "İl Teşkilat Kampı ve çadır kampı organizasyonu.", "—", "—"],
    ]


def update_ilceler(D: dict, kunye: dict, hedef: dict, hatlar: dict) -> None:
    by_key = {ilce_key(i["ad"]): i for i in D["ilceler"]}
    for il in D["ilceler"]:
        ad = il["ad"]
        if ad in MEVCUT_ILCELER:
            il["durum"] = "MEVCUT"
            k = kunye.get(ad, {})
            il["temsilci"] = k.get("temsilci", il.get("temsilci", "—"))
            il["risk"] = k.get("risk", il.get("risk", "—"))
            if k.get("takipci"):
                il["takipci"] = k["takipci"]
            il["asama"] = "Mevcut temsilcilik"
        else:
            il["durum"] = "HEDEF"
            il["temsilci"] = "—"
            il["tel"] = "—"
            il["risk"] = "—"
            h = hedef.get(ilce_key(ad), {})
            if h:
                il["onc"] = h.get("onc", il.get("onc", 3))
                il["not"] = h.get("not", il.get("not", ""))
                il["asama"] = h.get("asama", HUNI_ASAMA[1])
                if h.get("takipci"):
                    il["takipci"] = h["takipci"]
            hat = il.get("hat", "AVR")
            if hat in hatlar:
                il["hatAd"] = hatlar[hat]["ad"]
                il["yaka"] = hatlar[hat]["yaka"]


def update_config(ekip_rows: list) -> None:
    if not CONFIG.exists():
        return
    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    gorev_by_name = {e[0]: e[1] for e in ekip_rows}
    tel_by_name = {e[0]: e[6] for e in ekip_rows}
    mapping = {
        "Abdülkadir Yaşar": "abdulkadir",
        "Mücahit Tiryaki": "mucahit",
        "Oğuzhan Koçalak": "oguzhan",
        "Mehmet Menteş": "mehmet",
        "Serdar Alkurt": "serdar",
        "Burak İncecik": "burak",
        "Ömer Faruk Balta": "omer",
        "Eyüp Yazıcı": "eyup",
        "Hakan Ayva": "hakan",
        "Nusret Onur Anlı": "nusret",
    }
    users = {u["id"]: u for u in cfg["kullanicilar"]}
    for ad, uid in mapping.items():
        if ad not in gorev_by_name:
            continue
        gorev = gorev_by_name[ad]
        tel = tel_by_name.get(ad, "")
        if uid in users:
            users[uid]["gorev"] = gorev.replace("BÖLGE SORUMLUSU — ", "Bölge Takipçisi — ").replace("BÖLGE TAKİPÇİSİ", "Bölge Takipçisi")
            if tel and tel != "—":
                users[uid]["tel"] = tel
        else:
            cfg["kullanicilar"].append(
                {
                    "id": uid,
                    "sifre": "",
                    "ad": ad,
                    "gorev": gorev,
                    "tel": tel,
                    "rol": "uye" if "KAMP" in gorev or "ZİYARET" in gorev else "koordinator",
                    "yetki": "gor",
                    "sekmeler": ["genel", "takvim", "program", "ozet", "kilavuz"],
                }
            )
    CONFIG.write_text(json.dumps(cfg, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    D, html, start, end = load_d()
    old_ilceler = {il["ad"]: il for il in D["ilceler"]}

    ws_bolge = wb["04 BÖLGE YAPISI"]
    ws_ekip = wb["03 EKİP VE GÖREV"]
    ws_reis = wb["02 BAŞKAN TALEPLERİ"]
    ws_birim = wb["01 BİRİM PLANI"]
    ws_karne = wb["06 PERFORMANS KARNESİ"]
    ws_huni = wb["12 YENİ TEŞKİLAT HUNİSİ"]
    ws_kamp = wb["09 KAMP TAAHHÜD TAKİP"]
    ws_ziyaret = wb["08 ZİYARET FORMU"]
    ws_rapor = wb["07 AYLIK RAPOR FORMU"]
    ws_takvim = wb["10 TAKVİM VE ZİYARETLER"]
    ws_veri = wb["VERİ"]
    ws_tems = wb["05 TEMSİLCİLİK"]

    hatlar = parse_hatlar(ws_bolge)
    kunye = parse_kunye(ws_tems)
    hedef = parse_hedef_ilceler(ws_huni)
    ekip = parse_ekip(ws_ekip)

    D["hatlar"] = hatlar
    update_ilceler(D, kunye, hedef, hatlar)
    D["ekip"] = ekip
    D["reis"] = parse_reis(ws_reis)
    D["birimHedef"] = parse_birim_hedef(ws_birim)
    D["kriter"] = parse_kriter(ws_karne)
    D["huni"] = parse_huni(ws_huni)
    D["aday"] = parse_aday(ws_huni, [i["ad"] for i in D["ilceler"]])
    D["progKatilim"] = parse_prog_katilim(ws_kamp)
    D["ziyaretKontrol"] = parse_ziyaret_kontrol(ws_ziyaret)
    D["arama"] = parse_arama(ws_rapor)
    D["programlar"] = parse_programlar(ws_takvim)
    D["ritim"] = parse_ritim(ws_veri, ws_takvim)
    D["birim"] = parse_birim(ekip)
    D["esik"] = {"A": 65, "B": 50, "C": 35}

    # Misyon metni (01 BİRİM PLANI satır 6)
    misyon = ws_birim.cell(6, 1).value
    if misyon:
        D["motto"] = [
            "«Nizamsız hâk, nizamlı bâtıla mağlûb olur.»",
            "Mustafa Sabri Efendi",
            str(misyon)[:200],
        ]

    # Preserve geometry / harita from old data
    for il in D["ilceler"]:
        old = old_ilceler.get(il["ad"])
        if old:
            for k in ("lat", "lon", "ykHedef", "heyet", "yk", "toplanti", "merkez", "meclis", "yeni", "yatsi", "sabah", "ortaokul", "lise", "bagisci", "kurumsal", "ozgun", "tel", "aday"):
                if k in old and il["durum"] == "MEVCUT":
                    if k in ("temsilci", "risk", "durum", "asama", "onc", "not", "takipci", "hat", "hatAd", "yaka"):
                        continue
                    il[k] = old[k]

    save_d(D, html, start, end)
    update_config(ekip)

    mevcut = sum(1 for x in D["ilceler"] if x["durum"] == "MEVCUT")
    print(f"OK — Excel v11 → panel/index.html")
    print(f"  ilceler: {len(D['ilceler'])} ({mevcut} MEVCUT)")
    print(f"  ekip: {len(D['ekip'])} · reis: {len(D['reis'])} · birimHedef: {len(D['birimHedef'])}")
    print(f"  aday: {len(D['aday'])} · huni: {len(D['huni'])} · kriter: {len(D['kriter'])}")


if __name__ == "__main__":
    main()
