import userprofile from "../../images/assets/profile-user.png";

export default function User({ user }) {
  // Destructure user properties with fallback values
  const {
    photoURL = userprofile, // Use imported default profile image
    username = "Unknown User",
    bio = "No bio available",
  } = user || {}; // Handle case where user might be undefined

  return (
    <div className="bg-gray-900 min-h-screen p-4 flex flex-col items-center">
      <div className="flex flex-wrap gap-4 justify-center">
        {/* User profile item: photo on the left, username and bio on the right */}
        <div className="bg-gray-800 rounded-lg shadow-lg flex items-center w-96">
          <img
            src={photoURL}
            alt={`${username}'s profile`}
            className="w-20 h-20 rounded-full mr-4" // Circle image with right margin
          />
          <div className="flex flex-col">
            <h2 className="text-xl text-white font-semibold">{username}</h2>
            <p className="text-gray-400 text-center mt-1">{bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
