"use client";
import { ImBin } from "react-icons/im";
import { FaEdit, FaPlus, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CreateClass from "@/app/components/annotation-props/class/CreateClass";
import { motion, AnimatePresence } from "framer-motion";

interface Label {
  class_id: string;
  class_label: string;
}

const Class = () => {
  const [typedata, setTypedata] = useState<Label[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [type, setType] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const classesPerPage = 10;

  const fetchClass = useCallback(async () => {
    try {
      if (type) {
        const res = await fetch(
          `${process.env.ORIGIN_URL}/${type}/class/${params.id}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setTypedata(data.label);
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

  const handleDeleteConfirmation = (class_id: string) => {
    setClassToDelete(class_id);
    setShowDeleteConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      if (type && classToDelete) {
        const response = await fetch(`${process.env.ORIGIN_URL}/delete/${type}/class/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idproject: params.id,
            class_id: classToDelete,
          }),
          credentials: "include",
        });
        const res = await response.json()
        if (res.type === "success") {
          setShowDeleteConfirmation(false);
          setClassToDelete(null);
          await fetchClass();
          if (currentPage > Math.ceil((typedata.length - 1) / classesPerPage)) {
            setCurrentPage(prev => Math.max(prev - 1, 1));
          }
        }
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const handleEdit = (class_id: string, class_label: string) => {
    setEditingClassId(class_id);
    setNewLabel(class_label);
  };

  const handleRenameSubmit = async (class_id: string) => {
    try {
      if (type) {
        await fetch(`${process.env.ORIGIN_URL}/update/${type}/class`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idproject: params.id,
            class_id,
            class_label: newLabel,
          }),
          credentials: "include",
        });
        setEditingClassId(null);
        fetchClass();
      }
    } catch (error) {
      console.error("Error renaming class:", error);
    }
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
    <main className="w-full flex flex-col">
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
                key={classItem.class_id}
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
                  {editingClassId === classItem.class_id ? (
                    <input
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      onBlur={() => handleRenameSubmit(classItem.class_id)}
                      onKeyPress={(e) => e.key === 'Enter' && handleRenameSubmit(classItem.class_id)}
                      autoFocus
                      className="flex-1 p-2 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div 
                      className="flex-1 p-2 text-sm text-blue-800 font-medium cursor-pointer hover:text-blue-600 transition-colors duration-300"
                      onClick={() => handleEdit(classItem.class_id, classItem.class_label)}
                    >
                      {classItem.class_label}
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(classItem.class_id, classItem.class_label)}
                      className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                    >
                      <FaEdit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteConfirmation(classItem.class_id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                    >
                      <ImBin className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white p-2 rounded-full disabled:bg-gray-300"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-blue-800 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-blue-500 text-white p-2 rounded-full disabled:bg-gray-300"
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

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold mb-3">Confirm Deletion</h2>
            <p className="text-sm mb-4">Are you sure you want to delete this class?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Class;