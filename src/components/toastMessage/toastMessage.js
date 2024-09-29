import React from "react";
import "./toastMessage.css"; // Add your custom CSS for the toast messages
import { Toast } from "react-bootstrap";

function ToastMessage({ show, onClose, type, message }) {
  console.log(`${show} ${type} ${message}`, onClose); // Improved logging

  return (
    <Toast
      show={show}
      onClose={() => {
        console.log("Closing Toast"); // Debugging
        onClose(); // Call the passed onClose function
      }}
      delay={3000} // Automatically close after 3 seconds
      autohide // Ensure it hides automatically after the delay
      className={`bg-${type} text-white ml-auto`}
    >
      <Toast.Body>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{message}</span>
          <button
            type="button"
            className="btn-close"
            onClick={onClose} // Close toast when button is clicked
            aria-label="Close"
          ></button>
        </div>
      </Toast.Body>
    </Toast>
  );
}

export default ToastMessage;
