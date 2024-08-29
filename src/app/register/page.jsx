"use client";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import backround from "../../images/login-register/bg.png"; // Import the image

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState(""); // New state for fullname
  const [username, setUsername] = useState(""); // New state for username
  const [error, setError] = useState(null);
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

  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${backround.src})`,
        width: "auto",
        height: "auto",
      }}
    >
      <div className="bg-white bg-opacity-45 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          onClick={handleRegister}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          Register
        </button>
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <button
            onClick={() => router.push("/login")}
            className="text-purple-600"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
