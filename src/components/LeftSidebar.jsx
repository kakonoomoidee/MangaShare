// src/components/LeftSidebar.jsx
import { FaHome, FaSearch, FaPlus, FaUser, FaFlag } from "react-icons/fa";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";

export default function LeftSidebar() {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gray-900 shadow-md flex flex-col p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white">Menu</h2>
      </div>
      <nav className="flex flex-col space-y-4">
        <button
          onClick={() => handleNavigation("/")}
          className="flex items-center text-gray-300 hover:bg-gray-800 p-2 rounded"
        >
          <FaHome className="mr-3" />
          Home Page
        </button>
        <button
          onClick={() => handleNavigation("/search")}
          className="flex items-center text-gray-300 hover:bg-gray-800 p-2 rounded"
        >
          <FaSearch className="mr-3" />
          Search
        </button>
        <button
          onClick={() => handleNavigation("/create")}
          className="flex items-center text-gray-300 hover:bg-gray-800 p-2 rounded"
        >
          <FaPlus className="mr-3" />
          Create
        </button>
        <button
          onClick={() => handleNavigation("/profile")}
          className="flex items-center text-gray-300 hover:bg-gray-800 p-2 rounded"
        >
          <FaUser className="mr-3" />
          Profile
        </button>

        {user?.email === "admin@gmail.com" && (
          <button
            onClick={() => handleNavigation("/report")}
            className="flex items-center text-gray-300 hover:bg-gray-800 p-2 rounded"
          >
            <FaFlag className="mr-3" />
            Report
          </button>
        )}
      </nav>
    </aside>
  );
}
