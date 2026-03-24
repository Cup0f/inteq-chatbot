import { useState } from "react";

type Message = {
    id: number;
    role: "user" | "bot";
    text: string;
};

function App() {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: "bot", text: "Hi! I am your chatbot." },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            text: trimmed,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);
        
        try {
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: trimmed }),
            });

            if (!response.ok) {
                throw new Error("Request failed");
            }

            const data: { reply: string } = await response.json();

            const botMessage: Message = {
                id: Date.now() + 1,
                role: "bot",
                text: data.reply,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch {
            const errorMessage: Message = {
                id: Date.now() + 1,
                role: "bot",
                text: "Sorry, something went wrong.",
            };
            
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>INTEQ Chatbot</h1>

            <div>
                {messages.map((m) => (
                    <p key={m.id}>{m.text}</p>
                ))}
            </div>

            <div>
                <input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />
                <button onClick={sendMessage} disabled={loading}>
                    {loading ? "Sending..." : "Send"}
                </button>
            </div>
        </div>
    );
}

export default App;