import PropTypes from "prop-types";
import userprofile from "../../images/assets/profile-user.png";

export default function User({ user }) {
  // Destructure user properties with fallback values
  const {
    photoURL = "/default-profile.png", // Default profile image
    username = "Unknown User",
    bio = "No bio available",
  } = user || {}; // Handle case where user might be undefined

  return (
    <div className="p-4 border rounded-lg shadow-md mb-4 bg-gray-800 text-white">
      <img
        src={photoURL}
        alt={`Profile picture of ${username}`}
        className="w-16 h-16 rounded-full mb-2 mx-auto object-cover"
      />
      <h3 className="text-white text-xl font-semibold text-center mb-1">
        {username}
      </h3>
      <p className="text-center">{bio}</p>
    </div>
  );
}

// Define PropTypes for the component
User.propTypes = {
  user: PropTypes.shape({
    photoURL: PropTypes.string,
    username: PropTypes.string,
    bio: PropTypes.string,
  }),
};

// Default props to handle cases where user prop might be missing
User.defaultProps = {
  user: {
    photoURL: userprofile.src,
    username: "Unknown User",
    bio: "No bio available",
  },
};
