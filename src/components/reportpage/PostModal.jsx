import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import {
  HeartIcon,
  PaperAirplaneIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import profile from "../../images/assets/profile-user.png";

export default function PostModal({ isOpen, onClose, post }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [comment, setComment] = useState("");
  const [hasLiked, setHasLiked] = useState(false);
  const [user, setUser] = useState(null);
  const [usernames, setUsernames] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const menuRef = useRef(null);

  useEffect(() => {
    if (!post || !post.id) return;

    const fetchPostData = async () => {
      const postDoc = await getDoc(doc(db, "foodPosts", post.id));
      if (postDoc.exists()) {
        const data = postDoc.data();
        if (!data.likes) {
          await updateDoc(doc(db, "foodPosts", post.id), {
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
        const userDoc = await getDoc(doc(db, "users", post.userId));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    };

    fetchPostData();
    fetchUserData();
  }, [post]);

  useEffect(() => {
    const fetchUsernames = async () => {
      const usernamesObj = {};
      for (const comment of comments) {
        if (comment.userId) {
          const userDoc = await getDoc(doc(db, "users", comment.userId));
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
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = async () => {
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
    await deleteDoc(doc(db, "foodPosts", post.id));
    setIsDeleteModalOpen(false);
    onClose(); // Optionally close the post modal
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
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
      {/* photo secsion */}
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

        {/* user secsion */}
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

          {/* post description secsion */}
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
            <div
              ref={menuRef}
              className="absolute right-6 bg-gray-800 border border-gray-700 rounded mt-6 w-40 shadow-lg"
            >
              <button
                onClick={() => setIsDeleteModalOpen(true)} // Open the delete confirmation modal
                className="w-full text-left text-red-500 px-4 py-2 hover:bg-gray-700 flex items-center"
              >
                <FlagIcon className="w-5 h-5 mr-3" />
                Report Post
              </button>
            </div>
          )}

          {/* comment secsion */}
          <h3 className="text-lg font-semibold mb-2 text-white">Comments</h3>
          <div
            className="flex-1 overflow-y-auto bg-gray-600 p-4 rounded-lg mb-4"
            style={{ maxHeight: "600px" }}
          >
            <ul className="mb-4">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <li key={index} className="mb-2 text-white">
                    <strong>{usernames[comment.userId] || "User"}</strong>:{" "}
                    {comment.text}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No comments yet.</li>
              )}
            </ul>
          </div>
          <button
            onClick={handleLike}
            className={`flex items-center py-2 w-14 rounded-lg mb-4 ${
              hasLiked ? "text-red-500" : "text-white"
            }`}
          >
            <HeartIcon className="w-6 h-6 mr-2" />
            {likes}
          </button>
          <form
            onSubmit={handleCommentSubmit}
            className="flex bg-gray-800 p-2 rounded-lg"
          >
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg mr-2 bg-gray-600"
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              className="text-white px-4 py-2 rounded-lg flex items-center"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
