import { cx } from 'class-variance-authority'

export default function RecordButton({ recording }: { recording: boolean }) {
  return (
    <span className="relative flex h-4 w-4">
      <span
        className={cx(
          'absolute inline-flex h-full w-full rounded-full  opacity-75 transition-colors',
          recording ? 'animate-ping bg-green-500' : 'bg-red-500',
        )}
      ></span>
      <span
        className={cx(
          'relative inline-flex h-full w-full rounded-full transition-colors',
          recording ? 'bg-green-500' : 'bg-red-500',
        )}
      ></span>
    </span>
  )
}
