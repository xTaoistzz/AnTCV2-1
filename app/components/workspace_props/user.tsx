import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
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
  searchTerm: any;
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

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {filteredProjects.map((project, index) => (
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
    </div>
  );
};

export default UserProjects;