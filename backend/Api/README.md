# Emotional Chat AI - Full Stack Proje

Kullanıcıların mesajlaşarak sohbet edebildiği, yazışmaların AI tarafından duygu analizi yapılarak canlı olarak gösterildiği web uygulaması.

## 🚀 Özellikler

- **Gerçek Zamanlı Chat**: Kullanıcılar rumuz ile giriş yapıp mesajlaşabilir
- **AI Duygu Analizi**: Her mesaj otomatik olarak analiz edilir (pozitif/nötr/negatif)
- **Canlı Skor**: Duygu skoru ve etiketi mesajın yanında görünür
- **Modern UI**: Dark theme ile modern chat arayüzü

## 🛠️ Teknoloji Stack

### Backend (.NET Core API)
- **Framework**: .NET 9.0
- **Database**: SQLite + Entity Framework Core
- **AI Integration**: Hugging Face Space API
- **Deploy**: Render (Free)

### Frontend (React Web)
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Inline CSS (modern dark theme)
- **Deploy**: Vercel (Free)

### AI Servisi
- **Platform**: Hugging Face Spaces
- **Model**: `cardiffnlp/twitter-roberta-base-sentiment-latest`
- **API**: Gradio interface

## 📁 Proje Yapısı

```
emotional-chat-ai/
├── backend/
│   └── Api/                 # .NET Core API
│       ├── Program.cs        # Ana uygulama + endpoint'ler
│       ├── SentimentClient.cs # HF Space entegrasyonu
│       ├── Dockerfile       # Container için
│       └── render.yaml      # Render deploy config
├── frontend/
│   └── src/                 # React Web App
│       ├── App.tsx          # Ana chat komponenti
│       ├── api.ts           # Backend API çağrıları
│       └── sentimentColor.ts # Duygu renkleri
└── README.md
```

## 🔧 Kurulum ve Çalıştırma

### Backend (Local)
```bash
cd backend/Api
dotnet restore
dotnet run
# http://localhost:5164 adresinde çalışır
```

### Frontend (Local)
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173 adresinde çalışır
```

## 🌐 Canlı Demo

- **Web App**: [Vercel Deploy Link] (Deploy edilecek)
- **API**: [Render Deploy Link] (Deploy edilecek)
- **AI Service**: https://ismaillersoz-sentiment-ai-service.hf.space
- **Mobil APK**: [React Native Build] (Geliştirilecek)

## 📊 API Endpoints

### Kullanıcı İşlemleri
- `POST /api/users` - Yeni kullanıcı oluştur
- `GET /api/users` - Tüm kullanıcıları listele

### Mesaj İşlemleri
- `POST /api/messages` - Mesaj gönder (otomatik sentiment analizi)
- `GET /api/messages` - Mesajları listele

### AI İşlemleri
- `POST /api/analyze` - Tek başına sentiment analizi
- `GET /api/ping-hf` - HF Space bağlantı testi

## 🎯 Kullanım Senaryosu

1. **Giriş**: Kullanıcı rumuz ile giriş yapar
2. **Mesaj Gönderme**: Mesaj yazıp gönderir
3. **AI Analizi**: Backend otomatik olarak HF Space'e istek atar
4. **Sonuç Gösterimi**: Duygu etiketi ve skoru mesajın yanında görünür
5. **Gerçek Zamanlı**: Tüm kullanıcılar aynı mesajları görür

## 🔍 Kod Açıklamaları

### Backend (Program.cs)
- **CORS**: React frontend erişimi için
- **EF Core**: SQLite veritabanı yönetimi
- **Dependency Injection**: HttpClient ve DbContext
- **Minimal APIs**: Controller olmadan endpoint'ler

### Frontend (App.tsx)
- **State Management**: React hooks ile durum yönetimi
- **API Integration**: Backend ile async iletişim
- **UI Components**: Modern chat arayüzü
- **Error Handling**: Kullanıcı dostu hata mesajları

### AI Integration (SentimentClient.cs)
- **HTTP Client**: HF Space API çağrıları
- **JSON Parsing**: Gradio response formatı
- **Error Handling**: API hatalarını yakalama

## 🚀 Deploy Süreci

### Backend (Render)
1. GitHub repo'yu Render'a bağla
2. Build command: `dotnet publish -c Release`
3. Start command: `dotnet Api.dll`
4. Environment variables ayarla

### Frontend (Vercel)
1. GitHub repo'yu Vercel'e bağla
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables: API URL

## 📈 Performans

- **Backend**: SQLite ile hızlı veri erişimi
- **Frontend**: Vite ile hızlı build
- **AI**: HF Space ile güçlü sentiment analizi
- **Deploy**: CDN ile global erişim

## 🔒 Güvenlik

- **CORS**: Sadece frontend domain'ine izin
- **Input Validation**: Mesaj ve kullanıcı doğrulama
- **Error Handling**: Güvenli hata mesajları
- **Rate Limiting**: API istek sınırları (gelecek)

## 📝 Gelecek Geliştirmeler

- [ ] React Native mobil uygulama
- [ ] WebSocket ile gerçek zamanlı mesajlaşma
- [ ] Kullanıcı profil sistemi
- [ ] Mesaj geçmişi filtreleme
- [ ] Çoklu dil desteği
- [ ] Push notification

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤖 AI Araçları ile Yazılan Bölümler

**Claude AI ile geliştirilen kısımlar:**
- Backend API endpoint'leri (Program.cs)
- Frontend React komponenti (App.tsx)
- API entegrasyonu (api.ts)
- Deploy konfigürasyonları (render.yaml, vercel.json)

**Manuel yazılan kısımlar:**
- Hugging Face Space AI servisi
- SQLite veritabanı modelleri
- Sentiment analizi entegrasyonu

## 👨‍💻 Geliştirici

**İsmail Ersöz**
- GitHub: [@ismaillersoz](https://github.com/ismaillersoz)
- Hugging Face: [@ismaillersoz](https://huggingface.co/ismaillersoz)

---

**Not**: Bu proje eğitim amaçlı geliştirilmiştir. Production kullanımı için ek güvenlik önlemleri alınmalıdır.
