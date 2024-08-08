"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import CreateClass from "@/app/components/annotation-props/class/CreateClass";
import Dropzone from "../upload/classification_upload";
import Gallery from "./classification_props/gallery";
import RenameClass from "./classification_props/renameClass";

interface Label {
  class_index: string;
  class_label: string;
}

const Class = () => {
  const [typedata, setTypedata] = useState<Label[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [type, setType] = useState<string | null>(null);
  const [dropzoneVisible, setDropzoneVisible] = useState<string | null>(null);
  const [galleryVisible, setGalleryVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [imageData, setImageData] = useState<{ [key: string]: string[] }>({});
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({});
  const [imagesPerPage] = useState(18); // Number of images per page
  const [renameClassIndex, setRenameClassIndex] = useState<string | null>(null);
  const [newClassLabel, setNewClassLabel] = useState<string>("");
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
        setCurrentPage((prev) => ({ ...prev, [classIndex]: 1 })); // Reset to first page
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
        // Remove the deleted class from the state
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

  const handleRenameClass = async (classIndex: string) => {
    try {
      if (newClassLabel.trim() === "") {
        console.error("Class name cannot be empty");
        return;
      }

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
            class_label: newClassLabel,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        setTypedata((prev) =>
          prev.map((cls) =>
            cls.class_index === classIndex
              ? { ...cls, class_label: newClassLabel }
              : cls
          )
        );
        setRenameClassIndex(null);
        setNewClassLabel("");
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
    setDropzoneVisible(dropzoneVisible === class_index ? null : class_index);
  };

  const toggleGallery = (class_index: string) => {
    setGalleryVisible((prev) => ({
      ...prev,
      [class_index]: !prev[class_index],
    }));
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
          <div
            key={type.class_index}
            className="flex flex-col pl-6 pr-6 space-y-4 mb-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-3 rounded-full">
                  {parseInt(type.class_index) + 1}
                </div>
                <div className="p-2 bg-gray-800 text-white rounded-md shadow-md">
                  {renameClassIndex === type.class_index ? (
                    <RenameClass
                      currentLabel={type.class_label}
                      onSave={(newLabel) => {
                        setNewClassLabel(newLabel);
                        handleRenameClass(type.class_index);
                      }}
                      onCancel={() => {
                        setRenameClassIndex(null);
                        setNewClassLabel("");
                      }}
                    />
                  ) : (
                    <span>{type.class_label}</span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteClass(type.class_index)}
                  className="border border-gray-600 bg-red-600 text-white hover:bg-red-800 transition-colors duration-300 font-normal rounded-lg p-2"
                >
                  Delete
                </button>
                <button
                  onClick={() =>
                    renameClassIndex === type.class_index
                      ? setRenameClassIndex(null)
                      : setRenameClassIndex(type.class_index)
                  }
                  className="border border-gray-600 bg-blue-600 text-white hover:bg-blue-800 transition-colors duration-300 font-normal rounded-lg p-2"
                >
                  Rename
                </button>
                <button
                  onClick={() => toggleDropzone(type.class_index)}
                  className="border border-gray-600 bg-green-600 text-white hover:bg-green-800 transition-colors duration-300 font-normal rounded-lg p-2"
                >
                  Upload
                </button>
                <button
                  onClick={() => toggleGallery(type.class_index)}
                  className="border border-gray-600 bg-purple-600 text-white hover:bg-purple-800 transition-colors duration-300 font-normal rounded-lg p-2"
                >
                  {galleryVisible[type.class_index]
                    ? `Hide Gallery (${
                        imageData[type.class_index]?.length || 0
                      } images)`
                    : `Show Gallery (${
                        imageData[type.class_index]?.length || 0
                      } images)`}
                </button>
              </div>
            </div>
            {dropzoneVisible === type.class_index && (
              <Dropzone class_index={type.class_index} />
            )}
            {galleryVisible[type.class_index] && (
              <Gallery
                images={getPaginatedImages(type.class_index)}
                classIndex={type.class_index}
                currentPage={currentPage[type.class_index] || 1}
                onPageChange={handlePageChange}
                totalImages={imageData[type.class_index]?.length || 0}
                imagesPerPage={imagesPerPage}
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
