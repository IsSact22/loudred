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
          <Link href="/auth/register" className="p-1.5 bg-lavender text-white rounded-xl duration-300 hover:shadow-lg hover:shadow-white/50">
            Sobre nosotros
          </Link>
        </li>
      </ul>
    </nav>
  );
}