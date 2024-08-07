"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SidebarMenu = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [selectedType, setSelectedType] = useState<string | null>(null) ;
  useEffect(()=>{
    setSelectedType(localStorage.getItem("Type"))
  })
  const handleSelectType = (type: string) => {
    localStorage.setItem("Type", type);
    setSelectedType(type);
    router.push(`/workspace/${params.id}/${type}`);
  };

  return (
    <nav>
      <ul>
        <li className="mb-2">
          <Link href={`/workspace/${params.id}/${selectedType}/import/`}>
            <div className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300">
              Import
            </div>
          </Link>
        </li>
        <li className="mb-2">
          <Link href={`/workspace/${params.id}/${selectedType}/`}>
            <div className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300">
              Classes
            </div>
          </Link>
        </li>
        <li className="mb-2">
          <Link href={`/workspace/${params.id}/${selectedType}/upload`}>
            <div className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300">
              Upload
            </div>
          </Link>
        </li>
        <li className="mb-2">
          <Link href={`/workspace/${params.id}/${selectedType}/annotate`}>
            <div className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300">
              Annotate
            </div>
          </Link>
        </li>
        <li className="mb-2">
          <Link href={`/workspace/${params.id}/${selectedType}/export`}>
            <div className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300">
              Export
            </div>
          </Link>
        </li>
      </ul>

      {/* Classification, Detection, and Segmentation Buttons */}
      <div className="flex flex-col space-y-2">
        <div className="pt-3 space-y-2 flex flex-col">
          <div>Change Type to</div>
          <button
            className={`p-2 rounded-r-lg focus:outline-none focus:ring-4 transition duration-300 ${
              selectedType === "classification"
                ? "bg-red-900 ring-red-300 transform scale-105 shadow-inner translate-x-3"
                : "bg-red-500 hover:bg-red-600 ring-red-300"
            }`}
            onClick={() => handleSelectType("classification")}
          >
            Classification
          </button>
          <button
            className={`p-2 rounded-r-lg focus:outline-none focus:ring-4 transition duration-300 ${
              selectedType === "detection"
                ? "bg-yellow-900 ring-yellow-300 transform scale-105 shadow-inner translate-x-3"
                : "bg-yellow-500 hover:bg-yellow-600 ring-yellow-300"
            }`}
            onClick={() => handleSelectType("detection")}
          >
            Detection
          </button>
          <button
            className={`p-2 rounded-r-lg focus:outline-none focus:ring-4 transition duration-300 ${
              selectedType === "segmentation"
                ? "bg-blue-900 ring-blue-300 transform scale-105 shadow-inner translate-x-3"
                : "bg-blue-500 hover:bg-blue-600 ring-blue-300"
            }`}
            onClick={() => handleSelectType("segmentation")}
          >
            Segmentation
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SidebarMenu;