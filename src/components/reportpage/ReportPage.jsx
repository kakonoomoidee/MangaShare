import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/firebase";
import PostModal from "./PostModal";

export default function ReportPage() {
  const [reports, setReports] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("reportedAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(reportsData);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenPost = async (postId) => {
    // Fetch the post details using the postId
    const postDoc = await getDoc(doc(db, "foodPosts", postId));
    if (postDoc.exists()) {
      setCurrentPost({ id: postDoc.id, ...postDoc.data() });
    }
  };

  const handleCloseModal = () => {
    setCurrentPost(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Reported Posts</h1>
      <ul>
        {reports.map((report) => (
          <li key={report.id} className="mb-4">
            <div className="flex justify-between items-center">
              <span>Post ID: {report.postId}</span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => handleOpenPost(report.postId)}
              >
                View Post
              </button>
            </div>
          </li>
        ))}
      </ul>

      {currentPost && (
        <PostModal
          isOpen={!!currentPost}
          onClose={handleCloseModal}
          post={currentPost}
        />
      )}
    </div>
  );
}
