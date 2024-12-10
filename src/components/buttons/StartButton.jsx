import { Fragment } from 'react';

const StartButton = ({
  disabled,
  padding = "",
  margin = "",
  onClick = () => {},
  text = "",
  type = "text",
  inputLoading,
}) => (
  <Fragment>
    {!inputLoading ? (
      <button
        className={`${padding} ${margin} w-full bg-red-rusty shadow-lg text-white rounded-full font-bold transition duration-500 hover:scale-105`}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {text}
      </button>
    ) : (
      <button
        className={`${padding} ${margin} flex justify-center gap-2 w-full bg-red-rusty shadow-lg text-white rounded-full font-bold transition duration-500 hover:scale-105`}
      >
        <div className="mt-1 p-1 min-h-full flex items-center justify-center text-center sm:p-0">
          <div className="w-4 h-4 relative bg-gradient-to-r from-blue-950 via-blue-500 via-30% to-blue-200 to-90% rounded-full animate-spin">
            <div className="absolute left-1/2 top-1/2 flex items-center justify-center bg-red-rusty rounded-full transform -translate-x-1/2 -translate-y-1/2 w-3 h-3"></div>
          </div>
        </div>
        {text}
      </button>
    )}
  </Fragment>
);

export default StartButton;