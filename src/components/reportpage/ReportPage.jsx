import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { UserIcon } from "@heroicons/react/24/outline";
import { db } from "../../lib/firebase";
import PostModal from "./PostModal"; // Import the PostModal component
import profile from "../../images/assets/profile-user.png"; // Ensure you import the default profile image

export default function ReportPage() {
  const [posts, setPosts] = useState([]);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    const fetchReportsAndPosts = async () => {
      try {
        // Step 1: Fetch all reports
        const reportsRef = collection(db, "reports");
        const reportsQuery = query(reportsRef);
        const reportsSnapshot = await getDocs(reportsQuery);

        const postIds = reportsSnapshot.docs.map(
          (docSnap) => docSnap.data().postId
        );

        if (postIds.length === 0) {
          setPosts([]);
          return;
        }

        // Step 2: Fetch posts based on the postIds obtained from reports
        const postsRef = collection(db, "foodPosts");
        const postsQuery = query(postsRef, orderBy("createdAt", "desc"));
        const allPostsSnapshot = await getDocs(postsQuery);

        const postsArray = allPostsSnapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
          .filter((post) => postIds.includes(post.id));

        // Fetch user data for each post
        const postsWithAuthorData = await Promise.all(
          postsArray.map(async (post) => {
            const userRef = doc(db, "users", post.userId);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.exists() ? userDoc.data() : {};

            return {
              ...post,
              photoUrls: post.photoUrls || [],
              ingredients: post.ingredients || [],
              author: {
                username: userData.username || "Unknown User",
                photoURL: userData.photoURL || profile.src,
              },
            };
          })
        );

        setPosts(postsWithAuthorData);
      } catch (error) {
        console.error("Error fetching posts and reports:", error);
      }
    };

    fetchReportsAndPosts();
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-700 hover:bg-gray-600 text-white shadow rounded-lg overflow-hidden flex flex-col cursor-pointer"
              onClick={() => handlePostClick(post)}
            >
              {/* Image Section */}
              <div className="w-full h-40 overflow-hidden">
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
                    className="w-6 h-6 rounded-full mr-3"
                  />
                  <h3 className="text-white text-sm">{post.author.username}</h3>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 col-span-full">
            No report available comunity are clean
          </div>
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
