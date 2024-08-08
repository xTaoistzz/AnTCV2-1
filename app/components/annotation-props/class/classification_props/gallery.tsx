import React from "react";
import { useParams } from "next/navigation";

interface GalleryProps {
  images: string[];
  classIndex: string;
  currentPage: number;
  onPageChange: (classIndex: string, pageNumber: number) => void;
  totalImages: number;
  imagesPerPage: number;
}

const Gallery: React.FC<GalleryProps> = ({
  images,
  classIndex,
  currentPage,
  onPageChange,
  totalImages,
  imagesPerPage,
}) => {
    const params = useParams<{ id: string }>();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-4">
        {images.map((image, index) => (
          <div key={image} className="flex flex-col items-center">
            <span className="text-white mt-2">{index + 1 + ((currentPage - 1) * imagesPerPage)} : {image}</span>
            <img
              src={`${process.env.ORIGIN_URL}/img/${params.id}/classification/${classIndex}/${image}`}
              alt={image}
              className="w-36 h-36 object-cover rounded-lg"
            />
            
          </div>
        ))}
      </div>
      {totalImages > imagesPerPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => onPageChange(classIndex, currentPage - 1)}
            disabled={currentPage <= 1}
            className="border border-gray-600 bg-gray-800 text-white hover:bg-gray-600 transition-colors duration-300 font-normal rounded-lg p-2"
          >
            Previous
          </button>
          <span className="mx-2 text-white">
            Page {currentPage}
          </span>
          <button
            onClick={() => onPageChange(classIndex, currentPage + 1)}
            disabled={totalImages <= (currentPage * imagesPerPage)}
            className="border border-gray-600 bg-gray-800 text-white hover:bg-gray-600 transition-colors duration-300 font-normal rounded-lg p-2"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;