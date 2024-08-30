"use client";

import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import HomePage from "../components/homepage/HomePage"; // Import HomePage component

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <LeftSidebar />
        <main className="flex-grow ml-64 mt-16 p-4 bg-gray-800">
          <HomePage />
        </main>
      </div>
    </div>
  );
}
