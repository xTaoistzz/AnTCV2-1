"use client";
import { useState, useEffect } from "react";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import SidebarMenu from "./Menu"; // Import SidebarMenu
import { useParams } from "next/navigation";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const params = useParams<{ id: string }>();
  const type = localStorage.getItem("Type");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (params.id) {
        try {
          const response = await fetch(`${process.env.ORIGIN_URL}/getImg`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idproject: params.id }),
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            setImageUrl(`${process.env.ORIGIN_URL}/img/${params.id}/thumbs/${data.imgName}`); // Assuming the response contains the image name as imgName
          } else {
            console.error("Failed to fetch image");
          }
        } catch (error) {
          console.error("An error occurred while fetching the image:", error);
        }
      }
    };

    fetchImage();
  }, [params.id]);

  // Determine the ring color based on the type
  const ringColor = type === "classification" ? "ring-red-500" 
                    : type === "detection" ? "ring-yellow-500"
                    : type === "segmentation" ? "ring-blue-500"
                    : "ring-gray-500"; // Default ring color

  return (
    <div className="flex bg-gray-900">
      {isSidebarOpen && (
        <aside className="flex flex-col relative bg-gray-800 p-4 text-white">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Project Icon"
              className={`w-32 h-32 object-cover mb-4 rounded-lg ring-4 ${ringColor}`}
            />
          ) : (
            <div className="w-32 h-32 bg-gray-700 mb-4 flex items-center justify-center">
              {/* Placeholder or loading indicator */}
              <p>Loading...</p>
            </div>
          )}
          <SidebarMenu />
        </aside>
      )}
      <button
        className="-right-8 top-1/2 transform text-white focus:outline-none bg-gray-700 p-2 rounded-r-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <IoMdArrowDropleft /> : <IoMdArrowDropright />}
      </button>
    </div>
  );
};

export default Sidebar;