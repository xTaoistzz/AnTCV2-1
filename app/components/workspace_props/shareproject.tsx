// components/workspace_props/SharedProjects.tsx
import { useState, useEffect } from "react";
import { HiMiniPhoto } from "react-icons/hi2";
import Link from "next/link"; // Import Link component

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
          {sharedProjects.map((project) => (
            <li
              key={project.idproject}
              className="border border-gray-300 rounded mb-4 p-4 flex items-center bg-gray-800"
            >
              <Link href={`/workspace/${project.idproject}`} passHref>
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
                    <h2 className="text-xl font-semibold">{project.project_name}</h2>
                    <p>{project.description}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SharedProjects;