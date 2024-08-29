// src/app/profile/page.jsx
"use client";

import Header from "../../components/Header";
import LeftSidebar from "../../components/LeftSidebar";
import ProfileContent from "../../components/ProfileContent";

export default function ProfilePage() {
  return (
    <div className="flex">
      <LeftSidebar />
      <div className="flex-1">
        <Header />
        <ProfileContent />
      </div>
    </div>
  );
}
