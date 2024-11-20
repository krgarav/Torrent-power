import MoonLoader from "react-spinners/MoonLoader";

function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 10050 }}>
      <MoonLoader
        color="#161515"
        loading={true}
        size={30}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
}

export default Loader;
