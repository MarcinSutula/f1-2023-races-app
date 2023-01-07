import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import NavBtn from "./NavBtn";

describe("NavBtn", () => {
  const onClickMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("displays back button (left icon) when given mode 'back'", () => {
    render(
      <NavBtn
        mode="back"
        disabled={false}
        onClickHandler={onClickMock}
        basicColor="red"
        size={40}
      />
    );
    const iconLeft = screen.getByRole("button", {
      name: "nav-btn-back",
    });
    expect(iconLeft).toBeDefined();
  });
  test("displays next button (left right) when given mode 'next'", () => {
    const onClickMock = jest.fn();

    render(
      <NavBtn
        mode="next"
        disabled={false}
        onClickHandler={onClickMock}
        basicColor="red"
        size={40}
      />
    );
    const iconRight = screen.getByRole("button", {
      name: "nav-btn-next",
    });
    expect(iconRight).toBeDefined();
  });

  test("calls onClickHandler with mode as an argument", () => {
    render(
      <NavBtn
        mode="next"
        disabled={false}
        onClickHandler={onClickMock}
        basicColor="red"
        size={40}
      />
    );
    const btn = screen.getByRole("button");

    fireEvent.click(btn);
    expect(onClickMock).toBeCalledWith("next", expect.anything());
  });

  test("renders disabled button given prop disabled is true", () => {
    render(
      <NavBtn
        mode="next"
        disabled={true}
        onClickHandler={onClickMock}
        basicColor="red"
        size={40}
      />
    );
    const btn = screen.getByRole("button");

    expect(btn).toHaveAttribute("disabled");
  });
});
