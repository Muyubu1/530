# 5.30 Landing — İçerik / Metin Şablonu

> **Nasıl kullanılır:** Aşağıdaki her satırda `[ID]` sabit bir anahtardır — **değiştirme.**
> Sadece `→` işaretinden sonraki **metni** düzenle. Bu dosyayı aynı yapıda bana geri ver;
> ID'lerden eşleştirip web arayüzüne (`src/ui/features/marketing/landing-page.tsx`) aktarırım.
>
> - Boş bırakmak istediğin alanı silme; "—" yaz veya olduğu gibi bırak.
> - Çok satırlı metinlerde satırı bölme; `<br>` yazarsan alt satır olur.
> - Büyük/küçük harf ve noktalama önemli (tasarım uppercase/italic uyguluyor, sen normal yaz).
>
> Kaynak dosyalar: metinler `src/ui/features/marketing/landing-page.tsx`,
> SEO başlık/açıklama `src/routes/index.tsx`.

---

## 1) Sinematik Tırmanış — Açılış (Hero / SEG 0)

Konum: tam ekran ilk kare (büyük "5.30").

- [HERO_TL] Sol üst etiket → DİSİPLİN · İNANÇ · KARDEŞLİK
- [HERO_TR] Sağ üst etiket → BECOME THE MAN
- [HERO_BL] Sol alt etiket → 05:30 — OLUŞUM
- [HERO_BIG] Dev başlık → 5.30
- [HERO_SUB] Alt satır → Sıradan bir adamdan, sıra dışı bir adama.
- [HERO_HINT] Kaydırma ipucu → AŞAĞI KAYDIR

---

## 2) Sinematik Tırmanış — Hikaye Kareleri (SEG 1–7)

Konum: hero'dan sonra, her görselle gelen 2 satırlık altyazılar. `STAIR` = arkadaki dev silik kelime(ler). `HUD` = sağdaki dikey ilerleme etiketi.

### Kare 1 — (görsel 2)

- [S1_HUD] HUD kelimesi → DİPTE
- [S1_L1] 1. satır → Yalnız değilsin.

### Kare 2 — (görsel 3)

- [S2_HUD] HUD kelimesi → SABIR
- [S2_STAIR] Arka dev kelime → SABIR
- [S2_L1] 1. satır → Başlamak en zoru.

### Kare 3 — (görsel 4)

- [S3_HUD] HUD kelimesi → AZİM
- [S3_STAIR1] Arka dev kelime (üst) → DİSİPLİN
- [S3_STAIR2] Arka dev kelime (alt) → AZİM
- [S3_L1] 1. satır → Bugün başlamasın.

### Kare 4 — (görsel 5)

- [S4_HUD] HUD kelimesi → İNANÇ
- [S4_STAIR1] Arka dev kelime (üst) → DÜRÜSTLÜK
- [S4_STAIR2] Arka dev kelime (alt) → İNANÇ
- [S4_L1] 1. satır → İlerleyen adam,
- [S4_L2] 2. satır → başlayan adam değildir.

### Kare 5 — (görsel 6)

- [S5_HUD] HUD kelimesi → VARIŞ
- [S5_L1] 1. satır → Kendi zirvene ilerlersin.

### Kare 6 — (görsel 7)

- [S6_HUD] HUD kelimesi → KARDEŞLİK
- [S6_L1] 1. satır → Ama yalnız değilsin.

### Kare 7 — Final (görsel 8)

- [S7_HUD] HUD kelimesi → SIRA SENDE
- [S7_L2] Dev kapanış → Sıradaki sensin.

---

## 3) Bölüm 08 — SİSTEM ("5.30 nedir?")

- [B8_EYEBROW] Üst etiket → 08 — SİSTEM
- [B8_ITALIC] İtalik soru → 5.30 nedir?
- [B8_TITLE] Başlık → 5.30 bir motivasyon değil. Bir sistemdir.

3 sütun (numara + başlık + açıklama):

- [B8_C1_T] Kart 1 başlık → DİSİPLİN
- [B8_C1_D] Kart 1 açıklama → Sözünü tut. Erken kalk.
- [B8_C2_T] Kart 2 başlık → İNANÇ
- [B8_C2_D] Kart 2 açıklama → Kendinden büyüğüne bağlan.
- [B8_C3_T] Kart 3 başlık → KARDEŞLİK
- [B8_C3_D] Kart 3 açıklama → Yalnız yürüme.

