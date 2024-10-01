import { useState, useEffect } from "react";
import { io } from "socket.io-client"; // Import Socket.IO client
import { db } from "../../lib/firebase";
import profile from "../../images/assets/profile-user.png";

// Socket connection should be initialized inside useEffect
export default function ChatForm() {
  const [users, setUsers] = useState([]); // List of users
  const [messages, setMessages] = useState([]); // List of messages
  const [currentMessage, setCurrentMessage] = useState(""); // Current message being typed
  const [username, setUsername] = useState("User"); // Replace with actual user info

  useEffect(() => {
    const socket = io("http://localhost:4000"); // Ganti dengan URL backend Anda

    // Mendapatkan pesan dari server
    socket.on("chatMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Mendapatkan daftar pengguna dari server
    socket.on("userList", (users) => {
      setUsers(users);
    });

    // Cleanup saat komponen di-unmount
    return () => {
      socket.off("chatMessage");
      socket.off("userList");
      socket.disconnect(); // Disconnect socket on cleanup
    };
  }, []);

  // Function untuk mengirim pesan
  const sendMessage = () => {
    if (currentMessage.trim() !== "") {
      const message = {
        content: currentMessage,
        username: username, // Gunakan username dari state
        timestamp: new Date(),
      };

      // Emit pesan ke server
      const socket = io("http://localhost:4000");
      socket.emit("sendMessage", message);

      // Tambahkan pesan secara lokal
      setMessages((prevMessages) => [...prevMessages, message]);
      setCurrentMessage(""); // Clear input
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-800 p-6">
      <div className="bg-gray-900 w-[70vw] h-[80vh] rounded-lg shadow-lg flex">
        {/* Kolom pengguna */}
        <div className="w-1/4 border-r border-gray-700 flex-none">
          <h2 className="text-white text-lg p-4">Users</h2>
          <ul className="space-y-2 p-4 overflow-y-auto h-[70vh]">
            {users.map((user, index) => (
              <div
                key={index}
                className="flex items-center mb-4 border-b border-gray-600 pb-4"
              >
                <img
                  src={user.photoURL || profile.src}
                  alt="User"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <h3 className="text-lg font-semibold text-white">
                  {user.username || "Unknown User"}
                </h3>
              </div>
            ))}
          </ul>
        </div>

        {/* Kolom chat */}
        <div className="w-3/4 flex flex-col">
          <h2 className="text-white text-lg p-4">Chat</h2>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
            {messages.map((message, index) => (
              <div key={index} className="mb-2">
                <span className="text-white font-semibold">
                  {message.username}:{" "}
                </span>
                <span className="text-gray-300">{message.content}</span>
              </div>
            ))}
          </div>

          {/* Input field to type new message */}
          <div className="p-4 bg-gray-700 flex">
            <input
              type="text"
              className="flex-1 p-2 bg-gray-600 text-white rounded-lg"
              placeholder="Type a message..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
            />
            <button
              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
