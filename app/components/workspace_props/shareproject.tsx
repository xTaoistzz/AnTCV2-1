import { useState, useEffect } from "react";
import { HiMiniPhoto } from "react-icons/hi2";
import Link from "next/link";
import { motion } from "framer-motion";
import ProgressBar from "../progress";  // Import ProgressBar component

interface SharedProject {
  idproject: number;
  project_name: string;
  description: string;
  owner: string;
}

interface SharedProjectsProps {
  username: string;
  searchTerm: string;
}

const SharedProjects: React.FC<SharedProjectsProps> = ({
  username,
  searchTerm,
}) => {
  const [sharedProjects, setSharedProjects] = useState<SharedProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [firstImgMap, setFirstImgMap] = useState<{ [key: number]: string }>({});

  // ... (existing fetchSharedProjects and fetchFirstImages functions)
  const fetchSharedProjects = async () => {
    try {
      const response = await fetch(
        `${process.env.ORIGIN_URL}/allProject/share`,
        {
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSharedProjects(data.project);
        setFilteredProjects(data.project);
        fetchFirstImages(data.project);
      } else {
        setError("Failed to fetch shared projects");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

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
    fetchSharedProjects();
  }, []);

  useEffect(() => {
    const filtered = sharedProjects.filter((project) =>
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, sharedProjects]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-blue-600 text-lg"
      >
        Loading shared projects...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-red-500 text-lg"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {filteredProjects.length === 0 ? (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-blue-600 text-lg"
        >
          {searchTerm
            ? "No shared projects match your search."
            : "No shared projects available. Projects shared with you will appear here."}
        </motion.p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
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
                <div className="p-6">
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
                      <p className="text-sm text-gray-500 mt-1">
                        Owner: {project.owner}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <ProgressBar idproject={project.idproject} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SharedProjects;