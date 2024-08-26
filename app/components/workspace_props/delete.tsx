import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmDeleteProjectProps {
  isOpen: boolean;
  projectId: number;
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

const ConfirmDeleteProject: React.FC<ConfirmDeleteProjectProps> = ({
  isOpen,
  projectName,
  onConfirm,
  onCancel,
  isDeleting
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-96"
          >
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete the project "{projectName}"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-300"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDeleteProject;