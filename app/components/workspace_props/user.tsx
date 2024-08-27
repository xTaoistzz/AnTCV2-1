import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { IoMdPeople } from "react-icons/io";
import { HiMiniPhoto } from "react-icons/hi2";
import ProgressBar from "../progress";

export interface Project {
  idproject: number;
  project_name: string;
  description: string;
  type: string;
  isShared: boolean;
  progress?: {
    total: number;
    process: number;
  };
}

interface UserProjectsProps {
  projects: Project[];
  firstImgMap: { [key: number]: string };
  handleEditProject: (id: number) => void;
  handleDeleteConfirmation: (id: number, name: string) => void;
  handleOpenAddCollaborator: (id: number) => void;
  searchTerm: string;
}

const UserProjects: React.FC<UserProjectsProps> = ({
  projects,
  firstImgMap,
  handleEditProject,
  handleDeleteConfirmation,
  handleOpenAddCollaborator,
  searchTerm
}) => {
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const filtered = projects.filter(project =>
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
    <div className="relative px-12"> {/* Added horizontal padding */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {currentProjects.map((project, index) => (
            <motion.div
              key={project.idproject}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
            >
              <Link href={`/workspace/${project.idproject}`}>
                <div className="p-4">
                  <div className="flex items-center mb-4">
                    {firstImgMap[project.idproject] ? (
                      <img
                        src={`${process.env.ORIGIN_URL}/img/${project.idproject}/thumbs/${firstImgMap[project.idproject]}`}
                        alt="Project Icon"
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <HiMiniPhoto className="w-16 h-16 text-blue-400 mr-4" />
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-blue-800">
                        {project.project_name}
                      </h2>
                      <p className="text-blue-600">{project.description}</p>
                      <ProgressBar idproject={project.idproject} />
                    </div>
                  </div>
                </div>
              </Link>
              <div className="bg-blue-50 p-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEditProject(project.idproject)}
                  className="bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 p-2"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteConfirmation(project.idproject, project.project_name)}
                  className="bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 p-2"
                >
                  <ImBin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleOpenAddCollaborator(project.idproject)}
                  className="bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 p-2"
                >
                  <IoMdPeople className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
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

export default UserProjects;