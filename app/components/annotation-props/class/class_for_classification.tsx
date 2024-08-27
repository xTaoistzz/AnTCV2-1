"use client";
import { ImBin } from "react-icons/im";
import { FaEdit, FaCloudUploadAlt, FaImages, FaPlus, FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
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

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-2">Are you sure you want to delete the class "{className}"?</p>
        <p className="mb-4">This action cannot be undone.</p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const Class = () => {
  const [typedata, setTypedata] = useState<Label[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [visibleDropzone, setVisibleDropzone] = useState<string | null>(null);
  const [visibleGallery, setVisibleGallery] = useState<string | null>(null);
  const [imageData, setImageData] = useState<{ [key: string]: string[] }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(18);
  const [editingClassIndex, setEditingClassIndex] = useState<string | null>(null);
  const [editedLabel, setEditedLabel] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Label | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams<{ id: string }>();

  const classesPerPage = 10;

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
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
    [params.id]
  );

  const handleImageDelete = (classIndex: string) => {
    fetchImages(classIndex);
  };

  const handleDeleteConfirmation = (classToDelete: Label) => {
    setClassToDelete(classToDelete);
    setShowDeleteModal(true);
  };

  const handleDeleteClass = async () => {
    if (!classToDelete) return;

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
            index: classToDelete.class_index,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setTypedata((prev) =>
          prev.filter((cls) => cls.class_index !== classToDelete.class_index)
        );
        setImageData((prev) => {
          const updated = { ...prev };
          delete updated[classToDelete.class_index];
          return updated;
        });
        if (currentPage > Math.ceil((typedata.length - 1) / classesPerPage)) {
          setCurrentPage(prev => Math.max(prev - 1, 1));
        }
      } else {
        console.error("Error deleting class:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }

    setShowDeleteModal(false);
    setClassToDelete(null);
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

  const filteredClasses = typedata.filter(classItem =>
    classItem.class_label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * classesPerPage,
    currentPage * classesPerPage
  );

  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);

  return (
    <main className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen w-full flex flex-col">
      <div className="p-6 flex-grow overflow-auto">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-blue-800 mb-4 sm:mb-0">Classes</h1>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowCreate}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-semibold rounded-lg px-4 py-2 text-sm flex items-center"
            >
              <FaPlus className="mr-2" /> Create Class
            </motion.button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </motion.div>
        
        <motion.p 
          className="text-blue-700 mb-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          There are {filteredClasses.length} classes{searchTerm && " matching your search"}. Click on a class name to edit it.
        </motion.p>

        <div className="space-y-2 mb-4">
          <AnimatePresence>
            {paginatedClasses.map((classItem, index) => (
              <motion.div
                key={classItem.class_index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center p-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">
                    {index + 1 + (currentPage - 1) * classesPerPage}
                  </div>
                  {editingClassIndex === classItem.class_index ? (
                    <div className="flex items-center flex-1">
                      <input
                        type="text"
                        value={editedLabel}
                        onChange={(e) => setEditedLabel(e.target.value)}
                        className="flex-1 p-2 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleEditSave(classItem.class_index)}
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
                    <div 
                      className="flex-1 p-2 text-sm text-blue-800 font-medium cursor-pointer hover:text-blue-600 transition-colors duration-300"
                      onClick={() => handleEditStart(classItem.class_index, classItem.class_label)}
                    >
                      {classItem.class_label}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleDropzone(classItem.class_index)}
                      className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors duration-300"
                    >
                      <FaCloudUploadAlt className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleGallery(classItem.class_index)}
                      className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-colors duration-300 flex items-center"
                    >
                      <FaImages className="w-4 h-4 mr-1" />
                      <span className="text-xs">{imageData[classItem.class_index]?.length || 0}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteConfirmation(classItem)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                    >
                      <ImBin className="w-4 h-4" />
                      </motion.button>
                  </div>
                </div>
                <AnimatePresence>
                  {visibleDropzone === classItem.class_index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Dropzone class_index={classItem.class_index} />
                    </motion.div>
                  )}
                  {visibleGallery === classItem.class_index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Gallery
                        images={imageData[classItem.class_index] || []}
                        classIndex={classItem.class_index}
                        currentPage={1}
                        onPageChange={() => {}}
                        totalImages={imageData[classItem.class_index]?.length || 0}
                        imagesPerPage={imagesPerPage}
                        onImageDelete={handleImageDelete}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white p-2 rounded-full disabled:bg-gray-300 transition-colors duration-300"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-blue-800 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white p-2 rounded-full disabled:bg-gray-300 transition-colors duration-300"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <CreateClass
        isOpen={showCreate}
        onClose={handleCloseCreate}
        idproject={params.id}
        onCreate={fetchClass}
      />

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteClass}
        className={classToDelete?.class_label || ""}
      />
    </main>
  );
};

export default Class;