import React from "react";

export default function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-gray-800 text-white rounded-lg p-6 w-1/3">
        <h2 className="text-lg font-semibold mb-4">
          Are you sure you want to logout?
        </h2>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-red-600"
          >
            Confirm
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
