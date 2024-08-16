"use client";
import GuestNav from "./components/navigation/GuestNav";
import Image from "next/image";

export default function LandingPage() {
  return (
    <main
      className="min-h-svh bg-gradient-to-t from-teal-300 via-blue-300 to-blue-600"
    >
      <GuestNav />

      <section className="flex text-center justify-center items-center mt-20">
        <div className="mx-20">
          <div className="flex flex-col items-center">
            {/* Adding the LOGO.png image above the welcome text */}
            <div className="flex justify-center mb-4">
              <Image
                src="/LOGO.png"
                alt="AnTCV Logo"
                width={100} // Adjust the width as needed
                height={100} // Adjust the height as needed
                className=" drop-shadow-lg"
              />
            </div>
            <div className="text-4xl font-bold"></div>
            <div className="text-4xl font-extrabold mb-4 max-w-3xl text-white drop-shadow-md">
              The Image Annotation Tool for create datasets for computer vision models
            </div>
            <div className="max-w-2xl text-[16px] mb-4 text-center text-white drop-shadow-lg">
            Enhance your computer vision projects with precise image
              annotations. AnTCV offers state-of-the-art tools for bounding box
              detection, polygon segmentation, and more.
            </div>
            {/* <div className="text-[16px] font-light items-center text-center mb-4 max-w-xl">
              Enhance your computer vision projects with precise image
              annotations. AnTCV offers state-of-the-art tools for bounding box
              detection, polygon segmentation, and more.
            </div> */}
            <div className="flex flex-row w-full space-x-5 justify-center">
              <div className="w-40 border p-2 rounded-md space-y-2 bg-white drop-shadow-lg">
                <div>Classification</div>
              </div>
              <div className="w-40 border p-2 rounded-md bg-white drop-shadow-lg">
                <div>Detection</div>
              </div>
              <div className="w-40 border p-2 rounded-md bg-white drop-shadow-lg">
                <div>Segmentation</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border flex-grow">
          <div>Developer</div>
          <div></div>
        </div>
        {/* <div className="flex flex-grow border border-black">Section 2</div> */}
      </section>
      <footer className="bottom-0 fixed w-full py-2 text-center border-t font-light bg-white">
        © 2024 AnTCV. All rights reserved.
      </footer>
    </main>
  );
}
