// components/HomePage.jsx
import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import CommentModal from "./CommentModal";
import Post from "./Post"; // Importing the Post component

export default function HomePage() {
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState([]); // Removed type annotation
  const [newPost, setNewPost] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "foodposts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsData = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const postData = doc.data();
          const userRef = doc(db, "users", postData.userId);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data();

          return {
            id: doc.id,
            ...postData,
            username: userData?.username || "Unknown User",
          };
        })
      );
      console.log("Fetched posts:", postsData); // Debug log
      setPosts(postsData);
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!user || !newPost.trim()) return;

    try {
      await addDoc(collection(db, "foodposts"), {
        userId: user.uid,
        text: newPost,
        timestamp: Timestamp.now(),
      });
      setNewPost("");
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const handleCommentClick = (postId) => {
    setSelectedPostId(postId);
    setIsCommentModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="mb-4">
        {user ? (
          <form onSubmit={handlePostSubmit} className="mb-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-2"
            >
              Post
            </button>
          </form>
        ) : (
          <p>Please log in to post.</p>
        )}
      </div>

      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onCommentClick={handleCommentClick}
            />
          ))
        ) : (
          <p className="text-gray-400">No posts available</p>
        )}
      </div>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={handleCloseCommentModal}
        postId={selectedPostId}
      />
    </div>
  );
}
