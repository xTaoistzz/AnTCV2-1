"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaClipboardList, FaUpload, FaPencilAlt, FaFileImport, FaFileExport } from "react-icons/fa";

type AnnotationType = 'classification' | 'detection' | 'segmentation' | null;

const SidebarMenu = () => {
    const params = useParams<{ id: string }>();
    const [selectedType, setSelectedType] = useState<AnnotationType>(null);

    useEffect(() => {
        const handleTypeChange = (event: CustomEvent<AnnotationType>) => {
            const newType = event.detail;
            setSelectedType(newType);
        };

        // Initial set
        const storedType = localStorage.getItem("Type") as AnnotationType;
        if (storedType) {
            setSelectedType(storedType);
        }

        // Listen for changes
        window.addEventListener('typeChange', handleTypeChange as EventListener);

        // Cleanup
        return () => {
            window.removeEventListener('typeChange', handleTypeChange as EventListener);
        };
    }, []);

    const menuItems = [
        { name: "Classes", icon: <FaClipboardList />, link: `/${selectedType}` },
        { name: "Upload", icon: <FaUpload />, link: `/${selectedType}/upload` },
        { name: "Annotate", icon: <FaPencilAlt />, link: `/${selectedType}/annotate` },
        { name: "Import", icon: <FaFileImport />, link: `/${selectedType}/import` },
        { name: "Export", icon: <FaFileExport />, link: `/${selectedType}/export` },
    ];

    return (
        <nav className="space-y-4">
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
        </nav>
    );
};

export default SidebarMenu;