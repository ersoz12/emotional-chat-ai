// types.ts
export interface SentimentResult {
    label: string;          // Pozitif / Nötr / Negatif
    score: number;          // Modelin verdiði skor (0–1 arasý)
    confidence?: number;    // Güven skoru (isteðe baðlý)
    probs?: Record<string, number>; // Tüm olasýlýklar (ör: {pozitif:0.9, nötr:0.05, negatif:0.05})
    error?: string;         // Hata varsa açýklamasý
}
