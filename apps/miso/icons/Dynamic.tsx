import useRandomKey from 'bento-common/hooks/useRandomKey';

const Dynamic = (props) => {
  /** Filter ids must be unique in order to work. */
  const ranKey = useRandomKey();

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath={`url(#clip0${ranKey})`}>
        <path d="M8 8H6V15C6 16.1 6.9 17 8 17H17V15H8V8Z" fill="#4A5568" />
        <path
          d="M20 3H12C10.9 3 10 3.9 10 5V11C10 12.1 10.9 13 12 13H20C21.1 13 22 12.1 22 11V5C22 3.9 21.1 3 20 3ZM20 11H12V7H20V11Z"
          fill="#4A5568"
        />
        <path d="M4 12H2V19C2 20.1 2.9 21 4 21H13V19H4V12Z" fill="#4A5568" />
      </g>
      <defs>
        <clipPath id={`clip0${ranKey}`}>
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Dynamic;
