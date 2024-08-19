"use client";
import { ImBin } from "react-icons/im";
import { FaEdit, FaImages, FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiMiniPhoto } from "react-icons/hi2";
import Navbar from "../components/navigation/Navbar";
import CreateProject from "../components/workspace_props/create";
import EditProject from "../components/workspace_props/edit";
import AddCollaborator from "../components/workspace_props/share";
import SharedProjects from "../components/workspace_props/shareproject";
import ProgressBar from "../components/progress";  // Import the new ProgressBar component
import { IoMdPeople } from "react-icons/io";
import { motion } from "framer-motion";
import CheckLoad from "../check-loading/page";

interface Project {
  idproject: number;
  project_name: string;
  description: string;
  type: string;
  progress?: {
    total: number;
    process: number;
  };
}

export default function WorkspacePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddCollaboratorOpen, setIsAddCollaboratorOpen] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | null;
  } | null>(null);
  const [firstImgMap, setFirstImgMap] = useState<{ [key: number]: string }>({});
  const [username, setUsername] = useState<string>("");

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/allProject`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const projectsWithProgress = await Promise.all(data.project.map(async (project: Project) => {
          const progress = await fetchProjectProgress(project);
          return { ...project, progress };
        }));
        setProjects(projectsWithProgress);
        setFilteredProjects(projectsWithProgress);
        fetchFirstImages(projectsWithProgress);
      } else {
        setError("Failed to fetch projects");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectProgress = async (project: Project) => {
    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/${project.type}/getProcess/${project.idproject}`, {
        credentials: "include",
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error(`Error fetching progress for project ${project.idproject}:`, error);
    }
    return null;
  };

  const fetchUsername = async () => {
    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/returnUsername`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
      } else {
        setError("Failed to fetch username");
      }
    } catch (error) {
      console.error("An error occurred while fetching the username:", error);
      setError("An error occurred while fetching the username.");
    }
  };

  const fetchFirstImages = async (projects: Project[]) => {
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
        console.error(`Error fetching image for project ${project.idproject}:`, error);
      }
    }
    setFirstImgMap(imgMap);
  };

  useEffect(() => {
    fetchProjects();
    fetchUsername();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  const handleSaveEdit = async (updatedProject: Project) => {
    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/updateProject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
        credentials: "include",
      });

      if (response.ok) {
        const updated = await response.json();
        setProjects(
          projects.map((p) => (p.idproject === updated.idproject ? updated : p))
        );
        setNotification({
          message: "Project updated successfully!",
          type: "success",
        });
        setIsEditModalOpen(false);
        fetchProjects();
      } else {
        throw new Error("Failed to update project");
      }
    } catch (error) {
      setNotification({
        message: "Error updating project. Please try again.",
        type: "error",
      });
      console.error("An error occurred while updating the project:", error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/delete/project`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idproject: id }),
        credentials: "include",
      });

      if (response.ok) {
        setProjects(projects.filter((p) => p.idproject !== id));
        fetchProjects();
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("An error occurred while deleting the project:", error);
    }
  };

  const handleEditProject = (id: number) => {
    const projectToEdit = projects.find((project) => project.idproject === id);
    if (projectToEdit) {
      setEditProject(projectToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleOpenAddCollaborator = (id: number) => {
    setIsAddCollaboratorOpen(id);
  };

  const handleCloseAddCollaborator = () => {
    setIsAddCollaboratorOpen(null);
  };

  const handleCollaboratorAdded = () => {
    fetchProjects();
  };

  if (loading) {
    return <div className=""><CheckLoad/></div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <main className="pt-10 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 min-h-screen flex flex-col items-center">
      <Navbar />
      <section className="p-6 w-full max-w-7xl mx-auto pt-20">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-6 text-blue-800 text-center"
        >
          Welcome to Workspace, {username}!
        </motion.h1>
        
        <div className="mb-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md flex items-center"
            >
              <FaImages className="mr-2" /> Create New Project
            </button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </motion.div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* User's Projects */}
          <div className="w-full md:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-semibold mb-4 text-blue-700"
            >
              Your Projects
            </motion.h2>
            {filteredProjects.length === 0 ? (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-blue-600 text-lg"
              >
                No projects found. Start by creating a new project!
              </motion.p>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-4"
              >
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
                              <ProgressBar 
                                idproject={project.idproject}
                              />
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
                        onClick={() => handleDeleteProject(project.idproject)}
                        className="bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 p-2"
                      >
                        <ImBin className="w-5 h-5" />
                      </button>
                      <button
                      onClick={() => handleOpenAddCollaborator(project.idproject)}
                        className='bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 p-2'
                      >
                        <IoMdPeople className='w-5 h-5' />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Shared Projects */}
          <div className="w-full md:w-1/2">
            <motion.h2 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl font-semibold mb-4 text-blue-700"
            >
              Shared Projects from Owners
            </motion.h2>
            <SharedProjects username={username} searchTerm={searchTerm} />
          </div>
        </div>

        {/* Modals */}
        <CreateProject
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={() => fetchProjects()}
        />

        {isEditModalOpen && editProject && (
          <EditProject
            project={editProject}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}

        {isAddCollaboratorOpen !== null && (
          <AddCollaborator
            projectId={isAddCollaboratorOpen}
            onClose={handleCloseAddCollaborator}
            onCollaboratorAdded={handleCollaboratorAdded}
          />
        )}

        {/* Notification */}
        {notification && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {notification.message}
          </div>
        )}
      </section>
    </main>
  );
}