function CircuitDetailsBtn() {
  return (
    <div className="text-center">
      <button
        disabled
        onClick={() => {
          console.log("Circut Details Clicked");
        }}
        className="bg-btnFadedRed h-14 text-center w-5/6 text-textFadedWhite font-bold mt-8"
      >
        Work in progress...
      </button>
    </div>
  );
}

export default CircuitDetailsBtn;
