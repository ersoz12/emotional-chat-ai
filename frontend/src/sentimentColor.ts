// sentimentColor.ts
export const getSentimentColor = (label: string): string => {
    switch (label.toLowerCase()) {
        case "positive":
        case "pozitif":
            return "#4CAF50"; // yeşil
        case "negative":
        case "negatif":
            return "#F44336"; // kırmızı
        case "neutral":
        case "nötr":
            return "#FFC107"; // sarı
        default:
            return "#9E9E9E"; // gri (bilinmeyen durum)
    }
};