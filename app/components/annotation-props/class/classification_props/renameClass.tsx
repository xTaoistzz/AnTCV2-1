import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes } from "react-icons/fa";

interface RenameClassProps {
  currentLabel: string;
  onSave: (newLabel: string) => void;
  onCancel: () => void;
}

const RenameClass: React.FC<RenameClassProps> = ({ currentLabel, onSave, onCancel }) => {
  const [newClassLabel, setNewClassLabel] = useState<string>(currentLabel);
  const [isValid, setIsValid] = useState<boolean>(true);

  useEffect(() => {
    setIsValid(newClassLabel.trim() !== "");
  }, [newClassLabel]);

  const handleSave = () => {
    if (isValid) {
      onSave(newClassLabel.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid) {
      handleSave();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center space-x-2"
      >
        <input
          type="text"
          value={newClassLabel}
          onChange={(e) => setNewClassLabel(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`p-2 rounded-md border ${
            isValid ? 'border-blue-300 focus:border-blue-500' : 'border-red-300 focus:border-red-500'
          } focus:outline-none focus:ring-2 ${
            isValid ? 'focus:ring-blue-200' : 'focus:ring-red-200'
          } transition-colors duration-200`}
          placeholder="Enter class name"
          autoFocus
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={!isValid}
          className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors duration-200 ${
            !isValid && 'opacity-50 cursor-not-allowed'
          }`}
        >
          <FaCheck />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-200"
        >
          <FaTimes />
        </motion.button>
      </motion.div>
      {!isValid && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-sm mt-1"
        >
          Class name cannot be empty
        </motion.p>
      )}
    </AnimatePresence>
  );
};

export default RenameClass;