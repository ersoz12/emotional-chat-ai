// api.ts
const API_BASE = (import.meta as any).env?.VITE_API_BASE
    || (import.meta as any).env?.MODE === 'production'
    ? "https://emotional-chat-api.onrender.com"
    : "http://localhost:5164";

export interface User {
    id: number;
    nickname: string;
    createdAtUtc: string;
}

export interface Message {
    id: number;
    userId: number;
    text: string;
    sentimentLabel: string;
    sentimentScore: number;
    createdAtUtc: string;
}

// Kullanıcı işlemleri
export const createUser = async (nickname: string): Promise<User> => {
    const response = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname }),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Kullanıcı oluşturulamadı");
    }
    
    return response.json();
};

export const getUsers = async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE}/api/users`);
    if (!response.ok) throw new Error("Kullanıcılar alınamadı");
    return response.json();
};

// Mesaj işlemleri
export const sendMessage = async (userId: number, text: string): Promise<Message> => {
    const response = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text }),
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Mesaj gönderilemedi");
    }
    
    return response.json();
};

export const getMessages = async (userId?: number): Promise<Message[]> => {
    const url = userId ? `${API_BASE}/api/messages?userId=${userId}` : `${API_BASE}/api/messages`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Mesajlar alınamadı");
    return response.json();
};

// Eski sentiment analiz fonksiyonu (geriye uyumluluk için)
export const analyzeSentiment = async (text: string) => {
    try {
        const response = await fetch(`${API_BASE}/api/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API çağrısı hatası:", error);
        return { error: "Bağlantı hatası veya servis çalışmıyor." };
    }
};