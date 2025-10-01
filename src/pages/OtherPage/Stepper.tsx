import React from "react";

interface Step {
  number: number;
  label: string;
}

interface StepperProps {
  step: number;
  steps: Step[];
}

const Stepper: React.FC<StepperProps> = ({ step, steps }) => {
  return (
    <div className="w-full flex items-center mb-8">
      {steps.map((s, index) => (
        <React.Fragment key={s.number}>
          {/* Step circle + label */}
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2
              ${
                step === s.number
                  ? "bg-blue-600 text-white border-blue-600"
                  : step > s.number
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-gray-200 text-gray-600 border-gray-300"
              }`}
            >
              {s.number}
            </div>
            <span
              className={`ml-2 font-medium ${
                step === s.number ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {s.label}
            </span>
          </div>

          {/* Connector line (only between steps) */}
          {index !== steps.length - 1 && (
            <div className="flex-1 h-[2px] bg-gray-300 mx-4" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;