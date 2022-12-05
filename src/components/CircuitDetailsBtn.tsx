function CircuitDetailsBtn() {
  return (
    <div className="text-center">
      <button
        disabled
        onClick={() => {
          console.log("Circut Details Clicked");
        }}
        className="bg-[#ff000038] h-14 text-center w-5/6 text-[#ffffff91] font-bold mt-12"
      >
        Work in progress...
      </button>
    </div>
  );
}

export default CircuitDetailsBtn;
