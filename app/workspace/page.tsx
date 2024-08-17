"use client";
import { ImBin } from "react-icons/im";
import { FaEdit, FaImages } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiMiniPhoto } from "react-icons/hi2";
import Navbar from "../components/navigation/Navbar";
import CreateProject from "../components/workspace_props/create";
import EditProject from "../components/workspace_props/edit";
import AddCollaborator from "../components/workspace_props/share";
import SharedProjects from "../components/workspace_props/shareproject";
import { IoMdPeople } from "react-icons/io";
import { motion } from "framer-motion";
import CheckLoad from "../check-loading/page";
interface Project {
  idproject: number;
  project_name: string;
  description: string;
}

export default function WorkspacePage() {
  const [projects, setProjects] = useState<Project[]>([]);
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
        setProjects(data.project);
        fetchFirstImages(data.project);
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
    <main className="bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 min-h-screen flex flex-col items-center">
      <Navbar />
      <section className="p-6 w-full max-w-6xl mx-auto mt-20">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-6 text-blue-800"
        >
          Welcome to Workspace, {username}!
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md flex items-center"
          >
            <FaImages className="mr-2" /> Create New Project
          </button>
        </motion.div>
        {projects.length === 0 ? (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-blue-600 text-lg"
          >
            No projects available. Start by creating a new project!
          </motion.p>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project, index) => (
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

        <SharedProjects username={username} />
      </section>
    </main>
  );
}