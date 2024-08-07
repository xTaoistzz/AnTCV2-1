"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AiFillSetting } from "react-icons/ai";
import { HiMiniPhoto } from "react-icons/hi2";
import Navbar from "../components/navigation/Navbar";
// Define types for project data and state
interface Project {
  idproject: number;
  project_name: string;
  description: string;
}

export default function WorkspacePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<{
    project_name: string;
    description: string;
  }>({
    project_name: "",
    description: "",
  });
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | null } | null>(null);
  const [firstImgMap, setFirstImgMap] = useState<{ [key: number]: string }>({});

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
          imgMap[project.idproject] = img.imgName; // Assuming the response contains the image name as imgName
        }
      } catch (error) {
        console.error(`Error fetching image for project ${project.idproject}:`, error);
      }
    }
    setFirstImgMap(imgMap);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/create/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject),
        credentials: "include",
      });

      if (response.ok) {
        const createdProject = await response.json();
        setProjects([...projects, createdProject]);
        setNewProject({ project_name: "", description: "" });
        setIsModalOpen(false); // Close the modal after creating the project
        fetchProjects();
      } else {
        console.error("Failed to create project");
      }
    } catch (error) {
      console.error("An error occurred while creating the project:", error);
    }
  };

  const handleEditProject = (id: number) => {
    const project = projects.find((p) => p.idproject === id) || null;
    setEditProject(project);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editProject) {
      try {
        const response = await fetch(`${process.env.ORIGIN_URL}/updateProject`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idproject: editProject.idproject,
            project_name: editProject.project_name,
            description: editProject.description,
          }),
          credentials: "include",
        });

        if (response.ok) {
          const updatedProject = await response.json();
          setProjects(
            projects.map((p) =>
              p.idproject === updatedProject.idproject ? updatedProject : p
            )
          );
          setNotification({ message: "Project updated successfully!", type: 'success' });
          setIsEditModalOpen(false);
          fetchProjects();
        } else {
          throw new Error("Failed to update project");
        }
      } catch (error) {
        setNotification({ message: "Error updating project. Please try again.", type: 'error' });
        console.error("An error occurred while updating the project:", error);
      }
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

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-white">{error}</div>;
  }

  return (
    <main className="bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-screen flex flex-col items-center text-white">
      {/* <nav className="bg-white bg-opacity-10 p-3 flex rounded-lg text-center items-center justify-between fixed top-4 left-0 right-0 mx-4 drop-shadow-2xl border border-gray-700">
        <div className="text-teal-300 font-bold text-xl">AnTCV</div>
        <div className="space-x-3">
          <Link href="/workspace">
            <button className="text-white bg-teal-500 p-2 rounded-lg hover:bg-teal-700 transition-all">
              WorkSpace
            </button>
          </Link>
          <Link href="/">
            <button className="text-white bg-teal-500 p-2 rounded-lg hover:bg-teal-700 transition-all">
              Sign Out
            </button>
          </Link>
        </div>
      </nav> */}
      <Navbar/>
      <section className="p-6 w-full max-w-4xl mx-auto mt-20">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to Workspace, xTaoistzz!
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
          <ul>
            {projects.map((project) => (
              <li
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
                <div>
                  <button
                    onClick={() => handleEditProject(project.idproject)}
                    className="bg-teal-500 text-white py-1 px-3 rounded-lg hover:bg-teal-700 transition-all mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.idproject)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Create Project Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Create New Project</h2>
              <input
                type="text"
                placeholder="Project Name"
                value={newProject.project_name}
                onChange={(e) =>
                  setNewProject({ ...newProject, project_name: e.target.value })
                }
                className="w-full p-2 mb-4 bg-gray-800 border border-gray-600 rounded-lg"
              />
              <textarea
                placeholder="Project Description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="w-full p-2 mb-4 bg-gray-800 border border-gray-600 rounded-lg"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {isEditModalOpen && editProject && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Edit Project</h2>
              <input
                type="text"
                placeholder="Project Name"
                value={editProject.project_name}
                onChange={(e) =>
                  setEditProject({ ...editProject, project_name: e.target.value })
                }
                className="w-full p-2 mb-4 bg-gray-800 border border-gray-600 rounded-lg"
              />
              <textarea
                placeholder="Project Description"
                value={editProject.description}
                onChange={(e) =>
                  setEditProject({ ...editProject, description: e.target.value })
                }
                className="w-full p-2 mb-4 bg-gray-800 border border-gray-600 rounded-lg"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}