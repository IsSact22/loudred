export const NotFoundLoad = ({ children }) => {
  return (
    <div className="bg-black flex justify-center items-center min-h-screen gap-10">
      <span className="accessLoader"></span>
      {children}
    </div>
  );
};
