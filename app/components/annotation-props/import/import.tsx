"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, AlertCircle, CheckCircle, Info } from 'lucide-react';

const ImportDataset = () => {
  const [type, setType] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ message: string; type: 'success' | 'error' | null } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const params = useParams<{ id: string }>();

  useEffect(() => {
    const storedType = localStorage.getItem("Type");
    setType(storedType);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file && type && params.id) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("idproject", params.id);
      formData.append("file", file);

      try {
        const response = await fetch(`${process.env.ORIGIN_URL}/import/${type}/YOLO`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });

        if (response.ok) {
          setUploadStatus({ message: "Dataset imported successfully!", type: 'success' });
        } else {
          setUploadStatus({ message: "Import failed. Please try again.", type: 'error' });
        }
      } catch (error) {
        console.error("An error occurred while importing the dataset:", error);
        setUploadStatus({ message: "Import failed. Please check your connection and try again.", type: 'error' });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const InfoModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setShowInfoModal(false)}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-white p-6 rounded-lg max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">YOLO Dataset Import Guide</h2>
        <p className="mb-3">Please prepare your dataset as a ZIP file with the following structure:</p>
        <pre className="bg-gray-100 p-3 rounded mb-3 text-sm">
          {`dataset.zip
├── images/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── ...
├── labels/
│   ├── image1.txt
│   ├── image2.txt
│   └── ...
└── data.yaml`}
        </pre>
        <ul className="list-disc list-inside mb-3">
          <li>The 'images' and 'labels' folders should contain corresponding files.</li>
          <li>Each image in the 'images' folder should have a matching annotation file in the 'labels' folder.</li>
          <li>The data.yaml file should follow the YOLO format, listing class indices and names.</li>
        </ul>
        <p className="mb-3">Example data.yaml content:</p>
        <pre className="bg-gray-100 p-3 rounded mb-3 text-sm">
          {`path: .
train: train
names:
  0: class_name_1
  1: class_name_2
  ...`}
        </pre>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setShowInfoModal(false)}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-72"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-blue-800">Import YOLO Dataset</h1>
        <div className="mb-6">
          <label htmlFor="file-upload" className="block text-sm font-medium text-blue-700 mb-2">
            Select ZIP file
          </label>
          <div className="relative">
            <input
              id="file-upload"
              type="file"
              accept=".zip"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-blue-50 text-blue-700 py-2 px-4 rounded-lg border border-blue-300 hover:bg-blue-100 transition duration-300 flex items-center justify-center"
            >
              <Upload size={20} className="mr-2" />
              {file ? file.name : "Choose a ZIP file"}
            </label>
          </div>
        </div>
        <div className="flex justify-between items-center mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`flex-grow bg-blue-600 text-white py-2 px-4 rounded-lg ${
              !file || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            } transition duration-300 flex items-center justify-center mr-2`}
          >
            {isUploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Upload size={20} />
                </motion.div>
                Importing...
              </>
            ) : (
              <>
                <Upload size={20} className="mr-2" />
                Import Dataset
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInfoModal(true)}
            className="bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition duration-300"
          >
            <Info size={24} />
          </motion.button>
        </div>
        <AnimatePresence>
          {uploadStatus && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mt-4 p-3 rounded-lg ${
                uploadStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              } flex items-center`}
            >
              {uploadStatus.type === 'success' ? (
                <CheckCircle size={20} className="mr-2" />
              ) : (
                <AlertCircle size={20} className="mr-2" />
              )}
              {uploadStatus.message}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <AnimatePresence>
        {showInfoModal && <InfoModal />}
      </AnimatePresence>
    </motion.main>
  );
};

export default ImportDataset;