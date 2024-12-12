import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Navbar({ color, color2, shadow, shadow2, imageSrc }) {
  const [currentSrc, setCurrentSrc] = useState('/assets/loudred-logo3.png');
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => {
      setCurrentSrc(imageSrc);
      setFade(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [imageSrc]);

  return (
    <nav
      className={`absolute w-full flex justify-between items-center p-2 ${color} shadow-lg ${shadow} transition-colors ease-in-out duration-500`}
    >
      <div className="flex items-center p-2">
        <Image
          src={currentSrc}
          alt="Logo"
          width={100}
          height={50}
          className={`transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>
      <ul className="flex space-x-6 list-none">
        <li className="duration-300 hover:scale-105 animate-pulse">
          <Link
            href="/auth/register"
            className={`p-1.5 ${color2} text-white rounded-xl shadow-lg ${shadow2} transition-colors ease-in-out duration-500`}
          >
            Sobre nosotros
          </Link>
        </li>
      </ul>
    </nav>
  );
}