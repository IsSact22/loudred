// COMPONENTE
/* Botón de Icono */
export const IconButton = ({ icon , className = '', disabled = false, onClick = () => {} }) => (
    <button
        className={`${className} focus:ring-0 focus:outline-none`}
        disabled={disabled}
        onClick={onClick}
        type="button"
    >
        { icon }
    </button>
);
