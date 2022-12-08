import { render } from "@testing-library/react";
import NavBtn from "./NavBtn";

test("nav btn", () => {
  const mockPromise = (back: any) => {
    return new Promise(back);
  };

  render(
    <NavBtn
      mode="back"
      disabled={false}
      onClickHandler={mockPromise as any}
      basicColor="red"
      size={40}
    />
  );
  // const linkElement = screen.getByText(/learn react/i);
  expect(true).toBeTruthy();
});
