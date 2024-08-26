import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FaBrain, FaImage, FaEdit } from 'react-icons/fa';

interface Project {
  idproject: number;
  project_name: string;
  description: string;
  type: string;
}

interface EditProjectProps {
  project: Project;
  onSave: any;
  onCancel: () => void;
}

const EditProject: React.FC<EditProjectProps> = ({ project, onSave, onCancel }) => {
  const [projectName, setProjectName] = useState(project.project_name);
  const [description, setDescription] = useState(project.description);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (projectName.trim() === '') {
      setError('Project name cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/updateProject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idproject: project.idproject,
          project_name: projectName,
          description: description,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const updatedProject = await response.json();
      onSave(updatedProject);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating the project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
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
            onClick={onCancel}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <IoClose className="h-6 w-6" />
          </button>
          <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center">
            <FaEdit className="mr-2" /> Edit AI Annotation Project
          </h2>
          <div className="mb-4">
            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <div className="relative">
              <input
                id="projectName"
                type="text"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaBrain className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Project Description
            </label>
            <div className="relative">
              <textarea
                id="projectDescription"
                placeholder="Enter project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              />
              <FaImage className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="flex justify-end">
            <button
              onClick={onCancel}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 mr-2 transition duration-300"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProject;