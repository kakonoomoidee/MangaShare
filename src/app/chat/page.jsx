// src/app/profile/page.jsx
"use client";

import Header from "../../components/Header";
import LeftSidebar from "../../components/LeftSidebar";
import ChatForm from "../../components/chatpage/ChatForm";

export default function ProfilePage() {
  return (
    <div className="flex">
      <LeftSidebar />
      <div className="flex-1">
        <Header />
        <main className="pt-16 pl-64 p-4 bg-gray-800 text-white min-h-screen">
          <ChatForm />
        </main>
      </div>
    </div>
  );
}
