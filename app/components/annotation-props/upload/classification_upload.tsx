"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone, FileRejection, DropEvent } from "react-dropzone";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaCloudUploadAlt, FaTimes, FaCheck, FaInfoCircle } from "react-icons/fa";

interface DropzoneProps {
  class_index: string;
}

const Dropzone: React.FC<DropzoneProps> = ({ class_index }) => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' | null } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
    // Filter accepted files to only include images
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
    setFiles(prevFiles => [...prevFiles, ...imageFiles]);

    // Show notification for rejected files
    if (fileRejections.length > 0 || acceptedFiles.length !== imageFiles.length) {
      setNotification({
        message: "Only image files (e.g., JPEG, PNG) are allowed. Some files were rejected.",
        type: 'error'
      });
    }
  }, []);

  const removeFile = (file: File) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== file));
  };

  const handleSave = async () => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("idproject", params.id);
    formData.append("index", class_index);
    files.forEach(file => {
      formData.append("image", file);
    });

    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/classification/uploadImage`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      console.log("File uploaded successfully:", data);
      setNotification({ message: "Files uploaded successfully!", type: 'success' });
      setTimeout(() => {
        window.location.reload(); // Refresh the page after successful upload
      }, 2000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setNotification({ message: "Error uploading files. Please try again.", type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
    };
  }, [files]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiles = files.slice(startIndex, endIndex);

  const totalPages = Math.ceil(files.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {'image/*': ['.jpeg', '.jpg', '.png']},
    multiple: true
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="mb-4 p-4 bg-blue-100 text-blue-800 rounded-lg flex items-start">
        <FaInfoCircle className="mr-2 mt-1 flex-shrink-0" />
        <p>
          Please upload image files only (JPEG, PNG). Other file types will be rejected.
          Maximum file size: 5MB per image.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-4 border-dashed ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-blue-200'
        } p-6 rounded-lg cursor-pointer flex flex-col items-center justify-center mb-6 transition-colors duration-300`}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt className="text-5xl text-blue-500 mb-4" />
        <p className="text-blue-800 text-center">
          {isDragActive
            ? "Drop the image files here"
            : "Drag 'n' drop some image files here, or click to select files"}
        </p>
      </div>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`mb-4 p-4 rounded-lg ${
              notification.type === 'success' ? 'bg-green-500' :
              notification.type === 'error' ? 'bg-red-500' :
              'bg-blue-500'
            } text-white flex items-center justify-between`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="text-white">
              <FaTimes />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {currentFiles.map((file, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative group"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="h-32 w-full object-cover rounded-md shadow-md transition-transform transform group-hover:scale-105"
            />
            <button
              onClick={() => removeFile(file)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <FaTimes />
            </button>
          </motion.div>
        ))}
      </div>

      {files.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors duration-200 hover:bg-blue-600"
          >
            Previous
          </button>
          <span className="text-blue-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors duration-200 hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        disabled={files.length === 0 || isUploading}
        className={`w-full bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center justify-center ${
          files.length === 0 || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
        } transition-colors duration-200`}
      >
        {isUploading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-2"
            >
              <FaCloudUploadAlt />
            </motion.div>
            Uploading...
          </>
        ) : (
          <>
            <FaCheck className="mr-2" /> Save
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default Dropzone;