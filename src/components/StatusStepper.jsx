import { ORDER_STAGES } from "../api";

export default function StatusStepper({ status }) {
  const currentIndex = ORDER_STAGES.findIndex((s) => s.status === status);
  const fillPct = (currentIndex / (ORDER_STAGES.length - 1)) * 100;

  return (
    <div className="stepper">
      <div className="step-bar">
        <div className="step-bar-fill" style={{ width: `${fillPct}%` }} />
      </div>
      <div className="step-nodes">
        {ORDER_STAGES.map((stage, i) => {
          const state =
            i < currentIndex ? "done" : i === currentIndex ? "active" : "pending";
          return (
            <div key={stage.status} className={`step-node ${state}`}>
              <span className="step-dot">{i < currentIndex ? "✓" : ""}</span>
              <span className="step-label">{stage.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
