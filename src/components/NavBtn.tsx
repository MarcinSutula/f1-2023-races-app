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
        <div aria-label="nav-btn-back">
          <AiOutlineLeft
            color={disabled ? "grey" : basicColor}
            fontSize={size}
          />
        </div>
      ) : (
        <div aria-label="nav-btn-next">
          <AiOutlineRight
            color={disabled ? "grey" : basicColor}
            fontSize={size}
          />
        </div>
      )}
    </button>
  );
}

export default NavBtn;
