import { cx } from "class-variance-authority";

export default function RecordButton({ recording }: { recording: boolean }) {
  return (
    <span className="flex h-6 w-6">
      <span
        className={cx(
          " absolute inline-flex h-full w-full rounded-full  opacity-75",
          recording ? "animate-ping bg-green-500" : "bg-red-500",
        )}
      ></span>
      <span
        className={cx(
          "relative inline-flex rounded-full h-6 w-6 bg-red-500",
          recording ? "bg-green-500" : "bg-red-500",
        )}
      ></span>
    </span>
  );
}
