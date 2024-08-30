import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";

export default function PostEditorModal({ isOpen, onClose, post }) {
  const [title, setTitle] = useState(post.title || "");
  const [ingredients, setIngredients] = useState(
    post.ingredients?.join(", ") || ""
  );
  const [instructions, setInstructions] = useState(post.instructions || "");
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!post || !post.id) return;

    const fetchUserData = async () => {
      if (post.userId) {
        const userDoc = await getDoc(doc(db, "users", post.userId));
        if (userDoc.exists()) {
          // Set user data if needed
        }
      }
    };

    fetchUserData();
  }, [post]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const postRef = doc(db, "foodPosts", post.id);
      await updateDoc(postRef, {
        title,
        ingredients: ingredients.split(",").map((item) => item.trim()), // Convert ingredients to an array
        instructions,
      });
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Close button */}
      <button
        className="absolute top-12 right-52 text-white text-2xl"
        onClick={onClose}
      >
        &times;
      </button>
      <div className="bg-gray-800 w-[70vw] h-[80vh] p-4 rounded-lg shadow-lg relative flex">
        {/* Post Image Slider */}
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

        <div className="w-1/2 h-full overflow-hidden rounded-lg ml-4 flex flex-col">
          <form
            onSubmit={handleSave}
            className="flex flex-col h-full space-y-4"
          >
            <div>
              <h4 className="text-lg font-semibold text-white mb-1">Title:</h4>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <div className="flex-grow">
              <h4 className="text-lg font-semibold text-white mb-1">
                Ingredients:
              </h4>
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                required
                rows="4"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                placeholder="Separate ingredients with commas"
              />
            </div>
            <div className="flex-grow">
              <h4 className="text-lg font-semibold text-white mb-1">
                Instructions:
              </h4>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                required
                rows="6"
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
