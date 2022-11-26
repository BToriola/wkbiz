const ArrowDown = ({ ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      { ...props }
    >
      <g
        id="Group_1152"
        data-name="Group 1152"
        transform="translate(-1619.375 -602.438)"
      >
        <rect
          id="Rectangle_377"
          data-name="Rectangle 377"
          width="30"
          height="30"
          transform="translate(1619.375 602.438)"
          fill="#87AC9B"
        />
        <path
          id="chevron-back"
          d="M12.938,7.875,23.063,18,12.938,28.125"
          transform="translate(1652.375 599.437) rotate(90)"
          fill="none"
          stroke="#648b7a"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.375"
        />
      </g>
    </svg>
  );
};

export default ArrowDown;
