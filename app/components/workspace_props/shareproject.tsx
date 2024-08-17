// components/workspace_props/SharedProjects.tsx
import { useState, useEffect } from "react";
import { HiMiniPhoto } from "react-icons/hi2";
import Link from "next/link"; // Import Link component
import { motion } from "framer-motion";
interface SharedProject {
  idproject: number;
  project_name: string;
  description: string;
}

interface SharedProjectsProps {
  username: string;
}

const SharedProjects: React.FC<SharedProjectsProps> = ({ username }) => {
  const [sharedProjects, setSharedProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [firstImgMap, setFirstImgMap] = useState<{ [key: number]: string }>({});

  const fetchSharedProjects = async () => {
    try {
      const response = await fetch(`${process.env.ORIGIN_URL}/allProject/share`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setSharedProjects(data.project);
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
        console.error(`Error fetching image for project ${project.idproject}:`, error);
      }
    }
    setFirstImgMap(imgMap);
  };

  useEffect(() => {
    fetchSharedProjects();
  }, []);

  if (loading) {
    return <div className="text-white">Loading shared projects...</div>;
  }

  if (error) {
    return <div className="text-white">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Projects Shared with You</h2>
      {sharedProjects.length === 0 ? (
        <p className="text-gray-400">No shared projects available.</p>
      ) : (
        <ul>
          {sharedProjects.map((project, index) => (
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

          </motion.div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SharedProjects;