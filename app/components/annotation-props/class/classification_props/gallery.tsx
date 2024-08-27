import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTrash, FaTimes } from "react-icons/fa";

interface GalleryProps {
  images: string[];
  classIndex: string;
  currentPage: number;
  onPageChange: (classIndex: string, pageNumber: number) => void;
  totalImages: number;
  imagesPerPage: number;
  onImageDelete: (classIndex: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({
  images,
  classIndex,
  currentPage,
  onPageChange,
  totalImages,
  imagesPerPage,
  onImageDelete,
}) => {
  const params = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);

  useEffect(() => {
    setLocalCurrentPage(currentPage);
  }, [currentPage]);

  const openImage = (image: string) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const openDeleteModal = (image: string) => {
    setImageToDelete(image);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setImageToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteImage = async () => {
    const type = localStorage.getItem("Type");
    if (!imageToDelete) return;

    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/delete/image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idproject: params.id,
          index: classIndex,
          imgName: imageToDelete,
          type: type,
        }),
        credentials: 'include',
      });

      if (response.ok) {
        closeDeleteModal();
        onImageDelete(classIndex);  // Call this function to trigger a refetch in the parent component
      } else {
        console.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleLocalPageChange = (newPage: number) => {
    setLocalCurrentPage(newPage);
    onPageChange(classIndex, newPage);
  };

  const startIndex = (localCurrentPage - 1) * imagesPerPage;
  const endIndex = Math.min(startIndex + imagesPerPage, images.length);
  const displayedImages = images.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayedImages.length === 0 && (
          <div className="col-span-full text-blue-600 text-center">No Images Available</div>
        )}
        {displayedImages.map((image, index) => (
          <motion.div
            key={image}
            className="flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative group">
              <img
                src={`${process.env.ORIGIN_URL}/img/${params.id}/classification/${classIndex}/${image}`}
                alt={`Image ${startIndex + index + 1}`}
                className="w-full h-36 object-cover rounded-lg shadow-md cursor-pointer transition-transform transform group-hover:scale-105"
                onClick={() => openImage(image)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <button
                  onClick={() => openImage(image)}
                  className="text-white p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors mr-2"
                >
                  <FaSearch />
                </button>
                <button
                  onClick={() => openDeleteModal(image)}
                  className="text-white p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <span className="text-blue-800 mt-2 text-sm">{startIndex + index + 1}</span>
          </motion.div>
        ))}
      </div>

      {totalImages > imagesPerPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handleLocalPageChange(localCurrentPage - 1)}
            disabled={localCurrentPage <= 1}
            className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 font-normal rounded-lg px-4 py-2 mr-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mx-2 text-blue-800 flex items-center">
            Page {localCurrentPage} of {Math.ceil(totalImages / imagesPerPage)}
          </span>
          <button
            onClick={() => handleLocalPageChange(localCurrentPage + 1)}
            disabled={totalImages <= (localCurrentPage * imagesPerPage)}
            className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 font-normal rounded-lg px-4 py-2 ml-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeImage}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl max-h-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${process.env.ORIGIN_URL}/img/${params.id}/classification/${classIndex}/${selectedImage}`}
                alt={selectedImage}
                className="max-w-full max-h-full rounded-lg shadow-2xl"
              />
              <button
                onClick={closeImage}
                className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2 hover:bg-red-600 transition-colors"
              >
                <FaTimes />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 rounded-lg shadow-xl"
            >
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-4">Are you sure you want to delete this image?</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteImage}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;