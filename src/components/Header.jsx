// src/components/Header.jsx
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { FaUserCircle, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
        <img
          src="../images/assets/header-logo.png"
          alt="Logo"
          className="w-32 h-auto"
        />
      </div>
      <div className="flex-grow flex justify-end">
        {user ? (
          <div className="relative flex items-center">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-12 h-12 rounded-full cursor-pointer"
                onClick={toggleDropdown}
              />
            ) : (
              <FaUserCircle
                className="text-3xl text-gray-400 cursor-pointer"
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
              className="text-3xl text-gray-400 cursor-pointer"
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
