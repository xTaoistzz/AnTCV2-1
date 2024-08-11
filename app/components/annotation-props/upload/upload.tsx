"use client";
import { FaEdit, FaCloudUploadAlt, FaImages } from "react-icons/fa";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useParams, useRouter } from "next/navigation";

const Dropzone = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | null } | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
  }, []);

  const removeFile = (file: File) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== file));
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("idproject", params.id);
    files.forEach(file => {
      formData.append("image", file);
    });

    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/uploadImage`, {
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
      router.refresh(); // Refresh the page after successful upload
    } catch (error) {
      console.error("Error uploading file:", error);
      setNotification({ message: "Error uploading files. Please try again.", type: 'error' });
    }
  };

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

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <main className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950 p-6 rounded-lg">
      <div
        {...getRootProps()}
        className="border-4 border-dashed border-gray-600 p-6 rounded-lg cursor-pointer flex flex-col items-center justify-center mb-4"
      >
        <input {...getInputProps()} />
        <p className="flex flex-col text-white items-center justify-center content-center text-center">
          <FaCloudUploadAlt className="w-10 h-10"/>
          Drag 'n' drop some files here, or click to select files
        </p>
      </div>

      {notification && (
        <div
          className={`mb-4 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      <div className="grid grid-cols-5 gap-4 mb-4">
        {currentFiles.map((file, index) => (
          <div key={index} className="relative h-32 w-32">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="h-full w-full object-cover rounded-md"
            />
            <button
              onClick={() => removeFile(file)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 m-1"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between mb-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <button
        onClick={handleSave}
        className="bg-teal-600 text-white px-6 py-2 rounded-lg"
      >
        Save
      </button>
    </main>
  );
};

export default Dropzone;