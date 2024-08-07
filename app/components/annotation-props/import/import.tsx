"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const ImportDataset = () => {
  const [type, setType] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
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
          setUploadStatus("Upload successful!");
        } else {
          setUploadStatus("Upload failed.");
        }
      } catch (error) {
        console.error("An error occurred while uploading the file:", error);
        setUploadStatus("Upload failed.");
      }
    }
  };

  return (
    <main className="bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-96 flex flex-col items-center justify-center text-white">
      <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md w-full max-w-lg drop-shadow-2xl border border-gray-700">
        <h1 className="text-xl font-bold mb-4 text-teal-300">Import Dataset</h1>
        <input 
          type="file" 
          accept=".zip" 
          onChange={handleFileChange} 
          className="mb-4 text-gray-300"
        />
        <button 
          onClick={handleUpload} 
          className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all"
        >
          Upload
        </button>
        {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
      </div>
    </main>
  );
};

export default ImportDataset;