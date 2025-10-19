# Emotional Chat Mobile (React Native)

Mobil chat uygulaması - React Native CLI ile geliştirilmiştir.

## Özellikler
- Kullanıcı girişi (rumuz)
- Gerçek zamanlı mesajlaşma
- AI duygu analizi (pozitif/nötr/negatif)
- Modern dark theme UI

## Kurulum
```bash
cd mobile
npm install
npx react-native run-android  # Android
npx react-native run-ios      # iOS
```

## APK Build
```bash
cd android
./gradlew assembleRelease
# APK: android/app/build/outputs/apk/release/app-release.apk
```

## API Entegrasyonu
- Backend API: Render deploy URL
- AI Service: Hugging Face Spaces
- WebSocket: Gerçek zamanlı mesajlaşma

## Not
Bu mobil uygulama web versiyonu ile aynı backend API'yi kullanır.
