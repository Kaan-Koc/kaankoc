# 🚀 Portfolio Website Setup Guide

Merhaba! Bu rehber, portfolyo web sitenizi kurmanıza yardımcı olacak.

## ✅ Tamamlanan İşlemler

Site tamamen oluşturuldu ve şunları içeriyor:

- ✨ Next.js 15 tabanlı modern yapı
- 🌐 Türkçe & İngilizce dil desteği (sağ üstten değiştirilebilir)
- 🎨 Yeditepe Mavisi (#003a70) temalı tasarım
- 🌙 Karanlık mod desteği
- 📝 Sanity CMS ile admin paneli
- 💬 İletişim formu ve chat balonu
- 🚀 Tüm animasyonlar ve efektler

## 📋 Yapmanız Gerekenler

### 1. Sanity.io Hesabı Oluşturun

1. [https://www.sanity.io/get-started](https://www.sanity.io/get-started) adresine gidin
2. Ücretsiz hesap oluşturun (Google hesabınızla giriş yapabilirsiniz)
3. Yeni bir proje oluşturun:
   - Proje adı: "Kaan Koc Portfolio" (veya istediğiniz isim)
   - Dataset: "production" (önerilen)
4. Proje ID'nizi kopyalayın (proje ayarlarından)

### 2. Environment Variables'ı Ayarlayın

1. `.env.local.example` dosyasını açın
2. İçeriği kopyalayın
3. Yeni bir `.env.local` dosyası oluşturun (aynı dizinde)
4. Sanity proje ID'nizi yapıştırın:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=buraya_proje_id_nizi_yapisitirin
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. (Opsiyonel) Crisp Chat Kurulumu

Canlı sohbet özelliği eklemek isterseniz:

1. [https://crisp.chat](https://crisp.chat) adresine gidin
2. Ücretsiz hesap oluşturun
3. Yeni bir website ekleyin
4. Website ID'nizi kopyalayın
5. `app/[locale]/layout.js` dosyasını açın
6. `YOUR_WEBSITE_ID` yazan yeri kendi ID'nizle değiştirin

### 4. Development Server'ı Başlatın

Terminal'de şu komutu çalıştırın:

```bash
npm run dev
```

### 5. Site ve Admin Paneline Erişin

- **Ana Site**: [http://localhost:3000](http://localhost:3000)
- **Admin Paneli**: [http://localhost:3000/tr/admin](http://localhost:3000/tr/admin)

### 6. İçerik Ekleyin

Admin panelinde:

1. **Projects** (Projeler): Portfolyo projelerinizi ekleyin
   - Başlık, açıklama (TR & EN)
   - Proje görseli
   - Kullanılan teknolojiler
   - Demo ve GitHub linkleri

2. **Experience** (İş Deneyimi): İş tecrübelerinizi ekleyin
   - Şirket, pozisyon (TR & EN)
   - Başlangıç/bitiş tarihleri
   - Açıklama

3. **Education** (Eğitim): Eğitim geçmişinizi ekleyin
   - Okul, bölüm (TR & EN)
   - Tarihler
   - Açıklama

4. **Certificates** (Sertifikalar): Sertifikalarınızı ekleyin
   - Sertifika adı
   - Veren kurum
   - Logo
   - Credential linki

## 🎨 Özelleştirme

### Renkleri Değiştirmek

`tailwind.config.js` dosyasındaki `yeditepe` renklerini düzenleyin.

### Fontları Değiştirmek

`app/[locale]/layout.js` dosyasında Anton ve Inter fontlarını değiştirin.

## 🚀 Deployment (Yayına Alma)

### Vercel ile (Önerilen)

1. GitHub'da yeni bir repository oluşturun
2. Kodları push edin
3. [Vercel](https://vercel.com)'e gidin
4. Repository'nizi import edin
5. Environment variables'ları ekleyin
6. Deploy edin!

## 💡 İpuçları

- Her içerik için hem Türkçe hem İngilizce doldurun
- Görseller için yüksek kaliteli resimler kullanın
- Projelerinizi "featured" olarak işaretleyerek öne çıkarabilirsiniz
- "Order" alanıyla içeriklerin sırasını belirleyebilirsiniz

## 🆘 Sorun mu yaşıyorsunuz?

1. `npm install` komutunu tekrar çalıştırın
2. `.env.local` dosyasının doğru olduğundan emin olun
3. Sanity proje ID'nizin doğru olduğunu kontrol edin
4. Browser cache'inizi temizleyin

## 📞 İletişim

Başka sorularınız varsa bana ulaşabilirsiniz!

---

**Kolay gelsin! 🎉**
