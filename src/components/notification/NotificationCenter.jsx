import { useState, useEffect, useRef } from "react";
import { FaBell } from "react-icons/fa";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../lib/firebase";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (auth.currentUser) {
        const notificationsQuery = query(
          collection(db, "notifications"),
          where("userId", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(notificationsQuery);
        const notificationsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const notification = doc.data();

            // Fetch user details
            const userDoc = await getDoc(doc(db, "users", notification.userId));
            const userData = userDoc.exists() ? userDoc.data() : {};

            // Fetch post details if needed (for comments/likes)
            let comment = "";
            if (notification.type === "comment") {
              const postDoc = await getDoc(
                doc(db, "food posts", notification.postId)
              );
              if (postDoc.exists()) {
                const postData = postDoc.data();
                const postComment = postData.comments.find(
                  (c) => c.userId === notification.userId
                );

                if (postComment) {
                  comment = postComment.text;
                } else {
                  console.log(
                    `No comment found for userId: ${notification.userId}`
                  );
                }
              } else {
                console.log(
                  `Post with id: ${notification.postId} does not exist`
                );
              }
            }

            return {
              id: doc.id,
              photoURL: userData.photoURL || "",
              username: userData.username || "Unknown User",
              ...notification,
              comment,
            };
          })
        );
        setNotifications(notificationsData);
      }
    };

    fetchNotifications();
  }, []);

  const toggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <FaBell
        className="text-2xl text-gray-400 cursor-pointer"
        onClick={toggleNotifications}
      />
      {isNotificationOpen && (
        <div
          ref={notificationRef}
          className="absolute right-0 bg-gray-800 border border-gray-700 rounded mt-2 w-64 shadow-lg"
          style={{ top: "100%" }}
        >
          <div className="text-white p-4 font-bold">Notifications</div>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="px-4 py-2 text-gray-300 hover:bg-gray-700 cursor-pointer flex items-center space-x-2"
              >
                <img
                  src={notification.photoURL}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <strong className="text-white">
                    {notification.username}
                  </strong>{" "}
                  {notification.type === "like" ? (
                    <>liked your post</>
                  ) : (
                    <>
                      commented:{" "}
                      <span className="text-gray-400">
                        {notification.comment}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">No notifications</div>
          )}
        </div>
      )}
    </div>
  );
}
