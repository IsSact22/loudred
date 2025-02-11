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
            <h1 className="text-7xl font-bold text-pink-600 flex items-center">
              HOLA 
            </h1>
            <h2 className="text-2xl flex font-semibold text-purple-800 mt-4">
              ¡Somos el equipo <span className="ml-2 mr-2 text-pink-600">C A L I</span> !
            </h2>
            <div className="text-slate-900 mt-3 text-justify">
              <p className="mt-1">
                Somos un equipo de desarrolladores de la Universidad Marítima del Caribe, que venimos trabajando juntos desde que entramos a carrera.
              </p>
              <p className="mt-2">
                Este vendría siendo nuestro segundo proyecto juntos, y en cada uno de nuestros proyectos nos dedicamos a aprender nuevas tecnologías para expandir nuestros conocimientos, siempre apoyándonos entre nosotros y manteniendo una dinámica de trabajo muy amena.
              </p>
              <p className="mt-2">
                Podrá este ser nuestro último proyecto a nivel académico, pero sin duda seguiremos trabajando juntos, ya que a estas alturas, somos un equipo increíble.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default AboutPage;
  
