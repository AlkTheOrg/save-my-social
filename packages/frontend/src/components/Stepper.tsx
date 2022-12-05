import { FC } from "react";
import { combineClassNames } from "../lib/utils";
import "../styles/Stepper.scss";

type Props = {
  steps: string[];
  curStep: number;
};

// a react stepper component
const Stepper: FC<Props> = (props) => {
  const { steps, curStep } = props;
  // const [activeStep, setActiveStep] = useState(curStep); // TODO: use this to animate the stepper

  return (
    <div className="stepper">
      <div className="stepper__container">
        {steps.map((step, index) => (
          <div
            key={step}
            className={combineClassNames([
              "step",
              index < curStep && "completed",
              index === 0 && "first",
              index === steps.length - 1 && "last",
              index === curStep && "active",
              index > curStep && "incompleted",
            ])}
          >
            <div className="step__name">{steps[index]}</div>
          </div>
        ))}
        <div className="step solo">
          {/* this is a solo step to show in responsive view */}
          <div>Step</div>
          <span>{ `${curStep + 1} of ${steps.length}` }</span>
          <div className="step__name">{steps[curStep]}</div>
        </div>
        <div className="stepper__line"></div>
        <div
          className="stepper__line stepper__line--proggress"
          style={{
            width: `${(curStep / (steps.length - 1)) * 100}%`,
          }}
        >
        </div>
      </div>
    </div>
  );
};

export default Stepper;
