import { useRef, useState, useEffect } from "react";
import type { FormEvent } from "react";
import { createUser, sendMessage, getMessages, type User, type Message } from "./api";
import { getSentimentColor } from "./sentimentColor";

export default function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [nickname, setNickname] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement | null>(null);

    // Sayfa yüklendiğinde mesajları getir
    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            setLoading(true);
            const msgs = await getMessages();
            setMessages(msgs);
        } catch (error) {
            console.error("Mesajlar yüklenemedi:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        if (!nickname.trim()) return;

        try {
            setLoading(true);
            const user = await createUser(nickname.trim());
            setCurrentUser(user);
            await loadMessages();
        } catch (error: any) {
            alert(error.message || "Giriş yapılamadı");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !currentUser) return;

        try {
            setSending(true);
            const newMessage = await sendMessage(currentUser.id, text.trim());
            setMessages(prev => [newMessage, ...prev]);
            setText("");
        } catch (error: any) {
            alert(error.message || "Mesaj gönderilemedi");
        } finally {
            setSending(false);
            endRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setNickname("");
        setMessages([]);
    };

    // Kullanıcı girişi yapılmamışsa
    if (!currentUser) {
        return (
            <div
                style={{
                    height: "100dvh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#0b1220",
                    color: "#e5e7eb",
                    fontFamily: "Inter, system-ui, sans-serif",
                }}
            >
                <div
                    style={{
                        background: "#1f2a44",
                        padding: "32px",
                        borderRadius: "16px",
                        width: "100%",
                        maxWidth: "400px",
                        margin: "16px",
                    }}
                >
                    <h1 style={{ margin: "0 0 24px 0", textAlign: "center" }}>
                        Emotional Chat
                    </h1>
                    <p style={{ margin: "0 0 24px 0", opacity: 0.8, textAlign: "center" }}>
                        Sohbete katılmak için bir rumuz girin
                    </p>
                    <form onSubmit={handleLogin}>
                        <input
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            placeholder="Rumuzunuz"
                            disabled={loading}
                            style={{
                                width: "100%",
                                background: "#0f172a",
                                border: "1px solid #1f2a44",
                                borderRadius: "8px",
                                padding: "12px 16px",
                                color: "#e5e7eb",
                                outline: "none",
                                marginBottom: "16px",
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!nickname.trim() || loading}
                            style={{
                                width: "100%",
                                background: loading ? "#334155" : "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "12px",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: loading ? "not-allowed" : "pointer",
                            }}
                        >
                            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                height: "100dvh",
                display: "grid",
                gridTemplateRows: "auto 1fr auto",
                background: "#0b1220",
                color: "#e5e7eb",
                fontFamily: "Inter, system-ui, sans-serif",
            }}
        >
            {/* Üst bar */}
            <header
                style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid #1f2a44",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ fontWeight: 700 }}>
                    Emotional Chat (Web) - MVP
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "14px", opacity: 0.8 }}>
                        {currentUser.nickname}
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "#dc2626",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            cursor: "pointer",
                        }}
                    >
                        Çıkış
                    </button>
                </div>
            </header>

            {/* Mesaj listesi */}
            <main style={{ padding: 16, overflowY: "auto" }}>
                {loading && messages.length === 0 && (
                    <div style={{ opacity: 0.6, textAlign: "center" }}>
                        Mesajlar yükleniyor...
                    </div>
                )}
                
                {messages.length === 0 && !loading && (
                    <div style={{ opacity: 0.6, textAlign: "center" }}>
                        Henüz mesaj yok. İlk mesajınızı yazın!
                    </div>
                )}

                <div style={{ display: "grid", gap: 10 }}>
                    {messages.map((message) => {
                        const isMe = message.userId === currentUser.id;
                        const badge = `${message.sentimentLabel} - ${(message.sentimentScore * 100).toFixed(1)}%`;
                        const chipColor = getSentimentColor(message.sentimentLabel);

                        return (
                            <div
                                key={message.id}
                                style={{
                                    display: "flex",
                                    justifyContent: isMe ? "flex-end" : "flex-start",
                                }}
                            >
                                <div
                                    style={{
                                        background: isMe ? "#1f2a44" : "#111827",
                                        padding: "10px 12px",
                                        borderRadius: 12,
                                        maxWidth: 560,
                                        position: "relative",
                                    }}
                                >
                                    <div style={{ whiteSpace: "pre-wrap" }}>
                                        {message.text}
                                    </div>

                                    {/* Duygu rozeti */}
                                    <div
                                        style={{
                                            marginTop: 6,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 6,
                                            fontSize: 12,
                                            background: chipColor,
                                            color: "white",
                                            borderRadius: 999,
                                            padding: "2px 8px",
                                        }}
                                    >
                                        {badge}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={endRef} />
                </div>
            </main>

            {/* Mesaj gönderme alanı */}
            <form
                onSubmit={handleSendMessage}
                style={{
                    padding: 14,
                    borderTop: "1px solid #1f2a44",
                    display: "flex",
                    gap: 8,
                }}
            >
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    disabled={sending}
                    style={{
                        flex: 1,
                        background: "#0f172a",
                        border: "1px solid #1f2a44",
                        borderRadius: 10,
                        padding: "12px 14px",
                        color: "#e5e7eb",
                        outline: "none",
                    }}
                />
                <button
                    type="submit"
                    disabled={!text.trim() || sending}
                    style={{
                        background: sending ? "#334155" : "#2563eb",
                        color: "white",
                        border: "none",
                        padding: "0 18px",
                        borderRadius: 10,
                        fontWeight: 600,
                        cursor: sending ? "not-allowed" : "pointer",
                    }}
                >
                    {sending ? "Gönderiliyor..." : "Gönder"}
                </button>
            </form>
        </div>
    );
}