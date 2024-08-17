"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

const ImportDataset = () => {
  const [type, setType] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{ message: string; type: 'success' | 'error' | null } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 flex flex-col items-center justify-center p-4"
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg ${
            !file || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          } transition duration-300 flex items-center justify-center`}
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
    </motion.main>
  );
};

export default ImportDataset;