import { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function PostEditorModal({ isOpen, onClose, post }) {
  const [title, setTitle] = useState(post.title);
  const [instructions, setInstructions] = useState(post.instructions);

  const handleSave = async () => {
    const postRef = doc(db, "foodPosts", post.id);
    await updateDoc(postRef, {
      title,
      instructions,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Postsadasd</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
        />
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows="4"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
