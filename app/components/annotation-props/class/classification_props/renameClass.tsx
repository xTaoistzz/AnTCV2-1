// components/RenameClass.tsx

import React, { useState } from "react";

interface RenameClassProps {
  currentLabel: string;
  onSave: (newLabel: string) => void;
  onCancel: () => void;
}

const RenameClass: React.FC<RenameClassProps> = ({ currentLabel, onSave, onCancel }) => {
  const [newClassLabel, setNewClassLabel] = useState<string>(currentLabel);

  const handleSave = () => {
    onSave(newClassLabel);
  };

  return (
    <div className="flex items-center space-x-2 text-black">
      <input
        type="text"
        value={newClassLabel}
        onChange={(e) => setNewClassLabel(e.target.value)}
        className="p-1 rounded-md"
      />
      <button
        onClick={handleSave}
        className="border border-gray-600 bg-gray-800 text-white hover:bg-teal-600 transition-colors duration-300 font-normal rounded-lg p-1"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="border border-gray-600 bg-gray-800 text-white hover:bg-red-600 transition-colors duration-300 font-normal rounded-lg p-1"
      >
        Cancel
      </button>
    </div>
  );
};

export default RenameClass;