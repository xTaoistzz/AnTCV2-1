"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SidebarMenu = () => {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [selectedType, setSelectedType] = useState<string | null>(null);

    useEffect(() => {
        setSelectedType(localStorage.getItem("Type"));
    }, [selectedType]);

    const handleSelectType = (type: string) => {
        localStorage.setItem("Type", type);
        setSelectedType(type);
        router.push(`/workspace/${params.id}/${type}`);
    };

    return (
        <nav className="space-y-4">
            <ul className="space-y-2">
                <li>
                    <Link href={`/workspace/${params.id}/${selectedType}`}>
                        <div className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300">
                            Classes
                        </div>
                    </Link>
                </li>
                {selectedType !== "classification" && (
                    <>
                        <li>
                            <Link href={`/workspace/${params.id}/${selectedType}/upload`}>
                                <div className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300">
                                    Upload
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/workspace/${params.id}/${selectedType}/annotate`}>
                                <div className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300">
                                    Annotate
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/workspace/${params.id}/${selectedType}/import`}>
                                <div className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300">
                                    Import
                                </div>
                            </Link>
                        </li>
                    </>
                )}
                <li>
                    <Link href={`/workspace/${params.id}/${selectedType}/export`}>
                        <div className="block py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300">
                            Export
                        </div>
                    </Link>
                </li>
            </ul>

            <div className="pt-3 space-y-2 flex flex-col">
                <div>Change Type to</div>
                <button
                    className={`p-2 rounded-r-lg focus:outline-none focus:ring-4 transition duration-300 ${
                        selectedType === "classification"
                            ? "bg-red-700 ring-red-500 text-white shadow-lg"
                            : "bg-red-500 hover:bg-red-700 ring-red-500 text-gray-900"
                    }`}
                    onClick={() => handleSelectType("classification")}
                >
                    Classification
                </button>
                <button
                    className={`p-2 rounded-r-lg focus:outline-none focus:ring-4 transition duration-300 ${
                        selectedType === "detection"
                            ? "bg-yellow-700 ring-yellow-500 text-white shadow-lg"
                            : "bg-yellow-500 hover:bg-yellow-700 ring-yellow-500 text-gray-900"
                    }`}
                    onClick={() => handleSelectType("detection")}
                >
                    Detection
                </button>
                <button
                    className={`p-2 rounded-r-lg focus:outline-none focus:ring-4 transition duration-300 ${
                        selectedType === "segmentation"
                            ? "bg-blue-700 ring-blue-500 text-white shadow-lg"
                            : "bg-blue-500 hover:bg-blue-700 ring-blue-500 text-gray-900"
                    }`}
                    onClick={() => handleSelectType("segmentation")}
                >
                    Segmentation
                </button>
            </div>
        </nav>
    );
};

export default SidebarMenu;