"use client";
import { ImBin } from "react-icons/im";
import { FaEdit, FaPlus } from "react-icons/fa";
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
  const params = useParams<{ id: string }>();
  const router = useRouter();

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

  const handleDelete = async (class_id: string) => {
    try {
      if (type) {
        const response = await fetch(`${process.env.ORIGIN_URL}/delete/${type}/class/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idproject: params.id,
            class_id: class_id,
          }),
          credentials: "include",
        });
        const res = await response.json()
        if (res.type === "success") {
          fetchClass()
          window.location.reload()
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
        
        <motion.p 
          className="text-blue-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          There are {typedata.length} classes. Click on a class name to edit it.
        </motion.p>

        <AnimatePresence>
          {typedata.map((classItem, index) => (
            <motion.div
              key={classItem.class_id}
              className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center p-4">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4">
                  {index + 1}
                </div>
                {editingClassId === classItem.class_id ? (
                  <input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onBlur={() => handleRenameSubmit(classItem.class_id)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRenameSubmit(classItem.class_id)}
                    autoFocus
                    className="flex-1 p-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div 
                    className="flex-1 p-2 text-blue-800 font-medium cursor-pointer hover:text-blue-600 transition-colors duration-300"
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
                    <FaEdit className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(classItem.class_id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                  >
                    <ImBin className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
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