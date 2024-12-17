import { FaTimes } from "react-icons/fa";
import { db, auth } from "../../lib/firebase";


export default function UserProfileModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Close Button */}
      <button
        className="absolute top-2 right-32 text-white text-2xl"
        onClick={onClose}
      >
        <FaTimes />
      </button>
      {/* Modal Card */}
      <div className="bg-gray-800 w-[80vw] h-[90vh] p-4 rounded-lg shadow-lg relative flex">
        {/* Content can be added here */}
      </div>
    </div>
  );
}
