import React, { useState } from 'react';

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

  const handleCreateProject = async () => {
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
        onClose();
      } else {
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('An error occurred while creating the project:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
        <input
          type="text"
          placeholder="Project Name"
          value={newProject.project_name}
          onChange={(e) =>
            setNewProject({ ...newProject, project_name: e.target.value })
          }
          className="w-full p-2 mb-4 bg-gray-800 border border-gray-600 rounded-lg"
        />
        <textarea
          placeholder="Project Description"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
          className="w-full p-2 mb-4 bg-gray-800 border border-gray-600 rounded-lg"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateProject}
            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;