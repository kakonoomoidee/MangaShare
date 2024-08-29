"use client";

import Header from "../../components/Header";
import LeftSidebar from "../../components/LeftSidebar";
import SearchPage from "../../components/SearchPage";

export default function Page() {
  return (
    <div className="h-screen bg-gray-800 text-white">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <div className="flex-grow ml-64 mt-16 p-4">
          <main className="pt-16 pl-64 p-4 bg-gray-800 text-white min-h-screen">
            <SearchPage />
          </main>
        </div>
      </div>
    </div>
  );
}
