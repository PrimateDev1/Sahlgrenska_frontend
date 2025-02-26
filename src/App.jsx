import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";

function App() {
    const [message, setMessage] = useState("");  // Stores user input
    const [chatHistory, setChatHistory] = useState([]); // Stores chat history

    // Connect to WebSocket server
    const { sendMessage, lastMessage } = useWebSocket("ws://localhost:3000", {
        onOpen: () => console.log("✅ Connected to WebSocket Server"),
        onClose: () => console.log("❌ Disconnected"),
        onError: (error) => console.error("⚠️ WebSocket Error:", error),
        shouldReconnect: () => true, // Auto-reconnect WebSocket
    });

    // ✅ Handle receiving messages properly
    useEffect(() => {
        if (lastMessage !== null) {
            setChatHistory((prev) => [...prev, { sender: "🤖 AI", text: lastMessage.data }]);
        }
    }, [lastMessage]); // ✅ Runs only when a new message is received

    // ✅ Handle sending messages
    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim() === "") return;

        sendMessage(message);

        setChatHistory((prev) => [...prev, { sender: "👤 You", text: message }]);
        setMessage("");
    };

    return (
        <div style={{ width: "50%", margin: "auto", textAlign: "center", padding: "20px" }}>
            <h2>💬 AI Chatbot</h2>
            <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
                {chatHistory.map((msg, index) => (
                    <p key={index} style={{ textAlign: msg.sender === "👤 You" ? "right" : "left" }}>
                        <strong>{msg.sender}:</strong> {msg.text}
                    </p>
                ))}
            </div>
            <form onSubmit={handleSend} style={{ marginTop: "10px" }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{ width: "80%", padding: "10px" }}
                />
                <button type="submit" style={{ padding: "10px", marginLeft: "10px" }}>Send</button>
            </form>
        </div>
    );
}

export default App;
