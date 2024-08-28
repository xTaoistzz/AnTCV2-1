"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Download, CheckCircle, AlertCircle } from 'lucide-react';

const ExportDataset = () => {
    const { id } = useParams<{ id: string }>();
    const [type, setType] = useState<string | null>(null);
    const [format, setFormat] = useState('YOLO');
    const [progress, setProgress] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [fileUrl, setFileUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });

    useEffect(() => {
        const storedType = localStorage.getItem("Type");
        setType(storedType);
    }, []);

    const handleDownload = async () => {
        if (!id || !type) {
            setStatus({ message: 'Project ID or type is missing', type: 'error' });
            return;
        }

        try {
            setIsDownloading(true);
            setProgress(0);
            setStatus({ message: '', type: null });

            const response = await fetch(`${process.env.ORIGIN_URL}/export/format`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idproject: id, type, format }),
                credentials: "include"
            });

            const data = await response.json();
            if (data.type === 'success') {
                const downloadResponse = await fetch(`${process.env.ORIGIN_URL}/export/format/download`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filePath: data.fileName, idproject: id }),
                    credentials: "include"
                });

                if (!downloadResponse.body) throw new Error('No response body found');

                const reader = downloadResponse.body.getReader();
                const contentLength = +(downloadResponse.headers.get('Content-Length') || '0');
                let receivedLength = 0;
                const chunks = [];

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    receivedLength += value.length;
                    setProgress(Math.floor((receivedLength / contentLength) * 100));
                }

                const blob = new Blob(chunks);
                const url = URL.createObjectURL(blob);
                setFileUrl(url);
                setFileName(data.fileName);
                setStatus({ message: 'Dataset exported successfully!', type: 'success' });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setStatus({ message: error instanceof Error ? error.message : 'An error occurred during export', type: 'error' });
        } finally {
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
            URL.revokeObjectURL(fileUrl);
        }
    }, [fileUrl, fileName]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center content-center py-72"
        >
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
            >
                <h1 className="text-2xl font-bold mb-6 text-blue-800">Export Dataset</h1>
                <div className="mb-6 space-y-3">
                    <p className="text-blue-700 font-semibold">Select Format:</p>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="format"
                                value="YOLO"
                                checked={format === 'YOLO'}
                                onChange={() => setFormat('YOLO')}
                                className="form-radio text-blue-600"
                            />
                            <span className="text-blue-800">YOLO</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="format"
                                value="COCO"
                                checked={format === 'COCO'}
                                onChange={() => setFormat('COCO')}
                                className="form-radio text-blue-600"
                            />
                            <span className="text-blue-800">COCO</span>
                        </label>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg ${
                        isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                    } transition duration-300 flex items-center justify-center`}
                >
                    {isDownloading ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mr-2"
                            >
                                <Download size={20} />
                            </motion.div>
                            Exporting...
                        </>
                    ) : (
                        <>
                            <Download size={20} className="mr-2" />
                            Export Dataset
                        </>
                    )}
                </motion.button>
                {isDownloading && (
                    <div className="mt-4">
                        <div className="flex justify-between mb-1">
                            <span className="text-blue-800">Progress</span>
                            <span className="text-blue-800">{progress}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2.5">
                            <div 
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}
                <AnimatePresence>
                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mt-4 p-3 rounded-lg ${
                                status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            } flex items-center`}
                        >
                            {status.type === 'success' ? (
                                <CheckCircle size={20} className="mr-2" />
                            ) : (
                                <AlertCircle size={20} className="mr-2" />
                            )}
                            {status.message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default ExportDataset;