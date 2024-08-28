"use client";
import { HiMiniPhoto } from "react-icons/hi2";
import { useState, useEffect } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import SidebarMenu from "./Menu";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type AnnotationType = 'classification' | 'detection' | 'segmentation' | 'default';

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projectData, setProjectData] = useState<{
    imageUrl: string | null;
    name: string;
    description: string;
    type: AnnotationType;
  }>({
    imageUrl: null,
    name: "Loading...",
    description: "Please wait...",
    type: "default"
  });
  const params = useParams<{ id: string }>();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getRingColor = (type: AnnotationType) => {
    switch (type) {
      case "classification":
        return "ring-blue-500";
      case "detection":
        return "ring-green-500";
      case "segmentation":
        return "ring-purple-500";
      default:
        return "ring-gray-300";
    }
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      if (params.id) {
        try {
          // Fetch project details
          const detailsResponse = await fetch(`${process.env.ORIGIN_URL}/project/${params.id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            // body: JSON.stringify({ idproject: params.id }),
            credentials: "include",
          });

          if (detailsResponse.ok) {
            const details = await detailsResponse.json();
            setProjectData(prev => ({
              ...prev,
              name: details.project.name,
              description: details.project.description,
              type: details.type as AnnotationType
            }));
          }

          // Fetch project image
          const imageResponse = await fetch(`${process.env.ORIGIN_URL}/getImg`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idproject: params.id }),
            credentials: "include",
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            setProjectData(prev => ({
              ...prev,
              imageUrl: `${process.env.ORIGIN_URL}/img/${params.id}/thumbs/${imageData.imgName}`
            }));
          }
        } catch (error) {
          console.error("An error occurred while fetching project data:", error);
        }
      }
    };

    fetchProjectData();

    const handleTypeChange = (event: CustomEvent<AnnotationType>) => {
      const newType = event.detail;
      setProjectData(prev => ({ ...prev, type: newType }));
    };

    const handleStorageChange = () => {
      const type = localStorage.getItem("Type") as AnnotationType || "default";
      setProjectData(prev => ({ ...prev, type }));
    };

    window.addEventListener('typeChange', handleTypeChange as EventListener);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener('typeChange', handleTypeChange as EventListener);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [params.id]);

  return (
    <div className="flex">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0 }}
            animate={{ width: 300 }}
            exit={{ width: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col bg-white text-blue-800 shadow-lg max-w-56"
          >
            <div className="p-6 bg-blue-50">
              <div className="flex items-center justify-center m-2">
                {projectData.imageUrl ? (
                  <motion.img
                    src={projectData.imageUrl}
                    alt="Project Icon"
                    className={`w-32 h-32 object-cover rounded-full ring-4 ${getRingColor(projectData.type)} shadow-lg`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  />
                ) : (
                  <div className="w-32 h-32 bg-blue-200 rounded-full flex items-center justify-center">
                    <HiMiniPhoto className="w-20 h-20 text-blue-400" />
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold text-center mb-3">{projectData.name}</div>
              <p className="text-sm text-blue-600 text-center mb-3">{projectData.description}</p>
              <div className="text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  projectData.type === "classification" ? "bg-blue-100 text-blue-800" :
                  projectData.type === "detection" ? "bg-green-100 text-green-800" :
                  projectData.type === "segmentation" ? "bg-purple-100 text-purple-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {projectData.type.charAt(0).toUpperCase() + projectData.type.slice(1)}
                </span>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto">
              <SidebarMenu />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <motion.button
        className={`self-center ${
          isSidebarOpen ? "-ml-1" : "ml-1"
        } z-10 bg-blue-500 text-white p-2 rounded-full focus:outline-none hover:bg-blue-600 transition-all duration-300 shadow-lg`}
        onClick={toggleSidebar}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isSidebarOpen ? <IoChevronBackOutline size={20} /> : <IoChevronForwardOutline size={20} />}
      </motion.button>
    </div>
  );
};

export default Sidebar;