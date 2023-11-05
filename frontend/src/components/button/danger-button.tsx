type Props = {
  click: (e: any) => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export default function DangerButton({
  click,
  children,
  className,
  disabled
}: Props) {
  return (
    <button
      className={`${className ?? ''} danger-button rounded-sm border px-4 py-1`}
      onClick={click}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
