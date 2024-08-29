import React from "react";

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 text-white rounded-lg p-6 w-1/3">
        <h2 className="text-lg font-semibold mb-4">Delete post?</h2>
        <p className="mb-6">Are you sure you want to delete this post?</p>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
