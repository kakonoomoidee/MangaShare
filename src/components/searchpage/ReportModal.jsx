import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useState } from "react";
import { auth } from "../../lib/firebase"; // Ensure auth is imported and initialized

export default function ReportModal({ isOpen, onClose, post }) {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  if (!isOpen) return null;

  const handleReport = async () => {
    try {
      console.log("Attempting to report post:", post.id);

      const finalReason =
        selectedOption === "Other" ? customReason : selectedOption;

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
          reason: finalReason,
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
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4 text-white">Report Post</h2>
        <p className="mb-4 text-gray-300">Select a reason for reporting:</p>
        <select
          className="w-full p-2 mb-4 border rounded bg-gray-700 text-white"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="" disabled>
            Select reason
          </option>
          <option value="Spam">Spam</option>
          <option value="Nudity">Nudity</option>
          <option value="Hate Speech">Hate Speech</option>
          <option value="Dangerous Organizations">
            Dangerous Organizations
          </option>
          <option value="Sale of Illegal Items">Sale of Illegal Items</option>
          <option value="Suicide or Self-Harm">Suicide or Self-Harm</option>
          <option value="Scams">Scams</option>
          <option value="False Information">False Information</option>
          <option value="Other">Other</option>
        </select>

        {selectedOption === "Other" && (
          <textarea
            className="w-full p-2 mb-4 border rounded bg-gray-700 text-white"
            placeholder="Please specify..."
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleReport}
          >
            Report
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
