# Patika — Proje Sahibi Görüşme Soruları

Amaç: 5.30'un "görev/sorumluluk + ilerleme + ödül" sistemini (Patika) doğru kurmak.
Şimdiye kadar netleşen iskelet:

- **28 günlük patika** — sabit, lineer, herkese aynı.
- **Kişiye özel patika** — mentörlük/özel paket alana, admin'in kişiye özel kurup atadığı ayrı yol.
- Görev tamamlama: **işaretle + isteğe bağlı not**.
- Ödül: **rozet + seri (streak) + puan** (ileride genişler).

★ = kritik (cevabı tüm tasarımı değiştirir).

---

## 1. Büyük resim & "başarı" tanımı
- ★ Bir kullanıcı için **"başarıyla tamamladım"** anı tam olarak nedir? Sonunda ne görmeli/hissetmeli?
- ★ "Başarı hissiyatı" derken aklındaki sahne nedir? (rozet açılması, seviye atlama, sertifika, toplulukta takdir, mentörün tebriği…)
- 28 gün **bittiğinde** ne olur? Yeni bir patika mı, bir üst seviye mi, tekrar mı, "mezuniyet" mi?
- Bu platformun kullanıcıya verdiği **asıl söz/iddia** tek cümleyle nedir? (Pazarlama değil, his.)

## 2. 28 günlük sabit patika (içerik & kurallar)
- ★ 28 günün omurgası ne? **Örnek bir hafta** verir misin (gün gün ne tür görevler)?
- Günde **kaç görev**? Hepsi zorunlu mu, opsiyonel/bonus var mı?
- Görev **türleri** neler? (sadece "yap-işaretle" mi; yoksa oku / video izle / ölç / uygula / yansıt gibi türler mi?)
- ★ Görevler **güne mi** bağlı (program başlangıcından gün 1-2-3…) yoksa **takvime mi** (belirli tarih)?
- ★ **Bir gün kaçırılırsa** ne olur? Seri kırılır mı? Telafi/dondurma hakkı var mı? Ertesi gün açılır mı, yoksa takılı mı kalır?
- **Kilit mantığı**: önceki gün bitmeden sonraki açılmaz mı (sıralı), yoksa o günün görevi her sabah otomatik açılır mı?
- Gün içinde belirli bir **saat** önemli mi? (ör. 5.30'da uyanma — saat bazlı doğrulama/hatırlatma)

## 3. Kişiye özel / mentörlük patikaları (admin atamalı) ★
- ★ Kişiye özel patika **nasıl oluşuyor**? Admin sıfırdan mı kuruyor, hazır şablondan mı türetiyor?
- ★ Mentörlük alan kişi **28 günü de yapıyor** mu, yoksa tamamen **ayrı** bir yola mı giriyor? Yoksa **ikisi paralel** mi yürüyor?
- Admin görevleri **ne sıklıkla** giriyor/güncelliyor? (Her seans sonrası mı, haftalık mı, en baştan tüm yolu mu kuruyor?)
- Kişiye özel görev **tek seferlik** mi, **tekrarlı** mı olabiliyor?
- Bir kullanıcı **aynı anda birden fazla patikada** olabilir mi? (28 günlük + mentörlük özel)
- Admin görev atarken **son tarih / hatırlatma** koyuyor mu?
- ★ Mentör, kullanıcının **yaptığı notları/işaretleri görüyor** mu? **Geri bildirim/onay** veriyor mu? (Bu, "sorumluluk" hissinin merkezinde olabilir.)
- Mentör kullanıcının ilerlemesine göre **yolu canlı değiştirebiliyor** mu (görev ekle/çıkar)?

## 4. Görev & tamamlama mekaniği
- "İşaretle + isteğe bağlı not" çoğu görev için yeterli — ama bazı görevlerde **değer girişi** istenir mi? (uyanma saati, kilo, tekrar sayısı, süre…)
- **Geçmişe dönük** işaretleme olsun mu? (Dün yaptım ama girmedim.)
- Tamamlama **kullanıcının beyanıyla** mı kesinleşir, yoksa bazı görevlerde **mentör onayı** mı gerekir?
- Bir görevi **atlamak/"bugün yapamadım"** demek bir seçenek mi? (dürüstlük vs. ceza dengesi)

## 5. Ödül, seri (streak), motivasyon
- ★ Ödül **hangi anlarda** gelsin? (her gün, her hafta, aşama sonu, 28 gün sonu)
- **Rozet/başarım örnekleri** neler olsun? İsim + his (ör. "İlk Şafak", "7 Gün Kesintisiz", "Disiplin Mührü"). Görsel dili nasıl olmalı?
- **Seri kırılınca** ne olur? Sıfırlanır mı? "Dondurma (freeze)" hakkı tanınsın mı?
- **Puan** ne işe yarar? Sadece gösterge mi, **liderlik tablosu/sıralama** mı, bir şey **açıyor** mu?
- ★ **Topluluk** boyutu: başarımlar/seriler toplulukta görünür mü? (sosyal motivasyon — "X 14 günü tamamladı")
- **Hatırlatma**: "bugünkü görevin" için push/e-posta bildirimi olsun mu? Saati?

## 6. Admin / mentor paneli (yönetim)
- ★ Admin tam olarak **neleri düzenleyebilmeli**? (patika oluştur · görev ekle/sil/sırala · zaman değiştir · ödül tanımla · kişiye/gruba ata)
- Kaç **admin/mentor** olacak? Mentörler **sadece kendi danışanlarını** mı görür, yoksa herkesi mi?
- Tekrar tekrar kullanmak için **görev/patika şablon kütüphanesi** olsun mu?
- Bir patikayı yayına almadan **taslak/önizleme** olsun mu?
- Admin, kullanıcıların **ilerleme panosunu** (kim nerede, kim düştü) görmek ister mi?

## 7. Kapsam & öncelik (MVP)
- ★ İlk sürümde **mutlaka olması gereken** nedir? Neyi gönül rahatlığıyla sonraya bırakabiliriz?
- ★ Önce **28 günlük sabit patika** mı, yoksa **kişiye özel mentörlük patikası** mı hayata geçsin?
- Pilot: önce **küçük bir grupla** mı denenecek, yoksa direkt tüm üyelere mi açılacak?
- Bu sistem **ne zamana** yetişmeli? (gerçek bir tarih/etkinlik var mı?)

---

### Görüşmeden sonra biz ne yapacağız
Cevaplar netleşince: (1) veri modeli (patika/görev/ilerleme/ödül + admin atama), (2) kullanıcı "Bugün" ekranı + profil/başarımlar, (3) admin/mentor paneli — mevcut temiz mimariyle (domain→app→infra→server→ui) tasarlanır.
