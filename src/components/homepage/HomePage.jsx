import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { UserIcon } from "@heroicons/react/24/outline";
import { db } from "../../lib/firebase";
import PostModal from "./PostModal";
import profile from "../../images/assets/profile-user.png"; // Ensure you import the default profile image

// A more robust shuffle function
const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsRef = collection(db, "foodPosts");
      const postsQuery = query(postsRef, orderBy("createdAt", "desc")); // Order by creation time initially
      const unsubscribe = onSnapshot(postsQuery, async (snapshot) => {
        const postsArray = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();
            const postId = docSnap.id;

            // Fetch the user data for the post author
            const userRef = doc(db, "users", data.userId);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.exists() ? userDoc.data() : {};

            return {
              id: postId,
              ...data,
              photoUrls: data.photoUrls || [],
              ingredients: data.ingredients || [],
              author: {
                username: userData.username || "Unknown User",
                photoURL: userData.photoURL || profile.src,
              },
            };
          })
        );

        // Shuffle postsArray
        const shuffledPosts = shuffleArray(postsArray);
        setPosts(shuffledPosts);
      });

      return () => unsubscribe();
    };

    fetchPosts();
  }, []);

  const handlePostClick = (post) => {
    setCurrentPost(post);
    setIsPostModalOpen(true);
  };

  const handlePostModalClose = () => {
    setIsPostModalOpen(false);
    setCurrentPost(null);
  };

  return (
    <div className="bg-gray-800 min-h-screen p-4 flex flex-col items-center">
      <div className="flex flex-wrap gap-4 justify-center">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-700 hover:bg-gray-600 text-white shadow rounded-lg overflow-hidden flex relative cursor-pointer w-[800px] h-auto"
              onClick={() => handlePostClick(post)}
            >
              {/* Image Section */}
              <div className="w-full h-52 overflow-hidden">
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
              <div className="w-full p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                  <p className="text-xs text-gray-300 mb-2 flex items-center">
                    <span>
                      {new Date(post.createdAt.toDate()).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                    <span className="mx-2">•</span>
                    <UserIcon className="w-4 h-4" />
                    <span className="ml-1">{post.servings} servings</span>
                  </p>
                  <p className="text-sm text-gray-200 mb-2">
                    {post.ingredients.length > 0
                      ? post.ingredients.join(" • ")
                      : "No ingredients available"}
                  </p>
                </div>

                {/* Author Info Section */}
                <div className="flex items-center mt-4 border-t border-gray-600 pt-2">
                  <img
                    src={post.author.photoURL}
                    alt="User"
                    className="w-7 h-7 rounded-full mr-3"
                  />
                  <h3 className="text-white">{post.author.username}</h3>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">No posts available</div>
        )}
      </div>
      {currentPost && (
        <PostModal
          isOpen={isPostModalOpen}
          onClose={handlePostModalClose}
          post={currentPost}
        />
      )}
    </div>
  );
}
