import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import profile from "../../images/assets/profile-user.png";
import DeleteConfirmationModal from "../notification/DeleteConfirmationModal";

export default function PostModal({ isOpen, onClose, post }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [comment, setComment] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [usernames, setUsernames] = useState({});
  const [reports, setReports] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteFromReportModalOpen, setIsDeleteFromReportModalOpen] =
    useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!post || !post.id) return;

    const fetchPostData = async () => {
      const postRef = doc(db, "foodPosts", post.id);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const data = postDoc.data();
        if (!data.likes) {
          await updateDoc(postRef, {
            likes: 0,
            comments: [],
            likedUsers: [],
          });
        }
        setLikes(data.likes || 0);
        setHasLiked(data.likedUsers?.includes(auth.currentUser?.uid) || false);
      }
    };

    const fetchUserData = async () => {
      if (post.userId) {
        const userRef = doc(db, "users", post.userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    };

    const fetchReports = async () => {
      const reportsRef = collection(db, "reports");
      const reportsQuery = query(reportsRef, where("postId", "==", post.id));
      const reportsSnapshot = await getDocs(reportsQuery);

      const reportsArray = await Promise.all(
        reportsSnapshot.docs.map(async (docSnap) => {
          const reportData = docSnap.data();
          if (reportData.reportedBy) {
            const userRef = doc(db, "users", reportData.reportedBy);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              reportData.reportedByUsername = userDoc.data().username;
            }
          }
          return reportData;
        })
      );

      setReports(reportsArray);
    };

    fetchPostData();
    fetchUserData();
    fetchReports();
  }, [post]);

  useEffect(() => {
    const fetchUsernames = async () => {
      const usernamesObj = {};
      for (const comment of comments) {
        if (comment.userId) {
          const userRef = doc(db, "users", comment.userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            usernamesObj[comment.userId] = userDoc.data().username;
          }
        }
      }
      setUsernames(usernamesObj);
    };

    fetchUsernames();
  }, [comments]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".menu-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = async () => {
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }

    if (!hasLiked) {
      const newLikes = likes + 1;
      setLikes(newLikes);
      setHasLiked(true);

      const postRef = doc(db, "foodPosts", post.id);
      await updateDoc(postRef, {
        likes: newLikes,
        likedUsers: [...(post.likedUsers || []), auth.currentUser.uid],
      });
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    const postRef = doc(db, "foodPosts", post.id);
    await deleteDoc(postRef);
    setIsDeleteModalOpen(false);
    onClose();
  };

  const handleDeleteFromReport = async () => {
    const reportsRef = collection(db, "reports");
    const reportsQuery = query(reportsRef, where("postId", "==", post.id));
    const reportsSnapshot = await getDocs(reportsQuery);

    const batch = writeBatch(db);
    reportsSnapshot.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    await batch.commit();
    setIsDeleteFromReportModalOpen(false);
    onClose();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }

    if (comment) {
      const newComment = { userId: auth.currentUser.uid, text: comment };
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setComment("");

      const postRef = doc(db, "foodPosts", post.id);
      await updateDoc(postRef, { comments: updatedComments });
    }
  };

  if (!isOpen) return null;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <button
        className="absolute top-2 right-32 text-white text-2xl"
        onClick={onClose}
      >
        &times;
      </button>
      <div className="bg-gray-800 w-[80vw] h-[90vh] p-4 rounded-lg shadow-lg relative flex">
        <div className="w-1/2 h-full overflow-hidden rounded-lg mr-4">
          {post.photoUrls && post.photoUrls.length > 0 ? (
            <Slider {...sliderSettings}>
              {post.photoUrls.map((url, index) => (
                <div
                  key={index}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={url}
                    alt={`Post ${index}`}
                    className="max-w-full max-h-full object-cover"
                  />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="text-center text-gray-400 p-4 h-full flex items-center justify-center">
              No photos available
            </div>
          )}
        </div>

        <div className="w-1/3 h-full overflow-hidden rounded-lg mr-4">
          <div className="flex items-center mb-4 border-b border-gray-600 pb-4">
            <img
              src={user?.photoURL || profile.src}
              alt="User"
              className="w-10 h-10 rounded-full mr-3"
            />
            <h3 className="text-lg font-semibold text-white">
              {user?.username || "Unknown User"}
            </h3>
          </div>

          {post.title && (
            <h2 className="text-2xl font-bold text-white mb-2">{post.title}</h2>
          )}

          <h4 className="text-lg font-semibold text-white mb-1">
            Ingredients:
          </h4>
          {post.ingredients && (
            <div
              className="flex-1 overflow-y-auto bg-gray-600 p-4 rounded-lg mb-4"
              style={{ maxHeight: "150px" }}
            >
              <ul className="list-disc list-inside text-white">
                {post.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          )}
          <h4 className="text-lg font-semibold text-white mb-1">
            Instructions:
          </h4>
          {post.instructions && (
            <div
              className="flex-1 overflow-y-auto bg-gray-600 p-4 rounded-lg mb-4"
              style={{ maxHeight: "600px" }}
            >
              <p className="text-white">{post.instructions}</p>
            </div>
          )}
        </div>

        <div className="w-1/4 flex flex-col h-full relative">
          <button
            onClick={handleMenuToggle}
            className="absolute top-1 right-3 text-white text-sm z-50"
          >
            •••
          </button>
          {isMenuOpen && (
            <div className="menu-container absolute right-6 bg-gray-800 border border-gray-700 rounded mt-6 shadow-lg">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="w-full text-left text-red-500 px-4 py-2 hover:bg-gray-700 flex items-center"
              >
                <TrashIcon className="w-5 h-5 mr-3" />
                Delete Post
              </button>
              <button
                onClick={() => setIsDeleteFromReportModalOpen(true)}
                className="w-full text-left text-yellow-600 px-4 py-2 hover:bg-gray-700 flex items-center"
              >
                <TrashIcon className="w-5 h-5 mr-3" />
                Delete From Report
              </button>
            </div>
          )}

          {/* Reported by section */}
          <h3 className="text-lg font-semibold mb-2 text-white">Reported by</h3>
          <div
            className="flex-1 overflow-y-auto bg-gray-600 p-4 rounded-lg mb-4"
            style={{ maxHeight: "600px" }}
          >
            <ul className="mb-4">
              {reports.length > 0 ? (
                reports.map((report, index) => (
                  <li key={index} className="mb-2 text-white">
                    <strong>
                      {report.reportedByUsername || "Unknown User"}
                    </strong>
                    : {report.reason || "No reason provided"}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No reports available.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Are you sure you want to delete this post?"
      />

      <DeleteConfirmationModal
        isOpen={isDeleteFromReportModalOpen}
        onClose={() => setIsDeleteFromReportModalOpen(false)}
        onConfirm={handleDeleteFromReport}
        title="Are you sure you want to remove this post from the reports?"
      />
    </div>
  );
}
