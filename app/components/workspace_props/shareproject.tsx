import React, { useState, useEffect } from "react";
import { HiMiniPhoto } from "react-icons/hi2";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProgressBar from "../progress";

interface SharedProject {
  idproject: number;
  project_name: string;
  description: string;
  owner: string;
  isShared: boolean;
  type: string;
  progress?: {
    total: number;
    process: number;
  };
}

interface SharedProjectsProps {
  username: string;
  searchTerm: string;
  projects: any;
}

const SharedProjects: React.FC<SharedProjectsProps> = ({
  username,
  searchTerm,
  projects
}) => {
  const [filteredProjects, setFilteredProjects] = useState<SharedProject[]>([]);
  const [firstImgMap, setFirstImgMap] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(0);

  const fetchFirstImages = async (projects: SharedProject[]) => {
    const imgMap: { [key: number]: string } = {};
    for (const project of projects) {
      try {
        const response = await fetch(`${process.env.ORIGIN_URL}/getImg`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idproject: project.idproject }),
          credentials: "include",
        });

        if (response.ok) {
          const img = await response.json();
          imgMap[project.idproject] = img.imgName;
        }
      } catch (error) {
        console.error(
          `Error fetching image for project ${project.idproject}:`,
          error
        );
      }
    }
    setFirstImgMap(imgMap);
  };

  useEffect(() => {
    fetchFirstImages(projects);
  }, [projects]);

  useEffect(() => {
    const filtered = projects.filter((project:any) =>
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
    setCurrentPage(0); // Reset to first page when search term changes
  }, [searchTerm, projects]);

  const projectsPerPage = 2;
  const pageCount = Math.ceil(filteredProjects.length / projectsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % pageCount);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + pageCount) % pageCount);
  };

  const currentProjects = filteredProjects.slice(
    currentPage * projectsPerPage,
    (currentPage + 1) * projectsPerPage
  );

  return (
    <div className="relative px-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {currentProjects.length === 0 ? (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-blue-600 text-lg col-span-2"
            >
              {searchTerm
                ? "No shared projects match your search."
                : "No shared projects available. Projects shared with you will appear here."}
            </motion.p>
          ) : (
            currentProjects.map((project, index) => (
              <motion.div
                key={project.idproject}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                <Link href={`/workspace/${project.idproject}`}>
                  <div className="p-6 relative">
                    <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Owner: {project.owner}
                    </div>
                    <div className="flex items-center mb-4">
                      {firstImgMap[project.idproject] ? (
                        <img
                          src={`${process.env.ORIGIN_URL}/img/${
                            project.idproject
                          }/thumbs/${firstImgMap[project.idproject]}`}
                          alt="Project Icon"
                          className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                      ) : (
                        <HiMiniPhoto className="w-16 h-16 text-blue-400 mr-4" />
                      )}
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-blue-800">
                          {project.project_name}
                        </h2>
                        <p className="text-blue-600">{project.description}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <ProgressBar idproject={project.idproject} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
      {pageCount > 1 && (
        <>
          <button
            onClick={prevPage}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-400 bg-opacity-70 text-white rounded-full p-3 hover:bg-blue-500 hover:bg-opacity-100 transition duration-300 shadow-md"
            style={{ left: '-20px' }}
          >
            <FaChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextPage}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-400 bg-opacity-70 text-white rounded-full p-3 hover:bg-blue-500 hover:bg-opacity-100 transition duration-300 shadow-md"
            style={{ right: '-20px' }}
          >
            <FaChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );
};

export default SharedProjects;