import { render } from "@testing-library/react";
import Stepper from "../../components/Stepper";

describe("Stepper", () => {
  it("should render all steps", () => {
    const steps = ["step1", "step2", "step3"];
    const { getAllByText } = render(
      <Stepper curStep={0} steps={steps} />,
    );
    for (let i = 0; i < steps.length; i += 1) {
      expect(getAllByText(steps[i])[0]).toBeInTheDocument();
    }
  });

  it("should mark first step as completed and first", () => {
    const steps = ["step1", "step2", "step3"];
    const { container } = render(<Stepper curStep={1} steps={steps} />);
    const [first, second, last] = container.querySelectorAll(".step");

    expect(first).toHaveClass("step first completed");
    expect(second).toHaveClass("step active");
    expect(last).toHaveClass("step last incompleted");
  });
});
