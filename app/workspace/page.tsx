"use client";
import React, { useState, useEffect } from "react";
import { FaImages, FaSearch, FaFilter } from "react-icons/fa";
import Navbar from "../components/navigation/Navbar";
import CreateProject from "../components/workspace_props/create";
import UserProjects from "../components/workspace_props/user";
import SharedProjects from "../components/workspace_props/shareproject";
import EditProject from "../components/workspace_props/edit";
import ConfirmDeleteProject from "../components/workspace_props/delete";
import AddCollaborator from "../components/workspace_props/share";
import CheckLoad from "../check-loading/page";

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

type FilterOption = "all" | "user" | "shared";

export default function WorkspacePage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [sharedProjects, setSharedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [firstImgMap, setFirstImgMap] = useState<{ [key: number]: string }>({});
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    projectId: number | null;
    projectName: string;
  }>({
    isOpen: false,
    projectId: null,
    projectName: "",
  });
  const [isAddCollaboratorOpen, setIsAddCollaboratorOpen] = useState<
    number | null
  >(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] =
    useState<boolean>(false);

  useEffect(() => {
    fetchProjects();
    fetchUsername();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const userResponse = await fetch(`${process.env.ORIGIN_URL}/allProject`, {
        credentials: "include",
      });
      const sharedResponse = await fetch(
        `${process.env.ORIGIN_URL}/allProject/share`,
        { credentials: "include" }
      );

      if (userResponse.ok && sharedResponse.ok) {
        const userData = await userResponse.json();
        const sharedData = await sharedResponse.json();
        setUserProjects(userData.project);
        setSharedProjects(sharedData.project);
        fetchFirstImages([...userData.project, ...sharedData.project]);
      } else {
        throw new Error("Failed to fetch projects");
      }
    } catch (error) {
      setError("An error occurred while fetching projects");
      console.error("Error fetching projects:", error);
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
        throw new Error("Failed to fetch username");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const fetchFirstImages = async (projects: Project[]) => {
    const imgMap: { [key: number]: string } = {};
    for (const project of projects) {
      try {
        const response = await fetch(`${process.env.ORIGIN_URL}/getImg`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

  const handleCreateProject = () => {
    setIsModalOpen(false);
    fetchProjects();
  };

  const handleEditProject = (id: number) => {
    const projectToEdit = userProjects.find((p) => p.idproject === id);
    if (projectToEdit) {
      setEditProject(projectToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = (updatedProject: Project) => {
    setIsEditModalOpen(false);
    fetchProjects();
  };

  const handleDeleteConfirmation = (id: number, name: string) => {
    setDeleteConfirmation({ isOpen: true, projectId: id, projectName: name });
  };

  const handleDeleteProject = async () => {
    if (deleteConfirmation.projectId) {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.ORIGIN_URL}/delete/project`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idproject: deleteConfirmation.projectId }),
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete project");
        }

        setDeleteConfirmation({
          isOpen: false,
          projectId: null,
          projectName: "",
        });
        fetchProjects(); // Refresh projects after deletion
      } catch (error) {
        console.error("Error deleting project:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenAddCollaborator = (id: number) => {
    setIsAddCollaboratorOpen(id);
  };

  const handleCloseAddCollaborator = () => {
    setIsAddCollaboratorOpen(null);
    fetchProjects(); // Refresh projects after adding a collaborator
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (option: FilterOption) => {
    setFilterOption(option);
    setIsFilterDropdownOpen(false);
  };

  const toggleFilterDropdown = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  if (loading)
    return (
      <div>
        <CheckLoad />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 min-h-screen flex flex-col items-center">
      <section className="p-6 w-full max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-800 text-center">
          Welcome to Your Workspace, {username}
        </h1>

        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition duration-300 shadow-md flex items-center"
          >
            <FaImages className="mr-2" /> Create New Project
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-64 rounded-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
            </div>
            <div className="relative inline-block text-left z-10">
              <button
                type="button"
                onClick={toggleFilterDropdown}
                className="inline-flex justify-center items-center w-full rounded-full border border-blue-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-100 focus:ring-blue-500 transition duration-300"
              >
                <FaFilter className="mr-2" />
                {filterOption === "all"
                  ? "All Projects"
                  : filterOption === "user"
                  ? "Your Projects"
                  : "Shared Projects"}
                <svg
                  className="-mr-1 ml-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {isFilterDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    {["all", "user", "shared"].map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          handleFilterChange(option as FilterOption)
                        }
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          filterOption === option
                            ? "bg-blue-100 text-blue-900"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                        role="menuitem"
                      >
                        {option === "all"
                          ? "All Projects"
                          : option === "user"
                          ? "Your Projects"
                          : "Shared Projects"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full space-y-8">
          {(filterOption === "all" || filterOption === "user") && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">
                Your Projects
              </h2>
              <UserProjects
                projects={userProjects.filter((p) =>
                  p.project_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )}
                firstImgMap={firstImgMap}
                handleEditProject={handleEditProject}
                handleDeleteConfirmation={handleDeleteConfirmation}
                handleOpenAddCollaborator={handleOpenAddCollaborator}
                searchTerm={searchTerm}
              />
            </div>
          )}

          {(filterOption === "all" || filterOption === "shared") && (
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">
                Shared Projects
              </h2>
              <SharedProjects
                projects={sharedProjects.filter((p) =>
                  p.project_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )}
                username={username}
                searchTerm={searchTerm}
              />
            </div>
          )}
        </div>

        <CreateProject
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProject}
        />

        {isEditModalOpen && editProject && (
          <EditProject
            project={editProject}
            onSave={handleSaveEdit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}

        <ConfirmDeleteProject
          isOpen={deleteConfirmation.isOpen}
          projectId={deleteConfirmation.projectId || 0}
          projectName={deleteConfirmation.projectName}
          onConfirm={handleDeleteProject}
          onCancel={() =>
            setDeleteConfirmation({
              isOpen: false,
              projectId: null,
              projectName: "",
            })
          }
          isDeleting={loading}
        />

        {isAddCollaboratorOpen !== null && (
          <AddCollaborator
            projectId={isAddCollaboratorOpen}
            onClose={handleCloseAddCollaborator}
            onCollaboratorAdded={handleCloseAddCollaborator}
          />
        )}
      </section>
    </main>
  );
}
