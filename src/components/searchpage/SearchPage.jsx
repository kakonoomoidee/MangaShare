import { useState } from "react"; // Import necessary hooks
import { db } from "../../lib/firebase"; // Assuming db is used somewhere else
import UserItem from "./UserItem"; // Assuming you have this component
import PostItem from "./PostItem"; // Assuming you have this component
import { FaSearch } from "react-icons/fa"; // Import search icon from react-icons

export default function ChatForm() {
  const [showPostItem, setShowPostItem] = useState(false); // State to toggle view
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  return (
    <div className="flex justify-center items-center bg-gray-800 p-6">
      <div className="bg-gray-900 w-[70vw] h-[80vh] rounded-lg shadow-lg flex flex-col">
        {/* Search form */}
        <div className="p-4 flex justify-center">
          <div className="flex w-4/5 items-center">
            {/* Center items within the flex container */}
            <input
              type="text"
              placeholder={`Search ${showPostItem ? "Posts" : "Users"}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query
              className="flex-1 p-2 rounded-full bg-gray-700 text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              onClick={() => {
                console.log(`Searching for: ${searchQuery}`);
              }}
              className="flex items-center justify-center w-10 h-10 ml-2 rounded-full bg-gray-700 text-white hover:bg-gray-800 transition duration-200"
            >
              <FaSearch className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Button for toggling between user item and post item */}
        <div className="flex space-x-4 mb-1">
          <button
            className={`py-2 px-4 flex items-center text-white transition duration-200 ${
              !showPostItem
                ? "border-b-2 border-white"
                : "border-b-2 border-transparent"
            }`}
            onClick={() => setShowPostItem(false)} // Update state on click
          >
            Users
          </button>
          <button
            className={`py-2 px-4 flex items-center text-white transition duration-200 ${
              showPostItem
                ? "border-b-2 border-white"
                : "border-b-2 border-transparent"
            }`}
            onClick={() => setShowPostItem(true)} // Update state on click
          >
            Posts
          </button>
        </div>

        {/* Horizontal line */}
        <hr className="border-gray-600 mb-5" />

        {/* Conditional rendering based on the selected state */}
        <div className="flex-1 overflow-y-auto">
          {!showPostItem ? (
            <UserItem searchQuery={searchQuery} /> // Pass search query to UserItem
          ) : (
            <PostItem searchQuery={searchQuery} /> // Pass search query to PostItem
          )}
        </div>
      </div>
    </div>
  );
}
