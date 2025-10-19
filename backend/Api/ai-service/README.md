# AI Service (Hugging Face Spaces)

Bu proje, Hugging Face Spaces üzerinde çalışan bir Gradio uygulaması kullanır.

## Model
- `cardiffnlp/twitter-roberta-base-sentiment-latest`
- Etiketler: `negative`, `neutral`, `positive`

## Canlı Space
- App: https://ismaillersoz-sentiment-ai-service.hf.space
- Space sayfası: https://huggingface.co/spaces/ismaillersoz/sentiment-ai-service

## API Kullanımı
- Backend, Space'e `POST /api/analyze` ile istek atar.
- Gövde:
```json
{ "data": ["Metin"] }
```
- Örnek cevap:
```json
{ "data": [{ "label": "positive", "score": 0.98 }] }
```

## Notlar
- Space ücretsiz CPU üzerinde çalışır.
- Yanıt süreleri ilk çağrıda soğuk başlangıç nedeniyle uzun olabilir.

