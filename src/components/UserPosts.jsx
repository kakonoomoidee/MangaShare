// UserPosts.jsx
import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export default function UserPosts({ userId }) {
  const [posts, setPosts] = useState([]);

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
          };
        });
        setPosts(postsArray);
      });

      return () => unsubscribe();
    }
  }, [userId]);

  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="bg-gray-700 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-2">{post.title}</h3>
            <p className="text-sm text-gray-400 mb-2">
              {new Date(post.createdAt.toDate()).toLocaleDateString()}
            </p>
            {post.photoUrls.length > 0 ? (
              <div className="flex overflow-x-auto space-x-2 pb-2">
                {post.photoUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Photo ${index + 1}`}
                    className="h-40 w-auto object-cover rounded"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400">
                No photos available
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400">No posts available</div>
      )}
    </div>
  );
}
