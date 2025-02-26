import { useState, useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";

function App() {
    const [message, setMessage] = useState("");  // Stores user input
    const [chatHistory, setChatHistory] = useState([]); // Stores chat history
    const chatContainerRef = useRef(null); // ✅ Create a reference for the chat container

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

    // ✅ Auto-scroll when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]); // ✅ Scrolls when chat history updates

    // ✅ Handle sending messages
    const handleSend = (e) => {
        e.preventDefault();
        if (message.trim() === "") return;

        sendMessage(message);

        setChatHistory((prev) => [...prev, { sender: "😷 You", text: message }]);
        setMessage("");
    };

    return (
        <div style={{ width: "50%", margin: "auto", textAlign: "center", padding: "20px" }}>
            <h2>💬 Rådgivare blodcentralen</h2>
            <div 
                ref={chatContainerRef} // ✅ Attach ref to the chat container
                style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}
            >
                {chatHistory.map((msg, index) => (
                    <p key={index} style={{ textAlign: msg.sender === "😷 You" ? "right" : "left" }}>
                        <strong>{msg.sender}:</strong> {msg.text}
                    </p>
                ))}
            </div>
            <form onSubmit={handleSend} style={{ marginTop: "10px" }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Skriv din fråga..."
                    style={{ width: "80%", padding: "10px" }}
                />
                <button type="submit" style={{ padding: "10px", marginLeft: "10px" }}>Skicka</button>
            </form>
        </div>
    );
}

export default App;
