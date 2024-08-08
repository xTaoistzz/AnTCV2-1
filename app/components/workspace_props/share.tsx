// components/workspace_props/AddCollaborator.tsx
import { useState } from 'react';

interface AddCollaboratorProps {
  projectId: number;
  onClose: () => void;
  onCollaboratorAdded: () => void;
}

const AddCollaborator: React.FC<AddCollaboratorProps> = ({ projectId, onClose, onCollaboratorAdded }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddCollaborator = async () => {
    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/shareProject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idproject: projectId, username }),
        credentials: 'include',
      });

      if (response.ok) {
        setUsername('');
        onCollaboratorAdded();
        onClose();
      } else {
        throw new Error('Failed to add collaborator');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('An error occurred while adding a collaborator:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white text-gray-800 p-6 rounded-lg w-80">
        <h2 className="text-xl font-bold mb-4">Add Collaborator</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="border border-gray-300 p-2 w-full rounded-lg mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleAddCollaborator}
            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all"
          >
            Add
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCollaborator;