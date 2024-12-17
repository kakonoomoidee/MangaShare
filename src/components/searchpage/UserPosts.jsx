import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { UserIcon } from "@heroicons/react/24/outline";
import { db } from "../../lib/firebase";
import PostModal from "./PostModal"; // Import the PostModal component

export default function UserPosts({ userId }) {
  const [posts, setPosts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false); // State for post modal
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    if (userId) {
      const postsRef = collection(db, "foodPosts");
      const postsQuery = query(
        postsRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const postsArray = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            photoUrls: data.photoUrls || [],
            ingredients: data.ingredients || [], // Default to an empty array
          };
        });
        setPosts(postsArray);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setCurrentPost(null);
  };

  const handlePostClick = (post) => {
    setCurrentPost(post);
    setIsPostModalOpen(true);
  };

  const handlePostModalClose = () => {
    setIsPostModalOpen(false);
    setCurrentPost(null);
  };

  return (
    <div className="grid grid-cols-2 gap-4 ml-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-600 text-white shadow rounded-lg overflow-hidden flex relative cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            {/* Image Section */}
            <div className="w-1/2 h-40 overflow-hidden">
              {post.photoUrls.length > 0 ? (
                post.photoUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ))
              ) : (
                <div className="text-center text-gray-400 p-4 h-full flex items-center justify-center">
                  No photos available
                </div>
              )}
            </div>

            {/* Text Content Section */}
            <div className="w-1/2 p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <p className="text-xs text-gray-300 mb-2 flex items-center">
                  <span>
                    {new Date(post.createdAt.toDate()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="mx-2">•</span>
                  <UserIcon className="w-4 h-4" />
                  <span className="ml-1">{post.servings} servings</span>
                </p>
                <p className="text-sm text-gray-200 mb-2">
                  {post.ingredients && post.ingredients.length > 0
                    ? post.ingredients.join(" • ")
                    : "No ingredients available"}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400">No posts available</div>
      )}
      {currentPost && (
        <>
          <PostModal
            isOpen={isPostModalOpen}
            onClose={handlePostModalClose}
            post={currentPost}
          />
        </>
      )}
    </div>
  );
}
