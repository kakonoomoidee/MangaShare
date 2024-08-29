import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function CommentModal({ isOpen, onClose, postId }) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addDoc(collection(db, "comments"), {
        postId,
        text: comment,
        timestamp: Timestamp.now(),
      });
      setComment("");
      setError("");
      onClose();
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-4 rounded-lg w-1/3">
        <h2 className="text-xl font-bold mb-2">Add a Comment</h2>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Post Comment
          </button>
          <button
            onClick={onClose}
            className="ml-2 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
