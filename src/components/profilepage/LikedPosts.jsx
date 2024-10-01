import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { UserIcon } from "@heroicons/react/24/outline";
import PostModal from "./PostModal"; // Ensure to import the modal

const LikedPosts = ({ userId }) => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    const postsRef = collection(db, "foodPosts");
    const q = query(postsRef, where("likedUsers", "array-contains", userId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        photoUrls: doc.data().photoUrls || [],
        ingredients: doc.data().ingredients || [], // Default to an empty array
      }));
      setLikedPosts(posts);
    });

    return () => unsubscribe();
  }, [userId]);

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
      {likedPosts.length === 0 ? (
        <p className="text-gray-400">No liked posts yet.</p>
      ) : (
        likedPosts.map((post) => (
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
      )}
      {currentPost && (
        <PostModal
          isOpen={isPostModalOpen}
          onClose={handlePostModalClose}
          post={currentPost}
        />
      )}
    </div>
  );
};

export default LikedPosts;
