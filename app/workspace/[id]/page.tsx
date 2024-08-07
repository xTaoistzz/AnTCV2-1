"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function WorkID() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the selected type from localStorage if it exists
    const type = localStorage.getItem("Type");
    if (type) {
      setSelectedType(type);
    }
  }, []);

  const handleTypeSelection = (type: string) => {
    localStorage.setItem("Type", type);
    router.push(`/workspace/${params.id}/${type.toLowerCase()}`);
  };

  return (
    <main className="bg-gradient-to-r from-gray-800 via-gray-900 to-black flex flex-col items-center justify-center text-white">
      {isTypeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-out opacity-100">
          <div className="bg-gray-800 p-6 rounded-lg w-80 transition-transform transform scale-100 ease-out">
            <h2 className="text-2xl font-bold mb-4">Select Type of Annotation</h2>
            <div className="space-y-2">
              <button
                onClick={() => handleTypeSelection("classification")}
                className="w-full bg-red-500 py-2 rounded-lg text-white hover:bg-red-600 transition duration-300"
              >
                Classification
              </button>
              <button
                onClick={() => handleTypeSelection("detection")}
                className="w-full bg-yellow-500 py-2 rounded-lg text-white hover:bg-yellow-600 transition duration-300"
              >
                Detection
              </button>
              <button
                onClick={() => handleTypeSelection("segmentation")}
                className="w-full bg-blue-500 py-2 rounded-lg text-white hover:bg-blue-600 transition duration-300"
              >
                Segmentation
              </button>
            </div>
            {/* Uncomment if you want a cancel button
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsTypeModalOpen(false)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all"
              >
                Cancel
              </button>
            </div>
            */}
          </div>
        </div>
      )}
    </main>
  );
}