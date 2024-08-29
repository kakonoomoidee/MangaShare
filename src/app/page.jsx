// pages/page.jsx
"use client";

import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import HomePage from "../components/HomePage"; // Import HomePage component

export default function Page() {
  return (
    <div>
      <Header />
      <div className="flex">
        <LeftSidebar />
        <div className="flex-grow ml-64 mt-16 p-4">
          <HomePage />
        </div>
      </div>
    </div>
  );
}
