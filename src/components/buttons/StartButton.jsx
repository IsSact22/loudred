import { Fragment } from 'react';

export const StartButton = ({
  disabled,
  padding = "",
  margin = "",
  onClick = () => {},
  text = "",
  type = "text",
  small = false,
  inputLoading,
}) => (
  <Fragment>
    {!inputLoading ? (
      <button
        className={`${padding} ${margin} w-full bg-gradient-to-r from-crimson-light from-0% via-crimson via-50% to-crimson-dark to-10 0% backdrop-filter backdrop-blur-sm border border-r-0 border-b-0 border-white border-opacity-30 rounded-full shadow-5xl text-white font-bold transition duration-500 hover:scale-105`}
        disabled={disabled}
        onClick={onClick}
        type={type}
      >
        {text}
      </button>
    ) : (
      <button
        className={`${padding} ${margin} flex justify-center gap-2 w-full bg-gradient-to-r from-crimson-light from-0% via-crimson via-45% to-crimson-dark to-90% backdrop-filter backdrop-blur-sm border border-r-0 border-b-0 border-white border-opacity-30 rounded-full shadow-5xl text-white font-bold transition duration-500 hover:scale-105`}
      >
        <div className="p-1 min-h-full flex items-center justify-center text-center sm:p-0">
          <div className="w-4 h-4 relative bg-gradient-to-r from-navy via-navy-light via-30% to-navy-lighter to-90% rounded-full animate-spin">
            <div className="absolute left-1/2 top-1/2 flex items-center justify-center bg-crimson rounded-full transform -translate-x-1/2 -translate-y-1/2 w-3 h-3">
            </div>
          </div>
        </div>
        {text}
      </button>    
    )}
  </Fragment>
);
