// components/header.js
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav style={navbarStyles}>
      <div style={logoStyles}>
        <Image src="/img/loudredlogo.png" alt="Logo" width={250} height={50} />
      </div>
      <ul style={navLinksStyles}>
        <li>
          <Link href="">Inicio</Link>
        </li>
        <li>
          <Link href="/about">Acerca de</Link>
        </li>
        <li>
          <Link href="/contact">Contacto</Link>
        </li>
        <li>
          <Link href="/login">Iniciar Sesión</Link>
        </li>
      </ul>
    </nav>
  );
}

// Estilos en línea para el Navbar
const navbarStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: '#8A76D0',
};

const logoStyles = {
  display: 'flex',
  alignItems: 'center',
  padding: '1rem 2rem',
};

const navLinksStyles = {
  listStyle: 'none',
  display: 'flex',
  gap: '1.5rem',
};
