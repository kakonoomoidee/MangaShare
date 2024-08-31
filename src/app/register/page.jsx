"use client";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import background from "../../images/login-register/bg.png"; // Import the image
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState(""); // State for fullname
  const [username, setUsername] = useState(""); // State for username
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const router = useRouter();

  const handleRegister = async () => {
    if (email === "" || password === "" || fullname === "" || username === "") {
      setError("All fields must be filled");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      // Set user document in 'users' collection
      await setDoc(doc(db, "users", userId), {
        email: email, // Save email
        fullname: fullname, // Save fullname
        username: username, // Save username
      });

      // Set document in 'accounts' collection (without eMoneyBalance)
      await setDoc(doc(db, "accounts", userId), {
        userId: userId,
      });

      router.push("/login");
    } catch (error) {
      console.error("Error registering:", error);
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError(error.message);
    }
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "auto",
        height: "auto",
      }}
    >
      <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white">Register</h1>
        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-300"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-300"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-300"
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error && <div className="text-red-400 mb-4">{error}</div>}
        <button
          onClick={handleRegister}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-500 mb-4"
        >
          Register
        </button>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center hover:bg-blue-500 mb-4"
        >
          <FaGoogle className="mr-2" />
          Continue with Google
        </button>
        <div className="mt-4 text-center">
          <span className="text-gray-300">Already have an account? </span>
          <button
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:underline"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
