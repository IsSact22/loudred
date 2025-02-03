import Link from "next/link";
import { NotFoundLoad } from "@/src/animations/NotFoundLoad";

export default function NotFound() {
  return (
    <NotFoundLoad>
      <div className="flex flex-col">
        <h1 className="text-white text-9xl font-bold">404</h1>
        <h2 className="text-white text-2xl font-bold">Página no encontrada</h2>
        <h3 className="text-white text-md font-bold">
          ¿Perdido en el ritmo?
        </h3>
        <Link href="/">
          <div className="mt-4 text-white font-bold hover:scale-105 duration-300">
            Regresar al inicio
          </div>
        </Link>
      </div>
    </NotFoundLoad>
  );
}
