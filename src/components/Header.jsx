import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import { useRouter } from "next/navigation";
import {
  FaUserCircle,
  FaSignInAlt,
  FaSignOutAlt,
  FaSun,
  FaMoon,
} from "react-icons/fa"; // Import icons for sun and moon
import { useState, useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import logo from "../images/assets/logov2.png";
import NotificationCenter from "../components/notification/NotificationCenter";

export default function Header() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // State for light/dark mode
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleLoginClick = () => {
    router.push("/login");
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = async () => {
    try {
      await auth.signOut();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 shadow-md z-50 flex items-center p-4 h-16">
      <div className="flex items-center">
        <img src={logo.src} alt="Logo" className="w-14 h-auto" />
      </div>

      <div className="flex-grow flex justify-end items-center space-x-4">
        <NotificationCenter />
        {/* Light/Dark mode toggle button */}
        <button
          onClick={toggleTheme}
          className="text-gray-400 focus:outline-none"
        >
          {isDarkMode ? (
            <FaSun className="text-2xl" />
          ) : (
            <FaMoon className="text-2xl" />
          )}
        </button>
        {user ? (
          <div className="relative flex items-center">
            {userData?.photoURL ? (
              <img
                src={userData.photoURL}
                alt="Profile"
                className="w-7 h-7 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
            ) : (
              <FaUserCircle
                className="text-xl text-gray-400 cursor-pointer"
                onClick={toggleDropdown}
              />
            )}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 bg-gray-800 border border-gray-700 rounded mt-2 w-32 shadow-lg"
                style={{ top: "100%" }}
              >
                <button
                  onClick={handleLogoutClick}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center text-gray-300"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <FaUserCircle
              className="text-2xl text-gray-400 cursor-pointer"
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 bg-gray-800 border border-gray-700 rounded mt-2 w-32 shadow-lg"
                style={{ top: "100%" }}
              >
                <button
                  onClick={handleLoginClick}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center text-gray-300"
                >
                  <FaSignInAlt className="mr-2" />
                  Login
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
