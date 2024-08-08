// /components/workspace-props/edit.tsx

import React from 'react';

interface Project {
  idproject: number;
  project_name: string;
  description: string;
}

interface EditProjectProps {
  project: Project;
  onSave: (updatedProject: Project) => void;
  onCancel: () => void;
}

const EditProject: React.FC<EditProjectProps> = ({ project, onSave, onCancel }) => {
  const [projectName, setProjectName] = React.useState(project.project_name);
  const [description, setDescription] = React.useState(project.description);

  const handleSave = () => {
    onSave({ ...project, project_name: projectName, description });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Edit Project</h2>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 border border-gray-600 rounded-lg"
        />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 border border-gray-600 rounded-lg"
        />
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProject;