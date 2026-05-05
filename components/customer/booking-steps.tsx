import { Check } from "lucide-react";

const steps = ["Film", "Bioskop", "Tanggal", "Jam", "Kursi", "Checkout", "Tiket"];

export function BookingSteps({ current }: { current: number }) {
  return (
    <nav className="booking-steps" aria-label="Alur booking tiket">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isDone = stepNumber < current;
        const isCurrent = stepNumber === current;

        return (
          <span className={isCurrent ? "current" : isDone ? "done" : ""} key={step}>
            <i>{isDone ? <Check size={13} /> : stepNumber}</i>
            <small>{step}</small>
          </span>
        );
      })}
    </nav>
  );
}
