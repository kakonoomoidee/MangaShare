import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Post from "./Post";
import User from "./User"; // Assumes you have a User component to display user details
import { FaSearch } from "react-icons/fa";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [postResults, setPostResults] = useState([]);
  const [userResults, setUserResults] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      // Query to search posts by title
      const postsQuery = query(
        collection(db, "foodPosts"),
        where("title", ">=", searchTerm),
        where("title", "<=", searchTerm + "\uf8ff")
      );
      const postSnapshot = await getDocs(postsQuery);
      const fetchedPostResults = postSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Query to search users by username
      const usersQuery = query(
        collection(db, "users"),
        where("username", ">=", searchTerm),
        where("username", "<=", searchTerm + "\uf8ff")
      );
      const userSnapshot = await getDocs(usersQuery);
      const fetchedUserResults = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update state with search results
      setPostResults(fetchedPostResults);
      setUserResults(fetchedUserResults);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-4xl p-6 bg-gray-900 rounded-lg shadow-lg">
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by post title or username"
            className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-300 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="absolute inset-y-0 right-5 flex items-center pl-3"
          >
            <FaSearch className="text-gray-400 hover:text-gray-200" />
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Posts</h2>
          {postResults.length > 0 ? (
            postResults.map((post) => <Post key={post.id} post={post} />)
          ) : (
            <p className="text-white">No posts found.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Users</h2>
          {userResults.length > 0 ? (
            userResults.map((user) => <User key={user.id} user={user} />)
          ) : (
            <p className="text-white">No users found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
