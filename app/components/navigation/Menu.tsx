"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SidebarMenu = () => {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [selectedType, setSelectedType] = useState<string | null>(null);

    // Load the selected type from localStorage on component mount
    useEffect(() => {
        setSelectedType(localStorage.getItem("Type"));
    }, []);

    // Handle type selection and navigate to the corresponding page
    const handleSelectType = (type: string) => {
        localStorage.setItem("Type", type);
        setSelectedType(type);
        router.push(`/workspace/${params.id}/${type}`);
    };

    return (
        <nav className="space-y-4">
            {/* Navigation Links */}
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

            {/* Type Selection Buttons */}
            <div className="pt-3 space-y-2 flex flex-col">
                <div>Change Type to</div>
                <Button
                    type="classification"
                    selectedType={selectedType}
                    handleSelectType={handleSelectType}
                    bgColor="bg-red-700"
                    hoverColor="bg-red-300"
                    ringColor="ring-red-500"
                />
                <Button
                    type="detection"
                    selectedType={selectedType}
                    handleSelectType={handleSelectType}
                    bgColor="bg-yellow-700"
                    hoverColor="bg-yellow-300"
                    ringColor="ring-yellow-500"
                />
                <Button
                    type="segmentation"
                    selectedType={selectedType}
                    handleSelectType={handleSelectType}
                    bgColor="bg-blue-700"
                    hoverColor="bg-blue-300"
                    ringColor="ring-blue-500"
                />
            </div>
        </nav>
    );
};

// Button Component for type selection
const Button = ({
    type,
    selectedType,
    handleSelectType,
    bgColor,
    hoverColor,
    ringColor,
}: {
    type: string;
    selectedType: string | null;
    handleSelectType: (type: string) => void;
    bgColor: string;
    hoverColor: string;
    ringColor: string;
}) => (
    <button
        className={`p-2 rounded-r-lg focus:outline-none focus:ring-4 transition duration-300 ${
            selectedType === type
                ? `${bgColor} ring-${ringColor} text-white shadow-lg`
                : `${bgColor} hover:${hoverColor} ring-${ringColor} text-gray-900`
        }`}
        onClick={() => handleSelectType(type)}
    >
        {type.charAt(0).toUpperCase() + type.slice(1)}
    </button>
);

export default SidebarMenu;