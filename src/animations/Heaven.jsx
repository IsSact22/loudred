import "./styles/Heaven.css";

export const Heaven = ({children}) => {
  return (
    <div className="bg-blue-300 flex justify-center items-center text-center min-h-screen">
      <div className="clouds">
        <div className="cloud" style={{ "--i": "1" }}></div>
        <div className="cloud" style={{ "--i": "2" }}></div>
        <div className="cloud" style={{ "--i": "3" }}></div>
        <div className="cloud" style={{ "--i": "4" }}></div>
        <div className="cloud" style={{ "--i": "8" }}></div>
        <div className="cloud" style={{ "--i": "7" }}></div>
        <div className="cloud" style={{ "--i": "6" }}></div>
        <div className="cloud" style={{ "--i": "5" }}></div>
      </div>
      {children}
    </div>
  );
};