"Ne alıyorsun" şeridi:

- [B8_GET_LABEL] Etiket → NE ALIYORSUN
- [B8_GET_1] Madde 1 → 5.30 protokolü
- [B8_GET_2] Madde 2 → Kardeşlik
- [B8_GET_3] Madde 3 → Hesap verme
- [B8_GET_4] Madde 4 → Eğitim & görev takibi

---

## 4) Bölüm 09 — ELEME ("Bu herkes için değil.")

- [B9_EYEBROW] Üst etiket → 09 — ELEME
- [B9_TITLE] Başlık → Bu herkes için değil.

Sol sütun — "İÇİN":

- [B9_FOR_LABEL] Etiket → İÇİN
- [B9_FOR_1] Madde 1 → Sorumluluk alanlar.
- [B9_FOR_2] Madde 2 → Söz verip tutanlar.
- [B9_FOR_3] Madde 3 → Dibe vurup bırakmayanlar.

Sağ sütun — "İÇİN DEĞİL":

- [B9_NOT_LABEL] Etiket → İÇİN DEĞİL
- [B9_NOT_1] Madde 1 → Bahane arayanlar.
- [B9_NOT_2] Madde 2 → İlk zorlukta kaçanlar.
- [B9_NOT_3] Madde 3 → Kalabalıkta kaybolanlar.

---

## 5) Bölüm 10 — DAVET

- [B10_EYEBROW] Üst etiket → 10 — DAVET
- [B10_TITLE] Başlık → 5.30'a davet edildin.
- [B10_SUB] Alt cümle → Kalabalığa değil. Kendine.
- [B10_BTN] Buton → DAVETİ KABUL ET
- [B10_BTN_DONE] Buton (kabul sonrası) → DAVET KABUL EDİLDİ ✓

---

## 6) Bölüm 11 — BAŞVUR (form)

- [B11_EYEBROW] Üst etiket → 11 — BAŞVUR
- [B11_TITLE] Başlık → Kardeşliğe başvur.

Form alan etiketleri:

- [B11_F_NAME] Alan 1 etiketi → Ad Soyad
- [B11_F_CONTACT] Alan 2 etiketi → İletişim — e-posta veya Instagram
- [B11_F_WHY] Alan 3 etiketi → Neden buradasın?
- [B11_BTN] Buton → BAŞVUR
- [B11_BTN_SENDING] Buton (gönderilirken) → GÖNDERİLİYOR…

Başvuru gönderildikten sonra görünen ekran:

- [B11_DONE_BIG] Büyük → 5.30
- [B11_DONE_TXT] Mesaj (alt satır için <br>) → Başvurun alındı.<br>Bir adım daha yakınsın.

Sayfa en altı:

- [FOOTER] Footer satırı → 5.30 — DİSİPLİN · İNANÇ · KARDEŞLİK

---

## 7) Genel / Diğer

- [NAV_LOGIN] Sağ üst giriş linki → giriş
- [TOAST_DUP] Form uyarısı (aynı iletişim) → Bu iletişim zaten kayıtlı.
- [TOAST_ERR] Form uyarısı (hata) → Bir şeyler ters gitti. Tekrar dene.

### SEO (sekme başlığı + arama açıklaması) — `src/routes/index.tsx`

- [SEO_TITLE] Sayfa başlığı → 5.30 — Sıradan bir adamdan, sıra dışı bir adama.
- [SEO_DESC] Açıklama → 5.30 bir motivasyon değil, bir sistemdir. Disiplin · İnanç · Kardeşlik. Sözünü tutan adamların kardeşliğine başvur.

---

### Notlar

- HUD kelimeleri ([S1_HUD]…[S7_HUD]) sağdaki dikey ilerleme çubuğunda görünür; istersen
  altyazı temasıyla aynı tutmak mantıklı ama bağımsız değiştirebilirsin.
- Görseller bu şablonun dışında (`public/landing/1–8.jpeg`); metin değil, dosya değişimiyle güncellenir.
- "08/09 — …" gibi numaralar tasarımın parçası; istersen numarasız da yapabilirim, söyle.
