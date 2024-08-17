import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface CreateClassProps {
  isOpen: boolean;
  onClose: () => void;
  idproject: string;
  onCreate: () => void;
}

const CreateClass: React.FC<CreateClassProps> = ({ isOpen, onClose, idproject, onCreate }) => {
  const [classLabel, setClassLabel] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const type = localStorage.getItem("Type");

    try {
      const res = await fetch(`${process.env.ORIGIN_URL}/create/${type}/label`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ idproject, class_label: classLabel }),
      });

      if (res.ok) {
        setClassLabel("");
        onCreate();
        onClose();
      } else {
        console.error("Error creating class");
      }
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white p-6 rounded-lg w-full max-w-sm shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-800">Create Class</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={classLabel}
                onChange={(e) => setClassLabel(e.target.value)}
                placeholder="Enter Class Label"
                className="border border-gray-300 bg-white text-gray-800 p-2 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                required
              />
              <div className="flex justify-end space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors duration-300 font-medium rounded-lg px-4 py-2"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-medium rounded-lg px-4 py-2"
                >
                  Create
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateClass;