import Link from "next/link";
import { TbEye } from "react-icons/tb";

export const ReceptionButtons = ({ item }) => {
  return (
    <Link
      href={`/importacion/actas-recepcion/detalles/${item.id}`}
      className="text-navy hover:text-navy/70"
      title="Ver Acta"
    >
      <TbEye className="w-5 h-5" />
    </Link>
  );
};
