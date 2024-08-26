import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

interface CreateProjectProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
}

const CreateProject: React.FC<CreateProjectProps> = ({ isOpen, onClose, onCreate }) => {
  const [newProject, setNewProject] = useState<{
    project_name: string;
    description: string;
  }>({
    project_name: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = async () => {
    if (!newProject.project_name.trim()) {
      setError("Project name cannot be empty");
      return;
    }
    
    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/create/project`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
        credentials: 'include',
      });

      if (response.ok) {
        await response.json();
        onCreate();
        setNewProject({ project_name: '', description: '' });
        setError(null);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('An error occurred while creating the project:', error);
      setError('An unexpected error occurred. Please try again.');
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
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative"
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <IoClose className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-blue-800">Create New Project</h2>
            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}
            <input
              type="text"
              placeholder="Enter your dataset name"
              value={newProject.project_name}
              onChange={(e) =>
                setNewProject({ ...newProject, project_name: e.target.value })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Why are you create dataset for?"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            />
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 mr-2 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Create
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateProject;