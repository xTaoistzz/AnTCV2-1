"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import CreateClass from "@/app/components/annotation-props/class/CreateClass";
import Dropzone from "../upload/classification_upload";

interface Label {
  class_index: string;
  class_label: string;
}

const Class = () => {
  const [typedata, setTypedata] = useState<Label[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [dropzoneVisible, setDropzoneVisible] = useState<string | null>(null);
  const params = useParams<{ id: string }>();

  const fetchClass = useCallback(async () => {
    try {
      if (type) {
        const res = await fetch(
          `${process.env.ORIGIN_URL}/${type}/class/${params.id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setTypedata(data.strClass);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  }, [params.id, type]);

  useEffect(() => {
    const storedType = localStorage.getItem("Type");
    setType(storedType);
  }, []);

  useEffect(() => {
    if (type) {
      fetchClass();
    }
  }, [type, fetchClass]);

  const handleShowCreate = () => {
    setShowCreate(true);
  };

  const handleCloseCreate = () => {
    setShowCreate(false);
    fetchClass();
  };

  const toggleDropzone = (class_index: string) => {
    setDropzoneVisible(dropzoneVisible === class_index ? null : class_index);
  };

  return (
    <main className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950 p-6 rounded-lg">
      <div className="p-6">
        <div className="flex m-5 justify-between border-b border-gray-600 pb-4">
          <button
            onClick={handleShowCreate}
            className="border border-gray-600 bg-gray-800 text-white hover:bg-teal-600 transition-colors duration-300 hover:text-gray-800 font-normal rounded-lg p-2"
          >
            Create Class
          </button>
        </div>
        {/* Render the fetched classes */}
        {typedata.map((type) => (
          <div key={type.class_index} className="flex flex-col pl-6 pr-6 space-x-3 mb-4 items-start">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-3 rounded-full">{parseInt(type.class_index) + 1}</div>
              <div className="flex-1 p-2 bg-gray-800 text-white rounded-md shadow-md">
                {type.class_label}
              </div>
              <button
                onClick={() => toggleDropzone(type.class_index)}
                className="border border-gray-600 bg-gray-800 text-white hover:bg-teal-600 transition-colors duration-300 hover:text-gray-800 font-normal rounded-lg p-2"
              >
                Upload Image
              </button>
            </div>
            {dropzoneVisible === type.class_index && (
              <Dropzone
                class_index={type.class_index} // Pass `class_index` directly as a string
              />
            )}
          </div>
        ))}
      </div>
      <CreateClass
        isOpen={showCreate}
        onClose={handleCloseCreate}
        idproject={params.id}
        onCreate={fetchClass}
      />
    </main>
  );
};

export default Class;