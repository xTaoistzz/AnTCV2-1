import { FC } from "react";

interface ModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: FC<ModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-4 text-black">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="bg-gray-300 text-black py-2 px-4 rounded-lg mr-2 hover:bg-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;