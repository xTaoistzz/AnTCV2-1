"use client";
import { useState, useEffect } from "react";
import GuestNav from "./components/navigation/GuestNav";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tag, Upload, Users, Image as ImageIcon } from 'lucide-react';
import Link from "next/link";
import Script from 'next/script';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    { 
      icon: <Tag size={24} />, 
      name: "Versatile Annotation", 
      description: "Support for Classification, Detection, and Segmentation tasks" 
    },
    { 
      icon: <Upload size={24} />, 
      name: "Dataset Import", 
      description: "Easy import of YOLO format datasets" 
    },
    { 
      icon: <Users size={24} />, 
      name: "Collaboration", 
      description: "Share projects and work together on datasets" 
    },
    { 
      icon: <ImageIcon size={24} />, 
      name: "Image Upload", 
      description: "Seamlessly upload images for annotation" 
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 pt-20">
        <GuestNav />
        
        <section className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <motion.div 
              className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0"
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              variants={fadeIn}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="flex justify-center lg:justify-start mb-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image
                  src="/LOGO.png"
                  alt="AnTCV Logo"
                  width={120}
                  height={120}
                  className="drop-shadow-lg"
                />
              </motion.div>
              <h1 className="text-4xl font-extrabold mb-6 text-blue-800 drop-shadow-sm">
                Efficient Image Labelling for AI Datasets
              </h1>
              <p className="text-lg mb-8 text-blue-700">
                Create high-quality datasets for computer vision models with our 
                user-friendly annotation tools. Streamline your AI development process.
              </p>
              <motion.button 
                className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/sign-in">Start Annotating</Link>
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-8 rounded-xl shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-blue-800">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-800">{feature.name}</h3>
                        <p className="text-blue-600 text-sm">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        <footer className="fixed bottom-0 w-full py-4 text-center bg-white bg-opacity-90 shadow-md">
          <p className="text-blue-600">© 2024 AnTCV. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}