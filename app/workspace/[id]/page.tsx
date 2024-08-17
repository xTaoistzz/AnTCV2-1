"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function WorkID() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isTypeModalOpen, setIsTypeModalOpen] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const type = localStorage.getItem("Type");
    if (type) {
      setSelectedType(type);
      setIsTypeModalOpen(false);
      router.push(`/workspace/${params.id}/${type.toLowerCase()}`);
    }
  }, []);

  const handleTypeSelection = (type: string) => {
    localStorage.setItem("Type", type);
    setSelectedType(type);
    setIsTypeModalOpen(false);
    router.push(`/workspace/${params.id}/${type.toLowerCase()}`);
  };

  return (
    <main className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300 flex flex-col items-center justify-center min-h-screen text-blue-800">
      <AnimatePresence>
        {isTypeModalOpen && (
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
              className="bg-white p-8 rounded-xl shadow-2xl w-96"
            >
              <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">Choose Annotation Type</h2>
              <div className="space-y-4">
                <button
                  onClick={() => handleTypeSelection("detection")}
                  className="w-full bg-blue-500 py-3 rounded-lg text-white font-semibold hover:bg-blue-600 transition duration-300 shadow-md"
                >
                  Detection
                </button>
                <button
                  onClick={() => handleTypeSelection("segmentation")}
                  className="w-full bg-green-500 py-3 rounded-lg text-white font-semibold hover:bg-green-600 transition duration-300 shadow-md"
                >
                  Segmentation
                </button>
              </div>
              <p className="mt-6 text-sm text-center text-blue-600">
                Select the type of annotation you want to perform for this project.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}