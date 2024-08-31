// ProfileContent.jsx
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../lib/firebase";
import EditProfileModal from "./EditProfileModal";
import UserPosts from "./UserPosts";
import profile from "../../images/assets/profile-user.png"; // Import the image

export default function ProfileContent() {
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        setProfileData(doc.data());
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (!user || !profileData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-800 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pt-16 pl-64 p-4 bg-gray-800 text-white mt-5">
      {/* Profile header */}
      <div className="flex flex-col mb-6 ml-5">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={profileData.photoURL || profile.src}
            alt="Profile"
            className="w-40 h-40 rounded-full"
          />
          <div>
            <h2 className="text-2xl font-bold">{profileData.username}</h2>
            <p className="text-gray-400">{profileData.bio}</p>
            <button
              onClick={handleEditClick}
              className="mt-2 bg-gray-600 hover:bg-gray-700 text-white py-1 px-4 rounded"
            >
              Edit profile
            </button>
          </div>
        </div>
        {/* Horizontal line */}
        <hr className="border-gray-600 mb-6" />
      </div>

      {/* User posts */}
      <div className="overflow-y-auto flex-grow">
        <UserPosts userId={user.uid} />
      </div>
      <EditProfileModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
}