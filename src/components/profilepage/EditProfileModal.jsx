import { useState, useEffect, useRef } from "react";
import { storage, db } from "../../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../lib/firebase";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function EditProfileModal({ isOpen, onClose }) {
  const [user] = useAuthState(auth);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [username, setUsername] = useState("");
  const [fullname, setfullname] = useState(""); // Added state for full name
  const [bio, setBio] = useState("");
  const [editorPhoto, setEditorPhoto] = useState(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cropperRef = useRef(null);

  useEffect(() => {
    if (user && isOpen) {
      const fetchProfileData = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUsername(data.username || "");
            setfullname(data.fullname || ""); // Fetching full name
            setBio(data.bio || "");
            setPhotoURL(data.photoURL || "/default-avatar.png");
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
          setError("Failed to load profile data.");
        }
      };
      fetchProfileData();
    }
  }, [user, isOpen]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setEditorPhoto(URL.createObjectURL(file));
      setIsCropModalOpen(true);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const userRef = doc(db, "users", user.uid);

      if (croppedImage) {
        const photoRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(photoRef, croppedImage);
        const newPhotoURL = await getDownloadURL(photoRef);
        await updateDoc(userRef, { photoURL: newPhotoURL });
      }

      await updateDoc(userRef, { username, fullname, bio }); // Update full name

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      cropper.getCroppedCanvas().toBlob((blob) => {
        setCroppedImage(blob);
      });
      setIsCropModalOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Edit Profile Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 text-white p-6 rounded-lg w-1/3 relative">
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loading && <p className="text-blue-500 mb-4">Saving...</p>}

          <div className="mb-4 flex items-center bg-gray-800 rounded-2xl">
            <img
              src={photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-2 object-cover px-4 py-4"
            />
            <div className="mb-4 flex flex-col">
              <span className="text-xl font-bold mb-1">{username}</span>{" "}
              <span className="text-md text-gray-400">{fullname}</span>{" "}
            </div>
            <label className="ml-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <span className="ml-12 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Change Photo
              </span>
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Full Name</label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setfullname(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
              disabled={loading}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Cropper Modal */}
      {isCropModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg w-1/3 relative">
            <h2 className="text-xl font-bold mb-4">Crop Photo</h2>
            <Cropper
              src={editorPhoto}
              ref={cropperRef}
              style={{ height: 400, width: "100%" }}
              aspectRatio={1}
              guides={false}
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={() => setIsCropModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCrop}
                className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
