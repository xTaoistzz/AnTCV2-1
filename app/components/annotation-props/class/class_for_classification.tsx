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
  const [imageData, setImageData] = useState<{ [key: string]: string[] }>({});
  const [imageCount, setImageCount] = useState<{ [key: string]: number }>({});
  const [galleryVisible, setGalleryVisible] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({});
  const [imagesPerPage] = useState(15); // Number of images per page
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
        setImageCount((prev) => ({
          ...prev,
          [classIndex]: data.imgAll.length,
        }));
        setCurrentPage((prev) => ({ ...prev, [classIndex]: 1 })); // Reset to first page
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    },
    [params.id]
  );

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
                  {type.class_label}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleDropzone(type.class_index)}
                  className="border border-gray-600 bg-gray-800 text-white hover:bg-teal-600 transition-colors duration-300 hover:text-gray-800 font-normal rounded-lg p-2"
                >
                  Upload Image
                </button>
                <button
                  onClick={() => toggleGallery(type.class_index)}
                  className="border border-gray-600 bg-gray-800 text-white hover:bg-teal-600 transition-colors duration-300 hover:text-gray-800 font-normal rounded-lg p-2"
                >
                  {galleryVisible[type.class_index]
                    ? `Hide Gallery (${imageCount[type.class_index] || 0} images)`
                    : `View Gallery (${imageCount[type.class_index] || 0} images)`}
                </button>
              </div>
            </div>
            {dropzoneVisible === type.class_index && (
              <Dropzone
                class_index={type.class_index} // Pass `class_index` directly as a string
              />
            )}
            {/* Gallery Section */}
            {galleryVisible[type.class_index] &&
              imageData[type.class_index] && (
                <div>
                  <div className="mt-4 grid grid-cols-5 gap-4">
                    {getPaginatedImages(type.class_index).map((imageName) => (
                      <div key={imageName} className="relative">
                        <img
                          src={`${process.env.ORIGIN_URL}/img/${params.id}/classification/${type.class_index}/${imageName}`}
                          alt={imageName}
                          className="w-36 h-36 object-cover rounded-lg" // 150x150 px
                        />
                        <div className="absolute top-0 left-0 p-2 bg-black bg-opacity-50 text-white text-sm rounded-br-lg">
                          {imageName}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Pagination Controls */}
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() =>
                        handlePageChange(
                          type.class_index,
                          (currentPage[type.class_index] || 1) - 1
                        )
                      }
                      disabled={(currentPage[type.class_index] || 1) <= 1}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
                    >
                      Previous
                    </button>
                    <span className="text-white">
                      Page {currentPage[type.class_index] || 1}
                    </span>
                    <button
                      onClick={() =>
                        handlePageChange(
                          type.class_index,
                          (currentPage[type.class_index] || 1) + 1
                        )
                      }
                      disabled={
                        getPaginatedImages(type.class_index).length <
                        imagesPerPage
                      }
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
                    >
                      Next
                    </button>
                  </div>
                </div>
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