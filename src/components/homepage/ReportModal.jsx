import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useState } from "react";
import { auth } from "../../lib/firebase"; // Ensure auth is imported and initialized

export default function ReportModal({ isOpen, onClose, post }) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleReport = async () => {
    try {
      console.log("Attempting to report post:", post.id);

      const reportsRef = collection(db, "reports");
      const q = query(
        reportsRef,
        where("postId", "==", post.id),
        where("reportedBy", "==", auth.currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      console.log("Query snapshot size:", querySnapshot.size);

      if (querySnapshot.empty) {
        console.log("No existing report found, creating a new report.");
        await addDoc(reportsRef, {
          postId: post.id,
          reason: reason,
          reportedAt: new Date(),
          reportedBy: auth.currentUser.uid,
        });
        console.log("Successfully reported post:", post.id);
      } else {
        console.log("Post already reported by this user.");
      }

      onClose(); // Close the modal after reporting
    } catch (error) {
      console.error("Error reporting post:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Report Post</h2>
        <p className="mb-4">Are you sure you want to report this post?</p>
        <textarea
          className="w-full p-2 mb-4 border rounded"
          placeholder="Reason for reporting..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleReport}
          >
            Report
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
