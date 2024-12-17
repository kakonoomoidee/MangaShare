import { useState } from "react";
import UserProfileModal from "./UserProfileModal";
import userprofile from "../../images/assets/profile-user.png";

export default function UserItem({ users }) {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user); // Set the selected user to show the modal
  };

  const closeModal = () => {
    setSelectedUser(null); // Close the modal by setting the selected user to null
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4 flex flex-col items-center">
      <div className="flex flex-col gap-4 justify-center w-3xl">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 rounded-lg shadow-lg flex items-center w-full p-4 cursor-pointer"
              onClick={() => handleUserClick(user)} // Trigger the click handler
            >
              <img
                src={user.photoURL || userprofile}
                alt={`${user.username}'s profile`}
                className="w-12 h-12 rounded-full mr-4"
              />
              {/* Use flex-col to stack username and bio vertically */}
              <div className="flex flex-col justify-center">
                <h2 className="text-xl text-white font-semibold">{user.username}</h2>
                <p className="text-gray-400 text-sm mt-1">{user.bio || "No bio available"}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No users found</p>
        )}
      </div>

      {/* Show the modal if there's a selected user */}
      {selectedUser && (
        <UserProfileModal user={selectedUser} onClose={closeModal} />
      )}
    </div>
  );
}
