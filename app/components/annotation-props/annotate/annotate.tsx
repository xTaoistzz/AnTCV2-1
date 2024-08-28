"use client";
import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  Image as ImageIcon,
  ArrowLeftCircle,
  ArrowRightCircle,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import DeleteImageCon from "./DeleteImageCon";

interface ImageData {
  image_path: string;
  iddetection: string;
  idsegmentation: string;
  bbox?: number;
  polygon?: number;
}

const IMAGE_PER_PAGE = 12;

export default function Annotate() {
  const params = useParams<{ id: string }>();
  const idproject = params.id;
  const Detection = dynamic(() => import("./detection"), { ssr: false });
  const Segmentation = dynamic(() => import("./segmentation"), { ssr: false });

  const [allUrl, setUrl] = useState<string[]>([]);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);
  const [allData, setAllData] = useState<ImageData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [idDetection, setIdDetection] = useState<string | null>(null);
  const [idSegmentation, setIdSegmentation] = useState<string | null>(null);
  const type =
    typeof window !== "undefined" ? localStorage.getItem("Type") : null;
  const [isGalleryOpen, setGalleryOpen] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{
    name: string;
    index: number;
  } | null>(null);

  const fetchExternalImages = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.ORIGIN_URL}/${type}/all${type}/${idproject}`,
        {
          credentials: "include",
        }
      );
      const alldata = await res.json();
      console.log(alldata);
      if (type === "detection") {
        setAllData(alldata.detection);
        setIdDetection(alldata.detection[0].iddetection);
        const urls = alldata.detection.map(
          (img: ImageData) =>
            `${process.env.ORIGIN_URL}/img/${idproject}/thumbs/${img.image_path}`
        );
        setUrl(urls);
      } else if (type === "segmentation") {
        setAllData(alldata.segmentation);
        setIdSegmentation(alldata.segmentation[0].idsegmentation);
        const urls = alldata.segmentation.map(
          (img: ImageData) =>
            `${process.env.ORIGIN_URL}/img/${idproject}/thumbs/${img.image_path}`
        );
        setUrl(urls);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }, [idproject, type]);

  useEffect(() => {
    fetchExternalImages();
  }, [fetchExternalImages]);

  useEffect(() => {
    if (allUrl.length > 0) {
      setActiveUrl(allUrl[0]);
    }
  }, [allUrl]);

  const totalPages = Math.ceil(allUrl.length / IMAGE_PER_PAGE);
  const displayImages = allUrl.slice(
    (currentPage - 1) * IMAGE_PER_PAGE,
    currentPage * IMAGE_PER_PAGE
  );

  const send_id_compared = (url: string) => {
    setActiveUrl(url);
    const image_path = url.split("/").pop();
    const matchedData = allData.find((com) => com.image_path === image_path);
    if (matchedData) {
      if (type === "detection") {
        setIdDetection(matchedData.iddetection);
      } else if (type === "segmentation") {
        setIdSegmentation(matchedData.idsegmentation);
      }
    }
  };

  const handleNextImage = () => {
    const currentIndex = allUrl.indexOf(activeUrl!);
    const nextIndex = (currentIndex + 1) % allUrl.length;
    send_id_compared(allUrl[nextIndex]);
  };

  const handlePreviousImage = () => {
    const currentIndex = allUrl.indexOf(activeUrl!);
    const prevIndex = (currentIndex - 1 + allUrl.length) % allUrl.length;
    send_id_compared(allUrl[prevIndex]);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const toggleGallery = () => {
    setGalleryOpen(!isGalleryOpen);
  };

  const handleDeleteConfirmation = (imgName: string, index: number) => {
    setImageToDelete({ name: imgName, index: index });
    setShowDeleteModal(true);
  };

  const handleDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      const res = await fetch(`${process.env.ORIGIN_URL}/delete/image`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          idproject,
          imgName: imageToDelete.name,
          type,
          index: imageToDelete.index,
        }),
      });

      if (res.ok) {
        // Update the state to remove the deleted image from the gallery
        const newUrls = allUrl.filter(
          (url) => !url.includes(imageToDelete.name)
        );
        setUrl(newUrls);

        // Update activeUrl if necessary
        if (activeUrl?.includes(imageToDelete.name)) {
          setActiveUrl(newUrls.length > 0 ? newUrls[0] : null);
        }

        // Update idDetection or idSegmentation if necessary
        if (type === "detection") {
          setAllData(
            allData.filter((img) => img.image_path !== imageToDelete.name)
          );
          setIdDetection(newUrls.length > 0 ? allData[0].iddetection : null);
        } else if (type === "segmentation") {
          setAllData(
            allData.filter((img) => img.image_path !== imageToDelete.name)
          );
          setIdSegmentation(
            newUrls.length > 0 ? allData[0].idsegmentation : null
          );
        }
      } else {
        console.error("Failed to delete the image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
    setShowDeleteModal(false);
    setImageToDelete(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className=""
    >
      {!activeUrl && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-blue-600 bg-white p-2 m-2 rounded-lg shadow-md flex items-center"
        >
          <ImageIcon size={24} className="mr-3 text-blue-500" />
          <span>
            You don't have images for Annotations. Please upload your images to
            use this feature.
          </span>
        </motion.div>
      )}
      {activeUrl && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-lg shadow-md p-2 m-2 flex justify-between items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousImage}
            className="bg-blue-500 text-white p-2 rounded-full focus:outline-none"
          >
            <ArrowLeftCircle size={24} />
          </motion.button>
          <span className="mx-4 text-blue-700 font-medium truncate max-w-xs">
            {activeUrl.split("/").pop()}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextImage}
            className="bg-blue-500 text-white p-2 rounded-full focus:outline-none"
          >
            <ArrowRightCircle size={24} />
          </motion.button>
        </motion.div>
      )}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className=" rounded-lg shadow-md"
        // style={{ height: "calc(100vh - 300px)" }}
      >
        {type === "detection" && activeUrl && idDetection && (
          <Detection
            idproject={idproject}
            iddetection={idDetection}
            imageUrl={activeUrl.replace("thumbs", "images")}
          />
        )}
        {type === "segmentation" && activeUrl && idSegmentation && (
          <Segmentation
            idproject={idproject}
            idsegmentation={idSegmentation}
            imageUrl={activeUrl.replace("thumbs", "images")}
          />
        )}
      </motion.div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: isGalleryOpen ? 0 : "calc(100% - 50px)" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-200 rounded-t-lg shadow-lg"
      >
        <div className="flex justify-between items-center p-2 bg-blue-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleGallery}
            className="bg-blue-500 text-white p-2 rounded-full focus:outline-none flex items-center justify-center"
            aria-label={isGalleryOpen ? "Collapse Gallery" : "Expand Gallery"}
          >
            {isGalleryOpen ? (
              <ChevronDown size={24} />
            ) : (
              <ChevronUp size={24} />
            )}
          </motion.button>
          {isGalleryOpen && (
            <div className="flex justify-center items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFirstPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-blue-500 text-white"
                }`}
              >
                <ChevronsLeft size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-blue-500 text-white"
                }`}
              >
                <ChevronLeft size={20} />
              </motion.button>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                {currentPage} / {totalPages}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-blue-500 text-white"
                }`}
              >
                <ChevronRight size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-blue-500 text-white"
                }`}
              >
                <ChevronsRight size={20} />
              </motion.button>
            </div>
          )}
        </div>
        <AnimatePresence>
          {isGalleryOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap justify-center p-4 gap-4">
                {displayImages.map((url, index) => {
                  const image_path = url.split("/").pop();
                  const imageData = allData.find(
                    (img) => img.image_path === image_path
                  );
                  const isAnnotated =
                    imageData &&
                    ((type === "detection" && imageData.bbox === 1) ||
                      (type === "segmentation" && imageData.polygon === 1));

                  return (
                    <motion.div
                      key={index}
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img
                        src={url}
                        className={`cursor-pointer h-24 w-24 object-cover rounded-lg shadow-md transition-all duration-300 ${
                          url === activeUrl ? "ring-4 ring-blue-500" : ""
                        }`}
                        onClick={() => send_id_compared(url)}
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleDeleteConfirmation(
                            url.split("/").pop() || "",
                            index
                          )
                        }
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 focus:outline-none"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                      {isAnnotated && (
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full">
                          <Check size={16} />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <DeleteImageCon
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteImage}
      />
    </motion.div>
  );
}