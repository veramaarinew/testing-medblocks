import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from 'react-tooltip';

function ProgressSteps({ steps, currentStep, isStepComplete, onStepClick }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex flex-col items-center relative z-10 ${
              currentStep >= step.id ? "text-blue-600" : "text-gray-400"
            }`}
          >
            <button
              onClick={() => onStepClick(step.id)}
              disabled={!isStepComplete(step.id) && step.id > currentStep}
              data-tooltip-id="step-tooltip"
              data-tooltip-content={`${isStepComplete(step.id) ? "Edit " : ""}${step.title} Information`}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                currentStep >= step.id
                  ? "bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800"
                  : "bg-gray-100 dark:bg-gray-800"
              } ${
                !isStepComplete(step.id) && step.id > currentStep
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              {isStepComplete(step.id) ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </button>
            <div className="text-xs mt-2">{step.title}</div>
          </div>
        ))}
        <div
          className="absolute top-5 left-0 h-0.5 bg-gray-200 dark:bg-gray-700 w-full -z-10"
          style={{
            background: `linear-gradient(to right, #3B82F6 ${
              ((currentStep - 1) / (steps.length - 1)) * 100
            }%, #E5E7EB ${((currentStep - 1) / (steps.length - 1)) * 100}%)`,
          }}
        />
      </div>
      <Tooltip id="step-tooltip" />
    </div>
  );
}

export default ProgressSteps;