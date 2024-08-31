import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Post from "./Post";
import User from "./User"; // Asumsikan Anda memiliki komponen User untuk menampilkan detail pengguna

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [postResults, setPostResults] = useState([]);
  const [userResults, setUserResults] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      // Query untuk mencari postingan berdasarkan judul
      const postsQuery = query(
        collection(db, "posts"),
        where("title", ">=", searchTerm),
        where("title", "<=", searchTerm + "\uf8ff")
      );
      const postSnapshot = await getDocs(postsQuery);
      const fetchedPostResults = postSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Query untuk mencari pengguna berdasarkan nama pengguna
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

      // Menyimpan hasil pencarian di state
      setPostResults(fetchedPostResults);
      setUserResults(fetchedUserResults);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-lg">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by post title or username"
          className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-700 text-white"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Search
        </button>

        <div className="mt-4">
          <h2 className="text-xl font-bold text-white"></h2>
          {postResults.length > 0 ? (
            postResults.map((post) => (
              <Post key={post.id} post={post} />
            ))
          ) : (
            <p className="text-white"></p>
          )}
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold text-white"></h2>
          {userResults.length > 0 ? (
            userResults.map((user) => (
              <User key={user.id} user={user} />
            ))
          ) : (
            <p className="text-white"></p>
          )}
        </div>
      </div>
    </div>
  );
}
