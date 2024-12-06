import Link from 'next/link';
import Image from 'next/image';

export default function Navbar({color, shadow}) {
  return (
    <nav className={`absolute w-full flex justify-between items-center p-2 ${color} shadow-lg ${shadow}`}>
      <div className="flex items-center p-2">
        <Image
          src="/assets/loudred-logo3.png"
          alt="Logo"
          width={100}
          height={50}
        />
      </div>
      <ul className="flex space-x-6 list-none">
        <li>
          <Link href="/" className="text-white hover:underline">
            Inicio
          </Link>
        </li>
        <li>
          <Link href="/auth/about" className="text-white hover:underline">
            Acerca de
          </Link>
        </li>
        <li>
          <Link href="/auth/contact" className="text-white hover:underline">
            Contacto
          </Link>
        </li>
        <li>
          <Link href="/auth/register" className="text-white hover:underline">
            Registrarse
          </Link>
        </li>
      </ul>
    </nav>
  );
}