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

    const sendMessage = () => {
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            text: trimmed,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
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
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={sendMessage} disabled={loading}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default App;