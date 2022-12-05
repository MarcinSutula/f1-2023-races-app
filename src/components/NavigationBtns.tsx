import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";

function NavigationBtns() {
  return (
    <div className="flex justify-end">
      <div className="text-white text-center m-2 p-2">
        <button>
          <AiOutlineLeft color="red" fontSize={40} />
        </button>
        <button>
          <AiOutlineRight color="red" fontSize={40} />
        </button>
      </div>
    </div>
  );
}

export default NavigationBtns;
