"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClipboardList, FaUpload, FaPencilAlt, FaFileImport, FaFileExport, FaExchangeAlt } from "react-icons/fa";

const SidebarMenu = () => {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [isChangeTypeOpen, setIsChangeTypeOpen] = useState(false);

    useEffect(() => {
        setSelectedType(localStorage.getItem("Type"));
    }, [selectedType]);

    const handleSelectType = (type: string) => {
        localStorage.setItem("Type", type);
        setSelectedType(type);
        setIsChangeTypeOpen(false);
        router.push(`/workspace/${params.id}/${type}`);
    };

    const menuItems = [
        { name: "Classes", icon: <FaClipboardList />, link: `/${selectedType}` },
        { name: "Upload", icon: <FaUpload />, link: `/${selectedType}/upload` },
        { name: "Annotate", icon: <FaPencilAlt />, link: `/${selectedType}/annotate` },
        { name: "Import", icon: <FaFileImport />, link: `/${selectedType}/import` },
        { name: "Export", icon: <FaFileExport />, link: `/${selectedType}/export` },
    ];

    return (
        <nav className="space-y-6">
            <ul className="space-y-2">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        {(selectedType !== "classification" || item.name === "Classes" || item.name === "Export") && (
                            <Link href={`/workspace/${params.id}${item.link}`}>
                                <div className="flex items-center py-2 px-4 rounded-lg hover:bg-blue-100 transition duration-300 text-blue-800">
                                    {item.icon}
                                    <span className="ml-3">{item.name}</span>
                                </div>
                            </Link>
                        )}
                    </li>
                ))}
            </ul>

            <div className="pt-3">
                <button
                    onClick={() => setIsChangeTypeOpen(!isChangeTypeOpen)}
                    className="flex items-center w-full py-2 px-4 rounded-lg hover:bg-blue-100 transition duration-300 text-blue-800"
                >
                    <FaExchangeAlt />
                    <span className="ml-3">Change Type</span>
                </button>
                {isChangeTypeOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 space-y-2"
                    >
                        {["classification", "detection", "segmentation"].map((type) => (
                            <button
                                key={type}
                                className={`w-full p-2 rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                                    selectedType === type
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                                }`}
                                onClick={() => handleSelectType(type)}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </nav>
    );
};

export default SidebarMenu;