import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-2 bg-purple-600">
      <div className="flex items-center p-2">
        <Image src="/assets/loudred-logo3.png" alt="Logo" width={100} height={50} />
      </div>
      <ul className="flex space-x-6 list-none">
        <li>
          <Link href="" className="text-white hover:underline">Inicio</Link>
        </li>
        <li>
          <Link href="/about" className="text-white hover:underline">Acerca de</Link>
        </li>
        <li>
          <Link href="/contact" className="text-white hover:underline">Contacto</Link>
        </li>
        <li>
          <Link href="/login" className="text-white hover:underline">Iniciar Sesión</Link>
        </li>
      </ul>
    </nav>
  );
}