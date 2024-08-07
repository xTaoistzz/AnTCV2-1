"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CreateClass from "@/app/components/annotation-props/class/CreateClass";

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
        if (res.type==="success") {
          fetchClass()
          window.location.reload()
        }
//   throw new Error("Failed to delete class");
        // Optionally refresh the class list
        
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
    <main className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950 p-6 rounded-lg">
      <div className="p-6">
        <div className="flex m-5 justify-left border-b border-gray-600 pb-4 space-y-3">
          
          <button
            onClick={handleShowCreate}
            className=" border border-gray-600 bg-gray-800 text-white hover:bg-teal-600 transition-colors duration-300 hover:text-gray-800 font-normal rounded-lg p-2"
          >
            Create Class
          </button>
        </div>
        {/* Render the fetched classes */}
        <div className="text-white pb-3">There are {typedata.length} classes.</div>
        {typedata.map((type, index) => (
          <div
            key={type.class_id}
            className="flex pl-6 pr-6 space-x-3 mb-4 items-center"
          >
            <div className="bg-white p-3 rounded-full">{index + 1}</div>
            {editingClassId === type.class_id ? (
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onBlur={() => handleRenameSubmit(type.class_id)}
                autoFocus
                className="flex-1 p-2 bg-gray-800 text-white rounded-md shadow-md"
              />
            ) : (
              <div className="flex-1 p-2 bg-gray-800 text-white rounded-md shadow-md">
                <span
                  onClick={() => handleEdit(type.class_id, type.class_label)}
                >
                  {type.class_label}
                </span>
              </div>
            )}
            <button
              onClick={() => handleDelete(type.class_id)}
              className="border border-red-600 bg-red-800 text-white hover:bg-red-600 transition-colors duration-300 hover:text-gray-800 font-normal rounded-lg p-2"
            >
              Delete
            </button>
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
