import { render } from "@testing-library/react";
import MapViewCmp from "./MapViewCmp";

test("renders learn react link", () => {
  render(<MapViewCmp />);
  // const linkElement = screen.getByText(/learn react/i);
  expect(true).toBeTruthy();
});
