// Updated WorkspacePage component with two projects per row
"use client";
import { ImBin } from "react-icons/im";
import { FaEdit, FaCloudUploadAlt, FaImages } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import { HiMiniPhoto } from "react-icons/hi2";
import Navbar from "../components/navigation/Navbar";
import CreateProject from "../components/workspace_props/create";
import EditProject from "../components/workspace_props/edit";
import AddCollaborator from "../components/workspace_props/share";
import SharedProjects from "../components/workspace_props/shareproject";
import { IoMdPeople } from "react-icons/io";

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
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-white">{error}</div>;
  }

  return (
    <main className="bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-screen flex flex-col items-center text-white">
      <Navbar />
      <section className="p-6 w-full max-w-6xl mx-auto mt-20">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Workspace, {username}!
        </h1>
        <div className="mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all"
          >
            Create Project
          </button>
        </div>
        {projects.length === 0 ? (
          <p className="text-gray-400">No projects available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.idproject}
                className="border border-gray-300 rounded mb-4 p-4 flex items-center bg-gray-800 justify-between"
              >
                <Link href={`/workspace/${project.idproject}`}>
                  <div className="flex-grow flex items-center">
                    {firstImgMap[project.idproject] ? (
                      <img
                        src={`${process.env.ORIGIN_URL}/img/${project.idproject}/thumbs/${firstImgMap[project.idproject]}`}
                        alt="Project Icon"
                        className="w-16 h-16 rounded-full object-cover mr-4"
                      />
                    ) : (
                      <HiMiniPhoto className="w-16 h-16 text-gray-400 mr-4" />
                    )}
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold">
                        {project.project_name}
                      </h2>
                      <p>{project.description}</p>
                    </div>
                  </div>
                </Link>
                <div className="space-x-3 flex">
                  <button
                    onClick={() => handleEditProject(project.idproject)}
                    className="bg-teal-500 text-white rounded-lg hover:bg-teal-700 transition-all p-3"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.idproject)}
                    className="bg-red-500 text-white rounded-lg hover:bg-red-700 transition-all p-3"
                  >
                    <ImBin className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleOpenAddCollaborator(project.idproject)}
                    className='flex items-center bg-teal-500 text-white rounded-lg hover:bg-teal-700 transition-all p-3'
                  >
                    <IoMdPeople className='w-5 h-5' /> {/* Adjust icon size */}
                  </button>
                </div>
              </div>
            ))}
          </div>
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
