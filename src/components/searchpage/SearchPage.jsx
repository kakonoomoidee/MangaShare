import { useState, useEffect } from "react";
import { db } from "../../lib/firebase"; // Firebase configuration
import UserItem from "./UserItem";
import PostItem from "./PostItem";
import { FaSearch } from "react-icons/fa";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

export default function ChatForm() {
  const [showPostItem, setShowPostItem] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!showPostItem) {
        // Search users
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);
        const fetchedUsers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFilteredUsers(
          fetchedUsers.filter((user) =>
            user.username?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        // Search posts
        const postsCollection = collection(db, "foodPosts");
        const snapshot = await getDocs(postsCollection);
        const fetchedPosts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFilteredPosts(
          fetchedPosts.filter((post) =>
            post.title?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      }
    } catch (err) {
      console.error("Error during search:", err);
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-800 p-6">
      <div className="bg-gray-900 w-[70vw] h-[80vh] rounded-lg shadow-lg flex flex-col">
        <div className="p-4 flex justify-center">
          <div className="flex w-4/5 items-center">
            <input
              type="text"
              placeholder={`Search ${showPostItem ? "Posts" : "Users"}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 rounded-full bg-gray-700 text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="flex items-center justify-center w-10 h-10 ml-2 rounded-full bg-gray-700 text-white hover:bg-gray-800 transition duration-200"
            >
              <FaSearch className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-1">
          <button
            className={`py-2 px-4 flex items-center text-white transition duration-200 ${
              !showPostItem
                ? "border-b-2 border-white"
                : "border-b-2 border-transparent"
            }`}
            onClick={() => setShowPostItem(false)}
          >
            Users
          </button>
          <button
            className={`py-2 px-4 flex items-center text-white transition duration-200 ${
              showPostItem
                ? "border-b-2 border-white"
                : "border-b-2 border-transparent"
            }`}
            onClick={() => setShowPostItem(true)}
          >
            Posts
          </button>
        </div>

        <hr className="border-gray-600 mb-5" />

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-white text-center">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : !showPostItem ? (
            searchQuery === "" ? (
              <div className="text-white text-center">
                Please enter a username to search for users.
              </div>
            ) : filteredUsers.length > 0 ? (
              <UserItem users={filteredUsers} />
            ) : (
              <div className="text-white text-center">No users found.</div>
            )
          ) : searchQuery === "" ? (
            <div className="text-white text-center">
              Please enter a title to search for posts.
            </div>
          ) : filteredPosts.length > 0 ? (
            <PostItem posts={filteredPosts} />
          ) : (
            <div className="text-white text-center">No posts found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
