"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const ExportDataset = () => {
    const { id } = useParams<{ id: string }>(); // Get project ID from URL params
    const [type, setType] = useState<string | null>(null);
    const [format, setFormat] = useState('Classification'); // Default format
    const [progress, setProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [fileUrl, setFileUrl] = useState('');
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        // Get type from localStorage
        const storedType = localStorage.getItem("Type");
        setType(storedType);
    }, []);

    const handleDownload = async () => {
        if (!id || !type) {
            console.error('Project ID or type is missing');
            return;
        }

        try {
            setIsDownloading(true);
            setProgress(0);

            // Step 1: Request to create the ZIP file
            const response = await fetch(`${process.env.ORIGIN_URL}/export/format`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idproject: id,
                    type: type,
                    format: format, // Use selected format
                }),
                credentials: "include"
            });

            const data = await response.json();
            if (data.type === 'success') {
                // Step 2: Request to download the file with progress tracking
                const downloadResponse = await fetch(`${process.env.ORIGIN_URL}/export/format/download`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        filePath: data.fileName,
                        idproject: id,
                    }),
                    credentials: "include"
                });

                if (!downloadResponse.body) {
                    throw new Error('No response body found');
                }

                const reader = downloadResponse.body.getReader();
                const contentLengthHeader = downloadResponse.headers.get('Content-Length');
                const contentLength = contentLengthHeader ? +contentLengthHeader : 0;

                let receivedLength = 0;
                const chunks = [];
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }
                    chunks.push(value);
                    receivedLength += value.length;

                    // Update progress
                    setProgress(Math.floor((receivedLength / contentLength) * 100));
                }

                const blob = new Blob(chunks);
                const url = URL.createObjectURL(blob);
                setFileUrl(url);
                setIsDownloading(false);
                setFileName(data.fileName);
            } else {
                console.error('Error:', data.message);
                setIsDownloading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setIsDownloading(false);
        }
    };

    useEffect(() => {
        if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    }, [fileUrl]);

    return (
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black min-h-96 flex flex-col items-center justify-center text-white">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-md w-full max-w-lg drop-shadow-2xl border border-gray-700">
                <h1 className="text-xl font-bold mb-4 text-teal-300">Download Dataset</h1>
                <div className="mb-4">
                    <label className="mr-4">
                        <input
                            type="radio"
                            name="format"
                            value="classification"
                            checked={format === 'Classification'}
                            onChange={() => setFormat('Classification')}
                            className="mr-2"
                        />
                        Classification Structure
                    </label>
                </div>
                <button 
                    onClick={handleDownload} 
                    className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-all"
                >
                    Export
                </button>
                {isDownloading && (
                    <div className="mt-4">
                        <p>Downloading: {progress}%</p>
                        <progress value={progress} max="100" className="w-full"></progress>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExportDataset;