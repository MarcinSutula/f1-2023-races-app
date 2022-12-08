import { render } from "@testing-library/react";
import MapSpinner from "./MapSpinner";

test("spinner", () => {
  render(<MapSpinner isLoading={false} />);

  expect(true).toBeTruthy();
});
