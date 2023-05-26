const Spinner = () => (
  <div className="my-6 w-full">
    <svg viewBox="0 0 24 24" className="mx-auto w-16 animate-spin fill-none">
      <circle cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} className="opacity-25" />
      <path
        d="M 22 12 A 10 10 0 0 1 3.81 17.74"
        stroke="currentColor"
        strokeWidth={4}
        className="opacity-75"
      />
    </svg>
  </div>
);

export default Spinner;
