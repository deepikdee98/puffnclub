"use client";

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const steps = [
    { number: 1, label: "Bag" },
    { number: 2, label: "Address" },
    { number: 3, label: "Payment" },
  ];

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-center">
        <div className="d-flex align-items-center">
          {steps.map((step, index) => (
            <div key={step.number} className="d-flex align-items-center">
              <div
                className={`step-indicator ${
                  currentStep >= step.number ? "active" : ""
                }`}
              >
                <span>{step.number}</span>
              </div>
              {index < steps.length - 1 && <div className="step-line"></div>}
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex justify-content-center mt-2">
        <div
          className="d-flex"
          style={{ width: "300px", justifyContent: "space-between" }}
        >
          {steps.map((step) => (
            <small
              key={step.number}
              className={currentStep >= step.number ? "fw-bold" : "text-muted"}
            >
              {step.label}
            </small>
          ))}
        </div>
      </div>
      <style jsx>{`
        .step-indicator {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e9ecef;
          color: #6c757d;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        .step-indicator.active {
          background: #000;
          color: white;
        }
        .step-line {
          width: 80px;
          height: 2px;
          background: #e9ecef;
          margin: 0 10px;
        }
      `}</style>
    </div>
  );
}
