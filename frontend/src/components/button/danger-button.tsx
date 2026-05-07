type Props = {
  click: () => void
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
      type='button'
      className={`${className ?? ''} danger-button rounded-sm border px-4 py-1`}
      onClick={() => click()}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
