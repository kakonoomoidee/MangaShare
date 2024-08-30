"use client";

import { useState } from "react";
import { storage, db, auth } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadForm() {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [servings, setServings] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setPhotos([...e.target.files]);
  };

  const getUniqueTitle = async (baseTitle) => {
    const postsRef = collection(db, "foodPosts");
    const q = query(postsRef, where("title", "==", baseTitle));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return baseTitle;
    } else {
      let count = 1;
      let newTitle = `${baseTitle} (${count})`;
      while (!snapshot.empty) {
        count++;
        newTitle = `${baseTitle} (${count})`;
        const q = query(postsRef, where("title", "==", newTitle));
        const snapshot = await getDocs(q);
      }
      return newTitle;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const uniqueTitle = await getUniqueTitle(title);

      const photoUrls = await Promise.all(
        photos.map(async (photo) => {
          const photoRef = ref(
            storage,
            `foodPhotos/${auth.currentUser.uid}/${uniqueTitle}/${photo.name}`
          );
          await uploadBytes(photoRef, photo);
          return getDownloadURL(photoRef); // Ensure this URL is correct
        })
      );

      await addDoc(collection(db, "foodPosts"), {
        title: uniqueTitle,
        instructions,
        ingredients: ingredients.split(",").map((item) => item.trim()), // Convert ingredients to an array
        servings,
        photoUrls, // Array of URLs
        createdAt: new Date(),
        userId: auth.currentUser.uid, // Store the user ID
        likes: 0, // Initialize likes to 0
        comments: 0, // Initialize comments to 0
      });

      toast.success("Upload successful!");
    } catch (error) {
      console.error("Error uploading content: ", error);
      toast.error("Error uploading content.");
    } finally {
      setUploading(false);
      setTitle("");
      setInstructions("");
      setIngredients("");
      setServings(1);
      setPhotos([]);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Upload Konten Masakan</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Foto:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Judul Makanan:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Bahan-Bahan:</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            placeholder="Pisahkan dengan koma, contoh: garam, gula, telur"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Jumlah Porsi:
          </label>
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            required
            min="1"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Cara Memasak:
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            rows="4"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
}
