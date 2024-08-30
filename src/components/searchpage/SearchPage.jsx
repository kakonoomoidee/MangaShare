import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Post from "./post";
import User from "./User"; // Assuming you have a User component for displaying user details

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const postsQuery = query(
        collection(db, "posts"),
        where("title", ">=", searchTerm),
        where("title", "<=", searchTerm + "\uf8ff")
      );
      const postSnapshot = await getDocs(postsQuery);
      const postResults = postSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const usersQuery = query(
        collection(db, "users"),
        where("username", ">=", searchTerm),
        where("username", "<=", searchTerm + "\uf8ff")
      );
      const userSnapshot = await getDocs(usersQuery);
      const userResults = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSearchResults([...postResults, ...userResults]);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-start bg-gray-800 p-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by post title or username"
        className="w-full max-w-md p-2 border border-gray-600 rounded bg-gray-900 text-white"
      />
      <button
        onClick={handleSearch}
        className="mt-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Search
      </button>

      <div className="mt-4 w-full max-w-md">
        <h2 className="text-xl font-bold text-white">Search Results</h2>
        {searchResults.length > 0 ? (
          searchResults.map((result) => {
            if (result.title) {
              return <Post key={result.id} post={result} />;
            } else if (result.username) {
              return <User key={result.id} user={result} />;
            }
            return null; // Ensure to handle cases where result is neither post nor user
          })
        ) : (
          <p className="text-white">No results found.</p>
        )}
      </div>
    </div>
  );
}
