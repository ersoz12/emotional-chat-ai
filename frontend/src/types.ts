// types.ts
export interface SentimentResult {
    label: string;          // Pozitif / N�tr / Negatif
    score: number;          // Modelin verdi�i skor (0�1 aras�)
    confidence?: number;    // G�ven skoru (iste�e ba�l�)
    probs?: Record<string, number>; // T�m olas�l�klar (�r: {pozitif:0.9, n�tr:0.05, negatif:0.05})
    error?: string;         // Hata varsa a��klamas�
}
