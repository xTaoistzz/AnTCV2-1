"use client";
import { ImBin } from "react-icons/im";
import { FaEdit, FaCloudUploadAlt, FaImages, FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import CreateClass from "@/app/components/annotation-props/class/CreateClass";
import Dropzone from "../upload/classification_upload";
import Gallery from "./classification_props/gallery";
import { motion, AnimatePresence } from "framer-motion";

interface Label {
  class_index: string;
  class_label: string;
}

const Class = () => {
  const [typedata, setTypedata] = useState<Label[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [visibleDropzone, setVisibleDropzone] = useState<string | null>(null);
  const [visibleGallery, setVisibleGallery] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ [key: string]: string[] }>({});
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({});
  const [imagesPerPage] = useState(18);
  const [editingClassIndex, setEditingClassIndex] = useState<string | null>(null);
  const [editedLabel, setEditedLabel] = useState<string>("");
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

  const fetchImages = useCallback(
    async (classIndex: string) => {
      try {
        const res = await fetch(
          `${process.env.ORIGIN_URL}/classification/getImg`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idproject: params.id,
              index: classIndex,
            }),
            credentials: "include",
          }
        );
        const data = await res.json();
        setImageData((prev) => ({ ...prev, [classIndex]: data.imgAll }));
        setCurrentPage((prev) => ({ ...prev, [classIndex]: 1 }));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
    [params.id]
  );

  const handleDeleteClass = async (classIndex: string) => {
    try {
      const response = await fetch(
        `${process.env.ORIGIN_URL}/classification/deleteClass`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idproject: params.id,
            index: classIndex,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setTypedata((prev) =>
          prev.filter((cls) => cls.class_index !== classIndex)
        );
        setImageData((prev) => {
          const updated = { ...prev };
          delete updated[classIndex];
          return updated;
        });
        setCurrentPage((prev) => {
          const updated = { ...prev };
          delete updated[classIndex];
          return updated;
        });
      } else {
        console.error("Error deleting class:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const handleEditStart = (classIndex: string, currentLabel: string) => {
    setEditingClassIndex(classIndex);
    setEditedLabel(currentLabel);
  };

  const handleEditCancel = () => {
    setEditingClassIndex(null);
    setEditedLabel("");
  };

  const handleEditSave = async (classIndex: string) => {
    if (editedLabel.trim() === "") {
      console.error("Class name cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.ORIGIN_URL}/classification/updateClass`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idproject: params.id,
            index: classIndex,
            class_label: editedLabel,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setTypedata((prev) =>
          prev.map((cls) =>
            cls.class_index === classIndex
              ? { ...cls, class_label: editedLabel }
              : cls
          )
        );
        setEditingClassIndex(null);
        setEditedLabel("");
      } else {
        console.error("Error renaming class:", await response.text());
      }
    } catch (error) {
      console.error("Error renaming class:", error);
    }
  };

  useEffect(() => {
    const storedType = localStorage.getItem("Type");
    setType(storedType);
  }, []);

  useEffect(() => {
    if (type) {
      fetchClass();
    }
  }, [type, fetchClass]);

  useEffect(() => {
    typedata.forEach((cls) => fetchImages(cls.class_index));
  }, [typedata, fetchImages]);

  const handleShowCreate = () => {
    setShowCreate(true);
  };

  const handleCloseCreate = () => {
    setShowCreate(false);
    fetchClass();
  };

  const toggleDropzone = (class_index: string) => {
    setVisibleDropzone(visibleDropzone === class_index ? null : class_index);
  };

  const toggleGallery = (class_index: string) => {
    setVisibleGallery(visibleGallery === class_index ? null : class_index);
  };

  const handlePageChange = (class_index: string, pageNumber: number) => {
    setCurrentPage((prev) => ({ ...prev, [class_index]: pageNumber }));
  };

  const getPaginatedImages = (classIndex: string) => {
    const start = (currentPage[classIndex] - 1) * imagesPerPage;
    const end = start + imagesPerPage;
    return imageData[classIndex]?.slice(start, end) || [];
  };

  return (
    <main className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg shadow-lg">
      <div className="p-6">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-blue-800">Classes</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShowCreate}
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-semibold rounded-lg px-4 py-2 flex items-center"
          >
            <FaPlus className="mr-2" /> Create Class
          </motion.button>
        </motion.div>
        <AnimatePresence>
          {typedata.map((type) => (
            <motion.div
              key={type.class_index}
              className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between p-4 bg-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 text-white p-3 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                    {parseInt(type.class_index) + 1}
                  </div>
                  <div className="text-lg font-semibold text-blue-800">
                    {editingClassIndex === type.class_index ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={editedLabel}
                          onChange={(e) => setEditedLabel(e.target.value)}
                          className="border-b border-blue-500 bg-transparent focus:outline-none"
                        />
                        <button
                          onClick={() => handleEditSave(type.class_index)}
                          className="ml-2 text-green-500 hover:text-green-600"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="ml-2 text-red-500 hover:text-red-600"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <span onClick={() => handleEditStart(type.class_index, type.class_label)}>
                        {type.class_label}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleDropzone(type.class_index)}
                    className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-300"
                  >
                    <FaCloudUploadAlt className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleGallery(type.class_index)}
                    className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-colors duration-300 flex items-center"
                  >
                    <FaImages className="w-5 h-5 mr-2" />
                    <span>{imageData[type.class_index]?.length || 0}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteClass(type.class_index)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                  >
                    <ImBin className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
              <AnimatePresence>
                {visibleDropzone === type.class_index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dropzone class_index={type.class_index} />
                  </motion.div>
                )}
                {visibleGallery === type.class_index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Gallery
                      images={getPaginatedImages(type.class_index)}
                      classIndex={type.class_index}
                      currentPage={currentPage[type.class_index] || 1}
                      onPageChange={handlePageChange}
                      totalImages={imageData[type.class_index]?.length || 0}
                      imagesPerPage={imagesPerPage}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
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