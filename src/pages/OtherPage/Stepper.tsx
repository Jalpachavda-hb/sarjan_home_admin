
import React from "react";

const Stepper = ({ step }: { step: number }) => {
  const steps = [
    { number: 1, label: "User Information" },
    { number: 2, label: "User Permissions" },
  ];

  return (
    <div className="flex  mb-8 w-fulbkl">
      {steps.map((s, index) => (
        <div key={s.number} className="flex items-center w-full">
          {/* Circle */}
          <div className="flex items-center ">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
              ${
                step === s.number
                  ? "bg-blue-600 text-white border-blue-600"
                  : step > s.number
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-gray-200 text-gray-600 border-gray-300"
              }
              `}
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

          {/* Connector line except for last step */}
          {index !== steps.length - 1 && (
            <div className="flex-1 h-[2px] bg-gray-300 mx-4" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;



