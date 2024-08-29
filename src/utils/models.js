// Define the User object structure
export const User = {
  id: "",
  username: "",
  email: "",
  avatar: "",
  followers: [],
  following: [],
  description: "",
  timestamp: null, // This can be a Timestamp object or a Date
};

// Define the Timestamp object structure
export const Timestamp = {
  seconds: 0,
  nanoseconds: 0,
};

// Define the PostModel object structure
export const PostModel = {
  id: "",
  userid: "",
  username: "",
  avatar: "",
  image: "",
  caption: "",
  timestamp: null, // This can be a Timestamp object or a Date
};

// Define the CommentModel object structure
export const CommentModel = {
  id: "",
  userid: "",
  username: "",
  avatar: "",
  comment: "",
  timestamp: null, // Assuming Timestamp
};

// Define the LikeModel object structure
export const LikeModel = {
  id: "",
  userid: "",
  username: "",
  avatar: "",
  timestamp: null, // Assuming Timestamp
};

// Define the BookmarkModel object structure
export const BookmarkModel = {
  id: "",
  userid: "",
  username: "",
  avatar: "",
  timestamp: null, // Assuming Timestamp
};

// Define the UserSession object structure
export const UserSession = {
  user: {
    name: null,
    image: null,
    email: null,
    uid: null,
  },
};
