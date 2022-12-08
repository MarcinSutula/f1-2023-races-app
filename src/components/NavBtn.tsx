import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { NavigationMode } from "./NavigationBtnsContainer";

export type NavBtnProps = {
  onClickHandler: (mode: NavigationMode) => Promise<void>;
  disabled: boolean;
  mode: NavigationMode;
  basicColor: string;
  size: number;
};

function NavBtn({
  onClickHandler,
  disabled,
  mode,
  basicColor,
  size,
}: NavBtnProps) {
  return (
    <button onClick={onClickHandler.bind("", mode)} disabled={disabled}>
      {mode === "back" ? (
        <AiOutlineLeft color={disabled ? "grey" : basicColor} fontSize={size} />
      ) : (
        <AiOutlineRight
          color={disabled ? "grey" : basicColor}
          fontSize={size}
        />
      )}
    </button>
  );
}

export default NavBtn;
