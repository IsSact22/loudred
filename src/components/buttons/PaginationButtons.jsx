import { TbChevronRight, TbChevronLeft } from "react-icons/tb";

export const PaginationButtons = ({ goToUrl, pagination }) => {
  // Extraemos links del objeto pagination
  const { links } = pagination;

  return (
    <>
      {(pagination.last_page) > 1 && (links && links.length > 0) ? (
        <div className="flex items-center justify-center gap-1.5 mt-1 mx-2 py-1.5 bg-navy-rgba rounded-lg animate-pulse">
          {links.map((link, index) => {
            // Verificamos si es el botón de "Anterior"
            if (link.label.includes("Anterior")) {
              return (
                <button
                  key={index}
                  onClick={() => goToUrl(link.url)}
                  disabled={!link.url}
                  className={`text-sky-500 ${
                    !link.url ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <TbChevronLeft className="w-5 h-5" />
                </button>
              );
            }
            // Verificamos si es el botón de "Siguiente"
            else if (link.label.includes("Siguiente")) {
              return (
                <button
                  key={index}
                  onClick={() => goToUrl(link.url)}
                  disabled={!link.url}
                  className={`text-sky-500 ${
                    !link.url ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <TbChevronRight className="w-5 h-5" />
                </button>
              );
            }
            // Verificamos si es un separador "..."
            else if (link.label === "...") {
              return (
                <span key={index} className="text-gray-500 px-2">
                  ...
                </span>
              );
            }
            // Si es un número de página
            else {
              const pageNumber = parseInt(link.label);
              if (isNaN(pageNumber)) {
                return null; // Si no es un número, lo omitimos
              }
              return (
                <button
                  key={index}
                  onClick={() => goToUrl(link.url)}
                  className={`w-8 py-0.5 rounded-lg duration-300 ${
                    link.active
                      ? "font-bold text-white bg-sky-500 shadow-center shadow-sky-500/50" // Estilo para la página actual
                      : "font-normal text-sm text-navy bg-white hover:bg-sky-500/50 hover:text-white" // Estilo para otras páginas
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }
          })}
        </div>
      ) : null}
    </>
  );
};
