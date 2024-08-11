"use client";
import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { ImBin } from "react-icons/im";

interface ImageData {
  image_path: string;
  iddetection: string;
  idsegmentation: string;
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
  const type = typeof window !== "undefined" ? localStorage.getItem("Type") : null;
  const [isGalleryOpen, setGalleryOpen] = useState(true);

  const fetchExternalImages = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.ORIGIN_URL}/${type}/all${type}/${idproject}`, {
        credentials: "include",
      });
      const alldata = await res.json();
      console.log(alldata);
      if (type === "detection") {
        setAllData(alldata.detection);
        setIdDetection(alldata.detection[0].iddetection);
        const urls = alldata.detection.map(
          (img: ImageData) => `${process.env.ORIGIN_URL}/img/${idproject}/thumbs/${img.image_path}`
        );
        setUrl(urls);
      } else if (type === "segmentation") {
        setAllData(alldata.segmentation);
        setIdSegmentation(alldata.segmentation[0].idsegmentation);
        const urls = alldata.segmentation.map(
          (img: ImageData) => `${process.env.ORIGIN_URL}/img/${idproject}/thumbs/${img.image_path}`
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

  const toggleGallery = () => {
    setGalleryOpen(!isGalleryOpen);
  };

  const handleDeleteImage = async (imgName: string, index: number) => {
    try {
      const res = await fetch(`${process.env.ORIGIN_URL}/delete/image`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          idproject,
          imgName,
          type,
          index,
        }),
      });

      if (res.ok) {
        // Update the state to remove the deleted image from the gallery
        const newUrls = allUrl.filter((url) => !url.includes(imgName));
        setUrl(newUrls);

        // Update activeUrl if necessary
        if (activeUrl?.includes(imgName)) {
          setActiveUrl(newUrls.length > 0 ? newUrls[0] : null);
        }

        // Update idDetection or idSegmentation if necessary
        if (type === "detection") {
          setAllData(allData.filter((img) => img.image_path !== imgName));
          setIdDetection(newUrls.length > 0 ? allData[0].iddetection : null);
        } else if (type === "segmentation") {
          setAllData(allData.filter((img) => img.image_path !== imgName));
          setIdSegmentation(newUrls.length > 0 ? allData[0].idsegmentation : null);
        }
      } else {
        console.error("Failed to delete the image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="p-5">
      {!activeUrl && (
        <div className="text-gray-500">
          You don't have images for Annotations, Please upload your images to use this feature
        </div>
      )}
      {activeUrl && (
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePreviousImage}
            className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            &lt;
          </button>
          <span className="mx-4 text-gray-700 font-medium">
            {activeUrl.split("/").pop()}
          </span>
          <button
            onClick={handleNextImage}
            className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            &gt;
          </button>
        </div>
      )}
      <div
        className={`overflow-y-auto max-h-[calc(100vh-220px)]`}
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
      </div>
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-black rounded-t-lg shadow-lg transition-all duration-500 ${
          isGalleryOpen ? "translate-y-0" : "translate-y-2/3"
        }`}
      >
        <div className="flex justify-between items-center p-2">
          <button
            onClick={toggleGallery}
            className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            {isGalleryOpen ? "Collapse Gallery" : "Expand Gallery"}
          </button>
          <div className="flex justify-center space-x-2">
            <button
              onClick={handlePreviousPage}
              className={`mx-1 px-2 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-blue-500 text-white"
              }`}
              disabled={currentPage === 1}
            >
              Previous Page
            </button>
            <span className="mx-2 px-2 py-1 rounded bg-gray-200 text-black">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className={`mx-1 px-2 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 cursor-not-allowed text-gray-600"
                  : "bg-blue-500 text-white"
              }`}
              disabled={currentPage === totalPages}
            >
              Next Page
            </button>
          </div>
        </div>
        <div
          className={`flex overflow-x-auto p-4 ${
            isGalleryOpen ? "opacity-100" : "opacity-100"
          }`}
        >
          {displayImages.map((url, index) => (
            <div key={index} className="relative mx-2">
              <img
                src={url}
                className={`cursor-pointer h-24 w-24 rounded-md shadow-md ${
                  url === activeUrl ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => send_id_compared(url)}
              />
              <button
                onClick={() => handleDeleteImage(url.split("/").pop() || "", index)}
                className="absolute bottom-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 focus:outline-none"
              >
               <ImBin />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
