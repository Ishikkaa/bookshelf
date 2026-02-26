import React from "react";

const DeleteBookModal = ({ isOpen, bookTitle, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <p className="modal-text">
          Are you sure you want to delete <strong>{bookTitle}</strong>?
        </p>

        <div className="modal-actions">
          <button className="btn cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn confirm-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookModal;
