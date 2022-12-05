import { ThreeCircles } from "react-loader-spinner";

function MapSpinner({isLoading}:{isLoading: boolean}) {
  return (
    <ThreeCircles
      height="100"
      width="100"
      color="#1e90ff"
      wrapperStyle={{
        position: "fixed",
        top: "50%",
        left: "45%",
        transform: "translate(-50%, -50%)",
      }}
      wrapperClass=""
      visible={isLoading}
      ariaLabel="three-circles-rotating"
      outerCircleColor="#00008b"
      innerCircleColor=""
      middleCircleColor="red"
    />
  );
}

export default MapSpinner;
