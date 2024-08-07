import React, { useState } from "react";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-white">Create Class</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={classLabel}
            onChange={(e) => setClassLabel(e.target.value)}
            placeholder="Class Label"
            className="border border-gray-600 bg-gray-700 text-white p-2 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white hover:bg-gray-500 transition-colors duration-300 font-normal rounded-lg px-4 py-2 mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-500 text-white hover:bg-teal-600 transition-colors duration-300 font-normal rounded-lg px-4 py-2"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClass;