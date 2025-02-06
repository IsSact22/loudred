"use client";
// Components
import Image from "next/image";



const AboutPage = () => {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ebe2ff] p-6">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center">
        {/* Imagen */}
        <div className="w-full md:w-1/2 flex justify-center">
            <div className="w-64 h-64 rounded-2xl overflow-hidden">
                <Image
                width={1000}
                height={1000}
                src="/assets/about.jpg" 
                alt="Equipo" 
                className="w-full h-full object-cover" />
            </div>
        </div>
          
        {/* Texto */}
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:ml-8 text-center md:text-left">
            <h1 className="text-5xl font-bold text-pink-600 flex items-center">
              HOLA <span className="ml-2 text-yellow-500">🔘</span>
            </h1>
            <h2 className="text-2xl font-semibold text-purple-800 mt-4">
              ¡Somos el equipo tirapeos!
            </h2>
            <p className="text-gray-700 mt-3">
              Somos un equipo de desarrollo de la Universidad Marítima del Caribe, que con cada proyecto la partimos más.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutPage;
  
